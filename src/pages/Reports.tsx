import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function Reports() {
  const { events, attendances, users } = useStore();
  const [selectedEvent, setSelectedEvent] = useState<string>('all');

  // Calculate statistics
  const totalEvents = events.length;
  const totalRegistrations = attendances.length;
  const totalCheckIns = attendances.filter((a) => a.checkedIn).length;
  const attendanceRate =
    totalRegistrations > 0
      ? Math.round((totalCheckIns / totalRegistrations) * 100)
      : 0;

  // Events by type
  const eventsByType = events.reduce((acc, event) => {
    const type = event.type.charAt(0).toUpperCase() + event.type.slice(1);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(eventsByType).map(([name, value]) => ({
    name,
    value,
  }));

  // Registrations by event
  const eventStats = events.map((event) => {
    const eventAttendances = attendances.filter((a) => a.eventId === event.id);
    const checkIns = eventAttendances.filter((a) => a.checkedIn).length;
    return {
      name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
      inscritos: eventAttendances.length,
      asistieron: checkIns,
      capacidad: event.capacity,
    };
  });

  // Selected event details
  const selectedEventData = selectedEvent !== 'all'
    ? events.find((e) => e.id === selectedEvent)
    : null;
  const selectedAttendances = selectedEvent !== 'all'
    ? attendances.filter((a) => a.eventId === selectedEvent)
    : attendances;
  const selectedCheckIns = selectedAttendances.filter((a) => a.checkedIn);

  // Attendee list for selected event
  const attendeeList = selectedAttendances.map((att) => {
    const user = users.find((u) => u.id === att.userId);
    const event = events.find((e) => e.id === att.eventId);
    return {
      ...att,
      userName: user?.name || 'Usuario',
      userEmail: user?.email || '',
      eventTitle: event?.title || 'Evento',
    };
  });

  const exportToCSV = () => {
    const headers = ['Evento', 'Asistente', 'Email', 'Registrado', 'Check-in', 'Hora Check-in'];
    const rows = attendeeList.map((att) => [
      att.eventTitle,
      att.userName,
      att.userEmail,
      att.registeredAt,
      att.checkedIn ? 'Sí' : 'No',
      att.checkedInAt ? format(new Date(att.checkedInAt), 'dd/MM/yyyy HH:mm') : '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute(
      'download',
      `reporte_asistencia_${format(new Date(), 'yyyyMMdd')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-500 mt-1">
            Análisis y estadísticas de eventos y asistencia
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Eventos</p>
              <p className="text-2xl font-bold">{totalEvents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inscripciones</p>
              <p className="text-2xl font-bold">{totalRegistrations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-ins</p>
              <p className="text-2xl font-bold">{totalCheckIns}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tasa Asistencia</p>
              <p className="text-2xl font-bold">{attendanceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Inscripciones por Evento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="inscritos" fill="#6366f1" name="Inscritos" radius={[0, 4, 4, 0]} />
              <Bar dataKey="asistieron" fill="#22c55e" name="Asistieron" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Event Types */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Report */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Reporte Detallado</h3>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="all">Todos los eventos</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary for selected event */}
        {selectedEventData && (
          <div className="p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Evento</p>
                <p className="font-semibold">{selectedEventData.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-semibold">
                  {format(parseISO(selectedEventData.date), 'd MMM yyyy', {
                    locale: es,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Inscritos</p>
                <p className="font-semibold">
                  {selectedAttendances.length} / {selectedEventData.capacity}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Asistencia</p>
                <p className="font-semibold text-green-600">
                  {selectedCheckIns.length} (
                  {selectedAttendances.length > 0
                    ? Math.round(
                        (selectedCheckIns.length / selectedAttendances.length) * 100
                      )
                    : 0}
                  %)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Attendee Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asistente
                </th>
                {selectedEvent === 'all' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evento
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendeeList.length === 0 ? (
                <tr>
                  <td
                    colSpan={selectedEvent === 'all' ? 5 : 4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No hay datos de asistencia
                  </td>
                </tr>
              ) : (
                attendeeList.map((att) => (
                  <tr key={att.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {att.userName}
                        </div>
                        <div className="text-sm text-gray-500">{att.userEmail}</div>
                      </div>
                    </td>
                    {selectedEvent === 'all' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {att.eventTitle}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {att.registeredAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {att.checkedIn ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Asistió
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {att.checkedInAt
                        ? format(new Date(att.checkedInAt), 'dd/MM/yyyy HH:mm')
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
