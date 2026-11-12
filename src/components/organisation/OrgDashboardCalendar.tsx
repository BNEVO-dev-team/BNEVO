import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Mission } from '../../types';

type DashboardMonth = 'juin' | 'octobre';

interface OrgDashboardCalendarProps {
  missions: Mission[];
  currentMonth: DashboardMonth;
  onMonthChange: (month: DashboardMonth) => void;
  onSelectDay: (day: number) => void;
}

const normalizeMissionDate = (date: string) => {
  if (date.includes('/')) {
    const [day, month, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  if (!date.startsWith('2026-')) {
    if (date.includes('15 juin')) return '2026-06-15';
    if (date.includes('20 juin')) return '2026-06-20';
  }
  return date;
};

export const OrgDashboardCalendar: React.FC<OrgDashboardCalendarProps> = ({
  missions,
  currentMonth,
  onMonthChange,
  onSelectDay,
}) => {
  const monthNumber = currentMonth === 'juin' ? '06' : '10';
  const emptyDays = currentMonth === 'juin'
    ? [null, null, null, null, null, null]
    : [null, null, null];
  const days = Array.from(
    { length: currentMonth === 'juin' ? 30 : 31 },
    (_, index) => index + 1
  );
  const monthLabel = currentMonth === 'juin' ? 'Juin 2026' : 'Octobre 2026';
  const toggleMonth = () => onMonthChange(currentMonth === 'juin' ? 'octobre' : 'juin');

  const getDayMissions = (day: number) => {
    const date = `2026-${monthNumber}-${day.toString().padStart(2, '0')}`;
    return missions.filter((mission) => {
      const startDate = normalizeMissionDate(mission.startDate);
      const endDate = normalizeMissionDate(mission.endDate || mission.startDate);

      return (
        (startDate.length >= 10 && endDate.length >= 10 && date >= startDate && date <= endDate) ||
        mission.creneaux.some((slot) => slot.date === date)
      );
    });
  };

  return (
    <div className="space-y-6 rounded-3xl border border-emerald-100/80 bg-white p-6 shadow-xs sm:p-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-emerald-600" />
          <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900 sm:text-lg">
            CALENDRIER
          </h2>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-[#d1fae5]/80 px-3 py-1.5 text-xs font-bold text-slate-800">
          <button
            type="button"
            onClick={toggleMonth}
            className="cursor-pointer p-0.5 hover:text-emerald-700"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>{monthLabel}</span>
          <button
            type="button"
            onClick={toggleMonth}
            className="cursor-pointer p-0.5 hover:text-emerald-700"
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center sm:gap-4">
        {['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'].map((day) => (
          <span
            key={day}
            className="text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center sm:gap-4">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-12 sm:h-14" />
        ))}
        {days.map((day) => {
          const activeMissions = getDayMissions(day);
          const hasActiveMission = activeMissions.length > 0;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              title={
                hasActiveMission
                  ? `Mission active : ${activeMissions.map((mission) => mission.title).join(', ')}. Cliquer pour créer une mission.`
                  : `Cliquer pour créer une mission le ${day} ${monthLabel}.`
              }
              className={`relative flex h-12 cursor-pointer items-center justify-center rounded-xl text-xs font-bold transition-all sm:h-14 sm:text-sm ${
                hasActiveMission
                  ? 'scale-102 bg-[#009560] text-white shadow-sm hover:bg-[#008053]'
                  : 'bg-[#d1fae5]/70 text-slate-800 hover:bg-[#d1fae5]'
              }`}
            >
              <span>{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
