'use client'

import BookingList from '@/components/bookings/BookingList'
import BookingTrends from '@/components/charts/BookingTrends'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Booking } from '@/types'
import { CalendarIcon, TicketIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function BookingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await api.get<Booking[]>('/bookings')
      return response.data
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, router, loading])

  if (loading) return null
  if (!user) return null

  const totalBookings = bookings?.length || 0
  const totalSeats = bookings?.reduce((sum, booking) => sum + booking.seats, 0) || 0
  const upcomingBookings = bookings?.filter(
    booking => new Date(booking.eventId.date) > new Date()
  ).length || 0

  return (
    <div className="min-h-[calc(100vh-(4rem+1px))] bg-secondary-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-secondary-900">Pemesanan Saya</h1>
        
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-50 rounded-lg">
                <TicketIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Pemesanan</p>
                <p className="text-2xl font-semibold text-secondary-900">{totalBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-50 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Kursi</p>
                <p className="text-2xl font-semibold text-secondary-900">{totalSeats}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-50 rounded-lg">
                <ClockIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Pemesanan Mendatang</p>
                <p className="text-2xl font-semibold text-secondary-900">{upcomingBookings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <BookingTrends />
          <BookingList />
        </div>
      </div>
    </div>
  )
} 