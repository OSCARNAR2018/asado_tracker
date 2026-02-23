'use client';

import { Zap, ZapOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SimulationToggle() {
  const [isSimulated, setIsSimulated] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('asado_simulated');
    if (saved !== null) {
      setIsSimulated(saved === 'true');
    }
  }, []);

  const toggle = () => {
    const newVal = !isSimulated;
    setIsSimulated(newVal);
    localStorage.setItem('asado_simulated', String(newVal));
    // Dispatch custom event for real-time reactivity in other components
    window.dispatchEvent(new Event('simulation-changed'));
  };

  return (
    <button
      onClick={toggle}
      className={`fixed top-24 right-6 z-50 p-4 rounded-full glass transition-all duration-300 flex items-center gap-2 group ${isSimulated ? 'border-orange-500/50 shadow-orange-500/20' : 'border-green-500/50 shadow-green-500/20'
        }`}
      aria-label={isSimulated ? 'Desactivar Simulación' : 'Activar Simulación'}
      title={isSimulated ? 'Modo Simulación Activo' : 'Modo Tiempo Real'}
    >
      {isSimulated ? (
        <>
          <Zap className="text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
            Simulación ON
          </span>
        </>
      ) : (
        <>
          <ZapOff className="text-green-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-green-400 uppercase tracking-widest overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-500 whitespace-nowrap">
            Tiempo Real
          </span>
        </>
      )}
    </button>
  );
}
