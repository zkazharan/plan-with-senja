'use client'

import EventList from '@/components/events/EventList'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function PageContent() {
  const searchParams = useSearchParams()
  return (
    <div className="min-h-[calc(100vh-(4rem+1px))] bg-secondary-50">
      <EventList />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  )
}
