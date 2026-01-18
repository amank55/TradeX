'use client';

import { useState } from 'react';
import { createAlert } from '@/lib/actions/alert.actions';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface PriceAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  company: string;
}

export const PriceAlertDialog = ({
  isOpen,
  onClose,
  symbol,
  company,
}: PriceAlertDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    alertName: `${company} Price Alert`,
    alertType: 'price',
    condition: 'greater-than',
    thresholdValue: '',
    frequency: 'once',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.alertName.trim()) {
      toast.error('Alert name is required');
      return;
    }

    if (!formData.thresholdValue || Number(formData.thresholdValue) <= 0) {
      toast.error('Please enter a valid threshold value');
      return;
    }

    try {
      setIsLoading(true);
      const result = await createAlert(
        symbol,
        company,
        formData.alertName,
        formData.alertType,
        formData.condition,
        Number(formData.thresholdValue),
        formData.frequency
      );

      if (result.success) {
        toast.success('Price alert created successfully!');
        setFormData({
          alertName: `${company} Price Alert`,
          alertType: 'price',
          condition: 'greater-than',
          thresholdValue: '',
          frequency: 'once',
        });
        onClose();
      } else {
        toast.error(result.error || 'Failed to create alert');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Failed to create alert');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none'>
        <div className='pointer-events-auto relative bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 border border-gray-700/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto'>
          {/* Header */}
          <div className='sticky top-0 px-8 py-6 border-b border-gray-700/30 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-md flex items-center justify-between z-10'>
            <h2 className='text-2xl font-bold text-white'>Price Alert</h2>
            <button
              onClick={onClose}
              className='p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors duration-300'
              disabled={isLoading}
            >
              <X className='h-5 w-5 text-gray-400 hover:text-white transition-colors' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='px-8 py-8 space-y-6'>
            {/* Alert Name */}
            <div>
              <label className='block text-sm font-semibold text-gray-200 mb-3'>
                Alert Name
              </label>
              <input
                type='text'
                name='alertName'
                value={formData.alertName}
                onChange={handleChange}
                placeholder='Apple at Discount!'
                className='w-full px-4 py-3 bg-gray-700/40 border border-gray-600/50 hover:border-gray-500/70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500/70 focus:ring-2 focus:ring-green-500/20 transition-all duration-300'
              />
            </div>

            {/* Stock Identifier */}
            <div>
              <label className='block text-sm font-semibold text-gray-200 mb-3'>
                Stock Identifier
              </label>
              <input
                type='text'
                value={`${company} (${symbol})`}
                disabled
                className='w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-gray-400 cursor-not-allowed font-medium'
              />
            </div>

            {/* Alert Type */}
            <div>
              <label className='block text-sm font-semibold text-gray-200 mb-3'>
                Alert Type
              </label>
              <select
                name='alertType'
                value={formData.alertType}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-700/40 border border-gray-600/50 hover:border-gray-500/70 rounded-lg text-white focus:outline-none focus:border-green-500/70 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 cursor-pointer appearance-none'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '36px',
                }}
              >
                <option value='price' style={{ backgroundColor: '#1e293b', color: '#fff' }}>Price</option>
                <option value='percentage' style={{ backgroundColor: '#1e293b', color: '#fff' }}>Percentage Change</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className='block text-sm font-semibold text-gray-200 mb-3'>
                Condition
              </label>
              <select
                name='condition'
                value={formData.condition}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-700/40 border border-gray-600/50 hover:border-gray-500/70 rounded-lg text-white focus:outline-none focus:border-green-500/70 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 cursor-pointer appearance-none'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '36px',
                }}
              >
                <option value='greater-than' style={{ backgroundColor: '#1e293b', color: '#fff' }}>Greater than (&gt;)</option>
                <option value='less-than' style={{ backgroundColor: '#1e293b', color: '#fff' }}>Less than (&lt;)</option>
                <option value='equals' style={{ backgroundColor: '#1e293b', color: '#fff' }}>Equals (=)</option>
              </select>
            </div>

            {/* Threshold Value */}
            <div>
              <label className='block text-sm font-semibold text-gray-200 mb-3'>
                Threshold Value
              </label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-semibold'>
                  {formData.alertType === 'price' ? '$' : '%'}
                </span>
                <input
                  type='number'
                  name='thresholdValue'
                  value={formData.thresholdValue}
                  onChange={handleChange}
                  placeholder='eg. 140'
                  step='0.01'
                  min='0'
                  className='w-full pl-8 pr-4 py-3 bg-gray-700/40 border border-gray-600/50 hover:border-gray-500/70 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500/70 focus:ring-2 focus:ring-green-500/20 transition-all duration-300'
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className='block text-sm font-semibold text-gray-200 mb-3'>
                Frequency
              </label>
              <select
                name='frequency'
                value={formData.frequency}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-700/40 border border-gray-600/50 hover:border-gray-500/70 rounded-lg text-white focus:outline-none focus:border-green-500/70 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 cursor-pointer appearance-none'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  paddingRight: '36px',
                }}
              >
                <option value='once' style={{ backgroundColor: '#1e293b', color: '#fff' }}>
                  Once per day
                </option>
                <option value='every-time' style={{ backgroundColor: '#1e293b', color: '#fff' }}>
                  Every time
                </option>
                <option value='daily' style={{ backgroundColor: '#1e293b', color: '#fff' }}>
                  Once daily
                </option>
              </select>
            </div>

            {/* Buttons */}
            <div className='pt-6 border-t border-gray-700/30 sticky bottom-0 bg-gradient-to-t from-gray-900 to-transparent'>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-green-500/50 disabled:to-emerald-600/50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-base'
              >
                {isLoading ? 'Creating Alert...' : 'Create Alert'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
