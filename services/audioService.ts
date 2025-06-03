// services/audioService.ts

// GitHub raw content URLs
const NEW_BASE_URL = "https://raw.githubusercontent.com/akumago/kaihatu/main/mittionngaku/";

// SFXファイルのURL
export const SFX_FILES = {
  DAMAGE: `${NEW_BASE_URL}music_%E3%83%80%E3%83%A1%E3%83%BC%E3%82%B8%E3%82%92%E4%B8%8E%E3%81%88%E3%82%8B%E3%83%BB%E5%8F%97%E3%81%91%E3%82%8B_%E3%83%95%E3%82%A1%E3%83%B3%E3%83%95%E3%82%A1%E3%83%BC%E3%83%AC_%E3%83%95%E3%82%A1%E3%83%B3%E3%83%95%E3%82%A1%E3%83%BC%E3%83%AC_%E3%83%95%E3%82%A1%E3%83%B3%E3%83%95%E3%82%A1%E3%83%BC%E3%83%AC_%E3%83%95%E3%82%A1%E3%83%B3%E3%83%95%E3%82%A1%E3%83%BC%E3%83%AC.mp3`,
  LEVEL_UP: `${NEW_BASE_URL}reberuappu.mp3`,
  GAME_OVER: `${NEW_BASE_URL}zzennmetuonngaku.mp3`,
  VICTORY: `${NEW_BASE_URL}syourino.mp3`,
  SPELL_CAST: `${NEW_BASE_URL}zyumonneisyou.mp3`,
  BOSS_APPEAR: `${NEW_BASE_URL}bosurasubosu.mp3`,
};

// BGMファイルのURL
export const BGM_FILES = {
  TITLE: `${NEW_BASE_URL}opuninguendororu.mp3`,
  BATTLE_NORMAL: `${NEW_BASE_URL}tuuzyousentou.mp3`,
  BATTLE_BOSS: `${NEW_BASE_URL}bosurasubosu.mp3`,
  ENDING_CREDITS: `${NEW_BASE_URL}opuninguendororu.mp3`,
};

// メディアエラーのメッセージを取得する
const getMediaErrorMessage = (errorCode: number | undefined): string => {
  switch (errorCode) {
    case 1:
      return 'MEDIA_ERR_ABORTED';
    case 2:
      return 'MEDIA_ERR_NETWORK';
    case 3:
      return 'MEDIA_ERR_DECODE';
    case 4:
      return 'MEDIA_ERR_SRC_NOT_SUPPORTED';
    default:
      return '不明なエラー';
  }
};

// BGMエラーハンドリング
export const handleBgmError = (error: ErrorEvent) => {
  console.error(`BGM読み込みエラー: ${error.message}`);
  const audioElement = error.target as HTMLAudioElement;
  if (audioElement) {
    console.error(`エラーコード: ${audioElement.error?.code}`);
    console.error(`エラーメッセージ: ${getMediaErrorMessage(audioElement.error?.code)}`);
    console.error(`問題のURL: ${audioElement.src}`);
    console.error(`現在のAudioContext状態: ${audioContextInstance?.state}`);
    console.error(`AudioContextが初期化されているか: ${isAudioContextInitialized}`);
    
    // エラーメッセージを日本語で表示
    switch (audioElement.error?.code) {
      case 1:
        console.error('エラー: 再生が中止されました');
        break;
      case 2:
        console.error('エラー: ネットワークエラーが発生しました');
        break;
      case 3:
        console.error('エラー: 音声ファイルのデコードに失敗しました');
        break;
      case 4:
        console.error('エラー: 音声ファイルの形式がサポートされていません');
        break;
      default:
        console.error('エラー: 不明なエラーが発生しました');
    }
  }
};

let isAudioContextInitialized = false;
let audioContextInstance: AudioContext | null = null;
let masterSfxVolume = 0.3;
let masterBgmVolume = 0.2;

const initializeAudioContext = async (): Promise<boolean> => {
  if (isAudioContextInitialized && audioContextInstance && audioContextInstance.state === 'running') {
    console.log("AudioService: AudioContext already initialized and running.");
    return true;
  }
  console.log("AudioService: Attempting to initialize AudioContext...");

  try {
    if (typeof window === 'undefined' || (!window.AudioContext && !(window as any).webkitAudioContext)) {
      console.warn("AudioService: AudioContext is not supported in this environment.");
      isAudioContextInitialized = false;
      return false;
    }

    const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextConstructor) {
        console.error("AudioService: AudioContext constructor not found.");
        isAudioContextInitialized = false;
        return false;
    }

    if (!audioContextInstance || audioContextInstance.state === 'closed') {
      console.log("AudioService: Creating new AudioContext instance.");
      audioContextInstance = new AudioContextConstructor();
      console.log("AudioService: New AudioContext instance created. Initial state:", audioContextInstance.state);
    } else {
      console.log("AudioService: Reusing existing AudioContext instance. Current state:", audioContextInstance.state);
    }

    if (audioContextInstance.state === 'suspended') {
      console.log("AudioService: AudioContext is suspended. Attempting to resume.");
      try {
        await audioContextInstance.resume();
        console.log("AudioService: AudioContext resume attempt finished. New state:", audioContextInstance.state);
      } catch (e) {
        console.warn("AudioService: Failed to resume AudioContext. Error:", e, "State after failed resume:", audioContextInstance.state);
      }
    }

    if (audioContextInstance && audioContextInstance.state === 'running') {
      console.log("AudioService: AudioContext is now running.");
      isAudioContextInitialized = true;
    } else {
      console.warn("AudioService: AudioContext is NOT running. Final state:", audioContextInstance?.state);
      isAudioContextInitialized = false;
    }

    return isAudioContextInitialized;

  } catch (e) {
    console.error("AudioService: Error during AudioContext initialization:", e);
    isAudioContextInitialized = false;
    audioContextInstance = null; 
    return false;
  }
};

export const ensureAudioContext = async (): Promise<boolean> => {
  return await initializeAudioContext();
};

export const setSfxVolume = (volume: number) => {
    masterSfxVolume = Math.max(0, Math.min(1, volume));
}

export const setBgmVolume = (volume: number) => {
    masterBgmVolume = Math.max(0, Math.min(1, volume));
}


export const playSfx = (sfxUrl: string, volume?: number) => {
  if (!isAudioContextInitialized || !audioContextInstance || audioContextInstance.state !== 'running') {
    console.warn(`AudioService: SFX (${sfxUrl}) aborted: Audio context not ready or not running. State: ${audioContextInstance?.state}, Initialized: ${isAudioContextInitialized}`);
    return;
  }

  try {
    const audio = new Audio(sfxUrl);
    audio.addEventListener('error', handleBgmError);
    audio.volume = (volume || masterSfxVolume);
    audio.play().catch(error => {
      console.error(`SFX再生エラー: ${error.message}`);
    });
  } catch (error) {
    console.error(`SFX再生エラー: ${error}`);
    console.error(`エラー詳細: ${error instanceof Error ? error.stack : ''}`);
  }
};

export const playBgm = (bgmUrl: string, volume?: number) => {
  if (!isAudioContextInitialized || !audioContextInstance || audioContextInstance.state !== 'running') {
    console.warn(`AudioService: BGM (${bgmUrl}) aborted: Audio context not ready or not running. State: ${audioContextInstance?.state}, Initialized: ${isAudioContextInitialized}`);
    return;
  }

  try {
    const audio = new Audio(bgmUrl);
    audio.addEventListener('error', handleBgmError);
    audio.volume = (volume || masterBgmVolume);
    audio.play().catch(error => {
      console.error(`BGM再生エラー: ${error.message}`);
      console.error(`エラー詳細: ${error instanceof Error ? error.stack : ''}`);
    });
  } catch (error) {
    console.error(`BGM再生エラー: ${error}`);
    console.error(`エラー詳細: ${error instanceof Error ? error.stack : ''}`);
  }
};

export const getMasterBgmVolume = () => masterBgmVolume;