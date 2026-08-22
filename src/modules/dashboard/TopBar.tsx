import { useState } from 'react';
import { clearSession } from '../../core/auth/authService';
import { IconMenu } from '../../shared/icons';

const notifications = [
  { id: 1, color: 'var(--bios-danger)', text: 'Pago tarjeta vence hoy', meta: 'Finanzas · hace 2h' },
  { id: 2, color: 'var(--bios-warn)', text: 'Control médico en 3 días', meta: 'Salud · hace 5h' },
  { id: 3, color: 'var(--bios-accent)', text: 'Nueva tarea asignada', meta: 'Tareas · hace 1d' },
];

interface Props {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: Props) {
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  function handleLogout() {
    clearSession();
    window.location.reload();
  }

  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between px-5 py-2.5 backdrop-blur-md border-b"
      style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'var(--bios-border)' }}
    >
      <div className="flex items-center gap-2.5">
        <button
          onClick={onMenuClick}
          className="flex md:hidden w-[30px] h-[30px] border items-center justify-center"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          <IconMenu style={{ width: 16, height: 16 }} />
        </button>
        <div
          className="w-[26px] h-[26px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, #cdeeff, var(--bios-accent) 45%, var(--bios-accent-2) 90%)',
            boxShadow: '0 0 14px var(--bios-accent-glow)',
          }}
        />
        <span className="font-display font-bold tracking-[3px] text-[14px]">BIOS</span>
      </div>

      <div className="flex items-center gap-3.5 relative">
        <button
          onClick={() => setShowNotif((s) => !s)}
          className="relative w-[30px] h-[30px] border flex items-center justify-center text-[14px]"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          🔔
          {notifications.length > 0 && (
            <span
              className="absolute -top-1 -right-1 text-white text-[9px] px-1 font-mono"
              style={{ background: 'var(--bios-danger)' }}
            >
              {notifications.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowMenu((s) => !s)}
          className="w-7 h-7 rounded-full border"
          style={{ background: 'linear-gradient(160deg,#3a4a72,#1c2740)', borderColor: 'var(--bios-border)' }}
        />

        {showNotif && (
          <div
            className="absolute top-11 right-0 w-[270px] p-2.5 border z-20"
            style={{
              background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
              borderColor: 'var(--bios-border)',
              boxShadow: '0 20px 50px rgba(20,24,38,0.15)',
            }}
          >
            <h4
              className="text-[11px] font-semibold uppercase tracking-wide mx-1.5 mb-2"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              Notificaciones
            </h4>
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-2 px-1.5 py-2 hover:bg-black/5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: n.color }} />
                <div>
                  <p className="text-[11.5px] m-0">{n.text}</p>
                  <span className="text-[10px]" style={{ color: 'var(--bios-text-faint)' }}>
                    {n.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showMenu && (
          <div
            className="absolute top-11 right-0 w-[160px] p-1.5 border z-20"
            style={{
              background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
              borderColor: 'var(--bios-border)',
              boxShadow: '0 20px 50px rgba(20,24,38,0.15)',
            }}
          >
            <button
              onClick={handleLogout}
              className="w-full text-left text-[11.5px] px-2.5 py-2 hover:bg-black/5"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}