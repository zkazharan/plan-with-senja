'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Event } from '@/types';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const schema = yup.object({
  seats: yup
    .number()
    .required('Jumlah kursi wajib diisi')
    .min(1, 'Minimal pemesanan 1 kursi')
    .max(yup.ref('$maxSeats'), 'Jumlah kursi melebihi yang tersedia'),
}).required();

type BookingFormData = {
  seats: number;
};

interface BookingFormProps {
  event: Event;
}

export default function BookingForm({ event }: BookingFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: yupResolver(schema),
    context: { maxSeats: event.availableSeats }
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await api.post('/bookings', {
        eventId: event._id,
        seats: data.seats,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/bookings');
      }, 2000);
    },
  });

  if (showSuccess) {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Pemesanan berhasil! Mengalihkan ke halaman pemesanan...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((data) => bookingMutation.mutate(data))} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700">
          Jumlah Kursi
        </label>
        <input
          type="number"
          {...register('seats')}
          className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-secondary-900"
          placeholder="Masukkan jumlah kursi"
          min={1}
          max={event.availableSeats}
        />
        {errors.seats && (
          <p className="mt-1 text-sm text-red-600">{errors.seats.message}</p>
        )}
      </div>

      {bookingMutation.isError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {(bookingMutation.error as any)?.response?.data?.message || 'Terjadi kesalahan saat melakukan pemesanan'}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={bookingMutation.isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
      >
        {bookingMutation.isPending ? 'Memproses...' : 'Pesan Sekarang'}
      </button>
    </form>
  );
} 