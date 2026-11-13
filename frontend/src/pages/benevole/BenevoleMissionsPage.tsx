import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mission } from '../../types';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export const BenevoleMissionsPage: React.FC = () => {
  const { missions, currentUser, registerForSlot, unregisterFromSlot } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);

  const userId = currentUser?.id || 'vol_user_1';

  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedMissionId(expandedMissionId === id ? null : id);
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Espace Bénévoles</span>
              <span aria-hidden="true">·</span>
              <span>Recherche d'Engagement</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Catalogue des Missions Disponibles
            </h1>
          </div>

          <div className="text-xs text-slate-500">
            Choisissez un créneau horaire adapté à vos disponibilités.
          </div>
        </div>

        {/* Search and category filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une mission, un festival, une ville..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-200/60 rounded-lg">
            {['all', 'Accueil & Info', 'Bar & Restauration', 'Éco-Responsable', 'Solidarité & Social'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'Toutes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Missions list */}
        <div className="space-y-4">
          {filteredMissions.map((mission) => {
            const isExpanded = expandedMissionId === mission.id;
            const totalPlaces = mission.creneaux.reduce((acc, cr) => acc + cr.capacity, 0);
            const totalEnrolled = mission.creneaux.reduce((acc, cr) => acc + cr.enrolledUserIds.length, 0);
            const remaining = Math.max(0, totalPlaces - totalEnrolled);
            const isUserEnrolledInAny = mission.creneaux.some((cr) => cr.enrolledUserIds.includes(userId));

            return (
              <div
                key={mission.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-slate-500">
                        <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {mission.category}
                        </span>
                        <span>·</span>
                        <span className="font-medium text-slate-700">{mission.organizationName}</span>
                        {isUserEnrolledInAny && (
                          <>
                            <span>·</span>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              ✓ Vous participez
                            </span>
                          </>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-slate-900 font-display">
                        {mission.title}
                      </h2>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {mission.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{mission.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Du {mission.startDate} au {mission.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="tabular-nums font-semibold text-slate-800">
                            {remaining > 0 ? `${remaining} place(s) restante(s)` : 'Session complète'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(mission.id)}
                      className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200"
                    >
                      <span>{isExpanded ? 'Masquer les créneaux' : 'Choisir un créneau'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Perks list */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      Inclus pour les bénévoles :
                    </span>
                    {mission.perks.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expanded Slots Details */}
                {isExpanded && (
                  <div className="bg-slate-50/80 px-6 py-5 border-t border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Créneaux disponibles pour cette mission ({mission.creneaux.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mission.creneaux.map((cr) => {
                        const isEnrolled = cr.enrolledUserIds.includes(userId);
                        const isFull = cr.enrolledUserIds.length >= cr.capacity;
                        const spotsLeft = cr.capacity - cr.enrolledUserIds.length;

                        return (
                          <div
                            key={cr.id}
                            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                              isEnrolled
                                ? 'bg-emerald-50/60 border-emerald-300'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-900">
                                  {cr.date}
                                </span>
                                <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                  {cr.startTime} - {cr.endTime}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                <span>
                                  {spotsLeft > 0 ? `${spotsLeft} place(s) libre(s)` : 'Complet'}
                                </span>
                                <span className="tabular-nums font-medium">
                                  {cr.enrolledUserIds.length}/{cr.capacity} inscrits
                                </span>
                              </div>

                              {cr.notes && (
                                <p className="text-[11px] text-slate-500 italic mb-3">
                                  ℹ️ {cr.notes}
                                </p>
                              )}
                            </div>

                            {/* Action Button */}
                            <div className="pt-3 border-t border-slate-100">
                              {isEnrolled ? (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Vous êtes inscrit</span>
                                  </span>
                                  <button
                                    onClick={() => unregisterFromSlot(mission.id, cr.id)}
                                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline"
                                  >
                                    Se désister
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => registerForSlot(mission.id, cr.id)}
                                  disabled={isFull}
                                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                                    isFull
                                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                                  }`}
                                >
                                  {isFull ? 'Créneau complet' : "M'inscrire à ce créneau"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
