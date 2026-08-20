import { IconBank, IconPlus } from '../icons';

// ==========================================
// 1. Selector de Imagen / Logo
// ==========================================
interface ImageLogoInputProps {
  url: string;
  onChange: (url: string) => void;
}

export function ImageLogoInput({ url, onChange }: ImageLogoInputProps) {
  return (
    <div className="flex gap-2">
      <div 
        className="w-[38px] h-[38px] rounded-[10px] border flex-shrink-0 flex items-center justify-center overflow-hidden bg-black/20"
        style={{ borderColor: 'var(--bios-border)' }}
      >
        {url ? (
          <img src={url} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
        ) : (
          <IconBank size={20} style={{ color: 'var(--bios-text-faint)' }} />
        )}
      </div>
      <input
        type="url"
        placeholder="URL de la imagen..."
        value={url}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none transition-colors"
        style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
      />
    </div>
  );
}

// ==========================================
// 2. Selector de Color Distintivo
// ==========================================
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = ['#e74c3c', '#2ecc71', '#f1c40f', '#3498db', '#9b59b6'];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 h-[38px]">
      {PRESET_COLORS.map(c => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className="w-[26px] h-[26px] rounded-full transition-transform hover:scale-110 flex items-center justify-center"
          style={{ 
            backgroundColor: c,
            boxShadow: value === c ? '0 0 0 2px var(--bios-card-a), 0 0 0 4px ' + c : 'none'
          }}
        />
      ))}
      {/* Selector Personalizado */}
      <label 
        className="relative w-[26px] h-[26px] rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
        style={{ 
          background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
          boxShadow: !PRESET_COLORS.includes(value) && value ? '0 0 0 2px var(--bios-card-a), 0 0 0 4px ' + value : 'none'
        }}
      >
        <IconPlus size={14} color="white" style={{ mixBlendMode: 'difference' }} />
        <input 
          type="color" 
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
    </div>
  );
}

// ==========================================
// 3. Tarjeta tipo Toggle (Switch)
// ==========================================
interface ToggleCardProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleCard({ label, description, checked, onChange }: ToggleCardProps) {
  return (
    <label 
      className="flex items-center justify-between p-3.5 rounded-[12px] border cursor-pointer transition-colors hover:bg-white/5"
      style={{ borderColor: 'var(--bios-border)', background: 'rgba(0,0,0,0.1)' }}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[12.5px] font-semibold" style={{ color: 'var(--bios-text)' }}>{label}</span>
        <span className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>{description}</span>
      </div>
      
      {/* Switch visual CSS puro */}
      <div className="relative">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div 
          className="w-10 h-5 bg-black/40 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
          style={{ backgroundColor: checked ? 'var(--bios-accent)' : 'rgba(255,255,255,0.1)' }}
        ></div>
      </div>
    </label>
  );
}