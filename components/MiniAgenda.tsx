
import React, { useRef } from 'react';
import { Calendar as CalendarIcon, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniAgendaProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  missionsDates: string[]; // ISO strings of dates where user has missions
}

export const MiniAgenda: React.FC<MiniAgendaProps> = ({ selectedDate, onSelectDate, missionsDates }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const hasMissionOnDay = (date: Date) => {
    return missionsDates.some(mStr => {
      const mDate = new Date(mStr);
      return isSameDay(mDate, date);
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Environ 4-5 jours
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary-500" /> 
          Mon agenda
        </h3>
        {selectedDate && (
          <button 
            onClick={() => onSelectDate(null)}
            className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-3 h-3" /> Réinitialiser
          </button>
        )}
      </div>

      <div className="relative group/agenda">
        {/* Navigation Arrows - Only visible on desktop/hover */}
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 z-20 opacity-0 group-hover/agenda:opacity-100 transition-opacity hidden md:block">
          <button 
            onClick={() => scroll('left')}
            className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:scale-110 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-1/2 -right-2 -translate-y-1/2 z-20 opacity-0 group-hover/agenda:opacity-100 transition-opacity hidden md:block">
          <button 
            onClick={() => scroll('right')}
            className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-600 hover:scale-110 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Conteneur défilable avec snap-scroll */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory scroll-smooth"
        >
          {days.map((date, i) => {
            const active = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const hasMission = hasMissionOnDay(date);

            return (
              <button
                key={i}
                onClick={() => onSelectDate(active ? null : new Date(date))}
                className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all border-2 snap-center
                  ${active 
                    ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-200 dark:shadow-none scale-105 z-10' 
                    : isToday 
                      ? 'bg-white dark:bg-slate-800 border-primary-500/50 text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary-200'
                  }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${active ? 'text-primary-100' : 'text-slate-400'}`}>
                  {date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')}
                </span>
                <span className="text-xl font-black leading-none">{date.getDate()}</span>
                {hasMission && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 ${active ? 'bg-white' : 'bg-primary-500 animate-pulse'}`} />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Masque visuel pour indiquer le scroll à droite */}
        {!selectedDate && (
          <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none opacity-80 group-hover/agenda:opacity-0 transition-opacity" />
        )}
      </div>
    </div>
  );
};
