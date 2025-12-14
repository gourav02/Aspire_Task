import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  const [activeCardIndex, setActiveCardIndex] = useState(1);
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
  const [tabStyle, setTabStyle] = useState<React.CSSProperties>({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const [showTab, setShowTab] = useState(false);
  const [isCarouselScrolling, setIsCarouselScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const pendingScrollIndexRef = useRef<number | null>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [carouselMode, setCarouselMode] = useState<"mobile" | "desktop">(
    window.innerWidth < 768 ? "mobile" : "desktop"
  );

  const SHEET_TOP_LIMIT = 0; // cannot go above viewport
  const SHEET_CLOSED_TOP = window.innerHeight * 0.65;
  const SHEET_OPEN_TOP = window.innerHeight * 0.1; // ~10%

  const updateTabPosition = () => {
    if (carouselMode !== "mobile") return;

    const cardEl = mobileCardRefs.current[activeCardIndex];
    const wrapperEl = carouselWrapperRef.current;

    if (!cardEl || !wrapperEl) return;

    const cardRect = cardEl.getBoundingClientRect();
    const wrapperRect = wrapperEl.getBoundingClientRect();

    setTabStyle({
      position: "absolute",
      top: cardRect.top - wrapperRect.top - 24,
      left: cardRect.right - wrapperRect.left - 147,
    });
  };

  useLayoutEffect(() => {
    if (carouselMode !== "mobile") return;
    if (!cards.length) return;

    // wait for DOM + refs to settle
    requestAnimationFrame(() => {
      scrollToCard(activeCardIndex);
      updateTabPosition();
      setShowTab(true);
    });
  }, [carouselMode, cards.length]);

  useLayoutEffect(() => {
    if (carouselMode !== "mobile") return;
    if (!cards.length) return;

    let raf1: number;
    let raf2: number;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        // mobile refs are guaranteed now
        scrollToCard(activeCardIndex);
        updateTabPosition();
        setShowTab(true);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [carouselMode, cards.length]);

  useLayoutEffect(() => {
    if (pendingScrollIndexRef.current === null) return;

    const index = pendingScrollIndexRef.current;
    pendingScrollIndexRef.current = null;

    requestAnimationFrame(() => {
      scrollToCard(index);
      setShowCardNumber(false); // optional UX reset
    });
  }, [cards.length]);

  useEffect(() => {
    const loadedCards = cardService.getCards();
    setCards(loadedCards);
    setTransactions(cardService.getTransactions());
  }, []);

  const handleAddCard = (name: string) => {
    const newCard = cardService.addCard(name);
    const newIndex = cards.length;

    pendingScrollIndexRef.current = newIndex;

    setCards((prev) => [...prev, newCard]);
  };

  const scrollToCard = (index: number) => {
    const container =
      carouselMode === "mobile"
        ? mobileCarouselRef.current
        : carouselRef.current;

    if (!container) return;

    const target = container.querySelector(
      `[data-card-index="${index}"]`
    ) as HTMLElement;

    if (!target) return;

    const scrollPos =
      target.offsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;

    container.scrollTo({ left: scrollPos, behavior: "smooth" });
    setActiveCardIndex(index);
  };

  // --- Carousel Logic Start ---
  const handleScroll = () => {
    if (carouselMode !== "desktop") return;
    if (!carouselRef.current || pendingScrollIndexRef.current !== null) return;

    setIsCarouselScrolling(true);
    setShowTab(false);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const container = carouselRef.current;
    const centerPos = container.scrollLeft + container.offsetWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(centerPos - cardCenter);

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = index;
      }
    });

    setActiveCardIndex(closestIndex);

    // Detect scroll end
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsCarouselScrolling(false);

      requestAnimationFrame(() => {
        updateTabPosition();
        setShowTab(true);
      });
    }, 120); // adjust if needed
  };
  //mobile
  const handleMobileScroll = () => {
    if (carouselMode !== "mobile") return;
    if (!mobileCarouselRef.current) return;

    setIsCarouselScrolling(true);
    setShowTab(false);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const container = mobileCarouselRef.current;
    const centerPos = container.scrollLeft + container.offsetWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    mobileCardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(centerPos - cardCenter);

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = index;
      }
    });

    setActiveCardIndex(closestIndex);

    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsCarouselScrolling(false);

      requestAnimationFrame(() => {
        updateTabPosition();
        setShowTab(true);
      });
    }, 120);
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
    const newTop = baseTop + diff;

    // Clamp so it never crosses limits
    if (newTop < SHEET_TOP_LIMIT) {
      setDragOffset(SHEET_TOP_LIMIT - baseTop);
      return;
    }

    if (newTop > SHEET_CLOSED_TOP) {
      setDragOffset(SHEET_CLOSED_TOP - baseTop);
      return;
    }

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

  useEffect(() => {
    const handleResize = () => {
      const nextMode = window.innerWidth < 1024 ? "mobile" : "desktop";

      setCarouselMode((prev) => {
        if (prev !== nextMode) {
          // force sync when mode changes
          requestAnimationFrame(() => {
            scrollToCard(activeCardIndex);
            setShowTab(false);
          });
        }
        return nextMode;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeCardIndex]);

  useLayoutEffect(() => {
    if (!cards.length) return;

    setShowTab(false);

    const raf = requestAnimationFrame(() => {
      updateTabPosition();
      setShowTab(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [activeCardIndex, cards.length]);

  // Mobile Sheet Positions
  const baseTop = isSheetOpen ? SHEET_OPEN_TOP : SHEET_CLOSED_TOP;

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
    <div className="w-full h-full relative overflow-hidden bg-primary-blue md:bg-white flex flex-col gap-8 md:p-[60px] md:overflow-y-auto no-scrollbar">
      {/* 
          MOBILE HEADER (Visible < md)
      */}
      <div className="md:hidden sticky top-0 bg-primary-blue px-6 pt-4 flex flex-col gap-7 pb-4">
        <div className="flex flex-col gap-2 w-full">
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
      <div className="hidden md:relative md:flex flex-col p-0 text-black gap-9">
        <div className="flex justify-between items-center">
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
            onClick={() => setIsModalOpen(true)}
            className="gap-2 shadow-md"
          >
            <Icons.Plus size={16} />
            <span className="font-semibold">New card</span>
          </Button>
        </div>

        {/* Shadcn Tabs - Desktop */}
        <Tabs defaultValue="debit" className="w-full">
          <TabsList className="bg-transparent p-0 gap-8 h-auto w-full justify-start rounded-none">
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
        ref={carouselWrapperRef}
        className="md:hidden relative z-0 transition-opacity duration-300 w-full"
        style={{ opacity: isSheetOpen ? 0.4 : 1 }}
      >
        {/* Carousel Container */}
        <div
          ref={mobileCarouselRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3 px-[10vw] no-scrollbar pb-6 w-full"
        >
          {cards.map((card, idx) => {
            return (
              <div
                ref={(el) => (mobileCardRefs.current[idx] = el)}
                key={card.id}
                data-card-index={idx}
                className={cn(
                  "min-w-[80vw] snap-center relative cursor-pointer z-20 overflow-hidden",
                  idx === activeCardIndex
                    ? "scale-100 opacity-100"
                    : "scale-[0.97] opacity-80"
                )}
                onClick={() => scrollToCard(idx)}
              >
                <CreditCard card={card} showDetails={showCardNumber} />
              </div>
            );
          })}
        </div>

        {/* FLOATING TAB */}
        {cards[activeCardIndex] && !isCarouselScrolling && (
          <div
            style={tabStyle}
            className={cn(
              "z-10 h-10 pointer-events-auto",
              showTab ? "opacity-100" : "opacity-0"
            )}
          >
            <button
              onClick={() => setShowCardNumber(!showCardNumber)}
              className="flex h-full items-center gap-2 bg-white text-primary-green px-2 pb-3 rounded-t-md text-xs font-medium"
            >
              <Icons.Eye size={16} />
              Show card number
            </button>
          </div>
        )}

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
        className="md:hidden fixed left-0 right-0 bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex flex-col z-30"
        style={{
          top: baseTop,
          transform: `translateY(${dragOffset}px)`,
          height: "100vh",
          transition: isDragging
            ? "none"
            : "top 0.45s cubic-bezier(0.32, 0.72, 0, 1)",
          touchAction: "none",
          overscrollBehavior: "contain",
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
  DESKTOP / TABLET CONTENT
   */}
      <div className="hidden md:flex w-full justify-center">
        <div
          className="
      w-full 
      max-w-dvw 
      flex 
      lg:flex-row
      md:flex-col
      md:justify-center
      md:items-center
      gap-10 
      items-start 
      px-8
      py-10
      bg-white
      rounded-2xl
      shadow-xl
      border border-gray-100
    "
        >
          {/* LEFT COLUMN — CARD + CAROUSEL */}
          <div className="flex flex-col w-full lg:w-1/2 max-w-[450px] h-full min-w-[358px] mx-auto">
            {/* DESKTOP CAROUSEL */}
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar  w-full  max-w-full self-stretch"
            >
              {cards.map((card, idx) => (
                <div
                  key={card.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  data-card-index={idx}
                  className={cn(
                    "min-w-full snap-center transition-all duration-300",
                    idx === activeCardIndex
                      ? "opacity-100 scale-100"
                      : "opacity-90 scale-[0.98]"
                  )}
                  onClick={() => scrollToCard(idx)}
                >
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

                    <CreditCard card={card} showDetails={showCardNumber} />
                  </div>
                </div>
              ))}
            </div>

            {/* DOTS */}
            <div className="flex justify-center gap-2 mt-4">
              {cards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    idx === activeCardIndex
                      ? "w-4 bg-primary-green"
                      : "w-2 bg-primary-green/30"
                  )}
                />
              ))}
            </div>

            {/* ACTION MENU */}
            <div className="mt-6">
              <ActionMenu className="bg-[#EDF3FF] rounded-2xl p-4" />
            </div>
          </div>

          {/* RIGHT COLUMN — DETAILS */}
          <div className="flex-1 min-w-0">
            <ContentSections />
          </div>
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
