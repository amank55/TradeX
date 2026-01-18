import TradingViewWidget from '@/components/TradingViewWidget';
import WatchlistButton from '@/components/watchlistButton';
import { WatchlistItem } from '@/database/models/watchlist.model';
import { getStocksDetails } from '@/lib/actions/finnhub.actions';
import { getUserWatchlist } from '@/lib/actions/watchlist.actions';
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from '@/lib/constants';
import { notFound } from 'next/navigation';

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  const stockData = await getStocksDetails(symbol.toUpperCase());
  const watchlist = await getUserWatchlist();

  const isInWatchlist = watchlist.some(
    (item: WatchlistItem) => item.symbol === symbol.toUpperCase()
  );

  if (!stockData) notFound();

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black py-8 px-4 md:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-4xl md:text-5xl font-bold text-white'>
                  {symbol.toUpperCase()}
                </h1>
                <span className='inline-block px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-sm font-semibold text-green-400'>
                  {stockData?.company}
                </span>
              </div>
              <p className='text-gray-400 text-sm'>Real-time stock analysis and data</p>
            </div>
            <div className='flex items-center gap-4 md:min-w-[300px]'>
              <WatchlistButton
                symbol={symbol}
                company={stockData.company}
                isInWatchlist={isInWatchlist}
                type='button'
              />
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Main Charts */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Symbol Info Card */}
            <div className='group relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-green-600/25 via-emerald-500/20 to-teal-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500'></div>
              <div className='relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-green-500/40 rounded-lg p-5 hover:border-green-500/80 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]'>
                <div className='text-white text-sm font-semibold mb-4 flex items-center gap-2'>
                  <span className='text-xl'>📊</span>
                  Symbol Information
                </div>
                <div className='relative rounded-md overflow-hidden group/widget'>
                  <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                  <TradingViewWidget
                    scriptUrl={`${scriptUrl}symbol-info.js`}
                    config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                    height={170}
                  />
                </div>
              </div>
            </div>

            {/* Candlestick Chart Card */}
            <div className='group relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-600/25 via-cyan-500/20 to-teal-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500'></div>
              <div className='relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-blue-500/40 rounded-lg p-5 hover:border-blue-500/80 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'>
                <div className='text-white text-sm font-semibold mb-4 flex items-center gap-2'>
                  <span className='text-xl'>📈</span>
                  Candlestick Chart
                </div>
                <div className='relative rounded-md overflow-hidden group/widget'>
                  <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                  <TradingViewWidget
                    scriptUrl={`${scriptUrl}advanced-chart.js`}
                    config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                    className='custom-chart'
                    height={600}
                  />
                </div>
              </div>
            </div>

            {/* Baseline Chart Card */}
            <div className='group relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-600/25 via-pink-500/20 to-red-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500'></div>
              <div className='relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-purple-500/40 rounded-lg p-5 hover:border-purple-500/80 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]'>
                <div className='text-white text-sm font-semibold mb-4 flex items-center gap-2'>
                  <span className='text-xl'>📉</span>
                  Baseline Analysis
                </div>
                <div className='relative rounded-md overflow-hidden group/widget'>
                  <div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                  <TradingViewWidget
                    scriptUrl={`${scriptUrl}advanced-chart.js`}
                    config={BASELINE_WIDGET_CONFIG(symbol)}
                    className='custom-chart'
                    height={600}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Technical & Financial Info */}
          <div className='space-y-6'>
            {/* Technical Analysis Card */}
            <div className='group relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-orange-600/25 via-amber-500/20 to-yellow-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500'></div>
              <div className='relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-orange-500/40 rounded-lg p-5 hover:border-orange-500/80 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]'>
                <div className='text-white text-sm font-semibold mb-4 flex items-center gap-2'>
                  <span className='text-xl'>🎯</span>
                  Technical Analysis
                </div>
                <div className='relative rounded-md overflow-hidden group/widget'>
                  <div className='absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                  <TradingViewWidget
                    scriptUrl={`${scriptUrl}technical-analysis.js`}
                    config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                    height={400}
                  />
                </div>
              </div>
            </div>

            {/* Financial Data Card */}
            <div className='group relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-rose-600/25 via-pink-500/20 to-red-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500'></div>
              <div className='relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-rose-500/40 rounded-lg p-5 hover:border-rose-500/80 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]'>
                <div className='text-white text-sm font-semibold mb-4 flex items-center gap-2'>
                  <span className='text-xl'>💰</span>
                  Financial Data
                </div>
                <div className='relative rounded-md overflow-hidden group/widget'>
                  <div className='absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                  <TradingViewWidget
                    scriptUrl={`${scriptUrl}financials.js`}
                    config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                    height={464}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}