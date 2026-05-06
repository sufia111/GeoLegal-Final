"use client";

import React, { useState } from "react";
import { TRAP_LAWS_DATA } from "@/lib/legal-data";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  ShieldCheck, 
  Gavel, 
  Info, 
  Lock, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATES = ["Bihar", "Maharashtra", "West Bengal", "Rajasthan", "Uttar Pradesh"];

export default function LegalDictionaryPage() {
  const [activeState, setActiveState] = useState("Bihar");
  const [openLawId, setOpenLawId] = useState<number | null>(null);

  const currentLaws = TRAP_LAWS_DATA[activeState as keyof typeof TRAP_LAWS_DATA] || [];

  const toggleLaw = (id: number) => {
    setOpenLawId(openLawId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-24 px-6">
      <div className="max-w-4xl mx-auto"> {/* Narrower layout for better accordion readability */}
        
        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-5xl font-display font-bold text-[#1A3A72] mb-4">
            State <span className="text-[#6B3A1F]">Trap Laws</span>
          </h1>
          <p className="font-serif text-lg text-stone-600 leading-relaxed">
            Select a state and click on a law to expand the details. Awareness is your first line of defense.
          </p>
        </header>

        {/* STATE SELECTOR TABS */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-stone-200 pb-4">
          {STATES.map((state) => (
            <button
              key={state}
              onClick={() => {
                setActiveState(state);
                setOpenLawId(null); // Reset accordion when state changes
              }}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all border",
                activeState === state
                  ? "bg-[#6B3A1F] text-white border-[#6B3A1F] shadow-md"
                  : "bg-white text-stone-500 border-stone-200 hover:border-amber-300 hover:text-amber-800"
              )}
            >
              {state}
            </button>
          ))}
        </div>

        {/* ACCORDION LAWS DISPLAY */}
        {currentLaws.length > 0 ? (
          <div className="space-y-4">
            {currentLaws.map((law) => {
              const isOpen = openLawId === law.id;
              
              return (
                <div 
                  key={law.id} 
                  className={cn(
                    "border rounded-2xl overflow-hidden transition-all duration-300",
                    isOpen 
                      ? "border-amber-300 shadow-lg ring-1 ring-amber-100" 
                      : "border-stone-200 shadow-sm hover:border-stone-300"
                  )}
                >
                  {/* ACCORDION HEADER (Click to toggle) */}
                  <button
                    onClick={() => toggleLaw(law.id)}
                    className="w-full flex items-center justify-between p-6 bg-white text-left transition-colors hover:bg-stone-50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{law.icon}</span>
                      <div>
                        <h3 className="text-xl font-display font-bold text-[#1A3A72]">
                          {law.title}
                        </h3>
                        <Badge className={cn(
                          "mt-1 uppercase text-[9px] font-bold",
                          law.risk === "EXTREME" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {law.risk} RISK
                        </Badge>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-6 h-6 text-amber-800" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-stone-400" />
                    )}
                  </button>

                  {/* ACCORDION CONTENT (Hidden when closed) */}
                  <div 
                    className={cn(
                      "grid transition-all duration-500 ease-in-out",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="p-6 pt-0 space-y-6 border-t border-stone-100 mt-2">
                        
                        <div>
                          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">What it is</h4>
                          <p className="text-stone-700 font-serif text-base leading-relaxed">{law.what_it_is}</p>
                        </div>

                        <div className="bg-red-50/50 p-5 rounded-xl border border-red-100">
                          <h4 className="text-[10px] font-bold text-red-800 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> How it is misused
                          </h4>
                          <p className="text-stone-800 font-serif text-sm italic leading-relaxed">{law.how_misused}</p>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Info className="w-3 h-3" /> Real Example
                          </h4>
                          <p className="text-stone-600 text-sm italic border-l-2 border-stone-200 pl-4 py-1">
                            &ldquo;{law.real_example}&rdquo;
                          </p>
                        </div>

                        <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                          <h4 className="text-[10px] font-bold text-[#6B3A1F] uppercase tracking-widest mb-3 flex items-center gap-1">
                            <ShieldCheck className="w-5 h-5" /> Protect Yourself
                          </h4>
                          <ul className="grid grid-cols-1 gap-3">
                            {law.protect_yourself.map((tip, idx) => (
                              <li key={idx} className="text-sm text-stone-600 flex items-start gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold mt-0.5">
                                  {idx + 1}
                                </span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                          <Gavel className="w-4 h-4" />
                          <span>{law.legal_note}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMING SOON PLACEHOLDER */
          <div className="flex flex-col items-center justify-center py-24 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
            <Lock className="w-12 h-12 text-stone-300 mb-4" />
            <h3 className="text-2xl font-display font-bold text-stone-400">Database for {activeState} Coming Soon</h3>
            <p className="text-stone-400 font-serif mt-2">Our legal team is currently auditing misuse cases in this region.</p>
          </div>
        )}
      </div>
    </div>
  );
}