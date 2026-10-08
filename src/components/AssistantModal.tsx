import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { AssistantResponse, VoluntaryProfile } from '../types';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  voluntaryProfile: VoluntaryProfile;
}

export const AssistantModal: React.FC<AssistantModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  voluntaryProfile
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          profile: voluntaryProfile
        })
      });

      const json = await res.json();
      if (res.ok && json.structured) {
        setResponse(json.structured);
      } else {
        setError(json.error || 'Failed to retrieve evidence-grounded response.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error communicating with evidence assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setQuery(q);
    // submit with that query
    setTimeout(() => {
      handleSubmit();
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-blue-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Ask Evidence Guide</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Grounded in NAIS & PubMed
                </span>
              </div>
              <p className="text-xs text-blue-100/80">
                Strict evidence-backed answers supporting discussion with your doctor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Quick Starter Prompts */}
          {!response && !loading && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Suggested Evidence Questions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'What is the difference between PCV20 and PCV13+PPSV23?',
                  'Am I eligible for $0 co-payment under Healthier SG?',
                  'Who needs annual influenza vaccination in Singapore?',
                  'Why is Tdap recommended between 16-32 weeks of pregnancy?'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q)}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl text-left text-slate-700 hover:text-blue-900 transition font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-700">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Consulting verified NAIS guidance and PubMed research...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Structured Assistant Response */}
          {response && (
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Answer Text */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 leading-relaxed text-slate-800 space-y-2">
                <span className="font-bold text-xs uppercase tracking-wider text-blue-700 block">
                  Evidence-Grounded Response
                </span>
                <p className="whitespace-pre-line text-slate-900">
                  {response.answerText}
                </p>
              </div>

              {/* Verified Claims Checklist */}
              {response.claims && response.claims.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Sourced Claims ({response.claims.length})
                  </span>
                  <div className="space-y-1.5">
                    {response.claims.map((claim) => (
                      <div
                        key={claim.claimId}
                        className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-2 shadow-xs"
                      >
                        <div>
                          <p className="text-slate-800 font-medium">{claim.text}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-700">
                            <span className="font-mono bg-slate-100 px-1 py-0.2 rounded">{claim.claimId}</span>
                            <span>• Sources: {claim.evidenceIds.join(', ')}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex-shrink-0">
                          {claim.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cited Sources & Locators */}
              {response.sources && response.sources.length > 0 && (
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-950 space-y-1.5">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-blue-800 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    Cited Registry References
                  </span>
                  <div className="space-y-1 text-[11px]">
                    {response.sources.map((src, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="font-semibold text-blue-900">{src.title}</span>
                        <span className="font-mono text-blue-700 text-[10px]">{src.locator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Information Prompt if any */}
              {response.missingInformation && response.missingInformation.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-amber-950">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    Information Required for Full Individual Evaluation:
                  </span>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                    {response.missingInformation.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Limitations & Medical Boundaries */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-750 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-slate-700 mt-0.5" />
                <span>
                  <strong>Clinical Boundary:</strong> {response.limitations} Data valid as of {response.dataAsOf}.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2 flex-shrink-0"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about NAIS schedules, subsidies, or PubMed evidence..."
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition active:scale-95 flex-shrink-0"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
