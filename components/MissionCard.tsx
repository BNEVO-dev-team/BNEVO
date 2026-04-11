import React from 'react';
import { Calendar, MapPin, Users, MessageCircle, Eye, Map as MapIcon, Flag, Building } from 'lucide-react';
import { Mission, User } from '../types';
import { Button } from './ui/Button';

interface MissionCardProps {
  mission: Mission;
  allUsers: User[];
  currentUser: User | null;
  onAction: (missionId: string) => void;
  onChat: (missionId: string) => void;
  onViewParticipants: (missionId: string) => void;
  onViewMap?: (mission: Mission) => void;
  role: 'volunteer' | 'organizer';
  organizationName?: string;
}

export const MissionCard: React.FC<MissionCardProps> = ({ 
  mission, 
  allUsers, 
  currentUser, 
  onAction,
  onChat,
  onViewParticipants,
  onViewMap,
  role,
  organizationName
}) => {
  const participants = allUsers.filter(u => mission.participants.includes(u.id));
  const isRegistered = currentUser && mission.participants.includes(currentUser.id);
  
  const startDate = new Date(mission.dateStart);
  const endDate = mission.dateEnd ? new Date(mission.dateEnd) : startDate;
  
  const dateStr = startDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  const timeStartStr = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const timeEndStr = endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const isSameDay = startDate.toDateString() === endDate.toDateString();
  const showEndDate = mission.dateEnd && startDate.getTime() !== endDate.getTime();

  let dateDisplay = `${dateStr} • ${timeStartStr}`;
  if (showEndDate) {
    if (isSameDay) dateDisplay += ` - ${timeEndStr}`;
    else dateDisplay += ` au ${endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} ${timeEndStr}`;
  }

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Social': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
      case 'Maintenance': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300';
      case 'Event': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      default: return 'bg-primary-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const hasObjectives = mission.objectives && mission.objectives.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[1.75rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full active:scale-[0.98] md:active:scale-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center overflow-hidden">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getCategoryColor(mission.category)} whitespace-nowrap`}>
            {mission.category}
          </span>
          {organizationName && (
            <span className="flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-bold uppercase tracking-tight truncate border border-slate-100 dark:border-slate-700">
              <Building className="w-2.5 h-2.5" />
              {organizationName}
            </span>
          )}
        </div>
        {role === 'volunteer' && isRegistered && (
          <span className="flex-shrink-0 flex items-center text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-lg">
            Inscrit
          </span>
        )}
      </div>

      <h3 className="font-subtitle text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight flex-grow normal-case">{mission.title}</h3>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span>{dateDisplay}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-3 truncate">
            <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span className="truncate">{mission.location}</span>
          </div>
          {hasObjectives && (
            <button 
              onClick={(e) => { e.stopPropagation(); onViewMap && onViewMap(mission); }}
              className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:scale-105 transition-transform"
              title="Voir les objectifs sur la carte"
            >
              <MapIcon className="w-4 h-4" />
              <span className="text-[10px] font-black">{mission.objectives?.length}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-slate-800/50 rounded-2xl mb-5">
        <div className="flex -space-x-2">
            {participants.slice(0, 3).map((p) => (
                <img key={p.id} src={p.avatar} alt={p.firstName} className="w-8 h-8 rounded-xl border-2 border-white dark:border-slate-800 object-cover" />
            ))}
            {participants.length > 3 && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black">+{participants.length - 3}</div>
            )}
            {participants.length === 0 && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-2">Vide</span>}
        </div>
        <button onClick={() => onViewParticipants(mission.id)} className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
            <Eye className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <div className="flex-1">
          <Button 
            variant={role === 'organizer' ? 'secondary' : (isRegistered ? 'secondary' : 'primary')} 
            fullWidth 
            size="md"
            onClick={() => onAction(mission.id)}
          >
            {role === 'organizer' ? 'Gérer' : (isRegistered ? 'Se retirer' : 'Participer')}
          </Button>
        </div>
        <button 
          onClick={() => onChat(mission.id)}
          className="p-3 bg-primary-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary-600 rounded-xl transition-all active:scale-90"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};