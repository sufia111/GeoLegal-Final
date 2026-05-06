'use client'

import { useState } from 'react'
import SectionGlow from '@/components/section-glow'

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

const unionTerritories = [
  'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
  'Dadra & Nagar Haveli and Daman & Diu', 'Lakshadweep', 'Andaman & Nicobar Islands',
]

export default function StatesCoverage() {
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  return (
    <section className="bg-stone-50/50 py-24 lg:py-32 relative overflow-hidden" id="states-coverage">
      <SectionGlow />
      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-800 font-bold text-sm uppercase tracking-widest mb-4">All 36 Jurisdictions</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold heading-gradient mb-6">
            Every State. Every Union Territory.
          </h2>
          <p className="text-lg text-stone-500 font-serif max-w-2xl mx-auto">
            Central law is just the foundation. GeoLegal layers state-specific IPC amendments, local acts, High Court jurisdictions, and UT-specific governance rules on top — so you always get the full picture.
          </p>
        </div>

        {/* States Grid */}
        <div className="space-y-12">
          {/* States */}
          <div>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">States (28)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {states.map((state) => (
                <button
                  key={state}
                  onMouseEnter={() => setHoveredState(state)}
                  onMouseLeave={() => setHoveredState(null)}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                    hoveredState === state
                      ? 'bg-amber-800 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-800/30 hover:text-amber-900'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Union Territories (8)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {unionTerritories.map((ut) => (
                <button
                  key={ut}
                  onMouseEnter={() => setHoveredState(ut)}
                  onMouseLeave={() => setHoveredState(null)}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                    hoveredState === ut
                      ? 'bg-blue-800 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-blue-800/30 hover:text-blue-900'
                  }`}
                >
                  {ut}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 p-6 lg:p-8 rounded-xl bg-amber-50 border border-amber-800/10 border-l-4" style={{borderLeftColor:'#92400e'}}>
          <p className="text-stone-700 text-sm lg:text-base leading-relaxed">
            <span className="text-lg mr-2">⚠️</span>
            <span className="font-bold">Union Territories have unique legal identities</span> — from Delhi's limited legislative powers to Ladakh's transitional post-Article 370 framework. GeoLegal covers them all with specific precision.
          </p>
        </div>
      </div>
    </section>
  )
}
