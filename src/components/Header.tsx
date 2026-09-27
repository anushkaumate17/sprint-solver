import React from 'react';

interface HeaderProps {
  activeTab: 'lab3d' | 'assays' | 'encyclopedia' | 'field' | 'batches' | 'quiz' | 'ai';
  onSelectTab: (tab: 'lab3d' | 'assays' | 'encyclopedia' | 'field' | 'batches' | 'quiz' | 'ai') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('lab3d')}
          className="text-xl font-bold tracking-tight text-slate-900 font-display hover:text-slate-700 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          MilkSafe 3D
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onSelectTab('lab3d')}
            className={`transition-colors pb-1 border-b-2 ${
              activeTab === 'lab3d'
                ? 'text-slate-900 border-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            3D Laboratory
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('assays')}
            className={`transition-colors pb-1 border-b-2 ${
              activeTab === 'assays'
                ? 'text-slate-900 border-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Assay Protocols
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('encyclopedia')}
            className={`transition-colors pb-1 border-b-2 ${
              activeTab === 'encyclopedia'
                ? 'text-slate-900 border-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Adulterants
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('field')}
            className={`transition-colors pb-1 border-b-2 ${
              activeTab === 'field'
                ? 'text-slate-900 border-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Field Scanner
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('batches')}
            className={`transition-colors pb-1 border-b-2 ${
              activeTab === 'batches'
                ? 'text-slate-900 border-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Inspection Logs
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('quiz')}
            className={`transition-colors pb-1 border-b-2 ${
              activeTab === 'quiz'
                ? 'text-slate-900 border-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Certification
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectTab('ai')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-sky-100 text-sky-900 border border-sky-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            AI Consultation
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('lab3d')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            Open 3D Bench
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="flex md:hidden overflow-x-auto border-t border-slate-100 px-4 py-2 gap-4 text-xs font-medium text-slate-600 no-scrollbar">
        <button
          type="button"
          onClick={() => onSelectTab('lab3d')}
          className={`whitespace-nowrap pb-1 border-b-2 ${activeTab === 'lab3d' ? 'text-slate-900 border-slate-900 font-semibold' : 'border-transparent'}`}
        >
          3D Lab
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('assays')}
          className={`whitespace-nowrap pb-1 border-b-2 ${activeTab === 'assays' ? 'text-slate-900 border-slate-900 font-semibold' : 'border-transparent'}`}
        >
          Assays
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('encyclopedia')}
          className={`whitespace-nowrap pb-1 border-b-2 ${activeTab === 'encyclopedia' ? 'text-slate-900 border-slate-900 font-semibold' : 'border-transparent'}`}
        >
          Adulterants
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('field')}
          className={`whitespace-nowrap pb-1 border-b-2 ${activeTab === 'field' ? 'text-slate-900 border-slate-900 font-semibold' : 'border-transparent'}`}
        >
          Field
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('batches')}
          className={`whitespace-nowrap pb-1 border-b-2 ${activeTab === 'batches' ? 'text-slate-900 border-slate-900 font-semibold' : 'border-transparent'}`}
        >
          Logs
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('quiz')}
          className={`whitespace-nowrap pb-1 border-b-2 ${activeTab === 'quiz' ? 'text-slate-900 border-slate-900 font-semibold' : 'border-transparent'}`}
        >
          Exam
        </button>
      </div>
    </header>
  );
};
