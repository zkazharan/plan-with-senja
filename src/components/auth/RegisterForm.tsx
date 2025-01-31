'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { AuthResponse } from '@/types';
import { XCircleIcon } from '@heroicons/react/24/outline';

const schema = yup.object({
  name: yup.string().required('Nama wajib diisi'),
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  password: yup.string()
    .min(6, 'Password minimal 6 karakter')
    .required('Password wajib diisi'),
}).required();

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(schema)
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700">Nama</label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-secondary-900"
          placeholder="Nama lengkap"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700">Email</label>
        <input
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-secondary-900"
          placeholder="nama@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700">Password</label>
        <input
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm text-secondary-900"
          placeholder="Minimal 6 karakter"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {registerMutation.isError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {(registerMutation.error as any)?.response?.data?.message || 'Terjadi kesalahan saat mendaftar'}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
      >
        {registerMutation.isPending ? 'Memproses...' : 'Daftar'}
      </button>
    </form>
  );
} 