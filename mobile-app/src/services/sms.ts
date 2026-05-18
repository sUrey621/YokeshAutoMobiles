import { SMS_PROVIDER, BUSINESS_INFO } from '../constants/config';

// Carrier email-to-SMS gateways (free, automated via EmailJS)
const CARRIER_GATEWAYS = [
  '@jio.com',            // Jio (largest Indian carrier)
  '@airtelmail.com'      // Airtel (2nd largest)
];

async function sendViaEmailJS(phone: string, message: string): Promise<boolean> {
  const { sendEmail, baseParams, formatDate } = await import('./emailjs');
  const { EMAILJS_TEMPLATE_ID_1 } = await import('../constants/config');
  for (const gateway of CARRIER_GATEWAYS) {
    try {
      await sendEmail(EMAILJS_TEMPLATE_ID_1, baseParams(phone + gateway, phone, {
        customer_name: phone,
        service: 'SMS Notification',
        appointment_date: formatDate(new Date().toISOString()),
        vehicle: '',
        phone: phone,
        message: message,
        status: 'info'
      }));
      console.log(`[SMS] Sent via EmailJS->${gateway} to ${phone}`);
      return true;
    } catch { /* try next gateway */ }
  }
  return false;
}

export async function sendSMS(phone: string, message: string): Promise<{ sent: boolean; method: string }> {
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

  if (!cleanPhone || cleanPhone.length < 10) {
    console.log('[SMS] Invalid phone number');
    return { sent: false, method: 'invalid' };
  }

  // Method 1: Carrier email-to-SMS gateways (free, automated)
  if (await sendViaEmailJS(cleanPhone, message)) {
    return { sent: true, method: 'carrier_gateway' };
  }

  // Method 2: Fast2SMS (if configured)
  if (SMS_PROVIDER.USE && SMS_PROVIDER.PROVIDER === 'fast2sms' && SMS_PROVIDER.API_KEY) {
    try {
      const resp = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': SMS_PROVIDER.API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: message,
          language: 'english',
          numbers: cleanPhone
        })
      });
      if (resp.ok) {
        console.log('[SMS] Sent via Fast2SMS');
        return { sent: true, method: 'fast2sms' };
      }
    } catch { /* fall through */ }
  }

  // Method 3: WhatsApp (opens app, user taps Send)
  try {
    const waNumber = BUSINESS_INFO.phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    const { Linking } = require('react-native');
    const canOpen = await Linking.canOpenURL(waUrl);
    if (canOpen) {
      await Linking.openURL(waUrl);
      console.log('[SMS] WhatsApp fallback opened');
      return { sent: true, method: 'whatsapp' };
    }
  } catch { /* fall through */ }

  console.log(`[SMS] No delivery method available for ${cleanPhone}`);
  return { sent: false, method: 'none' };
}
