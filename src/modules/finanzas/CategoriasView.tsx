import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { ColorPicker } from '../../shared/components/FormControls';
import { IconPlus, IconTags } from '../../shared/icons';
import { getCategorias, crearCategoria, actualizarCategoria, archivarCategoria, type Categoria } from '../../core/db/db';

export function CategoriasView() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [tipoActivo, setTipoActivo] = useState<'gasto' | 'ingreso'>('gasto');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [emoji, setEmoji] = useState('🏷️');
  const [color, setColor] = useState('#e74c3c');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      setCategorias(await getCategorias());
    } catch (err) {
      console.error('Error cargando categorías:', err);
      alert('No se pudieron cargar las categorías. Revisa la consola.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function abrirNueva() {
    setEditandoId(null);
    setNombre('');
    setEmoji('🏷️');
    setColor(tipoActivo === 'ingreso' ? '#2ecc71' : '#e74c3c');
    setModalAbierto(true);
  }

  function abrirEditar(cat: Categoria) {
    setEditandoId(cat.id!);
    setNombre(cat.nombre);
    setEmoji(cat.emoji || '🏷️');
    setColor(cat.color);
    setModalAbierto(true);
  }

  async function handleGuardar() {
    if (!nombre.trim()) return alert('El nombre es obligatorio');

    setGuardando(true);
    try {
      if (editandoId) {
        await actualizarCategoria(editandoId, { nombre: nombre.trim(), emoji, color });
      } else {
        await crearCategoria({ nombre: nombre.trim(), tipo: tipoActivo, emoji, color, archivada: false });
      }
      await cargar();
      setModalAbierto(false);
    } catch (err) {
      console.error('Error guardando categoría:', err);
      alert('No se pudo guardar la categoría. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  async function handleArchivar(id: string) {
    if (!confirm('¿Archivar esta categoría?')) return;
    const ok = await archivarCategoria(id);
    if (ok) await cargar();
    else alert('No se pudo archivar la categoría.');
  }

  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipoActivo);

  return (
    <div className="mt-6">
      {/* Toggle Gasto / Ingreso */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setTipoActivo('gasto')}
          className="px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors"
          style={{
            background: tipoActivo === 'gasto' ? 'var(--bios-danger)' : 'transparent',
            borderColor: tipoActivo === 'gasto' ? 'var(--bios-danger)' : 'var(--bios-border)',
            color: tipoActivo === 'gasto' ? '#fff' : 'var(--bios-text-dim)',
          }}
        >
          Categorías Gastos
        </button>
        <button
          onClick={() => setTipoActivo('ingreso')}
          className="px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors"
          style={{
            background: tipoActivo === 'ingreso' ? 'var(--bios-ok)' : 'transparent',
            borderColor: tipoActivo === 'ingreso' ? 'var(--bios-ok)' : 'var(--bios-border)',
            color: tipoActivo === 'ingreso' ? '#0a1120' : 'var(--bios-text-dim)',
          }}
        >
          Categorías Ingresos
        </button>

        <button
          onClick={abrirNueva}
          className="ml-auto w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: tipoActivo === 'ingreso' ? 'var(--bios-ok)' : 'var(--bios-danger)', color: '#fff' }}
          title="Nueva categoría"
        >
          <IconPlus size={16} />
        </button>
      </div>

      {cargando && (
        <div className="text-[12px] text-center py-6" style={{ color: 'var(--bios-text-dim)' }}>
          Cargando categorías...
        </div>
      )}

      {!cargando && categoriasFiltradas.length === 0 && (
        <div
          className="rounded-[11px] border border-dashed p-6 text-center text-[12px]"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          <IconTags size={22} className="mx-auto mb-2" style={{ opacity: 0.5 }} />
          Sin categorías. Usa el botón + para crear una.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {categoriasFiltradas.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between rounded-[11px] border px-3 py-2.5"
            style={{
              background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
              borderColor: 'var(--bios-border)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[17px]">{cat.emoji || '🏷️'}</span>
              <span className="text-[13px] font-medium" style={{ color: 'var(--bios-text)' }}>
                {cat.nombre}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
              <button
                onClick={() => abrirEditar(cat)}
                className="text-[11px] px-2 py-1 rounded-md hover:bg-white/5"
                style={{ color: 'var(--bios-text-dim)' }}
              >
                Editar
              </button>
              <button
                onClick={() => handleArchivar(cat.id!)}
                className="text-[11px] px-2 py-1 rounded-md hover:bg-white/5"
                style={{ color: 'var(--bios-danger)' }}
              >
                Archivar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalAbierto}
        title={editandoId ? 'Editar categoría' : 'Nueva categoría'}
        onClose={() => setModalAbierto(false)}
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-3">
            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              className="w-12 h-12 text-center text-[22px] bg-black/20 border rounded-[10px] outline-none"
              style={{ borderColor: 'var(--bios-border)' }}
            />
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Nombre</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Restaurantes, Salario..."
                className="w-full bg-black/20 border rounded-[10px] px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--bios-border)' }}>
            <button
              onClick={() => setModalAbierto(false)}
              className="text-[11px] px-3 py-2 rounded-lg border"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="text-[12px] font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
              style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}