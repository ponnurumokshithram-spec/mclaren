import React, { useState } from 'react';
import { 
  CarSpecs, 
  EngineTelemetry, 
  TireTelemetry, 
  DownforceTelemetry, 
  DiagnosticAlert 
} from '../types';
import { Radio, Bot, Send, Sparkles, CheckCircle2, AlertTriangle, Terminal, RefreshCw } from 'lucide-react';

interface RaceEngineerAIProps {
  car: CarSpecs;
  engine: EngineTelemetry;
  tires: { FL: TireTelemetry; FR: TireTelemetry; RL: TireTelemetry; RR: TireTelemetry };
  downforce: DownforceTelemetry;
  alerts: DiagnosticAlert[];
  circuitName: string;
  lapNumber: number;
}

export const RaceEngineerAI: React.FC<RaceEngineerAIProps> = ({
  car,
  engine,
  tires,
  downforce,
  alerts,
  circuitName,
  lapNumber,
}) => {
  const [analysisText, setAnalysisText] = useState<string>(
    `[WOKING PIT WALL • TELEMETRY UPLINK ACTIVE]
• Vehicle: ${car.name} (${car.engine})
• Circuit: ${circuitName} (Lap ${lapNumber})
• Powertrain: Boost pressure holding steady at ${engine.boostBar.toFixed(2)} bar. Exhaust gas temperature at ${engine.egtC}°C is within safety parameters.
• Tire Wear & Thermals: Front-Left carcass core at ${tires.FL.tempCenter}°C. Inner shoulder gradient nominal for high-downforce cornering.
• Aerodynamic Trim: Longtail active rear airbrake responding within 50ms transition threshold. Ready for high-speed sector push.`
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<string>('');

  const runAnalysis = async (focusArea: string, customText?: string) => {
    setIsLoading(true);
    try {
      const telemetrySnapshot = {
        vehicle: car.name,
        speedKmh: engine.speedKmh,
        rpm: engine.rpm,
        gear: engine.gear,
        boostBar: engine.boostBar,
        throttlePct: engine.throttlePct,
        brakePct: engine.brakePct,
        downforceKg: downforce.totalDownforceKg,
        wingAngleDeg: downforce.wingAngleDeg,
        airbrakeActive: downforce.airbrakeActive,
        drsActive: downforce.drsActive,
        dragCoefficient: downforce.dragCoefficient,
        tireThermals: {
          FL: `${tires.FL.tempCenter}°C (Wear: ${tires.FL.wearPercent.toFixed(1)}%, Press: ${tires.FL.pressurePsi} PSI)`,
          FR: `${tires.FR.tempCenter}°C (Wear: ${tires.FR.wearPercent.toFixed(1)}%, Press: ${tires.FR.pressurePsi} PSI)`,
          RL: `${tires.RL.tempCenter}°C (Wear: ${tires.RL.wearPercent.toFixed(1)}%, Press: ${tires.RL.pressurePsi} PSI)`,
          RR: `${tires.RR.tempCenter}°C (Wear: ${tires.RR.wearPercent.toFixed(1)}%, Press: ${tires.RR.pressurePsi} PSI)`,
        },
        circuit: circuitName,
        lap: lapNumber,
      };

      const res = await fetch('/api/telemetry/engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carModel: car.id,
          telemetry: telemetrySnapshot,
          focusArea,
          userPrompt: customText || undefined,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisText(data.analysis);
      } else if (data.fallback) {
        setAnalysisText(data.fallback);
      }
    } catch (err: any) {
      console.error('Failed to get race engineer analysis:', err);
      setAnalysisText('[UPLINK WARNING] Real-time telemetry connection to Woking mission control interrupted. Onboard ECU failsafe telemetry active.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;
    runAnalysis('Custom Driver Query', userPrompt);
    setUserPrompt('');
  };

  return (
    <div id="race-engineer-ai" className="bg-[#121212] border border-[#222222] border-l-4 border-l-[#FF6600] rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#FF6600]/15 text-[#FF6600] border border-[#FF6600]/40">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-racing font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
                <span>McLaren Woking Telemetry AI</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-[#FF6600]/15 text-[#FF6600] font-mono-race font-bold border border-[#FF6600]/40">
                  GEMINI 3.7
                </span>
              </h2>
              <p className="text-[11px] font-mono-race text-gray-400">
                Autonomous Pit Wall Diagnostics & Setup Precision Recommendations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
            </span>
            <span className="text-[11px] font-mono-race text-[#00E5FF] font-bold hidden sm:inline">
              LIVE TELEMETRY SYNC
            </span>
          </div>
        </div>

        {/* Quick Diagnostic Query Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[
            { label: 'Tire Asymmetry Analysis', focus: 'Tire thermal gradient and shoulder wear imbalance' },
            { label: 'Aero Trim & DRS Efficiency', focus: 'Downforce front/rear balance and active airbrake efficiency' },
            { label: 'Powertrain & Boost Map', focus: 'Twin-turbo boost pressure stability and EGT exhaust temperature' },
            { label: 'Pit Stint Strategy', focus: 'Tire compound degradation rate and optimal pit window' },
          ].map((chip, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => runAnalysis(chip.focus)}
              className="text-[11px] font-mono-race px-2.5 py-1 rounded-sm bg-[#161616] hover:bg-[#222222] border border-[#262626] hover:border-[#FF6600] text-gray-300 hover:text-[#FF6600] transition-all cursor-pointer disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* AI Output Terminal Box */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-3.5 mb-3 relative overflow-hidden font-mono-race text-xs leading-relaxed text-gray-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#222222] text-[10px] text-gray-500">
            <span className="flex items-center gap-1.5 text-[#FF6600] font-bold">
              <Terminal className="w-3 h-3" />
              <span>TELEMETRY DEBRIEF // PIT WALL STREAM</span>
            </span>
            <span>{new Date().toLocaleTimeString()} UTC</span>
          </div>

          {isLoading ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-[#FF6600]">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-xs">Computing live telemetry vectors via Gemini 3.7...</span>
            </div>
          ) : (
            <div className="whitespace-pre-line text-gray-300 leading-normal">
              {analysisText}
            </div>
          )}
        </div>
      </div>

      {/* Driver Question Input Box */}
      <div>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Ask Woking telemetry engineer (e.g. 'Optimize camber for Copse corner')"
            className="flex-1 bg-[#0D0D0D] border border-[#262626] rounded-md px-3 py-2 text-xs font-mono-race text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6600]"
          />
          <button
            type="submit"
            disabled={isLoading || !userPrompt.trim()}
            className="px-3.5 py-2 rounded-md bg-[#FF6600] hover:bg-[#E65C00] text-black font-racing font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SEND</span>
          </button>
        </form>

        {/* Active Diagnostics Alerts summary */}
        {alerts.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-[#222222] flex items-center justify-between text-[11px] font-mono-race text-gray-400">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>ACTIVE ADVISORY: <strong className="text-gray-300">{alerts[0].title}</strong></span>
            </div>
            <span className="text-gray-500">{alerts[0].timestamp}</span>
          </div>
        )}
      </div>

    </div>
  );
};
