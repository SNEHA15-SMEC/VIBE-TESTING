import React from 'react';

interface NavbarProps {
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDrawer,
  onOpenSearch,
  onOpenAuth,
  isLoggedIn = false,
  userName = 'Trader',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tv-border/60 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Hamburger Menu */}
        <button
          id="btn-open-sidebar"
          onClick={onOpenDrawer}
          aria-label="Open menu"
          className="p-1.5 -ml-1.5 text-tv-dark hover:bg-gray-100 rounded-lg active:scale-95 transition cursor-pointer"
        >
          <svg className="w-6 h-6 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* TradingView Iconic 'TV' Logo Mark */}
        <button
          id="btn-tv-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="TradingView Home"
          className="flex items-center text-tv-dark hover:opacity-85 transition cursor-pointer"
        >
          <svg className="h-6 w-9" fill="currentColor" viewBox="0 0 36 24">
            <path d="M0 4C0 1.79086 1.79086 0 4 0H8C10.2091 0 12 1.79086 12 4V20C12 22.2091 10.2091 24 8 24H4C1.79086 24 0 22.2091 0 20V4Z" />
            <path d="M14 12C14 9.79086 15.7909 8 18 8H20.5C22.7091 8 24.5 9.79086 24.5 12V20C24.5 22.2091 22.7091 24 20.5 24H18C15.7909 24 14 22.2091 14 20V12Z" />
            <path d="M26.5 3C26.5 1.34315 27.8431 0 29.5 0H33C34.6569 0 36 1.34315 36 3V21C36 22.6569 34.6569 24 33 24H29.5C27.8431 24 26.5 22.6569 26.5 21V3Z" />
          </svg>
        </button>
      </div>

      {/* Right Header Actions: Search & CTA */}
      <div className="flex items-center space-x-3">
        {/* Search Button */}
        <button
          id="btn-nav-search"
          onClick={onOpenSearch}
          aria-label="Search markets"
          className="p-2 text-tv-dark hover:bg-gray-100 rounded-full active:scale-95 transition cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Get Started Button or User Avatar */}
        {isLoggedIn ? (
          <button
            id="btn-user-avatar"
            onClick={onOpenAuth}
            className="flex items-center space-x-1.5 py-1 px-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-semibold text-tv-dark transition"
          >
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
              {userName[0].toUpperCase()}
            </span>
            <span className="hidden sm:inline">{userName}</span>
          </button>
        ) : (
          <button
            id="btn-get-started"
            onClick={onOpenAuth}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-sm hover:opacity-95 active:scale-95 transition whitespace-nowrap cursor-pointer"
          >
            Get started
          </button>
        )}
      </div>
    </header>
  );
};
