'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { Event } from '@/types'
import BookingForm from '@/components/bookings/BookingForm'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale/id'
import { CalendarIcon, UserGroupIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const { user } = useAuth()

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await api.get<Event>(`/events/${eventId}`)
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-(4rem+1px))] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-[calc(100vh-(4rem+1px))] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-secondary-900">Terjadi Kesalahan</h3>
          <p className="mt-2 text-secondary-600">Tidak dapat memuat detail event</p>
          <Link 
            href="/"
            className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" /> Kembali ke daftar event
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-(4rem+1px))] bg-secondary-50/50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link 
          href="/"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" /> Kembali ke daftar event
        </Link>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-secondary-900">{event.title}</h1>
            <p className="mt-4 text-secondary-600 leading-relaxed">{event.description}</p>
            
            <div className="mt-6 flex items-center gap-6">
              <div className="flex items-center gap-2 text-secondary-500">
                <CalendarIcon className="h-5 w-5" />
                <span>{format(new Date(event.date), 'dd MMMM yyyy', { locale: id })}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-500">
                <UserGroupIcon className="h-5 w-5" />
                <span>{event.availableSeats} kursi tersedia</span>
              </div>
            </div>
          </div>

          <div className="border-t border-secondary-200 px-6 py-8">
            {user ? (
              event.availableSeats > 0 ? (
                <BookingForm event={event} />
              ) : (
                <div className="text-center">
                  <p className="text-secondary-600">
                    Maaf, tidak ada kursi tersedia untuk event ini
                  </p>
                </div>
              )
            ) : (
              <div className="text-center">
                <p className="text-secondary-600">
                  Silakan login untuk melakukan pemesanan
                </p>
                <Link
                  href="/auth/login"
                  className="mt-4 inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Login untuk Pesan
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 