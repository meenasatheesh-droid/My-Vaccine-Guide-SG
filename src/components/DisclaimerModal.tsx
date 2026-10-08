import React from 'react';
import { X, AlertCircle, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 text-blue-900">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base sm:text-lg">Medical & Legal Information</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-700 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-650 leading-relaxed">
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3 text-amber-900">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Educational Support Only</p>
              <p className="text-xs text-amber-800 mt-0.5">
                This app is an educational patient-awareness tool designed to support informed discussions with your doctor. It does not provide medical diagnosis, treatment, prescriptions, or legally certify financial eligibility.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Not an Official Government Service
            </h4>
            <p>
              While all schedule rules and subsidy descriptions are strictly grounded in official Ministry of Health (MOH) Singapore documents (including NAIS Sept 2025 and published CHAS guidelines), this app is not operated by or representing the Singapore Government or MOH.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Individual Suitability & Co-payments
            </h4>
            <p>
              Final clinical suitability, dose interval clearance, vaccine stock availability, and exact co-payment amounts are determined strictly by your healthcare provider at the time of consultation.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Privacy & In-Memory Data
            </h4>
            <p>
              No user accounts, login, or persistent patient database exist. Voluntary profile details (age, subsidy category) remain in temporary browser memory and are never saved to disk or linked to identifiable personal records (such as NRICs or names).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Strict Source Boundary
            </h4>
            <p>
              Factual content originates strictly from the server-enforced registry containing official MOH policies, the approved Smithery PubMed MCP server, open data.gov.sg feeds, and the authorized National Population Health Survey dataset.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs sm:text-sm transition shadow-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
