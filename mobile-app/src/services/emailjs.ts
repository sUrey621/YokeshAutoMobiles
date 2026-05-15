import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from '../constants/config';
import { Appointment } from '../types';

export async function sendConfirmationEmail(appointment: Appointment): Promise<void> {
  const formattedDate = new Date(appointment.appointment_date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const templateParams = {
    to_email: appointment.email,
    to_name: appointment.name,
    customer_name: appointment.name,
    service: appointment.service,
    appointment_date: formattedDate,
    vehicle: appointment.vehicle,
    phone: appointment.phone,
    message: appointment.message || 'N/A'
  };

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
}