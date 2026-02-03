import { useState } from 'react';
import {
  Bell,
  Shield,
  Palette,
  Save,
  Check,
} from 'lucide-react';
import { cn } from '../utils/cn';

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      eventReminders: true,
      newEvents: true,
      updates: false,
    },
    privacy: {
      showProfile: true,
      showAttendance: false,
    },
    appearance: {
      theme: 'light',
      language: 'es',
    },
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">
          Personaliza tu experiencia en EventUni
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Bell className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold">Notificaciones</h3>
            <p className="text-sm text-gray-500">
              Configura cómo quieres recibir notificaciones
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificaciones por email</p>
              <p className="text-sm text-gray-500">
                Recibe actualizaciones en tu correo
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    email: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificaciones push</p>
              <p className="text-sm text-gray-500">
                Recibe alertas en tu navegador
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    push: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recordatorios de eventos</p>
              <p className="text-sm text-gray-500">
                Avisos antes de tus eventos inscritos
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.eventReminders}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    eventReminders: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nuevos eventos</p>
              <p className="text-sm text-gray-500">
                Notificaciones cuando se crean eventos
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.newEvents}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    newEvents: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">Privacidad</h3>
            <p className="text-sm text-gray-500">
              Controla quién puede ver tu información
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Perfil público</p>
              <p className="text-sm text-gray-500">
                Otros usuarios pueden ver tu perfil
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.showProfile}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  privacy: {
                    ...settings.privacy,
                    showProfile: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mostrar asistencia</p>
              <p className="text-sm text-gray-500">
                Mostrar a qué eventos has asistido
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.showAttendance}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  privacy: {
                    ...settings.privacy,
                    showAttendance: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold">Apariencia</h3>
            <p className="text-sm text-gray-500">
              Personaliza el aspecto de la aplicación
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <div className="flex gap-3">
              {['light', 'dark', 'system'].map((theme) => (
                <button
                  key={theme}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, theme },
                    })
                  }
                  className={cn(
                    'flex-1 py-2 px-4 rounded-lg border-2 transition-colors capitalize',
                    settings.appearance.theme === theme
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Oscuro' : 'Sistema'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={settings.appearance.language}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, language: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors',
            saved
              ? 'bg-green-600 text-white'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          )}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              Guardado
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </div>
  );
}
