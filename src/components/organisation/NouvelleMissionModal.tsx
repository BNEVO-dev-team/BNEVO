import React, { useState } from 'react';
import { X, Calendar, Flag, Plus, Trash2, MapPin } from 'lucide-react';
import { MissionObjective } from '../../types';
import { PointRendezVousModal } from './PointRendezVousModal';

interface NouvelleMissionModalProps {
  initialDate?: string; // YYYY-MM-DD or DD/MM/YYYY
  onClose: () => void;
  onSubmit: (newMission: {
    title: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    location: string;
    objectifs: MissionObjective[];
  }) => void;
}

export const NouvelleMissionModal: React.FC<NouvelleMissionModalProps> = ({
  initialDate,
  onClose,
  onSubmit,
}) => {
  // Format initial date to DD/MM/YYYY
  const formatInitialDate = (raw?: string) => {
    if (!raw) return '01/10/2026';
    if (raw.includes('-')) {
      const [y, m, d] = raw.split('-');
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
    return raw;
  };

  const defaultDateStr = formatInitialDate(initialDate);

  // EMPTY by default as requested! (Placeholders match Image 1)
  const [title, setTitle] = useState('');
  const [startDateTime, setStartDateTime] = useState(`${defaultDateStr} 09:00`);
  const [endDateTime, setEndDateTime] = useState(`${defaultDateStr} 12:00`);
  const [location, setLocation] = useState('');

  // Objectives are OPTIONAL and EMPTY by default matching Image 1!
  const [objectifs, setObjectifs] = useState<MissionObjective[]>([]);

  const [editingObjectiveIndex, setEditingObjectiveIndex] = useState<number | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleOpenMapForNew = () => {
    setEditingObjectiveIndex(null);
    setIsMapModalOpen(true);
  };

  const handleOpenMapForExisting = (index: number) => {
    setEditingObjectiveIndex(index);
    setIsMapModalOpen(true);
  };

  const handleMapConfirm = (point: { name: string; lat: number; lng: number }) => {
    if (editingObjectiveIndex !== null) {
      setObjectifs((prev) =>
        prev.map((obj, i) =>
          i === editingObjectiveIndex ? { ...obj, ...point } : obj
        )
      );
    } else {
      setObjectifs((prev) => [
        ...prev,
        { id: `obj_${Date.now()}`, ...point },
      ]);
    }
    setIsMapModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim();
    if (!finalTitle) return;

    // Parse start & end dates
    const [startDatePart, startTimePart] = startDateTime.split(' ');
    const [endDatePart, endTimePart] = endDateTime.split(' ');

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const toIso = (str?: string) => {
      if (!str) return '2026-10-01';
      if (str.includes('/')) {
        const [d, m, y] = str.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
      return str;
    };

    onSubmit({
      title: finalTitle,
      startDate: toIso(startDatePart),
      endDate: toIso(endDatePart || startDatePart),
      startTime: startTimePart || '09:00',
      endTime: endTimePart || '12:00',
      location: location.trim() || 'Marseille',
      objectifs,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header matching Image 1 */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display tracking-wide uppercase">
              NOUVELLE MISSION
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
            {/* Titre de la mission (Empty by default with placeholder Ex: Ramassage plage) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Titre de la mission
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Ramassage plage"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Début & Fin row matching Image 1 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Début
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Fin
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Lieu global (Empty by default with placeholder Ex: Marseille) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Lieu global
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Marseille"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Objectifs Précis Header matching Image 1 */}
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
                <Flag className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span className="text-xs font-extrabold uppercase tracking-wider font-display">
                  OBJECTIFS PRÉCIS
                </span>
              </div>

              {/* Show list of objectives if user added any (optional) */}
              {objectifs.length > 0 && (
                <div className="space-y-2 mb-2">
                  {objectifs.map((obj, idx) => (
                    <div
                      key={obj.id}
                      onClick={() => handleOpenMapForExisting(idx)}
                      className="bg-[#d1fae5]/80 hover:bg-[#a7f3d0] border border-emerald-300/80 rounded-2xl p-3 text-left transition-colors cursor-pointer group flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                          {obj.name}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 mt-1">
                          <span>Lat: {obj.lat.toFixed(4)}</span>
                          <span>Lng: {obj.lng.toFixed(4)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-white/70 px-2 py-0.5 rounded-md">
                          Modifier
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setObjectifs((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* + Nouvel objectif géographique button matching Image 1 */}
              <button
                type="button"
                onClick={handleOpenMapForNew}
                className="w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel objectif géographique</span>
              </button>
            </div>

            {/* Lancer la mission button matching Image 1 */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
              >
                Lancer la mission
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Point de rendez-vous real map modal */}
      {isMapModalOpen && (
        <PointRendezVousModal
          initialName={
            editingObjectiveIndex !== null
              ? objectifs[editingObjectiveIndex].name
              : 'Poste bénévoles'
          }
          initialLat={
            editingObjectiveIndex !== null
              ? objectifs[editingObjectiveIndex].lat
              : 48.8566
          }
          initialLng={
            editingObjectiveIndex !== null
              ? objectifs[editingObjectiveIndex].lng
              : 2.3522
          }
          onClose={() => setIsMapModalOpen(false)}
          onConfirm={handleMapConfirm}
        />
      )}
    </>
  );
};
