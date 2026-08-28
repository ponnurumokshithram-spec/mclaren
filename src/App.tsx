import React, { useState } from 'react';
import { useTelemetrySimulation } from './hooks/useTelemetrySimulation';
import { Header } from './components/Header';
import { GaugesCluster } from './components/GaugesCluster';
import { ChassisAeroVisualizer } from './components/ChassisAeroVisualizer';
import { TireWearMonitor } from './components/TireWearMonitor';
import { TrackMap } from './components/TrackMap';
import { PrecisionServiceBay } from './components/PrecisionServiceBay';
import { RaceEngineerAI } from './components/RaceEngineerAI';
import { CarShowcaseModal } from './components/CarShowcaseModal';
import { 
  Flame, 
  Wind, 
  Disc, 
  Activity, 
  Wrench, 
  ShieldCheck, 
  Info, 
  Radio,
  Sparkles
} from 'lucide-react';

export default function App() {
  const {
    selectedCarId,
    setSelectedCarId,
    selectedCircuitId,
    setSelectedCircuitId,
    simMode,
    setSimMode,
    isPaused,
    setIsPaused,
    setup,
    updateSetup,
    triggerPitService,
    setManualInput,
    engine,
    downforce,
    tires,
    gForce,
    track,
    alerts,
    currentCar,
    currentCircuit,
  } = useTelemetrySimulation('mclaren_720lt');

  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'SERVICE' | 'ENGINEER'>('TELEMETRY');

  const scrollToServiceBay = () => {
    setActiveTab('SERVICE');
    const el = document.getElementById('precision-service-bay');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex flex-col font-sans selection:bg-[#FF6600] selection:text-black">
      
      {/* Top Fixed Header with Model & Track Selectors */}
      <Header
        selectedCarId={selectedCarId}
        onSelectCar={setSelectedCarId}
        selectedCircuitId={selectedCircuitId}
        onSelectCircuit={setSelectedCircuitId}
        simMode={simMode}
        onToggleSimMode={setSimMode}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onOpenShowcase={() => setIsShowcaseOpen(true)}
        onOpenServiceBay={scrollToServiceBay}
        inPitBox={setup.inPitBox}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-5">
        
        {/* Quick Vehicle & Circuit Status Ribbon - Geometric Balance */}
        <section id="mclaren-status-ribbon" className="bg-[#121212] border border-[#222222] border-l-4 border-l-[#FF6600] rounded-xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Supercar Thumbnail & Specs */}
            <div className="flex items-center gap-4">
              <div 
                onClick={() => setIsShowcaseOpen(true)}
                className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden border border-[#2C2C2C] cursor-pointer group shadow-lg shrink-0"
              >
                <img
                  src={currentCar.imageSrc}
                  alt={currentCar.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                  <span className="text-[9px] font-mono-race text-white/90 bg-black/80 px-2 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                    VIEW SPECS
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-racing font-bold text-white tracking-wider">
                    {currentCar.name}
                  </h1>
                  <span 
                    className="text-[11px] font-mono-race px-2 py-0.5 rounded-sm font-bold"
                    style={{ backgroundColor: `${currentCar.accentColor}20`, color: currentCar.accentColor, border: `1px solid ${currentCar.accentColor}50` }}
                  >
                    {currentCar.powerHp} PS • {currentCar.topSpeedKmh} KM/H
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono-race mt-0.5">
                  {currentCar.engine} • {currentCar.tagline}
                </p>
                
                <div className="flex items-center gap-3 mt-1.5 text-xs font-mono-race text-gray-300">
                  <span>0-100: <strong className="text-white">{currentCar.acceleration0to100}</strong></span>
                  <span className="text-[#333333]">|</span>
                  <span>WEIGHT: <strong className="text-white">{currentCar.dryWeightKg} KG</strong></span>
                  <span className="text-[#333333]">|</span>
                  <span>AERO: <strong className="text-[#FF6600]">{downforce.wingAngleDeg}° {downforce.airbrakeActive ? 'AIRBRAKE' : 'WING'}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Live Telemetry Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs font-mono-race">
              <div className="bg-[#181818] border border-[#262626] rounded-lg p-2.5 text-center">
                <span className="text-gray-400 block text-[10px] tracking-wider">SPEED</span>
                <span className="text-xl font-racing font-bold text-[#FF6600]">
                  {engine.speedKmh} <span className="text-xs text-gray-400 font-normal">KM/H</span>
                </span>
              </div>

              <div className="bg-[#181818] border border-[#262626] rounded-lg p-2.5 text-center">
                <span className="text-gray-400 block text-[10px] tracking-wider">ENGINE RPM</span>
                <span className="text-xl font-racing font-bold text-white">
                  {engine.rpm}
                </span>
              </div>

              <div className="bg-[#181818] border border-[#262626] rounded-lg p-2.5 text-center">
                <span className="text-gray-400 block text-[10px] tracking-wider">BOOST</span>
                <span className="text-xl font-racing font-bold text-[#00E5FF]">
                  {engine.boostBar.toFixed(2)} <span className="text-xs text-gray-400 font-normal">BAR</span>
                </span>
              </div>

              <div className="bg-[#181818] border border-[#262626] rounded-lg p-2.5 text-center">
                <span className="text-gray-400 block text-[10px] tracking-wider">DOWNFORCE</span>
                <span className="text-xl font-racing font-bold text-emerald-400">
                  {downforce.totalDownforceKg} <span className="text-xs text-gray-400 font-normal">KG</span>
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Primary Racing Gauges Cluster */}
        <section id="telemetry-gauges-section">
          <GaugesCluster
            engine={engine}
            gForce={gForce}
            downforce={downforce}
            simMode={simMode}
            onManualInput={setManualInput}
            accentColor={currentCar.accentColor}
          />
        </section>

        {/* Middle Dual Section: Chassis Aerodynamics Visualizer & Circuit Track Map */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <ChassisAeroVisualizer
              car={currentCar}
              downforce={downforce}
              tires={tires}
              speedKmh={engine.speedKmh}
              brakePct={engine.brakePct}
            />
          </div>

          <div className="lg:col-span-5">
            <TrackMap
              track={track}
              circuit={currentCircuit}
              speedKmh={engine.speedKmh}
            />
          </div>
        </section>

        {/* Tire Wear Degradation & 3-Zone Thermal Analytics */}
        <section id="tire-telemetry-section">
          <TireWearMonitor
            tires={tires}
            tireCompound={setup.tireCompound}
            onTireCompoundChange={(compound) => updateSetup({ tireCompound: compound })}
          />
        </section>

        {/* Lower Dual Section: Precision Service Bay & AI Race Engineer */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <PrecisionServiceBay
              setup={setup}
              car={currentCar}
              onUpdateSetup={updateSetup}
              onTriggerPitService={triggerPitService}
            />
          </div>

          <div className="lg:col-span-5">
            <RaceEngineerAI
              car={currentCar}
              engine={engine}
              tires={tires}
              downforce={downforce}
              alerts={alerts}
              circuitName={currentCircuit.name}
              lapNumber={track.lapNumber}
            />
          </div>
        </section>

      </main>

      {/* Supercar Showcase Modal */}
      <CarShowcaseModal
        isOpen={isShowcaseOpen}
        onClose={() => setIsShowcaseOpen(false)}
        selectedCarId={selectedCarId}
        onSelectCar={setSelectedCarId}
      />

      {/* Footer */}
      <footer className="border-t border-[#222222] bg-[#0A0A0A] py-6 px-4 text-center text-xs font-mono-race text-gray-500 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-racing font-bold text-white tracking-widest">McLAREN AUTOMOTIVE</span>
            <span className="text-[#333333]">|</span>
            <span className="text-[#FF6600]">HIGH PERFORMANCE TRACK TELEMETRY</span>
          </div>
          <div>
            McLaren 625LT Spider & 720LT Supercar Precision Analytics Platform
          </div>
        </div>
      </footer>

    </div>
  );
}
