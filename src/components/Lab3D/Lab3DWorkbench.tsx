import React, { useState, useEffect } from 'react';
import { Lab3DScene } from './Lab3DScene';
import { REAGENTS, MILK_SAMPLES, ASSAY_PROTOCOLS } from '../../data/labData';
import { MilkSample, Reagent, AssayProtocol, TestResultRecord } from '../../types/lab';
import { 
  FlaskConical, 
  Flame, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Layers, 
  HelpCircle,
  Sparkles,
  Camera,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Lab3DWorkbenchProps {
  initialAssayId?: string;
  onSaveToBatchLog: (record: TestResultRecord) => void;
  onNavigateToAssays: () => void;
}

export const Lab3DWorkbench: React.FC<Lab3DWorkbenchProps> = ({
  initialAssayId,
  onSaveToBatchLog,
  onNavigateToAssays,
}) => {
  // Modes: 'guided' | 'sandbox' | 'mystery'
  const [labMode, setLabMode] = useState<'guided' | 'sandbox' | 'mystery'>('guided');
  
  // Active assay protocol for guided mode
  const [activeAssay, setActiveAssay] = useState<AssayProtocol>(
    ASSAY_PROTOCOLS.find((a) => a.id === initialAssayId) || ASSAY_PROTOCOLS[0]
  );

  // Active milk sample
  const [selectedSample, setSelectedSample] = useState<MilkSample>(() => {
    if (labMode === 'guided') {
      const match = MILK_SAMPLES.find((s) => s.adulterant === activeAssay.targetAdulterant);
      return match || MILK_SAMPLES[1];
    }
    return MILK_SAMPLES[0];
  });

  // Test tube state
  const [hasMilkInTube, setHasMilkInTube] = useState<boolean>(false);
  const [reagentsInTube, setReagentsInTube] = useState<string[]>([]);
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [heatingProgress, setHeatingProgress] = useState<number>(0);
  const [hasBeenHeated, setHasBeenHeated] = useState<boolean>(false);
  const [guidedStepIndex, setGuidedStepIndex] = useState<number>(0);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'tube' | 'reagents' | 'heater'>('overview');
  const [inspectorNotes, setInspectorNotes] = useState<string>('');
  const [hasLoggedResult, setHasLoggedResult] = useState<boolean>(false);

  // Update sample when changing assay in guided mode
  useEffect(() => {
    if (labMode === 'guided') {
      const match = MILK_SAMPLES.find((s) => s.adulterant === activeAssay.targetAdulterant);
      if (match) setSelectedSample(match);
      resetTubeState();
    }
  }, [activeAssay, labMode]);

  // Handle mystery mode randomization
  useEffect(() => {
    if (labMode === 'mystery') {
      const adulterated = MILK_SAMPLES.filter((s) => s.id !== 'sample_pure' && s.id !== 'sample_mystery');
      const randomPicked = adulterated[Math.floor(Math.random() * adulterated.length)];
      setSelectedSample({
        ...MILK_SAMPLES[7], // mystery base
        adulterant: randomPicked.adulterant,
      });
      resetTubeState();
    }
  }, [labMode]);

  const resetTubeState = () => {
    setHasMilkInTube(false);
    setReagentsInTube([]);
    setIsHeating(false);
    setHeatingProgress(0);
    setHasBeenHeated(false);
    setGuidedStepIndex(0);
    setHasLoggedResult(false);
    setInspectorNotes('');
  };

  // Determine Chemical Reaction State
  const evaluateReaction = () => {
    if (!hasMilkInTube) {
      return {
        color: '#f8fafc',
        volume: 0,
        status: 'empty',
        observation: 'Test tube is clean and empty. Transfer milk sample to begin assay.',
        equation: '',
        verdict: 'Pending Sample',
        isPositive: false,
      };
    }

    const adulterant = selectedSample.adulterant;
    const hasIodine = reagentsInTube.includes('iodine');
    const hasPhenol = reagentsInTube.includes('phenolphthalein');
    const hasDMAB = reagentsInTube.includes('dmab');
    const hasFeCl3 = reagentsInTube.includes('fecl3');
    const hasH2SO4 = reagentsInTube.includes('conc_h2so4');
    const hasResorcinol = reagentsInTube.includes('resorcinol');
    const hasHCl = reagentsInTube.includes('conc_hcl');
    const hasRosalic = reagentsInTube.includes('rosalic_acid');

    // 1. STARCH + IODINE
    if (hasIodine) {
      if (adulterant === 'starch') {
        return {
          color: '#1e1b4b', // deep indigo blue
          volume: 0.65,
          status: 'positive',
          observation: 'POSITIVE: Intense deep indigo blue-black complex observed! Amylose-polyiodide inclusion confirmed.',
          equation: 'I₂ + KI + Amylose Helix → [Amylose · I₅⁻] (Intense Blue Complex)',
          verdict: 'Adulterated (Starch Present)',
          isPositive: true,
        };
      } else {
        return {
          color: '#fef3c7', // pale yellow iodine in milk
          volume: 0.6,
          status: 'negative',
          observation: 'NEGATIVE: Faint yellowish iodine wash. No blue-black amylose helix formed.',
          equation: 'Milk Casein/Lipids + I₂ → Light Cream Yellow (No Starch)',
          verdict: 'Pure Milk (No Starch)',
          isPositive: false,
        };
      }
    }

    // 2. DETERGENT + PHENOLPHTHALEIN
    if (hasPhenol) {
      if (adulterant === 'detergent') {
        return {
          color: '#ec4899', // bright magenta pink
          volume: 0.6,
          status: 'positive',
          observation: 'POSITIVE: Intense rose magenta coloration! Alkaline surfactant compounds detected (pH > 9.5).',
          equation: 'Alkaline LAS Surfactant + Phenolphthalein → Pink Quinoid Dianion (C₂₀H₁₂O₄²⁻)',
          verdict: 'Adulterated (Toxic Detergent)',
          isPositive: true,
        };
      } else {
        return {
          color: '#f8fafc', // remains milk white
          volume: 0.55,
          status: 'negative',
          observation: 'NEGATIVE: Milk retains natural white hue. pH is within normal physiological range (6.6 - 6.8).',
          equation: 'Fresh Bovine Milk (pH 6.6) + Phenolphthalein → Colorless Lactone Form',
          verdict: 'Pure Milk (Normal pH)',
          isPositive: false,
        };
      }
    }

    // 3. UREA + DMAB
    if (hasDMAB) {
      if (adulterant === 'urea') {
        return {
          color: '#eab308', // canary yellow / amber
          volume: 0.7,
          status: 'positive',
          observation: 'POSITIVE: Deep canary yellow / golden amber chromophore! High synthetic urea concentration confirmed.',
          equation: 'Urea + p-DMAB (HCl) → 4-Dimethylaminobenzylidene Urea (Golden Yellow)',
          verdict: 'Adulterated (Synthetic Urea)',
          isPositive: true,
        };
      } else {
        return {
          color: '#fef08a', // faint pale buff
          volume: 0.65,
          status: 'negative',
          observation: 'NEGATIVE: Pale buff/cream coloration. Endogenous urea levels are below legal limit (<700 ppm).',
          equation: 'Low Physiological NPN + DMAB → Faint Buff Background',
          verdict: 'Pure Milk (Standard Urea)',
          isPositive: false,
        };
      }
    }

    // 4. FORMALIN + FeCl3 + H2SO4
    if (hasFeCl3 && hasH2SO4) {
      if (adulterant === 'formalin') {
        return {
          color: '#7e22ce', // vivid violet/purple ring
          volume: 0.8,
          status: 'positive',
          observation: 'POSITIVE: Striking violet-purple chromogenic ring formed at acid-milk interface! Formalin confirmed.',
          equation: 'HCHO + Casein Tryptophan + Fe³⁺ + H₂SO₄ → Condensed Violet Ring at Interface',
          verdict: 'Adulterated (Carcinogenic Formalin)',
          isPositive: true,
        };
      } else {
        return {
          color: '#78716c', // muddy brownish/greenish ring
          volume: 0.75,
          status: 'negative',
          observation: 'NEGATIVE: Interface shows brown acid-protein charring with zero violet ring development.',
          equation: 'Casein + H₂SO₄ → Brown Charring Phase (No Formaldehyde)',
          verdict: 'Pure Milk (No Formalin)',
          isPositive: false,
        };
      }
    }

    // 5. SUCROSE + RESORCINOL + HCL (Requires Boiling)
    if (hasResorcinol && hasHCl) {
      if (hasBeenHeated) {
        if (adulterant === 'sucrose') {
          return {
            color: '#b91c1c', // deep ruby red
            volume: 0.7,
            status: 'positive',
            observation: 'POSITIVE: Intense ruby-crimson red coloration upon boiling! Fructose dehydration to HMF confirmed.',
            equation: 'Sucrose + HCl + Heat → HMF + Resorcinol → Cherry-Red Xanthene Dye',
            verdict: 'Adulterated (Commercial Sucrose)',
            isPositive: true,
          };
        } else {
          return {
            color: '#fed7aa', // faint light brown / pale peach
            volume: 0.65,
            status: 'negative',
            observation: 'NEGATIVE: Solution remains pale cream-peach after boiling. Lactose does not yield red condensation dye.',
            equation: 'Lactose + Resorcinol + Heat → Faint Peach / Cream (No Sucrose)',
            verdict: 'Pure Milk (No Cane Sugar)',
            isPositive: false,
          };
        }
      } else {
        return {
          color: '#f8fafc',
          volume: 0.65,
          status: 'in_progress',
          observation: 'Reagents added! Seliwanoff reaction requires heating to 95°C in the water bath to activate.',
          equation: 'Sucrose + Resorcinol + HCl → Activation Requires Thermal Boiling',
          verdict: 'Awaiting Heating',
          isPositive: false,
        };
      }
    }

    // 6. NEUTRALIZER + ROSALIC ACID
    if (hasRosalic) {
      if (adulterant === 'neutralizer') {
        return {
          color: '#e11d48', // rose-red
          volume: 0.65,
          status: 'positive',
          observation: 'POSITIVE: Intense rose-red coloration developed! Carbonates / caustic soda detected.',
          equation: 'Rosalic Acid + NaHCO₃ / NaOH → Rose-Red Aurin Salt Complex',
          verdict: 'Adulterated (Neutralizers/Soda)',
          isPositive: true,
        };
      } else {
        return {
          color: '#ea580c', // brownish-orange
          volume: 0.6,
          status: 'negative',
          observation: 'NEGATIVE: Solution turns brownish-orange. Natural fresh milk acidity confirmed.',
          equation: 'Rosalic Acid in Lactic Acid Buffered Milk → Orange-Brown Neutral Complex',
          verdict: 'Pure Milk (Unneutralized)',
          isPositive: false,
        };
      }
    }

    // Milk alone with partial reagents
    return {
      color: '#ffffff',
      volume: 0.5,
      status: 'milk_added',
      observation: `Milk sample loaded (5 mL). Ready for reagent addition.`,
      equation: 'Fresh raw milk containing 87.5% H₂O, 4.2% butterfat, 3.4% casein, 4.8% lactose.',
      verdict: 'Ready for Reagents',
      isPositive: false,
    };
  };

  const reaction = evaluateReaction();

  // Handle adding milk
  const handleAddMilk = () => {
    if (!hasMilkInTube) {
      setHasMilkInTube(true);
      if (labMode === 'guided' && guidedStepIndex === 0) {
        setGuidedStepIndex(1);
      }
    }
  };

  // Handle adding reagent
  const handleSelectReagent = (reagent: Reagent) => {
    if (!hasMilkInTube) {
      // Must add milk first
      setHasMilkInTube(true);
    }
    if (!reagentsInTube.includes(reagent.id)) {
      const nextReagents = [...reagentsInTube, reagent.id];
      setReagentsInTube(nextReagents);

      // Check guided steps
      if (labMode === 'guided') {
        const curStep = activeAssay.steps[guidedStepIndex];
        if (curStep && curStep.actionRequired === 'add_reagent' && curStep.targetReagentId === reagent.id) {
          setGuidedStepIndex((prev) => Math.min(prev + 1, activeAssay.steps.length - 1));
        }
      }
    }
  };

  // Handle heating
  const handleHeatSample = () => {
    if (isHeating || !hasMilkInTube) return;
    setIsHeating(true);
    setCameraPreset('heater');
    setHeatingProgress(0);

    const interval = setInterval(() => {
      setHeatingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsHeating(false);
          setHasBeenHeated(true);
          setCameraPreset('tube');

          // Check guided step
          if (labMode === 'guided') {
            const curStep = activeAssay.steps[guidedStepIndex];
            if (curStep && curStep.actionRequired === 'heat_sample') {
              setGuidedStepIndex((p) => Math.min(p + 1, activeAssay.steps.length - 1));
            }
          }

          // Trigger celebratory confetti if positive adulteration detected
          if (selectedSample.isAdulterated) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
            });
          }
          return 100;
        }
        return prev + 20;
      });
    }, 600);
  };

  // Save current test into Batch Quality Inspection Log
  const handleLogRecord = () => {
    const isAdulterated = reaction.isPositive;
    const newRecord: TestResultRecord = {
      id: `REC-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sampleId: selectedSample.id,
      sampleName: selectedSample.name,
      sampleBatch: `BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      assayId: activeAssay.id,
      assayName: activeAssay.title,
      testedAdulterant: activeAssay.targetAdulterant.toUpperCase(),
      resultStatus: isAdulterated ? 'Positive (Adulterated)' : 'Negative (Pure)',
      colorObserved: `${reaction.color} (${reaction.verdict})`,
      reactionNotes: inspectorNotes || reaction.observation,
      testedBy: 'Senior Milk Quality Analyst',
      safetyRating: isAdulterated ? 'Hazardous' : 'Safe',
    };

    onSaveToBatchLog(newRecord);
    setHasLoggedResult(true);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.8 },
    });
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Top Laboratory Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Lab Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setLabMode('guided');
              resetTubeState();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              labMode === 'guided'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Guided Assay Mode
          </button>
          <button
            type="button"
            onClick={() => {
              setLabMode('sandbox');
              resetTubeState();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              labMode === 'sandbox'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sandbox Exploration
          </button>
          <button
            type="button"
            onClick={() => {
              setLabMode('mystery');
              resetTubeState();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
              labMode === 'mystery'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Mystery Blind Challenge
          </button>
        </div>

        {/* Camera Preset Toolbar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline font-mono">Camera:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setCameraPreset('overview')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                cameraPreset === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setCameraPreset('tube')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                cameraPreset === 'tube' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Test Tube
            </button>
            <button
              type="button"
              onClick={() => setCameraPreset('reagents')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                cameraPreset === 'reagents' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Reagents
            </button>
            <button
              type="button"
              onClick={() => setCameraPreset('heater')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                cameraPreset === 'heater' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Water Bath
            </button>
          </div>

          {/* Toggle Labels */}
          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
              showLabels
                ? 'bg-sky-50 text-sky-700 border-sky-200'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showLabels ? 'Labels On' : 'Labels Off'}</span>
          </button>

          {/* Clean / Reset Tube */}
          <button
            type="button"
            onClick={resetTubeState}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clean Tube</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: 3D Virtual Bench (7 Cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* 3D Scene Viewport */}
          <div className="relative w-full h-[540px] sm:h-[600px]">
            <Lab3DScene
              currentSample={selectedSample}
              currentReagentsInTube={reagentsInTube}
              hasMilkInTube={hasMilkInTube}
              tubeFluidColor={reaction.color}
              tubeFluidVolume={reaction.volume}
              isHeating={isHeating}
              heatingProgress={heatingProgress}
              onSelectReagent={handleSelectReagent}
              onAddMilk={handleAddMilk}
              onHeatSample={handleHeatSample}
              onResetTube={resetTubeState}
              showLabels={showLabels}
              cameraPreset={cameraPreset}
            />

            {/* Quick Pipette Drawer Bar over 3D bottom */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 text-white z-10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddMilk}
                  className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
                  <span>Pipette 5 mL Milk</span>
                </button>
                <button
                  type="button"
                  onClick={handleHeatSample}
                  disabled={isHeating || !hasMilkInTube}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all ${
                    isHeating
                      ? 'bg-rose-600 text-white animate-pulse cursor-wait'
                      : 'bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-40 disabled:hover:bg-amber-600'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{isHeating ? `Boiling (${Math.round(heatingProgress)}%)...` : 'Boil in 95°C Bath'}</span>
                </button>
              </div>

              {/* Status pill in footer */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Tube:</span>
                <span className="text-sky-300">
                  {hasMilkInTube ? 'Milk Added' : 'Empty'}
                  {reagentsInTube.length > 0 && ` + ${reagentsInTube.length} Reagent(s)`}
                  {hasBeenHeated && ' (Boiled)'}
                </span>
              </div>
            </div>
          </div>

          {/* Reagents Quick-Dispense Strip */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="font-semibold text-slate-700">REAGENT SHELF QUICK DISPENSE</span>
              <span>Click bottle or button below to pipette into tube</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REAGENTS.map((reagent) => {
                const isSelected = reagentsInTube.includes(reagent.id);
                return (
                  <button
                    key={reagent.id}
                    type="button"
                    onClick={() => handleSelectReagent(reagent)}
                    className={`p-2.5 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-400/30'
                        : 'bg-slate-50/50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 border border-black/10 shadow-sm"
                      style={{ backgroundColor: reagent.fluidColor }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {reagent.name.split(' (')[0]}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        {reagent.chemicalFormula}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Protocol Instructions, Chemical Mechanism & Verification (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Sample Selector Card */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 font-mono">TEST SPECIMEN</span>
              <span className="text-xs text-slate-500">
                {selectedSample.isAdulterated ? 'Specimen Spiked' : 'Control Specimen'}
              </span>
            </div>

            {labMode !== 'mystery' ? (
              <select
                aria-label="Select milk sample"
                value={selectedSample.id}
                onChange={(e) => {
                  const s = MILK_SAMPLES.find((item) => item.id === e.target.value);
                  if (s) {
                    setSelectedSample(s);
                    resetTubeState();
                  }
                }}
                className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {MILK_SAMPLES.filter((s) => s.id !== 'sample_mystery').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Mystery Blind Specimen Active
                </div>
                <p className="mt-1 text-slate-600 text-[11px]">
                  Origin concealed. Run iodine, phenolphthalein, DMAB, or formalin tests to identify the illicit contaminant!
                </p>
              </div>
            )}

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col gap-1">
              <div className="text-slate-900 font-medium">{selectedSample.origin}</div>
              <div className="text-slate-500 text-[11px]">{selectedSample.description}</div>
              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600 mt-1">
                <span>Fat: {selectedSample.fatContent}%</span>
                <span>SNF: {selectedSample.snfContent}%</span>
              </div>
            </div>
          </div>

          {/* Guided Protocol Steps (If in Guided Mode) */}
          {labMode === 'guided' && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 font-mono">FSSAI PROTOCOL</span>
                <button
                  type="button"
                  onClick={onNavigateToAssays}
                  className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                >
                  Change Assay
                </button>
              </div>

              <div className="text-sm font-semibold text-slate-900">{activeAssay.title}</div>
              <p className="text-xs text-slate-600">{activeAssay.purpose}</p>

              {/* Steps List */}
              <div className="flex flex-col gap-2 mt-1">
                {activeAssay.steps.map((st, i) => {
                  const isDone = i < guidedStepIndex;
                  const isCurrent = i === guidedStepIndex;
                  return (
                    <div
                      key={st.stepNumber}
                      className={`p-2.5 rounded-lg border text-xs transition-all ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 text-slate-700'
                          : isCurrent
                          ? 'bg-sky-50 border-sky-300 text-slate-900 ring-1 ring-sky-300'
                          : 'bg-slate-50/50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-1.5">
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-mono">
                              {st.stepNumber}
                            </span>
                          )}
                          Step {st.stepNumber}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] text-sky-700 font-mono uppercase bg-sky-100 px-1.5 py-0.5 rounded">
                            Action Needed
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-slate-700 font-medium">{st.instruction}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{st.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reaction Results & Colorimetric Reading */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 font-mono">ASSAY VERDICT</span>
              <span
                className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                  reaction.status === 'positive'
                    ? 'bg-rose-100 text-rose-800'
                    : reaction.status === 'negative'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {reaction.verdict}
              </span>
            </div>

            {/* Reaction Color Sample Swatch */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div
                className="w-10 h-10 rounded-lg border border-black/10 shadow-inner shrink-0"
                style={{ backgroundColor: reaction.color }}
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-900 font-mono">
                  Colorimeter Hex: {reaction.color}
                </span>
                <span className="text-[11px] text-slate-500">
                  {reaction.volume > 0 ? `${Math.round(reaction.volume * 10)} mL volume in tube` : 'No volume'}
                </span>
              </div>
            </div>

            {/* Scientific Observation & Mechanism */}
            <div className="text-xs text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-200/60 flex flex-col gap-1.5">
              <div className="font-semibold text-slate-900">Observation:</div>
              <p className="text-slate-600 leading-relaxed">{reaction.observation}</p>
              {reaction.equation && (
                <div className="mt-1 p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-sky-900">
                  {reaction.equation}
                </div>
              )}
            </div>

            {/* Optional Inspector Notes & Save to Batch Log */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                placeholder="Optional inspector observation notes..."
                className="text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleLogRecord}
                disabled={hasLoggedResult || !hasMilkInTube}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{hasLoggedResult ? 'Test Logged in Batch Certificate' : 'Save to Quality Batch Record'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
