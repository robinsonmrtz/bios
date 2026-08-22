import { useState, useEffect } from 'react';
import { Modal } from '../../../../shared/components/Modal';
import { createVideo, updateVideo } from '../../services/trabajoService';
import type { VideoTrabajo } from '../../types/trabajo.types';

interface Props { open: boolean; onClose: () => void; onSaved: () => void; clienteId: string; proyectoId: string; videoAEditar: VideoTrabajo | null; nextVideoNumber: number; }

export function ModalVideo({ open, onClose, onSaved, clienteId, proyectoId, videoAEditar, nextVideoNumber }: Props) {
  const [cargando, setCargando] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre: '', numero_video: 1, estado: 'sin_empezar', fecha_recibido: '', fecha_entrega: '', fecha_subido: '', tiempo_trabajo: '', palabras_guion: 0, inversion: 0, bono: 0 
  });

  useEffect(() => {
    if (videoAEditar) {
      setFormData({ ...videoAEditar, estado: videoAEditar.estado || 'sin_empezar', fecha_subido: videoAEditar.fecha_subido || '', tiempo_trabajo: videoAEditar.tiempo_trabajo || '' } as any);
    } else {
      setFormData({ 
        nombre: '', numero_video: nextVideoNumber, estado: 'sin_empezar', 
        fecha_recibido: new Date().toISOString().split('T')[0], 
        fecha_entrega: '', fecha_subido: '', tiempo_trabajo: '',
        palabras_guion: 0, inversion: 0, bono: 0 
      });
    }
  }, [videoAEditar, open, nextVideoNumber]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    try {
      const payload: any = { ...formData };
      if (!payload.fecha_entrega) payload.fecha_entrega = null;
      if (!payload.fecha_recibido) payload.fecha_recibido = null;
      if (!payload.fecha_subido) payload.fecha_subido = null;

      if (videoAEditar) await updateVideo(videoAEditar.id, payload);
      else await createVideo({ ...payload, cliente_id: clienteId, proyecto_id: proyectoId });
      onSaved(); onClose();
    } catch (error) {
      console.error("Error al guardar", error);
      alert("Hubo un error al guardar el video. Revisa la consola.");
    } finally { setCargando(false); }
  }

  const footer = (
    <>
      <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-gray-600 border hover:bg-gray-50">Cancelar</button>
      <button type="submit" form="videoForm" disabled={cargando} className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
        {cargando ? 'Guardando...' : 'Guardar Video'}
      </button>
    </>
  );

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-blue-500 focus:bg-white";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase mb-1";

  return (
    <Modal open={open} title={videoAEditar ? 'Editar Video' : 'Nuevo Video'} onClose={onClose} maxWidth="md" footer={footer}>
      <form id="videoForm" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-1">
            <label className={labelClass}>Nº</label>
            <input type="number" value={formData.numero_video} onChange={e => setFormData({...formData, numero_video: Number(e.target.value)})} className={inputClass} required />
          </div>
          <div className="col-span-3">
            <label className={labelClass}>Título del Video</label>
            <input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className={inputClass} required autoFocus />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={labelClass}>Fecha Recibido</label><input type="date" value={formData.fecha_recibido} onChange={e => setFormData({...formData, fecha_recibido: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>Fecha Entrega</label><input type="date" value={formData.fecha_entrega} onChange={e => setFormData({...formData, fecha_entrega: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>Fecha Subido</label><input type="date" value={formData.fecha_subido} onChange={e => setFormData({...formData, fecha_subido: e.target.value})} className={inputClass} /></div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div><label className={labelClass}>Tiempo total</label><input type="text" placeholder="Ej: 5h 45m" value={formData.tiempo_trabajo} onChange={e => setFormData({...formData, tiempo_trabajo: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>Palabras</label><input type="number" value={formData.palabras_guion} onChange={e => setFormData({...formData, palabras_guion: Number(e.target.value)})} className={inputClass} /></div>
          <div><label className={labelClass}>Inversión ($)</label><input type="number" step="0.01" value={formData.inversion} onChange={e => setFormData({...formData, inversion: Number(e.target.value)})} className={inputClass} /></div>
          <div><label className={labelClass}>Bono ($)</label><input type="number" step="0.01" value={formData.bono} onChange={e => setFormData({...formData, bono: Number(e.target.value)})} className={inputClass} /></div>
        </div>
      </form>
    </Modal>
  );
}