import React, { useState } from 'react';
import { Icons } from './ui/Icons';
import { cn } from '../../../utils';

interface AccordionProps {
  icon: any;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ icon: Icon, title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 border border-gray-100 rounded-lg bg-white shadow-sm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="text-primary-blue" size={20} />
          <span className="text-primary-blue font-semibold text-sm">{title}</span>
        </div>
        <div className={cn("text-gray-400 transition-transform duration-200", isOpen ? "rotate-180" : "")}>
           <Icons.Down size={20} />
        </div>
      </button>
      
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 pt-0">
           {children}
        </div>
      </div>
    </div>
  );
};
