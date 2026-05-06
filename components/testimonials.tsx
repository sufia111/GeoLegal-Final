import SectionGlow from '@/components/section-glow'

const testimonials = [
  {
    quote: 'For the first time I actually understood what Section 498A meant for my situation in Rajasthan. The state-specific breakdown was something no other tool offered.',
    name: 'Priya S.',
    role: 'Social Worker, Jaipur',
    initials: 'PS',
  },
  {
    quote: 'As a law student, the IPC section browser with state amendments is invaluable. It cuts my research time for moot court preparation by half.',
    name: 'Arjun K.',
    role: 'LLB Student, NLU Delhi',
    initials: 'AK',
  },
  {
    quote: 'My client didn\'t know he had anticipatory bail rights. GeoLegal helped me explain it to him in plain language before the formal consultation.',
    name: 'Adv. Meena R.',
    role: 'Advocate, Madras High Court',
    initials: 'MR',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-stone-50/50 py-24 lg:py-32 relative overflow-hidden" id="testimonials">
      <SectionGlow />
      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-800 font-bold text-sm uppercase tracking-widest mb-4">Trusted Across India</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold heading-gradient">What users are saying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="text-5xl text-amber-800 opacity-20 leading-none mb-4">❝</div>

              <p className="text-base text-stone-700 font-serif leading-relaxed mb-6 flex-1">
                {testimonial.quote}
              </p>

              <div className="flex items-center gap-4 border-t border-stone-100 pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-blue-800 flex items-center justify-center">
                  <span className="font-display font-bold text-white text-sm">{testimonial.initials}</span>
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-stone-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
