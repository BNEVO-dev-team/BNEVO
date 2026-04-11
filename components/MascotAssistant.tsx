
import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Role } from '../types';
import mascotte from '../public/images/MASCOTTE.png';

interface MascotAssistantProps {
  role: Role;
}

export const MascotAssistant: React.FC<MascotAssistantProps> = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotified, setHasNotified] = useState(true);

  const isVolunteer = role === 'volunteer';

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden pointer-events-auto"
          >
            <div className="p-4 bg-primary-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <img src="/images/ICONE.png" alt="Icon" className="w-5 h-5" referrerPolicy="no-referrer" />
                </div>
                <span className="text-white font-bold text-sm">Assistant BNEVO</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                  <img src="/images/MASCOTTE.png" alt="Mascot" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {role === 'volunteer' 
                      ? "Bonjour ! Je suis votre assistant BNEVO. Besoin d'un coup de main pour trouver une association ou rejoindre une mission ?"
                      : role === 'organizer'
                      ? "Bonjour ! Je suis votre assistant BNEVO. Besoin d'un coup de main pour organiser votre prochaine mission ?"
                      : "Bonjour ! Bienvenue sur BNEVO. Je suis là pour vous aider à découvrir notre plateforme. Que souhaitez-vous faire ?"
                    }
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {role === 'volunteer' ? (
                  <>
                    <button className="w-full text-left p-2.5 text-[11px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 transition-colors">
                      Comment rejoindre une association ?
                    </button>
                    <button className="w-full text-left p-2.5 text-[11px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 transition-colors">
                      Comment s'inscrire à une mission ?
                    </button>
                  </>
                ) : role === 'organizer' ? (
                  <>
                    <button className="w-full text-left p-2.5 text-[11px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 transition-colors">
                      Comment créer une mission ?
                    </button>
                    <button className="w-full text-left p-2.5 text-[11px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 transition-colors">
                      Gérer mes bénévoles
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full text-left p-2.5 text-[11px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 transition-colors">
                      A quoi sert BNEVO?
                    </button>
                    <button className="w-full text-left p-2.5 text-[11px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 transition-colors">
                      Comment ça marche ?
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNotified(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative pointer-events-auto group"
      >
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border-2 border-primary-500 flex items-center justify-center overflow-hidden group-hover:border-primary-600 transition-colors">
          <img 
            src={mascotte}
            alt="Mascot Assistant" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {hasNotified && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-primary-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        )}
        
        {!isOpen && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Besoin d'aide ?
          </div>
        )}
      </motion.button>
    </div>
  );
};
