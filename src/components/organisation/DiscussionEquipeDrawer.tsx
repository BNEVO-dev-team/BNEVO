import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Users, MessageSquare } from 'lucide-react';
import { Mission, VolunteerProfile } from '../../types';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isSelf: boolean;
}

interface DiscussionEquipeDrawerProps {
  mission: Mission;
  volunteers: VolunteerProfile[];
  onClose: () => void;
}

export const DiscussionEquipeDrawer: React.FC<DiscussionEquipeDrawerProps> = ({
  mission,
  volunteers,
  onClose,
}) => {
  // 1. Identify ONLY the volunteers assigned to THIS specific mission
  const assignedMemberIds = Array.from(
    new Set(mission.creneaux.flatMap((c) => c.enrolledUserIds))
  );

  const assignedVolunteers: VolunteerProfile[] = assignedMemberIds
    .map((id) => volunteers.find((v) => v.id === id))
    .filter((v): v is VolunteerProfile => Boolean(v));

  // Storage key uniquely scoped to this specific mission
  const storageKey = `bnevo_mission_chat_${mission.id}`;

  // Build realistic initial conversation tailored to this mission and its ACTUAL assigned members
  const getDefaultMessagesForMission = (): Message[] => {
    if (assignedVolunteers.length === 0) {
      return [];
    }

    if (mission.id === 'mis_nettoyage') {
      const vol1 = assignedVolunteers[0]; // Marie Dupont
      const vol2 = assignedVolunteers[1]; // Jean Lefevre

      const list: Message[] = [
        {
          id: `${mission.id}_msg_1`,
          senderId: vol1.id,
          senderName: vol1.name.split(' ')[0],
          senderAvatar: vol1.avatarUrl,
          content: "Bonjour l'équipe ! Est-ce que les sacs et les gants étanches sont fournis sur place ?",
          timestamp: '08:14',
          isSelf: false,
        },
        {
          id: `${mission.id}_msg_2`,
          senderId: 'orga_self',
          senderName: 'Organisation',
          content: `Bonjour ${vol1.name.split(' ')[0]} ! Oui, tout l'équipement de nettoyage est fourni au point d'accueil. Pensez simplement à de bonnes chaussures !`,
          timestamp: '08:21',
          isSelf: true,
        },
      ];

      if (vol2) {
        list.push({
          id: `${mission.id}_msg_3`,
          senderId: vol2.id,
          senderName: vol2.name.split(' ')[0],
          senderAvatar: vol2.avatarUrl,
          content: 'Parfait, je serai là à 8h50 pour installer le stand.',
          timestamp: '08:25',
          isSelf: false,
        });
      }

      return list;
    }

    if (mission.id === 'mis_distrib') {
      const vol = assignedVolunteers[0]; // Théo Dupont or enrolled volunteer
      return [
        {
          id: `${mission.id}_msg_1`,
          senderId: vol.id,
          senderName: vol.name.split(' ')[0],
          senderAvatar: vol.avatarUrl,
          content: 'Bonjour ! Y aura-t-il besoin de bras pour décharger les cagettes de denrées à 17h45 ?',
          timestamp: '16:30',
          isSelf: false,
        },
        {
          id: `${mission.id}_msg_2`,
          senderId: 'orga_self',
          senderName: 'Organisation',
          content: `Bonjour ${vol.name.split(' ')[0]}, oui carrément ! Ton coup de main en avance sera précieux pour préparer la salle. Merci !`,
          timestamp: '16:42',
          isSelf: true,
        },
      ];
    }

    // Generic initial message for any other mission having assigned members
    const firstVol = assignedVolunteers[0];
    return [
      {
        id: `${mission.id}_msg_init_1`,
        senderId: firstVol.id,
        senderName: firstVol.name.split(' ')[0],
        senderAvatar: firstVol.avatarUrl,
        content: `Bonjour à tous, ravi d'intégrer l'équipe pour « ${mission.title} » !`,
        timestamp: '09:00',
        isSelf: false,
      },
      {
        id: `${mission.id}_msg_init_2`,
        senderId: 'orga_self',
        senderName: 'Organisation',
        content: `Bienvenue ${firstVol.name.split(' ')[0]} ! N'hésite pas si tu as la moindre question avant le début de la mission.`,
        timestamp: '09:15',
        isSelf: true,
      },
    ];
  };

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.error('Failed to parse chat messages from storage', e);
      }
    }
    return getDefaultMessagesForMission();
  });

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide the floating chatbot helper when team chat is open
  useEffect(() => {
    document.body.classList.add('hide-chatbot');
    return () => {
      document.body.classList.remove('hide-chatbot');
    };
  }, []);

  // Persist messages changes for this specific mission
  const persistMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newMessages));
      } catch (e) {
        console.error('Failed to persist mission chat', e);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: Message = {
      id: `${mission.id}_msg_${Date.now()}`,
      senderId: 'orga_self',
      senderName: 'Organisation',
      content: text,
      timestamp: timeStr,
      isSelf: true,
    };

    const updated = [...messages, newMsg];
    persistMessages(updated);
    setInputMessage('');

    // If volunteers are assigned to this mission, have one respond naturally
    if (assignedVolunteers.length > 0) {
      const respondent = assignedVolunteers[Math.floor(Math.random() * assignedVolunteers.length)];
      setTimeout(() => {
        const replyMsg: Message = {
          id: `${mission.id}_msg_${Date.now() + 1}`,
          senderId: respondent.id,
          senderName: respondent.name.split(' ')[0],
          senderAvatar: respondent.avatarUrl,
          content: text.includes('?')
            ? `Bien reçu pour ma part, merci pour la précision !`
            : `Bien noté, à très vite pour la mission !`,
          timestamp: timeStr,
          isSelf: false,
        };
        persistMessages([...updated, replyMsg]);
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-white flex-shrink-0">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide font-display">
              DISCUSSION D'ÉQUIPE
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-[280px]">
              {mission.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer la discussion"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assigned Volunteers Banner */}
        <div className="px-4 py-2.5 bg-[#d1fae5]/50 border-b border-emerald-100/70 flex items-center justify-between flex-shrink-0 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold text-slate-800">
              {assignedVolunteers.length > 0
                ? `${assignedVolunteers.length} membre${assignedVolunteers.length > 1 ? 's' : ''} assigné${assignedVolunteers.length > 1 ? 's' : ''}`
                : 'Aucun membre assigné'}
            </span>
          </div>

          <div className="flex items-center -space-x-1.5">
            {assignedVolunteers.map((vol) => (
              <div
                key={vol.id}
                className="w-5 h-5 rounded-full overflow-hidden border border-white bg-slate-200 shadow-2xs"
                title={vol.name}
              >
                {vol.avatarUrl ? (
                  <img src={vol.avatarUrl} alt={vol.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-emerald-300 text-[9px] font-bold flex items-center justify-center text-emerald-900">
                    {vol.name.slice(0, 1)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white">
          {messages.length > 0 ? (
            messages.map((msg) => {
              if (msg.isSelf) {
                // Self message (Organisation green bubble on the right)
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-[#009560] text-white rounded-2xl rounded-tr-xs p-3.5 max-w-[85%] shadow-xs">
                      <p className="text-xs sm:text-sm font-medium leading-relaxed">
                        {msg.content}
                      </p>
                      <div className="text-[10px] text-emerald-100 text-right mt-1 font-mono">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              }

              // Assigned Volunteer message (Left aligned with volunteer's real avatar)
              return (
                <div key={msg.id} className="flex items-start gap-2.5 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 mt-1 shadow-2xs">
                    {msg.senderAvatar ? (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-emerald-600">
                        {msg.senderName.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs flex-1">
                    <span className="block text-[11px] font-bold text-slate-500 mb-1">
                      {msg.senderName}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed">
                      {msg.content}
                    </p>
                    <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">
                Aucun message pour cette mission
              </h4>
              <p className="text-xs max-w-xs leading-relaxed">
                {assignedVolunteers.length > 0
                  ? `Lancez la discussion pour échanger avec ${assignedVolunteers.map((v) => v.name).join(', ')} !`
                  : `Dès qu'un bénévole s'inscrira à cette mission, vous pourrez échanger avec lui ici.`}
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                assignedVolunteers.length > 0
                  ? `Écrire à l'équipe (${assignedVolunteers.map((v) => v.name.split(' ')[0]).join(', ')})...`
                  : 'Écrivez votre message...'
              }
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 rounded-full bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer flex-shrink-0 shadow-2xs"
              aria-label="Envoyer le message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
