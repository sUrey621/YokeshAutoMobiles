export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  service: string;
  message: string;
  appointment_date: string;
  newsletter: boolean;
  contact_consent: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  service: string;
  message: string;
  appointment_date: string;
  newsletter: boolean;
  contact_consent: boolean;
}

export interface AdminSession {
  isAuthenticated: boolean;
  loginTime: number;
  expiresAt: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: string;
  price?: string;
}

export interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
}