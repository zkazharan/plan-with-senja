'use client'

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import { CalendarIcon, UserGroupIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function BookingList() {
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const queryClient = useQueryClient();
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await api.get<Booking[]>('/bookings');
      return response.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await api.delete(`/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const handleCancelClick = (booking: Booking) => {
    setBookingToCancel(booking);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelMutation.mutate(bookingToCancel._id);
      setBookingToCancel(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Terjadi kesalahan saat memuat data pemesanan
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-secondary-600">Anda belum memiliki pemesanan</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings?.map((booking) => (
        <div 
          key={booking._id} 
          className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors">
                  {booking.eventId.title}
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-secondary-600">
                    <CalendarIcon className="h-5 w-5 text-primary-500" />
                    <span>{format(new Date(booking.eventId.date), 'dd MMMM yyyy', { locale: id })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary-600">
                    <UserGroupIcon className="h-5 w-5 text-primary-500" />
                    <span>{booking.seats} kursi</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary-600">
                    <ClockIcon className="h-5 w-5 text-primary-500" />
                    <span>Dipesan: {format(new Date(booking.bookingDate), 'dd MMM yyyy HH:mm', { locale: id })}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleCancelClick(booking)}
                disabled={cancelMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
                Batalkan
              </button>
            </div>
          </div>
        </div>
      ))}

      <Transition appear show={!!bookingToCancel} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setBookingToCancel(null)}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-secondary-900"
                  >
                    Konfirmasi Pembatalan
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-secondary-600">
                      Apakah Anda yakin ingin membatalkan pemesanan untuk event "{bookingToCancel?.eventId.title}"?
                      Tindakan ini tidak dapat dibatalkan.
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3 justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-secondary-200 bg-white px-4 py-2 text-sm font-medium text-secondary-900 hover:bg-secondary-50"
                      onClick={() => setBookingToCancel(null)}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      onClick={handleConfirmCancel}
                      disabled={cancelMutation.isPending}
                    >
                      {cancelMutation.isPending ? 'Membatalkan...' : 'Ya, Batalkan'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 