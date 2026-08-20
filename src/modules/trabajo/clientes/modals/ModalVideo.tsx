import { useState, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import { createVideo, updateVideo } from '../../services/trabajoService';
import type { VideoTrabajo, EstadoVideo } from '../../types/trabajo.types';

interface ModalVideoProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  clienteId: string;
  proyectoId: string;
  videoAEditar: VideoTrabajo | null;
}

export function ModalVideo({ open, onClose, onSaved, clienteId, proyectoId, videoAEditar }: ModalVideoProps) {
  const [cargando, setCargando] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    numero_video: 1,
    estado: 'sin_empezar' as EstadoVideo,
    fecha_recibido: '',
    fecha_entrega: '',
    palabras_guion: 0,
    tiempo_trabajo: '',
    inversion: 0,
    bono: 0,
  });

  useEffect(() => {
    if (videoAEditar) {
      setFormData({
        nombre: videoAEditar.nombre || '',
        numero_video: videoAEditar.numero_video || 1,
        estado: videoAEditar.estado || 'sin_empezar',
        fecha_recibido: videoAEditar.fecha_recibido || '',
        fecha_entrega: videoAEditar.fecha_entrega || '',
        palabras_guion: videoAEditar.palabras_guion || 0,
        tiempo_trabajo: videoAEditar.tiempo_trabajo || '',
        inversion: videoAEditar.inversion || 0,
        bono: videoAEditar.bono || 0,
      });
    } else {
      setFormData({
        nombre: '',
        numero_video: 1,
        estado: 'sin_empezar',
        fecha_recibido: new Date().toISOString().split('T')[0], // Hoy por defecto
        fecha_entrega: '',
        palabras_guion: 0,
        tiempo_trabajo: '',
        inversion: 0,
        bono: 0,
      });
    }
  }, [videoAEditar, open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    try {
      if (videoAEditar) {
        await updateVideo(videoAEditar.id, formData);
      } else {
        await createVideo({ ...formData, cliente_id: clienteId, proyecto_id: proyectoId });
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error guardando video:", error);
      alert("Hubo un error al guardar el video.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[16px] border bg-[#0a1120] shadow-2xl" style={{ borderColor: 'var(--bios-border)' }}>
        
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--bios-border)' }}>
          <h2 className="text-[16px] font-bold">{videoAEditar ? 'Editar Video' : 'Nuevo Video'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors"><IconX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Número</label>
              <input type="number" required className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.numero_video} onChange={e => setFormData({...formData, numero_video: Number(e.target.value)})} />
            </div>
            <div className="col-span-3">
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Título del Video</label>
              <input type="text" required autoFocus className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Fecha Recibido</label>
              <input type="date" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.fecha_recibido} onChange={e => setFormData({...formData, fecha_recibido: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Fecha Entrega</label>
              <input type="date" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.fecha_entrega} onChange={e => setFormData({...formData, fecha_entrega: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Palabras (Guion)</label>
              <input type="number" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.palabras_guion} onChange={e => setFormData({...formData, palabras_guion: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Inversión ($)</label>
              <input type="number" step="0.01" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.inversion} onChange={e => setFormData({...formData, inversion: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--bios-text-dim)' }}>Bono ($)</label>
              <input type="number" step="0.01" className="w-full bg-black/40 border rounded-lg px-3 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--bios-border)' }}
                value={formData.bono} onChange={e => setFormData({...formData, bono: Number(e.target.value)})} />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-white/5 transition-colors">Cancelar</button>
            <button type="submit" disabled={cargando} className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-90" style={{ background: 'var(--bios-accent)', color: '#0a1120' }}>
              {cargando ? 'Guardando...' : 'Guardar Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}