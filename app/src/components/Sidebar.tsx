import React from 'react';
import { Icons } from './ui/Icons';
import { cn } from '../../../utils';

interface SidebarProps {
  className?: string;
}

const NAV_ITEMS = [
  { name: 'Home', icon: Icons.Home, active: false },
  { name: 'Cards', icon: Icons.Card, active: true },
  { name: 'Payments', icon: Icons.Payments, active: false },
  { name: 'Credit', icon: Icons.Credit, active: false },
  { name: 'Settings', icon: Icons.Profile, active: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn("w-64 xl:w-80 bg-primary-blue text-white flex flex-col h-full py-12 px-8", className)}>
      <div className="mb-16">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary-green">
           {/* Mock Logo */}
           <div className="w-8 h-8 relative">
             <div className="absolute inset-0 bg-primary-green rounded-full transform -rotate-45 flex items-center justify-center text-primary-blue text-xs font-bold">A</div>
           </div>
           <span className="text-white tracking-wide">aspire</span>
        </div>
        <p className="text-white/30 text-xs mt-4">
          Trusted way of banking for 3,000+<br/>SMEs and startups in Singapore
        </p>
      </div>

      <nav className="flex-1 space-y-4">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.name}
            href="#"
            className={cn(
              "flex items-center gap-4 text-base font-medium transition-colors p-2",
              item.active ? "text-primary-green" : "text-white hover:text-white/80"
            )}
          >
            <item.icon size={24} />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};