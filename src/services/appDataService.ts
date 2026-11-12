import {
  DEFAULT_JOINED_ASSOCIATION_IDS,
  INITIAL_MISSIONS,
  INITIAL_VOLUNTEERS,
} from '../data/mockData';
import type { Mission, UserSession, VolunteerProfile } from '../types';

const retiredDemoMissionIds = new Set([
  'mis_collecte',
  'mis_2',
  'mis_3',
  'mis_4',
  'mis_5',
  'mis_6',
]);
const activeDemoMissionIds = new Set(INITIAL_MISSIONS.map((mission) => mission.id));
const legacyValentinAvatar = '/images/bnevo_avatar_benevole_1790925975920.jpg';

export interface AppDataSnapshot {
  currentUser: UserSession | null;
  missions: Mission[];
  volunteers: VolunteerProfile[];
  joinedAssociationIds: string[];
}

export interface AppDataService {
  load: () => AppDataSnapshot;
  saveSession: (user: UserSession | null) => void;
  saveMissions: (missions: Mission[]) => void;
  saveVolunteers: (volunteers: VolunteerProfile[]) => void;
  saveJoinedAssociationIds: (associationIds: string[]) => void;
  loadUserAvatar: (userId: string) => string | undefined;
  saveUserAvatar: (userId: string, avatarUrl: string | null) => void;
}

const readStoredValue = <T>(storage: Storage, key: string, fallback: T): T => {
  try {
    const storedValue = storage.getItem(key);
    if (!storedValue) return fallback;
    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.error(`Failed to load ${key} from local storage`, error);
    return fallback;
  }
};

export const createLocalStorageAppDataService = (
  storage?: Storage
): AppDataService => {
  const getStorage = () => {
    if (storage) return storage;
    if (typeof window === 'undefined') return undefined;
    try {
      return window.localStorage;
    } catch (error) {
      console.error('Failed to access local storage', error);
      return undefined;
    }
  };

  return {
    load: () => {
      const currentStorage = getStorage();
      if (!currentStorage) {
        return {
          currentUser: null,
          missions: INITIAL_MISSIONS,
          volunteers: INITIAL_VOLUNTEERS,
          joinedAssociationIds: DEFAULT_JOINED_ASSOCIATION_IDS,
        };
      }

      const currentUser = readStoredValue<UserSession | null>(
        currentStorage,
        'bnevo_session',
        null
      );
      const storedMissions = readStoredValue<Mission[]>(
        currentStorage,
        'bnevo_missions',
        INITIAL_MISSIONS
      );
      const volunteers = readStoredValue<VolunteerProfile[]>(
        currentStorage,
        'bnevo_volunteers',
        INITIAL_VOLUNTEERS
      );
      const joinedAssociationIds = readStoredValue(
        currentStorage,
        'bnevo_joined_associations',
        DEFAULT_JOINED_ASSOCIATION_IDS
      );
      const savedAvatars = readStoredValue<Record<string, string>>(
        currentStorage,
        'bnevo_user_avatars',
        {}
      );
      const currentUserAvatar = currentUser
        ? savedAvatars[currentUser.id] || currentUser.avatarUrl
        : undefined;

      return {
        currentUser: currentUser?.id === 'vol_valentin'
          ? {
              ...currentUser,
              name: currentUser.name === 'Valentin' ? 'Valentin A' : currentUser.name,
              email: currentUser.email === 'valentin@bnevo.fr'
                ? 'valentin.a@bnevo.fr'
                : currentUser.email,
              avatarUrl: currentUserAvatar === legacyValentinAvatar
                ? undefined
                : currentUserAvatar || undefined,
            }
          : currentUser
            ? { ...currentUser, avatarUrl: currentUserAvatar || undefined }
            : null,
        missions: storedMissions.filter(
          (mission) =>
            !retiredDemoMissionIds.has(mission.id) || activeDemoMissionIds.has(mission.id)
        ),
        volunteers: volunteers.map((volunteer) =>
          volunteer.id === 'vol_valentin'
            ? {
                ...volunteer,
                name: volunteer.name === 'Valentin' ? 'Valentin A' : volunteer.name,
                email: volunteer.email === 'valentin@bnevo.fr'
                  ? 'valentin.a@bnevo.fr'
                  : volunteer.email,
                username: volunteer.username === '@valentin' ? '@valentin_a' : volunteer.username,
                avatarUrl: volunteer.avatarUrl === legacyValentinAvatar ? '' : volunteer.avatarUrl,
              }
            : volunteer
        ),
        joinedAssociationIds,
      };
    },
    saveSession: (user) => {
      const currentStorage = getStorage();
      if (!currentStorage) return;
      if (user) {
        currentStorage.setItem('bnevo_session', JSON.stringify(user));
      } else {
        currentStorage.removeItem('bnevo_session');
      }
    },
    saveMissions: (missions) => {
      getStorage()?.setItem('bnevo_missions', JSON.stringify(missions));
    },
    saveVolunteers: (volunteers) => {
      getStorage()?.setItem('bnevo_volunteers', JSON.stringify(volunteers));
    },
    saveJoinedAssociationIds: (associationIds) => {
      getStorage()?.setItem('bnevo_joined_associations', JSON.stringify(associationIds));
    },
    loadUserAvatar: (userId) => {
      const currentStorage = getStorage();
      if (!currentStorage) return undefined;
      const savedAvatars = readStoredValue<Record<string, string>>(
        currentStorage,
        'bnevo_user_avatars',
        {}
      );
      const avatarUrl = savedAvatars[userId];
      return avatarUrl && !(userId === 'vol_valentin' && avatarUrl === legacyValentinAvatar)
        ? avatarUrl
        : undefined;
    },
    saveUserAvatar: (userId, avatarUrl) => {
      const currentStorage = getStorage();
      if (!currentStorage) return;
      const savedAvatars = readStoredValue<Record<string, string>>(
        currentStorage,
        'bnevo_user_avatars',
        {}
      );
      if (avatarUrl) {
        savedAvatars[userId] = avatarUrl;
      } else {
        delete savedAvatars[userId];
      }
      currentStorage.setItem('bnevo_user_avatars', JSON.stringify(savedAvatars));
    },
  };
};

export const appDataService = createLocalStorageAppDataService();
