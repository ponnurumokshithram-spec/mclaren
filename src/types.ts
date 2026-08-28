export type CarId = 'mclaren_720lt' | 'mclaren_625lt_spider';

export type TireCorner = 'FL' | 'FR' | 'RL' | 'RR';

export type TireCompound = 'Trofeo R Slick' | 'P Zero Corsa' | 'P Zero Wet';

export interface TireTelemetry {
  wearPercent: number; // 100 = new, 0 = bald
  tempInner: number;   // °C
  tempCenter: number;  // °C
  tempOuter: number;   // °C
  pressurePsi: number; // PSI
  brakeTemp: number;   // °C (200 - 900)
  slipAngle: number;   // degrees
  loadKg: number;      // load on tire
}

export interface DownforceTelemetry {
  frontDownforceKg: number;
  rearDownforceKg: number;
  totalDownforceKg: number;
  frontBalancePct: number;
  dragCoefficient: number;
  wingAngleDeg: number;
  drsActive: boolean;
  airbrakeActive: boolean;
}

export interface EngineTelemetry {
  rpm: number;
  maxRpm: number;
  speedKmh: number;
  gear: number; // 0 = N, -1 = R, 1-7
  gearRatio: number;
  throttlePct: number;
  brakePct: number;
  steeringAngleDeg: number;
  boostBar: number;
  maxBoostBar: number;
  oilTempC: number;
  coolantTempC: number;
  oilPressureBar: number;
  egtC: number; // Exhaust gas temp
  horsepowerEst: number;
  torqueEstNm: number;
}

export interface GForceTelemetry {
  lateralG: number;
  longitudinalG: number;
  verticalG: number;
  gHistory: Array<{ x: number; y: number; time: number }>;
}

export interface TrackTelemetry {
  circuitId: string;
  circuitName: string;
  circuitLengthMeters: number;
  lapNumber: number;
  currentLapTimeSec: number;
  lastLapTimeSec: number;
  bestLapTimeSec: number;
  currentSector: 1 | 2 | 3;
  sectorTimes: [number, number, number];
  bestSectorTimes: [number, number, number];
  deltaSec: number;
  trackProgressPct: number;
  distanceCoveredMeters: number;
}

export interface PrecisionServiceSetup {
  tireCompound: TireCompound;
  targetPressureFL: number;
  targetPressureFR: number;
  targetPressureRL: number;
  targetPressureRR: number;
  camberFrontDeg: number;
  camberRearDeg: number;
  wingAngleTrimDeg: number;
  brakeBiasFrontPct: number;
  ecuMap: 1 | 2 | 3 | 4; // 1: Eco/Out, 2: Race, 3: Push, 4: Quali Max
  tractionControlMode: 'TRACK' | 'VARIABLE_DRIFT' | 'OFF';
  inPitBox: boolean;
  serviceInProgress: boolean;
  pitActionText: string;
}

export interface CarSpecs {
  id: CarId;
  name: string;
  codename: string;
  tagline: string;
  engine: string;
  displacement: string;
  powerHp: number;
  torqueNm: number;
  redlineRpm: number;
  dryWeightKg: number;
  acceleration0to100: string;
  acceleration0to200: string;
  topSpeedKmh: number;
  aeroFeatures: string[];
  chassisType: string;
  imageSrc: string;
  accentColor: string; // Hex color (e.g., #FF8000 Papaya Orange)
  secondaryColor: string;
}

export interface DiagnosticAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
}
