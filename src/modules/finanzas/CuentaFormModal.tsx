import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/Modal';
import { ColorPicker, ImageLogoInput, ToggleCard } from '../../shared/components/FormControls';
import { IconTrash, IconAdjustmentsHorizontal } from '../../shared/icons';
import { crearCuenta, actualizarCuenta, type Cuenta } from '../../core/db/db';

interface Props {
  open: boolean;
  cuentaExistente: Cuenta | null;
  onClose: () => void;
  onSaved: () => void;
  onSolicitarReajuste: (cuenta: Cuenta) => void;
}

const TIPOS = [
  { value: 'efectivo', label: '💵 Efectivo / Cash' },
  { value: 'debito', label: '💳 Cuenta de Débito / Ahorros' },
  { value: 'corriente', label: '🏦 Cuenta Corriente' },
  { value: 'credito', label: '🎫 Tarjeta de Crédito' },
  { value: 'inversion', label: '📈 Inversión / Broker' },
];

export function CuentaFormModal({ open, cuentaExistente, onClose, onSaved, onSolicitarReajuste }: Props) {
  const [nombre, setNombre] = useState('');
  const [saldo, setSaldo] = useState('');
  const [tipo, setTipo] = useState('debito');
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('#3498db');
  const [incluirDashboard, setIncluirDashboard] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const editando = !!cuentaExistente?.id;

  useEffect(() => {
    if (!open) return;
    if (cuentaExistente) {
      setNombre(cuentaExistente.nombre);
      setSaldo(String(cuentaExistente.saldo_inicial));
      setTipo(cuentaExistente.tipo || 'debito');
      setLogo(cuentaExistente.logo || '');
      setColor(cuentaExistente.color || '#3498db');
      setIncluirDashboard(cuentaExistente.incluir_dashboard !== false);
    } else {
      limpiarCampos();
    }
  }, [open, cuentaExistente]);

  function limpiarCampos() {
    setNombre('');
    setSaldo('');
    setTipo('debito');
    setLogo('');
    setColor('#3498db');
    setIncluirDashboard(true);
  }

  async function handleGuardar() {
    if (!nombre.trim()) return alert('El nombre es obligatorio');

    setGuardando(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        saldo_inicial: parseFloat(saldo) || 0,
        tipo,
        color,
        logo: logo || undefined,
        incluir_dashboard: incluirDashboard,
      };

      if (editando) {
        await actualizarCuenta(cuentaExistente!.id!, payload);
      } else {
        await crearCuenta({ ...payload, archivada: false });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Error guardando cuenta:', err);
      alert('No se pudo guardar la cuenta. Revisa la consola.');
    } finally {
      setGuardando(false);
    }
  }

  function handleBotonIzquierdo() {
    if (editando) {
      // En edición, este botón cierra el modal de cuenta y abre el de
      // Reajuste de Saldo — igual que hacía el piloto.
      onClose();
      onSolicitarReajuste(cuentaExistente!);
    } else {
      limpiarCampos();
    }
  }

  const anchoSaldoCh = Math.max((saldo || '0.00').length + 1, 5);

  return (
    <Modal open={open} title={editando ? 'Editar cuenta' : 'Añadir cuenta'} onCancel={onClose} hideDefaultFooter>
      <div className="flex flex-col mt-2">
        <div className="flex flex-col items-center justify-center mb-6 mt-2">
          <div className="flex items-center justify-center gap-1">
            <span className="text-[18px] sm:text-[24px] font-display font-bold flex-shrink-0" style={{ color: 'var(--bios-text-dim)' }}>$</span>
            <input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-[26px] sm:text-[38px] font-display font-bold outline-none text-left min-w-0"
              style={{ color: 'var(--bios-text)', width: `${anchoSaldoCh}ch` }}
            />
          </div>
          <div className="w-full max-w-[220px] h-px mt-1 border-b border-dashed mx-auto" style={{ borderColor: 'var(--bios-border)' }} />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Nombre de la institución financiera</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Bancolombia, Efectivo..."
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Tipo de cuenta</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none"
            style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>URL del Logo institucional</label>
            <ImageLogoInput url={logo} onChange={setLogo} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Color distintivo</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>

        <div className="mb-6">
          <ToggleCard
            label="Incluir en la suma del dashboard"
            description="El saldo acumulado se sumará al patrimonio total visible."
            checked={incluirDashboard}
            onChange={setIncluirDashboard}
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--bios-border)' }}>
          <button
            onClick={handleBotonIzquierdo}
            className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: 'var(--bios-text-dim)' }}
          >
            {editando ? <IconAdjustmentsHorizontal size={14} /> : <IconTrash size={14} />}
            {editando ? 'Re-ajustar saldo' : 'Limpiar campos'}
          </button>

          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="text-[12px] font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--bios-accent)', color: '#0a1120' }}
          >
            {guardando ? 'Guardando...' : 'Guardar cuenta'}
          </button>
        </div>
      </div>
    </Modal>
  );
}