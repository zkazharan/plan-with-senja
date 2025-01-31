'use client'

import CreateEventForm from '@/components/events/CreateEventForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CreateEventPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, router, loading])

  if (loading) return null

  if (!user) return null

  return (
    <div className="min-h-[calc(100vh-(4rem+1px))] bg-secondary-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8">
          <CreateEventForm />
        </div>
      </div>
    </div>
  )
} 