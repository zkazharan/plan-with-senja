'use client'

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';
import api from '@/lib/api';
import { Booking } from '@/types';
import { format, parseISO, eachDayOfInterval, startOfDay, endOfDay, subDays } from 'date-fns';
import { id } from 'date-fns/locale/id';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BookingTrends() {
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await api.get<Booking[]>('/bookings');
      return response.data;
    },
  });

  if (!bookings?.length) {
    return null;
  }

  // Mendapatkan rentang tanggal 7 hari terakhir
  const endDate = endOfDay(new Date());
  const startDate = startOfDay(subDays(endDate, 6));
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  // Mengelompokkan booking berdasarkan tanggal
  const bookingsByDate = bookings.reduce((acc, booking) => {
    const date = format(parseISO(booking.bookingDate), 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + booking.seats;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: dates.map(date => format(date, 'dd MMM', { locale: id })),
    datasets: [
      {
        label: 'Jumlah Kursi',
        data: dates.map(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          return bookingsByDate[dateStr] || 0;
        }),
        borderColor: 'rgb(14, 165, 233)', // primary-500
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Grafik Pemesanan 7 Hari Terakhir',
        color: '#334155', // secondary-700
        font: {
          size: 16,
          weight: 'normal',
        },
        padding: {
          bottom: 24,
        },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#334155', // secondary-700
        bodyColor: '#64748b', // secondary-500
        borderColor: '#e2e8f0', // secondary-200
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
          weight: 'normal',
        },
        callbacks: {
          title: (items) => {
            if (!items.length) return '';
            const item = items[0];
            const date = dates[item.dataIndex];
            return format(date, 'dd MMMM yyyy', { locale: id });
          },
          label: (item) => {
            return `${item.formattedValue} kursi`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b', // secondary-500
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9', // secondary-100
        },
        border: {
          dash: [4, 4],
        },
        ticks: {
          color: '#64748b', // secondary-500
          padding: 8,
          callback: (value) => `${value} kursi`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="h-[300px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
} 