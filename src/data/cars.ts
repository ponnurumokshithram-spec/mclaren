import { CarSpecs } from '../types';

// Importing generated sports car graphics
import img720lt from '../assets/images/mclaren_720lt_track_1787917406517.jpg';
import img625ltSpider from '../assets/images/mclaren_625lt_spider_1787917430581.jpg';
import imgAeroTelemetry from '../assets/images/mclaren_aero_telemetry_1787917448197.jpg';

export { imgAeroTelemetry };

export const CAR_MODELS: Record<string, CarSpecs> = {
  mclaren_720lt: {
    id: 'mclaren_720lt',
    name: 'McLaren 720LT Supercar',
    codename: 'M840T Track Edition',
    tagline: 'Extreme Track Focus & Longtail Aerodynamic Downforce',
    engine: '4.0L M840T Twin-Turbocharged 90° V8',
    displacement: '3,994 cc',
    powerHp: 720,
    torqueNm: 770,
    redlineRpm: 8500,
    dryWeightKg: 1229,
    acceleration0to100: '2.8 s',
    acceleration0to200: '7.8 s',
    topSpeedKmh: 341,
    aeroFeatures: [
      'Active Carbon Fiber Longtail Airbrake with DRS function',
      'Twin front vortex generators & active dive planes',
      'Extended carbon rear diffuser with floor ground effect tunnels',
      '60° maximum airbrake angle for high-speed braking deceleration'
    ],
    chassisType: 'MonoCage II-S Carbon Fiber Monocoque with Titanium Roll Hoop',
    imageSrc: img720lt,
    accentColor: '#FF6600', // McLaren Papaya (Geometric Balance)
    secondaryColor: '#00E5FF', // High-tech Cyan telemetry
  },
  mclaren_625lt_spider: {
    id: 'mclaren_625lt_spider',
    name: 'McLaren 625LT Spider',
    codename: 'M838T Open-Cockpit Track Series',
    tagline: 'Open-Air Track Precision & Longtail Aerodynamic Purity',
    engine: '3.8L M838T Twin-Turbocharged Flat-Plane V8',
    displacement: '3,799 cc',
    powerHp: 625,
    torqueNm: 610,
    redlineRpm: 8500,
    dryWeightKg: 1370,
    acceleration0to100: '3.1 s',
    acceleration0to200: '8.8 s',
    topSpeedKmh: 329,
    aeroFeatures: [
      'Two-piece Retractable Hard Top operating in 17 seconds',
      'Active McLaren Airbrake with high-speed dynamic stabilization',
      'Track-tuned front splitter with integrated high-downforce endplates',
      'ProActive Chassis Control hydraulic roll-damping system'
    ],
    chassisType: 'Carbon Fiber MonoCell with High-Strength Aluminum Subframes',
    imageSrc: img625ltSpider,
    accentColor: '#00A8FF', // Curacao Blue / Track Cyan
    secondaryColor: '#FF8000', // Papaya highlight
  }
};
