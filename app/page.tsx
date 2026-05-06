'use client'

import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import TrustBar from '@/components/trust-bar'
import HowItWorks from '@/components/how-it-works'
import Features from '@/components/features'
import IPCPreview from '@/components/ipc-preview'
import StatsBar from '@/components/stats-bar'
import RecentUpdates from '@/components/recent-updates'
import Testimonials from '@/components/testimonials'
import LegalAid from '@/components/legal-aid'
import CTABanner from '@/components/cta-banner'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Features />
      <StatsBar />
      <RecentUpdates />
      <Testimonials />
      <LegalAid />
      <CTABanner />
      <Footer />
    </main>
  )
}
