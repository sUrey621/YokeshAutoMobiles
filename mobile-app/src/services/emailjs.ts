import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_1, EMAILJS_TEMPLATE_ID_2, EMAILJS_PUBLIC_KEY, BUSINESS_INFO } from '../constants/config';
import { Appointment } from '../types';

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

const shopName = BUSINESS_INFO.name;
const shopEmail = BUSINESS_INFO.email;
const shopPhone = BUSINESS_INFO.phone;

const BROWSER_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36';
const BROWSER_ORIGIN = 'https://yokeshautomobiles.vercel.app';

export async function sendEmail(
  templateId: string,
  templateParams: Record<string, string>
): Promise<void> {
  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: templateId,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: templateParams
  };

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': BROWSER_UA,
      'Origin': BROWSER_ORIGIN,
      'Referer': BROWSER_ORIGIN + '/',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText.slice(0, 150));
  }
}

export function baseParams(toEmail: string, toName: string, extra: Record<string, string> = {}) {
  return {
    to_email: toEmail,
    to_name: toName,
    from_name: shopName,
    from_email: shopEmail,
    reply_to: shopEmail,
    shop_name: shopName,
    shop_phone: shopPhone,
    ...extra
  };
}

export async function sendConfirmationEmail(appointment: Appointment): Promise<void> {
  await sendEmail(EMAILJS_TEMPLATE_ID_1, baseParams(appointment.email, appointment.name, {
    customer_name: appointment.name,
    service: appointment.service,
    appointment_date: formatDate(appointment.appointment_date),
    vehicle: appointment.vehicle,
    phone: appointment.phone,
    message: appointment.message || 'N/A',
    status: 'confirmed'
  }));
}

export async function sendBookingConfirmation(appointment: Appointment): Promise<void> {
  await sendEmail(EMAILJS_TEMPLATE_ID_1, baseParams(appointment.email, appointment.name, {
    customer_name: appointment.name,
    service: appointment.service,
    appointment_date: formatDate(appointment.appointment_date),
    vehicle: appointment.vehicle,
    phone: appointment.phone,
    message: 'Your booking is received and pending confirmation.',
    status: 'pending'
  }));
}

export async function sendAdminNotification(appointment: Appointment): Promise<void> {
  await sendEmail(EMAILJS_TEMPLATE_ID_2, baseParams(shopEmail, 'Admin', {
    customer_name: appointment.name,
    service: appointment.service,
    appointment_date: formatDate(appointment.appointment_date),
    vehicle: appointment.vehicle,
    phone: appointment.phone,
    message: `New booking from ${appointment.name} (${appointment.phone}). Please confirm.`,
    status: 'pending'
  }));
}

