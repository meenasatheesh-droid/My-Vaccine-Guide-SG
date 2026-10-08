import React from 'react';
import { Home, Compass, ShieldCheck, Database } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'guide' as TabType, label: 'Guide Me', icon: Compass },
    { id: 'vaccines' as TabType, label: 'Vaccines', icon: ShieldCheck },
    { id: 'evidence' as TabType, label: 'Evidence', icon: Database },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 sm:py-2">
      <div className="max-w-md mx-auto px-4 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-700 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg transition ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
