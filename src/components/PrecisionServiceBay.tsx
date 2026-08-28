import React from 'react';
import { PrecisionServiceSetup, CarSpecs } from '../types';
import { 
  Wrench, 
  Settings2, 
  Cpu, 
  RotateCcw, 
  Flame, 
  ShieldCheck, 
  Sliders, 
  Check, 
  Sparkles,
  Zap
} from 'lucide-react';

interface PrecisionServiceBayProps {
  setup: PrecisionServiceSetup;
  car: CarSpecs;
  onUpdateSetup: (updates: Partial<PrecisionServiceSetup>) => void;
  onTriggerPitService: (action: 'FULL_SERVICE' | 'TIRES_ONLY' | 'AERO_TUNE') => void;
}

export const PrecisionServiceBay: React.FC<PrecisionServiceBayProps> = ({
  setup,
  car,
  onUpdateSetup,
  onTriggerPitService,
}) => {
  return (
    <div id="precision-service-bay" className="bg-[#121212] border border-[#222222] border-l-4 border-l-[#FF6600] rounded-xl p-4 sm:p-5 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-[#FF6600]/15 text-[#FF6600] border border-[#FF6600]/40">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-racing font-bold text-white tracking-wider uppercase">
              Precision Track Service Bay & Setup Engineering
            </h2>
            <p className="text-[11px] font-mono-race text-gray-400">
              Pit Box Telemetry Maintenance • Aerodynamic Flap Trim • ECU Engine Mapping
            </p>
          </div>
        </div>

        {/* Pit Status Badge */}
        <div className={`px-3 py-1 rounded-sm text-xs font-mono-race font-bold border flex items-center gap-2 ${
          setup.serviceInProgress
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }`}>
          <div className={`w-2 h-2 rounded-full ${setup.serviceInProgress ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span>{setup.serviceInProgress ? setup.pitActionText : 'STATUS: RACE READY'}</span>
        </div>
      </div>

      {/* Quick Pit Lane Service Actions */}
      <div className="mb-5">
        <div className="text-xs font-mono-race text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#FF6600]" />
          <span>One-Click Pit Box Service Operations</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            id="btn-pit-full-service"
            disabled={setup.serviceInProgress}
            onClick={() => onTriggerPitService('FULL_SERVICE')}
            className="flex flex-col text-left p-3 rounded-lg bg-[#161616] border border-[#262626] hover:border-[#FF6600] transition-all group cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-racing font-bold text-white text-sm group-hover:text-[#FF6600] transition-colors">
                FULL BOX SERVICE
              </span>
              <RotateCcw className="w-3.5 h-3.5 text-[#FF6600] group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <span className="text-[11px] font-mono-race text-gray-400">
              4x Fresh Pirelli Trofeo R tires (100%), normalize pressures, rotor cooling flush.
            </span>
          </button>

          <button
            id="btn-pit-tires-only"
            disabled={setup.serviceInProgress}
            onClick={() => onTriggerPitService('TIRES_ONLY')}
            className="flex flex-col text-left p-3 rounded-lg bg-[#161616] border border-[#262626] hover:border-[#00E5FF] transition-all group cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-racing font-bold text-white text-sm group-hover:text-[#00E5FF] transition-colors">
                FRESH TIRE SET
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            </div>
            <span className="text-[11px] font-mono-race text-gray-400">
              Quick 2.2s tire change. Fresh compound tread depth reset to 100%.
            </span>
          </button>

          <button
            id="btn-pit-aero-tune"
            disabled={setup.serviceInProgress}
            onClick={() => onTriggerPitService('AERO_TUNE')}
            className="flex flex-col text-left p-3 rounded-lg bg-[#161616] border border-[#262626] hover:border-emerald-400 transition-all group cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-racing font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                AERO & BALANCE TRIM
              </span>
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-[11px] font-mono-race text-gray-400">
              Micro-adjust rear Longtail airbrake baseline & front dive plane angles.
            </span>
          </button>
        </div>
      </div>

      {/* Precision Setup Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. ECU Engine Mapping */}
        <div className="bg-[#161616] border border-[#262626] rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono-race text-gray-300 font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5 text-[#FF6600]" />
              <span>ECU POWERTRAIN MAP</span>
            </div>
            
            <div className="space-y-1.5">
              {[
                { map: 1, name: 'Map 1: Fuel Save / Out-Lap', desc: '1.6 bar boost, conservative ignition' },
                { map: 2, name: 'Map 2: Race Pace Standard', desc: '1.9 bar boost, endurance telemetry' },
                { map: 3, name: 'Map 3: Push / Overtake (+0.2)', desc: '2.1 bar boost, aggressive shift cut' },
                { map: 4, name: 'Map 4: Quali Max Attack', desc: '2.4 bar boost, 8,500 rpm redline' },
              ].map(item => (
                <button
                  key={item.map}
                  onClick={() => onUpdateSetup({ ecuMap: item.map as any })}
                  className={`w-full text-left p-2 rounded-sm text-xs font-mono-race transition-all border ${
                    setup.ecuMap === item.map
                      ? 'bg-[#FF6600]/15 text-white border-[#FF6600]/50 font-bold'
                      : 'bg-[#0F0F0F] text-gray-400 border-[#222222] hover:bg-[#1C1C1C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {setup.ecuMap === item.map && <Check className="w-3 h-3 text-[#FF6600]" />}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Aerodynamic Flap & Wing Angle Trim */}
        <div className="bg-[#161616] border border-[#262626] rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono-race text-gray-300 font-semibold mb-2">
              <Settings2 className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>AERO WING TRIM</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono-race mb-1">
                  <span className="text-gray-400">Wing Flap Trim Offset</span>
                  <span className="text-[#00E5FF] font-bold">
                    {setup.wingAngleTrimDeg > 0 ? `+${setup.wingAngleTrimDeg}°` : `${setup.wingAngleTrimDeg}°`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={setup.wingAngleTrimDeg}
                  onChange={(e) => onUpdateSetup({ wingAngleTrimDeg: parseFloat(e.target.value) })}
                  className="w-full accent-[#00E5FF] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono-race text-gray-500 mt-0.5">
                  <span>-3° (Low Drag)</span>
                  <span>0° (Neutral)</span>
                  <span>+3° (High Downforce)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-race mb-1">
                  <span className="text-gray-400">Brake Bias (Front)</span>
                  <span className="text-red-400 font-bold">{setup.brakeBiasFrontPct}%</span>
                </div>
                <input
                  type="range"
                  min="52"
                  max="62"
                  step="0.5"
                  value={setup.brakeBiasFrontPct}
                  onChange={(e) => onUpdateSetup({ brakeBiasFrontPct: parseFloat(e.target.value) })}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono-race text-gray-500 mt-0.5">
                  <span>52% (Rear Bias)</span>
                  <span>56% (Standard)</span>
                  <span>62% (Front Stable)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Camber Alignment (Tire Shoulder Contact) */}
        <div className="bg-[#161616] border border-[#262626] rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono-race text-gray-300 font-semibold mb-2">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>CAMBER ALIGNMENT</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono-race mb-1">
                  <span className="text-gray-400">Front Camber</span>
                  <span className="text-emerald-400 font-bold">{setup.camberFrontDeg}°</span>
                </div>
                <input
                  type="range"
                  min="-4.0"
                  max="-1.5"
                  step="0.1"
                  value={setup.camberFrontDeg}
                  onChange={(e) => onUpdateSetup({ camberFrontDeg: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="text-[9px] font-mono-race text-gray-500 mt-0.5">
                  Optimizes outer shoulder wear in fast sweepers.
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-race mb-1">
                  <span className="text-gray-400">Rear Camber</span>
                  <span className="text-emerald-400 font-bold">{setup.camberRearDeg}°</span>
                </div>
                <input
                  type="range"
                  min="-3.0"
                  max="-1.0"
                  step="0.1"
                  value={setup.camberRearDeg}
                  onChange={(e) => onUpdateSetup({ camberRearDeg: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="text-[9px] font-mono-race text-gray-500 mt-0.5">
                  Balances longitudinal traction and lateral grip.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Target Cold Tire Pressures */}
        <div className="bg-[#161616] border border-[#262626] rounded-lg p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono-race text-gray-300 font-semibold mb-2">
              <Flame className="w-3.5 h-3.5 text-[#FF6600]" />
              <span>COLD TIRE TARGET (PSI)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-race">
              <div>
                <span className="text-gray-500 text-[10px] block">FL TARGET</span>
                <input
                  type="number"
                  step="0.5"
                  value={setup.targetPressureFL}
                  onChange={(e) => onUpdateSetup({ targetPressureFL: parseFloat(e.target.value) || 27 })}
                  className="w-full bg-[#0F0F0F] border border-[#262626] rounded-sm px-2 py-1 text-white font-bold"
                />
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">FR TARGET</span>
                <input
                  type="number"
                  step="0.5"
                  value={setup.targetPressureFR}
                  onChange={(e) => onUpdateSetup({ targetPressureFR: parseFloat(e.target.value) || 27 })}
                  className="w-full bg-[#0F0F0F] border border-[#262626] rounded-sm px-2 py-1 text-white font-bold"
                />
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">RL TARGET</span>
                <input
                  type="number"
                  step="0.5"
                  value={setup.targetPressureRL}
                  onChange={(e) => onUpdateSetup({ targetPressureRL: parseFloat(e.target.value) || 26.5 })}
                  className="w-full bg-[#0F0F0F] border border-[#262626] rounded-sm px-2 py-1 text-white font-bold"
                />
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">RR TARGET</span>
                <input
                  type="number"
                  step="0.5"
                  value={setup.targetPressureRR}
                  onChange={(e) => onUpdateSetup({ targetPressureRR: parseFloat(e.target.value) || 26.5 })}
                  className="w-full bg-[#0F0F0F] border border-[#262626] rounded-sm px-2 py-1 text-white font-bold"
                />
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#262626]">
              <span className="text-[10px] text-gray-500 font-mono-race block mb-1">TRACTION CONTROL</span>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono-race">
                {(['TRACK', 'VARIABLE_DRIFT', 'OFF'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => onUpdateSetup({ tractionControlMode: mode })}
                    className={`py-1 px-1 rounded-sm text-center transition-all ${
                      setup.tractionControlMode === mode
                        ? 'bg-[#FF6600] text-black font-bold'
                        : 'bg-[#0F0F0F] text-gray-400 border border-[#222222] hover:text-white'
                    }`}
                  >
                    {mode === 'VARIABLE_DRIFT' ? 'VDC' : mode}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
