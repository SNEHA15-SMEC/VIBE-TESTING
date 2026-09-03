import React from 'react';
import { TabType } from '../types/market';

interface BottomDockProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  watchlistCount?: number;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeTab,
  onSelectTab,
  watchlistCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-tv-border px-6 py-2 flex items-center justify-between text-[10px] font-semibold text-tv-gray">
      {/* Tab 1: Watchlist */}
      <button
        id="tab-watchlist"
        onClick={() => onSelectTab('watchlist')}
        className={`flex flex-col items-center space-y-1 transition cursor-pointer relative ${
          activeTab === 'watchlist' ? 'text-tv-blue font-bold' : 'hover:text-tv-dark'
        }`}
      >
        <div className="relative">
          <svg className={`w-5 h-5 ${activeTab === 'watchlist' ? 'stroke-[2.3]' : 'stroke-[2]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {watchlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-tv-blue text-white rounded-full text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
              {watchlistCount}
            </span>
          )}
        </div>
        <span>Watchlist</span>
      </button>

      {/* Tab 2: Chart */}
      <button
        id="tab-chart"
        onClick={() => onSelectTab('chart')}
        className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
          activeTab === 'chart' ? 'text-tv-blue font-bold' : 'hover:text-tv-dark'
        }`}
      >
        <svg className={`w-5 h-5 ${activeTab === 'chart' ? 'stroke-[2.3]' : 'stroke-[2]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Chart</span>
      </button>

      {/* Tab 3: Markets (Active by default) */}
      <button
        id="tab-markets"
        onClick={() => onSelectTab('markets')}
        className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
          activeTab === 'markets' ? 'text-tv-blue font-bold' : 'hover:text-tv-dark'
        }`}
      >
        <svg className={`w-5 h-5 ${activeTab === 'markets' ? 'stroke-[2.3]' : 'stroke-[2.2]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Markets</span>
      </button>

      {/* Tab 4: Community */}
      <button
        id="tab-community"
        onClick={() => onSelectTab('community')}
        className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
          activeTab === 'community' ? 'text-tv-blue font-bold' : 'hover:text-tv-dark'
        }`}
      >
        <svg className={`w-5 h-5 ${activeTab === 'community' ? 'stroke-[2.3]' : 'stroke-[2]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.508 1.333 1.508 2.316V18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Community</span>
      </button>

      {/* Tab 5: Menu */}
      <button
        id="tab-menu"
        onClick={() => onSelectTab('menu')}
        className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
          activeTab === 'menu' ? 'text-tv-blue font-bold' : 'hover:text-tv-dark'
        }`}
      >
        <svg className={`w-5 h-5 ${activeTab === 'menu' ? 'stroke-[2.3]' : 'stroke-[2]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Menu</span>
      </button>
    </nav>
  );
};
