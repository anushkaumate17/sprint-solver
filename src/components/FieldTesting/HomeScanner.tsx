import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';

interface QuickTest {
  id: string;
  title: string;
  target: string;
  equipment: string;
  procedure: string[];
  positiveIndicator: string;
  pureIndicator: string;
  difficulty: 'Easy' | 'Moderate';
}

const FIELD_TESTS: QuickTest[] = [
  {
    id: 'slant_water',
    title: 'Slanted Polished Surface Flow Test',
    target: 'Excess Water Dilution',
    equipment: 'A clean slanted slate, mirror, or glass plate (at 45° angle)',
    procedure: [
      'Position a clean glass plate or slate at a 45-degree angle.',
      'Place a single drop of milk onto the top of the slanted surface.',
      'Observe the trail left behind as the droplet flows downward.'
    ],
    positiveIndicator: 'Flows immediately downward leaving no white trace or white trail behind (diluted with water).',
    pureIndicator: 'Flows slowly leaving a clear, continuous white milk residue trail along its path.',
    difficulty: 'Easy'
  },
  {
    id: 'lather_shake',
    title: 'Vigorous Bottle Agitation Test',
    target: 'Detergents & Synthetic Emulsifiers',
    equipment: 'Clear transparent glass bottle or vial with cap',
    procedure: [
      'Pour 15 mL of milk and 15 mL of warm tap water into the glass bottle.',
      'Seal the cap tightly and shake vigorously for 20 seconds.',
      'Set the bottle upright on a table and observe foam behavior for 5 minutes.'
    ],
    positiveIndicator: 'Thick, dense, persistent detergent lather that remains stable for over 15 minutes without collapsing.',
    pureIndicator: 'Thin milk froth that collapses back into liquid within 30 to 60 seconds.',
    difficulty: 'Easy'
  },
  {
    id: 'palm_friction',
    title: 'Palm Friction & Saponification Test',
    target: 'Synthetic Milk (Oils + Caustic Soda)',
    equipment: 'Your clean palms',
    procedure: [
      'Take 3 to 4 drops of raw milk on the palm of your hand.',
      'Rub both palms together vigorously for 15 seconds to generate mild body heat.'
    ],
    positiveIndicator: 'Feels distinctly soapy, slippery, and greasy like detergent lather; fails to absorb naturally.',
    pureIndicator: 'Feels smooth and natural, with slight natural butterfat softness that dries cleanly.',
    difficulty: 'Easy'
  },
  {
    id: 'kitchen_iodine',
    title: 'First-Aid Tincture Iodine Test',
    target: 'Starch, Maida & Rice Flour',
    equipment: 'First-aid box Tincture of Iodine, teaspoon, small cup',
    procedure: [
      'Boil 10 mL of milk in a spoon or small vessel and let it cool completely.',
      'Add 2 to 3 drops of common medical tincture of iodine (Povidone/Iodine).',
      'Stir well with a clean toothpick or spoon.'
    ],
    positiveIndicator: 'Immediate transformation into deep indigo blue or dark purple color.',
    pureIndicator: 'Solution remains light yellowish-brown with zero blue complex.',
    difficulty: 'Moderate'
  },
  {
    id: 'boil_taste',
    title: 'Boil & Prolonged Heat Curdling Test',
    target: 'Chemical Neutralizers & Synthetic Milk',
    equipment: 'Steel ladle and kitchen stove flame',
    procedure: [
      'Heat 20 mL of milk slowly to boiling in a clean vessel.',
      'Observe the top skin formation (malai) and smell vapor.'
    ],
    positiveIndicator: 'Bitter chemical aftertaste, abnormal yellowish oily film, or chemical pungent odor.',
    pureIndicator: 'Clean milky sweet aroma, normal soft white coagulated cream layer.',
    difficulty: 'Easy'
  }
];

export const HomeScanner: React.FC = () => {
  const [activeTest, setActiveTest] = useState<QuickTest>(FIELD_TESTS[0]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-emerald-600 uppercase tracking-wider">
            Consumer Field & Kitchen Protocol
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            Household Milk Purity Field Tests
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Practical screening assays anyone can execute in minutes without specialized laboratory glassware or hazardous chemicals.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-900 px-4 py-2.5 rounded-lg border border-emerald-200 shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div className="text-xs font-mono">
            <span className="font-bold">5 Quick Assays</span> Available
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Test Selector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          {FIELD_TESTS.map((test) => {
            const isSelected = activeTest.id === test.id;
            return (
              <button
                key={test.id}
                type="button"
                onClick={() => setActiveTest(test)}
                className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="text-xs font-mono text-slate-400">DETECTS: {test.target}</div>
                  <div className="text-sm font-bold text-slate-900 font-display mt-0.5">
                    {test.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Requires: {test.equipment}</div>
                </div>
                <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-slate-900 translate-x-1' : 'text-slate-400'}`} />
              </button>
            );
          })}

          {/* Interactive Consumer Safety Checklist Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mt-2 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 font-mono">KITCHEN SCREENING CHECKLIST</span>
              <span className="text-xs font-mono text-slate-500">{completedCount} of 4 verified</span>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { id: 'c1', label: 'Color is natural uniform ivory white, not bluish or synthetic bright' },
                { id: 'c2', label: 'Flows slowly on clean tilted glass leaving a clear white trace' },
                { id: 'c3', label: 'Shake test produces no persistent detergent lather (>10 min)' },
                { id: 'c4', label: 'Palms feel non-soapy without greasy synthetic slip' },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={!!checklist[item.id]}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Field Procedure & Indicators (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
          <div>
            <div className="text-xs font-mono text-slate-400">FIELD TESTING PROTOCOL</div>
            <h3 className="text-xl font-bold text-slate-900 font-display mt-0.5">
              {activeTest.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Target Adulterant: <strong className="text-slate-800">{activeTest.target}</strong> · Level: {activeTest.difficulty}
            </p>
          </div>

          {/* Equipment Needed */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex flex-col gap-1">
            <span className="font-semibold text-slate-900 font-mono">Apparatus Required:</span>
            <span>{activeTest.equipment}</span>
          </div>

          {/* Procedure Steps */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider">
              Execution Protocol
            </span>
            <div className="flex flex-col gap-2">
              {activeTest.procedure.map((step, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-800 leading-relaxed font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Positive vs Pure Results Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 font-mono">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                ADULTERATED INDICATION
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                {activeTest.positiveIndicator}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                PURE MILK INDICATION
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {activeTest.pureIndicator}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
