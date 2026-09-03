import React, { useState, useMemo } from 'react';
import { MarketItem } from '../types/market';
import {
  PRIMARY_INDICES,
  WORLD_INDICES,
  US_STOCKS,
  CATEGORY_MARKETS,
} from '../data/mockMarketData';

interface SearchModalProps {
  onClose: () => void;
  onSelectSymbol: (item: MarketItem) => void;
}

type SearchCategory = 'All' | 'Stocks' | 'Indices' | 'Crypto' | 'Forex' | 'Futures';

export const SearchModal: React.FC<SearchModalProps> = ({
  onClose,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('All');

  const allItems: MarketItem[] = useMemo(() => {
    return [
      ...PRIMARY_INDICES,
      ...WORLD_INDICES,
      ...US_STOCKS,
      ...(CATEGORY_MARKETS['Crypto'] || []),
      ...(CATEGORY_MARKETS['Forex'] || []),
      ...(CATEGORY_MARKETS['Futures'] || []),
    ];
  }, []);

  const results = useMemo(() => {
    return allItems.filter((item) => {
      // Category filter
      if (selectedCategory === 'Stocks' && item.category !== 'US stocks') return false;
      if (selectedCategory === 'Indices' && item.category !== 'Indices') return false;
      if (selectedCategory === 'Crypto' && item.category !== 'Crypto') return false;
      if (selectedCategory === 'Forex' && item.category !== 'Forex') return false;
      if (selectedCategory === 'Futures' && item.category !== 'Futures') return false;

      // Query filter
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.exchange.toLowerCase().includes(q)
      );
    });
  }, [allItems, selectedCategory, query]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center p-3 pt-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-tv-border rounded-2xl w-full max-w-md p-4 shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-top-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
          <svg className="w-5 h-5 text-tv-gray stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="text"
            autoFocus
            placeholder="Search symbol, company, index..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm font-semibold text-tv-dark placeholder:text-tv-gray outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-tv-dark rounded-full text-xs"
            >
              ✕
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-tv-blue hover:underline pl-1 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-2.5 -mx-1 px-1 border-b border-gray-100">
          {(['All', 'Stocks', 'Indices', 'Crypto', 'Forex', 'Futures'] as SearchCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-tv-dark text-white font-bold'
                  : 'bg-tv-lightGray text-tv-dark font-medium hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 mt-1">
          {results.length === 0 ? (
            <div className="py-10 text-center text-xs text-tv-gray">
              No results found for &quot;{query}&quot; in {selectedCategory}
            </div>
          ) : (
            results.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-gray-50 rounded-lg cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: item.badgeBg || '#131722' }}
                    >
                      {item.badgeText || item.symbol.slice(0, 2)}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-tv-dark flex items-center space-x-1.5">
                        <span>{item.symbol}</span>
                        <span className="text-[10px] text-tv-gray uppercase font-normal">{item.exchange}</span>
                      </div>
                      <div className="text-[11px] text-tv-gray line-clamp-1">{item.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-tv-dark">
                      ${item.price > 100 ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : item.price}
                    </div>
                    <div className={`text-[11px] font-semibold ${isPositive ? 'text-tv-green' : 'text-tv-red'}`}>
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
