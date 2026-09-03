import React from 'react';
import { MarketItem } from '../types/market';
import { Sparkline } from './Sparkline';

interface SymbolDetailModalProps {
  item: Partial<MarketItem> | null;
  onClose: () => void;
  onOpenChart: (id: string) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (id: string) => void;
}

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  item,
  onClose,
  onOpenChart,
  isInWatchlist,
  onToggleWatchlist,
}) => {
  if (!item) return null;

  const price = item.price || 0;
  const change = item.change || 0;
  const changePercent = item.changePercent || 0;
  const isPositive = change >= 0;

  const low52 = item.week52Low || price * 0.78;
  const high52 = item.week52High || price * 1.22;
  const positionRatio = Math.max(0, Math.min(1, (price - low52) / (high52 - low52 || 1)));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-tv-border rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle on mobile */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span
              className="w-10 h-10 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs"
              style={{ backgroundColor: item.badgeBg || '#131722' }}
            >
              {item.badgeText || item.symbol?.slice(0, 2) || 'TV'}
            </span>
            <div>
              <h2 className="text-lg font-black text-tv-dark leading-tight">{item.symbol}</h2>
              <p className="text-xs text-tv-gray">{item.name || item.exchange}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-tv-dark rounded-full hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Price & Change */}
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-3xl font-black text-tv-dark">
            ${price > 100 ? price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : price}
          </div>
          <div
            className={`text-sm font-bold px-2.5 py-1 rounded flex items-center space-x-1 ${
              isPositive ? 'text-tv-green bg-tv-greenBg' : 'text-tv-red bg-tv-redBg'
            }`}
          >
            <span>{isPositive ? '▲ +' : '▼ '}{Math.abs(change).toFixed(2)}</span>
            <span>({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)</span>
          </div>
        </div>

        {/* Mini Sparkline */}
        {item.sparklineData && (
          <div className="h-16 w-full mb-4 bg-gray-50/50 rounded-xl p-2 border border-gray-100">
            <Sparkline data={item.sparklineData} isPositive={isPositive} className="w-full h-full" />
          </div>
        )}

        {/* 52-Week Range Gauge */}
        <div className="bg-tv-lightGray/70 rounded-2xl p-3.5 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-tv-dark mb-1.5">
            <span>52-Week Range</span>
            <span className="text-[11px] text-tv-gray">Current: ${price.toFixed(2)}</span>
          </div>
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-visible my-2">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${positionRatio * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-tv-blue border-2 border-white rounded-full shadow-md -ml-1.5"
              style={{ left: `${positionRatio * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-tv-gray font-mono">
            <span>Low: ${low52.toFixed(2)}</span>
            <span>High: ${high52.toFixed(2)}</span>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-3 bg-white border border-tv-border rounded-2xl p-3.5 mb-5 text-xs">
          <div>
            <span className="text-tv-gray block text-[11px]">Exchange</span>
            <span className="font-semibold text-tv-dark">{item.exchange || 'NASDAQ'}</span>
          </div>
          <div>
            <span className="text-tv-gray block text-[11px]">Category</span>
            <span className="font-semibold text-tv-dark">{item.category || 'Equities'}</span>
          </div>
          <div>
            <span className="text-tv-gray block text-[11px]">Volume</span>
            <span className="font-semibold text-tv-dark">{item.volume || '28.4M'}</span>
          </div>
          <div>
            <span className="text-tv-gray block text-[11px]">Market Cap</span>
            <span className="font-semibold text-tv-dark">{item.marketCap || 'N/A'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => {
              if (item.id) onToggleWatchlist(item.id);
            }}
            className={`flex-1 py-3 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              isInWatchlist
                ? 'bg-blue-50 text-tv-blue border-tv-blue/30'
                : 'bg-white text-tv-dark border-tv-border hover:bg-gray-50'
            }`}
          >
            <svg
              className={`w-4 h-4 ${isInWatchlist ? 'fill-current text-tv-blue' : 'stroke-[2]'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <span>{isInWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (item.id) onOpenChart(item.id);
            }}
            className="flex-1 py-3 bg-tv-blue text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Superchart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
