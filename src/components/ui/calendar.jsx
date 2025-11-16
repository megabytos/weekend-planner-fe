'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const TOTAL_DAYS = 42;

export default function Calendar({ onSelect = null }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0);
    const daysInPrevMonth = prevMonthLastDay.getDate();
    
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    const days = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      const day = daysInPrevMonth - startDayOfWeek + i + 1;
      days.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        date: new Date(prevYear, prevMonth, day),
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        month,
        year,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }
    
    const remainingDays = TOTAL_DAYS - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        date: new Date(nextYear, nextMonth, day),
      });
    }
    
    return days;
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (dayItem) => {
    if (!dayItem) return false;
    return (
      dayItem.date.getDate() === today.getDate() &&
      dayItem.date.getMonth() === today.getMonth() &&
      dayItem.date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (dayItem) => {
    if (!dayItem || !selectedDate) return false;
    return (
      dayItem.date.getDate() === selectedDate.getDate() &&
      dayItem.date.getMonth() === selectedDate.getMonth() &&
      dayItem.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleSelectDay = (dayItem) => {
    if (!dayItem) return;
    setSelectedDate(dayItem.date);
    if (onSelect) {
      onSelect(dayItem.date);
    }
  };

  return (
    <div 
      className="box-border w-[335px] h-[273px] flex flex-col items-center p-4 gap-5 bg-white rounded-[10px]"
      style={{
        border: '1px solid var(--blue)',
      }}
    >
      {/* Header */}
      <div className="flex flex-row justify-center items-center p-0 gap-[65px] w-[303px] h-6 drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)]">
        <button
          onClick={handlePrevMonth}
          className="w-6 h-6 flex items-center justify-center hover:opacity-70"
          type="button"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 stroke-black" />
        </button>

        <span 
          className="w-[125px] h-[19px] font-inter font-semibold text-[16px] leading-[120%] flex items-center justify-center text-center text-black"
        >
          {currentDate.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </span>

        <button
          onClick={handleNextMonth}
          className="w-6 h-6 flex items-center justify-center hover:opacity-70"
          type="button"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 stroke-black" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 p-0 w-[287px] h-[14px] drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_1px_1px_rgba(0,0,0,0.05)]">
        {weekdays.map((day) => (
          <div
            key={day}
            className="w-[41px] h-[14px] font-inter font-semibold text-[12px] leading-[120%] flex items-center justify-center text-center text-[#475467]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="w-[293px] h-[163px] overflow-hidden">
        <div className="grid grid-cols-7" style={{ 
          gridTemplateRows: 'repeat(6, 27.17px)',
          gap: 0
        }}>
          {calendarDays.map((dayItem, i) => {
            const isCurrent = isToday(dayItem);
            const isPicked = isSelected(dayItem);
            const isOtherMonth = !dayItem.isCurrentMonth;

            return (
              <div 
                key={i} 
                className="flex items-center justify-center" 
                style={{ height: '27.17px', width: '41px' }}
              >
                <button
                  onClick={() => handleSelectDay(dayItem)}
                  type="button"
                  className={`w-[41px] h-[27px] flex items-center justify-center rounded-[10px] font-inter font-normal text-[14px] leading-[120%] text-center transition-colors
                    ${!isPicked && dayItem.isCurrentMonth && !isCurrent ? 'hover:bg-[#E5ECFF] cursor-pointer' : ''}
                    ${isOtherMonth ? 'opacity-60' : ''}
                    ${!isPicked && !dayItem.isCurrentMonth ? 'cursor-default' : ''}
                  `}
                  style={{
                    color: isPicked 
                      ? 'white' 
                      : isOtherMonth 
                        ? '#9CA3AF' 
                        : 'var(--black)',
                    backgroundColor: isPicked 
                      ? 'var(--blue)' 
                      : isCurrent 
                        ? 'var(--blue-light)' 
                        : 'transparent',
                  }}
                  aria-label={`${dayItem.isCurrentMonth ? 'Current month' : 'Other month'} day ${dayItem.day}`}
                >
                  {dayItem.day}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
