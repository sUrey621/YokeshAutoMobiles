import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';
import { Appointment } from '../types';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'status' | 'created_at'>): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert([{ ...appointment, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAppointmentStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<void> {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

export async function fetchCustomerBookings(email: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}