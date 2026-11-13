import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Calendar, MapPin } from 'lucide-react';
import { Mission } from '../../types';

interface ImprevuModalProps {
  enrolledMissions: Array<{ mission: Mission; creneauId: string }>;
  onClose: () => void;
  onConfirmAbsence: (missionId: string, creneauId: string, reason: string) => void;
}

export const ImprevuModal: React.FC<ImprevuModalProps> = ({
  enrolledMissions,
  onClose,
  onConfirmAbsence,
}) => {
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const [selectedReason, setSelectedReason] = useState('Contretemps personnel ou familial');
  const [note, setNote] = useState('');

  const reasons = [
    'Contretemps personnel ou familial',
    'Maladie / Raison de santé',
    'Problème de transport / Déplacement',
    'Impératif professionnel',
    'Autre imprévu',
  ];

  const currentSelection = enrolledMissions[selectedMissionIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelection) return;
    onConfirmAbsence(
      currentSelection.mission.id,
      currentSelection.creneauId,
      `${selectedReason}${note ? ` (${note})` : ''}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 font-display uppercase tracking-wide">
              J'AI UN IMPRÉVU
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {enrolledMissions.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-slate-600">
              Vous n'avez aucune mission active à venir pour le moment.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
            <p className="text-slate-600 leading-relaxed">
              Un empêchement de dernière minute ? En signalant votre absence dès maintenant, votre place sera automatiquement remise à disposition pour un autre bénévole et l'organisateur sera averti.
            </p>

            {/* Mission selection if multiple */}
            {enrolledMissions.length > 1 && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Mission concernée
                </label>
                <select
                  value={selectedMissionIndex}
                  onChange={(e) => setSelectedMissionIndex(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {enrolledMissions.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.mission.title} ({item.mission.startDate})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Current Mission Card Summary */}
            {currentSelection && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 bg-[#d1fae5] px-2 py-0.5 rounded-md uppercase">
                  {currentSelection.mission.organizationName}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">
                  {currentSelection.mission.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentSelection.mission.startDate}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentSelection.mission.location}</span>
                </div>
              </div>
            )}

            {/* Reason selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Motif du désistement
              </label>
              <div className="space-y-1.5">
                {reasons.map((r) => (
                  <label
                    key={r}
                    onClick={() => setSelectedReason(r)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedReason === r
                        ? 'border-emerald-500 bg-emerald-50/60 text-slate-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="imprevu-reason"
                      checked={selectedReason === r}
                      onChange={() => setSelectedReason(r)}
                      className="accent-emerald-600"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional message */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Message pour le coordinateur (optionnel)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: Vraiment désolé, je me rattraperai sur la prochaine mission !"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer text-center shadow-xs"
              >
                Signaler mon absence et libérer ma place
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
