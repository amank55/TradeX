'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface NewsArticle {
  headline?: string;
  title?: string;
  description?: string;
  summary?: string;
  url?: string;
  source?: string;
  datetime?: number;
  image?: string;
  category?: string;
  symbol?: string;
}

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = ({ article }: NewsCardProps) => {
  const headline = article.headline || article.title || 'No headline';
  const description = article.description || article.summary || 'No description available';
  const url = article.url || '#';
  const source = article.source || 'Unknown Source';
  const datetime = article.datetime || 0;

  // Format timestamp
  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'Recently';
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className='group relative h-full'>
      {/* Gradient background effect */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-purple-600/10 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

      {/* Card */}
      <div className='relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-gray-700/50 rounded-xl overflow-hidden shadow-xl hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300 h-full flex flex-col'>
        
        {/* Header with Badge and Time */}
        <div className='px-6 py-5 border-b border-gray-700/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 flex items-start justify-between gap-4'>
          <div className='flex-1'>
            <span className='inline-block px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-bold text-white shadow-lg'>
              TOP NEWS
            </span>
          </div>
          <span className='text-xs text-gray-400 font-medium whitespace-nowrap'>{formatTime(datetime)}</span>
        </div>

        {/* Content */}
        <div className='px-6 py-6 flex-1 flex flex-col gap-4'>
          {/* Headline */}
          <h3 className='text-base font-bold text-white leading-relaxed group-hover:text-purple-300 transition-colors duration-300 line-clamp-3'>
            {headline}
          </h3>

          {/* Description */}
          <p className='text-sm text-gray-300 leading-relaxed line-clamp-4'>
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className='px-6 py-5 border-t border-gray-700/30 bg-gradient-to-r from-gray-900/50 to-gray-800/50 flex items-center justify-between gap-3'>
          <span className='text-xs text-gray-500 font-medium truncate'>{source}</span>
          <Link
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 hover:border-green-500/60 text-green-400 hover:text-green-300 font-semibold text-xs transition-all duration-300 group-hover:gap-3 whitespace-nowrap'
          >
            Read More
            <ExternalLink className='h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300' />
          </Link>
        </div>
      </div>
    </div>
  );
};
