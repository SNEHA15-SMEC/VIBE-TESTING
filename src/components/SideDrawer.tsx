import React from 'react';
import { TabType } from '../types/market';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  userName: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenAuth,
  isLoggedIn,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-72 h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Top TV Logo & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-tv-dark">
              <svg className="h-6 w-9" fill="currentColor" viewBox="0 0 36 24">
                <path d="M0 4C0 1.79086 1.79086 0 4 0H8C10.2091 0 12 1.79086 12 4V20C12 22.2091 10.2091 24 8 24H4C1.79086 24 0 22.2091 0 20V4Z" />
                <path d="M14 12C14 9.79086 15.7909 8 18 8H20.5C22.7091 8 24.5 9.79086 24.5 12V20C24.5 22.2091 22.7091 24 20.5 24H18C15.7909 24 14 22.2091 14 20V12Z" />
                <path d="M26.5 3C26.5 1.34315 27.8431 0 29.5 0H33C34.6569 0 36 1.34315 36 3V21C36 22.6569 34.6569 24 33 24H29.5C27.8431 24 26.5 22.6569 26.5 21V3Z" />
              </svg>
              <span className="font-extrabold text-base">TradingView</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-tv-dark rounded-lg transition"
            >
              <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* User Status Card */}
          <div className="py-4 border-b border-gray-100">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  {userName[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-tv-dark">{userName}</div>
                  <div className="text-[11px] text-tv-gray">Pro Active</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Sign In / Get Started
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="py-3 space-y-1 text-sm font-semibold text-tv-dark">
            <button
              onClick={() => {
                onNavigateTab('markets');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-tv-lightGray transition cursor-pointer"
            >
              <span className="text-base">🌐</span>
              <span>Markets Overview</span>
            </button>
            <button
              onClick={() => {
                onNavigateTab('chart');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-tv-lightGray transition cursor-pointer"
            >
              <span className="text-base">📈</span>
              <span>Supercharts</span>
            </button>
            <button
              onClick={() => {
                onNavigateTab('watchlist');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-tv-lightGray transition cursor-pointer"
            >
              <span className="text-base">⭐</span>
              <span>Watchlist</span>
            </button>
            <button
              onClick={() => {
                onNavigateTab('community');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-tv-lightGray transition cursor-pointer"
            >
              <span className="text-base">💡</span>
              <span>Community Ideas</span>
            </button>
            <button
              onClick={() => {
                onNavigateTab('menu');
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-tv-lightGray transition cursor-pointer"
            >
              <span className="text-base">⚙️</span>
              <span>Preferences & Help</span>
            </button>
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-gray-100 text-xs text-tv-gray">
          <div className="font-semibold text-tv-dark mb-1">TradingView Markets</div>
          <div className="text-[11px]">Quotes & data by ICE Data Services</div>
        </div>
      </div>
    </div>
  );
};
