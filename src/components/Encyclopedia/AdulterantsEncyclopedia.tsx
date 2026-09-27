import React, { useState } from 'react';
import { ADULTERANT_DATABASE } from '../../data/labData';
import { AdulterantDetail } from '../../types/lab';
import { AlertOctagon, HeartCrack, Activity, Search, ShieldCheck } from 'lucide-react';

interface AdulterantsEncyclopediaProps {
  onTestInLab: (adulterantId: string) => void;
}

export const AdulterantsEncyclopedia: React.FC<AdulterantsEncyclopediaProps> = ({ onTestInLab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdulterant, setSelectedAdulterant] = useState<AdulterantDetail>(ADULTERANT_DATABASE[0]);

  const filtered = ADULTERANT_DATABASE.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chemicalNature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.economicMotive.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-rose-600 uppercase tracking-wider">
            Toxicology & Food Safety Compendium
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            Milk Adulterants & Chemical Hazards
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Exhaustive scientific database detailing industrial additives, economic motives, acute toxicity, and chronic human health consequences.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search adulterant or organ..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Two-Column Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Adulterants (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          {filtered.map((item) => {
            const isSelected = selectedAdulterant.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedAdulterant(item)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900'
                    : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 font-display">{item.name}</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.affectedOrgans.length} Organs
                  </span>
                </div>
                <div className="text-xs text-slate-500 line-clamp-1">{item.chemicalNature}</div>
                <div className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                  {item.economicMotive}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep Chemical & Toxicological Profile (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-mono text-slate-400">CHEMICAL PROFILE #ADU-{selectedAdulterant.id.toUpperCase()}</div>
              <h3 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {selectedAdulterant.name}
              </h3>
              <p className="text-xs font-mono text-slate-600 mt-1">
                {selectedAdulterant.chemicalNature}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onTestInLab(selectedAdulterant.id)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
            >
              Test in 3D Lab
            </button>
          </div>

          {/* Section: Economic Motive */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider">
              Fraud Motive & Mechanism
            </span>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              {selectedAdulterant.economicMotive}
            </p>
          </div>

          {/* Section: Regulatory Tolerance */}
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-semibold font-mono">FSSAI / Codex Standard Tolerance: </span>
              <span>{selectedAdulterant.fssaiTolerance}</span>
            </div>
          </div>

          {/* Section: Target Human Organs */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider">
              Primary Affected Organs
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedAdulterant.affectedOrgans.map((organ) => (
                <div
                  key={organ}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/70 text-xs font-medium text-rose-900 flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-rose-600" />
                  <span>{organ}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Acute Toxicity vs Chronic Hazards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                ACUTE TOXICITY (SHORT-TERM)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedAdulterant.acuteToxicity}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-mono">
                <HeartCrack className="w-4 h-4 text-rose-600" />
                CHRONIC PATHOLOGY (LONG-TERM)
              </div>
              <ul className="text-xs text-slate-600 flex flex-col gap-1.5 pl-4 list-disc">
                {selectedAdulterant.chronicHazards.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rapid Household / Field Detection Tip */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50 text-xs text-sky-950 flex flex-col gap-1">
            <span className="font-semibold text-sky-900 font-mono">Rapid Consumer Detection Guideline:</span>
            <p className="text-sky-800 leading-relaxed">{selectedAdulterant.preventionTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
