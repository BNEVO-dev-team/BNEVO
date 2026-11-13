import type { Dispatch, SetStateAction } from 'react';
import type { Mission, UserSession, VolunteerProfile } from '../types';

interface MissionActionsOptions {
  currentUser: UserSession | null;
  missions: Mission[];
  setMissions: Dispatch<SetStateAction<Mission[]>>;
  setVolunteers: Dispatch<SetStateAction<VolunteerProfile[]>>;
  showToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

export const useMissionActions = ({
  currentUser,
  missions,
  setMissions,
  setVolunteers,
  showToast,
}: MissionActionsOptions) => {
  const registerForSlot = (missionId: string, creneauId: string): boolean => {
    const volunteerId = currentUser?.id || 'vol_valentin';
    const slot = missions
      .find((mission) => mission.id === missionId)
      ?.creneaux.find((creneau) => creneau.id === creneauId);

    if (!slot) return false;
    if (slot.enrolledUserIds.includes(volunteerId)) {
      showToast('Vous êtes déjà inscrit à ce créneau !', 'warning');
      return false;
    }
    if (slot.enrolledUserIds.length >= slot.capacity) {
      showToast('Désolé, ce créneau est déjà complet.', 'warning');
      return false;
    }

    setMissions((previous) =>
      previous.map((mission) => {
        if (mission.id !== missionId) return mission;
        return {
          ...mission,
          creneaux: mission.creneaux.map((creneau) =>
            creneau.id === creneauId
              ? {
                  ...creneau,
                  enrolledUserIds: [...creneau.enrolledUserIds, volunteerId],
                  attendance: {
                    ...(creneau.attendance || {}),
                    [volunteerId]: 'pending',
                  },
                }
              : creneau
          ),
        };
      })
    );
    setVolunteers((previous) =>
      previous.map((volunteer) =>
        volunteer.id === volunteerId
          ? {
              ...volunteer,
              missionsCount: volunteer.missionsCount + 1,
              totalHours: volunteer.totalHours + 4,
            }
          : volunteer
      )
    );
    showToast('Inscription confirmée ! Le créneau a été ajouté à votre planning.', 'success');
    return true;
  };

  const unregisterFromSlot = (missionId: string, creneauId: string): boolean => {
    const volunteerId = currentUser?.id || 'vol_valentin';
    setMissions((previous) =>
      previous.map((mission) => {
        if (mission.id !== missionId) return mission;
        return {
          ...mission,
          creneaux: mission.creneaux.map((creneau) => {
            if (creneau.id !== creneauId) return creneau;
            const attendance = { ...(creneau.attendance || {}) };
            delete attendance[volunteerId];
            return {
              ...creneau,
              enrolledUserIds: creneau.enrolledUserIds.filter((id) => id !== volunteerId),
              attendance,
            };
          }),
        };
      })
    );
    showToast('Votre désistement a été pris en compte. Le créneau a été libéré.', 'info');
    return true;
  };

  const createMission = (newMission: Omit<Mission, 'id'>): string => {
    const newId = `mis_${Date.now()}`;
    setMissions((previous) => [{ ...newMission, id: newId }, ...previous]);
    showToast(`La mission « ${newMission.title} » a été publiée avec succès !`, 'success');
    return newId;
  };

  const updateMission = (missionId: string, updatedData: Partial<Mission>) => {
    setMissions((previous) =>
      previous.map((mission) =>
        mission.id === missionId ? { ...mission, ...updatedData } : mission
      )
    );
    showToast('La mission a été mise à jour avec succès.', 'success');
  };

  const deleteMission = (missionId: string) => {
    setMissions((previous) => previous.filter((mission) => mission.id !== missionId));
    showToast('La mission a été supprimée définitivement.', 'info');
  };

  const updateAttendance = (
    missionId: string,
    creneauId: string,
    volunteerId: string,
    status: 'present' | 'absent' | 'pending'
  ) => {
    setMissions((previous) =>
      previous.map((mission) => {
        if (mission.id !== missionId) return mission;
        return {
          ...mission,
          creneaux: mission.creneaux.map((creneau) =>
            creneau.id === creneauId
              ? {
                  ...creneau,
                  attendance: { ...(creneau.attendance || {}), [volunteerId]: status },
                }
              : creneau
          ),
        };
      })
    );

    const statusLabel =
      status === 'present'
        ? 'marqué présent'
        : status === 'absent'
          ? 'marqué absent'
          : 'remis en attente';
    showToast(`Pointage mis à jour : bénévole ${statusLabel}.`, 'info');
  };

  return {
    registerForSlot,
    unregisterFromSlot,
    createMission,
    updateMission,
    deleteMission,
    updateAttendance,
  };
};
