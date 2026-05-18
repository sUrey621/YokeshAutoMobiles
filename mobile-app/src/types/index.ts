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

export interface Customer {
  customer_id: string;
  full_name: string;
  mobile_number: string;
  email_address: string;
  date_of_birth?: string;
  gender?: string;
  is_verified: boolean;
  registered_at: string;
  last_login_at: string;
  notification_sms: boolean;
  notification_email: boolean;
  profile_photo_url?: string;
}

export interface CustomerSession {
  customer_id: string;
  full_name: string;
  mobile_number: string;
  email_address: string;
  is_verified: boolean;
  created_at: string;
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