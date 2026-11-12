import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from '../../context/RouterContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Target,
  MapPin,
  Map,
  Eye,
  MessageSquare,
  Users
} from 'lucide-react';
import { NouvelleMissionModal } from '../../components/organisation/NouvelleMissionModal';
import { EditerMissionModal } from '../../components/organisation/EditerMissionModal';
import { BenevolesInscritsModal } from '../../components/organisation/BenevolesInscritsModal';
import { DiscussionEquipeDrawer } from '../../components/organisation/DiscussionEquipeDrawer';
import { ObjectifsApercuModal } from '../../components/organisation/ObjectifsApercuModal';
import { OrgDashboardCalendar } from '../../components/organisation/OrgDashboardCalendar';
import { Mission } from '../../types';

export const OrgDashboardPage: React.FC = () => {
  const { missions, volunteers, createMission, updateMission, deleteMission } = useApp();
  const { push } = useRouter();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<string>('2026-06-01');

  // Mission being edited / managed (from "Gérer" button)
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  // Mission whose volunteers are being inspected (from Eye icon 👁️)
  const [viewingVolunteersMission, setViewingVolunteersMission] = useState<Mission | null>(null);

  // Mission whose objectives are being previewed (from 🗺️ badge button)
  const [viewingObjectifsMission, setViewingObjectifsMission] = useState<Mission | null>(null);

  // Mission active in discussion drawer (from 💬 chat button)
  const [chatMission, setChatMission] = useState<Mission | null>(null);

  // Month state: Defaults to Juin 2026 matching original app, toggleable to Octobre 2026
  const [currentMonth, setCurrentMonth] = useState<'juin' | 'octobre'>('juin');

  // Active missions count
  const activeMissionsCount = missions.length;

  // Calculate enrolled volunteers / capacity
  const totalCapacity = missions.reduce(
    (acc, m) => acc + m.creneaux.reduce((cAcc, cr) => cAcc + cr.capacity, 0),
    0
  );
  const totalEnrolled = missions.reduce(
    (acc, m) => acc + m.creneaux.reduce((cAcc, cr) => cAcc + cr.enrolledUserIds.length, 0),
    0
  );

  // Calculate confirmed present volunteers
  let presencesCount = 0;
  missions.forEach((m) => {
    m.creneaux.forEach((cr) => {
      if (cr.attendance) {
        Object.values(cr.attendance).forEach((status) => {
          if (status === 'present') presencesCount++;
        });
      }
    });
  });

  // Clicking on a calendar day opens NouvelleMissionModal for that date
  const handleDayClick = (day: number) => {
    const monthNum = currentMonth === 'juin' ? '06' : '10';
    const dayStr = day.toString().padStart(2, '0');
    const selectedDate = `2026-${monthNum}-${dayStr}`;
    setModalInitialDate(selectedDate);
    setIsNewModalOpen(true);
  };

  const handleLaunchMission = (newMissionData: {
    title: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    location: string;
    objectifs: Array<{ id: string; name: string; lat: number; lng: number }>;
  }) => {
    createMission({
      title: newMissionData.title,
      organizationId: 'org_1',
      organizationName: 'Le Chant du Coq Solidaire',
      category: 'MAINTENANCE',
      description: `Mission créée le ${newMissionData.startDate} à ${newMissionData.location}.`,
      location: newMissionData.location,
      city: newMissionData.location,
      startDate: newMissionData.startDate,
      endDate: newMissionData.endDate,
      startTime: newMissionData.startTime,
      endTime: newMissionData.endTime,
      requiredSkills: ['Participation active', 'Bonne humeur'],
      perks: ['Équipement fourni', 'Collation offerte'],
      referentName: 'Adrien Dupont',
      referentPhone: '06 12 34 56 78',
      objectifs: newMissionData.objectifs,
      status: 'active',
      creneaux: [
        {
          id: `cr_${Date.now()}`,
          date: newMissionData.startDate,
          startTime: newMissionData.startTime,
          endTime: newMissionData.endTime,
          capacity: 4,
          enrolledUserIds: [],
          attendance: {},
        },
      ],
    });

    setIsNewModalOpen(false);
  };

  const handleUpdateMission = (
    missionId: string,
    updatedData: {
      title: string;
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      location: string;
      objectifs: Array<{ id: string; name: string; lat: number; lng: number }>;
    }
  ) => {
    updateMission(missionId, updatedData);
    setEditingMission(null);
  };

  const handleDeleteMission = (missionId: string) => {
    deleteMission(missionId);
    setEditingMission(null);
  };

  return (
    <div className="flex-1 bg-white py-8 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BANNER: PASSEZ À LA VITESSE SUPÉRIEURE ! */}
        <div className="bg-[#d1fae5]/80 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#a7f3d0] text-emerald-800 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wide font-display">
                PASSEZ À LA VITESSE SUPÉRIEURE !
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Découvrez nos offres Découverte et Premium pour une gestion encore plus fluide.
              </p>
            </div>
          </div>

          <button
            onClick={() => push('/organisation/offres')}
            className="px-5 py-2.5 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer self-start sm:self-auto whitespace-nowrap"
          >
            Voir les offres
          </button>
        </div>

        {/* 4 METRICS CARDS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: MISSIONS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase font-display">
              MISSIONS
            </span>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-3 tabular-nums">
              {activeMissionsCount}
            </span>
          </div>

          {/* Card 2: BÉNÉVOLES */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase font-display">
              BÉNÉVOLES
            </span>
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-display mt-3 tabular-nums">
              {totalEnrolled}/{totalCapacity || 5}
            </span>
          </div>

          {/* Card 3: PRÉSENCES */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase font-display">
              PRÉSENCES
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 font-display mt-3 tabular-nums">
              {presencesCount || 3}
            </span>
          </div>

          {/* Card 4: + NOUVELLE MISSION */}
          <button
            onClick={() => {
              setModalInitialDate(currentMonth === 'juin' ? '2026-06-01' : '2026-10-01');
              setIsNewModalOpen(true);
            }}
            className="bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center transition-all cursor-pointer group"
          >
            <Plus className="w-8 h-8 stroke-[2.5] mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase font-display">
              NOUVELLE MISSION
            </span>
          </button>
        </div>

        <OrgDashboardCalendar
          missions={missions}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onSelectDay={handleDayClick}
        />

        {/* GESTION DES MISSIONS SECTION */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-wide font-display uppercase">
            GESTION DES MISSIONS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => {
              const isMaintenance =
                mission.category.toUpperCase().includes('MAINTENANCE') ||
                mission.category.toUpperCase().includes('TECH');
              const isSocial =
                mission.category.toUpperCase().includes('SOCIAL') ||
                mission.category.toUpperCase().includes('ACCUEIL');

              const timeDisplay =
                mission.startTime && mission.endTime
                  ? `${mission.startTime} - ${mission.endTime}`
                  : mission.creneaux[0]
                  ? `${mission.creneaux[0].startTime} - ${mission.creneaux[0].endTime}`
                  : '09:00 - 12:00';

              const enrolledIds = mission.creneaux.flatMap((c) => c.enrolledUserIds);
              const objectifsCount = mission.objectifs?.length || 0;

              return (
                <div
                  key={mission.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
                >
                  <div>
                    {/* Category Pill */}
                    <div className="mb-3">
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
                    </div>

                    {/* Mission Title */}
                    <h3 className="text-base font-extrabold text-slate-900 font-display mb-3">
                      {mission.title}
                    </h3>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{mission.startDate} • {timeDisplay}</span>
                    </div>

                    {/* Location & Objectifs badge button (Screenshot 2 Match) */}
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{mission.location}</span>
                      </div>

                      {/* CLICKABLE OBJECTIFS COUNT BUTTON: Opens ObjectifsApercuModal */}
                      {objectifsCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setViewingObjectifsMission(mission)}
                          className="flex items-center gap-1.5 bg-[#d1fae5] hover:bg-[#a7f3d0] active:bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer border border-emerald-300/70 shadow-2xs group"
                          title="Cliquer pour afficher les objectifs sur la carte"
                        >
                          <Map className="w-3.5 h-3.5 text-emerald-700 group-hover:scale-110 transition-transform" />
                          <span>{objectifsCount}</span>
                        </button>
                      )}
                    </div>

                    {/* Volunteers Bar (Mint pill with avatars + Eye icon 👁️ for Bénévoles Inscrits) */}
                    <div className="bg-[#d1fae5]/80 rounded-2xl px-4 py-2.5 flex items-center justify-between mb-5">
                      <div
                        onClick={() => setViewingVolunteersMission(mission)}
                        className="flex items-center -space-x-2 cursor-pointer"
                        title="Consulter les bénévoles inscrits"
                      >
                        {enrolledIds.length > 0 ? (
                          enrolledIds.map((vId, idx) => {
                            const vol = volunteers.find((v) => v.id === vId);
                            return (
                              <div
                                key={idx}
                                className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-slate-200"
                                title={vol?.name || 'Bénévole'}
                              >
                                {vol?.avatarUrl ? (
                                  <img
                                    src={vol.avatarUrl}
                                    alt={vol.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-slate-700 bg-emerald-300">
                                    B
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                            <Users className="w-4 h-4 text-emerald-700" />
                            <span>1 inscrit en attente</span>
                          </div>
                        )}
                      </div>

                      {/* EYE ICON: Opens BÉNÉVOLES INSCRITS modal */}
                      <button
                        type="button"
                        onClick={() => setViewingVolunteersMission(mission)}
                        className="text-emerald-700 hover:text-emerald-950 hover:bg-emerald-200/60 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Consulter les bénévoles inscrits"
                        aria-label="Consulter les bénévoles inscrits"
                      >
                        <Eye className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons: Gérer (Opens EditerMissionModal) + Chat Button 💬 (Opens DiscussionEquipeDrawer) */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingMission(mission)}
                      className="flex-1 py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
                    >
                      Gérer
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatMission(mission)}
                      className="w-10 h-10 rounded-xl bg-[#d1fae5] hover:bg-[#a7f3d0] active:bg-emerald-200 text-emerald-800 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                      title="Ouvrir la discussion d'équipe"
                      aria-label="Discussion d'équipe"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* NOUVELLE MISSION MODAL */}
      {isNewModalOpen && (
        <NouvelleMissionModal
          initialDate={modalInitialDate}
          onClose={() => setIsNewModalOpen(false)}
          onSubmit={handleLaunchMission}
        />
      )}

      {/* EDITER LA MISSION MODAL (from Gérer button) */}
      {editingMission && (
        <EditerMissionModal
          mission={editingMission}
          onClose={() => setEditingMission(null)}
          onUpdate={handleUpdateMission}
          onDelete={handleDeleteMission}
        />
      )}

      {/* BÉNÉVOLES INSCRITS MODAL (from Eye icon 👁️) */}
      {viewingVolunteersMission && (
        <BenevolesInscritsModal
          mission={viewingVolunteersMission}
          volunteers={volunteers}
          onClose={() => setViewingVolunteersMission(null)}
        />
      )}

      {/* OBJECTIFS APERÇU MODAL (from 🗺️ badge button matching Screenshot 2) */}
      {viewingObjectifsMission && (
        <ObjectifsApercuModal
          mission={viewingObjectifsMission}
          onClose={() => setViewingObjectifsMission(null)}
        />
      )}

      {/* DISCUSSION D'ÉQUIPE CHAT DRAWER (from 💬 chat button matching Screenshot 1) */}
      {chatMission && (
        <DiscussionEquipeDrawer
          mission={chatMission}
          volunteers={volunteers}
          onClose={() => setChatMission(null)}
        />
      )}
    </div>
  );
};
