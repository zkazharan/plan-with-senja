'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const schema = yup.object({
  title: yup.string().required('Judul wajib diisi'),
  description: yup.string().required('Deskripsi wajib diisi'),
  date: yup.string().required('Tanggal wajib diisi').test('is-future-date', 'Tanggal harus di masa depan', value => {
    return new Date(value) > new Date();
  }),
  availableSeats: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Mohon masukkan jumlah kursi yang tersedia')
    .min(1, 'Jumlah kursi minimal 1')
    .typeError('Mohon masukkan jumlah kursi yang valid'),
}).required();

type CreateEventFormData = {
  title: string;
  description: string;
  date: string;
  availableSeats: number;
};

export default function CreateEventForm() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<CreateEventFormData>({
    resolver: yupResolver(schema)
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventFormData) => {
      const response = await api.post('/events', data);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage('Event berhasil dibuat! Mengalihkan ke halaman utama...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit((data) => createEventMutation.mutate(data))} className="space-y-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Buat Event Baru</h2>
          <p className="text-gray-600">Isi detail event yang akan Anda selenggarakan</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Event</label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors duration-200 text-gray-800"
              placeholder="Masukkan judul event yang menarik"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Event</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors duration-200 text-gray-800"
              placeholder="Jelaskan detail event Anda"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Event</label>
              <input
                type="date"
                {...register('date')}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors duration-200 text-gray-800"
              />
              {errors.date && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Kursi</label>
              <input
                type="number"
                {...register('availableSeats')}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors duration-200 text-gray-800"
                placeholder="Contoh: 100"
                min={1}
              />
              {errors.availableSeats && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.availableSeats.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {createEventMutation.isError && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm text-red-700">
                {(createEventMutation.error as any)?.response?.data?.message || 'Terjadi kesalahan saat membuat event'}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={createEventMutation.isPending}
          className="w-full py-3 px-6 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-20 disabled:bg-primary-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {createEventMutation.isPending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          ) : (
            'Buat Event'
          )}
        </button>

        {successMessage && (
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 