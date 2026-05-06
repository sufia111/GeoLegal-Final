import { Scale, Github, Linkedin, Twitter } from 'lucide-react'
import SectionGlow from '@/components/section-glow'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: ['AI Legal Advisor', 'IPC Browser', 'My Rights', 'Legal Aid'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Disclaimer'],
    Resources: ['Documentation', 'API', 'Community', 'FAQ'],
  }

  const socialLinks = [
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Github, href: '#', label: 'GitHub' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="relative overflow-hidden border-t border-stone-200 pt-16 lg:pt-24 pb-8 bg-stone-50/80">
      <SectionGlow />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-amber-800/15 to-transparent" />

      <div className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-amber-900/60 mb-4 text-xs uppercase tracking-widest">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-stone-400 hover:text-amber-900 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-stone-200 py-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Scale className="w-6 h-6 text-amber-800" strokeWidth={1.5} />
                <div className="absolute inset-0 blur-md bg-amber-700/15 rounded-full" />
              </div>
              <span className="text-xl font-display font-bold heading-gradient">
                GeoLegal
              </span>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-stone-400 hover:text-amber-900 transition-colors duration-200 p-2 rounded-lg hover:bg-amber-50"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-400">
            <div>
              <p>© {currentYear} GeoLegal. All rights reserved.</p>
            </div>
            <div className="text-center">
              <p>India's jurisdiction-aware AI legal advisor</p>
            </div>
            <div className="text-right">
              <p>Built with ⚖️ for India</p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-400 leading-relaxed max-w-3xl">
              <strong className="text-stone-500">Disclaimer:</strong> GeoLegal provides general legal information for educational purposes only and does not constitute legal advice. The information on this platform should not be relied upon as a substitute for professional legal consultation. All information is based on IPC 1860, BNS 2023, and current state laws as of the last update. Users are encouraged to consult with qualified legal professionals for specific legal advice related to their situations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
