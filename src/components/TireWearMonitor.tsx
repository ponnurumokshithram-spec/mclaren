import React from 'react';
import { TireTelemetry, TireCorner, TireCompound } from '../types';
import { Disc, AlertTriangle, CheckCircle, ArrowRightLeft, Layers } from 'lucide-react';

interface TireWearMonitorProps {
  tires: {
    FL: TireTelemetry;
    FR: TireTelemetry;
    RL: TireTelemetry;
    RR: TireTelemetry;
  };
  tireCompound: TireCompound;
  onTireCompoundChange?: (compound: TireCompound) => void;
}

export const TireWearMonitor: React.FC<TireWearMonitorProps> = ({
  tires,
  tireCompound,
  onTireCompoundChange,
}) => {
  // Color helper for 3-zone temperature
  const getZoneColor = (temp: number) => {
    if (temp < 80) return 'bg-blue-600 text-white';
    if (temp <= 104) return 'bg-emerald-500 text-black';
    if (temp <= 114) return 'bg-amber-400 text-black';
    return 'bg-red-500 text-white animate-pulse';
  };

  // Helper for tire corner card
  const renderTireCard = (corner: TireCorner, data: TireTelemetry, isFront: boolean) => {
    const isOverheating = data.tempCenter > 112;
    const isWorn = data.wearPercent < 50;

    return (
      <div 
        key={corner}
        id={`tire-card-${corner.toLowerCase()}`}
        className={`bg-[#161616] border rounded-lg p-3.5 flex flex-col justify-between transition-all ${
          isOverheating 
            ? 'border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.2)]' 
            : 'border-[#262626] hover:border-[#383838]'
        }`}
      >
        {/* Card Header: Corner name & Wear percentage */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-sm bg-[#222222] border border-[#333333] flex items-center justify-center font-racing font-bold text-white text-xs">
              {corner}
            </span>
            <span className="text-xs font-mono-race text-gray-400 uppercase">
              {isFront ? 'FRONT' : 'REAR'} {corner.endsWith('L') ? 'LEFT' : 'RIGHT'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono-race text-gray-400 mr-1.5">TREAD:</span>
            <span className={`text-base font-racing font-bold ${data.wearPercent < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {data.wearPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Tread Wear Progress Bar */}
        <div className="mb-3">
          <div className="h-2 w-full bg-[#0D0D0D] rounded-sm overflow-hidden border border-[#222222]">
            <div
              className={`h-full transition-all duration-300 ${
                data.wearPercent > 70 
                  ? 'bg-emerald-500' 
                  : data.wearPercent > 40 
                  ? 'bg-amber-400' 
                  : 'bg-red-500'
              }`}
              style={{ width: `${data.wearPercent}%` }}
            />
          </div>
        </div>

        {/* 3-Zone Temperature Carcass Heatmap (Inner - Center - Outer) */}
        <div className="bg-[#0F0F0F] rounded-md p-2.5 border border-[#222222] mb-3">
          <div className="flex justify-between text-[10px] font-mono-race text-gray-400 mb-1">
            <span>INNER</span>
            <span className="text-white font-bold">CORE ({data.tempCenter}°C)</span>
            <span>OUTER</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1 text-center font-mono-race font-bold text-xs py-0.5">
            <div className={`py-1 rounded-sm ${getZoneColor(data.tempInner)}`}>
              {data.tempInner}°C
            </div>
            <div className={`py-1 rounded-sm ${getZoneColor(data.tempCenter)}`}>
              {data.tempCenter}°C
            </div>
            <div className={`py-1 rounded-sm ${getZoneColor(data.tempOuter)}`}>
              {data.tempOuter}°C
            </div>
          </div>
          
          <div className="text-[9px] font-mono-race text-center text-gray-500 mt-1">
            {Math.abs(data.tempOuter - data.tempInner) > 4 
              ? `Thermal delta: ${Math.abs(data.tempOuter - data.tempInner)}°C (Camber loading)`
              : 'Thermal distribution balanced'}
          </div>
        </div>

        {/* Pressure, Load & Brake Temperature Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-race">
          <div className="bg-[#141414] p-1.5 rounded-sm border border-[#222222]">
            <span className="text-[9px] text-gray-500 block">PRESSURE</span>
            <span className="text-[#00E5FF] font-bold">{data.pressurePsi} PSI</span>
          </div>
          <div className="bg-[#141414] p-1.5 rounded-sm border border-[#222222]">
            <span className="text-[9px] text-gray-500 block">LOAD</span>
            <span className="text-white font-bold">{data.loadKg} KG</span>
          </div>
          <div className="bg-[#141414] p-1.5 rounded-sm border border-[#222222]">
            <span className="text-[9px] text-gray-500 block">BRAKE ROTOR</span>
            <span className={`${data.brakeTemp > 650 ? 'text-red-400 font-bold' : 'text-amber-400 font-semibold'}`}>
              {data.brakeTemp}°C
            </span>
          </div>
        </div>

        {/* Slip Angle & Status */}
        <div className="mt-2.5 pt-2 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono-race">
          <span className="text-gray-500">SLIP ANGLE: <strong className="text-gray-300">{data.slipAngle}°</strong></span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${
            isOverheating ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {isOverheating ? 'OVERHEATING' : 'OPTIMAL GRIP'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div id="mclaren-tire-wear-monitor" className="bg-[#121212] border border-[#222222] border-l-4 border-l-[#FF6600] rounded-xl p-4 sm:p-5 shadow-2xl">
      
      {/* Header & Compound Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-[#FF6600]/15 text-[#FF6600] border border-[#FF6600]/40">
            <Disc className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-racing font-bold text-white tracking-wider uppercase">
              Tire Wear Degradation & 3-Zone Thermal Analytics
            </h2>
            <p className="text-[11px] font-mono-race text-gray-400">
              Real-time Tread Wear Rate • 3-Zone Carcass Heatmap • Inflation Dynamics
            </p>
          </div>
        </div>

        {/* Compound Selector Pills */}
        <div className="flex items-center gap-1 bg-[#161616] p-1 rounded-md border border-[#262626] text-xs font-mono-race">
          {(['Trofeo R Slick', 'P Zero Corsa', 'P Zero Wet'] as TireCompound[]).map((compound) => (
            <button
              key={compound}
              onClick={() => onTireCompoundChange?.(compound)}
              className={`px-2.5 py-1 rounded-sm transition-all ${
                tireCompound === compound
                  ? 'bg-[#FF6600] text-black font-bold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {compound}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Tire Cards Grid (FL, FR, RL, RR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {renderTireCard('FL', tires.FL, true)}
        {renderTireCard('FR', tires.FR, true)}
        {renderTireCard('RL', tires.RL, false)}
        {renderTireCard('RR', tires.RR, false)}
      </div>

      {/* Telemetry Guide & Thermal Scale */}
      <div className="mt-4 pt-3 border-t border-[#222222] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-race text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">PIRELLI WORKING WINDOW:</span>
          <span className="text-emerald-400 font-bold">85°C – 105°C</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">THERMAL SCALE:</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded-sm bg-blue-600 text-white text-[10px]">Cold &lt;80°</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-emerald-500 text-black text-[10px] font-bold">Optimum 85-104°</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-amber-400 text-black text-[10px] font-bold">Warm 105-114°</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-red-500 text-white text-[10px] font-bold">Hot &gt;115°</span>
          </div>
        </div>
      </div>

    </div>
  );
};
