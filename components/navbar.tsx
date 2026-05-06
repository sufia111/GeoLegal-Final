'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation' // Added usePathname
import Link from 'next/link' // Added Link component
import { Menu, X, Scale, ChevronDown, MessageSquare, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { LoginModal, SignupModal } from '@/components/auth-modals'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)

  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname() // Track current route

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Modified navLinks to handle internal page routing
  const navLinks = [
    { label: 'IPC Reference', href: pathname === '/' ? '#ipc-reference' : '/#ipc-reference' },
    { label: 'Penal Repo', href: 'https://www.indiacode.nic.in/', external: true },
    { label: 'Legal Dictionary', href: '/legal-dictionary' }, // Now points to the new page
    { label: 'About', href: pathname === '/' ? '#about' : '/#about' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm shadow-stone-900/5'
            : 'bg-white/70 backdrop-blur-md'
        }`}
      >
        <div className="px-6 py-4 lg:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <Scale className="w-7 h-7 text-amber-800" strokeWidth={1.5} />
                <div className="absolute inset-0 blur-md bg-amber-700/15 rounded-full" />
              </div>
              <span className="text-2xl font-display font-bold heading-gradient">
                GeoLegal
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    pathname === link.href ? 'text-amber-900' : 'text-stone-600 hover:text-amber-900'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-amber-800 transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {!isLoading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2 border-stone-300">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-700 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-stone-700">{user.name.split(' ')[0]}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="text-stone-600 text-xs" disabled>
                        <User className="w-3.5 h-3.5 mr-2" />
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/chat')} className="cursor-pointer">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Go to Chat
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-stone-300 text-stone-700 hover:border-amber-800/30 hover:text-amber-900"
                      onClick={() => setLoginOpen(true)}
                    >
                      Login
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-amber-700 to-blue-800 hover:from-amber-600 hover:to-blue-700 text-white font-bold px-6 shadow-md shadow-amber-900/15 transition-all duration-200"
                      onClick={() => setSignupOpen(true)}
                    >
                      Get Started
                    </Button>
                  </>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-amber-900 hover:text-stone-700 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden mt-2 pb-6 border-t border-stone-200 pt-6 space-y-4 bg-white/95 rounded-xl px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="block text-sm font-medium text-stone-600 hover:text-amber-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="space-y-2 pt-2">
                  <Button
                    className="w-full bg-gradient-to-r from-amber-700 to-blue-800 text-white font-bold"
                    onClick={() => { setIsOpen(false); router.push('/chat') }}
                  >
                    Go to Chat
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); handleLogout() }}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); setLoginOpen(true) }}>
                    Login
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-amber-700 to-blue-800 text-white font-bold"
                    onClick={() => { setIsOpen(false); setSignupOpen(true) }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={() => setSignupOpen(true)}
      />
      <SignupModal
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </>
  )
}