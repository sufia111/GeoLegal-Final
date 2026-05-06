'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SectionGlow from '@/components/section-glow'

const sampleSections = [
  { code: '302', title: 'Murder', category: 'Against Persons' },
  { code: '354', title: 'Assault on Woman', category: 'Against Persons' },
  { code: '376', title: 'Rape', category: 'Against Persons' },
  { code: '420', title: 'Cheating', category: 'Against Property' },
  { code: '498A', title: 'Cruelty by Husband', category: 'Marriage & Family' },
  { code: '307', title: 'Attempt to Murder', category: 'Against Persons' },
  { code: '406', title: 'Criminal Breach of Trust', category: 'Against Property' },
]

const selectedSectionData = {
  code: '302',
  title: 'Punishment for Murder',
  ipcText: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
  punishment: 'Death or Life Imprisonment + Fine',
  cognizable: true,
  bailable: false,
  triable: 'Court of Sessions',
  stateNote: 'Maharashtra follows standard IPC 302 with no state amendment. Cases handled by Sessions Court. MCOCA may apply if organized crime nexus is established.',
  landmarkCase: 'Bachan Singh v. State of Punjab (1980) — Supreme Court established "rarest of rare" doctrine for death penalty.',
}

export default function IPCPreview() {
  const [search, setSearch] = useState('')
  const [selectedSection, setSelectedSection] = useState('302')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Against Persons', 'Against Property', 'Against State', 'Marriage & Family', 'Public Order']

  const filteredSections = sampleSections.filter(
    section => activeCategory === 'All' || section.category === activeCategory
  )

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" id="ipc-reference">
      <SectionGlow />
      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-amber-800 font-bold text-sm uppercase tracking-widest mb-4">IPC Reference Engine</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold heading-gradient mb-6">
            Every Section. Every State.
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-stone-400" strokeWidth={1.5} />
              <Input
                type="text"
                placeholder="Filter sections by keyword or number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-stone-200 text-stone-800 placeholder:text-stone-400"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-2 rounded transition-all ${
                    activeCategory === cat
                      ? 'bg-amber-800 text-white'
                      : 'bg-white text-stone-500 hover:text-amber-900 border border-stone-200 hover:border-amber-800/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Section List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {filteredSections.map((section) => (
                <button
                  key={section.code}
                  onClick={() => setSelectedSection(section.code)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedSection === section.code
                      ? 'bg-gradient-to-r from-amber-700 to-blue-800 text-white'
                      : 'bg-white text-stone-800 hover:bg-amber-50 border border-stone-200 hover:border-amber-800/20'
                  }`}
                >
                  <div className="font-bold text-sm">Section {section.code}</div>
                  <div className="text-xs opacity-75 mt-1">{section.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Detail Card */}
          <div className="p-8 rounded-xl bg-white border border-stone-200 shadow-sm border-t-4 space-y-6" style={{borderTopColor: '#7c2d12'}}>
            <div>
              <div className="text-amber-800 font-mono text-sm font-bold mb-2">SECTION {selectedSectionData.code}</div>
              <h3 className="text-3xl font-display font-bold heading-gradient">{selectedSectionData.title}</h3>
            </div>

            <div className="border-t border-stone-100 pt-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">IPC Text</p>
                <p className="text-sm text-stone-700 font-serif leading-relaxed">{selectedSectionData.ipcText}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Punishment</p>
                <p className="text-sm text-amber-900 font-bold">{selectedSectionData.punishment}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Cognizable</p>
                  <p className="text-sm text-stone-700">{selectedSectionData.cognizable ? '✓ Yes' : '✗ No'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Bailable</p>
                  <p className="text-sm text-stone-700">{selectedSectionData.bailable ? '✓ Yes' : '✗ No'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Triable By</p>
                <p className="text-sm text-stone-700">{selectedSectionData.triable}</p>
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-3">
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Maharashtra Note</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{selectedSectionData.stateNote}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Landmark Case</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{selectedSectionData.landmarkCase}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
