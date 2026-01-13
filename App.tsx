
import React, { useState, useEffect, useCallback } from 'react';
import { STORY_DATA } from './storyData';
import { GameState, Stats, Choice } from './types';
import { getDetectiveHint } from './geminiService';

const INITIAL_STATS: Stats = {
  logic: 0,
  intuition: 0,
  charisma: 0,
  reputation: 1,
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentSceneId: 'intro',
    stats: { ...INITIAL_STATS },
    history: ['intro'],
    lastCheckpointId: 'intro',
  });

  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentScene = STORY_DATA[gameState.currentSceneId] || STORY_DATA['intro'];

  useEffect(() => {
    // Check if current scene is an ending
    if (gameState.currentSceneId.includes('ending')) {
      setIsGameOver(true);
    } else {
      setIsGameOver(false);
    }
  }, [gameState.currentSceneId]);

  const handleChoice = (choice: Choice) => {
    const newStats = { ...gameState.stats };
    if (choice.effect) {
      Object.entries(choice.effect).forEach(([stat, val]) => {
        const key = stat as keyof Stats;
        newStats[key] = (newStats[key] || 0) + (val as number);
      });
    }

    const nextScene = STORY_DATA[choice.next];

    setGameState(prev => ({
      ...prev,
      currentSceneId: choice.next,
      stats: newStats,
      history: [...prev.history, choice.next],
      lastCheckpointId: nextScene?.checkpoint ? choice.next : prev.lastCheckpointId,
    }));
    setHint(null);
  };

  const restart = () => {
    setGameState({
      currentSceneId: 'intro',
      stats: { ...INITIAL_STATS },
      history: ['intro'],
      lastCheckpointId: 'intro',
    });
    setHint(null);
    setIsGameOver(false);
  };

  const requestHint = async () => {
    setLoadingHint(true);
    const result = await getDetectiveHint(currentScene.narration, gameState.stats);
    setHint(result || "No hunches right now.");
    setLoadingHint(false);
  };

  const checkRequirement = (choice: Choice) => {
    if (!choice.requirement) return true;
    const { stat, value } = choice.requirement;
    return gameState.stats[stat] >= value;
  };
  // on first user interaction (click), unmute
  document.addEventListener("click", () => {
    const vid = document.getElementById("videoId") as HTMLVideoElement | null;

    if (!vid) return;
    vid.muted = false;
    vid.play();
  }, { once: true });
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 flex flex-col relative overflow-hidden">
      {/* HUD - Stats Bar */}
      <div className="w-full bg-[#0a0a0c] border-b border-[#00f3ff]/30 p-4 sticky top-0 z-50 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-neon font-bold neon-text-blue uppercase tracking-widest">Shadows in Neon City</h1>
          <span className="text-[10px] text-[#00f3ff]/50 uppercase tracking-tighter">Private Investigator File: #4429</span>
        </div>

        <div className="flex gap-4 sm:gap-8 flex-wrap">
          {(['logic', 'intuition', 'charisma', 'reputation'] as const).map(stat => (
            <div key={stat} className="flex flex-col items-center">
              <span className="text-[10px] uppercase text-[#00f3ff] font-bold">{stat}</span>
              <span className="text-xl font-neon text-white">{gameState.stats[stat]}</span>
            </div>
          ))}
        </div>

        <button
          onClick={restart}
          className="px-3 py-1 border border-red-900 text-red-500 text-xs uppercase hover:bg-red-900/20 transition-colors"
        >
          Reset Case
        </button>
      </div>
      <video id='videoId' src={currentScene.imageUrl} autoPlay muted className="max-md:hidden absolute top-0 left-0 w-full h-full object-cover"></video>
      {/* Main Game Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col gap-6">

        {/* Cinematic Visual (Placeholder) */}
        {currentScene.imageUrl && (
          <div className="md:hidden w-full aspect-video rounded border border-[#00f3ff]/20 overflow-hidden relative group">
            <video
              id='videoId'
              src={currentScene.imageUrl}
              autoPlay
              muted

              playsInline
              controls
              className="w-full h-full object-cover  opacity-60 group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
          </div>
        )}

        {/* Narrative Box */}
        <div className="bg-[#0a0a0c] border border-[#00f3ff]/20 p-6 md:p-10 shadow-2xl relative">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00f3ff]/40"></div>

          <div className="prose prose-invert max-w-none">
            {currentScene.narration.split('\n').map((para, i) => (
              <p key={i} className="mb-4 text-lg leading-relaxed text-gray-200">
                {para}
              </p>
            ))}
          </div>

          {/* AI Hint Section */}
          <div className="mt-8 pt-6 border-t border-dashed border-[#00f3ff]/20">
            {hint ? (
              <div className="bg-blue-900/10 p-4 border-l-2 border-[#00f3ff] italic text-[#00f3ff] animate-pulse">
                &ldquo;{hint}&rdquo;
              </div>
            ) : (
              <button
                onClick={requestHint}
                disabled={loadingHint}
                className="text-xs uppercase text-[#00f3ff]/60 hover:text-[#00f3ff] transition-colors flex items-center gap-2"
              >
                {loadingHint ? 'Thinking...' : '◈ Try a Hunch (Gemini Insight)'}
              </button>
            )}
          </div>
        </div>

        {/* Choices Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
          {currentScene.choices.map((choice, idx) => {
            const isMet = checkRequirement(choice);
            return (
              <button
                key={idx}
                disabled={!isMet}
                onClick={() => handleChoice(choice)}
                className={`
                  p-4 text-left border relative group transition-all duration-300
                  ${isMet
                    ? 'border-[#00f3ff]/20 hover:border-[#00f3ff] hover:bg-[#00f3ff]/5 bg-[#0a0a0c]'
                    : 'border-gray-800 opacity-50 cursor-not-allowed bg-black'}
                `}
              >
                {!isMet && (
                  <div className="text-[10px] text-red-500 uppercase mb-1">
                    [LOCKED: Requires {choice.requirement?.stat} {choice.requirement?.value}]
                  </div>
                )}
                <div className={`font-bold ${isMet ? 'text-white' : 'text-gray-600'}`}>
                  {choice.text}
                </div>
                {isMet && (
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#00f3ff] font-neon">
                    SELECT // EXECUTE
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Background Ambience Layers */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#001a1d_0%,_#000000_100%)]"></div>
      </div>

      {/* CRT Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-5 mix-blend-overlay">
        <div className="w-full h-full bg-[repeating-linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      </div>
    </div>
  );
};

export default App;
