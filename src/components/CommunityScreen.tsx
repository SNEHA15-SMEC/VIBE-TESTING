import React, { useState } from 'react';
import { CommunityPost } from '../types/market';
import { COMMUNITY_POSTS } from '../data/mockMarketData';

interface CommunityScreenProps {
  onOpenChartForSymbol?: (symbol: string) => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  onOpenChartForSymbol,
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [filter, setFilter] = useState<'All' | 'Bullish' | 'Bearish'>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSymbol, setNewSymbol] = useState('NVDA');
  const [newSentiment, setNewSentiment] = useState<'Bullish' | 'Bearish'>('Bullish');

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const hasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked,
            likes: hasLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: 'You (Trader)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      authorBadge: 'Pro Member',
      symbol: newSymbol,
      symbolName: `${newSymbol} Analysis`,
      title: newTitle,
      content: newContent,
      timeAgo: 'Just now',
      sentiment: newSentiment,
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      timeframe: '1D',
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'All') return true;
    return post.sentiment === filter;
  });

  return (
    <div className="w-full max-w-md mx-auto pb-20 px-4 pt-4">
      {/* Community Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-2xl font-extrabold text-tv-dark">Community Ideas</h1>
          <p className="text-xs text-tv-gray">Market insights from global top traders</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 bg-tv-blue text-white text-xs font-semibold rounded-full shadow-xs hover:opacity-95 active:scale-95 transition flex items-center space-x-1 cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Share Idea</span>
        </button>
      </div>

      {/* Community Sentiment Bar */}
      <div className="bg-white border border-tv-border rounded-2xl p-3.5 mb-4 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-tv-dark">Community Market Sentiment</span>
          <span className="text-tv-green font-bold">68% Bullish</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
          <div className="bg-tv-green h-full" style={{ width: '68%' }} />
          <div className="bg-tv-red h-full" style={{ width: '32%' }} />
        </div>
        <div className="flex justify-between text-[10px] text-tv-gray mt-1">
          <span>68% Bullish</span>
          <span>32% Bearish</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-4">
        {(['All', 'Bullish', 'Bearish'] as const).map((sent) => (
          <button
            key={sent}
            onClick={() => setFilter(sent)}
            className={`px-3 py-1 text-xs rounded-full transition cursor-pointer ${
              filter === sent
                ? 'bg-tv-dark text-white font-bold'
                : 'bg-tv-lightGray text-tv-dark font-medium hover:bg-gray-200'
            }`}
          >
            {sent}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white border border-tv-border rounded-2xl p-4 shadow-xs hover:shadow-sm transition"
          >
            {/* Author bar */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2.5">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <div className="text-xs font-bold text-tv-dark flex items-center space-x-1.5">
                    <span>{post.author}</span>
                    {post.authorBadge && (
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {post.authorBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-tv-gray">{post.timeAgo}</div>
                </div>
              </div>

              {/* Sentiment badge */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  post.sentiment === 'Bullish'
                    ? 'text-tv-green bg-tv-greenBg'
                    : 'text-tv-red bg-tv-redBg'
                }`}
              >
                {post.sentiment}
              </span>
            </div>

            {/* Post Title & Symbol Tag */}
            <div className="mb-2">
              <div className="flex items-center space-x-2 mb-1">
                <button
                  onClick={() => onOpenChartForSymbol?.(post.symbol)}
                  className="text-xs font-bold text-tv-blue hover:underline bg-blue-50 px-2 py-0.5 rounded cursor-pointer"
                >
                  {post.symbol} • {post.timeframe}
                </button>
              </div>
              <h2 className="text-sm font-bold text-tv-dark leading-snug">{post.title}</h2>
            </div>

            {/* Post Content */}
            <p className="text-xs text-tv-gray leading-relaxed mb-3">{post.content}</p>

            {/* Post Actions (Likes, Comments) */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-tv-gray">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1.5 transition cursor-pointer ${
                  post.hasLiked ? 'text-tv-blue font-bold' : 'hover:text-tv-dark'
                }`}
              >
                <svg
                  className={`w-4 h-4 ${post.hasLiked ? 'fill-current text-tv-blue' : 'stroke-[2]'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{post.likes}</span>
              </button>

              <div className="flex items-center space-x-1.5">
                <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 0012 20.25z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{post.commentsCount} comments</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Share Idea Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-tv-border rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-tv-dark">Share Trading Idea</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-tv-dark"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handlePublish} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-tv-dark mb-1">Symbol</label>
                <select
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-full bg-tv-lightGray border-none rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-tv-blue"
                >
                  <option value="NVDA">NVDA • NVIDIA</option>
                  <option value="SPX">SPX • S&P 500</option>
                  <option value="AAPL">AAPL • Apple</option>
                  <option value="TSLA">TSLA • Tesla</option>
                  <option value="BTC/USD">BTC/USD • Bitcoin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-tv-dark mb-1">Sentiment</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setNewSentiment('Bullish')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      newSentiment === 'Bullish' ? 'bg-tv-green text-white' : 'bg-tv-lightGray text-tv-dark'
                    }`}
                  >
                    ▲ Bullish
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSentiment('Bearish')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      newSentiment === 'Bearish' ? 'bg-tv-red text-white' : 'bg-tv-lightGray text-tv-dark'
                    }`}
                  >
                    ▼ Bearish
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-tv-dark mb-1">Idea Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Major breakout on daily timeframe..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-tv-lightGray border-none rounded-lg p-2 text-xs focus:ring-1 focus:ring-tv-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-tv-dark mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain your technical or fundamental thesis..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-tv-lightGray border-none rounded-lg p-2 text-xs focus:ring-1 focus:ring-tv-blue"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-gray-100 text-tv-dark rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-tv-blue text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Publish Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
