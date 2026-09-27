import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Lab3DWorkbench } from './components/Lab3D/Lab3DWorkbench';
import { AssaysDirectory } from './components/AssayProtocols/AssaysDirectory';
import { AdulterantsEncyclopedia } from './components/Encyclopedia/AdulterantsEncyclopedia';
import { HomeScanner } from './components/FieldTesting/HomeScanner';
import { BatchInspectionReport } from './components/BatchLog/BatchInspectionReport';
import { SafetyInspectorQuiz } from './components/Quiz/SafetyInspectorQuiz';
import { AiMilkAssistant } from './components/AiAssistant/AiMilkAssistant';
import { INITIAL_BATCH_LOGS } from './data/labData';
import { TestResultRecord } from './types/lab';
import { FlaskConical, ShieldAlert, Award, FileSpreadsheet, Bot, CheckCircle, ArrowRight } from 'lucide-react';
import heroLabImg from './assets/images/milksafe_hero_lab_1790510964296.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<'lab3d' | 'assays' | 'encyclopedia' | 'field' | 'batches' | 'quiz' | 'ai'>('lab3d');
  const [selectedAssayIdFor3D, setSelectedAssayIdFor3D] = useState<string>('assay_starch');
  const [batchLogs, setBatchLogs] = useState<TestResultRecord[]>(() => {
    try {
      const saved = localStorage.getItem('milksafe_batch_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BATCH_LOGS;
  });

  const handleSaveToBatchLog = (record: TestResultRecord) => {
    setBatchLogs((prev) => {
      const updated = [record, ...prev];
      try {
        localStorage.setItem('milksafe_batch_logs', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleLaunchAssayIn3D = (assayId: string) => {
    setSelectedAssayIdFor3D(assayId);
    setActiveTab('lab3d');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Bar Contract Compliant Navigation */}
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Hero Strip (Clean scientific tone with quantitative rigor) */}
      {activeTab === 'lab3d' && (
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span className="font-semibold text-sky-700">FSSAI & AOAC Standard Methods</span>
                <span aria-hidden="true">·</span>
                <span>Interactive WebGL 3D Simulation</span>
                <span aria-hidden="true">·</span>
                <span>Real-Time Colorimetry</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.15] text-balance">
                Unified Milk Adulteration Detection & Virtual Laboratory
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Inspect raw and commercial dairy specimens in a fully interactive 3D virtual chemistry bench. Perform verified colorimetric assays for starch, urea, toxic detergent, formalin, and sucrose with physical reaction kinetics.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('assays')}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Browse 8 Assays
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('field')}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Kitchen Field Tests
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Take Certification Exam
                </button>
              </div>
            </div>

            {/* Laboratory Hero Visual */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-64 sm:h-72">
              <img
                src={heroLabImg}
                alt="Dairy Quality Testing Analytical Laboratory"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-5">
                <div className="text-white text-xs">
                  <div className="font-mono font-semibold tracking-wider text-sky-300">
                    ISO/IEC 17025 METHODOLOGY
                  </div>
                  <div className="text-sm font-bold font-display mt-0.5">
                    Certified Colorimetric Diagnostic Bench
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'lab3d' && (
          <Lab3DWorkbench
            initialAssayId={selectedAssayIdFor3D}
            onSaveToBatchLog={handleSaveToBatchLog}
            onNavigateToAssays={() => setActiveTab('assays')}
          />
        )}

        {activeTab === 'assays' && (
          <AssaysDirectory onSelectAssayFor3D={handleLaunchAssayIn3D} />
        )}

        {activeTab === 'encyclopedia' && (
          <AdulterantsEncyclopedia
            onTestInLab={(adulterantId) => {
              const matchedAssay =
                adulterantId === 'starch'
                  ? 'assay_starch'
                  : adulterantId === 'detergent'
                  ? 'assay_detergent'
                  : adulterantId === 'urea'
                  ? 'assay_urea'
                  : adulterantId === 'formalin'
                  ? 'assay_formalin'
                  : adulterantId === 'sucrose'
                  ? 'assay_sucrose'
                  : 'assay_neutralizer';
              handleLaunchAssayIn3D(matchedAssay);
            }}
          />
        )}

        {activeTab === 'field' && <HomeScanner />}

        {activeTab === 'batches' && (
          <BatchInspectionReport
            batchLogs={batchLogs}
            onSelectSampleForLab={() => setActiveTab('lab3d')}
          />
        )}

        {activeTab === 'quiz' && <SafetyInspectorQuiz />}

        {activeTab === 'ai' && <AiMilkAssistant />}
      </main>

      {/* Clean Domain-Compliant Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
