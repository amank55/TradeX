'use client';

import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { Button } from './button';
import { Loader2, TrendingUp, Search, X } from 'lucide-react';
import Link from 'next/link';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';
import WatchlistButton from './watchlistButton';

export default function SearchCommand({
  renderAs = 'button',
  label = 'Add stock',
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);

    setLoading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm('');
    setStocks(initialStocks);
  };

  // Handle watchlist changes status change
  const handleWatchlistChange = async (symbol: string, isAdded: boolean) => {
    // Update current stocks
    setStocks(
      initialStocks?.map((stock) =>
        stock.symbol === symbol ? { ...stock, isInWatchlist: isAdded } : stock
      ) || []
    );
  };

  return (
    <>
      {renderAs === 'text' ? (
        <span 
          onClick={() => setOpen(true)} 
          className='cursor-pointer font-medium text-white hover:text-green-400 transition-colors duration-200'
        >
          {label}
        </span>
      ) : (
        <Button 
          onClick={() => setOpen(true)} 
          className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/50'
        >
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className='border-0 shadow-2xl bg-gradient-to-b from-gray-900 to-gray-950'
      >
        {/* Search Input Section */}
        <div className='sticky top-0 z-50 border-b border-gray-700 bg-gradient-to-b from-gray-900 via-gray-900 to-transparent px-0'>
          <div className='flex items-center gap-3 px-4 py-3 border-b border-gray-700/50'>
            <Search className='h-4 w-4 text-green-500 opacity-70 flex-shrink-0' />
            <CommandInput
              value={searchTerm}
              onValueChange={setSearchTerm}
              placeholder='Search stocks by symbol or name...'
              className='bg-transparent text-white placeholder:text-gray-500 border-0 focus:ring-0 text-sm flex-1'
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='text-gray-500 hover:text-green-400 transition-colors duration-200 flex-shrink-0'
              >
                <X className='h-4 w-4' />
              </button>
            )}
            {loading && (
              <Loader2 className='h-4 w-4 text-green-500 animate-spin flex-shrink-0' />
            )}
          </div>
        </div>

        {/* Results Section */}
        <CommandList className='bg-gradient-to-b from-gray-900 to-gray-950 max-h-[60vh] overflow-y-auto px-0'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-12 gap-3'>
              <Loader2 className='h-6 w-6 text-green-500 animate-spin' />
              <p className='text-gray-400 text-sm'>Loading stocks...</p>
            </div>
          ) : displayStocks?.length === 0 ? (
            <CommandEmpty className='flex flex-col items-center justify-center py-12 text-gray-400'>
              <TrendingUp className='h-8 w-8 opacity-50 mb-2' />
              <p className='text-sm'>
                {isSearchMode ? '❌ No stocks found' : '📊 No stocks available'}
              </p>
            </CommandEmpty>
          ) : (
            <div className='p-0'>
              {/* Header */}
              <div className='sticky top-0 px-4 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-500/30 backdrop-blur-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-semibold text-green-400 uppercase tracking-widest'>
                    {isSearchMode ? '🔍 Search Results' : '⭐ Popular Stocks'}
                  </span>
                  <span className='inline-block rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-bold text-green-300 border border-green-500/40'>
                    {displayStocks?.length || 0}
                  </span>
                </div>
              </div>

              {/* Stock List */}
              <ul className='divide-y divide-gray-800'>
                {displayStocks?.map((stock) => (
                  <li 
                    key={stock.symbol} 
                    className='hover:bg-gray-800/50 transition-colors duration-150 group'
                  >
                    <Link
                      href={`/stocks/${stock.symbol}`}
                      onClick={handleSelectStock}
                      className='flex items-center gap-3 px-4 py-3 cursor-pointer'
                    >
                      <TrendingUp className='h-4 w-4 text-green-500 opacity-50 group-hover:opacity-100 flex-shrink-0 transition-opacity duration-200' />
                      
                      <div className='flex-1 min-w-0'>
                        <div className='font-semibold text-white group-hover:text-green-400 transition-colors duration-200 truncate'>
                          {stock.name}
                        </div>
                        <div className='text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-200 truncate'>
                          {stock.symbol} • {stock.exchange} • {stock.type}
                        </div>
                      </div>

                      <div className='ml-auto flex items-center gap-2 flex-shrink-0'>
                        <span className='inline-block rounded-md bg-green-500/20 px-2 py-1 text-xs font-bold text-green-300 border border-green-500/40 whitespace-nowrap'>
                          {stock.symbol}
                        </span>
                        <WatchlistButton
                          symbol={stock.symbol}
                          company={stock.name}
                          isInWatchlist={stock.isInWatchlist}
                          type='icon'
                          onWatchlistChange={handleWatchlistChange}
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CommandList>

        {/* Footer */}
        <div className='border-t border-gray-700 bg-gray-900 px-4 py-2 text-center text-xs text-gray-500'>
          <span className='flex items-center justify-center gap-2'>
            💡 Press
            <kbd className='rounded bg-gray-800 px-1.5 py-0.5 font-mono text-green-400 border border-gray-700'>
              ⌘K
            </kbd>
            or
            <kbd className='rounded bg-gray-800 px-1.5 py-0.5 font-mono text-green-400 border border-gray-700'>
              Ctrl+K
            </kbd>
            to open
          </span>
        </div>
      </CommandDialog>
    </>
  );
}