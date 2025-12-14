import React from 'react';
import { Icons } from './ui/Icons';
import { cn } from '../../../utils';

interface ActionMenuProps {
  className?: string;
}

const ACTIONS = [
  { label: 'Freeze card', icon: Icons.Freeze },
  { label: 'Set spend limit', icon: Icons.Limit },
  { label: 'Add to GPay', icon: Icons.GPay },
  { label: 'Replace card', icon: Icons.Replace },
  { label: 'Cancel card', icon: Icons.Cancel },
];

export const ActionMenu: React.FC<ActionMenuProps> = ({ className }) => {
  return (
    <div className={cn("flex justify-between w-full px-2 md:px-0", className)}>
      {ACTIONS.map((action) => (
        <button key={action.label} className="flex flex-col items-center gap-2 group w-[19%] md:w-auto">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary-blue flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm">
            <action.icon size={16} className="md:w-5 md:h-5" />
          </div>
          <span className="text-[11px] md:text-[13px] text-center text-primary-blue leading-tight font-medium md:font-normal h-8 flex items-start justify-center">
             {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};