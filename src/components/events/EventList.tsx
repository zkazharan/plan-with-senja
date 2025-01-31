'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Event } from '@/types'
import EventCard from './EventCard'
import { CalendarIcon, ExclamationCircleIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { Fragment, useState } from 'react'
import { format } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dialog, Transition } from '@headlessui/react'

// Add pagination type
interface PaginationData {
  currentPage: number
  totalPages: number
  totalEvents: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface EventResponse {
  events: Event[]
  pagination: PaginationData
}

export default function EventList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Add current page state
  const currentPage = parseInt(searchParams.get('page') || '1')

  const [startDate, setStartDate] = useState<Date | null>(() => {
    const startParam = searchParams.get('startDate')
    return startParam ? new Date(startParam) : null
  })
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const endParam = searchParams.get('endDate')
    return endParam ? new Date(endParam) : null
  })

  // Temporary dates for modal
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate)
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate)

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', startDate, endDate, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) {
        params.append('startDate', format(startDate, 'yyyy-MM-dd'))
      }
      if (endDate) {
        params.append('endDate', format(endDate, 'yyyy-MM-dd'))
      }
      params.append('page', currentPage.toString())
      
      const response = await api.get<EventResponse>(`/events?${params.toString()}`)
      return response.data
    },
  })

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handleApplyFilter = () => {
    setStartDate(tempStartDate)
    setEndDate(tempEndDate)

    const params = new URLSearchParams(searchParams.toString())
    
    if (tempStartDate) {
      params.set('startDate', format(tempStartDate, 'yyyy-MM-dd'))
    } else {
      params.delete('startDate')
    }
    
    if (tempEndDate) {
      params.set('endDate', format(tempEndDate, 'yyyy-MM-dd'))
    } else {
      params.delete('endDate')
    }

    router.push(`?${params.toString()}`)
    setIsModalOpen(false)
  }

  const handleResetFilter = () => {
    setTempStartDate(null)
    setTempEndDate(null)
    setStartDate(null)
    setEndDate(null)
    router.push('')
    setIsModalOpen(false)
  }

  const openModal = () => {
    setTempStartDate(startDate)
    setTempEndDate(endDate)
    setIsModalOpen(true)
  }

  return (
    <div className="relative">
      <div className="relative py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">
            Jelajahi Event
          </h2>
          <div className="w-20 h-1.5 bg-primary-500 mx-auto rounded-full mb-4" />
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Temukan berbagai event menarik yang akan datang dan bergabunglah bersama komunitas kami
          </p>
        </div>

        <div className="mb-8 flex items-center gap-2">
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-secondary-200 bg-white shadow-sm hover:bg-secondary-50 transition-colors"
          >
            <FunnelIcon className="w-5 h-5 text-secondary-500" />
            <span className="text-secondary-700">
              {startDate || endDate ? (
                <span>
                  {startDate && format(startDate, 'dd/MM/yyyy')}
                  {endDate && ` - ${format(endDate, 'dd/MM/yyyy')}`}
                </span>
              ) : (
                'Filter Tanggal'
              )}
            </span>
          </button>

          {(startDate || endDate) && (
            <button
              onClick={handleResetFilter}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <Dialog.Title as="h3" className="text-lg font-medium text-secondary-900">
                        Filter Event
                      </Dialog.Title>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-secondary-400 hover:text-secondary-500"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <DatePicker
                          selectsRange={true}
                          startDate={tempStartDate}
                          endDate={tempEndDate}
                          onChange={(dates) => {
                            const [start, end] = dates
                            setTempStartDate(start)
                            setTempEndDate(end)
                          }}
                          dateFormat="dd/MM/yyyy"
                          isClearable={true}
                          placeholderText="Pilih rentang tanggal"
                          className="w-full rounded-lg border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <button
                        onClick={handleApplyFilter}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
                      >
                        Terapkan
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
              <p className="text-secondary-600 animate-pulse">Memuat daftar event...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-800">Terjadi Kesalahan</h3>
                <p className="mt-1 text-sm text-red-700">
                  Mohon maaf, terjadi kesalahan saat memuat data event. Silakan coba lagi nanti.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && data?.events && data.events.length === 0 && (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-dashed border-secondary-300">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-secondary-400" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900">Belum Ada Event</h3>
              <p className="text-secondary-600 max-w-sm">
                Saat ini belum ada event yang tersedia. Silakan cek kembali nanti.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && data?.events && data.events.length > 0 && (
          <>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn mb-8">
              {data.events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination UI */}
            <div className="flex items-center justify-between border-t border-secondary-200 px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                  disabled={!data.pagination.hasPrevPage}
                  className="relative inline-flex items-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                  disabled={!data.pagination.hasNextPage}
                  className="relative ml-3 inline-flex items-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-secondary-700">
                    Menampilkan{' '}
                    <span className="font-medium">{data.pagination.totalEvents}</span>{' '}
                    event
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                      disabled={!data.pagination.hasPrevPage}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-secondary-400 ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Sebelumnya</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {[...Array(data.pagination.totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePageChange(idx + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          data.pagination.currentPage === idx + 1
                            ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                            : 'text-secondary-900 ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                      disabled={!data.pagination.hasNextPage}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-secondary-400 ring-1 ring-inset ring-secondary-300 hover:bg-secondary-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Selanjutnya</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container {
          width: 100%;
        }
        .react-datepicker__input-container input {
          color: #1f2937;  /* text-gray-800 */
        }
        .react-datepicker__input-container input::placeholder {
          color: #6b7280;  /* text-gray-500 */
        }
        .react-datepicker__close-icon {
          top: -4px;
          padding-right: 8px;
        }
        .react-datepicker__close-icon::after {
          background-color: transparent;
          color: #6b7280;
          font-size: 1.5rem;
          padding: 0;
          height: 20px;
          width: 20px;
          line-height: 1;
        }
        .react-datepicker__close-icon:hover::after {
          color: #374151;
        }
      `}</style>
    </div>
  )
} 