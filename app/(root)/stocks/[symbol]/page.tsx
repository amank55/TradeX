import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/watchlistButton";
import { notFound } from "next/navigation";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 px-4 md:px-6 lg:px-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symbol Info Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-4 shadow-2xl hover:border-green-500/60 transition-all duration-300">
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}symbol-info.js`}
                  config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                  height={170}
                />
              </div>
            </div>

            {/* Candlestick Chart Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-4 shadow-2xl hover:border-green-500/60 transition-all duration-300">
                <div className="text-white text-sm font-semibold mb-3 px-2">📊 Candlestick Chart</div>
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}advanced-chart.js`}
                  config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                  className="custom-chart"
                  height={600}
                />
              </div>
            </div>

            {/* Baseline Chart Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-4 shadow-2xl hover:border-green-500/60 transition-all duration-300">
                <div className="text-white text-sm font-semibold mb-3 px-2">📈 Baseline Analysis</div>
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}advanced-chart.js`}
                  config={BASELINE_WIDGET_CONFIG(symbol)}
                  className="custom-chart"
                  height={600}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Technical & Company Info */}
          <div className="space-y-6">
            {/* Technical Analysis Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-4 shadow-2xl hover:border-green-500/60 transition-all duration-300">
                <div className="text-white text-sm font-semibold mb-3 px-2">🎯 Technical Analysis</div>
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}technical-analysis.js`}
                  config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                  height={400}
                />
              </div>
            </div>

            {/* Company Profile Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-4 shadow-2xl hover:border-green-500/60 transition-all duration-300">
                <div className="text-white text-sm font-semibold mb-3 px-2">🏢 Company Profile</div>
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}company-profile.js`}
                  config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                  height={440}
                />
              </div>
            </div>

            {/* Financial Data Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur border border-green-500/30 rounded-2xl p-4 shadow-2xl hover:border-green-500/60 transition-all duration-300">
                <div className="text-white text-sm font-semibold mb-3 px-2">💰 Financials</div>
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
  );
}