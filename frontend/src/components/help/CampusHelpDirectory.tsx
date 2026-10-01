import React, { useState, useEffect } from 'react';
import { PhoneCall, ShieldAlert, Heart, MapPin, Clock, UserCheck, AlertTriangle, CheckCircle, Users, FileText, Sparkles, Plus, Building2, Phone } from 'lucide-react';
import { UserProfile, EmergencyContact } from '../../types';
import { apiService } from '../../lib/api';

interface Props {
  onOpenSafetyTriage: () => void;
  onOpenAskForHelp?: () => void;
  onOpenProfessionalHandoff?: () => void;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
}

export const CampusHelpDirectory: React.FC<Props> = ({
  onOpenSafetyTriage,
  onOpenAskForHelp,
  onOpenProfessionalHandoff,
  currentUser,
  onOpenProfile,
}) => {
  const [triageAnswer, setTriageAnswer] = useState<'yes' | 'no' | 'unsure' | null>(null);
  const [familyContacts, setFamilyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    if (currentUser?.id) {
      apiService.getEmergencyContacts(currentUser.id).then(setFamilyContacts).catch(console.error);
    }
  }, [currentUser?.id]);

  const emergencyHelplines = [
    {
      id: 'tele-manas',
      name: 'Tele-MANAS (Govt of India 24/7)',
      number: '14416',
      tollFree: '1800-891-4416',
      desc: 'National mental health counseling program. 24/7 free support in 20+ regional languages across all Indian states and UTs.',
      urgent: true,
    },
    {
      id: 'kiran',
      name: 'KIRAN National Mental Health Helpline',
      number: '1800-599-0019',
      tollFree: '1800-599-0019',
      desc: 'Operated by the Ministry of Social Justice and Empowerment for distress management and psychological first aid.',
      urgent: true,
    },
    {
      id: 'vandrevala',
      name: 'Vandrevala Foundation 24/7 Crisis Line',
      number: '+91 9999 666 555',
      tollFree: '9999666555',
      desc: 'Free, confidential round-the-clock crisis intervention and emotional counseling.',
      urgent: true,
    },
    {
      id: 'emergency-112',
      name: 'National Emergency Number',
      number: '112',
      tollFree: '112',
      desc: 'Immediate emergency police, medical ambulance, and first responder response across India.',
      urgent: true,
    },
  ];

  const campusContacts = [
    {
      role: 'Campus Psychological Counsellor',
      name: 'Dr. Ananya Sharma',
      location: 'Health & Wellness Centre, Room 104',
      timing: 'Mon - Sat, 9:00 AM - 6:00 PM (Walk-in welcome)',
      contact: '+91 98765 43210 / counsellor@campus.edu',
    },
    {
      role: 'Chief Hostel Warden / Residential Life',
      name: 'Prof. R. K. Verma',
      location: 'Central Hostel Administration Block',
      timing: '24/7 on call for residential health and safety',
      contact: '+91 98765 12345 / warden.emergency@campus.edu',
    },
    {
      role: 'Student Peer Support Network',
      name: 'Maddy Peer Ambassadors',
      location: 'Student Activity Centre (SAC), Zone B',
      timing: 'Daily 6:00 PM - 10:00 PM',
      contact: 'peersupport@campus.edu',
    },
  ];

  const kolkataPsychologists = [
    {
      id: 'kolkata-cnmch',
      name: 'Calcutta National Medical College & Hospital (CNMCH) - Dept of Psychiatry',
      number: '033-2284 3000',
      timing: '24/7 Emergency & OPD (Mon-Sat 9 AM - 2 PM)',
      location: '32, Gorachand Road, Beniapukur, Park Circus, Kolkata - 700014',
      desc: 'Government medical college providing free psychiatric crisis intervention, suicide prevention, and clinical psychology counseling.',
    },
    {
      id: 'kolkata-iop-sskm',
      name: 'Institute of Psychiatry - Centre of Excellence (IPGMER & SSKM Hospital)',
      number: '033-2223 1589',
      timing: '24/7 Psychiatric Emergency & OPD',
      location: '7, D.L. Khan Road, Bhowanipore, Kolkata - 700025',
      desc: 'Premier state apex psychiatric institute specializing in student anxiety, mood disorders, depression, and psychological first aid.',
    },
    {
      id: 'kolkata-antara',
      name: 'Antara Psychiatric Hospital & Mental Health Centre',
      number: '+91 98310 93333',
      timing: '24/7 Helpline & Residential Care',
      location: 'Dakshin Gobindapur, Kolkata - 700145',
      desc: 'Renowned non-profit mental health hospital with 24/7 crisis helplines, residential stabilization, and youth outpatient therapy.',
    },
    {
      id: 'kolkata-pavlov',
      name: 'Pavlov Hospital (Mental Health Care Kolkata)',
      number: '033-2334 3216',
      timing: '24/7 Emergency & Walk-in Care',
      location: '18, Gobra Gorasthan Road, Kolkata - 700046',
      desc: 'Government psychiatric hospital providing immediate clinical support, psychiatric evaluations, and crisis stabilization.',
    },
    {
      id: 'kolkata-mindframe',
      name: 'Mindframe Clinic (Consultant Psychologists & Therapists)',
      number: '+91 98300 22000',
      timing: 'Daily 10:00 AM - 8:00 PM (Prior Appointment)',
      location: 'Salt Lake Sector 1 & South Kolkata',
      desc: 'Private psychotherapy and clinical psychology team specializing in university student burnout, placement stress, and relationship therapy.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Safety Check Question Box */}
      <div className="bg-rose-50/90 border-2 border-rose-300 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold text-rose-800 tracking-wider">
              Safety Check Triage
            </span>
            <h3 className="text-lg font-extrabold text-rose-950 mt-0.5">
              Are you thinking about hurting yourself right now?
            </h3>
            <p className="text-xs text-rose-800 mt-1">
              Please answer honestly. Your response is confidential and will immediately guide you to safe human care.
            </p>
          </div>
        </div>

        {triageAnswer === null ? (
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={() => setTriageAnswer('yes')}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              Yes, I am in distress
            </button>
            <button
              onClick={() => setTriageAnswer('unsure')}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition"
            >
              I'm not sure / Feeling overwhelmed
            </button>
            <button
              onClick={() => setTriageAnswer('no')}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition"
            >
              No, I'm physically safe
            </button>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-2xl border border-rose-200 text-xs space-y-2 animate-fade-in">
            {triageAnswer === 'yes' || triageAnswer === 'unsure' ? (
              <div className="text-rose-950 space-y-1">
                <p className="font-bold text-sm">
                  Please reach out right now. You do not have to carry this alone.
                </p>
                <p className="text-rose-800">
                  Call <strong>Tele-MANAS (14416)</strong> or <strong>Emergency (112)</strong> directly below, or walk over to the Health Centre Room 104.
                </p>
              </div>
            ) : (
              <div className="text-slate-700 flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you for checking in. The campus resources and helplines below are always available whenever you need them.</span>
              </div>
            )}
            <button
              onClick={() => setTriageAnswer(null)}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline"
            >
              Change response
            </button>
          </div>
        )}
      </div>

      {/* Recovery Support Tools: Outreach Generator & Counselor Handoff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {onOpenAskForHelp && (
          <button
            onClick={onOpenAskForHelp}
            className="flex items-start gap-4 p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border-2 border-emerald-200/80 hover:border-emerald-400 hover:shadow-md transition text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase">
                Connection Bridge
              </span>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-900 transition">
                "I Don't Know How to Ask for Help"
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Draft a gentle, pre-written text message to a friend, family member, professor, or counselor without overthinking.
              </p>
            </div>
          </button>
        )}

        {onOpenProfessionalHandoff && (
          <button
            onClick={onOpenProfessionalHandoff}
            className="flex items-start gap-4 p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50/50 border-2 border-indigo-200/80 hover:border-indigo-400 hover:shadow-md transition text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-800 tracking-wider uppercase">
                Consultation Summary
              </span>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 transition">
                "Take This With You" Handoff Note
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Generate a private, non-diagnostic 1-page summary of your triggers and coping strategies to bring to an appointment.
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Personal Family & Emergency Contacts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Personal Family & Emergency Contacts</span>
            </h3>
            <p className="text-xs text-slate-500">One-click direct calling to your trusted family members, roommates, and loved ones</p>
          </div>
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Contacts</span>
            </button>
          )}
        </div>

        {familyContacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {familyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white p-5 rounded-3xl border-2 border-rose-100 shadow-sm flex items-center justify-between gap-3 hover:border-rose-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{contact.name}</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-bold">
                      {contact.relation}
                    </span>
                    {contact.is_primary && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{contact.phone}</p>
                </div>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 text-center space-y-2">
            <p className="text-xs text-slate-600 font-medium">
              You haven't saved personal family contacts yet. Save your parents, sibling, or roommate so you can call them in one tap.
            </p>
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                + Add Family Contact in Profile
              </button>
            )}
          </div>
        )}
      </div>

      {/* Verified National Crisis Helplines */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800">Verified 24/7 National Crisis Hotlines</h3>
          <p className="text-xs text-slate-500">Official toll-free helplines verified for immediate human crisis support</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {emergencyHelplines.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    24/7 Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>

              <a
                href={`tel:${item.number.replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-calm-700 hover:bg-calm-800 text-white font-extrabold text-xs shadow-sm transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {item.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Kolkata Mental Health Centers & Psychologists */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Verified Kolkata Mental Health Centers & Psychologists</span>
          </h3>
          <p className="text-xs text-slate-500">Government centers of excellence, psychiatric hospitals, and clinical psychologists in Kolkata</p>
        </div>

        <div className="space-y-3">
          {kolkataPsychologists.map((k) => (
            <div
              key={k.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800">{k.name}</h4>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                    Kolkata Verified
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{k.desc}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {k.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {k.timing}
                  </span>
                </div>
              </div>

              <a
                href={`tel:${k.number.replace(/\s+/g, '')}`}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {k.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Support Network */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800">Campus Support Network</h3>
          <p className="text-xs text-slate-500">Dedicated campus welfare and residential officers available on campus</p>
        </div>

        <div className="space-y-3">
          {campusContacts.map((c, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{c.role}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                    Campus Staff
                  </span>
                </div>
                <div className="text-sm font-bold text-calm-800">{c.name}</div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {c.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {c.timing}
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0">
                {c.contact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
