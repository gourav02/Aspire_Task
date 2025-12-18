import React from "react";
import { Icons } from "./ui/Icons";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { AspireIcon } from "../utils/iconUtil";

type DashboardHeaderProps = {
  variant: "mobile" | "desktop";
  onNewCard: () => void;
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  variant,
  onNewCard,
}) => {
  const isMobile = variant === "mobile";

  return (
    <div
      className={
        isMobile
          ? "md:hidden sticky top-0 bg-primary-blue px-6 pt-4 flex flex-col gap-7 pb-4"
          : "hidden md:relative md:flex flex-col p-0 text-black gap-9"
      }
    >
      <div
        className={
          isMobile
            ? "flex flex-col gap-2 w-full"
            : "flex justify-between items-center"
        }
      >
        {isMobile ? (
          <>
            <div className="flex justify-between">
              <h2 className="font-md text-white">Account balance</h2>
              <div className="">
                <AspireIcon />
              </div>
            </div>
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="bg-primary-green px-3 py-1 rounded-[4px] text-xs font-bold text-white">
                  S$
                </div>
                <span className="text-2xl font-bold text-white">3,000</span>
              </div>
              <button
                onClick={onNewCard}
                className="text-[#23CEFD] font-bold text-sm flex gap-2 justify-center items-center"
              >
                <Icons.Plus size={16} className="text-[#23CEFD]" />
                <span>New card</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-medium opacity-80">
                Available balance
              </h2>
              <div className="flex items-center gap-3">
                <div className="bg-primary-green px-3 py-1 rounded-[4px] text-xs font-bold text-white">
                  S$
                </div>
                <span className="text-2xl font-bold">3,000</span>
              </div>
            </div>
            <Button
              variant="default"
              onClick={onNewCard}
              className="gap-2 shadow-md"
            >
              <Icons.Plus size={16} />
              <span className="font-semibold">New card</span>
            </Button>
          </>
        )}
      </div>

      <Tabs defaultValue="debit" className="w-full">
        <TabsList
          className={
            isMobile
              ? "bg-transparent p-0 gap-8 h-auto w-full justify-start"
              : "bg-transparent p-0 gap-8 h-auto w-full justify-start rounded-none"
          }
        >
          <TabsTrigger
            value="debit"
            className={
              isMobile
                ? "bg-transparent text-sm p-0 pb-2 text-white/50 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#23CEFD] rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                : "bg-transparent p-0 pb-3 text-gray-400 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-primary-green rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent font-bold"
            }
          >
            My debit cards
          </TabsTrigger>
          <TabsTrigger
            value="company"
            className={
              isMobile
                ? "bg-transparent p-0 pb-2 text-white/50 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary-green rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                : "bg-transparent p-0 pb-3 text-gray-400 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-primary-green rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent font-bold"
            }
          >
            All company cards
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
