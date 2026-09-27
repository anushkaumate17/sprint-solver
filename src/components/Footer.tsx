import React from 'react';

interface FooterProps {
  onSelectTab: (tab: 'lab3d' | 'assays' | 'encyclopedia' | 'field' | 'batches' | 'quiz' | 'ai') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-base font-bold text-slate-900 font-display">MilkSafe 3D Platform</span>
          <p className="text-xs text-slate-500">
            Unified Virtual Milk Adulteration Laboratory & Food Safety Assurance Suite
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
          <button type="button" onClick={() => onSelectTab('lab3d')} className="hover:text-slate-900 transition-colors">
            3D Virtual Bench
          </button>
          <button type="button" onClick={() => onSelectTab('assays')} className="hover:text-slate-900 transition-colors">
            FSSAI Assays
          </button>
          <button type="button" onClick={() => onSelectTab('encyclopedia')} className="hover:text-slate-900 transition-colors">
            Adulterants Encyclopedia
          </button>
          <button type="button" onClick={() => onSelectTab('field')} className="hover:text-slate-900 transition-colors">
            Kitchen Field Scanner
          </button>
          <button type="button" onClick={() => onSelectTab('batches')} className="hover:text-slate-900 transition-colors">
            Batch Certificates
          </button>
          <button type="button" onClick={() => onSelectTab('quiz')} className="hover:text-slate-900 transition-colors">
            Inspector Certification
          </button>
        </nav>

        <div className="text-xs text-slate-400 font-mono">
          © {new Date().getFullYear()} MilkSafe · Standard Protocols
        </div>
      </div>
    </footer>
  );
};
