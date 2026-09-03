import React, { useState, useMemo } from 'react';
import { MarketItem } from '../types/market';
import { PRIMARY_INDICES, US_STOCKS, CATEGORY_MARKETS } from '../data/mockMarketData';

interface InteractiveChartProps {
  initialSymbolId?: string;
  onSelectSymbol?: (item: MarketItem) => void;
  onBackToMarkets?: () => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';
type ChartType = 'line' | 'candles';

interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  initialSymbolId = 'spx',
  onBackToMarkets,
}) => {
  const allSymbols = useMemo(() => {
    return [
      ...PRIMARY_INDICES,
      ...US_STOCKS,
      ...(CATEGORY_MARKETS['Crypto'] || []),
      ...(CATEGORY_MARKETS['Futures'] || []),
    ];
  }, []);

  const [selectedId, setSelectedId] = useState<string>(initialSymbolId);
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [showIndicators, setShowIndicators] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentItem = useMemo(() => {
    return allSymbols.find((s) => s.id === selectedId) || PRIMARY_INDICES[0];
  }, [allSymbols, selectedId]);

  // Generate realistic candles based on symbol price and timeframe
  const candles: CandlePoint[] = useMemo(() => {
    const basePrice = currentItem.price;
    const count = 30;
    const list: CandlePoint[] = [];
    let current = basePrice * (timeframe === '1D' ? 0.995 : 0.88);

    const timeLabels = ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

    for (let i = 0; i < count; i++) {
      const volatility = current * (currentItem.category === 'Crypto' ? 0.015 : 0.005);
      const delta = (Math.random() - 0.47) * volatility;
      const open = current;
      const close = open + delta;
      const high = Math.max(open, close) + Math.random() * volatility * 0.8;
      const low = Math.min(open, close) - Math.random() * volatility * 0.8;
      const volume = Math.floor(10000 + Math.random() * 80000);
      const time = timeLabels[i % timeLabels.length];

      list.push({ time, open, high, low, close, volume });
      current = close;
    }

    // Anchor the last candle to the current live price
    if (list.length > 0) {
      list[list.length - 1].close = currentItem.price;
      if (currentItem.price > list[list.length - 1].high) list[list.length - 1].high = currentItem.price;
      if (currentItem.price < list[list.length - 1].low) list[list.length - 1].low = currentItem.price;
    }

    return list;
  }, [currentItem, timeframe]);

  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const width = 360;
  const height = 240;
  const paddingX = 12;
  const paddingY = 20;

  // Active hover point
  const activeCandle = hoveredIndex !== null && candles[hoveredIndex] ? candles[hoveredIndex] : candles[candles.length - 1];
  const isPositive = currentItem.change >= 0;

  // Compute SVG line path for line chart
  const linePoints = useMemo(() => {
    return candles.map((c, i) => {
      const x = paddingX + (i / (candles.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((c.close - minPrice) / priceRange) * (height - 2 * paddingY);
      return { x, y };
    });
  }, [candles, minPrice, priceRange]);

  let linePath = `M ${linePoints[0].x},${linePoints[0].y}`;
  for (let i = 0; i < linePoints.length - 1; i++) {
    const p1 = linePoints[i];
    const p2 = linePoints[i + 1];
    const cx = (p1.x + p2.x) / 2;
    linePath += ` C ${cx},${p1.y} ${cx},${p2.y} ${p2.x},${p2.y}`;
  }
  const areaFill = `${linePath} L ${width - paddingX},${height} L ${paddingX},${height} Z`;

  return (
    <div className="w-full max-w-md mx-auto pb-20 px-4 pt-4">
      {/* Chart Header & Symbol Picker */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {onBackToMarkets && (
            <button
              onClick={onBackToMarkets}
              className="p-1 hover:bg-gray-100 rounded-lg text-tv-dark transition"
              title="Back to Markets"
            >
              <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15.75 19.5L8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              aria-label="Select financial instrument"
              className="font-extrabold text-xl text-tv-dark bg-transparent pr-7 py-0.5 border-none focus:ring-0 focus:outline-none cursor-pointer appearance-none"
            >
              {allSymbols.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.symbol} • {s.exchange}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-1 top-1.5 text-tv-dark">
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Chart Type Toggle */}
          <button
            onClick={() => setChartType(chartType === 'line' ? 'candles' : 'line')}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition ${
              chartType === 'candles' ? 'bg-tv-dark text-white border-tv-dark' : 'bg-white text-tv-dark border-tv-border'
            }`}
          >
            <span>{chartType === 'candles' ? 'Candles' : 'Line'}</span>
          </button>

          {/* Indicator toggle */}
          <button
            onClick={() => setShowIndicators(!showIndicators)}
            className={`p-1.5 rounded-lg border text-xs font-semibold transition ${
              showIndicators ? 'bg-blue-50 text-tv-blue border-blue-200' : 'bg-white text-tv-gray border-tv-border'
            }`}
          >
            fx
          </button>
        </div>
      </div>

      {/* Price and Dynamic OHLC bar */}
      <div className="mb-3">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black tracking-tight text-tv-dark">
            ${activeCandle.close.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
              isPositive ? 'text-tv-green bg-tv-greenBg' : 'text-tv-red bg-tv-redBg'
            }`}
          >
            <span>{isPositive ? '▲ +' : '▼ '}{Math.abs(currentItem.change).toFixed(2)}</span>
            <span>({isPositive ? '+' : ''}{currentItem.changePercent.toFixed(2)}%)</span>
          </span>
        </div>

        {/* OHLC Bar */}
        <div className="flex items-center space-x-3 text-[11px] text-tv-gray font-mono mt-1">
          <span>O: <strong className="text-tv-dark">{activeCandle.open.toFixed(2)}</strong></span>
          <span>H: <strong className="text-tv-dark">{activeCandle.high.toFixed(2)}</strong></span>
          <span>L: <strong className="text-tv-dark">{activeCandle.low.toFixed(2)}</strong></span>
          <span>C: <strong className="text-tv-dark">{activeCandle.close.toFixed(2)}</strong></span>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="relative bg-white border border-tv-border rounded-2xl p-2 shadow-xs select-none">
        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <span className="text-6xl font-black uppercase text-tv-dark">{currentItem.symbol}</span>
        </div>

        {/* Chart SVG */}
        <svg
          className="w-full h-56 overflow-visible cursor-crosshair"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const ratio = mouseX / rect.width;
            const idx = Math.min(Math.max(0, Math.floor(ratio * candles.length)), candles.length - 1);
            setHoveredIndex(idx);
          }}
          onMouseLeave={() => setHoveredIndex(null)}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              const rect = e.currentTarget.getBoundingClientRect();
              const touchX = e.touches[0].clientX - rect.left;
              const ratio = touchX / rect.width;
              const idx = Math.min(Math.max(0, Math.floor(ratio * candles.length)), candles.length - 1);
              setHoveredIndex(idx);
            }
          }}
          onTouchEnd={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="chartLineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity={0.2} />
              <stop offset="100%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = paddingY + ratio * (height - 2 * paddingY);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#F0F3FA"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Line or Candlestick view */}
          {chartType === 'line' ? (
            <>
              <path d={areaFill} fill="url(#chartLineGrad)" />
              <path
                d={linePath}
                fill="none"
                stroke={isPositive ? '#089981' : '#F23645'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          ) : (
            // Candlestick rendering
            candles.map((c, idx) => {
              const x = paddingX + (idx / (candles.length - 1)) * (width - 2 * paddingX);
              const candleWidth = Math.max(3, (width - 2 * paddingX) / candles.length - 3);
              const isUp = c.close >= c.open;
              const candleColor = isUp ? '#089981' : '#F23645';

              const yHigh = height - paddingY - ((c.high - minPrice) / priceRange) * (height - 2 * paddingY);
              const yLow = height - paddingY - ((c.low - minPrice) / priceRange) * (height - 2 * paddingY);
              const yOpen = height - paddingY - ((c.open - minPrice) / priceRange) * (height - 2 * paddingY);
              const yClose = height - paddingY - ((c.close - minPrice) / priceRange) * (height - 2 * paddingY);

              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(2, Math.abs(yOpen - yClose));

              return (
                <g key={idx}>
                  {/* Wick */}
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={candleColor} strokeWidth="1.2" />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={candleColor}
                    rx="1"
                  />
                </g>
              );
            })
          )}

          {/* Volume Bars */}
          {showIndicators &&
            candles.map((c, idx) => {
              const x = paddingX + (idx / (candles.length - 1)) * (width - 2 * paddingX);
              const maxVol = Math.max(...candles.map((item) => item.volume));
              const volHeight = (c.volume / maxVol) * 28;
              const isUp = c.close >= c.open;
              return (
                <rect
                  key={`vol-${idx}`}
                  x={x - 2}
                  y={height - volHeight}
                  width="4"
                  height={volHeight}
                  fill={isUp ? '#089981' : '#F23645'}
                  opacity={0.3}
                />
              );
            })}

          {/* Crosshair when hovering */}
          {hoveredIndex !== null && (
            <>
              <line
                x1={linePoints[hoveredIndex]?.x || 0}
                y1={0}
                x2={linePoints[hoveredIndex]?.x || 0}
                y2={height}
                stroke="#787B86"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <line
                x1={0}
                y1={linePoints[hoveredIndex]?.y || 0}
                x2={width}
                y2={linePoints[hoveredIndex]?.y || 0}
                stroke="#787B86"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <circle
                cx={linePoints[hoveredIndex]?.x || 0}
                cy={linePoints[hoveredIndex]?.y || 0}
                r="4.5"
                fill="#2962FF"
                stroke="#fff"
                strokeWidth="2"
              />
            </>
          )}
        </svg>

        {/* Current Price Tag on right */}
        <div
          className="absolute right-1 text-[10px] font-bold px-1.5 py-0.5 rounded text-white shadow-xs"
          style={{
            backgroundColor: isPositive ? '#089981' : '#F23645',
            top: '40%',
          }}
        >
          {currentItem.price.toFixed(2)}
        </div>
      </div>

      {/* Timeframe Selector Pills */}
      <div className="mt-3 flex items-center justify-between bg-tv-lightGray p-1 rounded-xl text-xs font-semibold">
        {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`flex-1 py-1.5 rounded-lg transition text-center ${
              timeframe === tf ? 'bg-white text-tv-dark shadow-xs font-bold' : 'text-tv-gray hover:text-tv-dark'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Key Stats Grid */}
      <div className="mt-4 bg-white border border-tv-border rounded-2xl p-4">
        <h3 className="text-xs font-bold text-tv-dark uppercase tracking-wider mb-3">Key Statistics</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-tv-gray block">Day Range</span>
            <span className="font-semibold text-tv-dark">
              {minPrice.toFixed(2)} - {maxPrice.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-tv-gray block">Volume</span>
            <span className="font-semibold text-tv-dark">{currentItem.volume || '14.2M'}</span>
          </div>
          <div>
            <span className="text-tv-gray block">52W Range</span>
            <span className="font-semibold text-tv-dark">
              {currentItem.week52Low || (currentItem.price * 0.75).toFixed(2)} -{' '}
              {currentItem.week52High || (currentItem.price * 1.25).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-tv-gray block">Market Cap</span>
            <span className="font-semibold text-tv-dark">{currentItem.marketCap || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Buy / Sell Quick Execution Panel */}
      <div className="mt-4 flex space-x-3">
        <button
          onClick={() => alert(`Simulated Buy order placed for ${currentItem.symbol} at $${currentItem.price.toFixed(2)}`)}
          className="flex-1 py-3 bg-tv-green text-white font-bold rounded-xl shadow-sm hover:opacity-95 active:scale-95 transition flex flex-col items-center"
        >
          <span className="text-xs uppercase tracking-wider opacity-90">Buy</span>
          <span className="text-sm font-black">${currentItem.price.toFixed(2)}</span>
        </button>
        <button
          onClick={() => alert(`Simulated Sell order placed for ${currentItem.symbol} at $${currentItem.price.toFixed(2)}`)}
          className="flex-1 py-3 bg-tv-red text-white font-bold rounded-xl shadow-sm hover:opacity-95 active:scale-95 transition flex flex-col items-center"
        >
          <span className="text-xs uppercase tracking-wider opacity-90">Sell</span>
          <span className="text-sm font-black">${(currentItem.price * 0.999).toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};
