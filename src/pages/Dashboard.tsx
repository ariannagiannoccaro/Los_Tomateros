import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
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
import { useStore } from '../store/useStore';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Dashboard() {
  const { events, attendances, users, currentUser } = useStore();

  const today = new Date();
  const upcomingEvents = events
    .filter((e) => isAfter(parseISO(e.date), today) || isToday(parseISO(e.date)))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 5);

  const pastEvents = events.filter((e) => isBefore(parseISO(e.date), today));
  const totalRegistrations = attendances.length;
  const totalCheckIns = attendances.filter((a) => a.checkedIn).length;

  // Stats for charts
  const eventsByType = events.reduce((acc, event) => {
    const type = event.type.charAt(0).toUpperCase() + event.type.slice(1);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(eventsByType).map(([name, value]) => ({
    name,
    value,
  }));

  const attendanceByMonth = [
    { mes: 'Oct', asistencias: 45 },
    { mes: 'Nov', asistencias: 72 },
    { mes: 'Dic', asistencias: totalRegistrations || 28 },
  ];

  const stats = [
    {
      label: 'Total Eventos',
      value: events.length,
      icon: Calendar,
      color: 'bg-indigo-500',
      change: '+12%',
    },
    {
      label: 'Inscripciones',
      value: totalRegistrations,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      label: 'Check-ins',
      value: totalCheckIns,
      icon: CheckCircle,
      color: 'bg-amber-500',
      change: '+15%',
    },
    {
      label: 'Próximos',
      value: upcomingEvents.length,
      icon: Clock,
      color: 'bg-purple-500',
      change: 'Esta semana',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'programado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            <Clock className="w-3 h-3" /> Programado
          </span>
        );
      case 'en_curso':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <AlertCircle className="w-3 h-3" /> En curso
          </span>
        );
      case 'finalizado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" /> Finalizado
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
            <XCircle className="w-3 h-3" /> Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          ¡Bienvenido, {currentUser?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-indigo-100 mt-1">
          Aquí tienes un resumen de la actividad en EventUni
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Asistencias por Mes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="asistencias" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Events by Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Eventos por Tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
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

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Próximos Eventos</h3>
          <Link
            to="/events"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y">
          {upcomingEvents.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              No hay eventos próximos
            </p>
          ) : (
            upcomingEvents.map((event) => {
              const eventAttendances = attendances.filter(
                (a) => a.eventId === event.id
              );
              return (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-indigo-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-indigo-600 font-medium uppercase">
                      {format(parseISO(event.date), 'MMM', { locale: es })}
                    </span>
                    <span className="text-xl font-bold text-indigo-700">
                      {format(parseISO(event.date), 'd')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {event.startTime} - {event.endTime}
                      <span className="mx-1">•</span>
                      {event.location}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    {getStatusBadge(event.status)}
                    <span className="text-sm text-gray-500">
                      {eventAttendances.length}/{event.capacity} inscritos
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <h4 className="text-green-100 text-sm">Tasa de Asistencia</h4>
          <p className="text-3xl font-bold mt-1">
            {totalRegistrations > 0
              ? Math.round((totalCheckIns / totalRegistrations) * 100)
              : 0}
            %
          </p>
          <p className="text-green-100 text-sm mt-2">
            {totalCheckIns} de {totalRegistrations} confirmados
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white">
          <h4 className="text-amber-100 text-sm">Eventos Finalizados</h4>
          <p className="text-3xl font-bold mt-1">{pastEvents.length}</p>
          <p className="text-amber-100 text-sm mt-2">Este semestre</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white">
          <h4 className="text-purple-100 text-sm">Usuarios Activos</h4>
          <p className="text-3xl font-bold mt-1">{users.length}</p>
          <p className="text-purple-100 text-sm mt-2">En la plataforma</p>
        </div>
      </div>
    </div>
  );
}
