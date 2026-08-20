import { useState } from 'react';
import { navItems } from '../navConfig';
import { IconPlus, IconMenu } from '../icons';

interface Props {
  activeId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ activeId, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="hidden md:flex flex-col items-start flex-shrink-0 border-r transition-all duration-200"
      style={{
        width: expanded ? 170 : 64,
        padding: '16px 12px',
        borderColor: 'var(--bios-border)',
        background: 'rgba(15,22,38,0.5)',
      }}
    >
      <div
        className="rounded-full flex-shrink-0"
        style={{
          width: 26,
          height: 26,
          margin: '0 0 22px 2px',
          background: 'radial-gradient(circle at 35% 30%, #cdeeff, var(--bios-accent) 45%, var(--bios-accent-2) 90%)',
          boxShadow: '0 0 14px var(--bios-accent-glow)',
        }}
      />

      {navItems.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-full flex items-center gap-3 rounded-[11px] mb-2 border text-[14px] whitespace-nowrap overflow-hidden"
            style={{
              height: 40,
              padding: '0 9px',
              background: active ? 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))' : 'transparent',
              borderColor: active ? 'var(--bios-border-hover)' : 'transparent',
              color: active ? 'var(--bios-text)' : 'var(--bios-text-dim)',
            }}
          >
            <item.icon style={{ width: 19, height: 19, flexShrink: 0 }} />
            <span style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}>{item.label}</span>
          </button>
        );
      })}

      <button
        className="mt-auto mb-2 w-full flex items-center gap-3 rounded-[9px] border border-dashed text-[13px]"
        style={{ height: 34, padding: '0 9px', borderColor: 'var(--bios-border-hover)', color: 'var(--bios-text-faint)' }}
      >
        <IconPlus style={{ width: 16, height: 16, flexShrink: 0 }} />
        <span style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}>Nuevo módulo</span>
      </button>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-10 h-10 rounded-[11px] border flex items-center justify-center"
        style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-faint)' }}
      >
        <IconMenu style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
}