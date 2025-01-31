export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  availableSeats: number;
  createdAt: string;
}

export interface Booking {
  _id: string;
  eventId: Event;
  userId: string;
  seats: number;
  bookingDate: string;
}

export interface ApiError {
  message: string;
} 