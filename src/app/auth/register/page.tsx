'use client'

import RegisterForm from '@/components/auth/RegisterForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <div className="min-h-[calc(100vh-(4rem+1px))] flex items-center justify-center bg-secondary-50/50">
      <div className="max-w-md w-full px-4">
        <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-2xl font-bold tracking-tight text-secondary-900">
              Daftar Akun Baru
            </h2>
            <p className="mt-2 text-center text-sm text-secondary-600">
              Atau{' '}
              <Link 
                href="/auth/login" 
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                masuk ke akun yang sudah ada
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
} 