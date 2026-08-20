import { navItems } from '../navConfig';
import { IconPlus } from '../icons';

interface Props {
  open: boolean;
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function MobileDrawer({ open, activeId, onSelect, onClose }: Props) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[39] bg-black/60 transition-opacity md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className="fixed top-0 left-0 bottom-0 z-40 flex flex-col md:hidden transition-transform duration-200"
        style={{
          width: 190,
          padding: '16px 12px',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
          borderRight: '1px solid var(--bios-border)',
        }}
      >
        <div
          className="rounded-full flex-shrink-0"
          style={{
            width: 26,
            height: 26,
            marginBottom: 22,
            background: 'radial-gradient(circle at 35% 30%, #cdeeff, var(--bios-accent) 45%, var(--bios-accent-2) 90%)',
            boxShadow: '0 0 14px var(--bios-accent-glow)',
          }}
        />

        {navItems.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item.id);
                onClose();
              }}
              className="w-full flex items-center gap-3 rounded-[11px] mb-2 border text-[14px]"
              style={{
                height: 40,
                padding: '0 9px',
                background: active ? 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))' : 'transparent',
                borderColor: active ? 'var(--bios-border-hover)' : 'transparent',
                color: active ? 'var(--bios-text)' : 'var(--bios-text-dim)',
              }}
            >
              <item.icon style={{ width: 19, height: 19, flexShrink: 0 }} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          className="mt-auto w-full flex items-center gap-3 rounded-[9px] border border-dashed text-[13px]"
          style={{ height: 34, padding: '0 9px', borderColor: 'var(--bios-border-hover)', color: 'var(--bios-text-faint)' }}
        >
          <IconPlus style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span>Nuevo módulo</span>
        </button>
      </div>
    </>
  );
}