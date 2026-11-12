import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Plus, UserPlus, Filter } from 'lucide-react';

export const OrgPlanningPage: React.FC = () => {
  const { missions, volunteers, updateAttendance, showToast } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('all');

  // Extract unique dates from all slots
  const allDates = Array.from(
    new Set(
      missions.flatMap((m) => m.creneaux.map((cr) => cr.date))
    )
  ).sort();

  const filteredMissions = missions.map((m) => {
    if (selectedDate === 'all') return m;
    return {
      ...m,
      creneaux: m.creneaux.filter((cr) => cr.date === selectedDate),
    };
  }).filter((m) => m.creneaux.length > 0);

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Espace Organisation</span>
              <span aria-hidden="true">·</span>
              <span>Coordination Équipe</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Planning Général des Créneaux
            </h1>
          </div>

          {/* Date Selector Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Jour :</span>
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg">
              <button
                onClick={() => setSelectedDate('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedDate === 'all'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous les jours
              </button>
              {allDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedDate === date
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Planning Table Matrix */}
        <div className="space-y-6">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-teal-700">{mission.category}</span>
                    <span>·</span>
                    <span>{mission.location}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    {mission.title}
                  </h2>
                </div>
                <div className="text-xs text-slate-500">
                  Référent : <span className="font-semibold text-slate-700">{mission.referentName}</span> ({mission.referentPhone})
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {mission.creneaux.map((cr) => {
                  const isFull = cr.enrolledUserIds.length >= cr.capacity;
                  const isEmpty = cr.enrolledUserIds.length === 0;

                  return (
                    <div
                      key={cr.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-24 flex-shrink-0">
                          <p className="text-xs font-semibold text-slate-900">{cr.date}</p>
                          <p className="text-xs font-mono text-slate-500 font-medium">
                            {cr.startTime} - {cr.endTime}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded ${
                                isFull
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isEmpty
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {cr.enrolledUserIds.length} / {cr.capacity} places
                            </span>
                            {cr.notes && (
                              <span className="text-[11px] text-slate-400 italic">
                                Note : {cr.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Volunteer tags with Check-in buttons */}
                      <div className="flex flex-wrap items-center gap-2 flex-1 justify-start lg:justify-end">
                        {cr.enrolledUserIds.length === 0 ? (
                          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50/50 px-3 py-1 rounded border border-rose-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Aucun bénévole affecté — Créneau urgent</span>
                          </div>
                        ) : (
                          cr.enrolledUserIds.map((vId) => {
                            const vol = volunteers.find((v) => v.id === vId) || {
                              name: 'Bénévole',
                              id: vId,
                              phone: 'Non renseigné',
                            };
                            const status = cr.attendance?.[vId] || 'pending';

                            return (
                              <div
                                key={vId}
                                className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 pr-2.5 text-xs shadow-xs"
                              >
                                <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                  <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-slate-700">
                                    {vol.name.charAt(0)}
                                  </div>
                                </div>
                                <div className="text-left">
                                  <p className="font-semibold text-slate-900 leading-tight">
                                    {vol.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400 leading-tight">
                                    {vol.phone}
                                  </p>
                                </div>

                                <button
                                  onClick={() =>
                                    updateAttendance(
                                      mission.id,
                                      cr.id,
                                      vId,
                                      status === 'present' ? 'absent' : 'present'
                                    )
                                  }
                                  className={`ml-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                    status === 'present'
                                      ? 'bg-emerald-500 text-white'
                                      : status === 'absent'
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-slate-200 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                                  }`}
                                  title="Cliquer pour basculer la présence"
                                >
                                  {status === 'present'
                                    ? 'Présent ✓'
                                    : status === 'absent'
                                    ? 'Absent ✗'
                                    : 'Pointer'}
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
