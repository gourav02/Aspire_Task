import React from "react";
import { Icons } from "./ui/Icons";
import { cn } from "../../../utils";
import { AccountIcon, AspireTextIcon, AspireWIcon, CardIcon, CreditIcon, PaymentIcon } from "../utils/iconUtil";

interface SidebarProps {
  className?: string;
}

const NAV_ITEMS = [
  { name: "Home", icon: AspireWIcon, active: false },
  { name: "Cards", icon: CardIcon, active: true },
  { name: "Payments", icon: PaymentIcon, active: false },
  { name: "Credit", icon: CreditIcon, active: false },
  { name: "Settings", icon: AccountIcon, active: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-64 xl:w-80 bg-primary-blue text-white flex flex-col gap-20 h-full py-12 px-8",
        className
      )}
    >
      <div className="flex flex-col gap-5">
        <div>
          <AspireTextIcon />
        </div>

        <p className="text-white/30">
          Trusted way of banking for 3,000+
          <br />
          SMEs and startups in Singapore
        </p>
      </div>

      <nav className="flex flex-col gap-[60px]">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.name}
            href="#"
            className={cn(
              "flex items-center gap-4 text-base font-medium transition-colors p-2",
              item.active
                ? "text-primary-green"
                : "text-white hover:text-white/80"
            )}
          >
            <item.icon />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};
