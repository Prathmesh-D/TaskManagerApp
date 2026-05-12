import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { getCategoryColor } from '../../utils/helpers';

export default function MiniCalendar({ tasks, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    // Pad month and day to always be 2 digits
    const paddedMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const paddedDay = String(i + 1).padStart(2, '0');
    const dateString = `${currentDate.getFullYear()}-${paddedMonth}-${paddedDay}`;
    
    // Check if there are active tasks due on this date
    const dueTasks = tasks.filter(t => !t.completed && t.due_date === dateString);
    const dayTasks = dueTasks.map(t => ({
      id: t.id,
      title: t.title,
      categoryColor: getCategoryColor(t.category),
      priority: t.priority
    }));
    const isToday = isCurrentMonth && today.getDate() === i + 1;
    
    return { day: i + 1, hasTasks: dueTasks.length > 0, dayTasks, isToday, dateString };
  });

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-panel border border-line rounded-xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ink">{monthName}</h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 rounded text-ink-tertiary hover:text-ink hover:bg-subtle transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1 rounded text-ink-tertiary hover:text-ink hover:bg-subtle transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-2xs font-medium text-ink-tertiary">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {days.map(({ day, hasTasks, isToday, dayTasks, dateString }) => (
          <button
            key={day}
            onClick={() => onDateSelect && onDateSelect(dateString)}
            className={`
              group relative h-8 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer
              ${isToday ? 'bg-accent text-accent-fg font-bold shadow-sm' : 'text-ink-secondary hover:bg-subtle hover:text-ink'}
            `}
          >
            <span className="relative z-10">{day}</span>
            {hasTasks && !isToday && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-danger" />
            )}
            {hasTasks && isToday && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white opacity-80" />
            )}
            
            {hasTasks && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-max max-w-[200px] bg-ink text-canvas text-2xs p-2.5 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 shadow-elevated">
                <div className="flex flex-col gap-2 text-left">
                  {dayTasks.map((t) => (
                    <div key={t.id} className="flex items-center gap-1.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: t.categoryColor }} />
                      <span className="truncate">{t.title}</span>
                      {t.priority === 'high' && <span className="text-danger font-bold ml-1 shrink-0 leading-none">!</span>}
                    </div>
                  ))}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
