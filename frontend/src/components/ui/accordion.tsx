'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

function AccordionSingle({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(item.defaultOpen ?? false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(item.defaultOpen ? undefined : 0);

  useEffect(() => {
    if (open) {
      const el = contentRef.current;
      if (el) setHeight(el.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div className="border border-slate-800/60 rounded-xl overflow-hidden bg-slate-900/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex-1 min-w-0">{item.title}</div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ml-3 shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        style={{ height: height === undefined ? 'auto' : height, transition: 'height 300ms ease' }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="px-4 pb-4">
          {item.content}
        </div>
      </div>
    </div>
  );
}

export default function Accordion({ items, className = '' }: AccordionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <AccordionSingle key={item.id} item={item} />
      ))}
    </div>
  );
}
