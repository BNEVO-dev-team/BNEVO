import { Mission, User, Organization } from './types';

export const MOCK_ORG: Organization = {
  id: 'org-1',
  name: 'Le Chant du Coq Solidaire',
  code: 'COQ-2025'
};

export const MOCK_ORG_2: Organization = {
  id: 'org-2',
  name: 'Les Amis de la Forêt',
  code: 'NATURE-2025'
};

export const MOCK_ORG_3: Organization = {
  id: 'org-3',
  name: 'Les Restos du Cœur',
  code: 'RESTO-2025'
};

export const MOCK_ORG_4: Organization = {
  id: 'org-4',
  name: 'SPA - Refuge Local',
  code: 'SPA-2025'
};

export const MOCK_ORG_5: Organization = {
  id: 'org-5',
  name: 'Emmaüs - Collecte Mobile',
  code: 'EMMA-2025'
};

export const MOCK_ORG_6: Organization = {
  id: 'org-6',
  name: 'Secours Populaire',
  code: 'SECOURS-2025'
};

export const MOCK_USERS: User[] = [
  { 
    id: 'u_valentin', 
    username: 'vs827',
    firstName: 'Valentin', 
    lastName: 'Aviles', 
    email: 'valentin@bnevo.com',
    password: '123456',
    avatar: 'https://ui-avatars.com/api/?name=Valentin+Aviles&background=0D8ABC&color=fff', 
    role: 'volunteer', 
    interests: ['Sport', 'Informatique'],
    organizationIds: ['org-1', 'org-3']
  },
  { 
    id: 'u1', 
    username: 'maried',
    firstName: 'Marie', 
    lastName: 'Dupont', 
    email: 'marie@bnevo.com',
    password: 'password123',
    avatar: 'https://picsum.photos/100/100?random=1', 
    role: 'volunteer', 
    interests: ['Jardinage', 'Cuisine', 'Social'],
    organizationIds: ['org-1', 'org-2']
  },
  { 
    id: 'u2', 
    username: 'jean_lefevre',
    firstName: 'Jean', 
    lastName: 'Lefevre', 
    email: 'jean@bnevo.com',
    password: 'password123',
    avatar: 'https://picsum.photos/100/100?random=2', 
    role: 'volunteer', 
    interests: ['Bricolage', 'Logistique'],
    organizationIds: ['org-1']
  },
  { 
    id: 'admin1', 
    username: 'admin',
    firstName: 'Admin', 
    lastName: 'Orga', 
    email: 'asso@bnevo.com',
    password: 'admin',
    avatar: '', 
    role: 'organizer',
    organizationIds: ['org-1']
  },
];

export const MOCK_MISSIONS: Mission[] = [
  { 
    id: 'm1',
    organizationId: 'org-1',
    title: 'Nettoyage des Berges', 
    location: 'Parc Central', 
    dateStart: '2025-06-15T09:00:00', 
    dateEnd: '2025-06-15T12:00:00', 
    description: 'Une matinée pour rendre notre parc plus propre. Gants fournis !', 
    participants: ['u1', 'u2'],
    maxParticipants: 10,
    category: 'Maintenance',
    objectives: [
      { id: 'obj-1-1', title: 'Point de rdv / Accueil', lat: 48.8584, lng: 2.2945 },
      { id: 'obj-1-2', title: 'Zone de ramassage A', lat: 48.8590, lng: 2.2950 },
      { id: 'obj-1-3', title: 'Stockage des sacs', lat: 48.8575, lng: 2.2940 }
    ],
    chatMessages: [
      { id: 'c1', userId: 'u1', userName: 'Marie', userAvatar: 'https://picsum.photos/100/100?random=1', text: 'Est-ce qu\'il faut apporter des bottes ?', timestamp: 1718000000000 },
      { id: 'c2', userId: 'admin1', userName: 'Orga', userAvatar: '', text: 'Oui Marie, c\'est préférable !', timestamp: 1718000500000 }
    ]
  },
  { 
    id: 'm2',
    organizationId: 'org-1',
    title: 'Distribution Alimentaire', 
    location: 'Salle Polyvalente', 
    dateStart: '2025-06-20T18:00:00', 
    dateEnd: '2025-06-20T21:00:00', 
    description: 'Distribution des paniers repas aux bénéficiaires.', 
    participants: ['u1'],
    maxParticipants: 5,
    category: 'Social',
    chatMessages: []
  },
  { 
    id: 'm4',
    organizationId: 'org-2',
    title: 'Plantation d\'arbres', 
    location: 'Forêt Domaniale', 
    dateStart: '2025-07-01T08:00:00', 
    dateEnd: '2025-07-01T16:00:00', 
    description: 'Reboisement de la parcelle nord.', 
    participants: ['u1'],
    maxParticipants: 20,
    category: 'Maintenance',
    objectives: [
      { id: 'obj-2-1', title: 'Déchargement des plants', lat: 48.8049, lng: 2.1204 },
      { id: 'obj-2-2', title: 'Zone de plantation', lat: 48.8060, lng: 2.1220 }
    ],
    chatMessages: []
  },
  { 
    id: 'm5',
    organizationId: 'org-3',
    title: 'Collecte supermarché', 
    location: 'Monoprix Centre', 
    dateStart: '2025-06-18T10:00:00', 
    dateEnd: '2025-06-18T18:00:00', 
    description: 'Collecte de denrées non périssables à la sortie du magasin.', 
    participants: ['u_valentin'],
    maxParticipants: 8,
    category: 'Social',
    chatMessages: []
  },
];