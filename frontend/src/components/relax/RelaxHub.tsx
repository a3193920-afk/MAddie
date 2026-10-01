import React, { useState } from 'react';
import { Wind, Gamepad2, Headphones, Sparkles, Home, Compass, Film } from 'lucide-react';
import { BoxBreathing } from './BoxBreathing';
import { SensoryGrounding } from './SensoryGrounding';
import { SoundPlayer } from './SoundPlayer';
import { BubbleZenGame } from '../games/BubbleZenGame';
import { MindMatchGame } from '../games/MindMatchGame';
import { PatternFlowGame } from '../games/PatternFlowGame';
import { OutcomeFeedbackModal } from './OutcomeFeedbackModal';
import { MaddySpaceRoom } from './MaddySpaceRoom';
import { WalkWithMeStory } from './WalkWithMeStory';
import { LowStimVideosView } from './LowStimVideosView';

interface Props {
  onOpenJournal?: () => void;
  onTalkToMaddy?: () => void;
}

export const RelaxHub: React.FC<Props> = ({ onOpenJournal, onTalkToMaddy }) => {
  const [activeSection, setActiveSection] = useState<'room' | 'walk' | 'cartoons' | 'breathing' | 'grounding' | 'games' | 'audio'>('room');
  const [activeGame, setActiveGame] = useState<'bubble' | 'memory' | 'pattern'>('bubble');
  const [completedIntervention, setCompletedIntervention] = useState<{ id: string; name: string } | null>(null);

  const handleInterventionDone = (id: string, name: string) => {
    setCompletedIntervention({ id, name });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveSection('room')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border cursor-pointer shrink-0 ${
            activeSection === 'room'
              ? 'bg-calm-700 text-white border-calm-700 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Maddy Space (Room)</span>
        </button>

        <button
          onClick={() => setActiveSection('walk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border cursor-pointer shrink-0 ${
            activeSection === 'walk'
              ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Walk With Me (Story)</span>
        </button>

        <button
          onClick={() => setActiveSection('cartoons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border cursor-pointer shrink-0 ${
            activeSection === 'cartoons'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Calm Cartoons (Low-Stim)</span>
        </button>

        <button
          onClick={() => setActiveSection('breathing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border cursor-pointer shrink-0 ${
            activeSection === 'breathing'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>4-4-4 Box Breathing</span>
        </button>

        <button
          onClick={() => setActiveSection('grounding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border cursor-pointer shrink-0 ${
            activeSection === 'grounding'
              ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>5-4-3-2-1 Grounding</span>
        </button>

        <button
          onClick={() => setActiveSection('games')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border cursor-pointer shrink-0 ${
            activeSection === 'games'
              ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Distraction Lab (3)</span>
        </button>

        <button
          onClick={() => setActiveSection('audio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition border cursor-pointer shrink-0 ${
            activeSection === 'audio'
              ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Synthesized Audio</span>
        </button>
      </div>

      {/* Main Section Content */}
      <div className="space-y-6">
        {activeSection === 'room' && (
          <MaddySpaceRoom
            onOpenJournal={onOpenJournal}
            onOpenGame={() => setActiveSection('games')}
            onTalkToMaddy={onTalkToMaddy}
          />
        )}

        {activeSection === 'walk' && (
          <WalkWithMeStory />
        )}

        {activeSection === 'cartoons' && (
          <LowStimVideosView />
        )}

        {activeSection === 'breathing' && (
          <BoxBreathing onCompleteSession={() => handleInterventionDone('box_breathing', '4-4-4 Box Breathing Reset')} />
        )}

        {activeSection === 'grounding' && (
          <SensoryGrounding onCompleteSession={() => handleInterventionDone('grounding_54321', '5-4-3-2-1 Sensory Grounding')} />
        )}

        {activeSection === 'audio' && (
          <SoundPlayer />
        )}

        {activeSection === 'games' && (
          <div className="space-y-4">
            {/* Game Selector Sub-tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
              <button
                onClick={() => setActiveGame('bubble')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeGame === 'bubble' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Bubble Zen
              </button>
              <button
                onClick={() => setActiveGame('memory')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeGame === 'memory' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Mind Match
              </button>
              <button
                onClick={() => setActiveGame('pattern')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeGame === 'pattern' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Pattern Flow
              </button>
            </div>

            {activeGame === 'bubble' && (
              <BubbleZenGame onComplete={() => handleInterventionDone('bubble_zen', 'Bubble Zen Calming Game')} />
            )}
            {activeGame === 'memory' && (
              <MindMatchGame onComplete={() => handleInterventionDone('mind_match', 'Mind Match Memory Game')} />
            )}
            {activeGame === 'pattern' && (
              <PatternFlowGame onComplete={() => handleInterventionDone('pattern_flow', 'Pattern Flow Attention Game')} />
            )}
          </div>
        )}
      </div>

      {/* Outcome Feedback Modal */}
      {completedIntervention && (
        <OutcomeFeedbackModal
          isOpen={true}
          onClose={() => setCompletedIntervention(null)}
          interventionId={completedIntervention.id}
          interventionName={completedIntervention.name}
        />
      )}
    </div>
  );
};
