import React from 'react';
import { TrackTelemetry } from '../types';
import { CircuitData } from '../data/tracks';
import { MapPin, Timer, TrendingUp, AlertCircle, Compass } from 'lucide-react';

interface TrackMapProps {
  track: TrackTelemetry;
  circuit: CircuitData;
  speedKmh: number;
}

export const TrackMap: React.FC<TrackMapProps> = ({
  track,
  circuit,
  speedKmh,
}) => {
  // Format seconds to mm:ss.ms
  const formatLapTime = (sec: number) => {
    if (!sec || sec <= 0) return '--:--.---';
    const mins = Math.floor(sec / 60);
    const secs = (sec % 60).toFixed(3);
    return `${mins}:${Number(secs) < 10 ? '0' : ''}${secs}`;
  };

  // Find approximate current point coordinates along circuit path
  const numPoints = circuit.points.length;
  const progressRatio = track.trackProgressPct / 100;
  const currentIdx = Math.floor(progressRatio * numPoints);
  const currentPoint = circuit.points[currentIdx % numPoints] || circuit.points[0];
  const nextPoint = circuit.points[(currentIdx + 1) % numPoints] || circuit.points[0];

  const subRatio = (progressRatio * numPoints) - currentIdx;
  const carX = currentPoint.x + (nextPoint.x - currentPoint.x) * subRatio;
  const carY = currentPoint.y + (nextPoint.y - currentPoint.y) * subRatio;

  return (
    <div id="mclaren-track-map" className="bg-[#121212] border border-[#222222] border-l-4 border-l-[#FF6600] rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between">
      
      {/* Header with Circuit Name & Sector Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222222] pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-[#FF6600]/15 text-[#FF6600] border border-[#FF6600]/40">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-racing font-bold text-white tracking-wider uppercase">
              {circuit.name}
            </h2>
            <p className="text-[11px] font-mono-race text-gray-400">
              {circuit.country} • {circuit.lengthMeters}m • {circuit.cornersCount} Turns
            </p>
          </div>
        </div>

        {/* Lap counter badge */}
        <div className="flex items-center gap-2 font-mono-race text-xs">
          <span className="px-2.5 py-1 rounded-sm bg-[#FF6600]/15 text-[#FF6600] border border-[#FF6600]/40 font-bold">
            LAP {track.lapNumber}
          </span>
          <span className={`px-2.5 py-1 rounded-sm font-bold border ${
            track.deltaSec <= 0 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
              : 'bg-red-500/20 text-red-400 border-red-500/40'
          }`}>
            DELTA: {track.deltaSec > 0 ? `+${track.deltaSec.toFixed(2)}` : `${track.deltaSec.toFixed(2)}`}s
          </span>
        </div>
      </div>

      {/* Main Interactive Circuit Map SVG */}
      <div className="relative w-full h-56 sm:h-64 flex items-center justify-center bg-[#0D0D0D] rounded-lg border border-[#222222] p-2 overflow-hidden">
        
        {/* Track Legend */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 text-[10px] font-mono-race text-gray-400 z-10 bg-[#141414]/90 p-2 rounded-sm border border-[#262626]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#00E5FF]" />
            <span>DRS Sector</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Heavy Braking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF6600] border border-white" />
            <span>McLaren Car Position</span>
          </div>
        </div>

        {/* Current Corner Name Overlay */}
        {currentPoint.cornerName && (
          <div className="absolute bottom-2 right-2 text-right bg-[#141414]/90 px-2.5 py-1 rounded-sm border border-[#262626] z-10">
            <span className="text-[9px] font-mono-race text-gray-500 block">APPROACHING</span>
            <span className="text-xs font-racing font-bold text-[#FF6600] tracking-wider uppercase">
              {currentPoint.cornerName}
            </span>
          </div>
        )}

        <svg viewBox="0 0 100 100" className="w-full h-full p-2">
          {/* Circuit Outline */}
          <path
            d={circuit.pathD}
            fill="none"
            stroke="#222222"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Circuit Racing Line */}
          <path
            d={circuit.pathD}
            fill="none"
            stroke="#383838"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* DRS Zones */}
          {circuit.points.filter(p => p.drsZone).map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="2.5"
              fill="#00E5FF"
              opacity="0.9"
            />
          ))}

          {/* Heavy Braking Zones */}
          {circuit.points.filter(p => p.brakeHeavy).map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="2.5"
              fill="#ef4444"
              opacity="0.9"
            />
          ))}

          {/* Start/Finish Line */}
          <line
            x1="18"
            y1="78"
            x2="18"
            y2="86"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="2 1"
          />

          {/* Live McLaren Car Marker */}
          <g transform={`translate(${carX}, ${carY})`}>
            {/* Glowing ripple ring */}
            <circle cx="0" cy="0" r="5" fill="#FF6600" opacity="0.3" className="animate-ping" />
            {/* Core Car dot */}
            <circle cx="0" cy="0" r="3" fill="#FF6600" stroke="#ffffff" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Lap Timing & Sector Split Matrix */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#222222] text-xs font-mono-race text-center">
        <div className="bg-[#161616] p-2.5 rounded-lg border border-[#262626]">
          <span className="text-gray-500 block text-[10px] tracking-wider">CURRENT LAP</span>
          <span className="text-white font-bold text-sm tracking-wider">
            {formatLapTime(track.currentLapTimeSec)}
          </span>
        </div>

        <div className="bg-[#161616] p-2.5 rounded-lg border border-[#262626]">
          <span className="text-gray-500 block text-[10px] tracking-wider">LAST LAP</span>
          <span className="text-gray-300 font-bold text-sm tracking-wider">
            {formatLapTime(track.lastLapTimeSec)}
          </span>
        </div>

        <div className="bg-[#161616] p-2.5 rounded-lg border border-[#262626]">
          <span className="text-[#FF6600] block text-[10px] font-bold tracking-wider">BEST LAP (RECORD)</span>
          <span className="text-[#FF6600] font-bold text-sm tracking-wider">
            {formatLapTime(track.bestLapTimeSec)}
          </span>
        </div>
      </div>

      {/* Sector 1, 2, 3 Split Progress */}
      <div className="mt-2.5 pt-2 border-t border-[#222222] flex items-center justify-between text-xs font-mono-race">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">SECTOR 1:</span>
          <span className="text-emerald-400 font-bold">28.4s</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">SECTOR 2:</span>
          <span className="text-amber-400 font-bold">29.1s</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">SECTOR 3:</span>
          <span className="text-gray-400 font-bold">IN PROGRESS</span>
        </div>
      </div>

    </div>
  );
};
