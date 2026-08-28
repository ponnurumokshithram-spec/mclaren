import React, { useState } from 'react';
import { CarId, CarSpecs } from '../types';
import { CAR_MODELS } from '../data/cars';
import { X, Check, Wind, Shield, Zap, ChevronRight, Gauge } from 'lucide-react';

interface CarShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCarId: CarId;
  onSelectCar: (carId: CarId) => void;
}

export const CarShowcaseModal: React.FC<CarShowcaseModalProps> = ({
  isOpen,
  onClose,
  selectedCarId,
  onSelectCar,
}) => {
  const [activeCarId, setActiveCarId] = useState<CarId>(selectedCarId);

  if (!isOpen) return null;

  const current = CAR_MODELS[activeCarId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="car-showcase-modal"
        className="bg-[#121212] border border-[#222222] border-l-4 border-l-[#FF6600] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#222222] sticky top-0 bg-[#121212]/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-[#FF6600] text-black font-racing font-black text-lg flex items-center justify-center shadow-md">
              M
            </div>
            <div>
              <h3 className="text-lg font-racing font-bold text-white tracking-wider">
                McLaren Supercar Engineering & Aero Lineage
              </h3>
              <p className="text-xs font-mono-race text-gray-400">
                Aerodynamic Track Supercars: 720LT and 625LT Spider
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-[#181818] hover:bg-[#222222] border border-[#2A2A2A] text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Car Model Selector Tabs */}
        <div className="flex p-3 bg-[#0D0D0D] border-b border-[#222222] gap-2">
          {Object.values(CAR_MODELS).map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCarId(c.id)}
              className={`flex-1 py-2.5 px-3 rounded-md text-xs sm:text-sm font-racing font-bold tracking-wide transition-all flex items-center justify-center gap-2 border ${
                activeCarId === c.id
                  ? 'bg-[#FF6600] text-black border-[#FF6600] shadow-lg shadow-[#FF6600]/20'
                  : 'bg-[#161616] text-gray-400 border-[#262626] hover:text-white hover:border-[#383838]'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[10px] font-mono-race px-1.5 py-0.5 rounded-sm bg-black/25">
                {c.powerHp} PS
              </span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Sports Car Hero Visual Graphic */}
          <div className="relative rounded-lg overflow-hidden border border-[#262626] shadow-2xl bg-black group">
            <img
              src={current.imageSrc}
              alt={current.name}
              referrerPolicy="no-referrer"
              className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30 flex flex-col justify-end p-4 sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <span className="text-xs uppercase font-mono-race text-[#FF6600] font-bold tracking-widest block mb-1">
                    {current.tagline}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-racing font-black text-white tracking-wide">
                    {current.name}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    onSelectCar(current.id);
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-md text-xs font-racing font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCarId === current.id
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-[#FF6600] hover:bg-[#E65C00] text-black shadow-lg shadow-[#FF6600]/30'
                  }`}
                >
                  {selectedCarId === current.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>CURRENT ACTIVE CAR</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>ACTIVATE IN TELEMETRY</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Key Performance Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono-race">
            <div className="bg-[#161616] border border-[#262626] rounded-lg p-3">
              <span className="text-[10px] text-gray-500 uppercase block tracking-wider">MAX OUTPUT</span>
              <span className="text-xl font-racing font-bold text-white">{current.powerHp} PS</span>
              <span className="text-[10px] text-gray-400 block">{current.torqueNm} Nm Torque</span>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-lg p-3">
              <span className="text-[10px] text-gray-500 uppercase block tracking-wider">0 - 100 KM/H</span>
              <span className="text-xl font-racing font-bold text-[#FF6600]">{current.acceleration0to100}</span>
              <span className="text-[10px] text-gray-400 block">0-200 in {current.acceleration0to200}</span>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-lg p-3">
              <span className="text-[10px] text-gray-500 uppercase block tracking-wider">TOP SPEED</span>
              <span className="text-xl font-racing font-bold text-[#00E5FF]">{current.topSpeedKmh} KM/H</span>
              <span className="text-[10px] text-gray-400 block">{Math.round(current.topSpeedKmh * 0.621371)} MPH</span>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-lg p-3">
              <span className="text-[10px] text-gray-500 uppercase block tracking-wider">DRY WEIGHT</span>
              <span className="text-xl font-racing font-bold text-emerald-400">{current.dryWeightKg} KG</span>
              <span className="text-[10px] text-gray-400 block">Carbon Monocoque</span>
            </div>
          </div>

          {/* Detailed Aerodynamics & Engineering Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Aerodynamic Efficiency Package */}
            <div className="bg-[#161616] border border-[#262626] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-racing font-bold text-[#FF6600] uppercase">
                <Wind className="w-4 h-4 text-[#FF6600]" />
                <span>Active Aerodynamics & Downforce</span>
              </div>
              <ul className="space-y-2 text-xs font-mono-race text-gray-300">
                {current.aeroFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-[#FF6600] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Powertrain & Monocoque */}
            <div className="bg-[#161616] border border-[#262626] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-racing font-bold text-[#00E5FF] uppercase">
                <Shield className="w-4 h-4 text-[#00E5FF]" />
                <span>Chassis & Powertrain Architecture</span>
              </div>
              <div className="space-y-2.5 text-xs font-mono-race">
                <div>
                  <span className="text-gray-500 block text-[10px]">ENGINE CODE:</span>
                  <span className="text-white font-bold">{current.engine}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">DISPLACEMENT:</span>
                  <span className="text-gray-300">{current.displacement} Flat-Plane Crank</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">CHASSIS ARCHITECTURE:</span>
                  <span className="text-gray-300">{current.chassisType}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">TRANSMISSION:</span>
                  <span className="text-gray-300">7-Speed Dual-Clutch SSG Seamless Shift</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#222222] bg-[#0E0E0E] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[#181818] hover:bg-[#222222] border border-[#2A2A2A] text-gray-300 font-racing text-xs tracking-wider cursor-pointer"
          >
            CLOSE
          </button>
          <button
            onClick={() => {
              onSelectCar(current.id);
              onClose();
            }}
            className="px-5 py-2 rounded-md bg-[#FF6600] hover:bg-[#E65C00] text-black font-racing font-bold text-xs tracking-wider cursor-pointer shadow-md"
          >
            SELECT {current.name.toUpperCase()} FOR TELEMETRY
          </button>
        </div>

      </div>
    </div>
  );
};
