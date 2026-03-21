"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Accordion Item ─── */

interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  className,
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div
      className={cn(
        "border-b border-gray-200/80 last:border-b-0",
        className
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between gap-4",
          "py-5 text-left",
          "transition-colors duration-150",
          "hover:text-blue-600",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:rounded-lg"
        )}
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-gray-900 sm:text-lg">
          {question}
        </span>
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            "bg-gray-100 transition-all duration-300",
            isOpen && "bg-blue-100 rotate-0"
          )}
        >
          {isOpen ? (
            <Minus className="h-4 w-4 text-blue-600" />
          ) : (
            <Plus className="h-4 w-4 text-gray-500" />
          )}
        </span>
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight }}
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="pb-5 text-gray-500 leading-relaxed">{answer}</div>
      </div>
    </div>
  );
}

/* ─── Accordion ─── */

interface AccordionData {
  question: string;
  answer: React.ReactNode;
}

interface AccordionProps {
  items: AccordionData[];
  allowMultiple?: boolean;
  className?: string;
}

function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggle = useCallback(
    (index: number) => {
      setOpenIndices((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  return (
    <div
      className={cn(
        "divide-y-0 rounded-2xl border border-gray-200/60",
        "bg-white/70 backdrop-blur-xl",
        "shadow-sm px-6",
        className
      )}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          question={item.question}
          answer={item.answer}
          isOpen={openIndices.has(i)}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  );
}

export { Accordion, AccordionItem };
export type { AccordionProps, AccordionData, AccordionItemProps };
