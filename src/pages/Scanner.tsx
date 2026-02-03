import { useState } from 'react';
import {
  QrCode,
  CheckCircle,
  XCircle,
  Search,
  Users,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../utils/cn';

export function Scanner() {
  const { events, attendances, users, checkIn } = useStore();
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    userName?: string;
  } | null>(null);

  const event = events.find((e) => e.id === selectedEvent);
  const eventAttendances = attendances.filter((a) => a.eventId === selectedEvent);
  const checkedInCount = eventAttendances.filter((a) => a.checkedIn).length;

  const handleScan = () => {
    if (!selectedEvent) {
      setScanResult({
        success: false,
        message: 'Por favor selecciona un evento primero',
      });
      return;
    }

    // Try to parse QR code or match by attendance ID
    const attendance = attendances.find(
      (a) =>
        a.eventId === selectedEvent &&
        (a.qrCode === qrInput || a.id === qrInput || a.qrCode.includes(qrInput))
    );

    if (!attendance) {
      setScanResult({
        success: false,
        message: 'Código QR no válido o no corresponde a este evento',
      });
      return;
    }

    if (attendance.checkedIn) {
      const user = users.find((u) => u.id === attendance.userId);
      setScanResult({
        success: false,
        message: 'Este asistente ya realizó check-in anteriormente',
        userName: user?.name,
      });
      return;
    }

    checkIn(attendance.id);
    const user = users.find((u) => u.id === attendance.userId);
    setScanResult({
      success: true,
      message: '¡Check-in exitoso!',
      userName: user?.name,
    });
    setQrInput('');
  };

  const simulateScan = (attendanceId: string) => {
    const attendance = attendances.find((a) => a.id === attendanceId);
    if (attendance) {
      setQrInput(attendance.qrCode);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Escáner de QR</h1>
        <p className="text-gray-500 mt-1">
          Registra la asistencia escaneando códigos QR
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">Registrar Asistencia</h3>

          {/* Event Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Evento
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                setScanResult(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="">Selecciona un evento...</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} - {event.date}
                </option>
              ))}
            </select>
          </div>

          {/* QR Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código QR o ID de Asistencia
            </label>
            <div className="relative">
              <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Escanea o ingresa el código..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleScan}
            disabled={!qrInput}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
            Verificar y Registrar
          </button>

          {/* Scan Result */}
          {scanResult && (
            <div
              className={cn(
                'mt-6 p-4 rounded-lg flex items-start gap-3',
                scanResult.success
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              )}
            >
              {scanResult.success ? (
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{scanResult.message}</p>
                {scanResult.userName && (
                  <p className="text-sm mt-1">Asistente: {scanResult.userName}</p>
                )}
              </div>
            </div>
          )}

          {/* Event Stats */}
          {event && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Asistencia</span>
                </div>
                <span className="font-semibold">
                  {checkedInCount} / {eventAttendances.length}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      eventAttendances.length > 0
                        ? (checkedInCount / eventAttendances.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Attendees List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">
            Lista de Asistentes
            {event && ` - ${event.title}`}
          </h3>

          {!selectedEvent ? (
            <p className="text-gray-500 text-center py-8">
              Selecciona un evento para ver los asistentes
            </p>
          ) : eventAttendances.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay inscripciones para este evento
            </p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {eventAttendances.map((att) => {
                const user = users.find((u) => u.id === att.userId);
                return (
                  <div
                    key={att.id}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      att.checkedIn
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                          att.checkedIn
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {user?.name.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium">{user?.name || 'Usuario'}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {att.checkedIn ? (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            {att.checkedInAt &&
                              new Date(att.checkedInAt).toLocaleTimeString(
                                'es-ES',
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                          </span>
                        </span>
                      ) : (
                        <button
                          onClick={() => simulateScan(att.id)}
                          className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                        >
                          Simular QR
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-indigo-50 rounded-xl p-6">
        <h4 className="font-semibold text-indigo-900 mb-2">
          Cómo usar el escáner
        </h4>
        <ul className="text-indigo-700 space-y-1 text-sm">
          <li>1. Selecciona el evento para el cual deseas registrar asistencia</li>
          <li>2. Escanea el código QR del asistente o ingresa el código manualmente</li>
          <li>3. El sistema verificará la inscripción y registrará el check-in</li>
          <li>4. Puedes usar el botón "Simular QR" para probar con asistentes registrados</li>
        </ul>
      </div>
    </div>
  );
}
