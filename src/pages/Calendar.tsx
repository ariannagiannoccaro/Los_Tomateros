import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../utils/cn';

export function Calendar() {
  const { events, attendances, currentUser } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) =>
      isSameDay(parseISO(event.date), date)
    );
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      charla: 'bg-blue-500',
      taller: 'bg-green-500',
      feria: 'bg-purple-500',
      conferencia: 'bg-amber-500',
      seminario: 'bg-rose-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendario de Eventos</h1>
        <p className="text-gray-500 mt-1">
          Visualiza todos los eventos programados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dayName) => (
              <div
                key={dayName}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, i) => {
              const dayEvents = getEventsForDate(date);
              const isToday = isSameDay(date, new Date());
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isCurrentMonth = isSameMonth(date, currentDate);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    'min-h-[80px] p-2 rounded-lg text-left transition-colors relative',
                    isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50',
                    isSelected && 'ring-2 ring-indigo-500',
                    isToday && 'bg-indigo-50'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-medium',
                      !isCurrentMonth && 'text-gray-400',
                      isToday && 'text-indigo-600'
                    )}
                  >
                    {format(date, 'd')}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          'text-xs text-white px-1 py-0.5 rounded truncate',
                          getTypeColor(event.type)
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} más
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded" />
              <span>Charla</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded" />
              <span>Taller</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded" />
              <span>Feria</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded" />
              <span>Conferencia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-rose-500 rounded" />
              <span>Seminario</span>
            </div>
          </div>
        </div>

        {/* Selected Day Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate
              ? format(selectedDate, "d 'de' MMMM", { locale: es })
              : 'Selecciona una fecha'}
          </h3>
          {selectedDate ? (
            selectedEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay eventos para esta fecha
              </p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => {
                  const isRegistered = attendances.some(
                    (a) =>
                      a.eventId === event.id && a.userId === currentUser?.id
                  );
                  return (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-1 h-full min-h-[60px] rounded-full',
                            getTypeColor(event.type)
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-gray-900 line-clamp-1">
                              {event.title}
                            </h4>
                            {isRegistered && (
                              <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Inscrito
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.startTime} - {event.endTime}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          ) : (
            <p className="text-gray-500 text-center py-8">
              Haz clic en una fecha del calendario para ver los eventos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
