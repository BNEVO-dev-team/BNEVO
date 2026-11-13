import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from '../../context/RouterContext';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CalendarPlus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const BenevolePlanningPage: React.FC = () => {
  const { currentUser, missions, unregisterFromSlot, showToast } = useApp();
  const userId = currentUser?.id || 'vol_user_1';

  const userSlots: Array<{
    mission: (typeof missions)[0];
    creneau: (typeof missions)[0]['creneaux'][0];
  }> = [];

  missions.forEach((m) => {
    m.creneaux.forEach((cr) => {
      if (cr.enrolledUserIds.includes(userId)) {
        userSlots.push({ mission: m, creneau: cr });
      }
    });
  });

  userSlots.sort((a, b) => a.creneau.date.localeCompare(b.creneau.date));

  const handleExportCalendar = (slot: (typeof userSlots)[0]) => {
    showToast(`Événement « ${slot.mission.title} » prêt pour synchronisation iCal/Google Calendar.`, 'info');
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Espace Bénévoles</span>
              <span aria-hidden="true">·</span>
              <span>Engagements</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Mon Planning & Mes Créneaux ({userSlots.length})
            </h1>
          </div>

          <Link
            href="/benevole/missions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
          >
            <span>Ajouter d'autres créneaux</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {userSlots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-800">
              Aucun créneau programmé
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Vous n'êtes actuellement inscrit à aucune mission. Parcourez le catalogue pour trouver des associations qui ont besoin d'aide !
            </p>
            <Link
              href="/benevole/missions"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Voir les missions disponibles
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userSlots.map(({ mission, creneau }) => {
              const status = creneau.attendance?.[userId] || 'pending';

              return (
                <div
                  key={creneau.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {mission.category}
                      </span>
                      <span>·</span>
                      <span className="text-slate-500">{mission.organizationName}</span>
                      <span>·</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                          status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {status === 'present' ? '✓ Présence validée' : 'Inscrit & Confirmé'}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 font-display">
                      {mission.title}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-slate-900">{creneau.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="font-mono text-slate-800">
                          {creneau.startTime} - {creneau.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="truncate">{mission.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Référent mission :{' '}
                        <strong className="text-slate-700">{mission.referentName}</strong> ({mission.referentPhone})
                      </span>
                    </div>
                  </div>

                  {/* Actions right */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                    <button
                      onClick={() => handleExportCalendar({ mission, creneau })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-teal-600" />
                      <span>Ajouter au calendrier</span>
                    </button>

                    <button
                      onClick={() => unregisterFromSlot(mission.id, creneau.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Se désister
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
