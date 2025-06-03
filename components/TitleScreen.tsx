
import React, { useState, useEffect } from 'react';
import { GamePhase } from '../types';

interface TitleScreenProps {
  setGamePhase: (phase: GamePhase) => void;
  hasSaveData: boolean;
  startNewGame: () => void;
  continueGame: () => void;
  onPlayTitleMusicRequest: () => void;
  isSfxEnabled: boolean;
  onGenerateDebugHighLevelPassword: () => void;
}

const KNIGHT_BACKGROUND_IMAGE_URL = "https://i.imgur.com/ooULMqt.jpeg"; 
const GAME_LOGO_IMAGE_URL = "https://i.imgur.com/Eo8RXKr.png"; 

export const TitleScreen: React.FC<TitleScreenProps> = ({
  setGamePhase,
  hasSaveData,
  startNewGame,
  continueGame,
  onPlayTitleMusicRequest,
  isSfxEnabled,
  onGenerateDebugHighLevelPassword
}) => {
  const [userInteractedOnce, setUserInteractedOnce] = useState(false);
  const [showMainMenuOptions, setShowMainMenuOptions] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);

  const handleInitialInteraction = () => {
    if (!userInteractedOnce) {
      setUserInteractedOnce(true);
    }
  };

  const handlePlayMusicButtonClick = () => {
    if (userInteractedOnce && !isSfxEnabled) {
        onPlayTitleMusicRequest();
    }
  };

  useEffect(() => {
    if (userInteractedOnce && isSfxEnabled && !showMainMenuOptions) {
      setShowMainMenuOptions(true);
    }
  }, [userInteractedOnce, isSfxEnabled, showMainMenuOptions]);

  return (
    <div
      className="flex flex-col h-full w-full items-center text-white relative overflow-hidden"
      onClick={!userInteractedOnce ? handleInitialInteraction : undefined}
      style={{
        backgroundImage: `url('${KNIGHT_BACKGROUND_IMAGE_URL}')`,
        backgroundColor: '#000000', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: !userInteractedOnce ? 'pointer' : 'default',
      }}
    >
      {!userInteractedOnce && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <p className="text-xl text-yellow-300 text-shadow-dq animate-pulse">クリックしてゲームを開始</p>
        </div>
      )}

      {userInteractedOnce && (
        <div className="relative z-10 flex flex-col h-full w-full items-center text-center p-3 sm:p-4 justify-between">
          
          {/* Upper Content Area (Logo and Description) */}
          {/* This div will grow and center its content vertically & horizontally */}
          <div className="flex flex-col items-center justify-center w-full flex-grow pt-4 sm:pt-6"> 
            {logoLoadError ? (
                <h1 className="text-3xl sm:text-4xl font-bold text-red-500 text-shadow-dq-heavy mt-12">ミッチークエスト</h1>
            ) : (
              <img
                src={GAME_LOGO_IMAGE_URL}
                alt="ミッチークエスト ロゴ"
                className="w-11/12 max-w-md object-contain max-h-[42vh] mt-16 sm:mt-20 md:mt-24 mb-8 sm:mb-10 animate-fadeIn" 
                onError={() => setLogoLoadError(true)}
              />
            )}
            <div className="bg-black bg-opacity-70 p-2.5 sm:p-3 rounded-md shadow-lg w-11/12 max-w-md">
              <p className="text-xs sm:text-sm text-gray-200 text-shadow-dq leading-relaxed">
                GMの呪いで「<span className="text-red-400 font-bold">大魔王</span>」と化した<br />
                元勇者カメラユーチューバー、ミッチー。<br />
                彼の失われた〈<span className="text-yellow-300">初心</span>〉を取り戻し、<br />
                世界に平和の光を取り戻せ！
              </p>
            </div>
          </div>

          {/* Buttons Area (Stays at the bottom due to justify-between on parent) */}
          <div className="w-full max-w-xs sm:max-w-sm pb-5 sm:pb-7 mt-auto"> 
            {!showMainMenuOptions ? (
              <div className="dq-window">
                <button
                  onClick={handlePlayMusicButtonClick}
                  className="dq-button confirm w-full-dq-button text-base sm:text-lg py-2 sm:py-2.5"
                >
                  ♪ おんがくをならす
                </button>
                <p className="text-xs text-gray-300 mt-1.5 text-shadow-dq">
                  おんがくをならしてゲームをはじめよう！
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={startNewGame}
                    className="dq-button confirm w-full-dq-button text-sm sm:text-base"
                  >
                    はじめから
                  </button>
                  <button
                    onClick={continueGame}
                    disabled={!hasSaveData}
                    className="dq-button confirm w-full-dq-button text-sm sm:text-base"
                  >
                    つづきから
                  </button>
                  <button
                    onClick={() => setGamePhase(GamePhase.PASSWORD_LOAD)}
                    className="dq-button w-full-dq-button text-sm sm:text-base"
                  >
                    ふっかつのじゅもん
                  </button>
                </div>
                {/* Removed footer div that contained copyright and powered by text */}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
