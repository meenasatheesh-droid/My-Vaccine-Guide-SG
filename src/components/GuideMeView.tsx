import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Info,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { VoluntaryProfile, EvaluatedResult, CitizenshipType, HealthierSgType, SubsidyTierType } from '../types';

interface GuideMeViewProps {
  profile: VoluntaryProfile;
  onUpdateProfile: (newProfile: VoluntaryProfile) => void;
  evaluationResults: EvaluatedResult[];
  onOpenAssistant: () => void;
}

export const GuideMeView: React.FC<GuideMeViewProps> = ({
  profile,
  onUpdateProfile,
  evaluationResults,
  onOpenAssistant
}) => {
  const [showPresets, setShowPresets] = useState(false);

  // Preset scenarios (strictly labeled as sample examples)
  const applyPreset = (presetName: string) => {
    if (presetName === 'pioneer') {
      onUpdateProfile({
        age: 72,
        citizenship: 'SC',
        healthierSgStatus: 'ENROLLED_AT_ENROLLED_CLINIC',
        subsidyTier: 'PIONEER',
        hasChronicCondition: true,
        chronicConditions: ['diabetes', 'hypertension'],
        isImmunocompromised: false,
        isPregnant: false,
        priorPneumo: 'NEVER',
        fluThisSeason: false,
        shinglesDoses: 0
      });
    } else if (presetName === 'working_adult_chas') {
      onUpdateProfile({
        age: 48,
        citizenship: 'SC',
        healthierSgStatus: 'ENROLLED_OTHER_CLINIC',
        subsidyTier: 'CHAS_BLUE',
        hasChronicCondition: true,
        chronicConditions: ['asthma'],
        isImmunocompromised: false,
        isPregnant: false,
        priorPneumo: 'NEVER',
        fluThisSeason: false,
        shinglesDoses: 0
      });
    } else if (presetName === 'expecting_mother') {
      onUpdateProfile({
        age: 31,
        citizenship: 'SC',
        healthierSgStatus: 'NOT_ENROLLED',
        subsidyTier: 'NONE',
        hasChronicCondition: false,
        chronicConditions: [],
        isImmunocompromised: false,
        isPregnant: true,
        priorPneumo: 'NEVER',
        fluThisSeason: false,
        shinglesDoses: 0
      });
    }
  };

  const handleReset = () => {
    onUpdateProfile({
      age: null,
      citizenship: null,
      healthierSgStatus: null,
      subsidyTier: null,
      hasChronicCondition: null,
      chronicConditions: [],
      isImmunocompromised: null,
      isPregnant: null,
      priorPneumo: 'NEVER',
      fluThisSeason: null,
      shinglesDoses: null
    });
  };

  const toggleCondition = (conditionKey: string) => {
    const current = profile.chronicConditions || [];
    const next = current.includes(conditionKey)
      ? current.filter(c => c !== conditionKey)
      : [...current, conditionKey];
    onUpdateProfile({
      ...profile,
      chronicConditions: next,
      hasChronicCondition: next.length > 0
    });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Deterministic Eligibility Guide</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Personalised Adult Schedule Matching
            </h1>
            <p className="text-xs sm:text-sm text-slate-650 mt-1 max-w-2xl leading-relaxed">
              Provides educational matching based on Singapore NAIS Sept 2025 and MOH subsidy policy. This does not diagnose, prescribe, or certify eligibility.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
            >
              {showPresets ? 'Hide Examples' : 'Sample Scenarios'}
            </button>
            <button
              onClick={handleReset}
              className="text-xs font-medium text-slate-700 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
              title="Reset Voluntary Inputs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sample Presets Drawer */}
        {showPresets && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-800 block mb-2">
              Select a Sample Scenario for Quick Exploration:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => applyPreset('pioneer')}
                className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-left transition"
              >
                <div className="font-bold text-blue-900">Pioneer Generation (Age 72)</div>
                <div className="text-slate-700 text-[11px] mt-0.5">Enrolled Healthier SG, Diabetes</div>
              </button>
              <button
                onClick={() => applyPreset('working_adult_chas')}
                className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-left transition"
              >
                <div className="font-bold text-blue-900">Adult with Asthma (Age 48)</div>
                <div className="text-slate-700 text-[11px] mt-0.5">CHAS Blue, SC</div>
              </button>
              <button
                onClick={() => applyPreset('expecting_mother')}
                className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg text-left transition"
              >
                <div className="font-bold text-blue-900">Expecting Mother (Age 31)</div>
                <div className="text-slate-700 text-[11px] mt-0.5">Pregnant, SC Citizen</div>
              </button>
            </div>
            <p className="text-[11px] text-slate-700 mt-2 italic">
              Note: Sample scenarios are labeled examples and do not represent actual individual patient records.
            </p>
          </div>
        )}
      </div>

      {/* Voluntary In-Memory Questionnaire Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-900 text-sm sm:text-base">
            Voluntary Profile Factors (Stored in Memory Only)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Age Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Age (Years) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="18"
              max="110"
              placeholder="e.g. 68"
              value={profile.age ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                onUpdateProfile({ ...profile, age: isNaN(val as any) ? null : val });
              }}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <p className="text-[11px] text-slate-700 mt-1">
              Adult schedule applies from 18 years upwards.
            </p>
          </div>

          {/* Citizenship / Residency */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Citizenship / Residency Status
            </label>
            <select
              value={profile.citizenship || ''}
              onChange={(e) => {
                const val = (e.target.value || null) as CitizenshipType | null;
                onUpdateProfile({ ...profile, citizenship: val });
              }}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="">Select status...</option>
              <option value="SC">Singapore Citizen (SC)</option>
              <option value="PR">Permanent Resident (PR)</option>
              <option value="OTHER">Other / Non-Resident</option>
            </select>
            <p className="text-[11px] text-slate-700 mt-1">
              Government subsidy tiers differ for SC and PR.
            </p>
          </div>

          {/* Healthier SG Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Healthier SG Status
            </label>
            <select
              value={profile.healthierSgStatus || ''}
              onChange={(e) => {
                const val = (e.target.value || null) as HealthierSgType | null;
                onUpdateProfile({ ...profile, healthierSgStatus: val });
              }}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="">Select enrolment status...</option>
              <option value="ENROLLED_AT_ENROLLED_CLINIC">Enrolled & Visiting Enrolled Clinic ($0 Co-pay Eligible)</option>
              <option value="ENROLLED_OTHER_CLINIC">Enrolled, but visiting a different clinic</option>
              <option value="NOT_ENROLLED">Not Enrolled in Healthier SG</option>
            </select>
            <p className="text-[11px] text-slate-700 mt-1">
              $0 co-payment applies when SC receives recommended vaccines at their designated enrolled clinic.
            </p>
          </div>

          {/* Subsidy Card Tier */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subsidy Card / Cohort Category
            </label>
            <select
              value={profile.subsidyTier || ''}
              onChange={(e) => {
                const val = (e.target.value || null) as SubsidyTierType | null;
                onUpdateProfile({ ...profile, subsidyTier: val });
              }}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="">Select tier if applicable...</option>
              <option value="PIONEER">Pioneer Generation (PG)</option>
              <option value="MERDEKA">Merdeka Generation (MG)</option>
              <option value="CHAS_BLUE">CHAS Blue</option>
              <option value="CHAS_ORANGE">CHAS Orange</option>
              <option value="CHAS_GREEN">CHAS Green</option>
              <option value="NONE">General / None</option>
            </select>
            <p className="text-[11px] text-slate-700 mt-1">
              Age 65+ does not automatically confer Pioneer Generation or CHAS.
            </p>
          </div>
        </div>

        {/* Chronic Conditions & Risk Factors */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Qualifying Health Factors & Chronic Conditions (Voluntary)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {[
              { id: 'diabetes', label: 'Diabetes Mellitus' },
              { id: 'heart', label: 'Chronic Heart Disease' },
              { id: 'lung', label: 'Chronic Lung (Asthma / COPD)' },
              { id: 'renal_liver', label: 'Chronic Kidney / Liver Disease' },
              { id: 'immuno', label: 'Immunocompromised Condition' },
              { id: 'pregnant', label: 'Currently Pregnant' },
            ].map((item) => {
              const isChecked = item.id === 'immuno'
                ? profile.isImmunocompromised === true
                : item.id === 'pregnant'
                ? profile.isPregnant === true
                : profile.chronicConditions?.includes(item.id);

              return (
                <label
                  key={item.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                    isChecked
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-medium'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(isChecked)}
                    onChange={() => {
                      if (item.id === 'immuno') {
                        onUpdateProfile({ ...profile, isImmunocompromised: !profile.isImmunocompromised });
                      } else if (item.id === 'pregnant') {
                        onUpdateProfile({ ...profile, isPregnant: !profile.isPregnant });
                      } else {
                        toggleCondition(item.id);
                      }
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Evaluated Schedule Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Deterministic Schedule & Subsidy Matching</span>
          </h2>
          <span className="text-xs text-slate-700">
            {evaluationResults.length} Evaluated Rules
          </span>
        </div>

        {evaluationResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-700">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">Please enter your age above to generate matching guidance.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {evaluationResults.map(({ vaccine, evaluation }) => {
              const isMatch = evaluation.state === 'MATCHES_CRITERIA';
              const isInsufficient = evaluation.state === 'INSUFFICIENT_INFO';
              const isNotMatch = evaluation.state === 'DOES_NOT_MATCH';

              return (
                <div
                  key={vaccine.id}
                  className={`bg-white rounded-2xl border transition p-5 shadow-sm space-y-3 ${
                    isMatch
                      ? 'border-emerald-200 ring-1 ring-emerald-100'
                      : isInsufficient
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200 opacity-85'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {vaccine.name}
                      </h3>
                      <span className="text-xs text-slate-700 block">
                        Target: {vaccine.diseaseTarget}
                      </span>
                    </div>

                    {/* Deterministic State Badge */}
                    <div className="self-start sm:self-center">
                      {isMatch && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          May meet published criteria
                        </span>
                      )}
                      {isInsufficient && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                          Insufficient Information
                        </span>
                      )}
                      {isNotMatch && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          Does not match criteria
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recommendation / Evaluation Body */}
                  <div className="text-xs sm:text-sm text-slate-700 space-y-2">
                    {evaluation.clinicalNotice && (
                      <p className="font-medium text-slate-900">
                        {evaluation.clinicalNotice}
                      </p>
                    )}
                    {evaluation.reason && (
                      <p className="text-slate-650">
                        {evaluation.reason}
                      </p>
                    )}

                    {/* Subsidy match notice */}
                    {evaluation.subsidyNotice && (
                      <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-blue-950 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] uppercase tracking-wider text-blue-800">
                            Subsidy Policy Context
                          </span>
                          {evaluation.coPaymentCap && (
                            <span className="text-xs font-extrabold text-blue-700">
                              {evaluation.coPaymentCap}
                            </span>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed">
                          {evaluation.subsidyNotice}
                        </p>
                      </div>
                    )}

                    {evaluation.providerAction && (
                      <p className="text-[11px] text-slate-700 italic">
                        <strong>Doctor Discussion Point:</strong> {evaluation.providerAction}
                      </p>
                    )}
                  </div>

                  {/* Provenance & Rule Metadata */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        {evaluation.ruleId}
                      </span>
                      <span>Locator: {evaluation.evidenceLocator}</span>
                    </div>
                    <span className="font-medium text-slate-700">Source: NAIS Sept 2025</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Assistant prompt banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Have questions about your recommended schedule?
          </h4>
          <p className="text-xs text-blue-900 mt-0.5">
            Ask our evidence-grounded assistant for verified references from NAIS and PubMed.
          </p>
        </div>
        <button
          onClick={onOpenAssistant}
          className="self-start sm:self-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm flex-shrink-0"
        >
          <span>Ask Evidence Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
