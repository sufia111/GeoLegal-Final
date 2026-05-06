import SectionGlow from '@/components/section-glow'

export default function TrustBar() {
  const items = [
    { icon: '⚖️', label: 'IPC 1860 + BNS 2023' },
    { icon: '🗺️', label: '36 Jurisdictions Covered' },
    { icon: '📜', label: '500+ IPC Sections' },
    { icon: '🏛️', label: 'All Union Territories' },
    { icon: '🤖', label: 'AI-Powered in Real-Time' },
    { icon: '🔒', label: 'No Data Stored' },
  ]

  return (
    <section className="bg-amber-50/60 border-t border-b border-amber-800/10 py-6 relative overflow-x-auto overflow-y-hidden">
      <div className="relative z-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex gap-8 lg:gap-12 justify-between items-center min-w-max lg:min-w-full">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-bold text-amber-900/60 uppercase tracking-wider hidden sm:inline">
                {item.label}
              </span>
              {idx < items.length - 1 && <span className="hidden lg:inline text-stone-300">•</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
