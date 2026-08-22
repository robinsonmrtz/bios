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
      className="hidden md:flex flex-col items-start flex-shrink-0 border-r transition-all duration-200 bios-menu-metal"
      style={{
        width: expanded ? 170 : 64,
        padding: '16px 12px',
        borderColor: 'rgba(255,255,255,0.06)',
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
            className="w-full flex items-center gap-3 mb-2 border text-[14px] whitespace-nowrap overflow-hidden"
            style={{
              height: 40,
              padding: '0 9px',
              background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: active ? '#f4f7fc' : 'rgba(244,247,252,0.55)',
            }}
          >
            <item.icon style={{ width: 19, height: 19, flexShrink: 0 }} />
            <span style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}>{item.label}</span>
          </button>
        );
      })}

      <button
        className="mt-auto mb-2 w-full flex items-center gap-3 border border-dashed text-[13px]"
        style={{ height: 34, padding: '0 9px', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(244,247,252,0.4)' }}
      >
        <IconPlus style={{ width: 16, height: 16, flexShrink: 0 }} />
        <span style={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}>Nuevo módulo</span>
      </button>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-10 h-10 border flex items-center justify-center"
        style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(244,247,252,0.5)' }}
      >
        <IconMenu style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
}