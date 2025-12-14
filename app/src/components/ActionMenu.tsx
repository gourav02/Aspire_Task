import React from 'react';
import { Icons } from './ui/Icons';
import { cn } from '../../../utils';
import { DeactiveCard, FreezeIcon, GpayIcon, ReplaceCard, SpeedIcon } from '../utils/iconUtil';

interface ActionMenuProps {
  className?: string;
}

const ACTIONS = [
  { label: 'Freeze card', icon: FreezeIcon },
  { label: 'Set spend limit', icon: SpeedIcon },
  { label: 'Add to GPay', icon: GpayIcon },
  { label: 'Replace card', icon: ReplaceCard},
  { label: 'Cancel card', icon: DeactiveCard },
];

export const ActionMenu: React.FC<ActionMenuProps> = ({ className }) => {
  return (
    <div className={cn("flex justify-between w-full px-2", className)}>
      {ACTIONS.map((action) => (
        <button key={action.label} className="flex flex-col items-center gap-2 group w-[16%] md:w-auto">
          <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm">
            <action.icon />
          </div>
          <span className="text-[11px] md:text-[13px] text-center text-primary-blue leading-tight font-medium md:font-normal h-8 flex items-start justify-center">
             {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};