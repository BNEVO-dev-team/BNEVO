import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserSession, Mission, VolunteerProfile, Association } from '../types';
import {
  DEFAULT_JOINED_ASSOCIATION_IDS,
  DEFAULT_ORG_USER,
  DEFAULT_BENEVOLE_USER,
  DEMO_ASSOCIATIONS,
  INITIAL_MISSIONS,
  INITIAL_VOLUNTEERS,
} from '../data/mockData';
import { appDataService } from '../services/appDataService';
import { useMissionActions } from '../hooks/useMissionActions';
import { useRouter } from './RouterContext';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface AppContextType {
  currentUser: UserSession | null;
  isHydrated: boolean;
  volunteers: VolunteerProfile[];
  missions: Mission[];
  associations: Association[];
  joinedAssociationIds: string[];
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
  dismissToast: (id: string) => void;
  login: (role: UserRole, customUser?: Partial<UserSession>) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  registerForSlot: (missionId: string, creneauId: string) => boolean;
  unregisterFromSlot: (missionId: string, creneauId: string) => boolean;
  createMission: (newMission: Omit<Mission, 'id'>) => string;
  updateMission: (missionId: string, updatedData: Partial<Mission>) => void;
  deleteMission: (missionId: string) => void;
  updateAttendance: (missionId: string, creneauId: string, volunteerId: string, status: 'present' | 'absent' | 'pending') => void;
  updateVolunteerProfile: (profile: Partial<VolunteerProfile>) => void;
  updateProfileAvatar: (avatarUrl: string | null) => void;
  joinAssociation: (code: string) => boolean;
  leaveAssociation: (associationId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const NAVIGATION_TOAST_KEY = 'bnevo_navigation_toast';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { push } = useRouter();

  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>(INITIAL_VOLUNTEERS);
  const [joinedAssociationIds, setJoinedAssociationIds] = useState<string[]>(
    DEFAULT_JOINED_ASSOCIATION_IDS
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const snapshot = appDataService.load();
    setCurrentUser(snapshot.currentUser);
    setMissions(snapshot.missions);
    setVolunteers(snapshot.volunteers);
    setJoinedAssociationIds(snapshot.joinedAssociationIds);
    appDataService.saveSession(snapshot.currentUser);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    appDataService.saveMissions(missions);
  }, [isHydrated, missions]);

  useEffect(() => {
    if (!isHydrated) return;
    appDataService.saveVolunteers(volunteers);
  }, [isHydrated, volunteers]);

  useEffect(() => {
    if (!isHydrated) return;
    appDataService.saveJoinedAssociationIds(joinedAssociationIds);
  }, [isHydrated, joinedAssociationIds]);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const pendingToast = sessionStorage.getItem(NAVIGATION_TOAST_KEY);
      if (!pendingToast) return;
      sessionStorage.removeItem(NAVIGATION_TOAST_KEY);

      const toast = JSON.parse(pendingToast) as Partial<Toast>;
      if (
        typeof toast.message !== 'string' ||
        !toast.type ||
        !['success', 'warning', 'info'].includes(toast.type)
      ) {
        throw new Error('Invalid navigation toast');
      }
      showToast(toast.message, toast.type);
    } catch (e) {
      console.error('Failed to restore navigation toast', e);
    }
  }, []);

  const navigateWithToast = (url: string, message: string, type: Toast['type']) => {
    try {
      sessionStorage.setItem(NAVIGATION_TOAST_KEY, JSON.stringify({ message, type }));
    } catch (e) {
      console.error('Failed to persist navigation toast', e);
    }
    showToast(message, type);
    push(url);
  };

  const missionActions = useMissionActions({
    currentUser,
    missions,
    setMissions,
    setVolunteers,
    showToast,
  });

  const login = (role: UserRole, customUser?: Partial<UserSession>) => {
    if (role === 'organisation') {
      const user = {
        ...DEFAULT_ORG_USER,
        ...(customUser || {}),
        avatarUrl:
          appDataService.loadUserAvatar(DEFAULT_ORG_USER.id) ??
          customUser?.avatarUrl ??
          DEFAULT_ORG_USER.avatarUrl,
      };
      appDataService.saveSession(user);
      setCurrentUser(user);
      push('/organisation');
    } else if (role === 'benevole') {
      const user = {
        ...DEFAULT_BENEVOLE_USER,
        ...(customUser || {}),
        avatarUrl:
          appDataService.loadUserAvatar(DEFAULT_BENEVOLE_USER.id) ??
          customUser?.avatarUrl ??
          DEFAULT_BENEVOLE_USER.avatarUrl,
      };
      appDataService.saveSession(user);
      setCurrentUser(user);
      push('/benevole');
    } else {
      appDataService.saveSession(null);
      setCurrentUser(null);
      push('/');
    }
  };

  const logout = () => {
    appDataService.saveSession(null);
    try {
      sessionStorage.removeItem(NAVIGATION_TOAST_KEY);
    } catch (error) {
      console.error('Failed to clear pending navigation toast', error);
    }
    push('/');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'organisation') {
      const user = {
        ...DEFAULT_ORG_USER,
        avatarUrl: appDataService.loadUserAvatar(DEFAULT_ORG_USER.id) ?? DEFAULT_ORG_USER.avatarUrl,
      };
      appDataService.saveSession(user);
      setCurrentUser(user);
      navigateWithToast('/organisation', 'Basculé vers l’Espace Organisation', 'info');
    } else if (role === 'benevole') {
      const user = {
        ...DEFAULT_BENEVOLE_USER,
        avatarUrl:
          appDataService.loadUserAvatar(DEFAULT_BENEVOLE_USER.id) ??
          DEFAULT_BENEVOLE_USER.avatarUrl,
      };
      appDataService.saveSession(user);
      setCurrentUser(user);
      navigateWithToast('/benevole', 'Basculé vers l’Espace Bénévole', 'info');
    } else {
      logout();
    }
  };

  const joinAssociation = (code: string) => {
    const normalizedCode = code.trim().toUpperCase();
    const association = DEMO_ASSOCIATIONS.find(
      (item) => item.code.toUpperCase() === normalizedCode
    );

    if (!association) {
      showToast('Ce code association est introuvable.', 'warning');
      return false;
    }

    if (joinedAssociationIds.includes(association.id)) {
      showToast(`Vous êtes déjà membre de ${association.name}.`, 'info');
      return false;
    }

    const wasInitiallyJoined = DEFAULT_JOINED_ASSOCIATION_IDS.includes(association.id);
    const isJoined = joinedAssociationIds.includes(association.id);
    const memberCount =
      association.memberCount +
      Number(isJoined && !wasInitiallyJoined) -
      Number(!isJoined && wasInitiallyJoined);

    if (memberCount >= association.maxMembers) {
      showToast('Cette association a atteint sa capacité maximale.', 'warning');
      return false;
    }

    setJoinedAssociationIds((previous) => [...previous, association.id]);
    showToast(`Vous avez rejoint ${association.name}.`, 'success');
    return true;
  };

  const leaveAssociation = (associationId: string) => {
    if (!joinedAssociationIds.includes(associationId)) return;
    const association = DEMO_ASSOCIATIONS.find((item) => item.id === associationId);
    setJoinedAssociationIds((previous) => previous.filter((id) => id !== associationId));
    if (association) showToast(`Vous avez quitté ${association.name}.`, 'info');
  };

  const updateVolunteerProfile = (updatedFields: Partial<VolunteerProfile>) => {
    if (!currentUser) return;
    const volunteerId = currentUser.id;
    const updatedUser = { ...currentUser, ...updatedFields };

    setVolunteers((prev) =>
      prev.map((v) => (v.id === volunteerId ? { ...v, ...updatedFields } : v))
    );

    setCurrentUser(updatedUser);
    appDataService.saveSession(updatedUser);
    showToast('Votre profil a été mis à jour avec succès.', 'success');
  };

  const updateProfileAvatar = (avatarUrl: string | null) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, avatarUrl: avatarUrl || undefined };

    setCurrentUser(updatedUser);
    appDataService.saveSession(updatedUser);
    appDataService.saveUserAvatar(currentUser.id, avatarUrl);

    if (currentUser.role === 'benevole') {
      setVolunteers((previous) =>
        previous.map((volunteer) =>
          volunteer.id === currentUser.id
            ? { ...volunteer, avatarUrl: avatarUrl || '' }
            : volunteer
        )
      );
    }

    showToast('Votre photo de profil a été mise à jour.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isHydrated,
        volunteers,
        missions,
        associations: DEMO_ASSOCIATIONS,
        joinedAssociationIds,
        toasts,
        showToast,
        dismissToast,
        login,
        logout,
        switchRole,
        ...missionActions,
        updateVolunteerProfile,
        updateProfileAvatar,
        joinAssociation,
        leaveAssociation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
