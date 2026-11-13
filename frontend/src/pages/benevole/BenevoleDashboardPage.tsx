import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  MapPin,
  Eye,
  MessageSquare,
  AlertTriangle,
  LayoutGrid,
  Globe,
  BookOpen
} from 'lucide-react';
import { BenevolesInscritsModal } from '../../components/organisation/BenevolesInscritsModal';
import { ObjectifsApercuModal } from '../../components/organisation/ObjectifsApercuModal';
import { DiscussionEquipeDrawer } from '../../components/organisation/DiscussionEquipeDrawer';
import { ImprevuModal } from '../../components/benevole/ImprevuModal';
import { AssociationsExplorer } from './AssociationsExplorer';
import { Mission } from '../../types';

export const BenevoleDashboardPage: React.FC = () => {
  const {
    currentUser,
    missions,
    volunteers,
    associations,
    joinedAssociationIds,
    unregisterFromSlot,
    showToast,
  } = useApp();

  const userId = currentUser?.id || 'vol_valentin';
  const currentVolunteer = volunteers.find((volunteer) => volunteer.id === userId);
  const currentAvatarUrl = currentUser?.avatarUrl || currentVolunteer?.avatarUrl;

  // Navigation tab pill: 'dashboard' vs 'explorer'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explorer'>('dashboard');

  // Selected date in "Mon Agenda"
  const [selectedAgendaDay, setSelectedAgendaDay] = useState<number>(2);

  // Modals state
  const [viewingVolunteersMission, setViewingVolunteersMission] = useState<Mission | null>(null);
  const [viewingObjectifsMission, setViewingObjectifsMission] = useState<Mission | null>(null);
  const [chatMission, setChatMission] = useState<Mission | null>(null);
  const [isImprevuModalOpen, setIsImprevuModalOpen] = useState(false);

  // Find missions where current user is enrolled
  const enrolledMissions = missions
    .map((m) => {
      const userCreneau = m.creneaux.find((c) => c.enrolledUserIds.includes(userId));
      return userCreneau ? { mission: m, creneauId: userCreneau.id } : null;
    })
    .filter((item): item is { mission: Mission; creneauId: string } => item !== null);

  const joinedAssociations = associations.filter((association) =>
    joinedAssociationIds.includes(association.id)
  );
  const enrolledAssosCount = joinedAssociationIds.length;

  // Agenda days: from Ven 2 to Sam 20
  const agendaDays = [
    { label: 'VEN', day: 2 },
    { label: 'SAM', day: 3 },
    { label: 'DIM', day: 4 },
    { label: 'LUN', day: 5 },
    { label: 'MAR', day: 6 },
    { label: 'MER', day: 7 },
    { label: 'JEU', day: 8 },
    { label: 'VEN', day: 9 },
    { label: 'SAM', day: 10 },
    { label: 'DIM', day: 11 },
    { label: 'LUN', day: 12 },
    { label: 'MAR', day: 13 },
    { label: 'MER', day: 14 },
    { label: 'JEU', day: 15 },
    { label: 'VEN', day: 16 },
    { label: 'SAM', day: 17 },
    { label: 'MER', day: 18 },
    { label: 'JEU', day: 19 },
    { label: 'VEN', day: 20 },
  ];

  const handleUnregister = (missionId: string, creneauId: string) => {
    unregisterFromSlot(missionId, creneauId);
  };

  const handleConfirmAbsence = (missionId: string, creneauId: string, reason: string) => {
    unregisterFromSlot(missionId, creneauId);
    setIsImprevuModalOpen(false);
    showToast(`Votre imprévu (${reason}) a été transmis à l'équipe. Votre créneau a été libéré.`, 'info');
  };

  if (activeTab === 'explorer') {
    return <AssociationsExplorer onBackToDashboard={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="flex-1 bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* CENTERED TAB PILL (Screenshot 1: Mon Dashboard / Explorer) */}
        <div className="flex justify-center">
          <div className="bg-[#d1fae5]/80 p-1 rounded-2xl flex items-center gap-1 shadow-2xs border border-emerald-200/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-emerald-900/80 hover:text-emerald-950'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-emerald-700" />
              <span>Mon Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-emerald-900/80 hover:text-emerald-950"
            >
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>Explorer</span>
            </button>
          </div>
        </div>

        {/* HERO SECTION ROW: Solid Green Card + Soft Pink "J'AI UN IMPRÉVU" Card (Screenshot 1) */}
        <div className="flex flex-col sm:flex-row gap-5 items-stretch">
          {/* Left Solid Green Card */}
          <div className="flex-1 bg-[#009560] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

            <div>
              {/* Asso Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {joinedAssociations.map((association) => (
                  <span
                    key={association.id}
                    className="bg-white/20 text-white font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full"
                  >
                    {association.name}
                  </span>
                ))}
              </div>

              {/* Big Greeting */}
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-wide uppercase">
                SALUT VALENTIN !
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
                Prêt pour tes prochaines missions ?
              </p>
            </div>

            {/* Stat Boxes Row */}
            <div className="flex items-center gap-3 pt-6">
              {/* 1 INSCRIT */}
              <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-4 w-28 sm:w-32">
                <div className="text-2xl sm:text-3xl font-black font-display leading-tight tabular-nums">
                  {enrolledMissions.length}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 mt-0.5">
                  INSCRIT
                </div>
              </div>

              {/* 2 ASSOS */}
              <div className="bg-white/20 backdrop-blur-xs rounded-2xl p-4 w-28 sm:w-32">
                <div className="text-2xl sm:text-3xl font-black font-display leading-tight tabular-nums">
                  {enrolledAssosCount}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 mt-0.5">
                  ASSOS
                </div>
              </div>
            </div>
          </div>

          {/* Right Soft Pink / Red Card: J'AI UN IMPRÉVU */}
          <button
            type="button"
            onClick={() => setIsImprevuModalOpen(true)}
            className="sm:w-56 bg-[#fef2f2] hover:bg-[#fee2e2] active:bg-[#fecaca] border border-rose-200/70 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-2xs group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100/90 text-rose-500 group-hover:scale-105 transition-transform flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#b91c1c] tracking-wider uppercase font-display">
              J'AI UN IMPRÉVU
            </span>
          </button>
        </div>

        {/* MON AGENDA (Screenshot 1) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-wide font-display uppercase">
              MON AGENDA
            </h2>
          </div>

          {/* Horizontal scrollable date pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {agendaDays.map((item) => {
              const isSelected = selectedAgendaDay === item.day;
              // Check if Valentin has a mission on this day (e.g. day 18)
              const hasEnrolledMission = enrolledMissions.some((em) => {
                const dateStr = em.mission.startDate;
                return dateStr.includes(item.day.toString().padStart(2, '0')) || dateStr.includes(`${item.day} juin`);
              });

              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setSelectedAgendaDay(item.day)}
                  className={`w-12 sm:w-14 h-16 sm:h-18 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-2 border-[#009560] bg-white shadow-xs'
                      : 'border border-slate-100 bg-white hover:border-emerald-300'
                  }`}
                >
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase">
                    {item.label}
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-800 font-display mt-0.5">
                    {item.day}
                  </span>

                  {hasEnrolledMission && (
                    <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-[#009560]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MON PLANNING (Screenshot 2) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-wide font-display uppercase">
              MON PLANNING
            </h2>
          </div>

          {enrolledMissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledMissions.map(({ mission, creneauId }) => {
                const isMaintenance =
                  mission.category.toUpperCase().includes('MAINTENANCE') ||
                  mission.category.toUpperCase().includes('TECH');
                const isSocial =
                  mission.category.toUpperCase().includes('SOCIAL') ||
                  mission.category.toUpperCase().includes('ACCUEIL');

                const timeDisplay =
                  mission.startTime && mission.endTime
                    ? `${mission.startTime} - ${mission.endTime}`
                    : '10:00 - 18:00';

                return (
                  <div
                    key={`enrolled_${mission.id}`}
                    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
                  >
                    <div>
                      {/* Top Badges Row matching Screenshot 2 */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                              isMaintenance
                                ? 'bg-[#fef3c7] text-[#92400e]'
                                : isSocial
                                ? 'bg-[#f3e8ff] text-[#6b21a8]'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {mission.category.toUpperCase()}
                          </span>

                          <span className="bg-[#d1fae5] text-emerald-800 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-emerald-700" />
                            <span>{mission.organizationName.toUpperCase()}</span>
                          </span>
                        </div>

                        {/* INSCRIT badge */}
                        <span className="bg-[#d1fae5] text-emerald-700 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md">
                          INSCRIT
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-extrabold text-slate-900 font-display mb-3">
                        {mission.title}
                      </h3>

                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{mission.startDate} • {timeDisplay}</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{mission.location}</span>
                      </div>

                      {/* Volunteers Bar (Valentin VA avatar + Eye icon) */}
                      <div className="bg-[#d1fae5]/80 rounded-2xl px-4 py-2.5 flex items-center justify-between mb-5">
                        <div className="flex items-center -space-x-1.5">
                          <div
                            className="w-7 h-7 rounded-xl bg-[#0284c7] text-white font-extrabold text-[10px] flex items-center justify-center shadow-2xs border-2 border-white overflow-hidden"
                            title={`${currentUser?.name || 'Valentin A'} (Vous)`}
                          >
                            {currentAvatarUrl ? (
                              <img src={currentAvatarUrl} alt={currentUser?.name || 'Valentin A'} className="h-full w-full object-cover" />
                            ) : 'VA'}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setViewingVolunteersMission(mission)}
                          className="text-emerald-700 hover:text-emerald-950 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Consulter les bénévoles inscrits"
                        >
                          <Eye className="w-4 h-4 stroke-[2]" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons: Se retirer + Chat button */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleUnregister(mission.id, creneauId)}
                        className="flex-1 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer text-center"
                      >
                        Se retirer
                      </button>
                      <button
                        type="button"
                        onClick={() => setChatMission(mission)}
                        className="w-11 h-11 rounded-xl bg-[#d1fae5] hover:bg-[#a7f3d0] active:bg-emerald-200 text-emerald-800 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                        title="Ouvrir la discussion d'équipe"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                Vous n'avez aucune mission active dans votre planning pour l'instant.
              </p>
              <p className="text-xs text-slate-500">
                Utilisez Explorer pour découvrir et rejoindre des associations.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* BÉNÉVOLES INSCRITS MODAL */}
      {viewingVolunteersMission && (
        <BenevolesInscritsModal
          mission={viewingVolunteersMission}
          volunteers={volunteers}
          onClose={() => setViewingVolunteersMission(null)}
        />
      )}

      {/* OBJECTIFS APERÇU MODAL */}
      {viewingObjectifsMission && (
        <ObjectifsApercuModal
          mission={viewingObjectifsMission}
          onClose={() => setViewingObjectifsMission(null)}
        />
      )}

      {/* DISCUSSION D'ÉQUIPE DRAWER */}
      {chatMission && (
        <DiscussionEquipeDrawer
          mission={chatMission}
          volunteers={volunteers}
          onClose={() => setChatMission(null)}
        />
      )}

      {/* J'AI UN IMPRÉVU MODAL */}
      {isImprevuModalOpen && (
        <ImprevuModal
          enrolledMissions={enrolledMissions}
          onClose={() => setIsImprevuModalOpen(false)}
          onConfirmAbsence={handleConfirmAbsence}
        />
      )}
    </div>
  );
};
