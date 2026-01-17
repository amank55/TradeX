"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { Button } from "./button";
import { Loader2, TrendingUp, X, Star } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
  const [watchlistStocks, setWatchlistStocks] = useState<Set<string>>(
    new Set(initialStocks.filter(s => s.isInWatchlist).map(s => s.symbol))
  );
  const [addingToWatchlist, setAddingToWatchlist] = useState<string | null>(null);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);

    setLoading(true)
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  const handleClearSearch = () => {
    setSearchTerm("");
    setStocks(initialStocks);
  }

  const toggleWatchlist = async (e: React.MouseEvent, symbol: string) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingToWatchlist(symbol);
    
    try {
      // Check current state BEFORE toggling
      const isCurrentlyInWatchlist = watchlistStocks.has(symbol);
      const action = isCurrentlyInWatchlist ? 'remove' : 'add';
      
      // Toggle the UI immediately
      setWatchlistStocks(prev => {
        const newSet = new Set(prev);
        if (newSet.has(symbol)) {
          newSet.delete(symbol);
        } else {
          newSet.add(symbol);
        }
        return newSet;
      });

      // Send to API with correct action
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symbol, 
          action
        }),
      });

      if (!response.ok) {
        // Revert on error
        setWatchlistStocks(prev => {
          const newSet = new Set(prev);
          if (newSet.has(symbol)) {
            newSet.delete(symbol);
          } else {
            newSet.add(symbol);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      // Revert on error
      setWatchlistStocks(prev => {
        const newSet = new Set(prev);
        if (newSet.has(symbol)) {
          newSet.delete(symbol);
        } else {
          newSet.add(symbol);
        }
        return newSet;
      });
    } finally {
      setAddingToWatchlist(null);
    }
  }

  return (
    <>
      {renderAs === 'text' ? (
        <span 
          onClick={() => setOpen(true)} 
          className="text-white hover:text-green-500 transition-colors cursor-pointer font-medium"
        >
          {label}
        </span>
      ) : (
        <Button 
          onClick={() => setOpen(true)} 
          className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/50"
        >
          {label}
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="relative flex items-center border-b border-gray-700 bg-gray-900 px-3">
          <TrendingUp className="h-4 w-4 text-green-500 opacity-70 mr-2" />
          <CommandInput 
            value={searchTerm} 
            onValueChange={setSearchTerm} 
            placeholder="Search stocks by symbol or name..." 
            className="bg-gray-900 text-white placeholder:text-gray-500 border-0 focus:ring-0 py-3"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="ml-auto text-gray-500 hover:text-green-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {loading && (
            <Loader2 className="h-4 w-4 text-green-500 animate-spin ml-2" />
          )}
        </div>

        <CommandList className="bg-gray-900 max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 text-green-500 animate-spin mr-2" />
              <span className="text-gray-400">Loading stocks...</span>
            </div>
          ) : displayStocks?.length === 0 ? (
            <CommandEmpty className="text-gray-400 py-6 text-center">
              {isSearchMode ? '❌ No stocks found matching your search' : '📊 No stocks available'}
            </CommandEmpty>
          ) : (
            <div className="space-y-2 p-2">
              <div className="px-3 py-2 text-xs font-semibold text-green-500 uppercase tracking-widest">
                {isSearchMode ? '🔍 Search Results' : '⭐ Popular Stocks'} 
                <span className="ml-2 bg-green-500/20 px-2 py-1 rounded text-green-400">
                  {displayStocks?.length || 0}
                </span>
              </div>

              <ul className="space-y-1">
                {displayStocks?.map((stock) => {
                  const isInWatchlist = watchlistStocks.has(stock.symbol);
                  const isLoading = addingToWatchlist === stock.symbol;

                  return (
                    <li key={stock.symbol}>
                      <Link
                        href={`/stocks/${stock.symbol}`}
                        onClick={handleSelectStock}
                        className="group flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-800 transition-colors border border-transparent hover:border-green-500/30"
                      >
                        <TrendingUp className="h-4 w-4 text-green-500 opacity-60 group-hover:opacity-100" />
                        
                        <div className="flex-1">
                          <div className="font-semibold text-white group-hover:text-green-400 transition-colors">
                            {stock.name}
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-gray-400">
                            {stock.symbol} • {stock.exchange} • {stock.type}
                          </div>
                        </div>

                        <div className="ml-auto flex items-center gap-3">
                          <span className="inline-block rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-bold text-green-400 border border-green-500/40">
                            {stock.symbol}
                          </span>

                          <button
                            onClick={(e) => toggleWatchlist(e, stock.symbol)}
                            disabled={isLoading}
                            className="flex-shrink-0 transition-all duration-300"
                            title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                          >
                            {isLoading ? (
                              <Loader2 className="h-5 w-5 text-green-500 animate-spin" />
                            ) : null}
                          </button>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </CommandList>

        <div className="border-t border-gray-700 bg-gray-800 px-3 py-2 text-center text-xs text-gray-500">
          💡 Use <kbd className="rounded bg-gray-700 px-1.5 py-0.5 font-mono text-green-400">⌘K</kbd> or <kbd className="rounded bg-gray-700 px-1.5 py-0.5 font-mono text-green-400">Ctrl+K</kbd> to open
        </div>
      </CommandDialog>
    </>
  )
}