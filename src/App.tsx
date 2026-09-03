/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, MarketItem } from './types/market';
import { INITIAL_WATCHLIST_IDS, PRIMARY_INDICES } from './data/mockMarketData';
import { Navbar } from './components/Navbar';
import { BottomDock } from './components/BottomDock';
import { MarketsScreen } from './components/MarketsScreen';
import { InteractiveChart } from './components/InteractiveChart';
import { WatchlistScreen } from './components/WatchlistScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { MenuScreen } from './components/MenuScreen';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { SearchModal } from './components/SearchModal';
import { GetStartedModal } from './components/GetStartedModal';
import { SideDrawer } from './components/SideDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('markets');
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : INITIAL_WATCHLIST_IDS;
    } catch {
      return INITIAL_WATCHLIST_IDS;
    }
  });

  // Modals & Drawers state
  const [selectedSymbolForModal, setSelectedSymbolForModal] = useState<Partial<MarketItem> | null>(null);
  const [chartSymbolId, setChartSymbolId] = useState<string>('spx');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // User auth state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('Sneha Menon');

  // Sync watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlistIds));
    } catch (e) {
      console.warn('Could not save watchlist to storage', e);
    }
  }, [watchlistIds]);

  const toggleWatchlist = (id: string) => {
    setWatchlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenChartForSymbol = (symbolIdOrTicker: string) => {
    // Check if it's an id or a ticker
    const match = PRIMARY_INDICES.find(
      (p) => p.id === symbolIdOrTicker || p.symbol.toLowerCase() === symbolIdOrTicker.toLowerCase()
    );
    setChartSymbolId(match ? match.id : symbolIdOrTicker.toLowerCase());
    setActiveTab('chart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSymbol = (item: Partial<MarketItem>) => {
    setSelectedSymbolForModal(item);
  };

  return (
    <div className="min-h-screen bg-white text-tv-dark font-sans antialiased selection:bg-blue-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      {/* Main Content View based on activeTab */}
      <div className="flex-1">
        {activeTab === 'markets' && (
          <MarketsScreen
            onSelectSymbol={handleSelectSymbol}
            onOpenChart={handleOpenChartForSymbol}
          />
        )}

        {activeTab === 'chart' && (
          <InteractiveChart
            initialSymbolId={chartSymbolId}
            onSelectSymbol={(item) => setChartSymbolId(item.id)}
            onBackToMarkets={() => setActiveTab('markets')}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistScreen
            watchlistIds={watchlistIds}
            onToggleWatchlist={toggleWatchlist}
            onSelectSymbol={handleSelectSymbol}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {activeTab === 'community' && (
          <CommunityScreen
            onOpenChartForSymbol={handleOpenChartForSymbol}
          />
        )}

        {activeTab === 'menu' && (
          <MenuScreen
            onOpenAuth={() => setIsAuthOpen(true)}
            isLoggedIn={isLoggedIn}
            userName={userName}
            onSelectCategory={() => {
              setActiveTab('markets');
            }}
            onOpenChart={() => setActiveTab('chart')}
          />
        )}
      </div>

      {/* Floating / Sticky Bottom App Dock */}
      <BottomDock
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        watchlistCount={watchlistIds.length}
      />

      {/* Modals & Slide-in Drawers */}
      {selectedSymbolForModal && (
        <SymbolDetailModal
          item={selectedSymbolForModal}
          onClose={() => setSelectedSymbolForModal(null)}
          onOpenChart={handleOpenChartForSymbol}
          isInWatchlist={watchlistIds.includes(selectedSymbolForModal.id || '')}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {isSearchOpen && (
        <SearchModal
          onClose={() => setIsSearchOpen(false)}
          onSelectSymbol={(item) => {
            setSelectedSymbolForModal(item);
          }}
        />
      )}

      <GetStartedModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(name) => {
          setIsLoggedIn(true);
          setUserName(name);
        }}
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserName('Trader');
        }}
        userName={userName}
      />

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />
    </div>
  );
}
