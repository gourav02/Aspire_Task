import React from 'react';
import { Icons } from './ui/Icons';
import { cn } from '../../../utils';

const NAV_ITEMS = [
  { name: 'Home', icon: Icons.Home, active: false },
  { name: 'Cards', icon: Icons.Card, active: true },
  { name: 'Payments', icon: Icons.Payments, active: false },
  { name: 'Credit', icon: Icons.Credit, active: false },
  { name: 'Profile', icon: Icons.Profile, active: false },
];

export const MobileNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 flex justify-between items-center z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.name}
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors",
            item.active ? "text-primary-green" : "text-gray-300"
          )}
        >
          <item.icon size={24} />
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
};