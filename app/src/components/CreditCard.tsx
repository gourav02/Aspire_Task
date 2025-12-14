import React from 'react';
import { Card } from '../../../types';
import { cn } from '../../../utils';
import { Icons } from './ui/Icons';
import { AspireWhiteIcon, VisaIcon } from '../utils/iconUtil';


interface CreditCardProps {
  card: Card;
  showDetails: boolean;
  className?: string;
}

export const CreditCard: React.FC<CreditCardProps> = ({ card, showDetails, className }) => {
  // Format card number with spaces every 4 digits
  const formattedNumber = card.cardNumber.match(/.{1,4}/g)?.join('   ') || '';
  
  // Masking logic
  const renderNumber = () => {
    if (showDetails) return <div className="text-sm font-bold tracking-widest font-mono mt-1">{formattedNumber}</div>;
    
    // Masked version: Dots for first 12, then last 4 digits
    const lastFour = card.cardNumber.slice(-4);
    return (
      <div className="flex items-center gap-3 md:gap-4 text-white mt-1.5">
        <div className="flex gap-1.5"><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div></div>
        <div className="flex gap-1.5"><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div></div>
        <div className="flex gap-1.5"><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div></div>
        <span className="text-sm font-bold tracking-widest ml-1">{lastFour}</span>
      </div>
    );
  };

  return (
    <div className={cn("bg-[#01D167] rounded-[12px] p-4 md:p-6 text-white w-full aspect-[1.586] relative overflow-hidden shadow-xl mx-auto flex flex-col gap-3 md:gap-6", className)}>
      {/* Aspire Logo on Card */}
      <div className="flex justify-end">
          {/* Logo Icon */}
           <AspireWhiteIcon />
      </div>

      <div className="flex flex-col h-full justify-end">
        <h3 className="text-xl md:text-2xl font-bold tracking-wide truncate mb-4">{card.name}</h3>
        
        <div className="min-h-[32px]">
            {renderNumber()}
        </div>

        <div className="flex items-center gap-6 md:gap-10 text-sm font-semibold tracking-wide">
          <span>Thru: {card.expiryDate}</span>
          <div className="flex items-center gap-2">
            <span>CVV:</span>
            <span className="text-sm tracking-widest leading-none translate-y-[1px]">{showDetails ? card.cvv : '***'}</span>
          </div>
        </div>
      </div>
       {/* Visa Logo */}
        <div className="flex justify-end">
           <VisaIcon />
        </div>
    </div>
  );
};
