import React from 'react';
import { Card } from '../../../types';
import { cn } from '../../../utils';
import { Icons } from './ui/Icons';


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
    if (showDetails) return <div className="text-xl md:text-2xl font-bold tracking-widest font-mono mt-1">{formattedNumber}</div>;
    
    // Masked version: Dots for first 12, then last 4 digits
    const lastFour = card.cardNumber.slice(-4);
    return (
      <div className="flex items-center gap-3 md:gap-4 text-white mt-1.5">
        <div className="flex gap-1.5"><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div></div>
        <div className="flex gap-1.5"><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div></div>
        <div className="flex gap-1.5"><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div><div className="w-2 h-2 bg-white rounded-full"></div></div>
        <span className="text-sm md:text-lg font-bold tracking-widest ml-1">{lastFour}</span>
      </div>
    );
  };

  return (
    <div className={cn("bg-primary-green rounded-[24px] p-6 md:p-8 text-white w-full aspect-[1.586] relative overflow-hidden shadow-xl mx-auto", className)}>
      {/* Aspire Logo on Card */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5">
          {/* Logo Icon */}
           <Icons.Credit className="text-white transform rotate-45" size={20} fill="white" />
        <span className="font-bold text-lg tracking-wide">aspire</span>
      </div>

      <div className="flex flex-col h-full justify-end mt-2">
        <h3 className="text-xl md:text-2xl font-bold tracking-wide mb-6 md:mb-8 truncate">{card.name}</h3>
        
        <div className="mb-4 min-h-[32px]">
            {renderNumber()}
        </div>

        <div className="flex items-center gap-6 md:gap-10 text-[11px] md:text-sm font-semibold tracking-wide">
          <span>Thru: {card.expiryDate}</span>
          <div className="flex items-center gap-2">
            <span>CVV:</span>
            <span className="text-sm md:text-lg tracking-widest leading-none translate-y-[1px]">{showDetails ? card.cvv : '***'}</span>
          </div>
        </div>

        {/* Visa Logo */}
        <div className="absolute bottom-6 right-6">
           <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 md:w-[60px]">
                <path d="M23.0116 0.306641L15.3906 18.6631H10.4285L6.50293 4.25997C6.27363 3.3283 6.06643 2.94664 5.30948 2.53164C4.03264 1.8483 1.91266 1.34997 0.5 1.05664L0.603309 0.584974H8.46043C9.55403 0.584974 10.6063 1.32664 10.8447 2.57164L12.8715 13.68L18.0622 0.306641H23.0116ZM43.3768 12.87C43.3975 8.16997 36.6575 7.91997 36.7299 5.80331C36.7506 4.88997 37.5894 3.91331 39.5463 3.75831C40.5289 3.67664 43.2008 3.63497 45.4269 4.67331L46.2241 0.898307C45.1473 0.514974 43.7599 0.173307 41.9791 0.173307C36.8542 0.173307 31.812 2.91164 31.7809 7.42164C31.7499 10.6583 34.6282 12.4566 36.8128 13.535C39.0594 14.6333 39.8152 15.34 39.8049 16.335C39.7841 17.8683 38.076 18.575 36.4297 18.595C33.7272 18.615 32.164 17.8683 30.932 17.2883L30.0726 21.3633C31.1804 21.8816 33.2509 22.33 35.4565 22.3483C41.0264 22.3683 44.6917 19.615 44.7124 15.2866L43.3768 12.87ZM56.2464 0.306641H52.1775C50.8524 0.306641 49.7238 0.698307 49.144 2.05331L42.0206 18.6631H47.1663L48.1913 15.8233H54.4243L55.0041 18.6631H59.5496L56.2464 0.306641ZM49.6202 12.0166L52.1257 5.09997L53.5442 12.0166H49.6202ZM29.6225 0.306641L25.6881 18.6631H30.6375L34.5719 0.306641H29.6225Z" fill="white"/>
            </svg>
        </div>
      </div>
    </div>
  );
};
