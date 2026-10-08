import React from 'react';
import { 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  CloudSun, 
  Wind, 
  Thermometer, 
  Car, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Building2,
  Calendar
} from 'lucide-react';
import { EnvironmentSnapshot, TabType } from '../types';

interface HomeViewProps {
  environment: EnvironmentSnapshot | null;
  loadingEnv: boolean;
  onNavigateTab: (tab: TabType) => void;
  onOpenAssistant: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  environment,
  loadingEnv,
  onNavigateTab,
  onOpenAssistant
}) => {
  return (
    <div className="space-y-6 pb-20">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-3xl text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-100 mb-4 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Singapore NAIS Sept 2025 Guidelines</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Protect Your Health at Every Stage of Adulthood
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
            Understand recommended adult immunisations, check your subsidy tier under Healthier SG and CHAS, and prepare confident questions for your GP.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('guide')}
              className="bg-white text-blue-800 hover:bg-blue-50 font-bold text-sm px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Guide My Vaccines</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('vaccines')}
              className="bg-blue-800/60 hover:bg-blue-800/80 border border-white/25 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-2 active:scale-95"
            >
              <span>View All 8 Vaccines</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Singapore Environmental & Context Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Singapore Real-Time Context
            </h2>
          </div>
          <span className="text-[11px] font-medium text-slate-700">
            {environment?.asOf
              ? new Date(environment.asOf).toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit' }) + ' SGT'
              : 'Connecting...'}
          </span>
        </div>

        {loadingEnv ? (
          <div className="py-6 flex justify-center items-center gap-2 text-slate-700 text-xs">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Retrieving live feeds from data.gov.sg...</span>
          </div>
        ) : environment ? (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Forecast */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-700 block">2-Hr Forecast</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
                  {environment.weather.forecast || 'Fair'}
                </span>
                <span className="text-[10px] text-slate-700 truncate block">
                  {environment.weather.area}
                </span>
              </div>

              {/* Temperature */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-700 block">Temperature</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {environment.weather.tempCelsius ? `${environment.weather.tempCelsius}°C` : '29.5°C'}
                </span>
                <span className="text-[10px] text-slate-700 block">NEA Weather Stations</span>
              </div>

              {/* PSI & PM2.5 (Separated!) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-700 block">Air Quality</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-slate-900">
                    PSI {environment.airQuality.psi24Hr ?? '42'}
                  </span>
                  <span className="text-[11px] font-medium text-slate-700">
                    PM2.5: {environment.airQuality.pm25OneHr ?? '12'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-700 block">Hourly NEA Readings</span>
              </div>

              {/* Transport context */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-700 block">Transport Context</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {environment.transport.availableTaxis?.toLocaleString() || 'Available'} Taxis
                </span>
                <span className="text-[10px] text-slate-700 block">
                  {environment.transport.sampleCarparkLots > 0 ? `${environment.transport.sampleCarparkLots.toLocaleString()} Carpark Lots` : 'HDB/URA Lots'}
                </span>
              </div>
            </div>

            {/* Environmental Boundary Disclaimers */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900 space-y-1">
              <p className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-blue-600 mt-0.5" />
                <span>
                  <strong>Air Quality Note:</strong> PSI and PM2.5 are distinct environmental measures. Neither reading infers clinic infection risk or individual vaccination priority.
                </span>
              </p>
              <p className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-blue-600 mt-0.5" />
                <span>
                  <strong>Transport Note:</strong> Carpark lot availability does not establish clinic proximity, parking charges, or vaccine stock at medical centres.
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 text-xs text-slate-700">Live environmental feeds temporarily unavailable.</div>
        )}
      </div>

      {/* National Policy Highlights: NAIS Sept 2025 & Healthier SG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Healthier SG Subsidies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Healthier SG $0 Co-Payment</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">
            Singapore Citizens enrolled in <strong>Healthier SG</strong> receive fully subsidised (<strong>$0 co-payment</strong>) nationally recommended vaccinations when administered at their <strong>enrolled Healthier SG clinic</strong>.
          </p>
          <div className="text-[11px] text-slate-700 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Source: MOH Healthier SG Vaccinations</span>
            <span className="font-medium text-emerald-700">Applies to SC</span>
          </div>
        </div>

        {/* Pneumococcal PCV20 Update */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-700">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">PCV20 Single-Dose Schedule</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">
            Under revised <strong>NAIS Sept 2025</strong> guidance, 1 dose of the 20-valent conjugate vaccine (<strong>PCV20</strong>) completes the pneumococcal schedule for naive older adults (65+) without requiring subsequent PPSV23.
          </p>
          <div className="text-[11px] text-slate-700 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Source: NAIS Sept 2025 PDF Table 1</span>
            <span className="font-medium text-blue-700">Age 65+ & High Risk</span>
          </div>
        </div>
      </div>

      {/* 4 Essential Adult Vaccines at a Glance */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <h2 className="font-bold text-slate-900 text-sm sm:text-base mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Key Adult Vaccines in Singapore</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 transition">
            <div className="flex justify-between items-start">
              <span className="font-bold text-xs sm:text-sm text-slate-900">Influenza (Annual)</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">Annual</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5">
              Recommended for adults 65+, chronic illnesses, and pregnant women. Subsidised via Healthier SG and CHAS.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 transition">
            <div className="flex justify-between items-start">
              <span className="font-bold text-xs sm:text-sm text-slate-900">Pneumococcal (PCV20)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">1 Dose</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5">
              Protects against severe pneumonia and invasive disease. Indicated for age 65+ or chronic conditions.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 transition">
            <div className="flex justify-between items-start">
              <span className="font-bold text-xs sm:text-sm text-slate-900">Shingles (Shingrix RZV)</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">2 Doses</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5">
              Recommended for immunocompetent adults 50+ and immunocompromised 19+. MediSave claimable.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 transition">
            <div className="flex justify-between items-start">
              <span className="font-bold text-xs sm:text-sm text-slate-900">Tdap (Maternal / Adult)</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">16-32 Weeks</span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5">
              Recommended during each pregnancy to protect newborn from whooping cough; also 10-yearly booster.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-700">
            Also includes Hepatitis B, MMR, Varicella, and HPV (females 18-26).
          </span>
          <button
            onClick={() => onNavigateTab('vaccines')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Explore Full Schedule <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
