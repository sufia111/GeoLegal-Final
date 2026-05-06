'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const rotatingPhrases = ['Laws', 'Rights', 'Duties']

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setPhraseIndex(i => (i + 1) % rotatingPhrases.length)
        setAnimating(false)
      }, 300)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="h-screen flex items-center justify-center pt-20 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-700/[0.06] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-900/[0.05] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-amber-600/[0.03] blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(90,50,10,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(90,50,10,0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-800/20 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-800/20 to-transparent" />
        <div className="absolute -right-24 top-1/4 w-96 h-96 rounded-full border border-amber-800/8" />
        <div className="absolute -right-16 top-1/4 translate-y-4 w-80 h-80 rounded-full border border-amber-800/5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-display leading-[1.16]">
            <span className="block heading-gradient">India's Law.</span>
            <span className="block text-stone-800">
              Your{' '}
              <span
                className="inline-block heading-gradient transition-all duration-300"
                style={{
                  opacity: animating ? 0 : 1,
                  transform: animating ? 'translateY(-8px)' : 'translateY(0)',
                }}
              >
                {rotatingPhrases[phraseIndex]}
              </span>
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg lg:text-xl text-stone-500 font-serif leading-relaxed max-w-lg">
            Navigate IPC sections, state-specific amendments, union territory laws, and your constitutional rights — all filtered by your jurisdiction. Ask in plain English. Get answers grounded in law.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button className="bg-gradient-to-r from-amber-700 to-blue-800 hover:from-amber-600 hover:to-blue-700 text-white font-bold px-8 py-6 h-auto text-base shadow-xl shadow-amber-900/20 transition-all duration-200 hover:-translate-y-0.5">
              Ask Your Legal Question →
            </Button>
            <Button className="border border-amber-800/30 text-amber-900 hover:bg-amber-50 font-bold px-8 py-6 h-auto text-base bg-white/60 backdrop-blur-sm transition-all duration-200">
              Browse IPC Sections
            </Button>
          </div>

          {/* Stats row */}
          <div className="pt-2 flex gap-8">
            {[['500+', 'IPC Sections'], ['36', 'Jurisdictions'], ['24/7', 'AI Advisor']].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold heading-gradient">{num}</div>
                <div className="text-xs text-stone-400 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Floating Card */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-4">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-800/25 bg-amber-50 text-amber-900 text-xs font-bold tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>POWERED BY AI · INDIAN LAW · ALL 36 JURISDICTIONS</span>
          </div>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-amber-700/5 blur-3xl rounded-3xl" />

            <div className="relative rounded-2xl p-8 border border-stone-200 bg-white/80 backdrop-blur-xl animate-float shadow-xl shadow-stone-900/8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-amber-800/60 uppercase tracking-widest">GeoLegal AI · Live Query</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-2 p-4 rounded-xl bg-amber-50/80 border border-amber-800/10">
                  <p className="text-xs font-bold text-amber-800/50 uppercase tracking-wider">Your Question</p>
                  <p className="text-base text-stone-800 leading-snug">What are my bail rights in Maharashtra under Section 436 IPC?</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-100 border border-amber-800/20 rounded-full text-xs font-bold text-amber-900">Maharashtra</span>
                    <span className="px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-500">Section 436 IPC</span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-stone-600 leading-relaxed">
                      <span className="font-bold text-stone-800">Section 436 IPC:</span> Grant of bail by police officer after arrest for bailable offences.
                    </p>
                    <p className="text-sm text-stone-500 leading-relaxed">
                      You have the right to bail within 24 hours. Officer must inform you of bail rights and permissible conditions under Maharashtra law.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p className="text-xs text-green-700 font-bold">No Data Stored · Always Confidential</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  )
}
