import React, { useState, useEffect, useRef } from "react";
import { Icons } from "./ui/Icons";
import { CreditCard } from "./CreditCard";
import { ActionMenu } from "./ActionMenu";
import { TransactionList } from "./TransactionList";
import { NewCardModal } from "./NewCardModal";
import { Card, Transaction } from "../../../types";
import { cn } from "../../../utils";

// Shadcn UI Imports
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { cardService } from "../services/api";
import { AspireIcon } from "../utils/iconUtil";

export const Dashboard: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Draggable Sheet State (Mobile Only)
  const [isSheetOpen, setIsSheetOpen] = useState(false); // false = closed (bottom), true = open (top)
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null); // Added for carousel

  useEffect(() => {
    const loadedCards = cardService.getCards();
    setCards(loadedCards);
    setTransactions(cardService.getTransactions());
  }, []);

  const handleAddCard = (name: string) => {
    const newCard = cardService.addCard(name);
    setCards([...cards, newCard]);
    setActiveCardIndex(cards.length);
  };

  // --- Carousel Logic Start ---
  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const cardElements = container.querySelectorAll("[data-card-index]");
      const target = cardElements[index] as HTMLElement;

      if (target) {
        const containerWidth = container.offsetWidth;
        const cardWidth = target.offsetWidth;
        // Center the card: position - (half container) + (half card)
        const scrollPos =
          target.offsetLeft - containerWidth / 2 + cardWidth / 2;

        container.scrollTo({
          left: scrollPos,
          behavior: "smooth",
        });
        setActiveCardIndex(index);
      }
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      const centerPos = scrollLeft + width / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      const cardElements =
        carouselRef.current.querySelectorAll("[data-card-index]");
      cardElements.forEach((el: Element, index: number) => {
        const htmlEl = el as HTMLElement;
        const cardCenter = htmlEl.offsetLeft + htmlEl.offsetWidth / 2;
        const dist = Math.abs(centerPos - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = index;
        }
      });

      setActiveCardIndex(closestIndex);
    }
  };

  const currentCard = cards[activeCardIndex];

  // Universal Pointer Handlers (Works for Mouse & Touch on Mobile)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    setIsDragging(true);
    startY.current = e.clientY;
    setDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();

    const currentY = e.clientY;
    const diff = currentY - startY.current;

    // Drag Constraints
    if (!isSheetOpen && diff > 50) return; // Can't drag down much when closed
    if (isSheetOpen && diff < -50) return; // Can't drag up much when open

    setDragOffset(diff);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore
    }

    const threshold = 100; // Pixels to drag to trigger snap

    if (!isSheetOpen) {
      // Closed -> Dragging UP
      if (dragOffset < -threshold) {
        setIsSheetOpen(true);
      }
    } else {
      // Open -> Dragging DOWN
      if (dragOffset > threshold) {
        setIsSheetOpen(false);
      }
    }

    setDragOffset(0);
  };

  // Mobile Sheet Positions
  const topPosition = isSheetOpen ? "24%" : "75%";

  // Reusable Content Sections using Shadcn Accordion
  const ContentSections = () => (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-4"
      defaultValue="transactions"
    >
      <AccordionItem
        value="card-details"
        className="border border-gray-100 rounded-lg bg-white shadow-sm overflow-hidden px-0"
      >
        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline data-[state=open]:bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Icons.Card
              className="text-primary-blue"
              size={20}
              fill={"#23CEFD"}
            />
            <span className="text-primary-blue font-semibold">
              Card details
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="text-gray-500 text-sm py-2">
            <p>Card ID: {currentCard?.id}</p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="transactions"
        className="border border-gray-100 rounded-lg bg-white shadow-sm overflow-hidden px-0"
      >
        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline data-[state=open]:bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Icons.Transaction className="text-primary-blue" size={20} />
            <span className="text-primary-blue font-semibold text-sm">
              Recent transactions
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <TransactionList transactions={transactions} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="w-full h-full relative overflow-hidden bg-primary-blue md:bg-white container mx-auto flex flex-col gap-5 md:overflow-y-auto no-scrollbar">
      {/* 
          MOBILE HEADER (Visible < md)
      */}
      <div className="md:hidden sticky top-0 z-40 bg-primary-blue px-6 pt-4 h-[15%]">
        <div className="flex flex-col gap-4 h-full w-full py-4">
          <div className="flex flex-col justify-between">
            <h2 className="font-md text-white">Account balance</h2>

            <div className="absolute right-4">
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
              onClick={() => setIsModalOpen(true)}
              className="text-[#23CEFD] font-bold text-sm flex gap-2 justify-center items-center"
            >
              <Icons.Plus size={16} className="text-[#23CEFD]" />
              <span>New card</span>
            </button>
          </div>
        </div>

        {/* Shadcn Tabs - Customized for Mobile Header Look */}
        <Tabs defaultValue="debit" className="w-full">
          <TabsList className="bg-transparent p-0 gap-8 h-auto w-full justify-start">
            <TabsTrigger
              value="debit"
              className="bg-transparent text-sm p-0 pb-2 text-white/50 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#23CEFD] rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              My debit cards
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="bg-transparent p-0 pb-2 text-white/50 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary-green rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              All company cards
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 
          DESKTOP/TABLET HEADER (Visible >= md)
      */}
      <div className="hidden md:block p-0 text-black mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <h2 className="text-sm font-medium opacity-80 mb-2">
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
            onClick={() => setIsModalOpen(true)}
            className="gap-2 shadow-md"
          >
            <Icons.Plus size={16} />
            <span className="font-semibold">New card</span>
          </Button>
        </div>

        {/* Shadcn Tabs - Desktop */}
        <Tabs defaultValue="debit" className="w-full">
          <TabsList className="bg-transparent p-0 gap-8 h-auto w-full justify-start border-b border-gray-200 rounded-none">
            <TabsTrigger
              value="debit"
              className="bg-transparent p-0 pb-3 text-gray-400 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-primary-green rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent font-bold"
            >
              My debit cards
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="bg-transparent p-0 pb-3 text-gray-400 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-primary-green rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent font-bold"
            >
              All company cards
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {/* 
          MOBILE CONTENT (Visible < md)
          - Carousel with Peek (Next/Prev Preview)
      */}
      <div
        className="md:hidden relative z-0 pb-32 transition-opacity duration-300 w-full pt-6"
        style={{ opacity: isSheetOpen ? 0.4 : 1 }}
      >
        {/* Carousel Container */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 px-[10vw] no-scrollbar pb-6 w-full"
        >
          {cards.map((card, idx) => {
            const isActive = idx === activeCardIndex;
            return (
              <div
                key={card.id}
                data-card-index={idx}
                className={cn(
                  "min-w-[80vw] snap-center relative cursor-pointer transition-all duration-300 ease-out origin-center",
                  isActive
                    ? "scale-100 opacity-100 z-10"
                    : "scale-95 opacity-50 z-0"
                )}
                onClick={() => scrollToCard(idx)}
              >
                {/* Show Card Number Tab - Attached to Card - Only Visible for Active Card */}
                <div
                  className={cn(
                    "absolute bottom-full right-0 z-10 transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCardNumber(!showCardNumber);
                    }}
                    className="flex items-center gap-1.5 text-primary-green bg-white px-3 py-2 rounded-t-md text-[12px] font-bold pb-2.5 mb-[-1px]"
                  >
                    <Icons.Eye size={16} />
                    <span>Show card number</span>
                  </button>
                </div>

                <CreditCard card={card} showDetails={showCardNumber} />
              </div>
            );
          })}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 -mt-2">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === activeCardIndex
                  ? "w-4 bg-primary-green"
                  : "w-2 bg-primary-green/20"
              )}
            />
          ))}
        </div>
      </div>

      <div
        ref={sheetRef}
        className="md:hidden fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex flex-col z-30"
        style={{
          top: topPosition,
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging
            ? "none"
            : "top 0.5s cubic-bezier(0.32, 0.72, 0, 1), transform 0.3s ease-out",
          height: "100vh",
          touchAction: "none",
        }}
      >
        <div
          className="w-full pt-5 pb-3 cursor-grab active:cursor-grabbing touch-none flex justify-center z-40 select-none bg-white rounded-t-3xl"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-48 no-scrollbar bg-white">
          <ActionMenu className="mb-6 pt-0" />
          <ContentSections />
        </div>
      </div>

      {/* 
          DESKTOP/TABLET CONTENT (Visible >= md)
          - Grid Layout: 1 Column on Tablet, 2 Columns on XL screens
      */}
      <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-start max-w-6xl mx-auto">
        {/* Left Column: Card & Actions */}
        <div className="w-full xl:max-w-md shadow-xl rounded-2xl p-6 lg:p-10 border border-gray-100 bg-white flex flex-col gap-8 mx-auto xl:mx-0">
          {currentCard && (
            <div className="relative">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowCardNumber(!showCardNumber)}
                  className="flex items-center gap-2 text-primary-green text-xs font-bold"
                >
                  <Icons.Eye size={14} />
                  <span>Show card number</span>
                </button>
              </div>
              <CreditCard card={currentCard} showDetails={showCardNumber} />
              <ActionMenu className="mt-8 bg-[#EDF3FF] rounded-xl p-4 md:bg-transparent md:p-0 md:rounded-none" />
            </div>
          )}
        </div>

        {/* Right Column: Details & Transactions */}
        <div className="w-full xl:max-w-md mx-auto xl:mx-0">
          <ContentSections />
        </div>
      </div>

      <NewCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCard}
      />
    </div>
  );
};
