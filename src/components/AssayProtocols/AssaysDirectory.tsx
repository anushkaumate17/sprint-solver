import React, { useState } from 'react';
import { ASSAY_PROTOCOLS, REAGENTS } from '../../data/labData';
import { AssayProtocol } from '../../types/lab';
import { FlaskConical, ArrowRight, ShieldAlert, Sparkles, Check, Thermometer, Clock } from 'lucide-react';

interface AssaysDirectoryProps {
  onSelectAssayFor3D: (assayId: string) => void;
}

export const AssaysDirectory: React.FC<AssaysDirectoryProps> = ({ onSelectAssayFor3D }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'Critical' | 'High' | 'Moderate'>('all');
  const [expandedAssayId, setExpandedAssayId] = useState<string | null>(ASSAY_PROTOCOLS[0].id);

  const filtered = ASSAY_PROTOCOLS.filter(
    (a) => selectedFilter === 'all' || a.healthRiskLevel === selectedFilter
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">
            Standard Analytical Methods
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            Official Milk Adulteration Assays
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Codified colorimetric and chemical protocols aligned with FSSAI (Food Safety and Standards Authority of India) and AOAC international dairy analysis criteria.
          </p>
        </div>

        {/* Filter buttons (Interactive filter controls, allowed per guidelines) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Assays ({ASSAY_PROTOCOLS.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('Critical')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedFilter === 'Critical' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical Risk
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('High')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedFilter === 'High' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            High Risk
          </button>
        </div>
      </div>

      {/* Assays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((assay) => {
          const isExpanded = expandedAssayId === assay.id;
          const reagents = REAGENTS.filter((r) => assay.reagentsNeeded.includes(r.id));

          return (
            <div
              key={assay.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                {/* Title & Metadata (Unboxed text with separators per zero-pill rule) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="font-semibold text-slate-800">{assay.fssaiStandardRef.split(' (')[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span className={assay.healthRiskLevel === 'Critical' ? 'text-rose-600 font-semibold' : 'text-amber-600'}>
                      {assay.healthRiskLevel} Hazard
                    </span>
                    {assay.requiresHeating && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-700 flex items-center gap-0.5">
                          <Thermometer className="w-3 h-3 inline" /> 95°C Boil
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {assay.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {assay.purpose}
                </p>

                {/* Reaction Equation Box */}
                {assay.reactionEquation && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 break-words">
                    {assay.reactionEquation}
                  </div>
                )}

                {/* Colorimetric Standard Swatches */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-md border border-black/10 shrink-0 shadow-sm"
                      style={{ backgroundColor: assay.positiveColor }}
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-rose-700 uppercase font-mono">
                        Positive (Adulterated)
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        {assay.positiveObservation.split('!')[0]}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-md border border-black/10 shrink-0 shadow-sm"
                      style={{ backgroundColor: assay.negativeColor }}
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-emerald-700 uppercase font-mono">
                        Negative (Pure)
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        {assay.negativeObservation.split('.')[0]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reagents Needed */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <span className="font-mono text-slate-400">Reagents:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {reagents.map((r) => (
                      <span key={r.id} className="text-slate-800 font-medium">
                        {r.name.split(' (')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setExpandedAssayId(isExpanded ? null : assay.id)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                >
                  {isExpanded ? 'Hide Steps' : `View ${assay.steps.length} Protocol Steps`}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectAssayFor3D(assay.id)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
                  <span>Launch in 3D Lab</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Collapsible Steps */}
              {isExpanded && (
                <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <div className="text-xs font-semibold text-slate-700">Detailed Standard Procedure:</div>
                  {assay.steps.map((st) => (
                    <div key={st.stepNumber} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="font-mono font-bold text-slate-400 shrink-0">{st.stepNumber}.</span>
                      <div>
                        <span className="font-medium text-slate-900">{st.instruction}</span>
                        <div className="text-[11px] text-slate-500">{st.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
