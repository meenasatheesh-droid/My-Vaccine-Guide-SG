/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DisclaimerModal } from './components/DisclaimerModal';
import { AssistantModal } from './components/AssistantModal';
import { HomeView } from './components/HomeView';
import { GuideMeView } from './components/GuideMeView';
import { VaccinesView } from './components/VaccinesView';
import { EvidenceView } from './components/EvidenceView';
import { 
  TabType, 
  VoluntaryProfile, 
  VaccineItem, 
  EvaluatedResult, 
  EnvironmentSnapshot 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState('');

  const [mcpConnected, setMcpConnected] = useState(false);
  const [environment, setEnvironment] = useState<EnvironmentSnapshot | null>(null);
  const [loadingEnv, setLoadingEnv] = useState(true);

  const [vaccines, setVaccines] = useState<VaccineItem[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<EvaluatedResult[]>([]);

  // Voluntary Profile (in-memory only, no PII, no persistence)
  const [voluntaryProfile, setVoluntaryProfile] = useState<VoluntaryProfile>({
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

  // Fetch initial environment & vaccines
  useEffect(() => {
    const fetchEnv = async () => {
      setLoadingEnv(true);
      try {
        const res = await fetch('/api/environment');
        if (res.ok) {
          const json = await res.json();
          setEnvironment(json);
        }
      } catch (err) {
        console.warn('Environment fetch failed:', err);
      } finally {
        setLoadingEnv(false);
      }
    };

    const fetchMcp = async () => {
      try {
        const res = await fetch('/api/mcp/check');
        if (res.ok) {
          const json = await res.json();
          setMcpConnected(Boolean(json.connected));
        }
      } catch (err) {
        console.warn('MCP connection check error:', err);
      }
    };

    const fetchVaccinesList = async () => {
      try {
        const res = await fetch('/api/vaccines');
        if (res.ok) {
          const json = await res.json();
          setVaccines(json.vaccines || []);
        }
      } catch (err) {
        console.warn('Vaccines fetch failed:', err);
      }
    };

    fetchEnv();
    fetchMcp();
    fetchVaccinesList();
  }, []);

  // Run deterministic evaluation whenever profile changes
  useEffect(() => {
    const runEvaluation = async () => {
      if (voluntaryProfile.age === null || voluntaryProfile.age === undefined) {
        setEvaluationResults([]);
        return;
      }
      try {
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: voluntaryProfile })
        });
        if (res.ok) {
          const json = await res.json();
          setEvaluationResults(json.results || []);
        }
      } catch (err) {
        console.warn('Evaluation failed:', err);
      }
    };

    runEvaluation();
  }, [voluntaryProfile]);

  const handleOpenAssistant = (query = '') => {
    setAssistantQuery(query);
    setAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        onOpenDisclaimer={() => setDisclaimerOpen(true)}
        onOpenAssistant={() => handleOpenAssistant()}
        mcpConnected={mcpConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
        {activeTab === 'home' && (
          <HomeView
            environment={environment}
            loadingEnv={loadingEnv}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAssistant={() => handleOpenAssistant()}
          />
        )}

        {activeTab === 'guide' && (
          <GuideMeView
            profile={voluntaryProfile}
            onUpdateProfile={(newProfile) => setVoluntaryProfile(newProfile)}
            evaluationResults={evaluationResults}
            onOpenAssistant={() => handleOpenAssistant('Help me understand my personalized vaccine results')}
          />
        )}

        {activeTab === 'vaccines' && (
          <VaccinesView
            vaccines={vaccines}
            onOpenAssistant={(q) => handleOpenAssistant(q)}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceView
            onOpenAssistant={(q) => handleOpenAssistant(q)}
          />
        )}
      </main>

      {/* Bottom Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
      />

      {/* Modals */}
      <DisclaimerModal
        isOpen={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
      />

      <AssistantModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        initialQuery={assistantQuery}
        voluntaryProfile={voluntaryProfile}
      />
    </div>
  );
}
