'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import SectionGlow from '@/components/section-glow'

const stats = [
  { number: 500, label: 'IPC Sections Covered', suffix: '+' },
  { number: 36, label: 'States & Union Territories', suffix: '' },
  { number: 1860, label: 'Year IPC Was Enacted', note: 'Updated with BNS 2023', suffix: '' },
  { number: 24, label: 'Legal Guidance Available', suffix: '/7' },
]

export default function StatsBar() {
  const [displayNumbers, setDisplayNumbers] = useState<number[]>(stats.map(() => 0))
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    if (!inView) return

    const timers = stats.map((stat, idx) => {
      let current = 0
      const target = stat.number
      const increment = target / 30

      const interval = setInterval(() => {
        current += increment
        if (current >= target) {
          setDisplayNumbers(prev => {
            const newNumbers = [...prev]
            newNumbers[idx] = target
            return newNumbers
          })
          clearInterval(interval)
        } else {
          setDisplayNumbers(prev => {
            const newNumbers = [...prev]
            newNumbers[idx] = Math.floor(current)
            return newNumbers
          })
        }
      }, 30)

      return interval
    })

    return () => timers.forEach(clearInterval)
  }, [inView])

  return (
    <section ref={ref} className="bg-gradient-to-b from-stone-100 to-amber-50/30 py-20 lg:py-24 relative overflow-hidden border-y border-stone-200">
      <SectionGlow />
      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="mb-4">
                <span className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold heading-gradient">
                  {displayNumbers[idx]}
                  {stat.suffix}
                </span>
              </div>
              <p className="text-xs lg:text-sm font-bold text-stone-500 uppercase tracking-wider">
                {stat.label}
              </p>
              {stat.note && (
                <p className="text-xs text-stone-400 mt-2">{stat.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
