import React, { useState } from 'react';
import { X, Calendar, Flag, Plus, Trash2 } from 'lucide-react';
import { Mission, MissionObjective } from '../../types';
import { PointRendezVousModal } from './PointRendezVousModal';

interface EditerMissionModalProps {
  mission: Mission;
  onClose: () => void;
  onUpdate: (missionId: string, updatedData: {
    title: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    location: string;
    objectifs: MissionObjective[];
  }) => void;
  onDelete: (missionId: string) => void;
}

export const EditerMissionModal: React.FC<EditerMissionModalProps> = ({
  mission,
  onClose,
  onUpdate,
  onDelete,
}) => {
  // Format initial ISO date (YYYY-MM-DD) to DD/MM/YYYY
  const formatToDisplayDate = (isoStr?: string) => {
    if (!isoStr) return '20/06/2026';
    if (isoStr.includes('-')) {
      const parts = isoStr.split('-');
      if (parts.length === 3) {
        return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
      }
    }
    return isoStr;
  };

  const initialStartFormatted = `${formatToDisplayDate(mission.startDate)} ${mission.startTime || mission.creneaux[0]?.startTime || '09:00'}`;
  const initialEndFormatted = `${formatToDisplayDate(mission.endDate || mission.startDate)} ${mission.endTime || mission.creneaux[0]?.endTime || '12:00'}`;

  const [title, setTitle] = useState(mission.title);
  const [startDateTime, setStartDateTime] = useState(initialStartFormatted);
  const [endDateTime, setEndDateTime] = useState(initialEndFormatted);
  const [location, setLocation] = useState(mission.location);
  const [objectifs, setObjectifs] = useState<MissionObjective[]>(mission.objectifs || []);

  const [editingObjectiveIndex, setEditingObjectiveIndex] = useState<number | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

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
    if (!title.trim()) return;

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const toIso = (str?: string) => {
      if (!str) return mission.startDate;
      if (str.includes('/')) {
        const [d, m, y] = str.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
      return str;
    };

    const [startDatePart, startTimePart] = startDateTime.split(' ');
    const [endDatePart, endTimePart] = endDateTime.split(' ');

    onUpdate(mission.id, {
      title: title.trim(),
      startDate: toIso(startDatePart),
      endDate: toIso(endDatePart || startDatePart),
      startTime: startTimePart || '09:00',
      endTime: endTimePart || '12:00',
      location: location.trim() || mission.location,
      objectifs,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header matching Image 2 */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display tracking-wide uppercase">
              EDITER LA MISSION
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
            {/* Titre de la mission */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Titre de la mission
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            {/* Début & Fin row */}
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

            {/* Lieu global */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Lieu global
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            {/* Objectifs Précis Header */}
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
                <Flag className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span className="text-xs font-extrabold uppercase tracking-wider font-display">
                  OBJECTIFS PRÉCIS
                </span>
              </div>

              {/* Existing objectives list */}
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
                          aria-label="Supprimer cet objectif"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* + Nouvel objectif géographique button */}
              <button
                type="button"
                onClick={handleOpenMapForNew}
                className="w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel objectif géographique</span>
              </button>
            </div>

            {/* Mettre à jour button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer text-center"
              >
                Mettre à jour
              </button>
            </div>

            {/* Supprimer définitivement link with in-place safe confirmation */}
            <div className="text-center pt-2">
              {isConfirmingDelete ? (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 animate-in fade-in">
                  <span className="text-xs text-rose-700 font-semibold">
                    Confirmer la suppression ?
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDelete(mission.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      Oui, supprimer
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline transition-colors cursor-pointer py-1"
                >
                  Supprimer définitivement
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Point de rendez-vous real Leaflet map modal */}
      {isMapModalOpen && (
        <PointRendezVousModal
          initialName={
            editingObjectiveIndex !== null
              ? objectifs[editingObjectiveIndex].name
              : 'Objectif'
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
