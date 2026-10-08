import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard,
  FileText,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { VaccineItem } from '../types';

interface VaccinesViewProps {
  vaccines: VaccineItem[];
  onOpenAssistant: (query?: string) => void;
}

export const VaccinesView: React.FC<VaccinesViewProps> = ({ vaccines, onOpenAssistant }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | '65plus' | 'chronic' | 'pregnancy' | 'youngAdult'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredVaccines = vaccines.filter((v) => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.diseaseTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.clinicalRecommendation.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === '65plus') {
      return v.clinicalRecommendation.includes('65') || v.id.includes('PNEUMO') || v.id.includes('INFLUENZA') || v.id.includes('SHINGLES');
    }
    if (filterCategory === 'chronic') {
      return v.clinicalRecommendation.toLowerCase().includes('chronic') || v.id.includes('PNEUMO') || v.id.includes('INFLUENZA') || v.id.includes('HEPATITIS');
    }
    if (filterCategory === 'pregnancy') {
      return v.id.includes('TDAP') || v.id.includes('INFLUENZA') || v.contraindications.toLowerCase().includes('pregnancy');
    }
    if (filterCategory === 'youngAdult') {
      return v.id.includes('HPV') || v.id.includes('MMR') || v.id.includes('HEPATITIS');
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Singapore NAIS Sept 2025 Catalogue</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          National Adult Immunisation Schedule
        </h1>
        <p className="text-xs sm:text-sm text-slate-650 mt-1 max-w-2xl leading-relaxed">
          Comprehensive clinical indications, distinct product valencies, administration intervals, and official subsidy frameworks under Healthier SG and CHAS.
        </p>

        {/* Search & Category Filter */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-700 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by vaccine, virus, or target disease..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: 'all', label: 'All Adult Vaccines' },
              { id: '65plus', label: 'Age 65+ Key Focus' },
              { id: 'chronic', label: 'Chronic Conditions' },
              { id: 'pregnancy', label: 'Maternal / Pregnancy' },
              { id: 'youngAdult', label: 'Young Adults (18-26)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  filterCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vaccines List */}
      <div className="space-y-4">
        {filteredVaccines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-700">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No vaccines match your filter criteria.</p>
          </div>
        ) : (
          filteredVaccines.map((v) => {
            const isExpanded = expandedId === v.id;

            return (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-200 transition space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {v.name}
                    </h2>
                    <span className="text-xs text-blue-800 font-medium">
                      Target: {v.diseaseTarget}
                    </span>
                  </div>

                  <span className="self-start sm:self-center text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {v.naisStatus}
                  </span>
                </div>

                {/* Clinical Recommendation */}
                <div className="text-xs sm:text-sm text-slate-700">
                  <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider text-slate-700 mb-1">
                    Clinical Recommendation
                  </span>
                  <p className="leading-relaxed text-slate-800">
                    {v.clinicalRecommendation}
                  </p>
                </div>

                {/* Schedule & Intervals */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Dosing Schedule & Intervals
                  </span>
                  <p className="text-slate-650 leading-relaxed text-xs">
                    {v.scheduleAndIntervals}
                  </p>
                </div>

                {/* Distinct Product & Valency Note */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-950 space-y-1">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    Product & Valency Specification
                  </span>
                  <p className="text-blue-900/90 leading-relaxed">
                    {v.distinctProductNote}
                  </p>
                </div>

                {/* Toggleable Details: Contraindications & Subsidies */}
                {isExpanded ? (
                  <div className="space-y-3 pt-2 border-t border-slate-100 text-xs sm:text-sm">
                    {/* Contraindications */}
                    <div>
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-rose-700 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Contraindications & Precautions
                      </span>
                      <p className="text-slate-650 text-xs leading-relaxed">
                        {v.contraindications}
                      </p>
                    </div>

                    {/* Sourced Subsidy Framework */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-emerald-800">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        Subsidies & Financial Schemes
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-900 block text-[11px]">Healthier SG</span>
                          <span className="text-slate-600 text-[11px]">{v.subsidyEligibility.healthierSg}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-900 block text-[11px]">CHAS GP Clinics</span>
                          <span className="text-slate-600 text-[11px]">{v.subsidyEligibility.chasGp}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-900 block text-[11px]">Polyclinics</span>
                          <span className="text-slate-600 text-[11px]">{v.subsidyEligibility.polyclinic}</span>
                        </div>
                      </div>
                    </div>

                    {/* Evidence Locator */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700">
                      <span className="flex items-center gap-1 font-mono">
                        <FileText className="w-3 h-3 text-slate-700" />
                        {v.evidenceLocator}
                      </span>
                      <button
                        onClick={() => onOpenAssistant(`Tell me more about ${v.name} under NAIS`)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Ask assistant about this vaccine &rarr;
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Expand / Collapse Button */}
                <div className="pt-1 flex justify-between items-center text-xs">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : v.id)}
                    className="font-semibold text-blue-600 hover:text-blue-800 transition py-1"
                  >
                    {isExpanded ? 'Show Less' : 'View Subsidies & Precautions Details'}
                  </button>
                  <span className="text-[10px] text-slate-700">NAIS Sept 2025</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
