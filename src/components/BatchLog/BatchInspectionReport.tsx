import React, { useState } from 'react';
import { TestResultRecord } from '../../types/lab';
import { FileText, Printer, ShieldCheck, AlertOctagon, Download, CheckCircle, Search, Filter } from 'lucide-react';

interface BatchInspectionReportProps {
  batchLogs: TestResultRecord[];
  onSelectSampleForLab: (sampleId: string) => void;
}

export const BatchInspectionReport: React.FC<BatchInspectionReportProps> = ({
  batchLogs,
  onSelectSampleForLab,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<TestResultRecord>(batchLogs[0] || null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'Adulterated' | 'Pure'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = batchLogs.filter((log) => {
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'Adulterated'
        ? log.resultStatus.includes('Adulterated')
        : log.resultStatus.includes('Pure');
    const matchesSearch =
      log.sampleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.sampleBatch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.assayName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">
            Quality Assurance & Batch Audit
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            Laboratory Testing Logs & Certificates
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Audit trail of analyzed dairy batches, colorimetric spectrophotometry results, and printable Certificates of Analysis.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Batch Log Table & Certificate Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Table of Logged Tests (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search batch or sample ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                All ({batchLogs.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('Adulterated')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterStatus === 'Adulterated' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Adulterated
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('Pure')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterStatus === 'Pure' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Pure
              </button>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-mono">
                  <th className="pb-2.5 font-medium">Record ID / Timestamp</th>
                  <th className="pb-2.5 font-medium">Batch / Specimen</th>
                  <th className="pb-2.5 font-medium">Assay</th>
                  <th className="pb-2.5 font-medium">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const isSelected = selectedRecord?.id === log.id;
                  const isAdulterated = log.resultStatus.includes('Adulterated');
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedRecord(log)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/70 font-medium' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 pr-2">
                        <div className="font-mono text-slate-900">{log.id}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{log.timestamp}</div>
                      </td>
                      <td className="py-3 pr-2">
                        <div className="text-slate-800 font-semibold">{log.sampleBatch}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{log.sampleName}</div>
                      </td>
                      <td className="py-3 pr-2 text-slate-700">
                        {log.assayName.split(' (')[0]}
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                            isAdulterated
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isAdulterated ? 'ADULTERATED' : 'PURE'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Official Certificate of Analysis Document Preview (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-300 p-6 shadow-md flex flex-col justify-between gap-5 font-sans relative print:w-full print:border-none print:shadow-none">
          {selectedRecord ? (
            <>
              {/* Document Header */}
              <div className="flex flex-col gap-1 pb-4 border-b-2 border-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
                    OFFICIAL DAIRY ANALYSIS
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-700">
                    CERTIFICATE #{selectedRecord.id}
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 font-display">
                  CERTIFICATE OF MILK QUALITY & PURITY
                </h3>
                <div className="text-[11px] text-slate-500 font-mono">
                  ISO/IEC 17025 ACCREDITED DAIRY TESTING FACILITY
                </div>
              </div>

              {/* Sample Details */}
              <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 font-mono block text-[10px]">BATCH IDENTIFIER:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedRecord.sampleBatch}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono block text-[10px]">TIMESTAMP:</span>
                  <span className="text-slate-700 font-mono">{selectedRecord.timestamp}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-mono block text-[10px]">SPECIMEN SOURCE:</span>
                  <span className="text-slate-800 font-medium">{selectedRecord.sampleName}</span>
                </div>
              </div>

              {/* Analytical Test Table */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-900 font-mono">TEST RESULTS & FINDINGS</span>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-100 p-2 font-mono text-[11px] font-semibold text-slate-700 grid grid-cols-2">
                    <span>Parameter</span>
                    <span>Observation</span>
                  </div>
                  <div className="p-2 border-t border-slate-200 grid grid-cols-2">
                    <span className="font-medium text-slate-800">Assay Executed</span>
                    <span className="text-slate-600">{selectedRecord.assayName}</span>
                  </div>
                  <div className="p-2 border-t border-slate-200 grid grid-cols-2 bg-slate-50/50">
                    <span className="font-medium text-slate-800">Target Analyte</span>
                    <span className="text-slate-600">{selectedRecord.testedAdulterant}</span>
                  </div>
                  <div className="p-2 border-t border-slate-200 grid grid-cols-2">
                    <span className="font-medium text-slate-800">Colorimeter Hue</span>
                    <span className="text-slate-600 font-mono">{selectedRecord.colorObserved}</span>
                  </div>
                  <div className="p-2 border-t border-slate-200 grid grid-cols-2 bg-slate-50/50">
                    <span className="font-medium text-slate-800">Technician Remarks</span>
                    <span className="text-slate-600">{selectedRecord.reactionNotes}</span>
                  </div>
                </div>
              </div>

              {/* Final Compliance Verdict Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  selectedRecord.resultStatus.includes('Adulterated')
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-75">
                    REGULATORY COMPLIANCE VERDICT
                  </div>
                  <div className="text-base font-black tracking-tight mt-0.5">
                    {selectedRecord.resultStatus.includes('Adulterated')
                      ? 'FAIL: ADULTERATION CONFIRMED'
                      : 'PASS: CERTIFIED PURE FOR CONSUMPTION'}
                  </div>
                </div>

                {selectedRecord.resultStatus.includes('Adulterated') ? (
                  <AlertOctagon className="w-8 h-8 text-rose-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                )}
              </div>

              {/* Sign-off & Stamp */}
              <div className="pt-3 border-t border-slate-200 flex items-end justify-between text-xs text-slate-500 font-mono">
                <div>
                  <div className="text-slate-400 text-[10px]">CERTIFYING OFFICER</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedRecord.testedBy}</div>
                  <div className="text-[10px]">Head of Dairy Quality Assurance</div>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400 ml-auto">
                    STAMP
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a batch test record to preview official certificate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
