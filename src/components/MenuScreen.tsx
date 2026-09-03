import React from 'react';

interface MenuScreenProps {
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  userName: string;
  onSelectCategory: (cat: string) => void;
  onOpenChart: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onOpenAuth,
  isLoggedIn,
  userName,
  onSelectCategory,
  onOpenChart,
}) => {
  return (
    <div className="w-full max-w-md mx-auto pb-24 px-4 pt-4">
      {/* Profile / Account Card */}
      <div className="bg-white border border-tv-border rounded-2xl p-4 shadow-xs mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {isLoggedIn ? userName[0].toUpperCase() : 'TV'}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-base text-tv-dark leading-tight">
              {isLoggedIn ? userName : 'Welcome to TradingView'}
            </h2>
            <p className="text-xs text-tv-gray">
              {isLoggedIn ? 'Pro Plan Active • sneha87menon@gmail.com' : 'Sign in to sync your charts and watchlist'}
            </p>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-tv-dark">
            {isLoggedIn ? 'Account Settings' : 'Start free trial'}
          </span>
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 bg-tv-dark text-white rounded-lg text-xs font-semibold hover:bg-black transition cursor-pointer"
          >
            {isLoggedIn ? 'Switch Account' : 'Sign in'}
          </button>
        </div>
      </div>

      {/* Market Status Overview */}
      <div className="bg-white border border-tv-border rounded-2xl p-4 shadow-xs mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-tv-dark uppercase tracking-wider">Market Status</h3>
          <span className="text-[11px] font-bold text-tv-green flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-tv-green animate-pulse" />
            <span>Regular Trading Hours</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-tv-lightGray p-2.5 rounded-xl">
            <span className="text-tv-gray block text-[10px]">US Equities (NYSE/NASDAQ)</span>
            <span className="font-bold text-tv-dark">Open (Closes 16:00 ET)</span>
          </div>
          <div className="bg-tv-lightGray p-2.5 rounded-xl">
            <span className="text-tv-gray block text-[10px]">Crypto Markets</span>
            <span className="font-bold text-tv-dark">24/7 Live</span>
          </div>
        </div>
      </div>

      {/* TradingView Core Products */}
      <div className="bg-white border border-tv-border rounded-2xl p-4 shadow-xs mb-4">
        <h3 className="text-xs font-bold text-tv-dark uppercase tracking-wider mb-2">Products</h3>
        <div className="divide-y divide-gray-100 text-sm font-medium">
          <button
            onClick={onOpenChart}
            className="w-full py-2.5 flex items-center justify-between hover:text-tv-blue transition cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-base">📈</span>
              <span>Supercharts</span>
            </div>
            <span className="text-tv-gray text-xs">›</span>
          </button>
          <button
            onClick={() => onSelectCategory('US stocks')}
            className="w-full py-2.5 flex items-center justify-between hover:text-tv-blue transition cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-base">🔍</span>
              <span>Stock Screener</span>
            </div>
            <span className="text-tv-gray text-xs">›</span>
          </button>
          <button
            onClick={() => onSelectCategory('Crypto')}
            className="w-full py-2.5 flex items-center justify-between hover:text-tv-blue transition cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-base">🪙</span>
              <span>Crypto Heatmap</span>
            </div>
            <span className="text-tv-gray text-xs">›</span>
          </button>
          <button
            onClick={() => onSelectCategory('Futures')}
            className="w-full py-2.5 flex items-center justify-between hover:text-tv-blue transition cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <span className="text-base">📅</span>
              <span>Economic Calendar</span>
            </div>
            <span className="text-tv-gray text-xs">›</span>
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white border border-tv-border rounded-2xl p-4 shadow-xs mb-4">
        <h3 className="text-xs font-bold text-tv-dark uppercase tracking-wider mb-2">Preferences</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-tv-dark">Default Currency</span>
            <span className="font-medium text-tv-gray">USD ($)</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-tv-dark">Price Flashes</span>
            <span className="text-tv-green font-bold">Enabled</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-tv-dark">Haptic Feedback</span>
            <span className="text-tv-blue font-bold">On</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-tv-gray space-y-1">
        <div>TradingView Mobile Web v4.2.0</div>
        <div>Market Data provided by ICE Data Services & Cboe BZX</div>
      </div>
    </div>
  );
};
