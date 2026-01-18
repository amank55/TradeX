'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WATCHLIST_TABLE_HEADER } from '@/lib/constants';
import { Button } from './button';
import WatchlistButton from './watchlistButton';
import { useRouter } from 'next/navigation';
import { cn, getChangeColorClass } from '@/lib/utils';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface WatchlistTableProps {
  watchlist: any[];
}

export function WatchlistTable({ watchlist }: WatchlistTableProps) {
  const router = useRouter();

  return (
    <div className='w-full'>
      {/* Table Container */}
      <div className='relative rounded-2xl border border-green-500/20 overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800/80 via-gray-850/80 to-gray-900/80 backdrop-blur-sm hover:border-green-500/40 transition-all duration-300'>
        {/* Gradient Overlay Background */}
        <div className='absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-emerald-600/5 pointer-events-none'></div>
        
        {/* Table */}
        <Table className='relative z-10'>
          {/* Table Header */}
          <TableHeader className='bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 border-b border-green-500/20 sticky top-0'>
            <TableRow className='hover:bg-transparent'>
              {WATCHLIST_TABLE_HEADER.map((label) => (
                <TableHead 
                  key={label} 
                  className='text-xs font-bold uppercase tracking-widest text-green-400 px-6 py-4 text-left hover:text-green-300 transition-colors duration-300 first:rounded-tl-lg last:rounded-tr-lg'
                >
                  <div className='flex items-center gap-2'>
                    {label === 'Change' && <TrendingUp className='h-3 w-3 text-green-500' />}
                    {label === 'Price' && <TrendingUp className='h-3 w-3 text-green-500' />}
                    {label === 'Company' && <span className='h-2 w-2 rounded-full bg-green-500'></span>}
                    {label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className='divide-y divide-green-500/10'>
            {watchlist.map((item, index) => {
              try {
                return (
                  <TableRow
                    key={item.symbol + index}
                    onClick={() => {
                      try {
                        router.push(`/stocks/${encodeURIComponent(item.symbol)}`);
                      } catch (error) {
                        console.error('Navigation error:', error);
                      }
                    }}
                    className='group cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500/10 hover:via-transparent hover:to-emerald-500/10 border-b border-gray-700/30 hover:border-green-500/30'
                  >
                    {/* Company Name */}
                    <TableCell className='px-6 py-4 text-left'>
                      <div className='flex items-center gap-3'>
                        <div className='h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-lg'>
                          {(item.company || '?')[0].toUpperCase()}
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-semibold text-white group-hover:text-green-400 transition-colors duration-200'>
                            {item.company || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Symbol */}
                    <TableCell className='px-6 py-4 text-left'>
                      <span className='inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-xs font-bold text-blue-300 group-hover:bg-blue-500/30 transition-colors duration-200'>
                        {item.symbol || '—'}
                      </span>
                    </TableCell>

                    {/* Price */}
                    <TableCell className='px-6 py-4 text-left'>
                      <span className='font-bold text-white text-lg'>
                        {item.priceFormatted || item.price ? `$${typeof item.price === 'number' ? item.price.toFixed(2) : '—'}` : '—'}
                      </span>
                    </TableCell>

                    {/* Change Percentage */}
                    <TableCell className='px-6 py-4 text-left'>
                      <div className={cn(
                        'flex items-center gap-2 font-bold text-sm px-3 py-1 rounded-full w-fit transition-all duration-300',
                        (item.changePercent ?? 0) > 0 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40 group-hover:bg-green-500/30 group-hover:border-green-500/60' 
                          : (item.changePercent ?? 0) < 0 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 group-hover:bg-red-500/30 group-hover:border-red-500/60'
                          : 'bg-gray-700/30 text-gray-400 border border-gray-600/40 group-hover:bg-gray-700/50'
                      )}>
                        {(item.changePercent ?? 0) > 0 ? (
                          <TrendingUp className='h-3 w-3' />
                        ) : (item.changePercent ?? 0) < 0 ? (
                          <TrendingDown className='h-3 w-3' />
                        ) : null}
                        {item.changeFormatted || typeof item.changePercent === 'number' ? `${(item.changePercent ?? 0).toFixed(2)}%` : '—'}
                      </div>
                    </TableCell>

                    {/* Market Cap */}
                    <TableCell className='px-6 py-4 text-left'>
                      <span className='text-gray-300 font-medium group-hover:text-white transition-colors duration-200'>
                        {item.marketCap || '—'}
                      </span>
                    </TableCell>

                    {/* P/E Ratio */}
                    <TableCell className='px-6 py-4 text-left'>
                      <span className='text-gray-300 font-medium group-hover:text-white transition-colors duration-200'>
                        {item.peRatio || '—'}
                      </span>
                    </TableCell>

                    {/* Alert Button */}
                    <TableCell className='px-6 py-4 text-left'>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Alert clicked for:', item.symbol);
                        }}
                        className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/40 hover:bg-orange-500/30 border border-gray-600/40 hover:border-orange-500/40 text-gray-400 hover:text-orange-400 font-medium text-sm transition-all duration-200 group-hover:scale-105 cursor-pointer'
                      >
                        <AlertCircle className='h-4 w-4' />
                        Alert
                      </button>
                    </TableCell>

                    {/* Action (Remove Button) */}
                    <TableCell className='px-6 py-4 text-right'>
                      <div className='flex justify-end' onClick={(e) => e.stopPropagation()}>
                        <WatchlistButton
                          symbol={item.symbol || ''}
                          company={item.company || ''}
                          isInWatchlist={true}
                          showTrashIcon={true}
                          type='icon'
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              } catch (error) {
                console.error('Error rendering watchlist row:', error);
                return null;
              }
            })}
            
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
