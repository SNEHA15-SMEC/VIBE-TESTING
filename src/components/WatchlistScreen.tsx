import React, { useState } from 'react';
import { MarketItem } from '../types/market';
import { Sparkline } from './Sparkline';
import {
  PRIMARY_INDICES,
  US_STOCKS,
  CATEGORY_MARKETS,
} from '../data/mockMarketData';

interface WatchlistScreenProps {
  watchlistIds: string[];
  onToggleWatchlist: (id: string) => void;
  onSelectSymbol: (item: MarketItem) => void;
  onOpenSearch: () => void;
}

export const WatchlistScreen: React.FC<WatchlistScreenProps> = ({
  watchlistIds,
  onToggleWatchlist,
  onSelectSymbol,
  onOpenSearch,
}) => {
  const [filter, setFilter] = useState<'All' | 'Indices' | 'Stocks' | 'Crypto'>('All');
  const [sortBy, setSortBy] = useState<'symbol' | 'change' | 'price'>('change');
  const [sortAsc, setSortAsc] = useState(false);

  // Pool of all symbols
  const allSymbols: MarketItem[] = [
    ...PRIMARY_INDICES,
    ...US_STOCKS,
    ...(CATEGORY_MARKETS['Crypto'] || []),
    ...(CATEGORY_MARKETS['Futures'] || []),
    ...(CATEGORY_MARKETS['Forex'] || []),
  ];

  const watchlistItems = allSymbols.filter((item) => watchlistIds.includes(item.id));

  const filteredItems = watchlistItems.filter((item) => {
    if (filter === 'Indices') return item.category === 'Indices';
    if (filter === 'Stocks') return item.category === 'US stocks';
    if (filter === 'Crypto') return item.category === 'Crypto';
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'symbol') diff = a.symbol.localeCompare(b.symbol);
    if (sortBy === 'change') diff = a.changePercent - b.changePercent;
    if (sortBy === 'price') diff = a.price - b.price;
    return sortAsc ? diff : -diff;
  });

  return (
    <div className="w-full max-w-md mx-auto pb-20 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-extrabold text-tv-dark">My Watchlist</h1>
          <p className="text-xs text-tv-gray">
            {watchlistItems.length} instrument{watchlistItems.length !== 1 ? 's' : ''} tracked
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Add Symbol button */}
          <button
            id="btn-add-symbol"
            onClick={onOpenSearch}
            className="p-2 bg-tv-lightGray hover:bg-gray-200 text-tv-dark rounded-full transition cursor-pointer"
            title="Add Symbol"
          >
            <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Sort toggle */}
          <button
            onClick={() => {
              if (sortBy === 'change') {
                setSortBy('symbol');
              } else if (sortBy === 'symbol') {
                setSortBy('price');
              } else {
                setSortBy('change');
              }
              setSortAsc(!sortAsc);
            }}
            className="px-2.5 py-1.5 bg-tv-lightGray hover:bg-gray-200 text-tv-dark text-xs font-semibold rounded-lg transition flex items-center space-x-1 cursor-pointer"
          >
            <span>Sort: {sortBy}</span>
            <span>{sortAsc ? '↑' : '↓'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 mb-4">
        {(['All', 'Indices', 'Stocks', 'Crypto'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 text-xs rounded-full transition whitespace-nowrap cursor-pointer ${
              filter === cat
                ? 'bg-tv-dark text-white font-bold'
                : 'bg-tv-lightGray text-tv-dark font-medium hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items List */}
      {sortedItems.length === 0 ? (
        <div className="bg-white border border-tv-border rounded-2xl p-8 text-center mt-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-tv-blue mx-auto flex items-center justify-center mb-3">
            <svg className="w-6 h-6 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="font-bold text-tv-dark text-base mb-1">Your watchlist is empty</h3>
          <p className="text-xs text-tv-gray mb-4">
            Search and add indices, stocks, and crypto to monitor real-time prices.
          </p>
          <button
            onClick={onOpenSearch}
            className="px-4 py-2 bg-tv-blue text-white font-semibold text-xs rounded-full shadow-sm hover:opacity-90 transition"
          >
            Add instruments
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sortedItems.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={item.id}
                onClick={() => onSelectSymbol(item)}
                className="bg-white border border-tv-border rounded-xl p-3.5 flex items-center justify-between hover:shadow-sm active:scale-[0.99] transition cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs"
                    style={{ backgroundColor: item.badgeBg || '#1e3a8a' }}
                  >
                    {item.badgeText || item.symbol.slice(0, 2)}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-tv-dark">{item.symbol}</div>
                    <div className="text-[11px] text-tv-gray">{item.name}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-16 h-8 hidden sm:block">
                    <Sparkline data={item.sparklineData} isPositive={isPositive} className="w-16 h-8" />
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-tv-dark">
                      ${item.price > 100 ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : item.price}
                    </div>
                    <div
                      className={`text-xs font-bold px-1.5 py-0.5 rounded inline-block ${
                        isPositive ? 'text-tv-green bg-tv-greenBg' : 'text-tv-red bg-tv-redBg'
                      }`}
                    >
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  {/* Remove quick action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition"
                    title="Remove from watchlist"
                  >
                    <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
