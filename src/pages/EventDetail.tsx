import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  ArrowLeft,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  Download,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../utils/cn';

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    events,
    attendances,
    users,
    currentUser,
    registerToEvent,
    unregisterFromEvent,
    deleteEvent,
  } = useStore();

  const [showQR, setShowQR] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const event = events.find((e) => e.id === id);
  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Evento no encontrado
        </h2>
        <Link
          to="/events"
          className="text-indigo-600 hover:underline mt-2 inline-block"
        >
          Volver a eventos
        </Link>
      </div>
    );
  }

  const eventAttendances = attendances.filter((a) => a.eventId === event.id);
  const userAttendance = eventAttendances.find(
    (a) => a.userId === currentUser?.id
  );
  const isRegistered = !!userAttendance;
  const isFull = eventAttendances.length >= event.capacity;
  const organizer = users.find((u) => u.id === event.organizerId);
  const canEdit =
    currentUser?.role === 'admin' || currentUser?.id === event.organizerId;

  const handleRegister = () => {
    if (currentUser) {
      registerToEvent(event.id, currentUser.id);
    }
  };

  const handleUnregister = () => {
    if (currentUser) {
      unregisterFromEvent(event.id, currentUser.id);
    }
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    navigate('/events');
  };

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

  const attendedUsers = eventAttendances.map((att) => {
    const user = users.find((u) => u.id === att.userId);
    return { ...att, user };
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      {/* Event Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-indigo-600 to-purple-700 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getTypeColor(event.type)
                  )}
                >
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                <h1 className="text-3xl font-bold text-white mt-3">
                  {event.title}
                </h1>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <Link
                    to={`/events/${event.id}/edit`}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-lg">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {format(parseISO(event.date), "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Horario</p>
                  <p className="font-medium">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacidad</p>
                  <p className="font-medium">
                    {eventAttendances.length} / {event.capacity} inscritos
                  </p>
                </div>
              </div>

              {organizer && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 font-semibold">
                    {organizer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organizador</p>
                    <p className="font-medium">{organizer.name}</p>
                  </div>
                </div>
              )}

              {event.tags.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Etiquetas</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            {isRegistered ? (
              <>
                <button
                  onClick={() => setShowQR(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Ver mi QR de entrada
                </button>
                <button
                  onClick={handleUnregister}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <UserMinus className="w-5 h-5" />
                  Cancelar inscripción
                </button>
              </>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isFull}
                className={cn(
                  'flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors',
                  isFull
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                )}
              >
                <UserPlus className="w-5 h-5" />
                {isFull ? 'Evento lleno' : 'Inscribirse'}
              </button>
            )}
            <button className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Attendees List (for organizers/admins) */}
      {canEdit && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">
            Asistentes ({eventAttendances.length})
          </h3>
          {attendedUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Aún no hay inscripciones
            </p>
          ) : (
            <div className="divide-y">
              {attendedUsers.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                      {att.user?.name.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium">{att.user?.name || 'Usuario'}</p>
                      <p className="text-sm text-gray-500">
                        {att.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {att.checkedIn ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Check-in
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QR Modal */}
      {showQR && userAttendance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-xl font-bold mb-2">Tu código QR de entrada</h3>
            <p className="text-gray-500 mb-6">
              Muestra este código en la entrada del evento
            </p>
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl">
              <QRCodeSVG
                value={JSON.stringify({
                  eventId: event.id,
                  eventTitle: event.title,
                  attendanceId: userAttendance.id,
                  userId: currentUser?.id,
                  userName: currentUser?.name,
                })}
                size={200}
                level="H"
              />
            </div>
            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-500">
                Código: {userAttendance.qrCode}
              </p>
              <div className="flex gap-3 justify-center">
                <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">¿Eliminar evento?</h3>
            <p className="text-gray-500 mb-6">
              Esta acción no se puede deshacer. Se eliminarán también todas las
              inscripciones asociadas.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
