import { Star, Plus } from 'lucide-react';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import SearchCommand from '@/components/searchCommand';
import { getWatchlistWithData } from '@/lib/actions/watchlist.actions';
import { WatchlistTable } from '@/components/watchlistTable';

const Watchlist = async () => {
  let watchlist: any[] = [];
  let initialStocks: any[] = [];
  
  try {
    watchlist = await getWatchlistWithData();
  } catch (error) {
    console.error('Error loading watchlist:', error);
    watchlist = [];
  }
  
  try {
    initialStocks = await searchStocks();
  } catch (error) {
    console.error('Error loading initial stocks:', error);
    initialStocks = [];
  }

  // Empty state
  if (watchlist.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black py-8 px-4 md:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col items-center justify-center gap-12'>
            <div className='text-center'>
              <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>
                Your Watchlist
              </h1>
              <p className='text-gray-400 text-lg'>
                Track your favorite stocks in one place
              </p>
            </div>

            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-green-600/25 via-emerald-500/20 to-teal-600/25 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500'></div>
              <div className='relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-green-500/40 rounded-2xl p-12 max-w-md w-full hover:border-green-500/80 transition-all duration-300 shadow-2xl'>
                <div className='flex flex-col items-center text-center gap-6'>
                  <div className='h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center'>
                    <Star className='h-10 w-10 text-white' />
                  </div>
                  <div>
                    <h2 className='text-2xl font-bold text-white mb-2'>
                      Your watchlist is empty
                    </h2>
                    <p className='text-gray-400 text-sm leading-relaxed'>
                      Start building your watchlist by searching for stocks and clicking the star icon to add them. Monitor multiple stocks and make informed decisions.
                    </p>
                  </div>
                  <SearchCommand initialStocks={initialStocks} label='Add Your First Stock' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black py-8 px-4 md:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2'>
            <div>
              <h1 className='text-4xl md:text-5xl font-bold text-white flex items-center gap-3'>
                <Star className='h-10 w-10 text-yellow-400 fill-yellow-400' />
                Your Watchlist
              </h1>
              <p className='text-gray-400 text-lg mt-2'>
                Monitor {watchlist.length} {watchlist.length === 1 ? 'stock' : 'stocks'} in real-time
              </p>
            </div>
            <SearchCommand initialStocks={initialStocks} label='+ Add Stock' />
          </div>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <div className='group relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='relative bg-gray-800/50 border border-green-500/20 rounded-lg p-4 hover:border-green-500/40 transition-all duration-300'>
              <p className='text-gray-400 text-sm'>Total Stocks</p>
              <p className='text-3xl font-bold text-green-400 mt-1'>{watchlist.length}</p>
            </div>
          </div>
          <div className='group relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='relative bg-gray-800/50 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-all duration-300'>
              <p className='text-gray-400 text-sm'>Gaining</p>
              <p className='text-3xl font-bold text-green-500 mt-1'>
                {watchlist.filter((s: any) => (s.changePercent || 0) > 0).length}
              </p>
            </div>
          </div>
          <div className='group relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-red-600/10 to-pink-600/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='relative bg-gray-800/50 border border-red-500/20 rounded-lg p-4 hover:border-red-500/40 transition-all duration-300'>
              <p className='text-gray-400 text-sm'>Losing</p>
              <p className='text-3xl font-bold text-red-500 mt-1'>
                {watchlist.filter((s: any) => (s.changePercent || 0) < 0).length}
              </p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div>
          <WatchlistTable watchlist={watchlist} />
        </div>
      </div>
    </div>
  );
};

export default Watchlist;