import React from 'react';
import { Transaction } from '../../../types';
import { Icons } from './ui/Icons';
import { formatCurrency } from '../../../utils';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Icons.Payments size={18} />;
      case 'entertainment': return <Icons.Payments size={18} />;
      default: return <Icons.Business size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-lg p-0">
      <div className="space-y-0">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0 group cursor-pointer hover:bg-gray-50/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 ${t.iconBg}`}>
                {getIcon(t.category)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-black mb-1">{t.merchant}</h4>
                <p className="text-xs text-gray-400 mb-2">{t.date}</p>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary-blue text-white flex items-center justify-center">
                        <Icons.Card size={8} />
                    </div>
                    <span className="text-[#325BAF] text-[10px] md:text-xs font-semibold">
                        {t.type === 'credit' ? 'Refund on debit card' : 'Charged to debit card'}
                    </span>
                </div>
              </div>
            </div>
            <div className={`font-bold text-sm flex items-center gap-1 ${t.type === 'credit' ? 'text-primary-green' : 'text-black'}`}>
              <span>{t.type === 'credit' ? '+' : '-'}</span>
              <span>{formatCurrency(t.amount)}</span>
              <span className="text-gray-300 ml-1">
                <Icons.Down size={16} className="-rotate-90" />
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-3.5 text-primary-green bg-[#EDFFF5] mt-4 rounded-lg font-semibold text-xs md:text-sm border border-[#EDFFF5] hover:bg-white hover:border-primary-green transition-all">
        View all card transactions
      </button>
    </div>
  );
};
