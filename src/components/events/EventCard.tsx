import React from 'react';
import { Event } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale/id';
import Link from 'next/link';
import { CalendarIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md border border-secondary-200 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 z-10 p-4 max-w-[40%]">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full truncate">
          {event.availableSeats === 0 ? 'Penuh' : 'Tersedia'}
        </span>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2 pr-16">
          {event.title}
        </h3>

        <p className="text-secondary-600 text-sm leading-relaxed line-clamp-2">
          {event.description}
        </p>
        
        <div className="pt-4 border-t border-secondary-100">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-secondary-500 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary-500" />
              {format(new Date(event.date), 'EEEE, dd MMMM yyyy', { locale: id })}
            </p>
            <p className="text-sm text-secondary-500 flex items-center gap-2">
              <UserGroupIcon className="w-4 h-4 text-primary-500" />
              <span className={event.availableSeats <= 5 ? 'text-red-500 font-medium' : ''}>
                {event.availableSeats} kursi tersedia
              </span>
            </p>
          </div>
        </div>

        <Link
          href={`/events/${event._id}`}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300 font-medium text-sm"
        >
          Lihat Detail
          <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
} 