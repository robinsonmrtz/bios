import { useState } from 'react';
import CuentaWidget, { type CuentaData } from './widgets/CuentaWidget';
import { Modal } from '../../shared/components/Modal';
import { IconPlus, IconTrash } from '../../shared/icons';
import { ColorPicker, ImageLogoInput, ToggleCard } from '../../shared/components/FormControls';

export function CuentasView() {
  // Estado de las cuentas
  const [cuentas, setCuentas] = useState<CuentaData[]>([
    { id: 1, nombre: 'Billetera', saldoActual: 150000, saldoPrevisto: 85000, color: '#3498db' }
  ]);

  // Estados del Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoSaldo, setNuevoSaldo] = useState('');
  const [nuevoLogo, setNuevoLogo] = useState('');
  const [nuevoColor, setNuevoColor] = useState('#3498db');
  const [incluirDashboard, setIncluirDashboard] = useState(true);

  function handleGuardarCuenta() {
    if (!nuevoNombre.trim()) return alert('El nombre es obligatorio');

    const saldoParsed = parseFloat(nuevoSaldo) || 0;
    const nuevaCuenta: CuentaData = {
      id: Date.now(),
      nombre: nuevoNombre,
      saldoActual: saldoParsed,
      saldoPrevisto: saldoParsed,
      color: nuevoColor,
      logo: nuevoLogo,
    };

    setCuentas([...cuentas, nuevaCuenta]);
    limpiarYCerrar();
  }

  function limpiarYCerrar() {
    setNuevoNombre('');
    setNuevoSaldo('');
    setNuevoLogo('');
    setNuevoColor('#3498db');
    setIncluirDashboard(true);
    setModalAbierto(false);
  }

  return (
    <div className="mt-6">
      {/* Grilla de Widgets de Cuentas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        
        {/* Botón para abrir el Modal de Nueva Cuenta */}
        <button 
          onClick={() => setModalAbierto(true)}
          className="rounded-[11px] border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[160px] transition-colors hover:bg-white/5"
          style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text-dim)' }}
        >
          <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: 'var(--bios-border)' }}>
            <IconPlus size={20} />
          </div>
          <span className="text-[13px] font-medium">Nueva cuenta</span>
        </button>

        {/* Listado dinámico de cuentas */}
        {cuentas.map(cuenta => (
          <div 
            key={cuenta.id} 
            className="rounded-[11px] border p-3 flex flex-col min-h-[160px]"
            style={{
              background: 'linear-gradient(160deg, var(--bios-card-a), var(--bios-card-b))',
              borderColor: 'var(--bios-border)',
            }}
          >
            <CuentaWidget cuenta={cuenta} />
          </div>
        ))}
      </div>

      {/* Modal de Añadir Cuenta con Pie Personalizado */}
      <Modal
        open={modalAbierto}
        title="Añadir cuenta"
        onCancel={limpiarYCerrar}
        hideDefaultFooter
      >
        <div className="flex flex-col mt-2">
          
          {/* Campo de Saldo Gigante */}
          <div className="flex flex-col items-center justify-center mb-6 mt-2">
            <div className="relative flex items-center justify-center w-full max-w-[200px]">
              <span className="absolute left-4 text-[24px] font-display font-bold" style={{ color: 'var(--bios-text-dim)' }}>$</span>
              <input 
                type="number" 
                value={nuevoSaldo}
                onChange={(e) => setNuevoSaldo(e.target.value)}
                placeholder="0.00"
                className="w-full text-center bg-transparent text-[38px] font-display font-bold outline-none"
                style={{ color: 'var(--bios-text)' }}
              />
            </div>
            <div className="w-full h-px mt-1 border-b border-dashed" style={{ borderColor: 'var(--bios-border)' }} />
          </div>

          {/* Nombre de la institución financiera */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Nombre de la institución financiera</label>
            <input 
              type="text" 
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Ej. Bancolombia, Efectivo..." 
              className="w-full bg-black/20 border rounded-[10px] px-3 py-2.5 text-[13px] outline-none transition-colors"
              style={{ borderColor: 'var(--bios-border)', color: 'var(--bios-text)' }}
            />
          </div>

          {/* Fila: Logo y Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>URL del Logo institucional</label>
              <ImageLogoInput url={nuevoLogo} onChange={setNuevoLogo} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px]" style={{ color: 'var(--bios-text-dim)' }}>Color distintivo</label>
              <ColorPicker value={nuevoColor} onChange={setNuevoColor} />
            </div>
          </div>

          {/* Toggle de Dashboard */}
          <div className="mb-6">
            <ToggleCard 
              label="Incluir en la suma del dashboard" 
              description="El saldo acumulado se sumará al patrimonio total visible."
              checked={incluirDashboard}
              onChange={setIncluirDashboard} 
            />
          </div>

          {/* Pie de página con botones personalizados */}
          <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--bios-border)' }}>
            <button 
              onClick={() => { setNuevoNombre(''); setNuevoSaldo(''); setNuevoLogo(''); setNuevoColor('#3498db'); }}
              className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: 'var(--bios-text-dim)' }}
            >
              <IconTrash size={14} /> Limpiar campos
            </button>

            <button 
              onClick={handleGuardarCuenta}
              className="text-[12px] font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
              style={{ 
                background: 'var(--bios-accent)', 
                color: '#0a1120'
              }}
            >
              Guardar cuenta
            </button>
          </div>

        </div>
      </Modal>

    </div>
  );
}