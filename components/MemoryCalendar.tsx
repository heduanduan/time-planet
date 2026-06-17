'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MemoryCalendarProps {
  year: number;
  month: number;
  highlightedDates: string[];
  onMonthChange: (year: number, month: number) => void;
  onDateClick: (date: string) => void;
}

export default function MemoryCalendar({
  year,
  month,
  highlightedDates,
  onMonthChange,
  onDateClick,
}: MemoryCalendarProps) {
  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    
    // 填充上月空白
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // 填充本月日期
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        date: dateStr,
        hasMemory: highlightedDates.includes(dateStr),
      });
    }

    return { days, firstDay, lastDay };
  }, [year, month, highlightedDates]);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const prevMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  const formatMonth = () => {
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return `${year} · ${months[month]}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20">
      {/* 月份标题 */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-cosmic-purple"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <h2 className="text-base sm:text-xl font-bold text-white">{formatMonth()}</h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-cosmic-purple"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm text-gray-400 font-medium py-1 sm:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.days.map((day, index) => {
          if (!day) {
            return <div key={index} className="aspect-square" />;
          }

          return (
            <button
              key={day.date}
              onClick={() => onDateClick(day.date)}
              className={`
                relative aspect-square rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300
                hover:bg-white/20 hover:scale-105
                ${day.hasMemory 
                  ? 'bg-gradient-to-br from-purple-500/40 to-indigo-500/40 text-white' 
                  : 'bg-white/5 text-gray-300 hover:text-white'
                }
              `}
            >
              <span className="flex items-center justify-center h-full">{day.day}</span>
              {day.hasMemory && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}