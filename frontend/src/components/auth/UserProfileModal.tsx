import React, { useState, useEffect } from 'react';
import { X, User, Phone, Trash2, Plus, Shield, Heart, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile, EmergencyContact } from '../../types';
import { apiService } from '../../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onSignOut: () => void;
}

export const UserProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onSignOut,
}) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age);
  const [gender, setGender] = useState(currentUser.gender);
  const [college, setCollege] = useState(currentUser.college || '');

  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Parent');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      setName(currentUser.name);
      setAge(currentUser.age);
      setGender(currentUser.gender);
      setCollege(currentUser.college || '');
      loadContacts();
    }
  }, [currentUser, isOpen]);

  const loadContacts = async () => {
    if (!currentUser?.id) return;
    const c = await apiService.getEmergencyContacts(currentUser.id);
    setContacts(c);
  };

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await apiService.updateUserProfile(currentUser.id, {
        name,
        age,
        gender,
        college,
      });
      onUpdateUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    try {
      await apiService.addEmergencyContact(currentUser.id, {
        name: newContactName,
        relation: newContactRelation,
        phone: newContactPhone,
        is_primary: contacts.length === 0,
      });
      setNewContactName('');
      setNewContactPhone('');
      setIsAddingContact(false);
      loadContacts();
    } catch (err) {
      console.error('Add contact error:', err);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await apiService.deleteEmergencyContact(currentUser.id, contactId);
      loadContacts();
    } catch (err) {
      console.error('Delete contact error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200/80 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-calm-800 to-teal-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
              {currentUser.gender === 'female' ? '🌸' : currentUser.gender === 'male' ? '🌿' : '✨'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <p className="text-xs text-white/80">{currentUser.email} • {currentUser.college || 'Campus Scholar'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {savedSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully! Maddy has updated your context.</span>
            </div>
          )}

          {/* Edit Profile Details */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min={15}
                  max={65}
                  required
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                >
                  <option value="female">🌸 Female (Cycle Tracker On)</option>
                  <option value="male">🌿 Male</option>
                  <option value="non-binary">✨ Non-Binary</option>
                  <option value="prefer_not_to_say">🔒 Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus / Institution</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. JU / IIT KGP"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-calm-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-calm-700 hover:bg-calm-800 text-white font-bold text-xs shadow-sm transition"
            >
              Save Profile Changes
            </button>
          </form>

          {/* Emergency Family Contacts Manager */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                  Personal Emergency & Family Contacts
                </h3>
                <p className="text-[11px] text-slate-500">
                  Direct one-click dialable during moments of acute stress or panic.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingContact(!isAddingContact)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            </div>

            {/* List Contacts */}
            <div className="space-y-2">
              {contacts.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">
                  No emergency contacts saved yet. Add a parent, trusted friend, or sibling.
                </p>
              ) : (
                contacts.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">{c.name}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md font-semibold">
                            {c.relation}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">{c.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${c.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Contact Inline Form */}
            {isAddingContact && (
              <form onSubmit={handleAddContact} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3 animate-fade-in">
                <span className="text-xs font-bold text-rose-900 block">Add New Emergency Contact</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Name (e.g. Maa)"
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none"
                  />
                  <select
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Best Friend">Best Friend</option>
                    <option value="Roommate">Roommate</option>
                    <option value="Warden">Hostel Warden</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="tel"
                    required
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="+91 98300..."
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingContact(false)}
                    className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sign Out Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Data saved securely in local SQLite database.
            </span>
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
