import React, { useState, useCallback } from 'react';
import { Player, PlayerClass, StatBoost, Item, Equipment, Region, CurrentRun, QuizQuestion, AppliedBuff, DebuffType, BuffType } from './types';

interface AppProps {
  className?: string;
}

// Define GamePhase locally since it's not exported from types.ts
enum GamePhase {
  TITLE = 'TITLE',
  NEW_GAME = 'NEW_GAME',
  CONTINUE = 'CONTINUE',
  CHARACTER_CREATION = 'CHARACTER_CREATION',
  MAP = 'MAP',
  SHOP = 'SHOP',
  GACHA = 'GACHA',
  BATTLE = 'BATTLE',
  QUIZ = 'QUIZ',
  ENDING = 'ENDING',
  CREDITS = 'CREDITS'
}

export const App: React.FC<AppProps> = ({ className = '' }) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.TITLE);
  const [player, setPlayer] = useState<Player>({
    name: '',
    playerClass: PlayerClass.HERO,
    level: 1,
    experience: 0,
    gold: 0,
    baseStats: {
      maxHp: 100,
      maxMp: 10,
      attack: 10,
      defense: 5,
      speed: 5,
      critRate: 5
    },
    currentHp: 100,
    currentMp: 10,
    equipment: {
      weapon: null,
      armor: null,
      shield: null
    },
    inventory: [],
    persistentSkills: [],
    collectedWisdomIds: [],
    temporarySkills: [],
    temporaryStatBoosts: {},
    activeBuffs: [],
    usedOncePerBattleSkills: []
  const [regions, setRegions] = useState<Record<string, Region>>(() => JSON.parse(JSON.stringify(REGIONS)));
  const [currentRun, setCurrentRun] = useState<CurrentRun | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isTitleMusicPlaying, setIsTitleMusicPlaying] = useState(false);
  const [wisdomFragments, setWisdomFragments] = useState<Record<string, boolean>>(() => {
    const initialFragments: Record<string, boolean> = {};
    ALL_WISDOM_FRAGMENTS.forEach((fragment: { id: string }) => {
      initialFragments[fragment.id] = false;
    });
    return initialFragments;
  });

  const renderGamePhase = useCallback(() => {
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GamePhase, Player, PlayerClass, SkillCardOption, StatBoost, Item, Equipment, Region, CurrentRun, Enemy, QuizQuestion, AppliedBuff, DebuffType, BuffType } from './types';
import { TitleScreen } from './components/TitleScreen';
import { NameInputScreen } from './components/NameInputScreen';
import { WorldMapScreen } from './components/WorldMapScreen';
import { BattleScreen } from './components/BattleScreen';
import { SkillCardSelectionScreen } from './components/SkillCardSelectionScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { StatusScreen } from './components/StatusScreen';
import { ShopScreen } from './components/ShopScreen';
import { GachaScreen } from './components/GachaScreen';
import { PasswordManagementScreen } from './components/PasswordManagementScreen';
import { WisdomBagScreen } from './components/WisdomBagScreen';
import { MitchyQuizScreen } from './components/MitchyQuizScreen';
import { Modal } from './components/Modal';
import { FinalBossPreDialogueScreen } from './components/FinalBossPreDialogueScreen';
import { EndingMessageScreen } from './components/EndingMessageScreen';
import { CreditsRollScreen } from './components/CreditsRollScreen';
import { 
    createInitialPlayer, saveGame, loadGame, deleteSave, 
    checkLevelUp, calculateEffectiveStats, getEnemiesForEncounter, 
    generatePassword, createItemInstance, getDisplayItemName,
    collectWisdomFragment 
} from './services/gameService';
import { 
    MAX_PLAYER_NAME_LENGTH, DEFAULT_PLAYER_NAME, REGIONS, ALL_ITEMS, XP_FOR_LEVEL, 
    PLAYER_CLASSES, STAT_INCREASE_PER_LEVEL, ALL_SKILLS, ALL_ENEMIES,
    MAX_ENHANCEMENT_LEVEL,
    WEAPON_ENHANCEMENT_ATTACK_BONUS_PER_LEVEL,
    ARMOR_ENHANCEMENT_DEFENSE_BONUS_PER_LEVEL,
    SHIELD_ENHANCEMENT_DEFENSE_BONUS_PER_LEVEL,
    ALL_WISDOM_FRAGMENTS, WISDOM_COLLECTION_REWARDS,
    ALL_MITCHY_QUIZZES_SET1, ALL_MITCHY_QUIZZES_SET2, ALL_MITCHY_QUIZZES_SET3, 
    QUIZ_SET1_COMPLETION_FLAG_ID, QUIZ_SET2_COMPLETION_FLAG_ID, QUIZ_SET3_COMPLETION_FLAG_ID, 
    QUIZ_MIN_CORRECT_FOR_REWARD, QUIZ_SET_IDENTIFIERS 
} from './constants';
import { playSfx, SFX_FILES, ensureAudioContext, BGM_FILES, getMasterBgmVolume } from './services/audioService';
import { updateActiveEffects } from './services/combatService';

interface AppProps {
  className?: string;
}

interface Region {
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

interface CurrentRun {
  player: Player;
  currentRegionId: string;
  currentEncounterIndex: number;
  xpGainedThisRun: number;
  goldGainedThisRun: number;
}

interface ScreenProps {
  onNext?: () => void;
  onBack?: () => void;
  player: Player;
  regions: Record<string, Region>;
  currentRun: CurrentRun | null;
  gamePhase: GamePhase;
  setGamePhase: (phase: GamePhase) => void;
  setPlayer: (player: Player) => void;
  setRegions: (regions: Record<string, Region>) => void;
  setCurrentRun: (run: CurrentRun | null) => void;
  modalMessage: string | null;
  setModalMessage: (message: string | null) => void;
  wisdomFragments: Record<string, boolean>;
  setWisdomFragments: (fragments: Record<string, boolean>) => void;
}

export const App: React.FC<AppProps> = ({ className = '' }) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.TITLE);
  const [player, setPlayer] = useState<Player>(createInitialPlayer());
  const [regions, setRegions] = useState<Record<string, Region>>({
    'region1': {
      id: 'region1',
      name: '初心の森',
      description: '冒険の始まりの地',
      enemies: ['スライム', 'ゴブリン']
    }
  });
  const [currentRun, setCurrentRun] = useState<CurrentRun | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [wisdomFragments, setWisdomFragments] = useState<Record<string, boolean>>(() => {
    const initialFragments: Record<string, boolean> = {};
    ['fragment1', 'fragment2', 'fragment3'].forEach((fragmentId) => {
      initialFragments[fragmentId] = false;
    });
    return initialFragments;
  });

  const handleAttemptRegionSelect = useCallback((regionId: string) => {
    const region = regions[regionId];
    if (region) {
      const newRun: CurrentRun = {
        regionId,
        regionName: region.name,
        enemies: [] // 実際の敵データを取得する関数を実装する必要があります
      };
      setCurrentRun(newRun);
      setGamePhase(GamePhase.PREPARATION);
    }
  }, [regions]);

  const handleBattleEnd = useCallback((win: boolean, xpGained: number, goldGained: number) => {
    if (win) {
      const updatedPlayer = { ...player };
      updatedPlayer.gold += goldGained;
      
      updatedPlayer.experience += xpGained;
      const newLevel = Math.floor(updatedPlayer.experience / 100) + 1; // 簡易的なレベルアップ計算
      if (newLevel > updatedPlayer.level) {
        updatedPlayer.level = newLevel;
        updatedPlayer.baseStats.maxHp += 10;
        updatedPlayer.baseStats.maxMp += 5;
        updatedPlayer.baseStats.attack += 2;
        updatedPlayer.baseStats.defense += 2;
        updatedPlayer.baseStats.speed += 1;
        updatedPlayer.baseStats.critRate += 0.5;
        
        updatedPlayer.currentHp = updatedPlayer.baseStats.maxHp;
        updatedPlayer.currentMp = updatedPlayer.baseStats.maxMp;
      }
      
      setPlayer(updatedPlayer);
      setGamePhase(GamePhase.WORLD_MAP);
    } else {
      setGamePhase(GamePhase.GAME_OVER);
    }
  }, [player]);

  const handleSkillCardSelect = useCallback((card: SkillCardOption) => {
    const updatedPlayer = { ...player };
    updatedPlayer.persistentSkills.push(card);
    setPlayer(updatedPlayer);
    setGamePhase(GamePhase.WORLD_MAP);
  }, [player]);

  const handlePurchaseItem = useCallback((itemBase: Item) => {
    const updatedPlayer = { ...player };
    const item = createItemInstance(itemBase);
    updatedPlayer.inventory.push(item);
    updatedPlayer.gold -= itemBase.price;
    setPlayer(updatedPlayer);
  }, [player]);

  const handleSellItem = useCallback((itemToSell: Item, indexInInventory?: number) => {
    const updatedPlayer = { ...player };
    if (indexInInventory !== undefined) {
      updatedPlayer.inventory.splice(indexInInventory, 1);
    }
    updatedPlayer.gold += Math.floor(itemToSell.base.price * 0.8); // 80%で売却
    setPlayer(updatedPlayer);
  }, [player]);

  const handleUseGacha = useCallback((cost: number, prizeBase: Item) => {
    const updatedPlayer = { ...player };
    updatedPlayer.gold -= cost;
    const prize = createItemInstance(prizeBase);
    updatedPlayer.inventory.push(prize);
    setPlayer(updatedPlayer);
  }, [player]);

  const handleGameOverContinue = useCallback(() => {
    setPlayer(createInitialPlayer());
    setGamePhase(GamePhase.TITLE);
  }, []);

  const handlePasswordSave = useCallback((password: string) => {
    saveGame(password, player, regions);
    setModalMessage('セーブが完了しました！');
  }, [player, regions]);

  const handlePasswordLoad = useCallback((password: string) => {
    try {
      const loadedData = loadGame(password);
      if (loadedData) {
        setPlayer(loadedData.player);
        setRegions(loadedData.regions);
        setGamePhase(GamePhase.WORLD_MAP);
      } else {
        setModalMessage('パスワードが見つかりませんでした');
      }
    } catch (error) {
      setModalMessage('パスワードの読み込みに失敗しました');
    }
  }, []);

  const handleQuizComplete = useCallback((correctAnswers: number, totalQuestions: number) => {
    if (correctAnswers >= QUIZ_MIN_CORRECT_FOR_REWARD) {
      const updatedPlayer = { ...player };
      // 報酬の処理
      updatedPlayer.gold += 100;
      setPlayer(updatedPlayer);
      setGamePhase(GamePhase.WORLD_MAP);
    } else {
      setGamePhase(GamePhase.WORLD_MAP);
    }
  }, [player]);

  const handleFinalBossDialogueComplete = useCallback(() => {
    setGamePhase(GamePhase.BATTLE);
  }, []);

  const handleEndingProceedToCredits = useCallback(() => {
    setGamePhase(GamePhase.CREDITS_ROLL);
  }, []);

  const handleCreditsEnd = useCallback(() => {
    setGamePhase(GamePhase.TITLE);
  }, []);

  const renderGamePhase = useCallback(() => {
    switch (gamePhase) {
      case GamePhase.TITLE:
        return <TitleScreen onNext={() => setGamePhase(GamePhase.NAME_INPUT)} />;
      case GamePhase.NAME_INPUT:
        return (
          <NameInputScreen
            onNext={(name: string) => {
              const updatedPlayer = createInitialPlayer();
              updatedPlayer.name = name;
              setPlayer(updatedPlayer);
              setGamePhase(GamePhase.WORLD_MAP);
            }}
          />
        );
      case GamePhase.WORLD_MAP:
        return <WorldMapScreen player={player} regions={regions} onRegionSelect={handleAttemptRegionSelect} />;
      case GamePhase.PREPARATION:
        return <PreparationScreen player={player} regions={regions} currentRun={currentRun} />;
      case GamePhase.BATTLE:
        return <BattleScreen player={player} enemies={getEnemiesForEncounter(currentRun!)} onBattleEnd={handleBattleEnd} />;
      case GamePhase.BATTLE_REWARD_SKILL_CARD:
        return <SkillCardSelectionScreen player={player} onSkillCardSelect={handleSkillCardSelect} />;
      case GamePhase.SHOP:
        return <ShopScreen player={player} regions={regions} currentRun={currentRun} onPurchase={handlePurchaseItem} onSell={handleSellItem} />;
      case GamePhase.GACHA:
        return <GachaScreen player={player} onGacha={handleUseGacha} />;
      case GamePhase.STATUS_SCREEN:
        return <StatusScreen player={player} />;
      case GamePhase.GAME_OVER:
        return <GameOverScreen onContinue={handleGameOverContinue} />;
      case GamePhase.PASSWORD_SAVE:
        return <PasswordManagementScreen mode="save" player={player} regions={regions} onSave={handlePasswordSave} />;
      case GamePhase.PASSWORD_LOAD:
        return <PasswordManagementScreen mode="load" onLoad={handlePasswordLoad} />;
      case GamePhase.WISDOM_BAG:
        return <WisdomBagScreen player={player} wisdomFragments={wisdomFragments} />;
      case GamePhase.MITCHY_QUIZ:
        return <MitchyQuizScreen player={player} onNext={handleQuizComplete} />;
      case GamePhase.FINAL_BOSS_PRE_DIALOGUE:
        return <FinalBossPreDialogueScreen onNext={handleFinalBossDialogueComplete} />;
      case GamePhase.ENDING_MESSAGE:
        return <EndingMessageScreen onNext={handleEndingProceedToCredits} />;
      case GamePhase.CREDITS_ROLL:
        return <CreditsRollScreen onEnd={handleCreditsEnd} />;
      default:
        return <div>Unknown phase</div>;
    }
  }, [gamePhase, player, regions, currentRun, wisdomFragments]);

  useEffect(() => {
    handleStartTitleMusic();
    return () => {
      handleStopTitleMusic();
    };
  }, [handleStartTitleMusic, handleStopTitleMusic]);

  return (
    <div id="app-container" className={`h-full w-full bg-black text-white font-dq flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <div
        id="game-viewport"
        className="w-full h-full max-w-[405px] max-h-[720px] aspect-[9/16] bg-blue-950 shadow-2xl border-4 border-blue-800 rounded-lg relative transition-all duration-300 ease-in-out overflow-hidden"
      >
        {renderGamePhase()}
      </div>
      {modalMessage && (
        <Modal isOpen={!!modalMessage} onClose={() => setModalMessage(null)} title="メッセージ">
          <p className="text-shadow-dq whitespace-pre-wrap">{modalMessage}</p>
        </Modal>
      )}
    </div>
  );
};

// ... 既存の関数定義をここに 
  const [regions, setRegions] = useState<Record<string, Region>>(() => JSON.parse(JSON.stringify(REGIONS))); 
  const [currentRun, setCurrentRun] = useState<CurrentRun | null>(null);
  
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [currentShopRegionId, setCurrentShopRegionId] = useState<string | null>(null);
  const [currentGachaRegionId, setCurrentGachaRegionId] = useState<string | null>(null);
  const [isSfxEnabled, setIsSfxEnabled] = useState(false);

  const [showBossConfirmationModal, setShowBossConfirmationModal] = useState(false);
  const [pendingRegionSelection, setPendingRegionSelection] = useState<string | null>(null);

  const titleAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isTitleMusicPlaying, setIsTitleMusicPlaying] = useState(false);

  const battleBgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentBattleBgmUrlRef = useRef<string | null>(null);
  const endingBgmAudioRef = useRef<HTMLAudioElement | null>(null);


  const [generatedDebugPassword, setGeneratedDebugPassword] = useState<string | null>(null);
  const [showDebugPasswordModal, setShowDebugPasswordModal] = useState(false);
  const [currentQuizParams, setCurrentQuizParams] = useState<CurrentQuizParams | null>(null);


  const checkForWisdomRewards = useCallback((currentPlayer: Player) => {
    WISDOM_COLLECTION_REWARDS.forEach(reward => {
      const currentCollectedIds = currentPlayer.collectedWisdomIds || [];
      const nonRewardFlagsCount = currentCollectedIds.filter(id => !id.startsWith("wisdom_reward_") && !id.startsWith("quiz_set") ).length;


      if (nonRewardFlagsCount >= reward.count) {
        const rewardFlagId = `wisdom_reward_${reward.count}_claimed`;
        if (!currentCollectedIds.includes(rewardFlagId)) {
          let message = reward.message;
          if (reward.items) {
            reward.items.forEach(rewardItem => {
              for (let i = 0; i < rewardItem.quantity; i++) {
                const itemInstance = createItemInstance(rewardItem.itemId);
                if (itemInstance) {
                  currentPlayer.inventory.push(itemInstance);
                }
              }
            });
          }
          if (!currentPlayer.collectedWisdomIds) {
            currentPlayer.collectedWisdomIds = [];
          }
          currentPlayer.collectedWisdomIds.push(rewardFlagId);
          setModalMessage(prev => prev ? `${prev}\n\n${message}` : message);
        }
      }
    });
    return currentPlayer; 
  }, []);

  const tryCollectWisdomFragment = useCallback((fragmentId: string, triggerPlayer: Player | null = player) => {
    if (!triggerPlayer) return;
    setPlayer(prevPlayer => {
      if (!prevPlayer) return prevPlayer;
      const playerCopy = { ...prevPlayer };
      if (!playerCopy.collectedWisdomIds) {
        playerCopy.collectedWisdomIds = [];
      }
      const { collectedNew, fragmentText } = collectWisdomFragment(playerCopy, fragmentId);
      if (collectedNew && fragmentText) {
        setModalMessage(prev => prev ? `${prev}\n\n【ミッチーの知恵を発見！】\n${fragmentText}` : `【ミッチーの知恵を発見！】\n${fragmentText}`);
        return checkForWisdomRewards(playerCopy);
      }
      return playerCopy; 
    });
  }, [player, checkForWisdomRewards]);


  useEffect(() => {
    const { player: loadedPlayer, regions: loadedRegions } = loadGame();
    if (loadedPlayer) {
      setPlayer(loadedPlayer);
      setRegions(loadedRegions); 
    } else {
      setRegions(loadedRegions); 
    }
  }, []);

  useEffect(() => {
    if (player && 
        gamePhase !== GamePhase.BATTLE && 
        gamePhase !== GamePhase.BATTLE_REWARD_SKILL_CARD &&
        gamePhase !== GamePhase.BOSS_CONFIRMATION && 
        gamePhase !== GamePhase.FINAL_BOSS_PRE_DIALOGUE &&
        gamePhase !== GamePhase.ENDING_MESSAGE && 
        gamePhase !== GamePhase.CREDITS_ROLL &&   
        currentRun === null 
    ) {
      saveGame(player, regions);
    }
  }, [player, gamePhase, currentRun, regions]);

  useEffect(() => { 
    if (player && player.level === 5) {
      tryCollectWisdomFragment('wf_level_5_reached');
    }
  }, [player, tryCollectWisdomFragment]);

  const startNewGameFlow = () => {
    handleStopTitleMusic();
    setPlayer(null); 
    const initialRegionsFromConstants = JSON.parse(JSON.stringify(REGIONS));
    setRegions(initialRegionsFromConstants); 
    setGamePhase(GamePhase.NAME_INPUT);
  };

  const continueGameFlow = () => {
    handleStopTitleMusic();
    if (player) {
      setGamePhase(GamePhase.WORLD_MAP);
    } else {
      setModalMessage("セーブデータがみつかりませんでした。はじめからスタートします。");
      startNewGameFlow();
    }
  };

  const handleNameSet = (name: string) => {
    const playerName = name.trim() || DEFAULT_PLAYER_NAME;
    const newPlayer = createInitialPlayer(playerName); // Class is now defaulted in createInitialPlayer
    setPlayer(newPlayer);
    handleSetGamePhase(GamePhase.WORLD_MAP); // Go directly to World Map
  };

  const handleStopTitleMusic = useCallback(() => {
    if (titleAudioRef.current) {
      titleAudioRef.current.pause();
      titleAudioRef.current.src = ''; 
      titleAudioRef.current.load(); // Explicitly tell the browser to release resources
      titleAudioRef.current = null; 
    }
    setIsTitleMusicPlaying(false);
  }, []);

  const handleStopBattleMusic = useCallback(() => {
    if (battleBgmAudioRef.current) {
      battleBgmAudioRef.current.pause();
      battleBgmAudioRef.current.src = '';
      battleBgmAudioRef.current.load();
      battleBgmAudioRef.current = null;
      currentBattleBgmUrlRef.current = null;
    }
  }, []);

  const handleStopEndingMusic = useCallback(() => {
    if (endingBgmAudioRef.current) {
        endingBgmAudioRef.current.pause();
        endingBgmAudioRef.current.src = '';
        endingBgmAudioRef.current.load();
        endingBgmAudioRef.current = null;
    }
  }, []);
  
  const handleSetGamePhase = useCallback((phase: GamePhase, associatedData?: string) => {
    if (phase !== GamePhase.BATTLE && phase !== GamePhase.BATTLE_REWARD_SKILL_CARD) {
      handleStopBattleMusic();
    }
    if (phase !== GamePhase.TITLE && 
        (phase === GamePhase.NAME_INPUT || phase === GamePhase.WORLD_MAP || phase === GamePhase.BATTLE || phase === GamePhase.FINAL_BOSS_PRE_DIALOGUE || phase === GamePhase.ENDING_MESSAGE || phase === GamePhase.CREDITS_ROLL) ) { 
        handleStopTitleMusic();
    }
    if (phase !== GamePhase.CREDITS_ROLL) {
        handleStopEndingMusic();
    }

    if (phase === GamePhase.SHOP) {
        const targetRegionId = associatedData || Object.keys(regions).find(rId => regions[rId].isUnlocked && regions[rId].shopInventoryIds && regions[rId].shopInventoryIds.length > 0) || 'r_starting_plains';
        setCurrentShopRegionId(targetRegionId);
    } else if (phase === GamePhase.GACHA) {
        const targetRegionId = associatedData || Object.keys(regions).find(rId => regions[rId].isUnlocked && regions[rId].gachaPrizeIds && regions[rId].gachaPrizeIds.length > 0) || 'r_starting_plains';
        setCurrentGachaRegionId(targetRegionId);
    } else if (phase === GamePhase.MITCHY_QUIZ && associatedData) {
        let params: CurrentQuizParams | null = null;
        switch (associatedData) {
            case QUIZ_SET_IDENTIFIERS.SET1:
                params = { questions: ALL_MITCHY_QUIZZES_SET1, completionFlagId: QUIZ_SET1_COMPLETION_FLAG_ID, wisdomFragmentForRewardId: "wf_quiz_master_set1" };
                break;
            case QUIZ_SET_IDENTIFIERS.SET2:
                params = { questions: ALL_MITCHY_QUIZZES_SET2, completionFlagId: QUIZ_SET2_COMPLETION_FLAG_ID, wisdomFragmentForRewardId: "wf_quiz_master_set2" };
                break;
            case QUIZ_SET_IDENTIFIERS.SET3:
                params = { questions: ALL_MITCHY_QUIZZES_SET3, completionFlagId: QUIZ_SET3_COMPLETION_FLAG_ID, wisdomFragmentForRewardId: "wf_quiz_master_set3" };
                break;
        }
        if (params) {
            setCurrentQuizParams(params);
        } else {
            setModalMessage("指定されたクイズセットが見つかりませんでした。");
            return; 
        }
    }
    setGamePhase(phase);
  }, [regions, handleStopTitleMusic, handleStopBattleMusic, handleStopEndingMusic]); 

  useEffect(() => {
    if (gamePhase === GamePhase.BATTLE && currentRun) { 
      const region = regions[currentRun.currentRegionId];
      if (!region) {
        console.error("App: Battle BGM - Region not found for currentRun.currentRegionId:", currentRun.currentRegionId);
        return;
      }

      const enemies = getEnemiesForEncounter(region, currentRun.currentEncounterIndex);
      const isBossEncounter = enemies.length === 1 && (
        enemies[0].id === ALL_ENEMIES.e_micchy_final_boss.id ||
        enemies[0].id === ALL_ENEMIES.e_micchy_sexy_knight_boss.id ||
        enemies[0].id === ALL_ENEMIES.e_micchy_baroku_saburou_boss.id ||
        enemies[0].id === ALL_ENEMIES.e_senden_biker_boss.id ||
        enemies[0].id === ALL_ENEMIES.e_orc_boss.id
      );
      const targetBgmUrl = isBossEncounter ? BGM_FILES.BATTLE_BOSS : BGM_FILES.BATTLE_NORMAL;

      console.log("App: Determining Battle BGM. URL from BGM_FILES:", targetBgmUrl, "Is Boss:", isBossEncounter);
      console.log("App: BGM_FILES object:", BGM_FILES);


      if (!targetBgmUrl || typeof targetBgmUrl !== 'string' || !targetBgmUrl.startsWith("https://raw.githubusercontent.com/")) {
        const debugMsg = `戦闘BGMのURLが不正です。\n期待されたURLプレフィックス: https://raw.githubusercontent.com/\n実際のURL: ${targetBgmUrl}\n(デバッグ情報) isBossEncounter: ${isBossEncounter}\nBGM_FILES.BATTLE_BOSS: ${BGM_FILES.BATTLE_BOSS}\nBGM_FILES.BATTLE_NORMAL: ${BGM_FILES.BATTLE_NORMAL}`;
        console.error("App: Battle BGM - Invalid URL before new Audio(). Details:", {
            targetBgmUrl,
            isBossEncounter,
            BGMBoss: BGM_FILES.BATTLE_BOSS,
            BGMNormal: BGM_FILES.BATTLE_NORMAL
        });
        setModalMessage(debugMsg);
        if (battleBgmAudioRef.current) {
            battleBgmAudioRef.current.pause();
            battleBgmAudioRef.current.src = '';
            battleBgmAudioRef.current.load();
            battleBgmAudioRef.current = null; 
            currentBattleBgmUrlRef.current = null;
        }
        return; 
      }
  
      if (battleBgmAudioRef.current === null || currentBattleBgmUrlRef.current !== targetBgmUrl) {
        if (battleBgmAudioRef.current) {
          battleBgmAudioRef.current.pause();
          battleBgmAudioRef.current.src = '';
          battleBgmAudioRef.current.load();
        }
        console.log("App: Creating new Audio for Battle BGM. URL:", targetBgmUrl);
        const audio = new Audio(targetBgmUrl);
        audio.crossOrigin = "anonymous";
        audio.loop = true;
        audio.volume = getMasterBgmVolume();
        audio.onerror = () => {
            let errorDetail = '不明なメディアエラー';
            if (audio.error) {
                errorDetail = `${getMediaErrorMessage(audio.error.code)}${audio.error.message ? ` (${audio.error.message})` : ''}`;
                console.error(`App: Battle BGM onerror. Code: ${audio.error.code}, Message: ${audio.error.message || 'N/A'}, URL: ${audio.src} (Attempted URL: ${targetBgmUrl})`);
            } else {
                 console.error(`App: Battle BGM onerror. No MediaError object. URL: ${audio.src} (Attempted URL: ${targetBgmUrl})`);
            }
            setModalMessage(`戦闘BGMの読み込みに失敗しました。\nURL(試行): ${targetBgmUrl}\nURL(エラー時): ${audio.src}\n詳細: ${errorDetail}`);
            if (battleBgmAudioRef.current === audio) {
                 battleBgmAudioRef.current = null;
                 currentBattleBgmUrlRef.current = null;
            }
        };
        battleBgmAudioRef.current = audio;
        currentBattleBgmUrlRef.current = targetBgmUrl;
      }
      if (battleBgmAudioRef.current && battleBgmAudioRef.current.paused) {
         battleBgmAudioRef.current.play().catch(e => console.warn("App: Battle BGM play error:", e, "URL:", battleBgmAudioRef.current?.src));
      }
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, currentRun, regions]); 
  
  useEffect(() => {
    return () => {
      handleStopTitleMusic();
      handleStopBattleMusic();
      handleStopEndingMusic();
    };
  }, [handleStopTitleMusic, handleStopBattleMusic, handleStopEndingMusic]);

  const handlePlayTitleMusicRequest = useCallback(async () => {
    console.log("App: handlePlayTitleMusicRequest called.");
    console.log("App: BGM_FILES object:", BGM_FILES);
    console.log("App: BGM_FILES.TITLE before validation:", BGM_FILES.TITLE);

    const audioSystemReady = await ensureAudioContext();
    setIsSfxEnabled(audioSystemReady);
    console.log("App: ensureAudioContext result:", audioSystemReady, "isSfxEnabled set to:", audioSystemReady);

    if (!audioSystemReady) {
      console.error("App: AudioContext could not be activated by user gesture. BGM cannot play.");
      setModalMessage("オーディオシステムの起動に失敗しました。音楽を再生できません。");
      setIsTitleMusicPlaying(false);
      return;
    }

    if (titleAudioRef.current) {
      console.log("App: Pausing and resetting existing titleAudioRef.");
      titleAudioRef.current.pause();
      titleAudioRef.current.removeAttribute('src');
      titleAudioRef.current.load(); 
      titleAudioRef.current = null; 
    }
    
    const titleBgmUrl = BGM_FILES.TITLE;
    if (!titleBgmUrl || typeof titleBgmUrl !== 'string' || !titleBgmUrl.startsWith("https://raw.githubusercontent.com/")) {
        const debugMsg = `タイトルBGMのURLが不正です。\n期待されたURLプレフィックス: https://raw.githubusercontent.com/\n実際のURL: ${titleBgmUrl}\n(BGM_FILES.TITLEの実際の値: ${BGM_FILES.TITLE})`;
        console.error("App: Title BGM - Invalid URL before new Audio(). URL:", titleBgmUrl, "BGM_FILES.TITLE:", BGM_FILES.TITLE);
        setModalMessage(debugMsg);
        setIsTitleMusicPlaying(false);
        return;
    }

    console.log("App: Creating new Audio for title BGM:", titleBgmUrl);
    const audio = new Audio(titleBgmUrl);
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    audio.volume = getMasterBgmVolume();

    audio.onerror = () => {
      let errorDetail = '不明なメディアエラー';
      if (audio.error) {
        errorDetail = `${getMediaErrorMessage(audio.error.code)}${audio.error.message ? ` (${audio.error.message})` : ''}`;
        console.error(`App: Title BGM onerror. Code: ${audio.error.code}, Message: ${audio.error.message || 'N/A'}, URL: ${audio.src} (Attempted URL: ${titleBgmUrl})`);
      } else {
        console.error(`App: Title BGM onerror. No MediaError object. URL: ${audio.src} (Attempted URL: ${titleBgmUrl})`);
      }
      
      setModalMessage(`タイトルBGMの読み込みに失敗しました。\nURL(試行): ${titleBgmUrl}\nURL(エラー時): ${audio.src}\nファイルが存在するか、インターネット接続、ブラウザの拡張機能等を確認してください。\n詳細: ${errorDetail}`);
      setIsTitleMusicPlaying(false);
      if (titleAudioRef.current === audio) {
          titleAudioRef.current = null;
      }
    };
    audio.oncanplaythrough = () => console.log("App: Title BGM can play through. Source:", audio.src);
    audio.onstalled = () => console.warn("App: Title BGM stalled. Source:", audio.src);
    audio.onsuspend = () => console.warn("App: Title BGM suspended. Source:", audio.src);
    
    titleAudioRef.current = audio;

    try {
      console.log("App: Attempting to play title BGM. URL:", titleAudioRef.current.src);
      await titleAudioRef.current.play();
      setIsTitleMusicPlaying(true);
      console.log("App: Title BGM playback initiated successfully.");
    } catch (error) {
      let playErrorMsg = error instanceof Error ? error.message : String(error);
      console.error("App: Title BGM play() promise rejected:", playErrorMsg, "URL:", titleAudioRef.current?.src);
      setModalMessage(`タイトルBGMの再生に失敗しました。\nブラウザが自動再生をブロックしたか、ファイル読み込みに問題がある可能性があります。\nエラー詳細: ${playErrorMsg}`);
      setIsTitleMusicPlaying(false);
      if (titleAudioRef.current === audio) { // Check if it's the same instance that failed
          titleAudioRef.current = null;
      }
    }
  }, []);


  const initiateRegionRun = (regionId: string) => {
    if (!player) return;
    const selectedRegion = regions[regionId];
    if (!selectedRegion || !selectedRegion.isUnlocked) return;
    
    const runPlayerSnapshot: Player = JSON.parse(JSON.stringify(player));
    runPlayerSnapshot.temporarySkills = [];
    runPlayerSnapshot.temporaryStatBoosts = {};
    runPlayerSnapshot.activeBuffs = [];
    runPlayerSnapshot.usedOncePerBattleSkills = []; 
    const effectiveStats = calculateEffectiveStats(runPlayerSnapshot);
    runPlayerSnapshot.currentHp = effectiveStats.maxHp;
    runPlayerSnapshot.currentMp = effectiveStats.maxMp;

    setCurrentRun({
      player: runPlayerSnapshot,
      currentRegionId: regionId,
      currentEncounterIndex: 0,
      xpGainedThisRun: 0,
      goldGainedThisRun: 0,
    });
    handleSetGamePhase(GamePhase.BATTLE); 
  };

  const handleAttemptRegionSelect = (regionId: string) => {
    const selectedRegion = regions[regionId];
    if (!selectedRegion || !player) return;

    if (selectedRegion.unlockPlayerLevel && player.level < selectedRegion.unlockPlayerLevel) {
        setModalMessage(`この地域に入るにはレベル${selectedRegion.unlockPlayerLevel}が必要です。`);
        return;
    }

    if (regionId === REGIONS.r_micchy_castle.id) {
      const requiredKeyIds = [
        ALL_ITEMS.i_key_fragment_forest.id,
        ALL_ITEMS.i_key_fragment_cave.id,
        ALL_ITEMS.i_key_fragment_tower.id,
      ];
      const possessedKeyItems = player.inventory.filter(item => item.isKeyItem && requiredKeyIds.includes(item.id));
      const allKeysPossessed = possessedKeyItems.length === requiredKeyIds.length;

      if (!allKeysPossessed) {
        const possessedKeyNames = possessedKeyItems.map(item => item.name);
        const missingKeyNames = requiredKeyIds
          .filter(keyId => !possessedKeyItems.some(item => item.id === keyId))
          .map(keyId => ALL_ITEMS[keyId]?.name || "なぞの破片");
        
        let message = "ミッチー大魔王の強大な気配は感じるが、まだ道は閉ざされているようだ…\n\n";
        if (possessedKeyNames.length > 0) {
          message += "あつめた破片:\n  " + possessedKeyNames.join("\n  ") + "\n\n";
        }
        if (missingKeyNames.length > 0) {
          message += "たりない破片:\n  " + missingKeyNames.join("\n  ") + "\n";
        }
        setModalMessage(message);
        return; 
      }
      setPendingRegionSelection(regionId);
      handleSetGamePhase(GamePhase.FINAL_BOSS_PRE_DIALOGUE);
      return;
    }

    const isBossFirstRegion = selectedRegion.encounters.length === 0 && selectedRegion.bossId;
    if (isBossFirstRegion) {
      if (selectedRegion.bossUnlockLevel && player.level < selectedRegion.bossUnlockLevel) {
          setModalMessage(`この地域のボスに挑戦するにはレベル${selectedRegion.bossUnlockLevel}が必要です。`);
          return;
      }
      setPendingRegionSelection(regionId);
      setShowBossConfirmationModal(true);
      handleSetGamePhase(GamePhase.BOSS_CONFIRMATION); 
    } else {
      initiateRegionRun(regionId);
    }
  };
  
  const updateCurrentRunPlayerState = useCallback((updatedRunPlayer: Player) => {
    setCurrentRun(prevRun => {
      if (!prevRun) return prevRun;
      return { ...prevRun, player: updatedRunPlayer };
    });
  }, []);

  const handleBattleEnd = (win: boolean, xpGained: number, goldGained: number) => {
    if (!currentRun || !player) return;

    const runPlayerEndState = currentRun.player; 
    const currentRegion = regions[currentRun.currentRegionId]; 

    const defeatedBossId = (win && currentRun.currentEncounterIndex === currentRegion.encounters.length) 
                           ? currentRegion.bossId 
                           : null;

    let newKeyFragmentMessage: string | null = null;
    if (win) {
        const currentRegionDef = REGIONS[currentRun.currentRegionId];
        let droppedFragmentId: string | null = null;

        if (currentRegionDef.bossId === ALL_ENEMIES.e_micchy_sexy_knight_boss.id && !player.inventory.some(item => item.id === ALL_ITEMS.i_key_fragment_forest.id)) {
            if (Math.random() < 0.5) droppedFragmentId = ALL_ITEMS.i_key_fragment_forest.id;
        } else if (currentRegionDef.bossId === ALL_ENEMIES.e_micchy_baroku_saburou_boss.id && !player.inventory.some(item => item.id === ALL_ITEMS.i_key_fragment_cave.id)) {
            if (Math.random() < 0.5) droppedFragmentId = ALL_ITEMS.i_key_fragment_cave.id;
        } else if (currentRegionDef.bossId === ALL_ENEMIES.e_senden_biker_boss.id && !player.inventory.some(item => item.id === ALL_ITEMS.i_key_fragment_tower.id)) {
            if (Math.random() < 0.5) droppedFragmentId = ALL_ITEMS.i_key_fragment_tower.id;
        }
        
        if (droppedFragmentId) {
            const fragmentItemBase = ALL_ITEMS[droppedFragmentId];
            if (fragmentItemBase) {
                const fragmentItemInstance = createItemInstance(fragmentItemBase.id);
                if (fragmentItemInstance){
                    setPlayer(prevPlayer_1 => {
                        if(!prevPlayer_1) return null;
                        return { ...prevPlayer_1, inventory: [...prevPlayer_1.inventory, fragmentItemInstance] };
                    });
                    newKeyFragmentMessage = `「${fragmentItemInstance.name}」をてにいれた！`;
                }
            }
        }
    }

    if (isSfxEnabled) {
        if (win) {
            playSfx(SFX_FILES.VICTORY);
        } else {
            playSfx(SFX_FILES.GAME_OVER);
        }
    }
    
    let playerAfterBattleUpdate: Player | null = null;
    setPlayer(prevPlayer => {
      if (!prevPlayer) return null; 
      let updatedPersistentPlayer = { ...prevPlayer };
      
      updatedPersistentPlayer.experience += xpGained;
      updatedPersistentPlayer.gold += goldGained;
      
      if (win && runPlayerEndState.currentHp > 0) {
         const persistentEffectiveStats = calculateEffectiveStats(updatedPersistentPlayer);
         updatedPersistentPlayer.currentHp = Math.min(runPlayerEndState.currentHp, persistentEffectiveStats.maxHp);
         updatedPersistentPlayer.currentMp = Math.min(runPlayerEndState.currentMp, persistentEffectiveStats.maxMp);
      }
      
      const { expiredEffectMessages } = updateActiveEffects(updatedPersistentPlayer);
      if (expiredEffectMessages.length > 0) {
           setModalMessage(prev => prev ? `${prev}\n\n${expiredEffectMessages.join('\n')}` : expiredEffectMessages.join('\n'));
      }


      const { leveledUp, newSkills } = checkLevelUp(updatedPersistentPlayer);
      if (leveledUp) {
        if (isSfxEnabled) playSfx(SFX_FILES.LEVEL_UP);
        let levelUpMsg = `レベル ${updatedPersistentPlayer.level} にあがった！`;
        if (newSkills.length > 0) {
          levelUpMsg += ` あたらしいとくぎ: ${newSkills.map(s => s.name).join('、')} をおぼえた！`;
        }
        setModalMessage(levelUpMsg);
      }
      
      if (defeatedBossId === ALL_ENEMIES.e_orc_boss.id) {
        tryCollectWisdomFragment('wf_boss_orc_defeat', updatedPersistentPlayer);
      }
      
      updatedPersistentPlayer = checkForWisdomRewards(updatedPersistentPlayer);

      playerAfterBattleUpdate = updatedPersistentPlayer; 
      return updatedPersistentPlayer;
    });
    
    setCurrentRun(prevRun => {
        if(!prevRun) return null;
        return {
            ...prevRun,
            xpGainedThisRun: prevRun.xpGainedThisRun + xpGained,
            goldGainedThisRun: prevRun.goldGainedThisRun + goldGained,
        };
    });

    if (win) {
      const nextEncounterIndex = currentRun.currentEncounterIndex + 1;

      if (nextEncounterIndex > currentRegion.encounters.length) { 
        let clearMessage = `${currentRegion.name} をクリアした！`;
        if (newKeyFragmentMessage) clearMessage += `\n${newKeyFragmentMessage}`;

        setRegions(prevRegions => ({
            ...prevRegions,
            [currentRun.currentRegionId]: { ...prevRegions[currentRun.currentRegionId], isCleared: true }
        }));
        
        if (currentRun.currentRegionId === REGIONS.r_micchy_castle.id) { 
             handleSetGamePhase(GamePhase.ENDING_MESSAGE);
             return;
        }

        const regionKeys = Object.keys(REGIONS); 
        const clearedRegionKeyIndex = regionKeys.indexOf(currentRun.currentRegionId);

        if (playerAfterBattleUpdate && clearedRegionKeyIndex !== -1 && clearedRegionKeyIndex + 1 < regionKeys.length) {
            const nextRegionIdToUnlock = regionKeys[clearedRegionKeyIndex + 1];
            const nextRegionDefinition = REGIONS[nextRegionIdToUnlock];
            if (regions[nextRegionIdToUnlock] && !regions[nextRegionIdToUnlock].isUnlocked) {
                let canUnlock = true;
                if (nextRegionDefinition.unlockPlayerLevel && playerAfterBattleUpdate.level < nextRegionDefinition.unlockPlayerLevel) {
                    canUnlock = false;
                    clearMessage += `\n${nextRegionDefinition.name}へは まだすすめないようだ... (ひつようレベル: ${nextRegionDefinition.unlockPlayerLevel})`;
                }
                
                if (nextRegionIdToUnlock === REGIONS.r_micchy_castle.id) {
                     const requiredKeyIds = [ALL_ITEMS.i_key_fragment_forest.id, ALL_ITEMS.i_key_fragment_cave.id, ALL_ITEMS.i_key_fragment_tower.id];
                     const allKeysPossessed = requiredKeyIds.every(keyId => playerAfterBattleUpdate?.inventory.some(item => item.id === keyId));
                     if (!allKeysPossessed) canUnlock = false; 
                }

                if (canUnlock) {
                    setRegions(prevRegions_1 => ({
                        ...prevRegions_1,
                        [nextRegionIdToUnlock]: { ...prevRegions_1[nextRegionIdToUnlock], isUnlocked: true }
                    }));
                    clearMessage += `\nあたらしいちいき: ${REGIONS[nextRegionIdToUnlock].name} がかいほうされた！`;
                }
            }
        }
        setModalMessage(prev => prev ? `${prev}\n\n${clearMessage}` : clearMessage);
        setCurrentRun(null); 
        handleSetGamePhase(GamePhase.WORLD_MAP); 
      } else {
        if (nextEncounterIndex === currentRegion.encounters.length && currentRegion.bossId) {
            if (playerAfterBattleUpdate && currentRegion.bossUnlockLevel && playerAfterBattleUpdate.level < currentRegion.bossUnlockLevel) {
                let blockMessage = `${currentRegion.name} のボスに挑戦するにはまだレベルが足りない (必要レベル: ${currentRegion.bossUnlockLevel})。ワールドマップにもどります。`;
                if (newKeyFragmentMessage) blockMessage = `${newKeyFragmentMessage}\n\n${blockMessage}`;
                setModalMessage(blockMessage);
                setCurrentRun(null);
                handleSetGamePhase(GamePhase.WORLD_MAP);
                return; 
            }
        }
        
        const playerStateForSkillCard = {...currentRun.player}; 
        if (newKeyFragmentMessage) setModalMessage(prev => prev ? `${prev}\n\n${newKeyFragmentMessage}`: newKeyFragmentMessage); 
        setCurrentRun(prev => prev ? {...prev, currentEncounterIndex: nextEncounterIndex, player: playerStateForSkillCard } : null); 
        handleSetGamePhase(GamePhase.BATTLE_REWARD_SKILL_CARD); 
      }
    } else { 
      if (player) { 
            tryCollectWisdomFragment('wf_action_run_fail_first', player);
      }
      handleSetGamePhase(GamePhase.GAME_OVER); 
    }
  };

  const handleSkillCardSelect = (card: SkillCardOption) => {
    if (!currentRun) return;
    const runPlayer = { ...currentRun.player }; 
    runPlayer.usedOncePerBattleSkills = []; 

    if (card.type === "STAT_BOOST") {
      Object.entries(card.boost).forEach(([key, value]) => {
        const statKey = key as keyof StatBoost;
        if (value !== undefined) {
          (runPlayer.temporaryStatBoosts[statKey] as number) = ((runPlayer.temporaryStatBoosts[statKey] as number) || 0) + value;
          if (statKey === 'maxHp') runPlayer.currentHp += value;
          if (statKey === 'maxMp') runPlayer.currentMp += value;
        }
      });
    } else if (card.type === "NEW_SKILL") {
      if (!runPlayer.temporarySkills.find(s => s.id === card.skill.id) && !runPlayer.persistentSkills.find(s => s.id === card.skill.id)) {
        runPlayer.temporarySkills.push(card.skill);
      }
    }
    const effective = calculateEffectiveStats(runPlayer);
    runPlayer.currentHp = Math.min(runPlayer.currentHp, effective.maxHp);
    runPlayer.currentMp = Math.min(runPlayer.currentMp, effective.maxMp);
    
    setCurrentRun({ ...currentRun, player: runPlayer });
    handleSetGamePhase(GamePhase.BATTLE); 
  };

  const handleGameOverContinue = () => {
    if (player) { 
        const effectiveStats = calculateEffectiveStats(player);
        setPlayer(p => p ? {...p, currentHp: effectiveStats.maxHp, currentMp: effectiveStats.maxMp, activeBuffs: [], usedOncePerBattleSkills: []} : null);
    }
    setCurrentRun(null); 
    handleSetGamePhase(GamePhase.WORLD_MAP); 
  };

  const handleFleeBattle = () => {
    if (currentRun) {
      setModalMessage(`${currentRun.player.name} はにげだした！`);
       if (player) { 
            tryCollectWisdomFragment('wf_action_run_fail_first', player);
      }
      setCurrentRun(null);
      handleSetGamePhase(GamePhase.WORLD_MAP); 
    }
  };

  const handleEquipItem = (itemToEquip: Item, slot: keyof Equipment) => {
    if (!player || !itemToEquip.instanceId) return;
    setPlayer(prevPlayer => {
        if (!prevPlayer) return null;
        
        let newPlayer = JSON.parse(JSON.stringify(prevPlayer)) as Player;
        const currentItemInSlot = newPlayer.equipment[slot];

        const itemIndexInInventory = newPlayer.inventory.findIndex(invItem => invItem.instanceId === itemToEquip.instanceId);
        if (itemIndexInInventory > -1) {
            newPlayer.inventory.splice(itemIndexInInventory, 1);
        } else {
            console.warn("装備しようとしたアイテムがインベントリに見つかりません:", itemToEquip.name);
        }

        if (currentItemInSlot) {
            newPlayer.inventory.push(currentItemInSlot);
        }
        
        newPlayer.equipment[slot] = itemToEquip;

        const oldEffectiveStats = calculateEffectiveStats(prevPlayer);
        const newEffectiveStats = calculateEffectiveStats(newPlayer);
        if (newEffectiveStats.maxHp !== oldEffectiveStats.maxHp) {
            newPlayer.currentHp = Math.min(newPlayer.currentHp, newEffectiveStats.maxHp); 
            if (newEffectiveStats.maxHp > oldEffectiveStats.maxHp) { 
                newPlayer.currentHp = Math.min(newPlayer.currentHp + (newEffectiveStats.maxHp - oldEffectiveStats.maxHp), newEffectiveStats.maxHp);
            }
        }
         if (newEffectiveStats.maxMp !== oldEffectiveStats.maxMp) {
            newPlayer.currentMp = Math.min(newPlayer.currentMp, newEffectiveStats.maxMp);
             if (newEffectiveStats.maxMp > oldEffectiveStats.maxMp) {
                newPlayer.currentMp = Math.min(newPlayer.currentMp + (newEffectiveStats.maxMp - oldEffectiveStats.maxMp), newEffectiveStats.maxMp);
            }
        }
        
        if (itemToEquip.id === 'i_micchy_buster') {
            newPlayer = tryCollectWisdomFragmentInternal(newPlayer, 'wf_equip_micchy_buster_first');
        }
        return newPlayer;
    });
  };
  const handleUnequipItem = (slot: keyof Equipment) => {
     if (!player) return;
     setPlayer(prevPlayer => {
        if (!prevPlayer) return null;
        const itemToUnequip = prevPlayer.equipment[slot];
        if (!itemToUnequip) return prevPlayer;

        const newPlayer = JSON.parse(JSON.stringify(prevPlayer)) as Player;
        newPlayer.inventory.push(itemToUnequip);
        newPlayer.equipment[slot] = null;
        
        const oldEffectiveStats = calculateEffectiveStats(prevPlayer);
        const newEffectiveStats = calculateEffectiveStats(newPlayer);
         if (newEffectiveStats.maxHp !== oldEffectiveStats.maxHp) {
            newPlayer.currentHp = Math.min(newPlayer.currentHp, newEffectiveStats.maxHp);
        }
         if (newEffectiveStats.maxMp !== oldEffectiveStats.maxMp) {
            newPlayer.currentMp = Math.min(newPlayer.currentMp, newEffectiveStats.maxMp);
        }
        return newPlayer;
     });
  };

  const tryCollectWisdomFragmentInternal = (playerState: Player, fragmentId: string): Player => {
    let playerCopy = playerState; 
    if (!playerCopy.collectedWisdomIds) {
      playerCopy.collectedWisdomIds = [];
    }
    const { collectedNew, fragmentText } = collectWisdomFragment(playerCopy, fragmentId);
    if (collectedNew && fragmentText) {
        setModalMessage(prev => prev ? `${prev}\n\n【ミッチーの知恵を発見！】\n${fragmentText}` : `【ミッチーの知恵を発見！】\n${fragmentText}`);
        playerCopy = checkForWisdomRewards(playerCopy);
    }
    return playerCopy;
  };

  const handlePurchaseItem = (itemBase: Item) => {
    if (!player || player.gold < itemBase.price) return;
    const newItemInstance = createItemInstance(itemBase.id);
    if (!newItemInstance) return;

    setPlayer(prev => {
        if (!prev) return null;
        let playerCopy = { ...prev, gold: prev.gold - itemBase.price, inventory: [...prev.inventory, newItemInstance] };
        
        if (itemBase.id === 'i_gm_dew') {
             playerCopy = tryCollectWisdomFragmentInternal(playerCopy, 'wf_item_gmdew_firstget');
        }
        return playerCopy;
    });
  };
  
  const handleSellItem = (itemToSell: Item, indexInInventory?: number) => { 
    if (!player || !itemToSell.instanceId) return;
    const sellPrice = Math.floor(itemToSell.price * 0.5);
    setPlayer(prev => {
        if (!prev) return null;
        const newInventory = prev.inventory.filter(invItem => invItem.instanceId !== itemToSell.instanceId);
        return { ...prev, gold: prev.gold + sellPrice, inventory: newInventory };
    });
  };

  const handleUseGacha = (cost: number, prizeBase: Item) => {
    if (!player) return;
    
    const isTicket = cost === 10001; 
    const actualCost = isTicket ? 0 : cost;
    const prizeInstance = createItemInstance(prizeBase.id);
    if (!prizeInstance) return;


    setPlayer(prev => {
      if (!prev) return null;
      const newInventory = [...prev.inventory, prizeInstance];
      if (isTicket) {
        const ticketIndex = newInventory.findIndex(i => i.id === 'i_gacha_ticket'); 
        if (ticketIndex > -1) newInventory.splice(ticketIndex, 1); 
      }
      let playerCopy = { ...prev, gold: prev.gold - actualCost, inventory: newInventory };
      return playerCopy;
    });
  };

  const handleEnhanceEquipment = (baseItemInstanceId: string, materialItemInstanceId: string) => {
    if (!player) return;

    setPlayer(prevPlayer => {
        if (!prevPlayer) return null;

        const newPlayer = JSON.parse(JSON.stringify(prevPlayer)) as Player;
        let baseEquipment: Item | null = null;
        let baseEquipmentLocation: 'equipment' | 'inventory' = 'inventory';
        let baseEquipmentIndex = -1; 

        if (newPlayer.equipment.weapon && newPlayer.equipment.weapon.instanceId === baseItemInstanceId) {
            baseEquipment = newPlayer.equipment.weapon;
            baseEquipmentLocation = 'equipment';
        } else if (newPlayer.equipment.armor && newPlayer.equipment.armor.instanceId === baseItemInstanceId) {
            baseEquipment = newPlayer.equipment.armor;
            baseEquipmentLocation = 'equipment';
        } else if (newPlayer.equipment.shield && newPlayer.equipment.shield.instanceId === baseItemInstanceId) {
            baseEquipment = newPlayer.equipment.shield;
            baseEquipmentLocation = 'equipment';
        } else {
            baseEquipmentIndex = newPlayer.inventory.findIndex(item => item.instanceId === baseItemInstanceId);
            if (baseEquipmentIndex > -1) {
                baseEquipment = newPlayer.inventory[baseEquipmentIndex];
            }
        }

        const materialEquipmentIndex = newPlayer.inventory.findIndex(item => item.instanceId === materialItemInstanceId);

        if (!baseEquipment || materialEquipmentIndex === -1) {
            setModalMessage("強化処理中にエラーが発生しました。");
            return prevPlayer;
        }
        
        if ((baseEquipment.enhancementLevel || 0) >= MAX_ENHANCEMENT_LEVEL) {
            setModalMessage(`「${getDisplayItemName(baseEquipment)}」は既に最大まで強化されています。`);
            return prevPlayer;
        }

        newPlayer.inventory.splice(materialEquipmentIndex, 1); // Consume material

        baseEquipment.enhancementLevel = (baseEquipment.enhancementLevel || 0) + 1;

        if (baseEquipmentLocation === 'equipment') {
            if (baseEquipment.type === 'ぶき' && newPlayer.equipment.weapon) newPlayer.equipment.weapon.enhancementLevel = baseEquipment.enhancementLevel;
            else if (baseEquipment.type === 'よろい' && newPlayer.equipment.armor) newPlayer.equipment.armor.enhancementLevel = baseEquipment.enhancementLevel;
            else if (baseEquipment.type === 'たて' && newPlayer.equipment.shield) newPlayer.equipment.shield.enhancementLevel = baseEquipment.enhancementLevel;
        } else if (baseEquipmentLocation === 'inventory' && baseEquipmentIndex > -1) {
             newPlayer.inventory[baseEquipmentIndex].enhancementLevel = baseEquipment.enhancementLevel;
        }
        
        setModalMessage(`「${getDisplayItemName(baseEquipment)}」を強化しました！`);
        return newPlayer;
    });
  };
  
  const handlePasswordLoadSuccess = (loadedPlayer: Player, loadedRegions: Record<string, Region>) => {
    setPlayer(loadedPlayer);
    setRegions(loadedRegions);
    // handleSetGamePhase will be called by PasswordManagementScreen after a delay
  };
  
  const generateDebugHighLevelPassword = () => {
      const debugPlayer = createInitialPlayer("デバッグ勇者");
      debugPlayer.level = 20;
      debugPlayer.gold = 50000;
      debugPlayer.experience = XP_FOR_LEVEL[19]; // Exp for level 20
      
      const classStatIncrease = STAT_INCREASE_PER_LEVEL[debugPlayer.playerClass];
      for(let i = 1; i < debugPlayer.level; i++) {
          Object.entries(classStatIncrease).forEach(([stat, value]) => {
              if (debugPlayer.baseStats[stat as keyof StatBoost] !== undefined && value !== undefined) {
                  (debugPlayer.baseStats[stat as keyof StatBoost] as number) += value;
              }
          });
          Object.values(ALL_SKILLS).forEach(skill => {
            if (skill.unlockLevel === (i + 1) && !debugPlayer.persistentSkills.find(ps => ps.id === skill.id)) {
              debugPlayer.persistentSkills.push(skill);
            }
          });
      }
      debugPlayer.baseStats.maxHp = Math.round(debugPlayer.baseStats.maxHp || 1);
      debugPlayer.baseStats.maxMp = Math.round(debugPlayer.baseStats.maxMp || 0);

      debugPlayer.equipment.weapon = createItemInstance('i_knight_sword', MAX_ENHANCEMENT_LEVEL);
      debugPlayer.equipment.armor = createItemInstance('i_knight_armor', MAX_ENHANCEMENT_LEVEL);
      debugPlayer.equipment.shield = createItemInstance('i_sacred_shield', MAX_ENHANCEMENT_LEVEL);
      
      const gmDew = createItemInstance('i_gm_dew');
      if(gmDew) debugPlayer.inventory.push(gmDew);


      const effectiveStats = calculateEffectiveStats(debugPlayer);
      debugPlayer.currentHp = effectiveStats.maxHp;
      debugPlayer.currentMp = effectiveStats.maxMp;

      const debugRegions = JSON.parse(JSON.stringify(REGIONS));
      Object.keys(debugRegions).forEach(rId => {
        debugRegions[rId].isUnlocked = true;
        // debugRegions[rId].isCleared = true; // Optionally clear all for debug
      });
      
      const pass = generatePassword(debugPlayer, debugRegions);
      setGeneratedDebugPassword(pass);
      setShowDebugPasswordModal(true);
  };

  const handleQuizComplete = (correctAnswers: number, totalQuestions: number) => {
    let message = `クイズ終了！ ${totalQuestions}問中 ${correctAnswers}問正解でした！`;
    if (currentQuizParams) {
        if (correctAnswers >= QUIZ_MIN_CORRECT_FOR_REWARD) {
            message += `\n素晴らしい成績です！ミッチーの知恵を授けます。`;
            if (player) {
              tryCollectWisdomFragment(currentQuizParams.wisdomFragmentForRewardId, player);
              setPlayer(prevPlayer => {
                if (!prevPlayer) return null;
                let playerCopy = JSON.parse(JSON.stringify(prevPlayer)) as Player;
                if (!playerCopy.collectedWisdomIds.includes(currentQuizParams.completionFlagId)) {
                    playerCopy.collectedWisdomIds.push(currentQuizParams.completionFlagId);
                }
                return playerCopy;
              });
            }
        } else {
            message += `\n残念、報酬ゲットならず...。また挑戦してね！`;
        }
    }
    setModalMessage(message);
    handleSetGamePhase(GamePhase.WORLD_MAP);
    setCurrentQuizParams(null); 
  };

  const handleFinalBossDialogueComplete = () => {
    if (pendingRegionSelection) {
      initiateRegionRun(pendingRegionSelection);
      setPendingRegionSelection(null); // Clear it after use
    } else {
      // Fallback if pendingRegionSelection is somehow null, though it shouldn't be
      setModalMessage("エラー: ボス戦を開始できませんでした。マップに戻ります。");
      handleSetGamePhase(GamePhase.WORLD_MAP);
    }
  };
  
  const handleEndingProceedToCredits = () => {
    handleStopBattleMusic(); // Ensure battle BGM is stopped
    if (endingBgmAudioRef.current === null) {
        const audio = new Audio(BGM_FILES.ENDING_CREDITS);
        audio.crossOrigin = "anonymous";
        audio.loop = true;
        audio.volume = getMasterBgmVolume();
        audio.onerror = () => console.error("App: Ending BGM failed to load. URL:", BGM_FILES.ENDING_CREDITS);
        endingBgmAudioRef.current = audio;
    }
    if (endingBgmAudioRef.current && endingBgmAudioRef.current.paused) {
        endingBgmAudioRef.current.play().catch(e => console.warn("App: Ending BGM play error:", e));
    }
    handleSetGamePhase(GamePhase.CREDITS_ROLL);
  };
  
  const handleCreditsEnd = () => {
    handleStopEndingMusic();
    deleteSave(); 
    setPlayer(null);
    setRegions(JSON.parse(JSON.stringify(REGIONS)));
    setCurrentRun(null);
    handleSetGamePhase(GamePhase.TITLE);
  };


  const renderGamePhase = () => {
    switch (gamePhase) {
      case GamePhase.TITLE:
        return <TitleScreen 
                    setGamePhase={handleSetGamePhase} 
                    hasSaveData={!!player} 
                    startNewGame={startNewGameFlow} 
                    continueGame={continueGameFlow}
                    onPlayTitleMusicRequest={handlePlayTitleMusicRequest}
                    isSfxEnabled={isSfxEnabled} // Pass isSfxEnabled
                    onGenerateDebugHighLevelPassword={generateDebugHighLevelPassword}
                />;
      case GamePhase.NAME_INPUT:
        return <NameInputScreen setPlayerName={handleNameSet} setGamePhase={handleSetGamePhase} />;
      case GamePhase.WORLD_MAP:
        if (!player) return <TitleScreen setGamePhase={handleSetGamePhase} hasSaveData={false} startNewGame={startNewGameFlow} continueGame={continueGameFlow} onPlayTitleMusicRequest={handlePlayTitleMusicRequest} isSfxEnabled={isSfxEnabled} onGenerateDebugHighLevelPassword={generateDebugHighLevelPassword}/>;
        return <WorldMapScreen regions={regions} onSelectRegion={handleAttemptRegionSelect} setGamePhase={handleSetGamePhase} player={player} />;
      case GamePhase.BATTLE:
        if (!currentRun || !regions[currentRun.currentRegionId]) {
            setModalMessage("戦闘開始エラー: 現在の冒険情報または地域情報がありません。");
            handleSetGamePhase(GamePhase.WORLD_MAP); 
            return null;
        }
        return <BattleScreen 
                    currentRun={currentRun} 
                    initialEnemies={getEnemiesForEncounter(regions[currentRun.currentRegionId], currentRun.currentEncounterIndex)} 
                    onBattleEnd={handleBattleEnd} 
                    updateCurrentRunPlayer={updateCurrentRunPlayerState}
                    onFleeBattle={handleFleeBattle}
                    isSfxEnabled={isSfxEnabled}
                    battleBgUrl={regions[currentRun.currentRegionId]?.battleBackgroundUrl}
                />;
      case GamePhase.BATTLE_REWARD_SKILL_CARD:
        return <SkillCardSelectionScreen onCardSelect={handleSkillCardSelect} />;
      case GamePhase.GAME_OVER:
        return <GameOverScreen xpGained={currentRun?.xpGainedThisRun || 0} goldGained={currentRun?.goldGainedThisRun || 0} onContinue={handleGameOverContinue} />;
      case GamePhase.STATUS_SCREEN:
        if (!player) return <TitleScreen setGamePhase={handleSetGamePhase} hasSaveData={false} startNewGame={startNewGameFlow} continueGame={continueGameFlow} onPlayTitleMusicRequest={handlePlayTitleMusicRequest} isSfxEnabled={isSfxEnabled} onGenerateDebugHighLevelPassword={generateDebugHighLevelPassword}/>;
        return <StatusScreen player={player} setGamePhase={handleSetGamePhase} onEquipItem={handleEquipItem} onUnequipItem={handleUnequipItem} onEnhanceEquipment={handleEnhanceEquipment} />;
      case GamePhase.SHOP:
        if (!player || !currentShopRegionId) return <TitleScreen setGamePhase={handleSetGamePhase} hasSaveData={false} startNewGame={startNewGameFlow} continueGame={continueGameFlow} onPlayTitleMusicRequest={handlePlayTitleMusicRequest} isSfxEnabled={isSfxEnabled} onGenerateDebugHighLevelPassword={generateDebugHighLevelPassword} />;
        return <ShopScreen player={player} currentShopRegionId={currentShopRegionId} allRegions={regions} onPurchaseItem={handlePurchaseItem} onSellItem={handleSellItem} setGamePhase={handleSetGamePhase} />;
      case GamePhase.GACHA:
        if (!player || !currentGachaRegionId) return <TitleScreen setGamePhase={handleSetGamePhase} hasSaveData={false} startNewGame={startNewGameFlow} continueGame={continueGameFlow} onPlayTitleMusicRequest={handlePlayTitleMusicRequest} isSfxEnabled={isSfxEnabled} onGenerateDebugHighLevelPassword={generateDebugHighLevelPassword} />;
        return <GachaScreen player={player} currentGachaRegionId={currentGachaRegionId} allRegions={regions} onUseGacha={handleUseGacha} setGamePhase={handleSetGamePhase} />;
      case GamePhase.PASSWORD_SAVE:
        return <PasswordManagementScreen mode="save" playerData={player} regionsData={regions} setGamePhase={handleSetGamePhase} onLoadSuccess={handlePasswordLoadSuccess} />;
      case GamePhase.PASSWORD_LOAD:
        return <PasswordManagementScreen mode="load" playerData={player} regionsData={regions} setGamePhase={handleSetGamePhase} onLoadSuccess={handlePasswordLoadSuccess} />;
      case GamePhase.WISDOM_BAG:
        if (!player) return <TitleScreen setGamePhase={handleSetGamePhase} hasSaveData={false} startNewGame={startNewGameFlow} continueGame={continueGameFlow} onPlayTitleMusicRequest={handlePlayTitleMusicRequest} isSfxEnabled={isSfxEnabled} onGenerateDebugHighLevelPassword={generateDebugHighLevelPassword} />;
        return <WisdomBagScreen player={player} setGamePhase={handleSetGamePhase} />;
      case GamePhase.MITCHY_QUIZ:
        if (!player || !currentQuizParams) {
             setModalMessage("クイズの準備ができていません。");
             handleSetGamePhase(GamePhase.WORLD_MAP);
             return null;
        }
        return <MitchyQuizScreen player={player} questions={currentQuizParams.questions} onQuizComplete={handleQuizComplete} setGamePhase={handleSetGamePhase} />;
      case GamePhase.FINAL_BOSS_PRE_DIALOGUE:
        return <FinalBossPreDialogueScreen onDialogueComplete={handleFinalBossDialogueComplete} />;
      case GamePhase.ENDING_MESSAGE:
        return <EndingMessageScreen onProceed={handleEndingProceedToCredits} />;
      case GamePhase.CREDITS_ROLL:
        return <CreditsRollScreen playerName={player ? player.name : DEFAULT_PLAYER_NAME} onCreditsEnd={handleCreditsEnd} />;
      case GamePhase.BOSS_CONFIRMATION: 
        // This phase is primarily for showing the modal. The modal itself is rendered outside this switch.
        // If we reach here directly without the modal (e.g. modal closed improperly), fallback.
        return <WorldMapScreen regions={regions} onSelectRegion={handleAttemptRegionSelect} setGamePhase={handleSetGamePhase} player={player!} />;
      default:
        return <TitleScreen 
                    setGamePhase={handleSetGamePhase} 
                    hasSaveData={!!player} 
                    startNewGame={startNewGameFlow} 
                    continueGame={continueGameFlow}
                    onPlayTitleMusicRequest={handlePlayTitleMusicRequest}
                    isSfxEnabled={isSfxEnabled} // Pass isSfxEnabled
                    onGenerateDebugHighLevelPassword={generateDebugHighLevelPassword}
                />;
    }
  };

  return (
    <div id="app-container" className="h-full w-full bg-black text-white font-dq flex flex-col items-center justify-center overflow-hidden">
      <div 
        id="game-viewport" 
        className="w-full h-full max-w-[405px] max-h-[720px] aspect-[9/16] bg-blue-950 shadow-2xl border-4 border-blue-800 rounded-lg relative transition-all duration-300 ease-in-out overflow-hidden"
      >
        {renderGamePhase()}
      </div>
    </div>
  );
      {modalMessage && (
        <Modal isOpen={!!modalMessage} onClose={() => setModalMessage(null)} title="メッセージ">
          <p className="text-shadow-dq whitespace-pre-wrap">{modalMessage}</p>
        </Modal>
      )}
      {showBossConfirmationModal && pendingRegionSelection && regions[pendingRegionSelection] && ( // Check pendingRegionSelection for safety
        <Modal 
            isOpen={showBossConfirmationModal} 
            onClose={() => {
              setShowBossConfirmationModal(false);
              setPendingRegionSelection(null);
              // Only revert to WORLD_MAP if the current phase IS BOSS_CONFIRMATION.
              // This prevents phase flickering if modal is closed from other states.
              if (gamePhase === GamePhase.BOSS_CONFIRMATION) handleSetGamePhase(GamePhase.WORLD_MAP); 
            }} 
            title="ボスせんとうかくにん"
        >
          <p className="text-lg mb-4 text-shadow-dq">
            「{ALL_ENEMIES[regions[pendingRegionSelection].bossId]?.name || 'ボス'}」とのたたかいが はじまります。
          </p>
          <p className="text-md mb-6 text-shadow-dq">よろしいですか？</p>
          <div className="flex justify-around">
            <button onClick={() => {
              setShowBossConfirmationModal(false);
              if (pendingRegionSelection) { // Double check, should be true
                initiateRegionRun(pendingRegionSelection);
              }
              setPendingRegionSelection(null);
            }} className="dq-button confirm px-6">はい</button>
            <button onClick={() => {
              setShowBossConfirmationModal(false);
              setPendingRegionSelection(null);
              if (gamePhase === GamePhase.BOSS_CONFIRMATION) handleSetGamePhase(GamePhase.WORLD_MAP);
            }} className="dq-button danger px-6">いいえ</button>
          </div>
        </Modal>
      )}
       {showDebugPasswordModal && (
        <Modal isOpen={showDebugPasswordModal} onClose={() => setShowDebugPasswordModal(false)} title="デバッグ用パスワード">
          <textarea
            readOnly
            value={generatedDebugPassword || "生成に失敗しました"}
            className="w-full h-24 p-2 bg-black bg-opacity-40 border-2 border-blue-600 rounded text-white text-xs"
            aria-label="デバッグ用ふっかつのじゅもん"
          />
          <button onClick={() => {
             if(generatedDebugPassword) navigator.clipboard.writeText(generatedDebugPassword);
             setShowDebugPasswordModal(false);
             setModalMessage("デバッグ用パスワードをコピーしました。");
          }} className="dq-button w-full mt-2">コピーして閉じる</button>
        </Modal>
      )}
    </div>
  );
};
