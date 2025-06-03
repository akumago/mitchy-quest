

import { Player, Enemy, Skill, Item, TargetType, StatBoost, AppliedBuff, SkillType, ElementType, DebuffType, BuffType, AppliedDebuff, SkillDebuff } from '../types';
import { calculateEffectiveStats, createItemInstance } from './gameService'; // Added createItemInstance
import { ALL_SKILLS, ALL_ITEMS } from '../constants'; // Added ALL_ITEMS

export interface ActionResult {
  damageDealt?: number;
  healthRestored?: number;
  mpUsed?: number;
  logMessage: string;
  targetAffected?: Enemy | Player; 
  casterAffected?: Player | Enemy; 
  buffAppliedToPlayer?: AppliedBuff;
  debuffAppliedToEnemy?: AppliedDebuff;
  itemFound?: Item;
  itemStolen?: Item;
}

function applyDamage(target: Player | Enemy, damage: number): number {
  const actualDamage = Math.max(0, damage);
  if ('stats' in target) { 
    target.stats.currentHp = Math.max(0, target.stats.currentHp - actualDamage);
  } else { 
    target.currentHp = Math.max(0, target.currentHp - actualDamage);
  }
  return actualDamage;
}

function applyHeal(target: Player, amount: number, effectiveStats: Required<StatBoost>, isFullRecovery: boolean = false): number {
  if (isFullRecovery) {
    const healAmount = effectiveStats.maxHp - target.currentHp;
    target.currentHp = effectiveStats.maxHp;
    return healAmount;
  }
  const actualHeal = Math.min(amount, effectiveStats.maxHp - target.currentHp);
  target.currentHp += actualHeal;
  return actualHeal;
}

function applyMpRecovery(target: Player, amount: number, effectiveStats: Required<StatBoost>, isFullRecovery: boolean = false): number {
    if (isFullRecovery) {
        const recoverAmount = effectiveStats.maxMp - target.currentMp;
        target.currentMp = effectiveStats.maxMp;
        return recoverAmount;
    }
    const actualRecovery = Math.min(amount, effectiveStats.maxMp - target.currentMp);
    target.currentMp += actualRecovery;
    return actualRecovery;
}

const getElementDisplayName = (element?: ElementType): string => {
  if (!element) return "";
  switch (element) {
    case 'fire': return '炎';
    case 'ice': return '氷';
    case 'dark': return '闇';
    default: return "";
  }
}

const applySkillDebuffsToEnemy = (skill: Skill, enemyTarget: Enemy, results: ActionResult[]) => {
    if (skill.debuffsToTarget) {
        skill.debuffsToTarget.forEach(debuffInfo => {
            if (Math.random() < debuffInfo.chance) {
                // Remove existing debuff of the same type before applying new one
                enemyTarget.activeDebuffs = enemyTarget.activeDebuffs.filter(d => d.type !== debuffInfo.type);
                
                const newDebuff: AppliedDebuff = {
                    skillId: skill.id,
                    type: debuffInfo.type,
                    remainingTurns: debuffInfo.duration,
                    value: debuffInfo.value,
                };
                enemyTarget.activeDebuffs.push(newDebuff);
                results.push({ 
                    logMessage: `しかし ${enemyTarget.name} は ${debuffInfo.type === DebuffType.ACCURACY_DOWN ? "目がくらんだ" : debuffInfo.type === DebuffType.DEFENSE_DOWN ? "守りが弱った" : "動けなくなった"}！`,
                    debuffAppliedToEnemy: newDebuff,
                    targetAffected: JSON.parse(JSON.stringify(enemyTarget))
                });
            }
        });
    }
};

export const processPlayerAction = (
  player: Player, 
  targets: Enemy[], 
  targetIndex: number | null, 
  actionType: 'attack' | 'skill' | 'item',
  actionId?: string 
): ActionResult[] => {
  const results: ActionResult[] = [];
  let playerEffectiveStats = calculateEffectiveStats(player); 

  const selfStunBuff = player.activeBuffs.find(b => b.type === BuffType.SELF_STUN);
  if (selfStunBuff && selfStunBuff.remainingTurns > 0) {
      results.push({ logMessage: `${player.name} は疲れていて動けない！`});
      return results; 
  }

  if (actionType === 'attack') {
    if (targetIndex === null || !targets[targetIndex]) {
      results.push({ logMessage: `${player.name} はこうげきしようとしたが、ターゲットがいなかった！`, damageDealt: 0 });
      return results;
    }
    const targetEnemy = targets[targetIndex];
    if (targetEnemy.stats.currentHp <= 0) {
        results.push({ logMessage: `${targetEnemy.name} はすでにたおれている！` });
        return results;
    }
    const numberOfHits = (player.equipment.weapon?.id === 'i_micchy_buster' || player.equipment.weapon?.id === 'i_micchy_brave') ? 2 : 1;

    for (let i = 0; i < numberOfHits; i++) {
        if (targetEnemy.stats.currentHp <= 0) {
            if (i > 0) results.push({ logMessage: `${targetEnemy.name} はすでにたおれている！`, damageDealt: 0}); 
            break; 
        }
        const enemyEffectiveStats = calculateEffectiveStats(player, targetEnemy); 
        // 攻撃力が防御力以下の場合は、最低1ダメージを保証
        const rawDamage = Math.max(1, playerEffectiveStats.attack - (enemyEffectiveStats.defense || 0));
        let finalDamage = 0;

        const criticalHit = Math.random() < (playerEffectiveStats.critRate || 0);
        const calculatedDamage = criticalHit ? rawDamage * 2.0 : rawDamage;
        finalDamage = Math.max(1, Math.floor(calculatedDamage));
        
        const actualDamage = applyDamage(targetEnemy, finalDamage);
        
        let hitIndicator = numberOfHits > 1 ? `(${i + 1}/${numberOfHits})` : '';
        results.push({
            damageDealt: actualDamage,
            logMessage: `${player.name} の こうげき！${hitIndicator} ${targetEnemy.name} に ${actualDamage} のダメージ！${finalDamage > 0 && Math.random() < (playerEffectiveStats.critRate || 0) && rawDamage > 0 ? ' かいしんのいちげき！' : ''}`,
            targetAffected: JSON.parse(JSON.stringify(targetEnemy)), 
        });

        if (targetEnemy.stats.currentHp <= 0) {
            break; 
        }
    }

  } else if (actionType === 'skill' && actionId) {
    const skill = player.persistentSkills.concat(player.temporarySkills).find(s => s.id === actionId);
    if (!skill) {
      results.push({ logMessage: `とくぎ ${actionId} がみつかりませんでした！` });
      return results;
    }
    if (player.currentMp < skill.mpCost) {
      results.push({ logMessage: `MPがたりない！ ${skill.name} はつかえなかった！` });
      return results;
    }
    
    if (skill.oncePerBattle && player.usedOncePerBattleSkills.includes(skill.id)) {
        results.push({ logMessage: `${skill.name} はこの戦闘ではもう使えない！` });
        return results;
    }

    player.currentMp -= skill.mpCost;
    if (skill.oncePerBattle) {
        player.usedOncePerBattleSkills.push(skill.id);
    }
    playerEffectiveStats = calculateEffectiveStats(player); // Recalculate after MP cost & potential oncePerBattle flag

    let skillTargetEnemy: Enemy | null = (targetIndex !== null && targets[targetIndex]) ? targets[targetIndex] : null;
    if (skill.target === TargetType.SINGLE_ENEMY && skillTargetEnemy && skillTargetEnemy.stats.currentHp <= 0) {
        results.push({ logMessage: `${skillTargetEnemy.name} はすでにたおれている！`, mpUsed: skill.mpCost, casterAffected: JSON.parse(JSON.stringify(player)) });
        return results;
    }


    switch (skill.type) {
      case SkillType.ATTACK:
      case SkillType.MAGIC:
        if (skill.target === TargetType.SINGLE_ENEMY) {
          if (!skillTargetEnemy) {
             results.push({ logMessage: `${skill.name} にはターゲットがひつようだ！`, mpUsed: skill.mpCost, casterAffected: JSON.parse(JSON.stringify(player)) }); return results;
          }
          const enemyEffectiveStats = calculateEffectiveStats(player, skillTargetEnemy); 
          
          let basePowerCheckPassed = false;
          let effectiveSkillDamage = 0;

          if (skill.type === SkillType.MAGIC) {
            // マジックスキルのダメージ計算: スキルのpower + 攻撃力の1/2
            const basePower = skill.power || 1; // デフォルト1
            effectiveSkillDamage = (basePower * 10) + Math.floor(playerEffectiveStats.attack / 2);
            // マジックスキルでも最低1ダメージを保証
            effectiveSkillDamage = Math.max(1, effectiveSkillDamage);
            basePowerCheckPassed = true;
          } else { // ATTACK type skill
            // 物理スキルのダメージ計算: (攻撃力 - 防御力) * スキルのpower
            const baseDamage = Math.max(1, playerEffectiveStats.attack - (enemyEffectiveStats.defense || 0)); // 攻撃力が防御力以下の場合は1を保証
            const basePower = skill.power || 1; // デフォルト1
            effectiveSkillDamage = Math.floor(baseDamage * (basePower * 1.5)); // フォールバックのpowerを1.5倍に
            basePowerCheckPassed = effectiveSkillDamage > 0;
          }
          
          let damageMultiplier = 1;
          let resistanceLog = "";
          if (skill.element && skillTargetEnemy.resistances) {
            const resistance = skillTargetEnemy.resistances[skill.element];
            if (resistance === 'weak') {
              damageMultiplier = 1.5;
              resistanceLog = ` ${skillTargetEnemy.name} は ${getElementDisplayName(skill.element)} がじゃくてんだ！`;
            } else if (resistance === 'resist') {
              damageMultiplier = 0.5;
              resistanceLog = ` ${skillTargetEnemy.name} は ${getElementDisplayName(skill.element)} にたいせいがある！`;
            }
          }
          effectiveSkillDamage *= damageMultiplier;

          let finalDamage = 0;
          if (basePowerCheckPassed || (damageMultiplier > 1 && effectiveSkillDamage > 0) ) { // Damage if base power is enough OR weakness exploited effectively
            finalDamage = Math.max(1, Math.floor(effectiveSkillDamage));
          }
          // If elemental resistance makes effectiveSkillDamage <=0, and basePowerCheck wasn't passed, damage remains 0.
          if (effectiveSkillDamage <=0 && !basePowerCheckPassed) finalDamage = 0;


          const actualDamage = applyDamage(skillTargetEnemy, finalDamage);
          results.push({
            damageDealt: actualDamage,
            logMessage: `${player.name} は ${skill.name} をとなえた！ ${skillTargetEnemy.name} に ${actualDamage} のダメージ！${resistanceLog}`,
            targetAffected: JSON.parse(JSON.stringify(skillTargetEnemy)),
            mpUsed: skill.mpCost, 
            casterAffected: JSON.parse(JSON.stringify(player))
          });

          applySkillDebuffsToEnemy(skill, skillTargetEnemy, results);

          if (skill.drainFactor && skill.drainFactor > 0 && actualDamage > 0) {
            const healAmount = Math.floor(actualDamage * skill.drainFactor);
            if (healAmount > 0) {
              const actualHealFromDrain = applyHeal(player, healAmount, playerEffectiveStats);
              if (actualHealFromDrain > 0) {
                results.push({
                  healthRestored: actualHealFromDrain,
                  logMessage: `${player.name} はHPを ${actualHealFromDrain} 吸収した！`,
                  casterAffected: JSON.parse(JSON.stringify(player))
                });
              }
            }
          }
          if (skill.itemSteal && Math.random() < skill.itemSteal.chance) {
            const stolenItemId = skill.itemSteal.itemPool[Math.floor(Math.random() * skill.itemSteal.itemPool.length)];
            const stolenItemInstance = createItemInstance(stolenItemId);
            if (stolenItemInstance) {
                player.inventory.push(stolenItemInstance);
                results.push({
                    itemStolen: stolenItemInstance,
                    logMessage: `${player.name} は ${skillTargetEnemy.name} から ${stolenItemInstance.name} をぬすんだ！`,
                    casterAffected: JSON.parse(JSON.stringify(player))
                });
            }
          }

        } else if (skill.target === TargetType.ALL_ENEMIES) {
            results.push({ logMessage: `${player.name} は ${skill.name} をとなえた！`, mpUsed: skill.mpCost, casterAffected: JSON.parse(JSON.stringify(player))});
            let totalDamageThisTurnForDrain = 0;

            targets.forEach(enemyTarget => {
                if(enemyTarget.stats.currentHp > 0) {
                    const enemyEffectiveStats = calculateEffectiveStats(player, enemyTarget); 
                    
                    let basePowerCheckPassed = false;
                    let effectiveSkillDamage = 0;

                    if (skill.type === SkillType.MAGIC) {
                        effectiveSkillDamage = (skill.power || 0) + Math.floor(playerEffectiveStats.attack / 4);
                        basePowerCheckPassed = effectiveSkillDamage > 0;
                    } else { // ATTACK type skill
                        effectiveSkillDamage = ((skill.power || 0) * playerEffectiveStats.attack) - (enemyEffectiveStats.defense || 0);
                        basePowerCheckPassed = ((skill.power || 0) * playerEffectiveStats.attack) > (enemyEffectiveStats.defense || 0);
                    }

                    let damageMultiplier = 1;
                    let resistanceLog = "";
                    if (skill.element && enemyTarget.resistances) {
                        const resistance = enemyTarget.resistances[skill.element];
                        if (resistance === 'weak') {
                            damageMultiplier = 1.5;
                            resistanceLog = ` (${getElementDisplayName(skill.element)}弱点)`;
                        } else if (resistance === 'resist') {
                            damageMultiplier = 0.5;
                            resistanceLog = ` (${getElementDisplayName(skill.element)}耐性)`;
                        }
                    }
                    effectiveSkillDamage *= damageMultiplier;

                    let finalDamage = 0;
                    if (basePowerCheckPassed || (damageMultiplier > 1 && effectiveSkillDamage > 0)) {
                        finalDamage = Math.max(1, Math.floor(effectiveSkillDamage));
                    }
                    if (effectiveSkillDamage <=0 && !basePowerCheckPassed) finalDamage = 0;


                    const actualDamage = applyDamage(enemyTarget, finalDamage);
                    results.push({
                        damageDealt: actualDamage,
                        logMessage: `${enemyTarget.name} に ${actualDamage} のダメージ！${resistanceLog}`,
                        targetAffected: JSON.parse(JSON.stringify(enemyTarget)),
                    });
                    applySkillDebuffsToEnemy(skill, enemyTarget, results);
                    if (skill.drainFactor && skill.drainFactor > 0 && actualDamage > 0) {
                        totalDamageThisTurnForDrain += actualDamage;
                    }
                }
            });

            if (skill.drainFactor && skill.drainFactor > 0 && totalDamageThisTurnForDrain > 0) {
                const healAmount = Math.floor(totalDamageThisTurnForDrain * skill.drainFactor);
                if (healAmount > 0) {
                    const actualHealFromDrain = applyHeal(player, healAmount, playerEffectiveStats);
                    if (actualHealFromDrain > 0) {
                        results.push({
                            healthRestored: actualHealFromDrain,
                            logMessage: `${player.name} はHPを ${actualHealFromDrain} 吸収した！`,
                            casterAffected: JSON.parse(JSON.stringify(player))
                        });
                    }
                }
            }
        }
        break;
      case SkillType.HEAL:
        if (skill.target === TargetType.SELF) {
          let actualHeal = 0;
          let healMessage = "";

          if (skill.isFullHpRestore) {
            actualHeal = applyHeal(player, 0, playerEffectiveStats, true);
            healMessage = "HPが かんぜんに かいふくした！";
          } else if (skill.conditionalHpThreshold && skill.targetHpPercentageRestore) {
            if (player.currentHp / playerEffectiveStats.maxHp <= skill.conditionalHpThreshold) {
              actualHeal = applyHeal(player, Math.floor(playerEffectiveStats.maxHp * skill.targetHpPercentageRestore), playerEffectiveStats);
              healMessage = `HPが ${actualHeal} かいふくした！(神編集！)`;
            } else {
              actualHeal = applyHeal(player, skill.healAmount || 0, playerEffectiveStats); // Fallback healAmount if condition not met
              healMessage = `HPが ${actualHeal} かいふくした！(まだ編集の必要はないな...)`;
            }
          } else if (skill.healAmount) {
            actualHeal = applyHeal(player, skill.healAmount, playerEffectiveStats);
            healMessage = `HPが ${actualHeal} かいふくした！`;
          }

          if (skill.isFullMpRestore) {
            const mpRecovered = applyMpRecovery(player, 0, playerEffectiveStats, true);
            results.push({ mpUsed: -mpRecovered, logMessage: "MPが かんぜんに かいふくした！", casterAffected: JSON.parse(JSON.stringify(player)) });
          }
          
          results.push({
            healthRestored: actualHeal,
            logMessage: `${player.name} は ${skill.name} をつかった！ ${healMessage}`,
            casterAffected: JSON.parse(JSON.stringify(player)),
            mpUsed: skill.mpCost 
          });

          if (skill.itemFind && Math.random() < skill.itemFind.chance) {
            const foundItemInstance = createItemInstance(skill.itemFind.itemId);
            if (foundItemInstance) {
                player.inventory.push(foundItemInstance);
                 results.push({
                    itemFound: foundItemInstance,
                    logMessage: `なんと ${player.name} は ${foundItemInstance.name} をみつけた！`,
                    casterAffected: JSON.parse(JSON.stringify(player))
                });
            }
          }
        }
        break;
      case SkillType.BUFF:
      case SkillType.DEFEND:
        if (skill.target === TargetType.SELF) {
            let buffTypeToApply: BuffType | null = null;
            let buffValue: number | undefined = undefined;
            let buffDuration = skill.duration || 1;
            let isHpRegenPercent = false;

            if (skill.id === 's_enjo_kaihi_move' && skill.selfEvadeTurns) {
                buffTypeToApply = BuffType.EVADE_ALL;
                buffDuration = skill.selfEvadeTurns;
            } else if (skill.id === 's_asmr_regen' && skill.hpRegenPerTurnPercent && skill.regenDuration) {
                buffTypeToApply = BuffType.HP_REGENERATION;
                buffValue = Math.floor(playerEffectiveStats.maxHp * skill.hpRegenPerTurnPercent); // Calculate actual HP per turn
                isHpRegenPercent = true; // Flag it as percentage based if needed later, though value is now absolute
                buffDuration = skill.regenDuration;
            } else if (skill.statBoost) { 
                 if (skill.statBoost.attack) { buffTypeToApply = BuffType.ATTACK_UP; buffValue = skill.statBoost.attack; }
                 else if (skill.statBoost.defense) { buffTypeToApply = BuffType.DEFENSE_UP; buffValue = skill.statBoost.defense; }
            }
            
            if (buffTypeToApply) {
                player.activeBuffs = player.activeBuffs.filter(b => b.type !== buffTypeToApply); 
                const newBuff: AppliedBuff = { 
                    skillId: skill.id, 
                    type: buffTypeToApply, 
                    remainingTurns: buffDuration, 
                    value: buffValue,
                    ...(buffTypeToApply === BuffType.HP_REGENERATION && { hpPerTurn: buffValue, isHpRegenPercent: isHpRegenPercent }) // Add regen specific props
                };
                if (buffTypeToApply === BuffType.DEFENSE_UP && skill.id === 's_defend') { 
                     newBuff.originalDefense = playerEffectiveStats.defense / (buffValue || 1); 
                }

                player.activeBuffs.push(newBuff);
                results.push({
                    logMessage: `${player.name} は ${skill.name} をつかった！`,
                    casterAffected: JSON.parse(JSON.stringify(player)),
                    buffAppliedToPlayer: newBuff, 
                    mpUsed: skill.mpCost 
                });
            } else {
                 results.push({ logMessage: `${player.name} は ${skill.name} をつかったが、効果がなかった！`, mpUsed: skill.mpCost, casterAffected: JSON.parse(JSON.stringify(player)) });
            }
        }
        break;
    }
    if (skill.selfStunTurns && skill.selfStunTurns > 0) {
        player.activeBuffs = player.activeBuffs.filter(b => b.type !== BuffType.SELF_STUN); 
        const stunBuff: AppliedBuff = { skillId: skill.id, type: BuffType.SELF_STUN, remainingTurns: skill.selfStunTurns + 1 }; 
        player.activeBuffs.push(stunBuff);
        results.push({ 
            logMessage: `${player.name} はつかれはててしまった！`, 
            buffAppliedToPlayer: stunBuff, 
            casterAffected: JSON.parse(JSON.stringify(player))
        });
    }

  } else if (actionType === 'item' && actionId) {
    const itemIndex = player.inventory.findIndex(i => i.id === actionId); 
    if (itemIndex === -1) { 
       const itemByBaseIdIndex = player.inventory.findIndex(i => i.id === actionId);
       if (itemByBaseIdIndex === -1) {
          results.push({ logMessage: `どうぐ ${actionId} はもっていなかった！` }); return results;
       }
    }

    const firstInstanceOfItemIndex = player.inventory.findIndex(i => i.id === actionId);
    if (firstInstanceOfItemIndex === -1) {
       results.push({ logMessage: `どうぐ ${actionId} はもっていなかった！` }); return results;
    }
    const item = player.inventory[firstInstanceOfItemIndex];
    
    player.inventory.splice(firstInstanceOfItemIndex, 1); 
    results.push({logMessage: `${player.name} は ${item.name} をつかった！`, casterAffected: JSON.parse(JSON.stringify(player)) }); 

    if (item.isFullHpRecovery) {
        const actualHeal = applyHeal(player, 0, playerEffectiveStats, true);
        results.push({ healthRestored: actualHeal, logMessage: `HPが かんぜんに かいふくした！`, casterAffected: JSON.parse(JSON.stringify(player)) });
    } else if (item.hpRecovery) {
      const actualHeal = applyHeal(player, item.hpRecovery, playerEffectiveStats); 
      results.push({ healthRestored: actualHeal, logMessage: `HPが ${actualHeal} かいふくした！`, casterAffected: JSON.parse(JSON.stringify(player)) }); 
    }

    if (item.isFullMpRecovery) {
        const mpRecovered = applyMpRecovery(player, 0, playerEffectiveStats, true);
        results.push({ mpUsed: -mpRecovered, logMessage: `MPが かんぜんに かいふくした！`, casterAffected: JSON.parse(JSON.stringify(player)) });
    } else if (item.mpRecovery) {
      const mpRecovered = applyMpRecovery(player, item.mpRecovery, playerEffectiveStats);
      results.push({ mpUsed: -mpRecovered, logMessage: `MPが ${mpRecovered} かいふくした！`, casterAffected: JSON.parse(JSON.stringify(player)) }); 
    }
  }
  return results;
};

export const processEnemyAction = (
  enemy: Enemy,
  player: Player 
): ActionResult[] => {
  const results: ActionResult[] = [];
  const playerEffectiveStats = calculateEffectiveStats(player); 
  
  const stunDebuff = enemy.activeDebuffs.find(d => d.type === DebuffType.STUN);
  if (stunDebuff && stunDebuff.remainingTurns > 0) {
      results.push({ logMessage: `${enemy.name} はしびれてうごけない！` });
      return results;
  }

  const playerEvadeBuff = player.activeBuffs.find(b => b.type === BuffType.EVADE_ALL);
  if (playerEvadeBuff && playerEvadeBuff.remainingTurns > 0) {
    // Check if the enemy skill is single target vs all_enemies
    // For simplicity, assume normal attacks are evaded. If it's an AoE skill, it might still hit.
    // This part needs refinement if EVADE_ALL should only evade single-target attacks.
    // For now, let's assume it evades all direct actions if it's a simple attack.
    // If the enemy chooses a skill, that skill's target type would matter.
    
    // Let's assume for now if EVADE_ALL is active, basic attacks miss. Skill logic will be separate.
    const chosenSkill = enemy.skills.length > 0 && Math.random() < 0.5 
                      ? enemy.skills.filter(s => s.mpCost <= enemy.stats.currentMp)[Math.floor(Math.random() * enemy.skills.filter(s => s.mpCost <= enemy.stats.currentMp).length)]
                      : null;

    if (!chosenSkill || chosenSkill.target === TargetType.SINGLE_ENEMY) { // Evade normal attacks and single-target skills
        results.push({ logMessage: `${enemy.name} のこうげき！しかし ${player.name} はするりとかわした！`});
        return results;
    }
    // If it's an AoE skill, it might still proceed despite EVADE_ALL.
  }


  const usableSkills = enemy.skills.filter(s => s.mpCost <= enemy.stats.currentMp);
  const useSkill = usableSkills.length > 0 && Math.random() < 0.5; 

  let missChance = 0;
  const accuracyDebuff = enemy.activeDebuffs.find(d => d.type === DebuffType.ACCURACY_DOWN);
  if (accuracyDebuff && accuracyDebuff.value) {
      missChance = accuracyDebuff.value; 
  }
  if (Math.random() < missChance) {
      results.push({logMessage: `${enemy.name} のこうげき！しかし あたらなかった！`});
      return results;
  }


  if (useSkill && usableSkills.length > 0) {
    const skillToUse = usableSkills[Math.floor(Math.random() * usableSkills.length)];
    enemy.stats.currentMp = Math.max(0, enemy.stats.currentMp - skillToUse.mpCost);
    const enemyEffectiveStats = calculateEffectiveStats(player, enemy); 

    // Enemy using skill on player
    if (skillToUse.target === TargetType.ALL_ENEMIES || skillToUse.target === TargetType.SINGLE_ENEMY) { // Enemy skills target player(s)
        let basePowerCheckPassed = false;
        let effectiveSkillDamage = 0;

        if (skillToUse.type === SkillType.MAGIC) {
            effectiveSkillDamage = (skillToUse.power || 0) + Math.floor(enemyEffectiveStats.attack / 3);
            basePowerCheckPassed = effectiveSkillDamage > 0;
        } else { // ATTACK type skill
            effectiveSkillDamage = ((skillToUse.power || 0) * enemyEffectiveStats.attack) - playerEffectiveStats.defense;
            basePowerCheckPassed = ((skillToUse.power || 0) * enemyEffectiveStats.attack) > playerEffectiveStats.defense;
        }

        let damageMultiplier = 1; // For player's elemental weaknesses/resistances if applicable, not implemented for player resistances yet
        // Placeholder for future player elemental resistance logic:
        // if (skillToUse.element && player.resistances && player.resistances[skillToUse.element] === 'weak') damageMultiplier = 1.5;
        // if (skillToUse.element && player.resistances && player.resistances[skillToUse.element] === 'resist') damageMultiplier = 0.5;
        
        effectiveSkillDamage *= damageMultiplier;
        
        let finalDamage = 0;
        if (basePowerCheckPassed || (damageMultiplier > 1 && effectiveSkillDamage > 0) ) {
             finalDamage = Math.max(1, Math.floor(effectiveSkillDamage));
        }
        if (effectiveSkillDamage <=0 && !basePowerCheckPassed) finalDamage = 0;
        
        // If EVADE_ALL is active and skill is single target, it's already handled.
        // If skill is AoE, EVADE_ALL doesn't prevent it here.
        if (playerEvadeBuff && playerEvadeBuff.remainingTurns > 0 && skillToUse.target === TargetType.SINGLE_ENEMY) {
             results.push({ logMessage: `${enemy.name} は ${skillToUse.name} をつかってきた！しかし ${player.name} はするりとかわした！` });
        } else {
            const actualDamage = applyDamage(player, finalDamage);
            results.push({
              damageDealt: actualDamage,
              logMessage: `${enemy.name} は ${skillToUse.name} をつかってきた！ ${player.name} は ${actualDamage} のダメージ！`,
              targetAffected: JSON.parse(JSON.stringify(player)), 
            });
        }

    } else { // Skill is self-buff or other non-damaging to player
         results.push({ logMessage: `${enemy.name} は ${skillToUse.name} をつかった！` });
    }
  } else { 
    const enemyEffectiveStats = calculateEffectiveStats(player, enemy); 
    const rawDamage = enemyEffectiveStats.attack - playerEffectiveStats.defense;
    let finalDamage = 0;
    if (rawDamage > 0) {
        // Enemy critical hit can be added here if desired:
        // const criticalHit = Math.random() < (enemyEffectiveStats.critRate || 0);
        // const calculatedDamage = criticalHit ? rawDamage * 1.5 : rawDamage;
        finalDamage = Math.max(1, Math.floor(rawDamage)); // Simplified: no crit for enemy basic attack
    }
    
    const actualDamage = applyDamage(player, finalDamage);
    results.push({
      damageDealt: actualDamage,
      logMessage: `${enemy.name} の こうげき！ ${player.name} は ${actualDamage} のダメージ！`,
      targetAffected: JSON.parse(JSON.stringify(player)), 
    });
  }
  return results;
};

export const updateActiveEffects = (target: Player | Enemy): { expiredEffectMessages: string[] } => {
  const expiredEffectMessages: string[] = [];
  const playerEffectiveStats = 'baseStats' in target ? calculateEffectiveStats(target) : null; // For regen calc

  if ('activeBuffs' in target && Array.isArray(target.activeBuffs)) { // Player buffs
    const newActiveBuffs: AppliedBuff[] = [];
    for (const buff of target.activeBuffs) {
      
      if (buff.type === BuffType.HP_REGENERATION && buff.hpPerTurn && playerEffectiveStats) {
        const regenAmount = buff.isHpRegenPercent && buff.hpPerTurn 
                            ? Math.floor(playerEffectiveStats.maxHp * buff.hpPerTurn) // hpPerTurn stored as percentage (e.g. 0.08)
                            : buff.hpPerTurn; // hpPerTurn stored as flat value
        if (regenAmount && regenAmount > 0 && target.currentHp < playerEffectiveStats.maxHp && target.currentHp > 0) {
             const actualRegen = applyHeal(target, regenAmount, playerEffectiveStats);
             if (actualRegen > 0) {
                expiredEffectMessages.push(`${target.name} はHPが ${actualRegen} かいふくした。(リジェネ)`);
             }
        }
      }
      
      buff.remainingTurns -= 1;
      if (buff.remainingTurns > 0) {
        newActiveBuffs.push(buff);
      } else {
        const skillName = ALL_SKILLS[buff.skillId]?.name || 'なにかのこうか';
         let effectDisplayName = skillName;
         if (buff.type === BuffType.HP_REGENERATION) effectDisplayName = "HPじどうかいふく";
         else if (buff.type === BuffType.EVADE_ALL) effectDisplayName = "炎上回避ムーブ";
         else if (buff.type === BuffType.SELF_STUN) effectDisplayName = "疲労";
        expiredEffectMessages.push(`${target.name} の ${effectDisplayName} のこうかがきれた。`);
      }
    }
    target.activeBuffs = newActiveBuffs; 
  }
  
  if ('activeDebuffs' in target && Array.isArray(target.activeDebuffs)) { // Enemy debuffs
    const newActiveDebuffs: AppliedDebuff[] = [];
    for (const debuff of target.activeDebuffs) {
      debuff.remainingTurns -= 1;
      if (debuff.remainingTurns > 0) {
        newActiveDebuffs.push(debuff);
      } else {
         const skillName = ALL_SKILLS[debuff.skillId]?.name || 'なにかのこうか';
         let effectName = "";
         switch(debuff.type) {
            case DebuffType.ACCURACY_DOWN: effectName = "めつぶし"; break;
            case DebuffType.DEFENSE_DOWN: effectName = "しゅび力低下"; break;
            case DebuffType.STUN: effectName = "しびれ"; break;
            default: effectName = "じゃくたいこうか";
         }
        expiredEffectMessages.push(`${target.name} の ${effectName} がなおった。`);
      }
    }
    target.activeDebuffs = newActiveDebuffs;
  }
  return { expiredEffectMessages };
};
