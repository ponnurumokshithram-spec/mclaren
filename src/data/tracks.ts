export interface TrackPoint {
  x: number; // 0 - 100 relative SVG coordinate
  y: number; // 0 - 100 relative SVG coordinate
  sector: 1 | 2 | 3;
  cornerName?: string;
  targetSpeedKmh: number;
  brakeHeavy?: boolean;
  drsZone?: boolean;
}

export interface CircuitData {
  id: string;
  name: string;
  country: string;
  lengthMeters: number;
  cornersCount: number;
  lapRecord: string;
  idealLapTimeSec: number;
  pathD: string; // SVG path string
  points: TrackPoint[];
}

export const CIRCUITS: Record<string, CircuitData> = {
  silverstone: {
    id: 'silverstone',
    name: 'Silverstone Grand Prix Circuit',
    country: 'United Kingdom',
    lengthMeters: 5891,
    cornersCount: 18,
    lapRecord: '1:27.097 (720LT Track Spec)',
    idealLapTimeSec: 87.2,
    // Scaled SVG Path inside 100x100 viewBox
    pathD: 'M 18,82 L 32,82 C 40,82 45,78 48,72 L 52,65 C 55,60 62,60 68,64 L 75,70 C 82,75 88,72 87,62 L 85,45 C 84,38 78,32 70,33 L 58,35 C 52,36 48,30 52,24 L 56,18 C 60,12 55,8 48,10 L 32,15 C 24,18 20,25 22,34 L 26,48 C 28,54 22,60 16,62 L 12,66 C 8,72 12,82 18,82 Z',
    points: [
      { x: 18, y: 82, sector: 1, cornerName: 'Hamilton Straight', targetSpeedKmh: 305, drsZone: true },
      { x: 35, y: 82, sector: 1, cornerName: 'Abbey (T1)', targetSpeedKmh: 245 },
      { x: 48, y: 72, sector: 1, cornerName: 'Farm Curve (T2)', targetSpeedKmh: 275 },
      { x: 52, y: 65, sector: 1, cornerName: 'Village (T3)', targetSpeedKmh: 98, brakeHeavy: true },
      { x: 68, y: 64, sector: 1, cornerName: 'The Loop (T4)', targetSpeedKmh: 82, brakeHeavy: true },
      { x: 75, y: 70, sector: 1, cornerName: 'Aintree (T5)', targetSpeedKmh: 145 },
      { x: 86, y: 55, sector: 2, cornerName: 'Wellington Straight', targetSpeedKmh: 312, drsZone: true },
      { x: 84, y: 38, sector: 2, cornerName: 'Brooklands (T6)', targetSpeedKmh: 130, brakeHeavy: true },
      { x: 70, y: 33, sector: 2, cornerName: 'Luffield (T7)', targetSpeedKmh: 105 },
      { x: 58, y: 35, sector: 2, cornerName: 'Woodcote (T8)', targetSpeedKmh: 220 },
      { x: 52, y: 24, sector: 2, cornerName: 'Copse (T9)', targetSpeedKmh: 255 },
      { x: 56, y: 18, sector: 3, cornerName: 'Maggotts (T10)', targetSpeedKmh: 290 },
      { x: 48, y: 10, sector: 3, cornerName: 'Becketts (T11-12)', targetSpeedKmh: 235 },
      { x: 32, y: 15, sector: 3, cornerName: 'Chapel (T13)', targetSpeedKmh: 265 },
      { x: 22, y: 34, sector: 3, cornerName: 'Hangar Straight', targetSpeedKmh: 328, drsZone: true },
      { x: 26, y: 48, sector: 3, cornerName: 'Stowe (T15)', targetSpeedKmh: 185, brakeHeavy: true },
      { x: 16, y: 62, sector: 3, cornerName: 'Vale (T16)', targetSpeedKmh: 110, brakeHeavy: true },
      { x: 12, y: 66, sector: 3, cornerName: 'Club (T17-18)', targetSpeedKmh: 165 },
    ]
  },
  spa: {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    lengthMeters: 7004,
    cornersCount: 19,
    lapRecord: '2:14.320 (720LT Aero Pack)',
    idealLapTimeSec: 134.5,
    pathD: 'M 20,80 L 30,82 C 34,83 38,78 35,72 L 32,60 C 35,55 42,52 50,56 L 70,62 C 80,65 88,58 84,48 L 78,35 C 74,28 80,20 86,18 L 82,12 C 72,10 65,16 60,24 L 52,38 C 45,45 35,42 28,34 L 20,22 C 14,15 8,22 10,32 L 14,54 C 16,65 14,75 20,80 Z',
    points: [
      { x: 20, y: 80, sector: 1, cornerName: 'Pit Straight', targetSpeedKmh: 280 },
      { x: 32, y: 60, sector: 1, cornerName: 'La Source (T1)', targetSpeedKmh: 75, brakeHeavy: true },
      { x: 50, y: 56, sector: 1, cornerName: 'Eau Rouge (T2-3)', targetSpeedKmh: 295 },
      { x: 70, y: 62, sector: 1, cornerName: 'Raidillon (T4)', targetSpeedKmh: 285 },
      { x: 84, y: 48, sector: 2, cornerName: 'Kemmel Straight', targetSpeedKmh: 335, drsZone: true },
      { x: 78, y: 35, sector: 2, cornerName: 'Les Combes (T5-6)', targetSpeedKmh: 140, brakeHeavy: true },
      { x: 86, y: 18, sector: 2, cornerName: 'Malmedy (T7)', targetSpeedKmh: 175 },
      { x: 82, y: 12, sector: 2, cornerName: 'Bruxelles (T8)', targetSpeedKmh: 110 },
      { x: 60, y: 24, sector: 2, cornerName: 'Pouhon (T10-11)', targetSpeedKmh: 240 },
      { x: 52, y: 38, sector: 2, cornerName: 'Campus (T12)', targetSpeedKmh: 155 },
      { x: 28, y: 34, sector: 3, cornerName: 'Stavelot (T14-15)', targetSpeedKmh: 210 },
      { x: 20, y: 22, sector: 3, cornerName: 'Blanchimont (T16-17)', targetSpeedKmh: 310 },
      { x: 10, y: 32, sector: 3, cornerName: 'Bus Stop Chicane (T18-19)', targetSpeedKmh: 85, brakeHeavy: true },
    ]
  }
};
