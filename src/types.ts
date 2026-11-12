export type UserRole = 'guest' | 'organisation' | 'benevole';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organizationName?: string;
  phone?: string;
  city?: string;
  hoursCompleted?: number;
}

export interface Creneau {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "13:00"
  capacity: number;
  enrolledUserIds: string[];
  attendance?: Record<string, 'present' | 'absent' | 'pending'>;
  notes?: string;
}

export interface MissionObjective {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Mission {
  id: string;
  title: string;
  organizationId: string;
  organizationName: string;
  category: string;
  description: string;
  location: string;
  city: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  requiredSkills: string[];
  perks: string[]; // e.g. "Repas offert", "T-shirt bénévole", "Pass concert"
  referentName: string;
  referentPhone: string;
  creneaux: Creneau[];
  objectifs?: MissionObjective[];
  status: 'active' | 'complete' | 'draft';
}

export interface VolunteerProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone: string;
  city: string;
  avatarUrl: string;
  skills: string[];
  interests: string[];
  totalHours: number;
  missionsCount: number;
  availableDays: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Association {
  id: string;
  name: string;
  code: string;
  memberCount: number;
  maxMembers: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}
