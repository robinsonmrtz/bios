import { useState, useEffect } from 'react';
import { Modal } from '../../../../shared/components/Modal';
import { crearCliente, actualizarCliente, crearProyecto } from '../../services/trabajoService';
import type { Cliente } from '../../types/trabajo.types';

interface Props {
  open: boolean;
  clienteAEditar?: Cliente | null; // Si viene null es "Nuevo Cliente"
  onClose: () => void;
  onSaved: () => void; // Para recargar la lista al guardar
}

export function ModalCliente({ open, clienteAEditar, onClose, onSaved }: Props) {
  const [nombre, setNombre] = useState('');
  const [proyectoBase, setProyectoBase] = useState('');
  const [pais, setPais] = useState('');
  const [foto, setFoto] = useState('');
  const [promedioPalabras, setPromedioPalabras] = useState(3000);
  const [guardando, setGuardando] = useState(false);

  // Llenar campos si es edición
  useEffect(() => {
    if (clienteAEditar) {
      setNombre(clienteAEditar.nombre);
      setProyectoBase(clienteAEditar.proyecto || '');
      setPais(clienteAEditar.pais || '');
      setFoto(clienteAEditar.foto || '');
      setPromedioPalabras(clienteAEditar.promedio_palabras || 3000);
    } else {
      setNombre(''); setProyectoBase(''); setPais(''); setFoto(''); setPromedioPalabras(3000);
    }
  }, [clienteAEditar, open]);

  async function handleGuardar() {
    if (!nombre.trim()) return alert('El nombre del cliente es obligatorio.');
    
    setGuardando(true);
    try {
      if (clienteAEditar) {
        // ACTUALIZAR
        await actualizarCliente(clienteAEditar.id, {
          nombre, proyecto: proyectoBase, pais, foto, promedio_palabras: promedioPalabras
        });
      } else {
        // CREAR NUEVO
        const nuevoCliente = await crearCliente({
          nombre, proyecto: proyectoBase, pais, foto, promedio_palabras: promedioPalabras
        });
        
        // Al crear un cliente, le creamos automáticamente su primer proyecto/canal
        if (nuevoCliente) {
          await crearProyecto({
            cliente_id: nuevoCliente.id,
            nombre: proyectoBase || 'Proyecto Principal'
          });
        }
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el cliente.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      open={open}
      title={clienteAEditar ? 'Editar cliente' : 'Nuevo cliente'}
      onCancel={onClose}
      onConfirm={handleGuardar}
      confirmLabel={guardando ? 'Guardando...' : 'Guardar cliente'}
    >
      <div className="flex flex-col gap-3 mt-2">
        {/* Vista previa Avatar */}
        <div className="flex justify-center mb-2">
          <div className="w-[72px] h-[72px] rounded-full border-[2px] overflow-hidden flex items-center justify-center text-[22px] font-bold" style={{ borderColor: 'var(--bios-accent)', background: 'rgba(255,255,255,0.05)' }}>
            {foto ? <img src={foto} className="w-full h-full object-cover" alt="Preview" /> : nombre.substring(0,2).toUpperCase()}
          </div>
        </div>

        <LabelInput label="Nombre del canal / cliente" value={nombre} onChange={setNombre} placeholder="Ej. MrBeast en Español" />
        <LabelInput label="Servicio prestado (Proyecto base)" value={proyectoBase} onChange={setProyectoBase} placeholder="Ej. Edición de YouTube" />
        <LabelInput label="País" value={pais} onChange={setPais} placeholder="Colombia, México, España..." />
        <LabelInput label="URL Foto de perfil (Opcional)" value={foto} onChange={setFoto} placeholder="https://..." />
        <LabelInput label="Promedio de palabras por video" type="number" value={promedioPalabras} onChange={(val: string) => setPromedioPalabras(Number(val))}/>
      </div>
    </Modal>
  );
}

// Subcomponente interno para no repetir estilos de inputs
function LabelInput({ label, value, onChange, placeholder = "", type = "text" }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--bios-text-dim)' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/20 border rounded-[8px] px-3 py-2 text-[12px] outline-none transition-colors focus:border-[var(--bios-accent)]"
        style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
      />
    </div>
  );
}