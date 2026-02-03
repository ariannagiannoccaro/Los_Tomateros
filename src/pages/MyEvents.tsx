import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  CheckCircle,
  XCircle,
  Download,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../utils/cn';

export function MyEvents() {
  const { events, attendances, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showQR, setShowQR] = useState<string | null>(null);

  const today = new Date();
  const myAttendances = attendances.filter((a) => a.userId === currentUser?.id);

  const myEvents = myAttendances
    .map((att) => {
      const event = events.find((e) => e.id === att.eventId);
      return event ? { ...att, event } : null;
    })
    .filter(Boolean) as (typeof myAttendances[0] & { event: typeof events[0] })[];

  const upcomingEvents = myEvents.filter((e) =>
    isAfter(parseISO(e.event.date), today) || format(parseISO(e.event.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );
  const pastEvents = myEvents.filter((e) =>
    isBefore(parseISO(e.event.date), today) && format(parseISO(e.event.date), 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd')
  );

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      charla: 'bg-blue-100 text-blue-700',
      taller: 'bg-green-100 text-green-700',
      feria: 'bg-purple-100 text-purple-700',
      conferencia: 'bg-amber-100 text-amber-700',
      seminario: 'bg-rose-100 text-rose-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Inscripciones</h1>
        <p className="text-gray-500 mt-1">
          Gestiona tus eventos y accede a tus códigos QR
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 inline-flex">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            activeTab === 'upcoming'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          Próximos ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            activeTab === 'past'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          Anteriores ({pastEvents.length})
        </button>
      </div>

      {/* Events List */}
      {displayEvents.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No tienes inscripciones {activeTab === 'upcoming' ? 'próximas' : 'pasadas'}
          </h3>
          <p className="text-gray-500 mt-1 mb-4">
            Explora los eventos disponibles y regístrate
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ver Eventos
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayEvents.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-xl flex flex-col items-center justify-center">
                      <span className="text-xs text-indigo-600 font-medium uppercase">
                        {format(parseISO(item.event.date), 'MMM', { locale: es })}
                      </span>
                      <span className="text-2xl font-bold text-indigo-700">
                        {format(parseISO(item.event.date), 'd')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            getTypeColor(item.event.type)
                          )}
                        >
                          {item.event.type.charAt(0).toUpperCase() +
                            item.event.type.slice(1)}
                        </span>
                        {item.checkedIn ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Asistí
                          </span>
                        ) : activeTab === 'past' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                            <XCircle className="w-3 h-3" />
                            No asistí
                          </span>
                        ) : null}
                      </div>
                      <Link
                        to={`/events/${item.event.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors mt-1 block"
                      >
                        {item.event.title}
                      </Link>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.event.startTime} - {item.event.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {item.event.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {activeTab === 'upcoming' && !item.checkedIn && (
                    <button
                      onClick={() => setShowQR(item.id)}
                      className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <QrCode className="w-5 h-5" />
                      Ver QR
                    </button>
                  )}
                </div>
              </div>

              {/* Registration Info */}
              <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Inscrito el{' '}
                  {format(parseISO(item.registeredAt), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </span>
                <span className="text-gray-400">ID: {item.qrCode}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            {(() => {
              const att = myEvents.find((e) => e.id === showQR);
              if (!att) return null;
              return (
                <>
                  <h3 className="text-xl font-bold mb-2">{att.event.title}</h3>
                  <p className="text-gray-500 mb-6">
                    {format(parseISO(att.event.date), "d 'de' MMMM, yyyy", {
                      locale: es,
                    })}{' '}
                    • {att.event.startTime}
                  </p>
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl">
                    <QRCodeSVG
                      value={JSON.stringify({
                        eventId: att.event.id,
                        eventTitle: att.event.title,
                        attendanceId: att.id,
                        userId: currentUser?.id,
                        userName: currentUser?.name,
                      })}
                      size={200}
                      level="H"
                    />
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Muestra este código en la entrada del evento
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Código: {att.qrCode}
                  </p>
                  <div className="mt-6 flex gap-3 justify-center">
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                    <button
                      onClick={() => setShowQR(null)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Cerrar
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
