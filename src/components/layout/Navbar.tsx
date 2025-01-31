'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 group">
              <Image 
                src="/images/text-logo.png" 
                alt="Plan with Senja"
                width={220}
                height={44}
                className="hover:opacity-80 transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/bookings"
                  className="font-display text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Pemesanan Saya
                </Link>
                <Link
                  href="/events/create"
                  className="text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Buat Event
                </Link>
                <button
                  onClick={logout}
                  className="text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200 px-5 py-2 rounded-md text-sm font-medium shadow-md hover:shadow-lg"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <span className="sr-only">Buka menu utama</span>
              {!isOpen ? (
                <Bars3Icon className="block h-6 w-6" />
              ) : (
                <XMarkIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-secondary-200">
          {user ? (
            <>
              <Link
                href="/bookings"
                className="block text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Pemesanan Saya
              </Link>
              <Link
                href="/events/create"
                className="block text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Buat Event
              </Link>
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="block w-full text-left text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-3 py-2 rounded-md text-base font-medium"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="block bg-primary-600 text-white hover:bg-primary-700 transition-all duration-200 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 