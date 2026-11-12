import React from 'react';
import { X } from 'lucide-react';
import { Mission, VolunteerProfile } from '../../types';

interface BenevolesInscritsModalProps {
  mission: Mission;
  volunteers: VolunteerProfile[];
  onClose: () => void;
}

export const BenevolesInscritsModal: React.FC<BenevolesInscritsModalProps> = ({
  mission,
  volunteers,
  onClose,
}) => {
  // Collect all enrolled user IDs for this mission
  const enrolledIds = Array.from(
    new Set(mission.creneaux.flatMap((c) => c.enrolledUserIds))
  );

  // Match volunteer profiles
  const enrolledVolunteers = enrolledIds.map((id) => {
    const found = volunteers.find((v) => v.id === id);
    if (found) return found;
    // Fallback if not found in list
    return {
      id,
      name: 'Bénévole',
      username: `@user_${id.slice(-4)}`,
      email: `${id}@bnevo.fr`,
      phone: '06 00 00 00 00',
      city: 'Paris',
      avatarUrl: '',
      skills: [],
      interests: [],
      totalHours: 12,
      missionsCount: 2,
      availableDays: [],
      emergencyContact: { name: '', phone: '', relationship: '' },
    };
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header matching Image 2 */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display tracking-wide uppercase">
            BÉNÉVOLES INSCRITS
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Volunteers List matching Image 2 */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {enrolledVolunteers.length > 0 ? (
            enrolledVolunteers.map((vol) => (
              <div
                key={vol.id}
                className="bg-[#d1fae5]/80 hover:bg-[#a7f3d0]/80 transition-colors rounded-2xl p-3.5 flex items-center gap-3.5 border border-emerald-200/60"
              >
                {/* Volunteer Avatar */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 shadow-2xs">
                  {vol.avatarUrl ? (
                    <img
                      src={vol.avatarUrl}
                      alt={vol.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-sm text-emerald-800 bg-emerald-200">
                      {vol.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name and Handle/Username */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {vol.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {vol.username || `@${vol.name.toLowerCase().replace(/\s+/g, '_')}`}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              Aucun bénévole inscrit à cette mission pour le moment.
            </div>
          )}
        </div>

        {/* Fermer Button matching Image 2 */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer text-center"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
