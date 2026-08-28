import React from 'react';
import { CarId } from '../types';
import { CAR_MODELS } from '../data/cars';
import { CIRCUITS } from '../data/tracks';
import { SimulationMode } from '../hooks/useTelemetrySimulation';
import { 
  Gauge, 
  Play, 
  Pause, 
  Wrench, 
  Radio, 
  Flag, 
  Compass, 
  Zap, 
  ChevronRight,
  Info
} from 'lucide-react';

interface HeaderProps {
  selectedCarId: CarId;
  onSelectCar: (id: CarId) => void;
  selectedCircuitId: string;
  onSelectCircuit: (id: string) => void;
  simMode: SimulationMode;
  onToggleSimMode: (mode: SimulationMode) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenShowcase: () => void;
  onOpenServiceBay: () => void;
  inPitBox: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCarId,
  onSelectCar,
  selectedCircuitId,
  onSelectCircuit,
  simMode,
  onToggleSimMode,
  isPaused,
  onTogglePause,
  onOpenShowcase,
  onOpenServiceBay,
  inPitBox,
}) => {
  const currentCar = CAR_MODELS[selectedCarId];

  return (
    <header id="mclaren-main-header" className="bg-[#0A0A0A]/95 border-b border-[#222222] sticky top-0 z-40 backdrop-blur-md">
      {/* Top Telemetry Ticker Bar */}
      <div className="bg-[#0D0D0D] px-4 py-1.5 border-b border-[#1E1E1E] flex flex-wrap items-center justify-between text-xs font-mono-race tracking-wider text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>WOKING MISSION CONTROL UPLINK [LIVE]</span>
          </div>
          <span className="hidden sm:inline text-[#333333]">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-gray-500">CHASSIS:</span>
            <span className="text-white font-bold">{currentCar.chassisType.split(' ')[0]}</span>
          </div>
          <span className="hidden md:inline text-[#333333]">|</span>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-gray-500">POWERTRAIN:</span>
            <span className="text-[#FF6600] font-bold">{currentCar.engine}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-inspect-specs"
            onClick={onOpenShowcase}
            className="flex items-center gap-1.5 text-gray-300 hover:text-[#FF6600] transition-colors py-0.5 px-2.5 rounded-sm bg-[#161616] border border-[#2A2A2A] hover:border-[#FF6600]/40"
          >
            <Info className="w-3.5 h-3.5 text-[#FF6600]" />
            <span className="hidden sm:inline">Supercar Specs & Aero Lineage</span>
          </button>
          <div className="text-gray-400 hidden lg:block">
            ACTIVE AERO: <span className="text-emerald-400 font-bold">ARMED</span>
          </div>
        </div>
      </div>

      {/* Main Navigation & Vehicle Selector */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Supercar Lineup Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-[#FF6600] flex items-center justify-center shadow-lg shadow-[#FF6600]/20 border border-[#FF8533]/40 shrink-0">
                <span className="text-black font-black text-xl italic font-racing">M</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-racing font-bold text-xl sm:text-2xl tracking-wider">
                    McLAREN
                  </span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded-sm bg-[#FF6600]/15 text-[#FF6600] border border-[#FF6600]/40 font-bold tracking-wider">
                    LONGTAIL SERIES
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono-race hidden sm:block">
                  Precision Track Telemetry & Aerodynamic Analytics
                </p>
              </div>
            </div>

            {/* Mobile Car Switch Buttons */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                id="btn-switch-720lt-mobile"
                onClick={() => onSelectCar('mclaren_720lt')}
                className={`px-2.5 py-1 text-xs rounded-sm font-bold transition-all ${
                  selectedCarId === 'mclaren_720lt'
                    ? 'bg-[#FF6600] text-black shadow-md'
                    : 'bg-[#161616] text-gray-400 border border-[#262626]'
                }`}
              >
                720LT
              </button>
              <button
                id="btn-switch-625lt-mobile"
                onClick={() => onSelectCar('mclaren_625lt_spider')}
                className={`px-2.5 py-1 text-xs rounded-sm font-bold transition-all ${
                  selectedCarId === 'mclaren_625lt_spider'
                    ? 'bg-[#00E5FF] text-black shadow-md'
                    : 'bg-[#161616] text-gray-400 border border-[#262626]'
                }`}
              >
                625LT Spider
              </button>
            </div>
          </div>

          {/* Desktop Car Model Tabs - Geometric Balance */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#141414] p-1 rounded-md border border-[#262626]">
            <button
              id="tab-car-720lt"
              onClick={() => onSelectCar('mclaren_720lt')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs font-racing font-bold tracking-wide transition-all ${
                selectedCarId === 'mclaren_720lt'
                  ? 'bg-[#FF6600] text-black shadow-md shadow-[#FF6600]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${selectedCarId === 'mclaren_720lt' ? 'bg-black' : 'bg-[#FF6600]'}`} />
              <span>720LT SUPERCAR (720 PS)</span>
            </button>

            <button
              id="tab-car-625lt-spider"
              onClick={() => onSelectCar('mclaren_625lt_spider')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs font-racing font-bold tracking-wide transition-all ${
                selectedCarId === 'mclaren_625lt_spider'
                  ? 'bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${selectedCarId === 'mclaren_625lt_spider' ? 'bg-black' : 'bg-[#00E5FF]'}`} />
              <span>625LT SPIDER (625 PS)</span>
            </button>
          </div>

          {/* Track Selection & Drive Mode Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Circuit Selector */}
            <div className="flex items-center bg-[#141414] border border-[#262626] rounded-md px-2.5 py-1.5">
              <Flag className="w-3.5 h-3.5 text-[#FF6600] mr-2" />
              <select
                id="select-circuit"
                value={selectedCircuitId}
                onChange={(e) => onSelectCircuit(e.target.value)}
                className="bg-transparent text-xs text-white font-mono-race focus:outline-none cursor-pointer"
              >
                {Object.values(CIRCUITS).map(circuit => (
                  <option key={circuit.id} value={circuit.id} className="bg-[#141414] text-white">
                    {circuit.name} ({circuit.cornersCount} Corners)
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Switch: Auto Lap Simulation vs Manual Pilot Cockpit */}
            <div className="flex items-center bg-[#141414] border border-[#262626] rounded-md p-1">
              <button
                id="btn-mode-auto"
                onClick={() => onToggleSimMode('AUTO_LAP')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono-race transition-all ${
                  simMode === 'AUTO_LAP'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Continuous Autonomous Hot Lap Telemetry"
              >
                <Radio className="w-3 h-3" />
                <span>Auto Lap</span>
              </button>

              <button
                id="btn-mode-manual"
                onClick={() => onToggleSimMode('MANUAL_PILOT')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono-race transition-all ${
                  simMode === 'MANUAL_PILOT'
                    ? 'bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/50 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Pilot the McLaren manually with keyboard or pedal buttons"
              >
                <Zap className="w-3 h-3" />
                <span>Manual Pilot</span>
              </button>
            </div>

            {/* Pit Box Quick Action */}
            <button
              id="btn-open-service-bay"
              onClick={onOpenServiceBay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-racing font-bold tracking-wider transition-all border ${
                inPitBox
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                  : 'bg-[#141414] text-gray-200 border-[#262626] hover:bg-[#1C1C1C] hover:border-[#FF6600]/50'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-[#FF6600]" />
              <span>{inPitBox ? 'IN PIT BOX' : 'PIT SERVICE'}</span>
            </button>

            {/* Play/Pause simulation */}
            <button
              id="btn-toggle-sim-pause"
              onClick={onTogglePause}
              className="p-1.5 rounded-md bg-[#141414] hover:bg-[#1C1C1C] border border-[#262626] text-gray-300 hover:text-white hover:border-[#FF6600]/40 transition-all"
              title={isPaused ? 'Resume Telemetry Stream' : 'Pause Telemetry Stream'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
