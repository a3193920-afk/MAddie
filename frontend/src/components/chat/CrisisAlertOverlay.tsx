import React from 'react';
import { PhoneCall, ShieldAlert, Heart, ExternalLink, UserCheck } from 'lucide-react';
import { SafetyVerdict } from '../../types';

interface Props {
  verdict: SafetyVerdict;
  onDismissToHelp: () => void;
}

export const CrisisAlertOverlay: React.FC<Props> = ({ verdict, onDismissToHelp }) => {
  return (
    <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 animate-fade-in my-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold text-rose-800 tracking-wider">
              Immediate Safety Guardrail Active
            </span>
            <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">
              Hard-Stop Enforced
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-rose-950">
            You are not alone, and help is available right now.
          </h3>
          <p className="text-xs text-rose-800 leading-relaxed font-medium">
            Your message indicates that you may be going through intense emotional pain or crisis. 
            Because Maddy is a digital wellness companion and not a substitute for human professionals, 
            normal AI generation is paused to connect you immediately with verified human support.
          </p>
        </div>
      </div>

      {/* Emergency Hotlines Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Tele-MANAS */}
        <a
          href="tel:14416"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 shadow-sm transition group"
        >
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800">Tele-MANAS (Govt of India)</div>
            <div className="text-[11px] text-slate-500">24/7 Free National Mental Health Line</div>
            <div className="text-sm font-extrabold text-rose-700">Dial: 14416</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
            <PhoneCall className="w-4 h-4" />
          </div>
        </a>

        {/* KIRAN Helpline */}
        <a
          href="tel:18005990019"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 shadow-sm transition group"
        >
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800">KIRAN Helpline</div>
            <div className="text-[11px] text-slate-500">Mental Health Helpline, MSJE</div>
            <div className="text-sm font-extrabold text-rose-700">1800-599-0019</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
            <PhoneCall className="w-4 h-4" />
          </div>
        </a>

        {/* National Emergency */}
        <a
          href="tel:112"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 shadow-sm transition group"
        >
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800">National Emergency (All-in-One)</div>
            <div className="text-[11px] text-slate-500">Immediate Ambulance & Police Support</div>
            <div className="text-sm font-extrabold text-rose-700">Dial: 112</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
            <PhoneCall className="w-4 h-4" />
          </div>
        </a>

        {/* Campus Counsellor */}
        <div
          onClick={onDismissToHelp}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 shadow-sm transition group cursor-pointer"
        >
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800">Campus Psychological Wing</div>
            <div className="text-[11px] text-slate-500">Health & Wellness Centre, Rm 104</div>
            <div className="text-xs font-bold text-calm-700 underline">View Campus Contacts →</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-calm-100 text-calm-700 flex items-center justify-center group-hover:bg-calm-700 group-hover:text-white transition">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-rose-200 flex items-center justify-between text-xs text-rose-900 font-medium">
        <div className="flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-600 shrink-0" />
          <span>If you can, please also contact a trusted friend, roommate, or family member right now.</span>
        </div>
      </div>
    </div>
  );
};
