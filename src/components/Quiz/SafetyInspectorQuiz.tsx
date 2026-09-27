import React, { useState } from 'react';
import { CERTIFICATION_QUIZ } from '../../data/labData';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Printer, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SafetyInspectorQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [candidateName, setCandidateName] = useState('Senior Inspector');

  const question = CERTIFICATION_QUIZ[currentQuestionIndex];
  const totalQuestions = CERTIFICATION_QUIZ.length;

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    CERTIFICATION_QUIZ.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });
    return correct;
  };

  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);
  const hasPassed = percentage >= 75;

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    if (percentage >= 75) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">
            Competency Assessment & Credentialing
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            Milk Safety & Adulteration Diagnostic Exam
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Test your knowledge of colorimetric assays, chemical mechanisms, and FSSAI standards to earn certification.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 shrink-0">
          <Award className="w-6 h-6 text-amber-500" />
          <div className="text-xs font-mono">
            <span className="font-bold text-slate-900">Pass Mark: 75%</span>
            <div className="text-slate-500">8 Questions</div>
          </div>
        </div>
      </div>

      {!isSubmitted ? (
        /* Active Question Card */
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
          {/* Progress Bar & Question Tracker */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>Topic: {question.adulterantTopic}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg font-bold text-slate-900 leading-snug font-display">
            {question.question}
          </h3>

          {/* Multiple Choice Options */}
          <div className="flex flex-col gap-2.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedAnswers[question.id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 rounded-lg border text-left transition-all text-xs font-medium flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 text-slate-900 ring-1 ring-sky-400'
                      : 'bg-slate-50/60 hover:bg-slate-100/70 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center font-mono text-[11px] text-slate-600">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < totalQuestions}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Submit & View Results</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Certificate Section */
        <div className="flex flex-col gap-6">
          {/* Score Summary Box */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                EXAMINATION OUTCOME
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                {hasPassed ? 'Congratulations! Certified Milk Quality Inspector' : 'Assessment Incomplete'}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                You correctly answered <strong className="text-slate-900">{score} of {totalQuestions}</strong> questions ({percentage}%).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetQuiz}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              {hasPassed && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              )}
            </div>
          </div>

          {/* Printable Official Digital Certificate of Competence */}
          {hasPassed && (
            <div className="bg-amber-50/40 rounded-xl border-2 border-amber-300 p-8 shadow-md flex flex-col items-center text-center gap-4 relative print:border-none print:shadow-none">
              <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mb-2">
                <Award className="w-9 h-9" />
              </div>

              <div className="text-xs font-mono font-bold tracking-widest text-amber-800 uppercase">
                NATIONAL DAIRY SAFETY CREDENTIALING COUNCIL
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                CERTIFICATE OF COMPETENCY
              </h2>

              <p className="text-xs text-slate-600 max-w-md">
                This is to officially certify that
              </p>

              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter candidate name"
                className="text-xl font-bold text-center text-slate-900 border-b border-dashed border-slate-400 bg-transparent py-1 px-4 focus:outline-none focus:border-slate-800"
              />

              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                has successfully passed the comprehensive assessment in colorimetric milk adulteration detection, FSSAI analytical protocols, and hazardous chemical diagnostics with a passing score of <strong>{percentage}%</strong>.
              </p>

              <div className="pt-6 border-t border-amber-200 w-full flex items-end justify-between text-xs text-slate-500 font-mono mt-4">
                <div className="text-left">
                  <div className="font-bold text-slate-800">MILKSAFE 3D ACCREDITATION</div>
                  <div className="text-[10px]">Registry ID: MS-3D-{Date.now().toString().slice(-6)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">EXAMINATION BOARD</div>
                  <div className="text-[10px]">Issued: {new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Question Review & Detailed Explanations */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
            <h4 className="text-base font-bold text-slate-900 font-display">
              Detailed Question Analysis & Rationales
            </h4>
            <div className="flex flex-col gap-4 divide-y divide-slate-100">
              {CERTIFICATION_QUIZ.map((q, idx) => {
                const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                return (
                  <div key={q.id} className="pt-3 flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2 font-semibold">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span className="text-slate-900">{idx + 1}. {q.question}</span>
                    </div>

                    <div className="pl-6 flex flex-col gap-1 text-slate-600">
                      <div>
                        Your answer:{' '}
                        <span className={isCorrect ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
                          {q.options[selectedAnswers[q.id]] || 'Not answered'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-700 font-medium">
                          Correct answer: {q.options[q.correctAnswer]}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-100 mt-1">
                        <strong>Scientific Rationale:</strong> {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
