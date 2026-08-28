import React, { useState } from 'react';
import { DownforceTelemetry, TireTelemetry, CarSpecs } from '../types';
import { Wind, Shield, Flame, Eye, Sparkles } from 'lucide-react';
import { imgAeroTelemetry } from '../data/cars';

interface ChassisAeroVisualizerProps {
  car: CarSpecs;
  downforce: DownforceTelemetry;
  tires: { FL: TireTelemetry; FR: TireTelemetry; RL: TireTelemetry; RR: TireTelemetry };
  speedKmh: number;
  brakePct: number;
}

export const ChassisAeroVisualizer: React.FC<ChassisAeroVisualizerProps> = ({
  car,
  downforce,
  tires,
  speedKmh,
  brakePct,
}) => {
  const [viewMode, setViewMode] = useState<'SCHEMATIC' | 'WIND_TUNNEL_ART'>('SCHEMATIC');

  // Rotor glow calculation based on brake temperature
  const getBrakeGlow = (temp: number) => {
    if (temp < 350) return '#374151';
    if (temp < 500) return '#b91c1c';
    if (temp < 700) return '#ef4444';
    return '#ff7849'; // glowing incandescent orange
  };

  // Tire thermal color
  const getTireThermalColor = (temp: number) => {
    if (temp < 78) return '#3b82f6'; // Cold blue
    if (temp <= 104) return '#10b981'; // Optimum green
    if (temp <= 114) return '#f59e0b'; // Warm amber
    return '#ef4444'; // Overheating red
  };

  // Lift-to-drag ratio estimate (L/D)
  const aeroEfficiency = downforce.dragCoefficient > 0 
    ? ((downforce.totalDownforceKg / 100) / downforce.dragCoefficient).toFixed(2)
    : '3.42';

  return (
    <div id="chassis-aero-visualizer" className="bg-[#121212] border border-[#222222] border-l-4 border-l-[#FF6600] rounded-xl p-4 sm:p-5 shadow-2xl relative overflow-hidden bg-carbon flex flex-col justify-between">
      
      {/* Header with Aero Mode & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222222] pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-[#FF6600]/15 text-[#FF6600] border border-[#FF6600]/40">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-racing font-bold text-white tracking-wider uppercase">
              Aerodynamic Downforce & Active Longtail Airbrake
            </h2>
            <p className="text-[11px] font-mono-race text-gray-400">
              Chassis Aerodynamics & Carbon-Ceramic Thermal Telemetry
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-[#161616] p-1 rounded-md border border-[#262626] text-xs font-mono-race">
          <button
            onClick={() => setViewMode('SCHEMATIC')}
            className={`px-2.5 py-1 rounded-sm transition-all ${
              viewMode === 'SCHEMATIC' 
                ? 'bg-[#FF6600] text-black font-bold shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Chassis Telemetry
          </button>
          <button
            onClick={() => setViewMode('WIND_TUNNEL_ART')}
            className={`px-2.5 py-1 rounded-sm flex items-center gap-1 transition-all ${
              viewMode === 'WIND_TUNNEL_ART' 
                ? 'bg-[#FF6600] text-black font-bold shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Wind Tunnel Graphic</span>
          </button>
        </div>
      </div>

      {viewMode === 'WIND_TUNNEL_ART' ? (
        <div className="relative rounded-lg overflow-hidden border border-[#262626] bg-[#0A0A0A] my-2">
          <img
            src={imgAeroTelemetry}
            alt="McLaren Aerodynamic Wind Tunnel Visualization"
            referrerPolicy="no-referrer"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent flex flex-col justify-end p-4">
            <div className="text-xs font-mono-race text-[#FF6600] font-bold tracking-wider">
              CFD STREAMLINE ANALYSIS • WOKING AERODYNAMICS TUNNEL
            </div>
            <p className="text-xs text-gray-300 max-w-xl mt-1">
              Active Longtail aero creates an invisible envelope of low-pressure vortex channels, reducing turbulent wake while generating over 500kg of cornering downforce.
            </p>
          </div>
        </div>
      ) : (
        /* Top-Down Sports Car Aerodynamic SVG Schematic */
        <div className="relative py-2 flex items-center justify-center">
          
          {/* Active Airbrake Badge Banner */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
            <div className={`px-2.5 py-1 rounded-sm text-xs font-mono-race font-bold border transition-all ${
              downforce.airbrakeActive
                ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                : downforce.drsActive
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50 animate-pulse'
                : 'bg-[#181818] text-gray-300 border-[#2A2A2A]'
            }`}>
              {downforce.airbrakeActive 
                ? 'AIRBRAKE DEPLOYED (58°)' 
                : downforce.drsActive 
                ? 'DRS ACTIVE (0°)' 
                : `AERO TRIM: ${downforce.wingAngleDeg}°`}
            </div>
            <div className="text-[10px] font-mono-race text-gray-400 bg-black/80 px-2 py-0.5 rounded-sm border border-white/5">
              TOTAL DOWNFORCE: <span className="text-white font-bold">{downforce.totalDownforceKg} KG</span>
            </div>
          </div>

          {/* Front Splitter Downforce Indicator */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10">
            <div className="text-[11px] font-mono-race text-gray-400 bg-black/60 px-2 py-1 rounded border border-white/10">
              <div>FRONT DOWNFORCE: <span className="text-[#FF8000] font-bold">{downforce.frontDownforceKg} KG</span></div>
              <div className="text-[9px] text-gray-500">BALANCE: {downforce.frontBalancePct}% FRONT / {(100 - downforce.frontBalancePct).toFixed(1)}% REAR</div>
            </div>
          </div>

          {/* Detailed SVG McLaren Chassis Wireframe */}
          <div className="relative w-full max-w-md h-88 sm:h-96 flex items-center justify-center">
            <svg viewBox="0 0 300 480" className="w-full h-full">
              <defs>
                {/* Airflow Streamlines Gradient */}
                <linearGradient id="aeroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00A8FF" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#FF8000" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
                </linearGradient>

                {/* Heat Glow filter for Carbon-Ceramic brake disc */}
                <filter id="brakeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Animated Wind Tunnel Streamlines */}
              <g opacity="0.35">
                {[60, 90, 120, 150, 180, 210, 240].map((x, i) => (
                  <path
                    key={i}
                    d={`M ${x} 10 Q ${x + (x < 150 ? -15 : 15)} 200, ${x + (x < 150 ? -25 : 25)} 470`}
                    fill="none"
                    stroke="url(#aeroGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="8 14"
                    className="animate-pulse"
                    style={{ animationDuration: `${Math.max(0.4, 2.5 - speedKmh / 140)}s` }}
                  />
                ))}
              </g>

              {/* McLaren Supercar Silhouette (Longtail Body Profile) */}
              <g id="mclaren-body-contour">
                {/* Shadow */}
                <path
                  d="M 150 40 C 120 40 92 65 84 100 L 78 175 C 72 230 70 280 74 340 L 78 400 C 82 435 110 445 150 445 C 190 445 218 435 222 400 L 226 340 C 230 280 228 230 222 175 L 216 100 C 208 65 180 40 150 40 Z"
                  fill="#06080b"
                  stroke="#1f2937"
                  strokeWidth="2"
                />

                {/* Front Splitter / Dive Planes */}
                <path
                  d="M 105 45 C 130 35 170 35 195 45 L 210 55 L 90 55 Z"
                  fill="#FF8000"
                  opacity="0.8"
                />
                <line x1="85" y1="58" x2="68" y2="70" stroke="#FF8000" strokeWidth="2.5" />
                <line x1="215" y1="58" x2="232" y2="70" stroke="#FF8000" strokeWidth="2.5" />

                {/* Hood Aerodynamic Air Ducts */}
                <path
                  d="M 125 75 L 140 115 L 160 115 L 175 75 C 160 80 140 80 125 75 Z"
                  fill="#111827"
                  stroke="#374151"
                  strokeWidth="1.5"
                />

                {/* Windshield & Cockpit */}
                <path
                  d="M 112 140 C 130 132 170 132 188 140 L 196 215 C 175 222 125 222 104 215 Z"
                  fill="#0a0e17"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                />

                {/* MonoCage / Roof Carbon Structure */}
                <path
                  d="M 120 215 L 180 215 L 175 295 L 125 295 Z"
                  fill="#111622"
                  stroke="#4b5563"
                  strokeWidth="1"
                />
                <text x="150" y="255" fill="#9ca3af" fontSize="8" fontFamily="Chakra Petch" textAnchor="middle">
                  {car.id === 'mclaren_720lt' ? 'MONOCAGE II-S' : 'MONOCELL CARBON'}
                </text>
                <text x="150" y="270" fill="#FF8000" fontSize="9" fontFamily="Rajdhani" fontWeight="bold" textAnchor="middle">
                  {car.engine.split(' ')[0]} V8 TWIN-TURBO
                </text>

                {/* Engine Bay Heat Vents */}
                <g stroke="#ff8000" strokeWidth="1" opacity="0.6">
                  <line x1="130" y1="305" x2="170" y2="305" />
                  <line x1="132" y1="315" x2="168" y2="315" />
                  <line x1="135" y1="325" x2="165" y2="325" />
                  <line x1="138" y1="335" x2="162" y2="335" />
                </g>

                {/* High-Mounted Titanium Exhaust Pipes (McLaren LT Signature) */}
                <circle cx="140" cy="408" r="6" fill="#1f2937" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="160" cy="408" r="6" fill="#1f2937" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="140" cy="408" r="3" fill="#ff4500" opacity={speedKmh > 100 ? "0.9" : "0.3"} />
                <circle cx="160" cy="408" r="3" fill="#ff4500" opacity={speedKmh > 100 ? "0.9" : "0.3"} />

                {/* Rear Carbon Diffuser Tunnels */}
                <path
                  d="M 105 435 L 115 448 M 130 435 L 132 448 M 170 435 L 168 448 M 195 435 L 185 448"
                  stroke="#4b5563"
                  strokeWidth="2"
                />

                {/* Active Rear Longtail Airbrake Wing */}
                <g id="active-rear-wing" transform={`translate(0, ${downforce.airbrakeActive ? -6 : 0})`}>
                  {/* Wing Blade */}
                  <rect
                    x="75"
                    y="420"
                    width="150"
                    height={downforce.airbrakeActive ? "20" : "8"}
                    rx="3"
                    fill={downforce.airbrakeActive ? '#ef4444' : (downforce.drsActive ? '#00D2BE' : '#FF8000')}
                    stroke="#ffffff"
                    strokeWidth="1"
                    className="transition-all duration-150"
                  />
                  {/* Wing Endplates */}
                  <rect x="70" y="415" width="6" height={downforce.airbrakeActive ? "28" : "18"} rx="1" fill="#111827" stroke="#FF6600" strokeWidth="1" />
                  <rect x="224" y="415" width="6" height={downforce.airbrakeActive ? "28" : "18"} rx="1" fill="#111827" stroke="#FF6600" strokeWidth="1" />
                  {/* Wing label */}
                  <text x="150" y={downforce.airbrakeActive ? 434 : 426} fill="#000000" fontSize="7" fontFamily="Chakra Petch" fontWeight="bold" textAnchor="middle">
                    {downforce.airbrakeActive ? 'ACTIVE AIRBRAKE 58°' : (downforce.drsActive ? 'DRS FLAT 0°' : 'LONGTAIL WING')}
                  </text>
                </g>
              </g>

              {/* 4 Wheels & Carbon-Ceramic Brakes */}
              
              {/* FRONT-LEFT (FL) */}
              <g id="wheel-fl" transform="translate(56, 95)">
                {/* Tire Tread Box with Thermal Color */}
                <rect x="-14" y="-28" width="22" height="56" rx="2" fill="#11141a" stroke={getTireThermalColor(tires.FL.tempCenter)} strokeWidth="2" />
                {/* Carbon Ceramic Brake Disc with Glow */}
                <circle cx="-3" cy="0" r="10" fill="none" stroke={getBrakeGlow(tires.FL.brakeTemp)} strokeWidth="4" filter="url(#brakeGlow)" />
                {/* Caliper */}
                <rect x="2" y="-6" width="4" height="12" rx="1" fill="#FF6600" />
                <text x="-3" y="38" fill="#EDEDED" fontSize="8" fontFamily="Chakra Petch" fontWeight="bold" textAnchor="middle">FL: {tires.FL.tempCenter}°C</text>
              </g>

              {/* FRONT-RIGHT (FR) */}
              <g id="wheel-fr" transform="translate(244, 95)">
                <rect x="-8" y="-28" width="22" height="56" rx="2" fill="#11141a" stroke={getTireThermalColor(tires.FR.tempCenter)} strokeWidth="2" />
                <circle cx="3" cy="0" r="10" fill="none" stroke={getBrakeGlow(tires.FR.brakeTemp)} strokeWidth="4" filter="url(#brakeGlow)" />
                <rect x="-6" y="-6" width="4" height="12" rx="1" fill="#FF6600" />
                <text x="3" y="38" fill="#EDEDED" fontSize="8" fontFamily="Chakra Petch" fontWeight="bold" textAnchor="middle">FR: {tires.FR.tempCenter}°C</text>
              </g>

              {/* REAR-LEFT (RL) */}
              <g id="wheel-rl" transform="translate(50, 360)">
                <rect x="-16" y="-32" width="26" height="64" rx="2" fill="#11141a" stroke={getTireThermalColor(tires.RL.tempCenter)} strokeWidth="2" />
                <circle cx="-3" cy="0" r="10" fill="none" stroke={getBrakeGlow(tires.RL.brakeTemp)} strokeWidth="4" filter="url(#brakeGlow)" />
                <rect x="3" y="-6" width="4" height="12" rx="1" fill="#FF6600" />
                <text x="-3" y="44" fill="#EDEDED" fontSize="8" fontFamily="Chakra Petch" fontWeight="bold" textAnchor="middle">RL: {tires.RL.tempCenter}°C</text>
              </g>

              {/* REAR-RIGHT (RR) */}
              <g id="wheel-rr" transform="translate(250, 360)">
                <rect x="-10" y="-32" width="26" height="64" rx="2" fill="#11141a" stroke={getTireThermalColor(tires.RR.tempCenter)} strokeWidth="2" />
                <circle cx="3" cy="0" r="10" fill="none" stroke={getBrakeGlow(tires.RR.brakeTemp)} strokeWidth="4" filter="url(#brakeGlow)" />
                <rect x="-7" y="-6" width="4" height="12" rx="1" fill="#FF6600" />
                <text x="3" y="44" fill="#EDEDED" fontSize="8" fontFamily="Chakra Petch" fontWeight="bold" textAnchor="middle">RR: {tires.RR.tempCenter}°C</text>
              </g>

            </svg>
          </div>
        </div>
      )}

      {/* Aerodynamic Efficiency & Drag Telemetry Footer - Geometric Balance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#222222] text-xs font-mono-race">
        <div className="bg-[#161616] p-2.5 rounded-lg border border-[#262626]">
          <span className="text-gray-400 block text-[10px] tracking-wider">DRAG COEFF (Cd)</span>
          <span className="text-[#00E5FF] font-bold text-sm">{downforce.dragCoefficient}</span>
        </div>
        <div className="bg-[#161616] p-2.5 rounded-lg border border-[#262626]">
          <span className="text-gray-400 block text-[10px] tracking-wider">AERO EFFICIENCY (L/D)</span>
          <span className="text-emerald-400 font-bold text-sm">{aeroEfficiency}</span>
        </div>
        <div className="bg-[#161616] p-2.5 rounded-lg border border-[#262626]">
          <span className="text-gray-400 block text-[10px] tracking-wider">REAR WING ANGLE</span>
          <span className="text-[#FF6600] font-bold text-sm">{downforce.wingAngleDeg}°</span>
        </div>
        <div className="bg-[#161616] p-2.5 rounded-lg border border-[#262626]">
          <span className="text-gray-400 block text-[10px] tracking-wider">CARBON ROTOR TEMP</span>
          <span className="text-red-400 font-bold text-sm">
            {Math.max(tires.FL.brakeTemp, tires.FR.brakeTemp)}°C
          </span>
        </div>
      </div>

    </div>
  );
};
