import React, { useState } from 'react';
import { Eye, Hand, Ear, Sparkles, Smile, Check, ArrowRight } from 'lucide-react';

interface Props {
  onCompleteSession: () => void;
}

export const SensoryGrounding: React.FC<Props> = ({ onCompleteSession }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      count: 5,
      sense: 'SEE',
      icon: Eye,
      prompt: 'Look around your room or library. Notice 5 distinct physical objects.',
      subtext: 'e.g., The curve of your water bottle, a crack on the desk, the light on the wall, your notebook cover, a lamp.',
    },
    {
      count: 4,
      sense: 'FEEL',
      icon: Hand,
      prompt: 'Notice 4 physical sensations touching your body right now.',
      subtext: 'e.g., Your feet firmly pressing into the floor, texture of your jeans, back of the chair, cool breeze from the fan.',
    },
    {
      count: 3,
      sense: 'HEAR',
      icon: Ear,
      prompt: 'Listen carefully for 3 distinct sounds in your surroundings.',
      subtext: 'e.g., Distant traffic outside the hostel, hum of the laptop fan, rustling of lecture notes.',
    },
    {
      count: 2,
      sense: 'SMELL',
      icon: Sparkles,
      prompt: 'Notice 2 scents in the air around you.',
      subtext: 'e.g., Warm chai/coffee, pencil graphite, hostel laundry, or fresh air from the open window.',
    },
    {
      count: 1,
      sense: 'TASTE or BREATHE',
      icon: Smile,
      prompt: 'Notice 1 taste in your mouth, or take a sip of cool water.',
      subtext: 'e.g., Mint from toothpaste, water lingering, or simply moisten your lips and swallow slowly.',
    },
  ];

  const activeStep = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onCompleteSession();
    }
  };

  const Icon = activeStep.icon;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
          5-4-3-2-1 Sensory Grounding
        </span>
        <span className="text-xs font-semibold text-slate-400">
          Step {currentStep + 1} of 5
        </span>
      </div>

      {/* Progress Dots */}
      <div className="grid grid-cols-5 gap-2">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all ${
              idx <= currentStep ? 'bg-teal-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="space-y-4 text-center py-4">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto shadow-inner">
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-3xl font-extrabold text-slate-800">
            {activeStep.count} Things You Can {activeStep.sense}
          </div>
          <p className="text-sm font-semibold text-slate-700 max-w-md mx-auto">
            {activeStep.prompt}
          </p>
          <p className="text-xs text-slate-500 italic max-w-sm mx-auto">
            {activeStep.subtext}
          </p>
        </div>
      </div>

      {/* Next Step Button */}
      <button
        onClick={handleNext}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition"
      >
        <span>{currentStep === steps.length - 1 ? 'Complete Grounding' : 'Next Sense →'}</span>
      </button>
    </div>
  );
};
