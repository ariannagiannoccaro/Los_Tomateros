export type EventType = 'charla' | 'taller' | 'feria' | 'conferencia' | 'seminario';

export type EventStatus = 'programado' | 'en_curso' | 'finalizado' | 'cancelado';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  organizerId: string;
  createdAt: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizador' | 'estudiante';
  faculty: string;
  avatar?: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  qrCode: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  eventId?: string;
}
