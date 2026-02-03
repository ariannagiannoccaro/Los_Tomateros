import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Event, User, Attendance, Notification } from '../types';

interface AppState {
  currentUser: User | null;
  users: User[];
  events: Event[];
  attendances: Attendance[];
  notifications: Notification[];
  
  // Auth actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Event actions
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  // Attendance actions
  registerToEvent: (eventId: string, userId: string) => void;
  checkIn: (attendanceId: string) => void;
  unregisterFromEvent: (eventId: string, userId: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // User actions
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Sample data
const sampleUsers: User[] = [
  {
    id: 'admin1',
    name: 'Dr. Carlos Mendoza',
    email: 'admin@eventuni.edu',
    role: 'admin',
    faculty: 'Administración',
    createdAt: '2024-01-01',
  },
  {
    id: 'org1',
    name: 'Prof. María García',
    email: 'organizador@eventuni.edu',
    role: 'organizador',
    faculty: 'Ingeniería',
    createdAt: '2024-01-15',
  },
  {
    id: 'est1',
    name: 'Juan Pérez',
    email: 'estudiante@eventuni.edu',
    role: 'estudiante',
    faculty: 'Ciencias',
    createdAt: '2024-02-01',
  },
];

const sampleEvents: Event[] = [
  {
    id: 'evt1',
    title: 'Taller de Inteligencia Artificial',
    description: 'Aprende los fundamentos de IA y Machine Learning con ejemplos prácticos.',
    type: 'taller',
    status: 'programado',
    date: '2024-12-20',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Auditorio Principal',
    capacity: 100,
    organizerId: 'org1',
    createdAt: '2024-11-01',
    tags: ['tecnología', 'IA', 'programación'],
  },
  {
    id: 'evt2',
    title: 'Conferencia de Emprendimiento',
    description: 'Charla magistral sobre cómo iniciar tu startup mientras estudias.',
    type: 'conferencia',
    status: 'programado',
    date: '2024-12-22',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Sala de Conferencias B',
    capacity: 50,
    organizerId: 'org1',
    createdAt: '2024-11-05',
    tags: ['emprendimiento', 'negocios'],
  },
  {
    id: 'evt3',
    title: 'Feria de Ciencias 2024',
    description: 'Exposición de proyectos de investigación de todas las facultades.',
    type: 'feria',
    status: 'programado',
    date: '2024-12-25',
    startTime: '09:00',
    endTime: '18:00',
    location: 'Campus Central',
    capacity: 500,
    organizerId: 'admin1',
    createdAt: '2024-11-10',
    tags: ['ciencia', 'investigación', 'exposición'],
  },
  {
    id: 'evt4',
    title: 'Seminario de Desarrollo Web',
    description: 'Aprende las últimas tecnologías en desarrollo web: React, Node.js y más.',
    type: 'seminario',
    status: 'programado',
    date: '2024-12-28',
    startTime: '14:00',
    endTime: '18:00',
    location: 'Laboratorio de Computación 3',
    capacity: 30,
    organizerId: 'org1',
    createdAt: '2024-11-12',
    tags: ['tecnología', 'web', 'desarrollo'],
  },
  {
    id: 'evt5',
    title: 'Charla de Sostenibilidad Ambiental',
    description: 'Discusión sobre prácticas sostenibles en el campus universitario.',
    type: 'charla',
    status: 'programado',
    date: '2024-12-30',
    startTime: '11:00',
    endTime: '12:30',
    location: 'Aula Magna',
    capacity: 200,
    organizerId: 'admin1',
    createdAt: '2024-11-15',
    tags: ['medio ambiente', 'sostenibilidad'],
  },
];

const sampleAttendances: Attendance[] = [
  {
    id: 'att1',
    eventId: 'evt1',
    userId: 'est1',
    registeredAt: '2024-11-20',
    checkedIn: false,
    qrCode: 'QR-evt1-est1',
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: sampleUsers,
      events: sampleEvents,
      attendances: sampleAttendances,
      notifications: [],

      login: (email: string, _password: string) => {
        const user = get().users.find((u) => u.email === email);
        if (user) {
          set({ currentUser: user });
          get().addNotification({
            userId: user.id,
            title: 'Bienvenido',
            message: `Has iniciado sesión como ${user.name}`,
            type: 'success',
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null });
      },

      addEvent: (event) => {
        const newEvent: Event = {
          ...event,
          id: generateId(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ events: [...state.events, newEvent] }));
        
        // Notify all users about new event
        get().users.forEach((user) => {
          get().addNotification({
            userId: user.id,
            title: 'Nuevo Evento',
            message: `Se ha creado un nuevo evento: ${newEvent.title}`,
            type: 'info',
            eventId: newEvent.id,
          });
        });
      },

      updateEvent: (id, eventData) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...eventData } : e
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          attendances: state.attendances.filter((a) => a.eventId !== id),
        }));
      },

      registerToEvent: (eventId, userId) => {
        const existing = get().attendances.find(
          (a) => a.eventId === eventId && a.userId === userId
        );
        if (existing) return;

        const newAttendance: Attendance = {
          id: generateId(),
          eventId,
          userId,
          registeredAt: new Date().toISOString().split('T')[0],
          checkedIn: false,
          qrCode: `QR-${eventId}-${userId}-${Date.now()}`,
        };
        set((state) => ({
          attendances: [...state.attendances, newAttendance],
        }));

        const event = get().events.find((e) => e.id === eventId);
        if (event) {
          get().addNotification({
            userId,
            title: 'Inscripción Confirmada',
            message: `Te has inscrito a: ${event.title}`,
            type: 'success',
            eventId,
          });
        }
      },

      checkIn: (attendanceId) => {
        set((state) => ({
          attendances: state.attendances.map((a) =>
            a.id === attendanceId
              ? { ...a, checkedIn: true, checkedInAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      unregisterFromEvent: (eventId, userId) => {
        set((state) => ({
          attendances: state.attendances.filter(
            (a) => !(a.eventId === eventId && a.userId === userId)
          ),
        }));
      },

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: generateId(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsAsRead: () => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === currentUser.id ? { ...n, read: true } : n
          ),
        }));
      },

      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: generateId(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },
    }),
    {
      name: 'eventuni-storage',
    }
  )
);
