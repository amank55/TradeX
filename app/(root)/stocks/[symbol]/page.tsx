import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/watchlistButton";
import { notFound } from "next/navigation";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;

  // Validate symbol exists
  if (!symbol) {
    notFound();
  }

  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Watchlist Button Section */}
        <div className="mb-8 flex justify-end">
          <div className="w-full md:w-96">
            <WatchlistButton 
              symbol={symbol.toUpperCase()} 
              company={symbol.toUpperCase()} 
              isInWatchlist={false} 
            />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symbol Info Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/25 via-emerald-500/20 to-teal-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800 border border-green-500/40 rounded-lg p-5 hover:border-green-500/80 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <div className="text-white text-sm font-semibold mb-3">📊 Symbol Info</div>
                <div className="relative rounded-md overflow-hidden group/widget">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <TradingViewWidget
                    scriptUrl={`${scriptUrl}symbol-info.js`}
                    config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                    height={170}
                  />
                </div>
              </div>
            </div>

            {/* Candlestick Chart Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/25 via-emerald-500/20 to-teal-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800 border border-green-500/40 rounded-lg p-5 hover:border-green-500/80 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <div className="text-white text-sm font-semibold mb-3">📈 Candlestick Chart</div>
                <div className="relative rounded-md overflow-hidden group/widget">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <TradingViewWidget
                    scriptUrl={`${scriptUrl}advanced-chart.js`}
                    config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                    className="custom-chart"
                    height={600}
                  />
                </div>
              </div>
            </div>

            {/* Baseline Chart Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/25 via-emerald-500/20 to-teal-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800 border border-green-500/40 rounded-lg p-5 hover:border-green-500/80 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <div className="text-white text-sm font-semibold mb-3">📉 Baseline Analysis</div>
                <div className="relative rounded-md overflow-hidden group/widget">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <TradingViewWidget
                    scriptUrl={`${scriptUrl}advanced-chart.js`}
                    config={BASELINE_WIDGET_CONFIG(symbol)}
                    className="custom-chart"
                    height={600}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Technical & Financial Info */}
          <div className="space-y-6">
            {/* Technical Analysis Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/25 via-emerald-500/20 to-teal-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800 border border-green-500/40 rounded-lg p-5 hover:border-green-500/80 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <div className="text-white text-sm font-semibold mb-3">🎯 Technical Analysis</div>
                <div className="relative rounded-md overflow-hidden group/widget">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <TradingViewWidget
                    scriptUrl={`${scriptUrl}technical-analysis.js`}
                    config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                    height={400}
                  />
                </div>
              </div>
            </div>

            {/* Financial Data Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/25 via-emerald-500/20 to-teal-600/25 rounded-lg blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-gray-800 border border-green-500/40 rounded-lg p-5 hover:border-green-500/80 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <div className="text-white text-sm font-semibold mb-3">💰 Financials</div>
                <div className="relative rounded-md overflow-hidden group/widget">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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