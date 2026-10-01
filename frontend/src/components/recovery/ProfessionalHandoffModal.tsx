import React, { useState, useEffect } from 'react';
import { X, FileText, Printer, Copy, Check, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { ProfessionalHandoff } from '../../types';
import { apiService } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfessionalHandoffModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [summary, setSummary] = useState<ProfessionalHandoff | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadSummary();
    }
  }, [isOpen]);

  const loadSummary = async () => {
    setIsLoading(true);
    const data = await apiService.generateHandoffSummary({
      timeline: 'Past 3 to 4 weeks (ongoing semester)',
      primary_concerns: [
        'Persistent cognitive fatigue and study initiation paralysis',
        'Fluctuating low mood with evening anxiety surges',
        'Disrupted sleep onset and waking unrefreshed'
      ],
      what_helped: [
        '4-4-4 Box breathing resets during acute tension',
        '5-minute micro study missions ("just opening notes")',
        'Monsoon rain ambient soundscape before sleeping'
      ],
      what_did_not_help: [
        '10-hour unstructured cramming marathons',
        'Late-night LinkedIn placement doomscrolling',
        'Generic motivational pep talks'
      ],
      questions_to_ask: [
        'How can I rebuild my sleep schedule without waking up in exam panic?',
        'What strategies can help me pace high-stakes project deliverables?',
        'Are there campus wellness workshops or accommodations I should register for?'
      ]
    });
    setSummary(data);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!summary) return;
    const text = `
${summary.title}
Date: ${summary.date_prepared}
Timeline: ${summary.timeline}

${summary.disclaimer}

PRIMARY CONCERNS:
${summary.primary_concerns.map(c => `- ${c}`).join('\n')}

WHAT HAS PROVIDED SOME RELIEF:
${summary.strategies_attempted.what_provided_some_relief.map(r => `- ${r}`).join('\n')}

WHAT PROVED UNHELPFUL:
${summary.strategies_attempted.what_proved_unhelpful.map(u => `- ${u}`).join('\n')}

QUESTIONS FOR COUNSELOR / DOCTOR:
${summary.student_questions_for_professional.map(q => `- ${q}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto print:p-0 print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-calm-100 flex items-center justify-center text-calm-800 shadow-xs">
              <FileText className="w-5 h-5 text-calm-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Take This With You</h2>
              <p className="text-xs text-slate-500">Non-diagnostic self-summary to support your counseling consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card */}
        {summary && (
          <div className="py-5 space-y-4 text-xs sm:text-sm">
            {/* Disclaimer Alert */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Important Note:</strong> {summary.disclaimer}
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4 print:border-none print:p-0">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-base text-slate-800">{summary.title}</h3>
                  <span className="text-xs text-slate-500">Timeline: {summary.timeline}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-white px-2 py-1 rounded border">
                  Prepared: {summary.date_prepared}
                </span>
              </div>

              {/* Primary Concerns */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">1. Primary Experiences & Pacing:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {summary.primary_concerns.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Strategies attempted */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <h5 className="font-bold text-xs text-emerald-900">What provided some relief:</h5>
                  <ul className="list-disc pl-4 space-y-0.5 text-xs text-emerald-800">
                    {summary.strategies_attempted.what_provided_some_relief.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
                  <h5 className="font-bold text-xs text-rose-900">What proved unhelpful:</h5>
                  <ul className="list-disc pl-4 space-y-0.5 text-xs text-rose-800">
                    {summary.strategies_attempted.what_proved_unhelpful.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Questions for professional */}
              <div className="space-y-1.5 pt-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">2. Questions I Want to Ask:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {summary.student_questions_for_professional.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Page</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-calm-700 hover:bg-calm-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
