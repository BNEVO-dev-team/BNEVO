
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Calendar as CalendarIcon, LogOut, Plus, 
  BarChart3, LayoutDashboard, Heart, Search, Settings, Pencil, X,
  ChevronLeft, ChevronRight, Building, Tag, Eye, Key, Copy, CheckCircle,
  ArrowLeft, ListTodo, Map as MapIcon, Navigation, MapPin, ExternalLink, Flag, Trash2, Target, Check, Globe, Camera, AlertTriangle
} from 'lucide-react';

import { MissionCard } from './components/MissionCard';
import { ChatDrawer } from './components/ChatDrawer';
import { MiniAgenda } from './components/MiniAgenda';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';
import { MOCK_MISSIONS, MOCK_USERS, MOCK_ORG, MOCK_ORG_2, MOCK_ORG_3, MOCK_ORG_4, MOCK_ORG_5, MOCK_ORG_6 } from './constants';
import { AppState, Mission, Role, User, Organization, MissionObjective } from './types';

// --- MAIN APP COMPONENT ---

export default function App() {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    currentRole: 'none',
    currentOrganization: null,
    managedOrganization: MOCK_ORG,
    missions: MOCK_MISSIONS,
    users: MOCK_USERS,
    organizations: [MOCK_ORG, MOCK_ORG_2, MOCK_ORG_3, MOCK_ORG_4, MOCK_ORG_5, MOCK_ORG_6]
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'missions' | 'organizations' | 'volunteers'>('dashboard');
  const [activeChatMissionId, setActiveChatMissionId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<Date | null>(null);
  
  const [showOrgLogin, setShowOrgLogin] = useState(false);
  const [showVolunteerLogin, setShowVolunteerLogin] = useState(false);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isOrgNameModalOpen, setIsOrgNameModalOpen] = useState(false);
  const [isCreateVolunteerModalOpen, setIsCreateVolunteerModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const [isOrgCodeModalOpen, setIsOrgCodeModalOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  
  const [viewingParticipantsMissionId, setViewingParticipantsMissionId] = useState<string | null>(null);
  const [viewingMapMission, setViewingMapMission] = useState<Mission | null>(null);
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [pickingObjectiveId, setPickingObjectiveId] = useState<string | null>(null);

  const [calendarDate, setCalendarDate] = useState(new Date());

  const [orgLoginData, setOrgLoginData] = useState({ email: '', password: '' });
  const [volunteerLoginData, setVolunteerLoginData] = useState({ username: '', password: '' });
  const [orgLoginError, setOrgLoginError] = useState<string | null>(null);
  const [volunteerLoginError, setVolunteerLoginError] = useState<string | null>(null);

  const [createVolunteerData, setCreateVolunteerData] = useState({ firstName: '', lastName: '', username: '', password: '' });
  
  const [rememberOrg, setRememberOrg] = useState(false);
  const [profileFormData, setProfileFormData] = useState({ firstName: '', lastName: '', avatar: '' });
  
  // Custom Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; variant?: 'danger' | 'primary' }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'primary'
  });

  const [missionFormData, setMissionFormData] = useState<Partial<Mission>>({
    id: undefined,
    title: '', location: '', description: '', category: 'Event', dateStart: '', dateEnd: '',
    objectives: []
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('bnevo_org_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.role === 'organizer') {
          setState(prev => ({
            ...prev,
            currentUser: MOCK_USERS.find(u => u.role === 'organizer') || null,
            currentRole: 'organizer',
            currentOrganization: session.organization || prev.managedOrganization,
            managedOrganization: session.organization || prev.managedOrganization
          }));
        }
      } catch (e) {
        console.error("Failed to parse session", e);
        localStorage.removeItem('bnevo_org_session');
      }
    }
  }, []);

  useEffect(() => {
    if (state.currentUser && isProfileModalOpen) {
      setProfileFormData({
        firstName: state.currentUser.firstName,
        lastName: state.currentUser.lastName || '',
        avatar: state.currentUser.avatar || ''
      });
    }
  }, [state.currentUser, isProfileModalOpen]);

  const createTitleIcon = (L: any, title: string) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow-lg border-2 border-primary-500 whitespace-nowrap group hover:scale-110 transition-transform">
               <div class="w-2 h-2 rounded-full bg-primary-600"></div>
               <span class="text-xs font-bold text-slate-800 dark:text-slate-100">${title || 'Objectif'}</span>
             </div>`,
      iconSize: [120, 32],
      iconAnchor: [60, 16]
    });
  };

  useEffect(() => {
    if (isMapPickerOpen && mapContainerRef.current && (window as any).L && pickingObjectiveId) {
      const L = (window as any).L;
      const currentObjective = missionFormData.objectives?.find(o => o.id === pickingObjectiveId);
      const initialCoords = currentObjective ? { lat: currentObjective.lat, lng: currentObjective.lng } : { lat: 48.8566, lng: 2.3522 }; 

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapContainerRef.current).setView([initialCoords.lat, initialCoords.lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(mapInstanceRef.current);

        mapInstanceRef.current.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          setMissionFormData(prev => ({
            ...prev,
            objectives: prev.objectives?.map(o => 
              o.id === pickingObjectiveId ? { ...o, lat, lng } : o
            )
          }));
          if (markerRef.current) {
            markerRef.current.setLatLng(e.latlng);
            markerRef.current.setIcon(createTitleIcon(L, currentObjective?.title || ''));
          } else {
            markerRef.current = L.marker(e.latlng, { icon: createTitleIcon(L, currentObjective?.title || '') }).addTo(mapInstanceRef.current);
          }
        });
      }

      if (currentObjective) {
          if (markerRef.current) {
            markerRef.current.setLatLng([currentObjective.lat, currentObjective.lng]);
            markerRef.current.setIcon(createTitleIcon(L, currentObjective.title));
          } else {
            markerRef.current = L.marker([currentObjective.lat, currentObjective.lng], { icon: createTitleIcon(L, currentObjective.title) }).addTo(mapInstanceRef.current);
          }
      }
    }

    return () => {
      if (!isMapPickerOpen && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isMapPickerOpen, pickingObjectiveId, missionFormData.objectives]);

  useEffect(() => {
    if (viewingMapMission && mapContainerRef.current && (window as any).L) {
      const L = (window as any).L;
      const objectives = viewingMapMission.objectives || [];
      
      if (objectives.length === 0) return;

      const viewerMap = L.map(mapContainerRef.current);
      mapInstanceRef.current = viewerMap;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(viewerMap);
      
      const markers = objectives.map(obj => {
          return L.marker([obj.lat, obj.lng], { icon: createTitleIcon(L, obj.title) })
            .addTo(viewerMap);
      });

      const group = new L.featureGroup(markers);
      viewerMap.fitBounds(group.getBounds().pad(0.3));

      return () => {
        if (viewerMap) {
          viewerMap.remove();
        }
        mapInstanceRef.current = null;
      };
    }
  }, [viewingMapMission]);

  const handleObjectiveFocus = (obj: MissionObjective) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([obj.lat, obj.lng], 17, { animate: true });
    }
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (pickingObjectiveId) {
            setMissionFormData(prev => ({
                ...prev,
                objectives: prev.objectives?.map(o => 
                    o.id === pickingObjectiveId ? { ...o, lat: latitude, lng: longitude } : o
                )
            }));
            if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([latitude, longitude], 15);
                const currentObj = missionFormData.objectives?.find(o => o.id === pickingObjectiveId);
                if (markerRef.current) {
                  markerRef.current.setLatLng([latitude, longitude]);
                  markerRef.current.setIcon(createTitleIcon((window as any).L, currentObj?.title || ''));
                } else {
                  markerRef.current = (window as any).L.marker([latitude, longitude], { icon: createTitleIcon((window as any).L, currentObj?.title || '') }).addTo(mapInstanceRef.current);
                }
            }
        }
      });
    }
  };

  const toLocalISOString = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayObj = new Date(year, month, 1);
    let firstDay = firstDayObj.getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    return { daysInMonth, offset, year, month };
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCalendarDate(newDate);
  };

  const handleCalendarDayClick = (day: number) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const startDate = new Date(year, month, day, 9, 0);
    const endDate = new Date(year, month, day, 12, 0);

    setMissionFormData({
      id: undefined, 
      title: '', 
      location: '', 
      description: '', 
      category: 'Event',
      dateStart: toLocalISOString(startDate),
      dateEnd: toLocalISOString(endDate),
      objectives: []
    });
    setIsMissionModalOpen(true);
  };

  const handleOrgLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrgLoginError(null);
    
    // Check against mock organizer
    const orgUser = MOCK_USERS.find(u => u.role === 'organizer');
    if (orgLoginData.email === orgUser?.email && orgLoginData.password === orgUser?.password) {
      const orgData = state.managedOrganization;
      setState(prev => ({
        ...prev,
        currentUser: orgUser || null,
        currentRole: 'organizer',
        currentOrganization: orgData
      }));
      setShowOrgLogin(false);
      setOrgLoginData({ email: '', password: '' });
      if (rememberOrg) {
        localStorage.setItem('bnevo_org_session', JSON.stringify({ role: 'organizer', organization: orgData }));
      }
    } else {
      setOrgLoginError("Email ou mot de passe incorrect.");
    }
  };

  const handleVolunteerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerLoginError(null);
    
    const user = state.users.find(u => 
      u.role === 'volunteer' && 
      u.username.toLowerCase() === volunteerLoginData.username.toLowerCase() &&
      u.password === volunteerLoginData.password
    );
    
    if (user) {
      let initialOrg: Organization | null = null;
      if (user.organizationIds && user.organizationIds.length > 0) {
        initialOrg = state.organizations.find(o => o.id === user.organizationIds![0]) || null;
      }
      setState(prev => ({ ...prev, currentUser: user, currentRole: 'volunteer', currentOrganization: initialOrg }));
      setShowVolunteerLogin(false);
      setVolunteerLoginData({ username: '', password: '' });
    } else {
      setVolunteerLoginError("Pseudo ou mot de passe incorrect.");
    }
  };

  const handleCreateVolunteer = () => {
    if (!createVolunteerData.firstName || !createVolunteerData.username || !createVolunteerData.password) return;
    if (state.users.some(u => u.username.toLowerCase() === createVolunteerData.username.toLowerCase())) {
        alert("Ce pseudo est déjà pris.");
        return;
    }
    const newUser: User = {
        id: `u-${Date.now()}`,
        firstName: createVolunteerData.firstName,
        lastName: createVolunteerData.lastName || '',
        username: createVolunteerData.username,
        password: createVolunteerData.password,
        avatar: `https://ui-avatars.com/api/?name=${createVolunteerData.firstName}+${createVolunteerData.lastName || ''}&background=random`, 
        role: 'volunteer',
        interests: [],
        organizationIds: []
    };
    setState(prev => ({ 
      ...prev, 
      users: [...prev.users, newUser], 
      currentUser: newUser, 
      currentRole: 'volunteer', 
      currentOrganization: null 
    }));
    setIsCreateVolunteerModalOpen(false);
    setShowVolunteerLogin(false);
    setActiveTab('organizations');
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.currentUser) return;
    
    const updatedUser = {
      ...state.currentUser,
      firstName: profileFormData.firstName,
      lastName: profileFormData.lastName,
      avatar: profileFormData.avatar || state.currentUser.avatar
    };

    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
    
    setIsProfileModalOpen(false);
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null, currentRole: 'none' }));
    setActiveTab('dashboard');
    setIsLogoutModalOpen(false);
    localStorage.removeItem('bnevo_org_session');
  };

  const handleJoinOrganization = (orgId: string) => {
    const orgToJoin = state.organizations.find(o => o.id === orgId);
    if (!orgToJoin) return;
    
    const updatedUser = {
      ...state.currentUser!,
      organizationIds: Array.from(new Set([...(state.currentUser?.organizationIds || []), orgToJoin.id]))
    };
    
    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      currentOrganization: prev.currentOrganization || orgToJoin,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
  };

  const handleLeaveOrganization = (orgId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Quitter l'association",
      message: "Êtes-vous sûr de vouloir quitter cette association ? Vous ne verrez plus ses missions.",
      variant: 'danger',
      onConfirm: () => {
        const currentUserId = state.currentUser!.id;
        setState(prev => {
          const updatedUser = {
            ...prev.currentUser!,
            organizationIds: (prev.currentUser!.organizationIds || []).filter(id => id !== orgId)
          };

          const updatedMissions = prev.missions.map(m => {
            if (m.organizationId === orgId && m.participants.includes(currentUserId)) {
              return { ...m, participants: m.participants.filter(pid => pid !== currentUserId) };
            }
            return m;
          });

          let nextOrg = prev.currentOrganization;
          if (prev.currentOrganization?.id === orgId) {
            nextOrg = updatedUser.organizationIds.length > 0 
              ? prev.organizations.find(o => o.id === updatedUser.organizationIds[0]) || null
              : null;
          }

          return {
            ...prev,
            missions: updatedMissions,
            users: prev.users.map(u => u.id === currentUserId ? updatedUser : u),
            currentUser: updatedUser,
            currentOrganization: nextOrg
          };
        });
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleSaveMission = () => {
    if (!missionFormData.title || !missionFormData.dateStart || !state.currentOrganization) return;
    const finalDateEnd = missionFormData.dateEnd || missionFormData.dateStart;
    if (missionFormData.id) {
        setState(prev => ({
            ...prev,
            missions: prev.missions.map(m => m.id === missionFormData.id ? { ...m, ...missionFormData, dateEnd: finalDateEnd } as Mission : m)
        }));
    } else {
        const newMission: Mission = {
            id: `new-${Date.now()}`,
            organizationId: state.currentOrganization.id,
            title: missionFormData.title!,
            location: missionFormData.location || 'À définir',
            objectives: missionFormData.objectives,
            dateStart: missionFormData.dateStart!,
            dateEnd: finalDateEnd,
            description: missionFormData.description || '',
            category: (missionFormData.category as any) || 'Event',
            participants: [],
            chatMessages: []
        };
        setState(prev => ({ ...prev, missions: [...prev.missions, newMission] }));
    }
    setIsMissionModalOpen(false);
  };

  const handleDeleteMission = () => {
    if (!missionFormData.id) return;
    
    setConfirmDialog({
      isOpen: true,
      title: "Supprimer la mission",
      message: "Cette action est irréversible. La mission sera supprimée pour tous les bénévoles.",
      variant: 'danger',
      onConfirm: () => {
        setState(prev => ({
          ...prev,
          missions: prev.missions.filter(m => m.id !== missionFormData.id)
        }));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        setIsMissionModalOpen(false);
      }
    });
  };

  const handleMissionAction = (missionId: string) => {
    if (state.currentRole === 'volunteer') {
      const mission = state.missions.find(m => m.id === missionId);
      if (!mission || !state.currentUser) return;
      
      const isRegistered = mission.participants.includes(state.currentUser.id);
      
      if (!isRegistered) {
        setConfirmDialog({
          isOpen: true,
          title: "Confirmer votre participation",
          message: "En vous inscrivant à cette mission, vous vous engagez à être présent. Un désistement de dernière minute peut impacter l'organisation et la réussite de l'action. Confirmez-vous votre engagement ?",
          variant: 'primary',
          onConfirm: () => {
            setState(prev => ({
              ...prev,
              missions: prev.missions.map(m => m.id === missionId ? { ...m, participants: [...m.participants, prev.currentUser!.id] } : m)
            }));
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          }
        });
      } else {
        setConfirmDialog({
          isOpen: true,
          title: "Se désister de la mission",
          message: "Êtes-vous sûr de vouloir vous désister ? Votre absence pourrait compliquer l'organisation de cette mission. Si possible, prévenez l'organisateur via le chat.",
          variant: 'danger',
          onConfirm: () => {
            setState(prev => ({
              ...prev,
              missions: prev.missions.map(m => m.id === missionId ? { ...m, participants: m.participants.filter(id => id !== prev.currentUser!.id) } : m)
            }));
            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          }
        });
      }
    } else {
      const missionToEdit = state.missions.find(m => m.id === missionId);
      if (missionToEdit) {
          setMissionFormData({ ...missionToEdit });
          setIsMissionModalOpen(true);
      }
    }
  };

  const handleSendMessage = (missionId: string, text: string) => {
    if (!state.currentUser) return;
    const newMessage = {
      id: Date.now().toString(),
      userId: state.currentUser.id,
      userName: state.currentUser.firstName,
      userAvatar: state.currentUser.avatar,
      text,
      timestamp: Date.now()
    };
    setState(prev => ({ ...prev, missions: prev.missions.map(m => m.id === missionId ? { ...m, chatMessages: [...m.chatMessages, newMessage] } : m) }));
  };

  const addObjective = () => {
    const newObj: MissionObjective = {
        id: `obj-${Date.now()}`,
        title: '',
        lat: 48.8566,
        lng: 2.3522
    };
    setMissionFormData(prev => ({ ...prev, objectives: [...(prev.objectives || []), newObj] }));
  };

  const removeObjective = (id: string) => {
    setMissionFormData(prev => ({ ...prev, objectives: prev.objectives?.filter(o => o.id !== id) }));
  };

  const updateObjectiveTitle = (id: string, title: string) => {
    setMissionFormData(prev => ({
        ...prev,
        objectives: prev.objectives?.map(o => o.id === id ? { ...o, title } : o)
    }));
  };

  const openPickerForObjective = (id: string) => {
    setPickingObjectiveId(id);
    setIsMapPickerOpen(true);
  };

  const joinedOrgIds = state.currentUser?.organizationIds || [];
  const volunteerMissions = state.missions.filter(m => joinedOrgIds.includes(m.organizationId));
  const registeredMissions = volunteerMissions.filter(m => m.participants.includes(state.currentUser!.id));
  const availableMissions = volunteerMissions.filter(m => !m.participants.includes(state.currentUser!.id));

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  
  // LOGIQUE DE FILTRAGE UNIFIÉE
  const filteredRegisteredMissions = selectedAgendaDate 
    ? registeredMissions.filter(m => isSameDay(new Date(m.dateStart), selectedAgendaDate))
    : registeredMissions;

  const filteredAvailableMissions = availableMissions.filter(m => {
    const matchesCategory = selectedCategory === 'Tout' || m.category === selectedCategory;
    // Si une date est sélectionnée, on ne montre QUE les disponibles de ce jour
    if (selectedAgendaDate) {
      const matchesDate = isSameDay(new Date(m.dateStart), selectedAgendaDate);
      return matchesCategory && matchesDate;
    }
    return matchesCategory;
  });

  const joinedOrgs = state.organizations.filter(o => joinedOrgIds.includes(o.id));
  const availableOrgs = state.organizations.filter(o => !joinedOrgIds.includes(o.id));

  const Header = () => (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-none">
             <Heart className="w-5 h-5 text-white fill-current" />
           </div>
           <div className="flex flex-col">
             <span className="font-bold text-base md:text-xl tracking-tight text-slate-900 dark:text-white leading-none">BNEVO</span>
             {state.currentOrganization && (
               <div className="flex items-center gap-1 mt-1 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">
                 <span className="truncate max-w-[100px] md:max-w-[200px]">{state.currentOrganization.name}</span>
                 {state.currentRole === 'organizer' && (
                   <button onClick={() => setIsOrgNameModalOpen(true)} className="hover:text-primary-600"><Pencil className="w-2.5 h-2.5" /></button>
                 )}
               </div>
             )}
           </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
             <div className="text-right hidden sm:block">
               {state.currentRole !== 'organizer' && (
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{state.currentUser?.firstName}</p>
               )}
               <div className="flex items-center justify-end gap-1 mt-1">
                 <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    {state.currentRole === 'organizer' ? 'Organisateur' : 'Bénévole'}
                 </p>
               </div>
             </div>
             
             <div className="flex items-center gap-1.5 md:gap-2">
                {state.currentRole === 'organizer' && (
                   <button onClick={() => setIsOrgCodeModalOpen(true)} className="p-2 md:p-2.5 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:scale-105 transition-transform"><Key className="w-4 h-4 md:w-5 md:h-5" /></button>
                )}
                <button onClick={() => setIsProfileModalOpen(true)} className="relative active:scale-95 transition-transform">
                    <img src={state.currentUser?.avatar || `https://ui-avatars.com/api/?name=${state.currentUser?.firstName}&background=random`} alt="Profile" className="w-9 h-9 md:w-11 md:h-11 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                </button>
             </div>
          </div>
          <button onClick={() => setIsLogoutModalOpen(true)} className="p-2 md:p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>
    </header>
  );

  if (state.currentRole === 'none') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="mx-auto w-24 h-24 md:w-28 md:h-28 bg-primary-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary-200 dark:shadow-none animate-bounce-slow">
            <Heart className="w-12 h-12 md:w-14 md:h-14 text-white fill-current" />
          </div>
          <div className="px-4">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">BNEVO</h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Simplifiez la gestion de vos bénévoles. <br className="hidden md:block"/> Libérez votre temps associatif.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 pt-8 px-4">
            {!showOrgLogin && !showVolunteerLogin ? (
              <>
                <button onClick={() => setShowOrgLogin(true)} className="group relative flex items-center p-5 md:p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-xl transition-all active:scale-95">
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary-600">Espace Organisation</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Plannings, missions et équipes</p>
                  </div>
                  <LayoutDashboard className="w-7 h-7 text-slate-300 group-hover:text-primary-500" />
                </button>
                <button onClick={() => setShowVolunteerLogin(true)} className="group relative flex items-center p-5 md:p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary-500 hover:shadow-xl transition-all active:scale-95">
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary-600">Espace Bénévole</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Trouver des missions de coeur</p>
                  </div>
                  <Users className="w-7 h-7 text-slate-300 group-hover:text-primary-500" />
                </button>
              </>
            ) : showOrgLogin ? (
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-left animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center mb-6">
                  <button onClick={() => { setShowOrgLogin(false); setOrgLoginError(null); }} className="p-3 mr-3 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ArrowLeft className="w-6 h-6"/></button>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">Organisation</h3>
                </div>
                {orgLoginError && (
                  <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" /> {orgLoginError}
                  </div>
                )}
                <form onSubmit={handleOrgLoginSubmit} className="space-y-5">
                  <Input 
                    label="Email" 
                    type="email" 
                    placeholder="asso@exemple.com" 
                    value={orgLoginData.email} 
                    onChange={e => { setOrgLoginData({...orgLoginData, email: e.target.value}); setOrgLoginError(null); }} 
                    required 
                  />
                  <Input 
                    label="Mot de passe" 
                    type="password" 
                    value={orgLoginData.password} 
                    onChange={e => { setOrgLoginData({...orgLoginData, password: e.target.value}); setOrgLoginError(null); }} 
                    required 
                  />
                  <Button type="submit" fullWidth size="lg">Se connecter</Button>
                </form>
              </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-left animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center mb-6">
                        <button onClick={() => { setShowVolunteerLogin(false); setVolunteerLoginError(null); }} className="p-3 mr-3 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ArrowLeft className="w-6 h-6"/></button>
                        <h3 className="font-black text-xl text-slate-900 dark:text-white">Bénévole</h3>
                    </div>
                    {volunteerLoginError && (
                      <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" /> {volunteerLoginError}
                      </div>
                    )}
                    <form onSubmit={handleVolunteerLoginSubmit} className="space-y-5">
                        <Input 
                          label="Pseudo / Identifiant" 
                          type="text" 
                          placeholder="Ex: vs827" 
                          value={volunteerLoginData.username} 
                          onChange={e => { setVolunteerLoginData({...volunteerLoginData, username: e.target.value}); setVolunteerLoginError(null); }} 
                          required 
                        />
                        <Input 
                          label="Mot de passe" 
                          type="password" 
                          value={volunteerLoginData.password} 
                          onChange={e => { setVolunteerLoginData({...volunteerLoginData, password: e.target.value}); setVolunteerLoginError(null); }} 
                          required 
                        />
                        <Button type="submit" fullWidth size="lg">Se connecter</Button>
                        <Button type="button" variant="ghost" fullWidth onClick={() => { setShowVolunteerLogin(false); setIsCreateVolunteerModalOpen(true); setVolunteerLoginError(null); }}>Créer mon compte</Button>
                    </form>
                </div>
            )}
          </div>
        </div>

        <Modal isOpen={isCreateVolunteerModalOpen} onClose={() => setIsCreateVolunteerModalOpen(false)} title="Nouveau Bénévole">
            <form onSubmit={(e) => { e.preventDefault(); handleCreateVolunteer(); }} className="space-y-5">
                <Input label="Prénom" value={createVolunteerData.firstName} onChange={e => setCreateVolunteerData({...createVolunteerData, firstName: e.target.value})} required />
                <Input label="Nom" value={createVolunteerData.lastName} onChange={e => setCreateVolunteerData({...createVolunteerData, lastName: e.target.value})} />
                <Input label="Pseudo / Identifiant" value={createVolunteerData.username} onChange={e => setCreateVolunteerData({...createVolunteerData, username: e.target.value})} required />
                <Input label="Mot de passe" type="password" value={createVolunteerData.password} onChange={e => setCreateVolunteerData({...createVolunteerData, password: e.target.value})} required />
                <div className="pt-4 flex flex-col gap-2">
                    <Button type="submit" fullWidth size="lg">S'inscrire et continuer</Button>
                    <Button type="button" variant="ghost" fullWidth onClick={() => setIsCreateVolunteerModalOpen(false)}>Annuler</Button>
                </div>
            </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 md:pb-8">
      <Header />
      
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-1.5 flex gap-1 rounded-2xl z-30 shadow-2xl backdrop-blur-md">
         {state.currentRole === 'volunteer' ? (
           <>
             <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}>
               <LayoutDashboard className="w-5 h-5" />
               <span className="text-sm font-bold">Accueil</span>
             </button>
             <button onClick={() => setActiveTab('calendar')} className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'calendar' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}>
               <CalendarIcon className="w-5 h-5" />
               <span className="text-sm font-bold">Planning</span>
             </button>
             <button onClick={() => setActiveTab('organizations')} className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'organizations' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}>
               <Globe className="w-5 h-5" />
               <span className="text-sm font-bold">Associations</span>
             </button>
           </>
         ) : (
           <>
             <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}>
               <BarChart3 className="w-5 h-5" />
               <span className="text-sm font-bold">Stats</span>
             </button>
             <button onClick={() => setActiveTab('calendar')} className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${activeTab === 'calendar' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}>
               <CalendarIcon className="w-5 h-5" />
               <span className="text-sm font-bold">Planning</span>
             </button>
             <button onClick={() => setActiveTab('missions')} className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all ${activeTab === 'missions' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}>
               <ListTodo className="w-5 h-5" />
               <span className="text-sm font-bold">Gestion</span>
             </button>
           </>
         )}
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {state.currentRole === 'organizer' ? (
          <div className="space-y-8">
            {(activeTab === 'dashboard' || !window.matchMedia("(max-width: 768px)").matches) && (
              <div className={`space-y-8 ${activeTab !== 'dashboard' ? 'hidden md:block' : ''}`}>
                <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                   {[
                     { label: 'Missions', val: state.missions.filter(m => m.organizationId === state.currentOrganization?.id).length, color: 'text-slate-900 dark:text-white' },
                     { label: 'Bénévoles', val: state.users.filter(u => u.role === 'volunteer' && u.organizationIds?.includes(state.currentOrganization!.id)).length, color: 'text-slate-900 dark:text-white' },
                     { label: 'Présences', val: state.missions.filter(m => m.organizationId === state.currentOrganization?.id).reduce((acc, m) => acc + m.participants.length, 0), color: 'text-primary-600' }
                   ].map((s, i) => (
                     <div key={i} className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-2xl md:text-3xl font-black ${s.color}`}>{s.val}</p>
                     </div>
                   ))}
                   <button onClick={() => { setMissionFormData({ id: undefined, title: '', location: '', description: '', category: 'Event', dateStart: toLocalISOString(new Date()), dateEnd: '', objectives: [] }); setIsMissionModalOpen(true); }}
                           className="bg-primary-600 p-5 md:p-6 rounded-[1.5rem] shadow-lg shadow-primary-200 dark:shadow-none flex flex-col justify-center items-center cursor-pointer hover:bg-primary-700 active:scale-95 transition-all text-white">
                      <Plus className="w-8 h-8 mb-1" />
                      <p className="font-bold text-[10px] uppercase tracking-wider">Nouvelle Mission</p>
                   </button>
                </section>
              </div>
            )}

            {(activeTab === 'calendar' || !window.matchMedia("(max-width: 768px)").matches) && (
              <section className={`bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 ${activeTab !== 'calendar' ? 'hidden md:block' : ''}`}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-primary-500" /> Calendrier
                  </h2>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                     <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                     <span className="px-4 font-bold capitalize text-xs md:text-sm min-w-[120px] text-center">{calendarDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                     <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all shadow-sm"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                    <div key={d} className="text-center text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 md:gap-3">
                  {Array.from({ length: getDaysInMonth(calendarDate).offset }).map((_, i) => <div key={i} />)}
                  {Array.from({ length: getDaysInMonth(calendarDate).daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = new Date().toDateString() === new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day).toDateString();
                    const hasM = state.missions.filter(m => m.organizationId === state.currentOrganization?.id).some(m => {
                        const d = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                        return d >= new Date(new Date(m.dateStart).setHours(0,0,0,0)) && d <= new Date(new Date(m.dateEnd || m.dateStart).setHours(23,59,59,999));
                    });
                    return (
                      <button key={day} onClick={() => handleCalendarDayClick(day)}
                              className={`h-12 md:h-20 rounded-2xl flex items-center justify-center text-sm md:text-lg font-bold transition-all border-2
                                ${hasM ? 'bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-100' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-primary-300'}
                                ${isToday ? 'ring-2 ring-primary-500 ring-offset-4 dark:ring-offset-slate-900' : ''}`}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {(activeTab === 'missions' || !window.matchMedia("(max-width: 768px)").matches) && (
              <section className={activeTab !== 'missions' ? 'hidden md:block' : ''}>
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">Gestion des Missions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.missions.filter(m => m.organizationId === state.currentOrganization?.id).map(m => (
                    <MissionCard key={m.id} mission={m} role="organizer" currentUser={state.currentUser} allUsers={state.users} onAction={handleMissionAction} onChat={setActiveChatMissionId} onViewParticipants={setViewingParticipantsMissionId} onViewMap={setViewingMapMission} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-3xl w-full max-sm mx-auto mb-10 shadow-inner border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-black transition-all duration-300 active:scale-95 ${
                  activeTab === 'dashboard'
                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-lg'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-primary-600' : 'text-slate-400'}`} />
                <span>Mon Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('organizations')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-black transition-all duration-300 active:scale-95 ${
                  activeTab === 'organizations'
                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-lg'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Globe className={`w-4 h-4 ${activeTab === 'organizations' ? 'text-primary-600' : 'text-slate-400'}`} />
                <span>Explorer</span>
              </button>
            </div>

            {activeTab === 'dashboard' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {joinedOrgIds.length === 0 ? (
                   <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 text-center border-2 border-slate-100 dark:border-slate-800 shadow-2xl">
                      <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6"><Building className="w-10 h-10 text-primary-600" /></div>
                      <h2 className="text-2xl font-black mb-3">Prêt pour l'aventure ?</h2>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto text-base">Rejoignez une association pour commencer à aider.</p>
                      <Button onClick={() => setActiveTab('organizations')} size="lg">Découvrir les associations</Button>
                   </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-br from-primary-600 to-emerald-500 dark:from-primary-700 dark:to-emerald-600 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-primary-200 dark:shadow-none relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                           {joinedOrgIds.map(oid => (
                             <span key={oid} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                               {state.organizations.find(o => o.id === oid)?.name}
                             </span>
                           ))}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-3">Salut {state.currentUser?.firstName} ! 👋</h2>
                        <p className="text-white/80 font-medium mb-8 text-lg">Prêt pour tes prochaines missions ?</p>
                        <div className="flex gap-4 max-w-sm">
                          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 flex-1"><span className="block text-2xl font-black leading-none">{registeredMissions.length}</span><span className="text-[10px] uppercase tracking-wider font-bold opacity-70">Inscrit</span></div>
                          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 flex-1"><span className="block text-2xl font-black leading-none">{joinedOrgIds.length}</span><span className="text-[10px] uppercase tracking-wider font-bold opacity-70">Assos</span></div>
                        </div>
                      </div>
                    </div>

                    <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
                      <MiniAgenda 
                        selectedDate={selectedAgendaDate} 
                        onSelectDate={setSelectedAgendaDate} 
                        missionsDates={registeredMissions.map(m => m.dateStart)} 
                      />
                    </section>
                    
                    <section>
                      <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <CalendarIcon className="w-7 h-7 text-primary-500" /> 
                        {selectedAgendaDate ? `Planning du ${selectedAgendaDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}` : 'Mon Planning'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredRegisteredMissions.map(m => (
                          <MissionCard 
                            key={m.id} 
                            mission={m} 
                            role="volunteer" 
                            currentUser={state.currentUser} 
                            allUsers={state.users} 
                            onAction={handleMissionAction} 
                            onChat={setActiveChatMissionId} 
                            onViewParticipants={setViewingParticipantsMissionId} 
                            onViewMap={setViewingMapMission}
                            organizationName={state.organizations.find(o => o.id === m.organizationId)?.name}
                          />
                        ))}
                        {filteredRegisteredMissions.length === 0 && (
                          <div className="col-span-full py-12 px-6 bg-slate-50 dark:bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center animate-in fade-in slide-in-from-top-4">
                             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50"><CalendarIcon className="w-8 h-8 text-slate-400" /></div>
                             <p className="text-slate-500 dark:text-slate-400 font-medium">Aucune mission prévue pour ce jour.</p>
                             {selectedAgendaDate && (
                               <Button variant="ghost" size="sm" onClick={() => setSelectedAgendaDate(null)} className="mt-4">Voir tout mon planning</Button>
                             )}
                          </div>
                        )}
                      </div>
                    </section>

                    <section>
                       <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                         <Search className="w-7 h-7 text-primary-500" /> 
                         {selectedAgendaDate ? `Opportunités du ${selectedAgendaDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}` : 'Explorer les missions'}
                       </h3>
                       <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
                         {['Tout', 'Social', 'Maintenance', 'Event', 'Autre'].map(cat => (
                           <button key={cat} onClick={() => setSelectedCategory(cat)} 
                                   className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border-2 active:scale-95
                                     ${selectedCategory === cat ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'}`}>{cat}</button>
                         ))}
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {filteredAvailableMissions.map(m => (
                            <MissionCard 
                              key={m.id} 
                              mission={m} 
                              role="volunteer" 
                              currentUser={state.currentUser} 
                              allUsers={state.users} 
                              onAction={handleMissionAction} 
                              onChat={setActiveChatMissionId} 
                              onViewParticipants={setViewingParticipantsMissionId} 
                              onViewMap={setViewingMapMission}
                              organizationName={state.organizations.find(o => o.id === m.organizationId)?.name}
                            />
                         ))}
                         {filteredAvailableMissions.length === 0 && (
                            <div className="col-span-full py-12 px-6 bg-slate-50 dark:bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center animate-in fade-in slide-in-from-top-4">
                               <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50"><Search className="w-8 h-8 text-slate-400" /></div>
                               <p className="text-slate-500 dark:text-slate-400 font-medium px-4">
                                 {selectedAgendaDate 
                                   ? `Pas d'autres missions disponibles pour le ${selectedAgendaDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}.`
                                   : "Aucune mission disponible dans cette catégorie."}
                               </p>
                            </div>
                         )}
                       </div>
                    </section>
                  </>
                )}
              </div>
            )}

            {activeTab === 'calendar' && (
              <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-primary-500" /> Mon Calendrier
                  </h2>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
                    <div key={d} className="text-center text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 md:gap-3">
                  {Array.from({ length: getDaysInMonth(calendarDate).offset }).map((_, i) => <div key={i} />)}
                  {Array.from({ length: getDaysInMonth(calendarDate).daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = new Date().toDateString() === new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day).toDateString();
                    const userMissions = volunteerMissions.filter(m => m.participants.includes(state.currentUser!.id));
                    const hasM = userMissions.some(m => {
                        const d = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                        return d >= new Date(new Date(m.dateStart).setHours(0,0,0,0)) && d <= new Date(new Date(m.dateEnd || m.dateStart).setHours(23,59,59,999));
                    });
                    return (
                      <div key={day} className={`h-12 md:h-20 rounded-2xl flex items-center justify-center text-sm md:text-lg font-bold transition-all border-2
                                ${hasM ? 'bg-primary-600 text-white border-primary-500 shadow-lg' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent'}
                                ${isToday ? 'ring-2 ring-primary-500 ring-offset-4 dark:ring-offset-slate-900' : ''}`}>
                        {day}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === 'organizations' && (
              <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* 1. JOIN BY CODE */}
                <div className="bg-primary-50 dark:bg-primary-950/20 p-8 rounded-[2.5rem] border-2 border-primary-100 dark:border-primary-900/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-primary-900 dark:text-primary-100 flex items-center gap-2">
                        <Key className="w-6 h-6 text-primary-600" /> Rejoindre avec un code
                      </h3>
                      <p className="text-sm text-primary-700 dark:text-primary-400 font-medium">Saisissez le code fourni par votre association pour commencer.</p>
                    </div>
                    <div className="flex gap-2 w-full md:max-w-xs">
                      <Input 
                        placeholder="Ex: COQ-2025" 
                        value={joinCodeInput} 
                        onChange={(e) => setJoinCodeInput(e.target.value)} 
                        className="!min-h-[44px] !py-2 !bg-white dark:!bg-slate-900" 
                      />
                      <Button onClick={() => {
                        const org = state.organizations.find(o => o.code.toLowerCase() === joinCodeInput.toLowerCase());
                        if(org) handleJoinOrganization(org.id);
                        else alert("Code invalide");
                        setJoinCodeInput('');
                      }} size="sm">Valider</Button>
                    </div>
                  </div>
                </div>

                {/* 2. JOINED ORGANIZATIONS */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <CheckCircle className="w-7 h-7 text-emerald-500" /> Mes Associations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {joinedOrgs.map(org => (
                      <div key={org.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border-2 border-primary-500/30 shadow-sm transition-all hover:shadow-xl relative">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200 dark:shadow-none">
                              <Building className="w-7 h-7" />
                           </div>
                           <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                             <Check className="w-3 h-3" /> Membre
                           </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{org.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">CODE: {org.code}</p>
                        <Button 
                          variant="secondary" 
                          fullWidth 
                          onClick={() => handleLeaveOrganization(org.id)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Quitter
                        </Button>
                      </div>
                    ))}
                    {joinedOrgs.length === 0 && (
                      <div className="col-span-full py-10 px-6 bg-slate-100/50 dark:bg-slate-800/20 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 font-medium italic">
                        Vous n'avez pas encore d'association rejointe.
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. AVAILABLE ORGANIZATIONS */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-black flex items-center gap-3">
                    <Search className="w-7 h-7 text-primary-500" /> Découvrir
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableOrgs.map(org => (
                      <div key={org.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors flex items-center justify-center">
                              <Building className="w-7 h-7" />
                           </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{org.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">CODE: {org.code}</p>
                        <Button fullWidth onClick={() => handleJoinOrganization(org.id)}>
                          Rejoindre
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

              </section>
            )}
          </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* Profile Edit Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Mon Profil">
          <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <img 
                      src={profileFormData.avatar || `https://ui-avatars.com/api/?name=${profileFormData.firstName}+${profileFormData.lastName}&background=random`} 
                      alt="Preview" 
                      className="w-24 h-24 rounded-[2rem] border-4 border-primary-50 shadow-lg object-cover" 
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarSelect} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <div className="text-center mt-3">
                    <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>Changer de photo</Button>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">@{state.currentUser?.username}</p>
                  </div>
              </div>
              <Input label="Prénom" value={profileFormData.firstName} onChange={e => setProfileFormData({...profileFormData, firstName: e.target.value})} required />
              <Input label="Nom" value={profileFormData.lastName} onChange={e => setProfileFormData({...profileFormData, lastName: e.target.value})} />
              
              <div className="pt-4 flex flex-col gap-2">
                  <Button type="submit" fullWidth size="lg">Enregistrer</Button>
                  <Button type="button" variant="ghost" fullWidth onClick={() => setIsProfileModalOpen(false)}>Annuler</Button>
              </div>
          </form>
      </Modal>

      {/* Custom Confirmation Dialog */}
      <Modal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} title={confirmDialog.title}>
          <div className="flex flex-col items-center text-center space-y-6 py-2">
              <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center ${confirmDialog.variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-500'}`}>
                  <AlertTriangle className="w-8 h-8" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{confirmDialog.message}</p>
              <div className="grid grid-cols-2 gap-3 w-full">
                  <Button variant="secondary" fullWidth onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}>Annuler</Button>
                  <Button variant={confirmDialog.variant === 'danger' ? 'danger' : 'primary'} fullWidth onClick={confirmDialog.onConfirm}>Confirmer</Button>
              </div>
          </div>
      </Modal>

      <Modal isOpen={!!viewingParticipantsMissionId} onClose={() => setViewingParticipantsMissionId(null)} title="Bénévoles Inscrits">
          <div className="space-y-4">
              {state.missions.find(m => m.id === viewingParticipantsMissionId)?.participants.length === 0 ? (
                  <p className="text-center text-slate-500 py-4 font-medium">Aucun bénévole inscrit pour le moment.</p>
              ) : (
                  <div className="space-y-3">
                      {state.missions.find(m => m.id === viewingParticipantsMissionId)?.participants.map(pid => {
                          const user = state.users.find(u => u.id === pid);
                          if (!user) return null;
                          return (
                              <div key={user.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                  <img src={user.avatar} alt={user.firstName} className="w-12 h-12 rounded-xl object-cover" />
                                  <div className="flex-1">
                                      <p className="font-bold text-slate-900 dark:text-white leading-none">{user.firstName} {user.lastName}</p>
                                      <p className="text-xs text-slate-500 mt-1">@{user.username}</p>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              )}
              <Button fullWidth onClick={() => setViewingParticipantsMissionId(null)}>Fermer</Button>
          </div>
      </Modal>
      
      <Modal isOpen={!!viewingMapMission} onClose={() => setViewingMapMission(null)} title={`Objectifs : ${viewingMapMission?.title}`}>
          <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                  {viewingMapMission?.objectives?.map(obj => (
                      <button 
                        key={obj.id} 
                        onClick={() => handleObjectiveFocus(obj)}
                        className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-xl border border-primary-100"
                      >
                          <Flag className="w-3.5 h-3.5" />
                          <span className="text-xs font-black uppercase tracking-wider">{obj.title || 'Sans titre'}</span>
                      </button>
                  ))}
              </div>
              <div ref={mapContainerRef} className="h-72 md:h-96 w-full rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-inner" />
              <Button fullWidth onClick={() => setViewingMapMission(null)}>Fermer</Button>
          </div>
      </Modal>

      <Modal isOpen={isMissionModalOpen} onClose={() => setIsMissionModalOpen(false)} title={missionFormData.id ? "Editer la Mission" : "Nouvelle Mission"}>
          <div className="space-y-6">
            <Input label="Titre de la mission" value={missionFormData.title} onChange={e => setMissionFormData({...missionFormData, title: e.target.value})} placeholder="Ex: Ramassage plage" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input label="Début" type="datetime-local" value={missionFormData.dateStart} onChange={e => setMissionFormData({...missionFormData, dateStart: e.target.value})} />
               <Input label="Fin" type="datetime-local" value={missionFormData.dateEnd || ''} onChange={e => setMissionFormData({...missionFormData, dateEnd: e.target.value})} />
            </div>
            <Input label="Lieu global" value={missionFormData.location} onChange={e => setMissionFormData({...missionFormData, location: e.target.value})} placeholder="Ex: Marseille" />
            
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-primary-500" /> Objectifs précis
                    </label>
                </div>
                
                <div className="space-y-3">
                    {missionFormData.objectives?.map((obj, idx) => (
                        <div key={obj.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <div className="flex items-center gap-2">
                                <Input 
                                    placeholder={`Objectif ${idx + 1}`} 
                                    value={obj.title} 
                                    onChange={e => updateObjectiveTitle(obj.id, e.target.value)} 
                                    className="!min-h-[40px] !py-2 !text-sm"
                                />
                                <button onClick={() => removeObjective(obj.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 px-3 rounded-xl border border-slate-200">
                                <div className="flex flex-col">
                                   <span className="text-[10px] font-mono text-slate-400">Lat: {obj.lat.toFixed(4)}</span>
                                   <span className="text-[10px] font-mono text-slate-400">Lng: {obj.lng.toFixed(4)}</span>
                                </div>
                                <div className="flex gap-2">
                                   <Button size="sm" variant="secondary" className="!min-h-[32px] !px-3 !text-xs" onClick={() => openPickerForObjective(obj.id)}>Placer</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button variant="secondary" fullWidth size="sm" onClick={addObjective} className="flex items-center gap-2 border-dashed border-2">
                        <Plus className="w-4 h-4" /> Nouvel objectif géographique
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <Button fullWidth size="lg" onClick={handleSaveMission}>{missionFormData.id ? "Mettre à jour" : "Lancer la mission"}</Button>
                {missionFormData.id && <Button variant="ghost" className="text-red-500 hover:text-red-600" onClick={handleDeleteMission}>Supprimer définitivement</Button>}
            </div>
          </div>
      </Modal>

      <Modal isOpen={isMapPickerOpen} onClose={() => setIsMapPickerOpen(false)} title="Point de rendez-vous" zIndex="z-[60]">
        <div className="space-y-4">
          <div ref={mapContainerRef} className="h-72 md:h-96 w-full rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-inner" />
          <div className="flex gap-3">
             <Button variant="secondary" fullWidth onClick={detectLocation} className="flex items-center gap-2"> Ma position</Button>
             <Button fullWidth onClick={() => setIsMapPickerOpen(false)}>Valider ce point</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isOrgCodeModalOpen} onClose={() => setIsOrgCodeModalOpen(false)} title="Code Association">
          <div className="flex flex-col items-center py-6">
              <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-[2rem] flex items-center justify-center mb-8"><Key className="w-12 h-12 text-primary-600" /></div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 px-8 py-5 rounded-[1.5rem] border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center">
                  <span className="text-4xl font-black tracking-[0.2em] text-slate-900 dark:text-white font-mono">{state.currentOrganization?.code}</span>
              </div>
          </div>
      </Modal>

      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Bye bye ?">
          <div className="space-y-6 py-4">
              <p className="text-slate-600 dark:text-slate-400 font-medium text-center text-lg">Prêt à nous quitter pour aujourd'hui ?</p>
              <div className="flex flex-col gap-3">
                  <Button variant="danger" size="lg" fullWidth onClick={logout}>Déconnexion</Button>
                  <Button variant="ghost" fullWidth onClick={() => setIsLogoutModalOpen(false)}>Rester ici</Button>
              </div>
          </div>
      </Modal>

      {activeChatMissionId && (
        <ChatDrawer mission={state.missions.find(m => m.id === activeChatMissionId)!} currentUser={state.currentUser!} onClose={() => setActiveChatMissionId(null)} onSendMessage={handleSendMessage} />
      )}
    </div>
  );
}
