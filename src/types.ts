

export enum PlayerClass {
  HERO = "ゆうしゃ",
  // WARRIOR = "せんし", // Removed
  // MAGE = "まほうつかい", // Removed
  // PRIEST = "そうりょ", // Removed
}

export enum SkillType {
  ATTACK = "こうげき",
  MAGIC = "じゅもん",
  HEAL = "かいふく",
  BUFF = "ほじょ",
  DEFEND = "ぼうぎょ",
}

export enum TargetType {
  SELF = "じぶん",
  SINGLE_ENEMY = "てきたんたい",
  ALL_ENEMIES = "てきぜんたい",
  SINGLE_ALLY = "みかたたんたい", 
}

export interface StatBoost {
  maxHp?: number;
  maxMp?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  critRate?: number; // 0-1, e.g., 0.05 for 5%
}

export type ElementType = 'fire' | 'ice' | 'dark';

export enum BuffType {
  ATTACK_UP = "attack_up",
  DEFENSE_UP = "defense_up",
  EVADE_ALL = "evade_all", // Player evades all attacks
  SELF_STUN = "self_stun", // Player is stunned
  HP_REGENERATION = "hp_regeneration", // HP regeneration over time
}

export enum DebuffType {
  ACCURACY_DOWN = "accuracy_down",
  DEFENSE_DOWN = "defense_down",
  STUN = "stun", // Enemy is stunned
}

export interface SkillDebuff {
  type: DebuffType;
  chance: number; // 0-1
  duration: number; // in turns
  value?: number; // e.g., 0.25 for 25% accuracy reduction, or flat defense reduction amount
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  description: string;
  mpCost: number;
  power?: number; 
  healAmount?: number; 
  statBoost?: StatBoost; 
  target: TargetType;
  duration?: number; 
  unlockLevel?: number; 
  element?: ElementType; 
  drainFactor?: number; 

  // New properties for Mitchy's special skills
  debuffsToTarget?: SkillDebuff[];
  selfStunTurns?: number;    // For 案件動画ラッシュ
  selfEvadeTurns?: number;   // For 炎上回避ムーブ
  itemFind?: { itemId: string; chance: number }; // For 90円メンバーシップの祈り
  itemSteal?: { itemPool: string[]; chance: number }; // For 開封の儀RTA

  // Properties for new healing skills
  conditionalHpThreshold?: number; // For 再編集で神編集！ (e.g., 0.25 for 25%)
  targetHpPercentageRestore?: number; // For 再編集で神編集！ (e.g., 0.7 for 70%)
  hpRegenPerTurnPercent?: number; // For 飯テロASMR (e.g., 0.08 for 8% of MaxHP)
  regenDuration?: number; // For 飯テロASMR (duration in turns)
  isFullHpRestore?: boolean; // For 決死のバックアップ復元
  isFullMpRestore?: boolean; // For 決死のバックアップ復元
  oncePerBattle?: boolean; // For 決死のバックアップ復元
}

export interface Item {
  id: string; 
  name: string;
  type: "ぶき" | "よろい" | "たて" | "どうぐ" | "ふくびきけん";
  description: string;
  price: number;
  attackBoost?: number;
  defenseBoost?: number;
  hpRecovery?: number;
  mpRecovery?: number;
  isFullHpRecovery?: boolean; 
  isFullMpRecovery?: boolean; 
  isEquippable: boolean;
  isKeyItem?: boolean; 
  enhancementLevel?: number; 
  instanceId?: string; 
}

export interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  shield: Item | null;
}

export interface WisdomFragment {
  id: string;
  text: string;
  category: string; 
  hint: string; 
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: { text: string; id: string }[]; 
  correctOptionId: string; 
  explanation: string;
}

export interface AppliedBuff {
  skillId: string; // Skill that applied this
  type: BuffType; // Type of buff
  remainingTurns: number;
  value?: number; // e.g., for attack_up amount, or defense multiplier
  originalDefense?: number; // For s_defend to correctly restore
  hpPerTurn?: number; // For HP_REGENERATION buff: amount to heal each turn
  isHpRegenPercent?: boolean; // True if hpPerTurn is a percentage of MaxHP
}

export interface Player {
  name: string;
  playerClass: PlayerClass;
  level: number;
  experience: number;
  gold: number;
  
  baseStats: {
    maxHp: number;
    maxMp: number;
    attack: number;
    defense: number;
    speed: number;
    critRate: number;
  };
  currentHp: number;
  currentMp: number;

  equipment: Equipment;
  inventory: Item[]; 
  
  persistentSkills: Skill[]; 
  collectedWisdomIds: string[]; 
  
  temporarySkills: Skill[];
  temporaryStatBoosts: StatBoost; 
  activeBuffs: AppliedBuff[]; 
  usedOncePerBattleSkills: string[]; // Tracks skills used once per battle
}

export interface Region {
  id: string;
  name: string;
  description: string;
  encounters: string[][]; 
  bossId: string; 
  shopInventoryIds: string[]; 
  gachaPrizeIds: string[];
  isUnlocked: boolean;
  isCleared: boolean; 
  battleBackgroundUrl?: string; 
  bossUnlockLevel?: number;
  unlockPlayerLevel?: number; 
}

export interface CurrentRun {
  player: Player; 
  currentRegionId: string;
  currentEncounterIndex: number; 
  xpGainedThisRun: number;
  goldGainedThisRun: number;
}