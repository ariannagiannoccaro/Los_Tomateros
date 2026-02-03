import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  MapPin,
  Users,
  Clock,
  Tag,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../utils/cn';
import { EventType } from '../types';

export function Events() {
  const { events, attendances, currentUser } = useStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const canCreateEvent =
    currentUser?.role === 'admin' || currentUser?.role === 'organizador';

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    const matchesStatus =
      statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: EventType) => {
    const colors = {
      charla: 'bg-blue-100 text-blue-700',
      taller: 'bg-green-100 text-green-700',
      feria: 'bg-purple-100 text-purple-700',
      conferencia: 'bg-amber-100 text-amber-700',
      seminario: 'bg-rose-100 text-rose-700',
    };
    return colors[type];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      programado: 'bg-blue-500',
      en_curso: 'bg-green-500',
      finalizado: 'bg-gray-400',
      cancelado: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-500 mt-1">
            Explora y regístrate en los eventos universitarios
          </p>
        </div>
        {canCreateEvent && (
          <Link
            to="/events/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Crear Evento
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as EventType | 'all')}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="charla">Charla</option>
              <option value="taller">Taller</option>
              <option value="feria">Feria</option>
              <option value="conferencia">Conferencia</option>
              <option value="seminario">Seminario</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="programado">Programado</option>
            <option value="en_curso">En curso</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No se encontraron eventos
          </h3>
          <p className="text-gray-500 mt-1">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const eventAttendances = attendances.filter(
              (a) => a.eventId === event.id
            );
            const isRegistered = eventAttendances.some(
              (a) => a.userId === currentUser?.id
            );
            const isFull = eventAttendances.length >= event.capacity;

            return (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Event Image/Header */}
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 left-3">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        getTypeColor(event.type)
                      )}
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        getStatusColor(event.status)
                      )}
                    />
                    <span className="text-xs text-white capitalize">
                      {event.status.replace('_', ' ')}
                    </span>
                  </div>
                  {isRegistered && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        Inscrito
                      </span>
                    </div>
                  )}
                </div>

                {/* Event Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {format(parseISO(event.date), "EEEE, d 'de' MMMM", {
                        locale: es,
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {event.startTime} - {event.endTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {event.location}
                    </div>
                  </div>

                  {/* Tags */}
                  {event.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      <span
                        className={cn(
                          isFull ? 'text-red-600' : 'text-gray-600'
                        )}
                      >
                        {eventAttendances.length}/{event.capacity}
                      </span>
                    </div>
                    <span className="text-sm text-indigo-600 font-medium group-hover:underline">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
