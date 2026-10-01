import React, { useState } from 'react';
import { Compass, Sparkles, Volume2, ArrowRight, RotateCcw, Heart, Wind } from 'lucide-react';
import { webAudioService } from '../../lib/webAudio';

interface StoryNode {
  id: string;
  scenery: string;
  narrative: string;
  reflection?: string;
  choices: Array<{
    label: string;
    nextNodeId: string;
    soundIndex: number;
  }>;
}

export const WalkWithMeStory: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');

  const storyNodes: Record<string, StoryNode> = {
    start: {
      id: 'start',
      scenery: '🌲 Evening Campus Pathway',
      narrative: 'You don’t have to explain anything right now. You don’t have to have any answers. Just come with me.',
      reflection: 'The air outside the hostel is cool. The daytime rush has slowed to a whisper.',
      choices: [
        { label: 'Keep walking down the tree path', nextNodeId: 'tree_path', soundIndex: 0 },
        { label: 'Stop and pause for a moment', nextNodeId: 'pause_bench', soundIndex: 1 }
      ]
    },
    tree_path: {
      id: 'tree_path',
      scenery: '🍃 Gulmohar Tree Canopy',
      narrative: 'The path winds under the tall trees. Leaves rustle softly overhead. There is no deadline here, no notifications waiting, no one expecting you to perform.',
      reflection: 'Notice your footsteps touching the ground. Left, right. Steady and unhurried.',
      choices: [
        { label: 'Head toward the campus pond', nextNodeId: 'campus_pond', soundIndex: 2 },
        { label: 'Sit on the wooden swing', nextNodeId: 'wooden_swing', soundIndex: 3 }
      ]
    },
    pause_bench: {
      id: 'pause_bench',
      scenery: '🪑 Quiet Stone Bench',
      narrative: 'Let’s sit right here. Drop your shoulders away from your ears. Release that tight grip in your jaw. Nobody is grading this moment.',
      reflection: 'Sometimes stopping is the bravest thing we can do when everything feels too fast.',
      choices: [
        { label: 'Take three slow breaths with Maddy', nextNodeId: 'breathe_together', soundIndex: 1 },
        { label: 'Continue walking toward the pond', nextNodeId: 'campus_pond', soundIndex: 2 }
      ]
    },
    campus_pond: {
      id: 'campus_pond',
      scenery: '🌊 The Campus Reflection Pond',
      narrative: 'Small ripples move across the dark water. The library lights glow in the distance. The day was hard, but it is over now. You made it through.',
      reflection: 'Whatever happened earlier—a low mark, an unreturned call, a moment of feeling left behind—it does not define your future.',
      choices: [
        { label: 'Listen to the evening rain begin', nextNodeId: 'listen_rain', soundIndex: 3 },
        { label: 'Share what was heaviest today', nextNodeId: 'gentle_closing', soundIndex: 0 }
      ]
    },
    wooden_swing: {
      id: 'wooden_swing',
      scenery: '🪵 Quiet Wooden Swing',
      narrative: 'Gently swaying in the evening breeze. A gentle rhythm that requires zero effort. You are allowed to take up space without having everything figured out.',
      reflection: 'One small breath at a time. The world can wait until tomorrow.',
      choices: [
        { label: 'Stay here in the quiet', nextNodeId: 'gentle_closing', soundIndex: 2 }
      ]
    },
    breathe_together: {
      id: 'breathe_together',
      scenery: '🌿 Stillness Under The Stars',
      narrative: 'Breathe in slowly through your nose for 4 counts... hold gently... and let it all release out your mouth. Feel the weight lift from your chest.',
      reflection: 'Your nervous system is slowly realizing: you are safe in this moment.',
      choices: [
        { label: 'Walk slowly toward the pond', nextNodeId: 'campus_pond', soundIndex: 2 }
      ]
    },
    listen_rain: {
      id: 'listen_rain',
      scenery: '🌧️ Rain Over The Water',
      narrative: 'Soft droplets tap against the water surface. The sound washes over the noise of thoughts and unread emails. You are here, grounded and alive.',
      reflection: 'Rain washes away the dust of a long day. Tomorrow is a completely blank canvas.',
      choices: [
        { label: 'Complete our walk with peaceful clarity', nextNodeId: 'gentle_closing', soundIndex: 1 }
      ]
    },
    gentle_closing: {
      id: 'gentle_closing',
      scenery: '🕯️ Warm Campus Lantern',
      narrative: 'Thank you for walking with me tonight. Remember: you do not have to conquer your whole degree or solve your entire life tonight. Just focus on resting well.',
      reflection: 'You are resilient, even when you feel tired. Sleep gently tonight.',
      choices: [
        { label: 'Walk with me again anytime', nextNodeId: 'start', soundIndex: 0 }
      ]
    }
  };

  const currentNode = storyNodes[currentNodeId] || storyNodes['start'];

  const handleSelectChoice = (nextNodeId: string, soundIdx: number) => {
    webAudioService.playHarmonicChord(soundIdx);
    setCurrentNodeId(nextNodeId);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-calm-700">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Story</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            Walk With Me
          </h3>
        </div>
        <button
          onClick={() => setCurrentNodeId('start')}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          title="Restart walk"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Interactive Story Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-calm-50/80 via-teal-50/40 to-slate-50 border border-calm-200/80 space-y-5 shadow-xs">
        {/* Scenery Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-calm-800 bg-white/90 border border-calm-200 px-3 py-1 rounded-full shadow-2xs">
            {currentNode.scenery}
          </span>
        </div>

        {/* Narrative Voice */}
        <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed font-serif">
          "{currentNode.narrative}"
        </p>

        {/* Quiet Reflection */}
        {currentNode.reflection && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-calm-400 pl-3">
            {currentNode.reflection}
          </p>
        )}

        {/* Branching Choices */}
        <div className="pt-2 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            What feels right right now?
          </span>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            {currentNode.choices.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectChoice(ch.nextNodeId, ch.soundIndex)}
                className="px-4 py-3 rounded-2xl bg-white hover:bg-calm-50 border border-slate-200 hover:border-calm-300 text-slate-800 text-xs sm:text-sm font-bold text-left transition flex items-center justify-between gap-2 shadow-2xs group cursor-pointer"
              >
                <span>{ch.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-calm-700 group-hover:translate-x-0.5 transition shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
