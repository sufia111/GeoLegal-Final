'use client'

import { MapPin, MessageSquare, FileText } from 'lucide-react'
import SectionGlow from '@/components/section-glow'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Select Your Jurisdiction',
      description: 'Choose from any of India\'s 28 states or 8 union territories. The entire advisory engine reconfigures to your local legal landscape.',
      Icon: MapPin,
    },
    {
      number: '02',
      title: 'Ask in Plain Language',
      description: 'Type your situation naturally — in English or Hindi. No legal jargon required. GeoLegal understands context and maps it to the correct IPC sections and local statutes.',
      Icon: MessageSquare,
    },
    {
      number: '03',
      title: 'Get Jurisdiction-Specific Guidance',
      description: 'Receive structured answers: applicable IPC sections, state amendments, your constitutional rights, recommended next steps, and relevant landmark judgments.',
      Icon: FileText,
    },
  ]

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" id="how-it-works">
      <SectionGlow />
      <div className="relative z-10 px-6 lg:px-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-amber-800 font-bold text-sm uppercase tracking-widest mb-4">Simple. Fast. Jurisdiction-Aware.</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold heading-gradient mb-6">
            Legal clarity in three steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-800/20 to-transparent" />

          {steps.map((step, idx) => {
            const Icon = step.Icon
            return (
              <div key={idx} className="relative group">
                {/* Step Number */}
                <div className="mb-8">
                  <span className="text-6xl lg:text-7xl font-mono font-bold text-amber-800 opacity-20 group-hover:opacity-40 transition-opacity">
                    {step.number}
                  </span>
                </div>

                {/* Content Card */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-amber-800 flex-shrink-0" strokeWidth={1.5} />
                    <h3 className="text-xl font-display font-bold text-stone-800">{step.title}</h3>
                  </div>
                  <p className="text-stone-500 font-serif leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Dot Connector */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -bottom-12 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-800 rounded-full" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
