import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  CarId, 
  EngineTelemetry, 
  TireTelemetry, 
  DownforceTelemetry, 
  GForceTelemetry, 
  TrackTelemetry, 
  PrecisionServiceSetup,
  DiagnosticAlert 
} from '../types';
import { CAR_MODELS } from '../data/cars';
import { CIRCUITS } from '../data/tracks';

export type SimulationMode = 'AUTO_LAP' | 'MANUAL_PILOT';

const INITIAL_TIRE = (isFront: boolean): TireTelemetry => ({
  wearPercent: 99.4,
  tempInner: 88,
  tempCenter: 90,
  tempOuter: 86,
  pressurePsi: isFront ? 27.2 : 26.5,
  brakeTemp: 320,
  slipAngle: 0,
  loadKg: isFront ? 310 : 340,
});

export function useTelemetrySimulation(initialCarId: CarId = 'mclaren_720lt') {
  const [selectedCarId, setSelectedCarId] = useState<CarId>(initialCarId);
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('silverstone');
  const [simMode, setSimMode] = useState<SimulationMode>('AUTO_LAP');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Precision Setup & Pit Service
  const [setup, setSetup] = useState<PrecisionServiceSetup>({
    tireCompound: 'Trofeo R Slick',
    targetPressureFL: 27.0,
    targetPressureFR: 27.0,
    targetPressureRL: 26.5,
    targetPressureRR: 26.5,
    camberFrontDeg: -3.2,
    camberRearDeg: -2.0,
    wingAngleTrimDeg: 0,
    brakeBiasFrontPct: 56.0,
    ecuMap: 3,
    tractionControlMode: 'TRACK',
    inPitBox: false,
    serviceInProgress: false,
    pitActionText: '',
  });

  // Telemetry states
  const [engine, setEngine] = useState<EngineTelemetry>({
    rpm: 4200,
    maxRpm: 8500,
    speedKmh: 145,
    gear: 3,
    gearRatio: 1.62,
    throttlePct: 75,
    brakePct: 0,
    steeringAngleDeg: 4,
    boostBar: 1.45,
    maxBoostBar: 2.2,
    oilTempC: 104,
    coolantTempC: 93,
    oilPressureBar: 5.4,
    egtC: 840,
    horsepowerEst: 610,
    torqueEstNm: 680,
  });

  const [downforce, setDownforce] = useState<DownforceTelemetry>({
    frontDownforceKg: 185,
    rearDownforceKg: 295,
    totalDownforceKg: 480,
    frontBalancePct: 38.5,
    dragCoefficient: 0.38,
    wingAngleDeg: 18,
    drsActive: false,
    airbrakeActive: false,
  });

  const [tires, setTires] = useState<{ FL: TireTelemetry; FR: TireTelemetry; RL: TireTelemetry; RR: TireTelemetry }>({
    FL: INITIAL_TIRE(true),
    FR: INITIAL_TIRE(true),
    RL: INITIAL_TIRE(false),
    RR: INITIAL_TIRE(false),
  });

  const [gForce, setGForce] = useState<GForceTelemetry>({
    lateralG: 0.45,
    longitudinalG: 0.82,
    verticalG: 1.0,
    gHistory: [],
  });

  const [track, setTrack] = useState<TrackTelemetry>({
    circuitId: 'silverstone',
    circuitName: 'Silverstone Grand Prix Circuit',
    circuitLengthMeters: 5891,
    lapNumber: 3,
    currentLapTimeSec: 42.8,
    lastLapTimeSec: 88.45,
    bestLapTimeSec: 87.21,
    currentSector: 2,
    sectorTimes: [28.4, 29.1, 0],
    bestSectorTimes: [28.2, 28.9, 30.1],
    deltaSec: -0.18,
    trackProgressPct: 48.5,
    distanceCoveredMeters: 2857,
  });

  const [alerts, setAlerts] = useState<DiagnosticAlert[]>([
    {
      id: 'al-1',
      level: 'info',
      title: 'Active Aero Calibrated',
      message: 'Longtail airbrake 60° deployment threshold verified.',
      timestamp: '00:01:14',
    },
    {
      id: 'al-2',
      level: 'info',
      title: 'Pirelli Trofeo R Window',
      message: 'Carcass core temperatures normalized at 90°C.',
      timestamp: '00:02:45',
    }
  ]);

  // Manual inputs
  const manualInputs = useRef({
    throttle: 0,
    brake: 0,
    steer: 0,
    drs: false,
  });

  // Track simulation state references
  const simState = useRef({
    pointIndex: 0,
    progress: 0.485,
    speed: 145,
    gear: 3,
    rpm: 4200,
    lapTime: 42.8,
    lapNumber: 3,
    flWear: 99.4,
    frWear: 99.2,
    rlWear: 99.0,
    rrWear: 98.9,
    flTemp: 88,
    frTemp: 90,
    rlTemp: 87,
    rrTemp: 89,
    gHistory: [] as Array<{ x: number; y: number; time: number }>,
    lastTime: performance.now(),
  });

  // Gear ratio calculation
  const getGearForSpeed = useCallback((speed: number) => {
    if (speed < 70) return 1;
    if (speed < 115) return 2;
    if (speed < 165) return 3;
    if (speed < 215) return 4;
    if (speed < 265) return 5;
    if (speed < 310) return 6;
    return 7;
  }, []);

  const calculateRpm = useCallback((speed: number, gear: number, carMaxRpm: number) => {
    const gearMaxSpeeds = [0, 85, 130, 185, 235, 285, 330, 360];
    const maxSpeedForGear = gearMaxSpeeds[gear] || 360;
    const minSpeedForGear = gear === 1 ? 0 : gearMaxSpeeds[gear - 1] * 0.75;
    const range = maxSpeedForGear - minSpeedForGear;
    const clampedSpeed = Math.max(minSpeedForGear, Math.min(speed, maxSpeedForGear));
    const factor = (clampedSpeed - minSpeedForGear) / Math.max(1, range);
    return Math.floor(3500 + factor * (carMaxRpm - 3500));
  }, []);

  // Keyboard controls for MANUAL_PILOT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (simMode !== 'MANUAL_PILOT') return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        manualInputs.current.throttle = 100;
        manualInputs.current.brake = 0;
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        manualInputs.current.brake = 100;
        manualInputs.current.throttle = 0;
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        manualInputs.current.steer = -20;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        manualInputs.current.steer = 20;
      } else if (e.code === 'Space') {
        manualInputs.current.drs = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (simMode !== 'MANUAL_PILOT') return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        manualInputs.current.throttle = 0;
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        manualInputs.current.brake = 0;
      } else if (['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(e.code)) {
        manualInputs.current.steer = 0;
      } else if (e.code === 'Space') {
        manualInputs.current.drs = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [simMode]);

  // Main simulation tick loop
  useEffect(() => {
    if (isPaused || setup.serviceInProgress) return;

    const interval = setInterval(() => {
      const car = CAR_MODELS[selectedCarId];
      const circuit = CIRCUITS[selectedCircuitId] || CIRCUITS.silverstone;
      const points = circuit.points;
      const s = simState.current;

      const dt = 0.08; // 80ms simulation step

      if (simMode === 'AUTO_LAP') {
        // Calculate progress along track points
        s.progress += (s.speed / 3600) * dt * (3600 / circuit.lengthMeters) * 1.6;
        if (s.progress >= 1) {
          s.progress = 0;
          s.lapNumber += 1;
          s.lapTime = 0;
        } else {
          s.lapTime += dt;
        }

        // Current track segment
        const numPoints = points.length;
        const currentIdx = Math.floor(s.progress * numPoints);
        const targetPt = points[currentIdx % numPoints];
        const nextPt = points[(currentIdx + 1) % numPoints];

        // Target speed & acceleration
        let targetSpeed = targetPt.targetSpeedKmh;
        if (setup.ecuMap === 4) targetSpeed += 12; // Quali mode extra top speed
        if (setup.ecuMap === 1) targetSpeed -= 15; // Fuel save mode

        let throttle = 0;
        let brake = 0;
        let isAirbrake = false;
        let isDrs = !!targetPt.drsZone;

        if (s.speed < targetSpeed - 5) {
          throttle = Math.min(100, Math.floor(80 + (targetSpeed - s.speed) * 1.5));
          brake = 0;
          s.speed += (throttle / 100) * (car.powerHp / 720) * 14 * dt;
        } else if (s.speed > targetSpeed + 8) {
          throttle = 0;
          brake = Math.min(100, Math.floor((s.speed - targetSpeed) * 2.2));
          isAirbrake = brake > 35;
          s.speed -= (brake / 100) * 32 * dt;
        } else {
          throttle = 40;
          brake = 0;
        }

        s.speed = Math.max(40, Math.min(s.speed, car.topSpeedKmh));
        s.gear = getGearForSpeed(s.speed);
        s.rpm = calculateRpm(s.speed, s.gear, car.redlineRpm);

        // Steering and G-Force
        const isCorner = !targetPt.drsZone && targetPt.targetSpeedKmh < 240;
        const steerAngle = isCorner ? (currentIdx % 2 === 0 ? 12 : -14) : (Math.random() * 2 - 1);
        const lateralG = isCorner ? ((s.speed / 100) ** 1.6) * 0.45 * (currentIdx % 2 === 0 ? 1 : -1) : (Math.random() * 0.2 - 0.1);
        const longitudinalG = brake > 0 ? -(brake / 100) * 2.1 : (throttle / 100) * 1.4;

        // Aerodynamics calculation
        const speedRatio = s.speed / 300;
        const baseWingAngle = isDrs ? 0 : (isAirbrake ? 58 : 18 + setup.wingAngleTrimDeg);
        const wingFactor = Math.sin((baseWingAngle * Math.PI) / 180);
        const totalDownforce = Math.round(520 * (speedRatio ** 2) * (0.6 + wingFactor * 0.8));
        const frontDownforce = Math.round(totalDownforce * 0.42);
        const rearDownforce = totalDownforce - frontDownforce;
        const dragCoeff = isDrs ? 0.31 : (isAirbrake ? 0.58 : 0.37 + wingFactor * 0.08);

        // Boost & Engine metrics
        const maxBoost = car.id === 'mclaren_720lt' ? 2.2 : 1.9;
        const boostMultiplier = setup.ecuMap === 4 ? 1.08 : (setup.ecuMap === 1 ? 0.8 : 1.0);
        const currentBoost = throttle > 20 ? ((throttle / 100) * maxBoost * boostMultiplier) : 0.2;
        const hpEst = Math.round((car.powerHp * (s.rpm / car.redlineRpm) * (throttle / 100) * 0.95) + 60);
        const torqueEst = Math.round(car.torqueNm * (currentBoost / maxBoost) * (throttle / 100) + 90);

        // Tire thermals & wear dynamics
        // Left tires take more wear/heat in right corners
        const leftLoad = lateralG > 0 ? 1.4 : 0.8;
        const rightLoad = lateralG < 0 ? 1.4 : 0.8;
        const brakingHeat = (brake / 100) * 15;
        const corneringHeat = Math.abs(lateralG) * 4;

        s.flWear = Math.max(10, s.flWear - (Math.abs(lateralG) * leftLoad + brake * 0.01) * 0.002);
        s.frWear = Math.max(10, s.frWear - (Math.abs(lateralG) * rightLoad + brake * 0.01) * 0.002);
        s.rlWear = Math.max(10, s.rlWear - (throttle * 0.01 + leftLoad * 0.5) * 0.002);
        s.rrWear = Math.max(10, s.rrWear - (throttle * 0.01 + rightLoad * 0.5) * 0.002);

        s.flTemp = Math.min(125, Math.max(75, s.flTemp + (brakingHeat + corneringHeat * leftLoad - 0.4) * dt));
        s.frTemp = Math.min(125, Math.max(75, s.frTemp + (brakingHeat + corneringHeat * rightLoad - 0.4) * dt));
        s.rlTemp = Math.min(120, Math.max(75, s.rlTemp + (throttle * 0.05 + corneringHeat * leftLoad - 0.3) * dt));
        s.rrTemp = Math.min(120, Math.max(75, s.rrTemp + (throttle * 0.05 + corneringHeat * rightLoad - 0.3) * dt));

        // Update G-Force history for G-G diagram
        s.gHistory.push({ x: lateralG, y: longitudinalG, time: Date.now() });
        if (s.gHistory.length > 40) s.gHistory.shift();

        // Sector identification
        const sector = targetPt.sector;
        const delta = Number((Math.sin(s.progress * Math.PI * 4) * 0.35).toFixed(2));

        // State batch update
        setEngine({
          rpm: Math.round(s.rpm),
          maxRpm: car.redlineRpm,
          speedKmh: Math.round(s.speed),
          gear: s.gear,
          gearRatio: Number((4.5 / s.gear).toFixed(2)),
          throttlePct: throttle,
          brakePct: brake,
          steeringAngleDeg: Number(steerAngle.toFixed(1)),
          boostBar: Number(currentBoost.toFixed(2)),
          maxBoostBar: maxBoost * boostMultiplier,
          oilTempC: Math.round(102 + (s.rpm / car.redlineRpm) * 12),
          coolantTempC: Math.round(91 + (s.speed / 300) * 6),
          oilPressureBar: Number((4.6 + (s.rpm / 8500) * 1.8).toFixed(1)),
          egtC: Math.round(760 + (throttle / 100) * 190),
          horsepowerEst: hpEst,
          torqueEstNm: torqueEst,
        });

        setDownforce({
          frontDownforceKg: frontDownforce,
          rearDownforceKg: rearDownforce,
          totalDownforceKg: totalDownforce,
          frontBalancePct: Number(((frontDownforce / Math.max(1, totalDownforce)) * 100).toFixed(1)),
          dragCoefficient: Number(dragCoeff.toFixed(2)),
          wingAngleDeg: baseWingAngle,
          drsActive: isDrs,
          airbrakeActive: isAirbrake,
        });

        setGForce({
          lateralG: Number(lateralG.toFixed(2)),
          longitudinalG: Number(longitudinalG.toFixed(2)),
          verticalG: Number((1.0 + (totalDownforce / 1000) * 0.3).toFixed(2)),
          gHistory: [...s.gHistory],
        });

        setTires({
          FL: {
            wearPercent: Number(s.flWear.toFixed(1)),
            tempInner: Math.round(s.flTemp - 2),
            tempCenter: Math.round(s.flTemp),
            tempOuter: Math.round(s.flTemp + (lateralG > 0 ? 5 : -2)),
            pressurePsi: Number((setup.targetPressureFL + (s.flTemp - 80) * 0.07).toFixed(1)),
            brakeTemp: Math.round(300 + brake * 5.2),
            slipAngle: Number((Math.abs(lateralG) * 2.2).toFixed(1)),
            loadKg: Math.round(310 + (longitudinalG < 0 ? Math.abs(longitudinalG) * 120 : 0) + (lateralG > 0 ? lateralG * 90 : 0)),
          },
          FR: {
            wearPercent: Number(s.frWear.toFixed(1)),
            tempInner: Math.round(s.frTemp - 2),
            tempCenter: Math.round(s.frTemp),
            tempOuter: Math.round(s.frTemp + (lateralG < 0 ? 5 : -2)),
            pressurePsi: Number((setup.targetPressureFR + (s.frTemp - 80) * 0.07).toFixed(1)),
            brakeTemp: Math.round(300 + brake * 5.2),
            slipAngle: Number((Math.abs(lateralG) * 2.2).toFixed(1)),
            loadKg: Math.round(310 + (longitudinalG < 0 ? Math.abs(longitudinalG) * 120 : 0) + (lateralG < 0 ? Math.abs(lateralG) * 90 : 0)),
          },
          RL: {
            wearPercent: Number(s.rlWear.toFixed(1)),
            tempInner: Math.round(s.rlTemp - 1),
            tempCenter: Math.round(s.rlTemp + 1),
            tempOuter: Math.round(s.rlTemp + (lateralG > 0 ? 4 : -1)),
            pressurePsi: Number((setup.targetPressureRL + (s.rlTemp - 80) * 0.07).toFixed(1)),
            brakeTemp: Math.round(260 + brake * 3.8),
            slipAngle: Number((Math.abs(lateralG) * 1.8).toFixed(1)),
            loadKg: Math.round(340 + (longitudinalG > 0 ? longitudinalG * 140 : 0) + (lateralG > 0 ? lateralG * 95 : 0)),
          },
          RR: {
            wearPercent: Number(s.rrWear.toFixed(1)),
            tempInner: Math.round(s.rrTemp - 1),
            tempCenter: Math.round(s.rrTemp + 1),
            tempOuter: Math.round(s.rrTemp + (lateralG < 0 ? 4 : -1)),
            pressurePsi: Number((setup.targetPressureRR + (s.rrTemp - 80) * 0.07).toFixed(1)),
            brakeTemp: Math.round(260 + brake * 3.8),
            slipAngle: Number((Math.abs(lateralG) * 1.8).toFixed(1)),
            loadKg: Math.round(340 + (longitudinalG > 0 ? longitudinalG * 140 : 0) + (lateralG < 0 ? Math.abs(lateralG) * 95 : 0)),
          }
        });

        setTrack(prev => ({
          ...prev,
          circuitId: circuit.id,
          circuitName: circuit.name,
          circuitLengthMeters: circuit.lengthMeters,
          lapNumber: s.lapNumber,
          currentLapTimeSec: Number(s.lapTime.toFixed(2)),
          currentSector: sector,
          deltaSec: delta,
          trackProgressPct: Number((s.progress * 100).toFixed(1)),
          distanceCoveredMeters: Math.round(s.progress * circuit.lengthMeters),
        }));

        // Dynamic alert conditions
        if (s.flTemp > 115 || s.frTemp > 115) {
          setAlerts(prev => {
            if (prev.some(a => a.id === 'tire-overheat')) return prev;
            return [{
              id: 'tire-overheat',
              level: 'warning',
              title: 'Front Tire Thermal Warning',
              message: 'Carcass core exceeded 115°C. Blistering risk on right shoulder.',
              timestamp: new Date().toLocaleTimeString(),
            }, ...prev];
          });
        }
      } else {
        // MANUAL_PILOT mode
        const inp = manualInputs.current;
        if (inp.throttle > 0) {
          s.speed = Math.min(car.topSpeedKmh, s.speed + (inp.throttle / 100) * 18 * dt);
        } else if (inp.brake > 0) {
          s.speed = Math.max(0, s.speed - (inp.brake / 100) * 38 * dt);
        } else {
          s.speed = Math.max(0, s.speed - 6 * dt);
        }

        s.gear = getGearForSpeed(s.speed);
        s.rpm = calculateRpm(s.speed, s.gear, car.redlineRpm);
        const isAirbrake = inp.brake > 40;
        const wingAngle = inp.drs ? 0 : (isAirbrake ? 60 : 20);

        setEngine(prev => ({
          ...prev,
          speedKmh: Math.round(s.speed),
          rpm: Math.round(s.rpm),
          gear: s.gear,
          throttlePct: inp.throttle,
          brakePct: inp.brake,
          steeringAngleDeg: inp.steer,
          boostBar: Number(((inp.throttle / 100) * 2.2).toFixed(2)),
        }));

        setDownforce(prev => ({
          ...prev,
          wingAngleDeg: wingAngle,
          airbrakeActive: isAirbrake,
          drsActive: inp.drs,
        }));
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isPaused, selectedCarId, selectedCircuitId, simMode, setup, getGearForSpeed, calculateRpm]);

  // Execute Pit Stop Action
  const triggerPitService = useCallback((action: 'FULL_SERVICE' | 'TIRES_ONLY' | 'AERO_TUNE') => {
    setSetup(prev => ({
      ...prev,
      inPitBox: true,
      serviceInProgress: true,
      pitActionText: action === 'FULL_SERVICE' ? 'CHANGING PIRELLI TIRES & REFLASHING ECU...' : (action === 'TIRES_ONLY' ? 'FITTING FRESH TROFEO R COMPOUND...' : 'TRIMMING CARBON AERO FLAPS...')
    }));

    setTimeout(() => {
      simState.current.flWear = 100;
      simState.current.frWear = 100;
      simState.current.rlWear = 100;
      simState.current.rrWear = 100;
      simState.current.flTemp = 85;
      simState.current.frTemp = 85;
      simState.current.rlTemp = 85;
      simState.current.rrTemp = 85;

      setSetup(prev => ({
        ...prev,
        inPitBox: false,
        serviceInProgress: false,
        pitActionText: 'PIT SERVICE COMPLETE - RELEASE TO TRACK'
      }));

      setAlerts(prev => [{
        id: `pit-${Date.now()}`,
        level: 'info',
        title: 'Pit Service Executed',
        message: 'Fresh Pirelli tires installed, pressures reset to baseline.',
        timestamp: new Date().toLocaleTimeString(),
      }, ...prev]);
    }, 2500);
  }, []);

  // Update setup parameters
  const updateSetup = useCallback((updates: Partial<PrecisionServiceSetup>) => {
    setSetup(prev => ({ ...prev, ...updates }));
  }, []);

  // Manual control setters for buttons
  const setManualInput = useCallback((key: 'throttle' | 'brake' | 'steer' | 'drs', val: any) => {
    manualInputs.current[key] = val;
  }, []);

  return {
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
    currentCar: CAR_MODELS[selectedCarId],
    currentCircuit: CIRCUITS[selectedCircuitId] || CIRCUITS.silverstone,
  };
}
