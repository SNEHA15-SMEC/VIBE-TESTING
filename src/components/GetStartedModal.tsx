import React, { useState } from 'react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  userName: string;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isLoggedIn,
  onLogout,
  userName,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(name.trim() || email.split('@')[0] || 'Trader');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-tv-border rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <svg className="h-6 w-9 text-tv-dark" fill="currentColor" viewBox="0 0 36 24">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H8C10.2091 0 12 1.79086 12 4V20C12 22.2091 10.2091 24 8 24H4C1.79086 24 0 22.2091 0 20V4Z" />
              <path d="M14 12C14 9.79086 15.7909 8 18 8H20.5C22.7091 8 24.5 9.79086 24.5 12V20C24.5 22.2091 22.7091 24 20.5 24H18C15.7909 24 14 22.2091 14 20V12Z" />
              <path d="M26.5 3C26.5 1.34315 27.8431 0 29.5 0H33C34.6569 0 36 1.34315 36 3V21C36 22.6569 34.6569 24 33 24H29.5C27.8431 24 26.5 22.6569 26.5 21V3Z" />
            </svg>
            <span className="font-extrabold text-lg text-tv-dark">TradingView</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-tv-dark">
            ✕
          </button>
        </div>

        {isLoggedIn ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl mx-auto flex items-center justify-center mb-3">
              {userName[0].toUpperCase()}
            </div>
            <h3 className="text-lg font-bold text-tv-dark mb-1">{userName}</h3>
            <p className="text-xs text-tv-gray mb-6">sneha87menon@gmail.com • Pro Member</p>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-tv-red font-semibold text-xs rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-extrabold text-tv-dark mb-1">
              {isRegister ? 'Create an account' : 'Look first / Then leap'}
            </h2>
            <p className="text-xs text-tv-gray mb-5">
              The world’s most popular trading charts and market screener.
            </p>

            {/* Quick Social Buttons */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => {
                  onSuccess('Sneha Menon');
                  onClose();
                }}
                className="w-full py-2.5 border border-tv-border rounded-xl text-xs font-semibold text-tv-dark hover:bg-gray-50 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Continue with Google</span>
              </button>
              <button
                onClick={() => {
                  onSuccess('Trader');
                  onClose();
                }}
                className="w-full py-2.5 bg-black text-white rounded-xl text-xs font-semibold hover:opacity-90 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Continue with Apple</span>
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-tv-gray">Or with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-tv-dark mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Trader name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-tv-lightGray rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-tv-blue"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-tv-dark mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-tv-lightGray rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-tv-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-95 transition cursor-pointer mt-2"
              >
                {isRegister ? 'Sign up' : 'Sign in'}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-tv-gray">
              {isRegister ? (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsRegister(false)}
                    className="text-tv-blue font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </span>
              ) : (
                <span>
                  New to TradingView?{' '}
                  <button
                    onClick={() => setIsRegister(true)}
                    className="text-tv-blue font-semibold hover:underline cursor-pointer"
                  >
                    Get started
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
