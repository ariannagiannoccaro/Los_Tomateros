import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Home,
  Users,
  Bell,
  LogOut,
  Menu,
  X,
  QrCode,
  FileText,
  Plus,
  Settings,
  GraduationCap,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useStore();

  const userNotifications = notifications.filter((n) => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/events', icon: Calendar, label: 'Eventos' },
    { path: '/calendar', icon: Calendar, label: 'Calendario' },
    { path: '/my-events', icon: GraduationCap, label: 'Mis Inscripciones' },
    { path: '/scanner', icon: QrCode, label: 'Escanear QR' },
    { path: '/reports', icon: FileText, label: 'Reportes' },
  ];

  if (currentUser?.role === 'admin') {
    menuItems.push({ path: '/users', icon: Users, label: 'Usuarios' });
    menuItems.push({ path: '/settings', icon: Settings, label: 'Configuración' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-600">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-700" />
            </div>
            <span className="text-xl font-bold text-white">EventUni</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-indigo-600 p-1 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                location.pathname === item.path
                  ? 'bg-white/20 text-white'
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
              <p className="text-xs text-indigo-300 capitalize">{currentUser?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-indigo-200 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-2">
              {(currentUser?.role === 'admin' || currentUser?.role === 'organizador') && (
                <Link
                  to="/events/new"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Evento
                </Link>
              )}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
                      <div className="flex items-center justify-between p-3 border-b">
                        <h3 className="font-semibold">Notificaciones</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllNotificationsAsRead()}
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            Marcar todo como leído
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto max-h-72">
                        {userNotifications.length === 0 ? (
                          <p className="p-4 text-center text-gray-500">
                            No hay notificaciones
                          </p>
                        ) : (
                          userNotifications.slice(0, 10).map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => {
                                markNotificationAsRead(notification.id);
                                if (notification.eventId) {
                                  navigate(`/events/${notification.eventId}`);
                                  setNotificationsOpen(false);
                                }
                              }}
                              className={cn(
                                'p-3 border-b cursor-pointer hover:bg-gray-50',
                                !notification.read && 'bg-indigo-50'
                              )}
                            >
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString('es-ES')}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
