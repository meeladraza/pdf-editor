import { X, User, CheckCircle2 } from 'lucide-react';
import { AccountProfile } from '../data/bankAccounts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profiles: AccountProfile[];
  onSelect: (profile: AccountProfile) => void;
  activeProfileId?: string;
}

export const AccountSelectorModal = ({ isOpen, onClose, profiles, onSelect, activeProfileId }: Props) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800">Select Account</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Account list */}
        <div className="p-4 flex flex-col gap-2.5 max-h-80 overflow-y-auto">
          {profiles.map((profile, idx) => {
            const isActive = profile.id === activeProfileId;
            return (
              <button
                key={profile.id}
                onClick={() => { onSelect(profile); onClose(); }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${
                  isActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm transition-colors ${
                      isActive ? "text-blue-700" : "text-slate-800 group-hover:text-blue-700"
                    }`}>
                      {profile.label}
                    </div>
                    {profile.subtitle && (
                      <div className="text-xs text-slate-400 mt-0.5">{profile.subtitle}</div>
                    )}
                  </div>
                  {isActive && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">
            Dates and balances will not change when switching accounts.
          </p>
        </div>
      </div>
    </div>
  );
};
