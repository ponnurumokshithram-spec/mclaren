import React, { useState } from 'react';
import { EngineTelemetry, GForceTelemetry, DownforceTelemetry } from '../types';
import { SimulationMode } from '../hooks/useTelemetrySimulation';
import { Wind, Activity, Gauge as GaugeIcon, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GaugesClusterProps {
  engine: EngineTelemetry;
  gForce: GForceTelemetry;
  downforce: DownforceTelemetry;
  simMode: SimulationMode;
  onManualInput: (key: 'throttle' | 'brake' | 'steer' | 'drs', val: any) => void;
  accentColor: string;
}

export const GaugesCluster: React.FC<GaugesClusterProps> = ({
  engine,
  gForce,
  downforce,
  simMode,
  onManualInput,
  accentColor,
}) => {
  const [speedUnit, setSpeedUnit] = useState<'kmh' | 'mph'>('kmh');

  // Convert speed if mph
  const displaySpeed = speedUnit === 'kmh' 
    ? engine.speedKmh 
    : Math.round(engine.speedKmh * 0.621371);

  // Tachometer geometry calculations (240 degree arc from -120 to +120)
  const rpmRatio = Math.min(1, Math.max(0, engine.rpm / engine.maxRpm));
  const rpmAngle = -120 + rpmRatio * 240;

  // Boost gauge geometry (-110 to +110 deg)
  const boostRatio = Math.min(1, Math.max(0, engine.boostBar / engine.maxBoostBar));
  const boostAngle = -110 + boostRatio * 220;

  // 16 Sequential Shift Lights
  const shiftLightCount = 16;
  const activeLights = Math.floor(rpmRatio * shiftLightCount);
  const isRedlineFlash = engine.rpm >= engine.maxRpm * 0.96;

  // G-Force canvas coordinate inside 100x100 circle
  const gCircleRadius = 38; // Radius of 1.5G circle
  const gX = 50 + (gForce.lateralG / 2.5) * gCircleRadius;
  const gY = 50 - (gForce.longitudinalG / 2.5) * gCircleRadius;

  return (
    <div id="mclaren-gauges-cluster" className="bg-[#121212] border border-[#222222] border-l-4 border-l-[#FF6600] rounded-xl p-4 sm:p-5 shadow-2xl relative overflow-hidden bg-telemetry-grid">
      
      {/* Top Shift Light Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-mono-race text-gray-400 mb-1.5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[#FF6600] font-bold">SEAMLESS SHIFT SSG</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300">
              IGNITION CUT ARMED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">REV LIMIT:</span>
            <span className="text-red-400 font-bold">{engine.maxRpm} RPM</span>
          </div>
        </div>

        {/* 16-LED Sequential Shift Bar - Geometric Grid */}
        <div className={`grid grid-cols-16 gap-1 p-1.5 rounded-md bg-[#0A0A0A] border border-[#222222] ${isRedlineFlash ? 'ring-2 ring-red-500 animate-pulse' : ''}`}>
          {Array.from({ length: shiftLightCount }).map((_, idx) => {
            const isActive = idx < activeLights;
            let color = 'bg-emerald-500';
            if (idx >= 6 && idx < 11) color = 'bg-amber-400';
            if (idx >= 11 && idx < 14) color = 'bg-red-500';
            if (idx >= 14) color = 'bg-blue-400';

            return (
              <div
                key={idx}
                className={`h-2.5 rounded-none transition-all duration-75 ${
                  isActive 
                    ? `${color} shadow-[0_0_8px_currentColor]` 
                    : 'bg-[#1C1C1C]'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Gauges Layout: Boost / Tachometer & Gear / G-G Circle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Left: Twin-Turbo Boost Gauge & Powertrain Thermals */}
        <div className="md:col-span-3 flex flex-col items-center bg-[#161616] border border-[#262626] rounded-lg p-3">
          <div className="text-xs font-mono-race text-gray-400 font-semibold tracking-wider flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-[#FF6600]" />
            <span>TWIN-TURBO BOOST</span>
          </div>

          {/* SVG Boost Dial */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Background Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#222222"
                strokeWidth="7"
                strokeDasharray="180 360"
                strokeLinecap="round"
              />
              {/* Active Boost Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#FF6600"
                strokeWidth="7"
                strokeDasharray={`${boostRatio * 180} 360`}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-2xl font-racing font-bold text-white tracking-wider">
                {engine.boostBar.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono-race text-gray-400 uppercase">BAR</span>
              <span className="text-[9px] font-mono-race text-emerald-400 font-bold mt-0.5">
                MAX {engine.maxBoostBar.toFixed(1)} BAR
              </span>
            </div>
          </div>

          {/* Engine Vital Temperatures */}
          <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#262626] text-[11px] font-mono-race">
            <div className="bg-[#101010] p-1.5 rounded-sm border border-[#222222]">
              <span className="text-gray-500 block text-[9px]">OIL TEMP</span>
              <span className="text-amber-400 font-bold">{engine.oilTempC}°C</span>
            </div>
            <div className="bg-[#101010] p-1.5 rounded-sm border border-[#222222]">
              <span className="text-gray-500 block text-[9px]">COOLANT</span>
              <span className="text-[#00E5FF] font-bold">{engine.coolantTempC}°C</span>
            </div>
            <div className="bg-[#101010] p-1.5 rounded-sm border border-[#222222]">
              <span className="text-gray-500 block text-[9px]">OIL PRESS</span>
              <span className="text-emerald-400 font-bold">{engine.oilPressureBar} bar</span>
            </div>
            <div className="bg-[#101010] p-1.5 rounded-sm border border-[#222222]">
              <span className="text-gray-500 block text-[9px]">EXHAUST EGT</span>
              <span className="text-red-400 font-bold">{engine.egtC}°C</span>
            </div>
          </div>
        </div>

        {/* Center: Massive Tachometer & Digital Speed + Gear Display */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative py-2">
          
          {/* Main Tachometer Sweeping Arc */}
          <div className="relative w-64 sm:w-72 h-64 sm:h-72 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Dial Track */}
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="12"
                strokeDasharray="360 400"
                strokeDashoffset="-60"
                strokeLinecap="round"
              />
              {/* Yellow Zone */}
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="#d97706"
                strokeWidth="12"
                strokeDasharray="60 400"
                strokeDashoffset="-240"
                opacity="0.35"
              />
              {/* Redline Zone */}
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray="45 400"
                strokeDashoffset="-300"
                opacity="0.45"
              />
              {/* Dynamic RPM Sweeping Arc */}
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke={rpmRatio > 0.88 ? '#ef4444' : '#FF6600'}
                strokeWidth="12"
                strokeDasharray={`${rpmRatio * 290} 400`}
                strokeDashoffset="-60"
                strokeLinecap="round"
                className="transition-all duration-75"
                style={{
                  filter: `drop-shadow(0 0 8px ${rpmRatio > 0.88 ? '#ef4444' : '#FF6600'})`,
                }}
              />

              {/* Tick Marks & RPM Numbers */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => {
                const angle = -120 + (k / 8.5) * 240;
                const rad = (angle * Math.PI) / 180;
                const x1 = 100 + 68 * Math.cos(rad);
                const y1 = 100 + 68 * Math.sin(rad);
                const x2 = 100 + 62 * Math.cos(rad);
                const y2 = 100 + 62 * Math.sin(rad);
                const tx = 100 + 52 * Math.cos(rad);
                const ty = 100 + 52 * Math.sin(rad) + 4;

                return (
                  <g key={k}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#383838" strokeWidth="2" />
                    <text
                      x={tx}
                      y={ty}
                      fill={k >= 8 ? '#ef4444' : '#888888'}
                      fontSize="10"
                      fontFamily="Rajdhani"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {k}
                    </text>
                  </g>
                );
              })}

              {/* Center Cluster Bezel */}
              <circle cx="100" cy="100" r="46" fill="#0D0D0D" stroke="#262626" strokeWidth="2" />
            </svg>

            {/* Centered Digital Readout: Giant Gear + Digital Speed */}
            <div className="absolute flex flex-col items-center justify-center">
              {/* Gear Display */}
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-mono-race text-gray-500 uppercase">GEAR</span>
                <span 
                  id="telemetry-gear-display"
                  className="text-5xl font-racing font-black tracking-tighter text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                >
                  {engine.gear === 0 ? 'N' : (engine.gear === -1 ? 'R' : engine.gear)}
                </span>
              </div>

              {/* Speed Digital Readout */}
              <div className="flex items-baseline gap-1 mt-0.5">
                <span 
                  id="telemetry-speed-display"
                  className="text-3xl font-racing font-bold text-[#FF6600]"
                >
                  {displaySpeed}
                </span>
                <button
                  onClick={() => setSpeedUnit(u => u === 'kmh' ? 'mph' : 'kmh')}
                  className="text-[10px] font-mono-race text-gray-400 hover:text-white transition-colors cursor-pointer uppercase border-b border-gray-600"
                  title="Click to toggle KM/H and MPH"
                >
                  {speedUnit}
                </button>
              </div>

              {/* Live RPM Digital Counter */}
              <div className="text-xs font-mono-race font-bold text-gray-300 mt-1">
                {engine.rpm.toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">RPM</span>
              </div>
            </div>
          </div>

          {/* Horsepower & Torque Telemetry Banner */}
          <div className="flex items-center gap-6 mt-1 text-xs font-mono-race">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">EST. POWER:</span>
              <span className="text-white font-bold">{engine.horsepowerEst} BHP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">TORQUE:</span>
              <span className="text-[#FF6600] font-bold">{engine.torqueEstNm} NM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">DRS:</span>
              <span className={`font-bold ${downforce.drsActive ? 'text-[#00E5FF] animate-pulse' : 'text-gray-600'}`}>
                {downforce.drsActive ? 'ACTIVE' : 'STOWED'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: G-G Friction Circle & Pedal Traces */}
        <div className="md:col-span-3 flex flex-col items-center bg-[#161616] border border-[#262626] rounded-lg p-3">
          <div className="text-xs font-mono-race text-gray-400 font-semibold tracking-wider flex items-center gap-1.5 mb-1">
            <GaugeIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>G-G FRICTION CIRCLE</span>
          </div>

          {/* G-Force Friction Circle SVG */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer 2.0G boundary */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#222222" strokeWidth="1" strokeDasharray="3 3" />
              {/* 1.0G boundary */}
              <circle cx="50" cy="50" r="22" fill="none" stroke="#333333" strokeWidth="1" />
              {/* Center Crosshairs */}
              <line x1="10" y1="50" x2="90" y2="50" stroke="#333333" strokeWidth="0.75" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#333333" strokeWidth="0.75" />

              {/* Axis labels */}
              <text x="50" y="8" fill="#666666" fontSize="6" fontFamily="Rajdhani" textAnchor="middle">+ACCEL</text>
              <text x="50" y="97" fill="#666666" fontSize="6" fontFamily="Rajdhani" textAnchor="middle">-BRAKE</text>
              <text x="5" y="52" fill="#666666" fontSize="6" fontFamily="Rajdhani" textAnchor="start">L</text>
              <text x="95" y="52" fill="#666666" fontSize="6" fontFamily="Rajdhani" textAnchor="end">R</text>

              {/* Trail of recent G forces */}
              {gForce.gHistory.map((pt, i) => {
                const px = 50 + (pt.x / 2.5) * gCircleRadius;
                const py = 50 - (pt.y / 2.5) * gCircleRadius;
                const opacity = (i + 1) / gForce.gHistory.length;
                return (
                  <circle
                    key={i}
                    cx={px}
                    cy={py}
                    r="1.5"
                    fill="#00E5FF"
                    opacity={opacity * 0.4}
                  />
                );
              })}

              {/* Current Active G point */}
              <circle
                cx={gX}
                cy={gY}
                r="4"
                fill="#FF6600"
                className="transition-all duration-75"
                style={{ filter: 'drop-shadow(0 0 6px #FF6600)' }}
              />
            </svg>

            {/* Readout values */}
            <div className="absolute bottom-1 right-1 text-[10px] font-mono-race text-gray-400 bg-black/80 px-1 rounded-sm border border-white/5">
              LAT: <span className="text-white font-bold">{gForce.lateralG > 0 ? `+${gForce.lateralG}G` : `${gForce.lateralG}G`}</span>
            </div>
            <div className="absolute top-1 left-1 text-[10px] font-mono-race text-gray-400 bg-black/80 px-1 rounded-sm border border-white/5">
              LON: <span className="text-white font-bold">{gForce.longitudinalG > 0 ? `+${gForce.longitudinalG}G` : `${gForce.longitudinalG}G`}</span>
            </div>
          </div>

          {/* Pedal Inputs: Throttle (Green) vs Brake (Red) */}
          <div className="w-full space-y-2 mt-2 pt-2 border-t border-[#262626]">
            <div>
              <div className="flex justify-between text-[10px] font-mono-race mb-0.5">
                <span className="text-emerald-400 font-semibold">THROTTLE</span>
                <span className="text-white font-bold">{engine.throttlePct}%</span>
              </div>
              <div className="h-2 w-full bg-[#101010] rounded-sm overflow-hidden border border-[#222222]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-75"
                  style={{ width: `${engine.throttlePct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono-race mb-0.5">
                <span className="text-red-400 font-semibold">BRAKE PRESSURE</span>
                <span className="text-white font-bold">{engine.brakePct}%</span>
              </div>
              <div className="h-2 w-full bg-[#101010] rounded-sm overflow-hidden border border-[#222222]">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-75"
                  style={{ width: `${engine.brakePct}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Manual Driver Cockpit Controls (Visible in MANUAL_PILOT mode) */}
      {simMode === 'MANUAL_PILOT' && (
        <div className="mt-4 p-3.5 rounded-lg bg-[#141414] border border-[#FF6600]/40 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs font-mono-race text-gray-300">
            <span className="text-[#FF6600] font-bold tracking-wider">MANUAL COCKPIT PILOT CONTROLS</span>
            <span className="text-[11px] text-gray-400">
              Keyboard: [W / Up] Throttle | [S / Down] Brake | [A / D] Steer | [Space] DRS
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onMouseDown={() => onManualInput('throttle', 100)}
              onMouseUp={() => onManualInput('throttle', 0)}
              onTouchStart={() => onManualInput('throttle', 100)}
              onTouchEnd={() => onManualInput('throttle', 0)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-racing font-bold text-sm tracking-wider active:scale-95 transition-transform cursor-pointer select-none"
            >
              <ArrowUp className="w-4 h-4" />
              <span>FULL THROTTLE</span>
            </button>

            <button
              onMouseDown={() => onManualInput('brake', 100)}
              onMouseUp={() => onManualInput('brake', 0)}
              onTouchStart={() => onManualInput('brake', 100)}
              onTouchEnd={() => onManualInput('brake', 0)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-racing font-bold text-sm tracking-wider active:scale-95 transition-transform cursor-pointer select-none"
            >
              <ArrowDown className="w-4 h-4" />
              <span>HARD BRAKE & AIRBRAKE</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onMouseDown={() => onManualInput('steer', -22)}
                onMouseUp={() => onManualInput('steer', 0)}
                onTouchStart={() => onManualInput('steer', -22)}
                onTouchEnd={() => onManualInput('steer', 0)}
                className="p-2 rounded-md bg-[#222222] hover:bg-[#2E2E2E] text-white active:scale-95 transition-transform cursor-pointer select-none border border-[#333333]"
                title="Steer Left"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onMouseDown={() => onManualInput('steer', 22)}
                onMouseUp={() => onManualInput('steer', 0)}
                onTouchStart={() => onManualInput('steer', 22)}
                onTouchEnd={() => onManualInput('steer', 0)}
                className="p-2 rounded-md bg-[#222222] hover:bg-[#2E2E2E] text-white active:scale-95 transition-transform cursor-pointer select-none border border-[#333333]"
                title="Steer Right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onMouseDown={() => onManualInput('drs', true)}
              onMouseUp={() => onManualInput('drs', false)}
              onTouchStart={() => onManualInput('drs', true)}
              onTouchEnd={() => onManualInput('drs', false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0099B8] hover:bg-[#00E5FF] hover:text-black text-white font-racing font-bold text-sm active:scale-95 transition-all cursor-pointer select-none"
            >
              <Wind className="w-4 h-4" />
              <span>DRS WING OPEN</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
