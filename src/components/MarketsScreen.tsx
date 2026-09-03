import React, { useState } from 'react';
import { Sparkline } from './Sparkline';
import { MarketItem, CategoryFilter, TrendSegment } from '../types/market';
import {
  PRIMARY_INDICES,
  WORLD_INDICES,
  US_STOCKS,
  COMMUNITY_TRENDS,
  CATEGORY_MARKETS
} from '../data/mockMarketData';

interface MarketsScreenProps {
  onSelectSymbol: (item: Partial<MarketItem>) => void;
  onOpenChart: (symbolId: string) => void;
  onOpenCategoryMenu?: () => void;
}

const CATEGORIES: CategoryFilter[] = [
  'Indices',
  'Futures',
  'Forex',
  'Government bonds',
  'Crypto',
  'US stocks',
];

export const MarketsScreen: React.FC<MarketsScreenProps> = ({
  onSelectSymbol,
  onOpenChart,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Indices');
  const [activeTrendSegment, setActiveTrendSegment] = useState<TrendSegment>('Most active');
  const [regionFilter, setRegionFilter] = useState<'All' | 'Americas' | 'Europe' | 'Asia'>('All');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  const formatPrice = (price: number, isForexOrBond = false) => {
    if (isForexOrBond) return price.toFixed(4);
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <main className="w-full max-w-md mx-auto pb-6">
      {/* Title and Category Header */}
      <section className="px-4 pt-6 pb-2" data-purpose="page-title-section">
        <div className="relative">
          <div
            id="heading-markets-dropdown"
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className="flex items-center space-x-2 cursor-pointer group select-none"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-tv-dark">
              Markets, everywhere
            </h1>
            <svg
              className={`w-6 h-6 stroke-[2.5] text-tv-dark transform transition-transform duration-200 ${
                showRegionDropdown ? 'rotate-180' : 'group-hover:translate-y-0.5'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Region Dropdown menu */}
          {showRegionDropdown && (
            <div className="absolute top-10 left-0 z-30 bg-white border border-tv-border rounded-xl shadow-xl py-1 w-44 text-sm font-medium animate-in fade-in zoom-in-95">
              {(['All', 'Americas', 'Europe', 'Asia'] as const).map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    setRegionFilter(region);
                    setShowRegionDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-tv-lightGray transition flex items-center justify-between ${
                    regionFilter === region ? 'text-tv-blue font-bold bg-blue-50/50' : 'text-tv-dark'
                  }`}
                >
                  <span>{region}</span>
                  {regionFilter === region && (
                    <svg className="w-4 h-4 text-tv-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4.5 12.75l6 6 9-13.5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Horizontal Pill Filter Tabs */}
        <div className="mt-4 flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`pill-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-sm rounded-full shrink-0 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'font-semibold bg-tv-dark text-white shadow-sm'
                    : 'font-medium bg-tv-lightGray hover:bg-gray-200 text-tv-dark'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* When a specific non-Indices category is selected, show its featured items directly */}
      {activeCategory !== 'Indices' && (
        <section className="mt-4 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-tv-dark">{activeCategory} overview</h2>
            <span className="text-xs text-tv-gray">Real-time quotes</span>
          </div>
          <div className="space-y-2.5">
            {(CATEGORY_MARKETS[activeCategory] || []).map((item) => {
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectSymbol(item)}
                  className="bg-white border border-tv-border rounded-xl p-3.5 flex items-center justify-between hover:shadow-sm active:scale-[0.99] transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs"
                      style={{ backgroundColor: item.badgeBg || '#2563eb' }}
                    >
                      {item.badgeText}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-tv-dark">{item.symbol}</div>
                      <div className="text-[11px] text-tv-gray">{item.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-8 hidden xs:block">
                      <Sparkline data={item.sparklineData} isPositive={isPositive} className="w-16 h-8" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-tv-dark">
                        {item.price > 100 ? formatPrice(item.price) : item.price}
                      </div>
                      <div
                        className={`text-xs font-bold px-1.5 py-0.5 rounded inline-block ${
                          isPositive ? 'text-tv-green bg-tv-greenBg' : 'text-tv-red bg-tv-redBg'
                        }`}
                      >
                        {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Primary Indices Cards Carousel */}
      <section className="mt-4 px-4" data-purpose="primary-indices-carousel">
        <div className="flex space-x-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 snap-x snap-mandatory">
          {PRIMARY_INDICES.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <article
                key={item.id}
                id={`card-index-${item.id}`}
                onClick={() => onSelectSymbol(item)}
                className="w-[280px] shrink-0 bg-white border border-tv-border rounded-2xl p-4 snap-start hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: item.badgeBg }}
                  >
                    {item.badgeText}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-tv-dark leading-tight">{item.symbol}</h2>
                    <span className="text-[11px] font-medium text-tv-gray">{item.name}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <div className="text-xl font-extrabold text-tv-dark tracking-tight">
                    {formatPrice(item.price)}
                  </div>
                  <div
                    className={`text-xs font-semibold flex items-center space-x-0.5 ${
                      isPositive ? 'text-tv-green' : 'text-tv-red'
                    }`}
                  >
                    <span>{isPositive ? '▲ +' : '▼ '}{Math.abs(item.change).toFixed(2)}</span>
                    <span
                      className={`ml-1 text-[11px] px-1.5 py-0.5 rounded font-bold ${
                        isPositive ? 'bg-tv-greenBg' : 'bg-tv-redBg'
                      }`}
                    >
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Micro Sparkline SVG Chart */}
                <div className="mt-2 h-14 w-full">
                  <Sparkline data={item.sparklineData} isPositive={isPositive} />
                </div>

                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-tv-gray">
                  <span>Range: {formatPrice(item.rangeLow || 0)} - {formatPrice(item.rangeHigh || 0)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChart(item.id);
                    }}
                    className="font-medium text-blue-600 hover:text-blue-700 transition cursor-pointer"
                  >
                    Overview ›
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* World Indices Section */}
      <section className="mt-8 px-4" data-purpose="world-indices-section">
        <button
          onClick={() => setActiveCategory('Indices')}
          className="inline-flex items-center space-x-1.5 group text-left cursor-pointer"
        >
          <h2 className="text-2xl font-extrabold text-tv-dark group-hover:text-blue-600 transition">
            World indices
          </h2>
          <svg
            className="w-5 h-5 stroke-[2.5] text-tv-dark group-hover:text-blue-600 group-hover:translate-x-0.5 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* World Indices Carousel */}
        <div className="mt-3.5 flex space-x-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 snap-x snap-mandatory">
          {WORLD_INDICES.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={item.id}
                id={`card-world-${item.id}`}
                onClick={() => onSelectSymbol(item)}
                className="w-[260px] shrink-0 bg-white border border-tv-border rounded-2xl p-4 snap-start hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className="w-9 h-9 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: item.badgeBg }}
                  >
                    {item.badgeText}
                  </span>
                  <div>
                    <div className="text-base font-bold text-tv-dark leading-snug">{item.symbol}</div>
                    <div className="text-xs text-tv-gray">{item.name}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-tv-dark">{formatPrice(item.price)}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isPositive ? 'text-tv-green bg-tv-greenBg' : 'text-tv-red bg-tv-redBg'
                    }`}
                  >
                    {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* US Stocks Section */}
      <section className="mt-8 px-4" data-purpose="us-stocks-section">
        <button
          onClick={() => setActiveCategory('US stocks')}
          className="inline-flex items-center space-x-2 group text-left cursor-pointer"
        >
          {/* US Flag badge icon */}
          <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-base shadow-xs overflow-hidden border border-gray-200">
            🇺🇸
          </span>
          <h2 className="text-2xl font-extrabold text-tv-dark group-hover:text-blue-600 transition">
            US stocks
          </h2>
          <svg
            className="w-5 h-5 stroke-[2.5] text-tv-dark group-hover:text-blue-600 group-hover:translate-x-0.5 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Stock Ticker Horizontal Scroll Cards */}
        <div className="mt-3.5 flex space-x-3.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2 snap-x snap-mandatory">
          {US_STOCKS.map((stock) => {
            const isPositive = stock.change >= 0;
            return (
              <div
                key={stock.id}
                id={`card-stock-${stock.id}`}
                onClick={() => onSelectSymbol(stock)}
                className="w-[260px] shrink-0 bg-white border border-tv-border rounded-2xl p-4 snap-start hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {stock.iconType === 'nvidia' && (
                    <div className="w-9 h-9 rounded-full bg-[#76B900] flex items-center justify-center text-white shrink-0 p-1.5 shadow-sm">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M8.9 7.4c1.6-.7 3.3-.9 5-.5.9.2 1.8.6 2.6 1.2.6.4.7 1.2.3 1.7-.4.6-1.2.7-1.7.3-.6-.4-1.3-.7-2-.8-1.2-.3-2.5-.1-3.7.4-1.7.7-3.1 2-3.8 3.7-.7 1.7-.7 3.6 0 5.3.3.7.7 1.4 1.2 2 .5.5.4 1.3-.1 1.8-.5.5-1.3.4-1.8-.1-.7-.8-1.2-1.7-1.6-2.6-.9-2.2-.9-4.7 0-6.9.9-2.2 2.7-3.9 4.9-4.8l.2-.2zm3.1-4.4c2.8 0 5.6.8 8 2.3 1 .6 1.3 1.9.7 2.9-.6 1-1.9 1.3-2.9.7-1.9-1.2-4.1-1.8-6.3-1.8-2.6 0-5.1.9-7.1 2.5-.8.7-2.1.6-2.8-.2-.7-.8-.6-2.1.2-2.8 2.6-2.1 5.8-3.3 9.2-3.4l1-.2zm0 6.8c1.3 0 2.6.5 3.5 1.5 1 1 1.5 2.3 1.5 3.7 0 1.4-.5 2.7-1.5 3.7-1 1-2.3 1.5-3.7 1.5-1.4 0-2.7-.5-3.7-1.5-1-1-1.5-2.3-1.5-3.7 0-1.4.5-2.7 1.5-3.7 1-1 2.4-1.5 3.9-1.5z" />
                      </svg>
                    </div>
                  )}

                  {stock.iconType === 'apple' && (
                    <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white shrink-0 p-2 shadow-sm">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.93-14.33-6.74-10.33-12.03-22.04-15.86-35.13-3.83-13.09-5.74-25.29-5.74-36.6 0-14.24 3.73-26.06 11.19-35.47 7.46-9.41 16.74-14.23 27.84-14.48 4.7 0 10.06 1.25 16.08 3.75 6.03 2.5 10.04 3.75 12.03 3.75 1.57 0 5.8-1.32 12.68-3.95 6.88-2.63 12.63-3.8 17.25-3.5 12.82.75 22.95 5.51 30.39 14.29-11.23 6.8-16.73 16.32-16.51 28.56.22 9.61 3.94 17.65 11.16 24.12 7.22 6.47 15.75 10.15 25.59 11.04-2.24 6.74-5.01 13.52-8.32 20.34zM119.22 33.7c0-7.35 2.65-14.32 7.95-20.91 5.3-6.59 11.83-10.82 19.59-12.69.75 7.12-1.63 14.1-7.14 20.94-5.51 6.84-12.31 11.06-20.4 12.66z" />
                      </svg>
                    </div>
                  )}

                  {stock.iconType === 'microsoft' && (
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-gray-200">
                      <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                        <div className="bg-[#F25022] rounded-[1px]" />
                        <div className="bg-[#7FBA00] rounded-[1px]" />
                        <div className="bg-[#00A4EF] rounded-[1px]" />
                        <div className="bg-[#FFB900] rounded-[1px]" />
                      </div>
                    </div>
                  )}

                  {stock.iconType !== 'nvidia' && stock.iconType !== 'apple' && stock.iconType !== 'microsoft' && (
                    <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                      {stock.symbol.slice(0, 2)}
                    </div>
                  )}

                  <div>
                    <div className="text-base font-bold text-tv-dark leading-tight">{stock.symbol}</div>
                    <div className="text-xs text-tv-gray">{stock.name}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-tv-dark">${formatPrice(stock.price)}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isPositive ? 'text-tv-green bg-tv-greenBg' : 'text-tv-red bg-tv-redBg'
                    }`}
                  >
                    {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-tv-gray">Cap: {stock.marketCap}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Community Trends / Market Movers List Section */}
      <section className="mt-8 px-4" data-purpose="market-movers-section">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-tv-dark">Community trends</h2>
          <button
            onClick={() => setActiveCategory('US stocks')}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            See all
          </button>
        </div>

        {/* Segment Switcher Tabs */}
        <div className="mt-3 flex items-center space-x-1.5 p-1 bg-tv-lightGray rounded-xl text-xs font-semibold">
          {(['Most active', 'Gainers', 'Losers', 'Volatile'] as TrendSegment[]).map((segment) => {
            const isActive = activeTrendSegment === segment;
            return (
              <button
                key={segment}
                id={`btn-trend-${segment.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveTrendSegment(segment)}
                className={`flex-1 py-1.5 text-center rounded-lg transition cursor-pointer ${
                  isActive
                    ? 'bg-white shadow-xs text-tv-dark font-bold'
                    : 'text-tv-gray hover:text-tv-dark font-medium'
                }`}
              >
                {segment}
              </button>
            );
          })}
        </div>

        {/* Mover Stock Rows */}
        <div className="mt-3 divide-y divide-gray-100 border-t border-b border-gray-100">
          {COMMUNITY_TRENDS[activeTrendSegment].map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={item.symbol}
                id={`row-trend-${item.symbol}`}
                onClick={() =>
                  onSelectSymbol({
                    symbol: item.symbol,
                    name: item.name,
                    price: item.price,
                    change: item.change,
                    changePercent: item.changePercent,
                    category: 'US stocks',
                    exchange: 'NASDAQ',
                  })
                }
                className="py-3 flex items-center justify-between hover:bg-gray-50/70 -mx-2 px-2 rounded-lg transition cursor-pointer active:bg-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.avatarBg, color: item.avatarColor }}
                  >
                    {item.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-tv-dark">{item.symbol}</div>
                    <div className="text-[11px] text-tv-gray">{item.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-tv-dark">${formatPrice(item.price)}</div>
                  <div className={`text-xs font-bold ${isPositive ? 'text-tv-green' : 'text-tv-red'}`}>
                    {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Category Footer Links */}
      <footer className="mt-8 px-4 py-6 bg-slate-50 border-t border-tv-border rounded-t-3xl" data-purpose="mobile-footer">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <span className="text-xs font-bold text-tv-dark tracking-wide uppercase">Markets Directory</span>
          <span className="text-xs text-tv-gray font-medium">Supercharts • Data</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-tv-gray font-medium">
          <button
            onClick={() => setActiveCategory('Indices')}
            className="py-1 text-left hover:text-tv-dark transition cursor-pointer"
          >
            Indices Overview
          </button>
          <button
            onClick={() => setActiveCategory('US stocks')}
            className="py-1 text-left hover:text-tv-dark transition cursor-pointer"
          >
            Stock Screeners
          </button>
          <button
            onClick={() => setActiveCategory('Crypto')}
            className="py-1 text-left hover:text-tv-dark transition cursor-pointer"
          >
            Crypto Heatmap
          </button>
          <button
            onClick={() => setActiveCategory('Futures')}
            className="py-1 text-left hover:text-tv-dark transition cursor-pointer"
          >
            Earnings Calendar
          </button>
          <button
            onClick={() => setActiveCategory('Forex')}
            className="py-1 text-left hover:text-tv-dark transition cursor-pointer"
          >
            Forex Rates
          </button>
          <button
            onClick={() => setActiveCategory('Government bonds')}
            className="py-1 text-left hover:text-tv-dark transition cursor-pointer"
          >
            Yield Curves
          </button>
        </div>
        <div className="mt-6 text-center text-[11px] text-tv-gray">
          © 2026 TradingView, Inc. • Select data provided by ICE Data Services.
        </div>
      </footer>
    </main>
  );
};
