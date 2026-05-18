export const SUPABASE_URL = 'https://qajwaaazvatiyanmkaic.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhandhYWF6dmF0aXlhbm1rYWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NzI5MDIsImV4cCI6MjA5MTE0ODkwMn0.SOknp-GR2HtmS3DfWFHqmrupt3Io7IAxDE8r6aJD5Jc';

export const EMAILJS_SERVICE_ID = 'service_b9hj86k';
export const EMAILJS_TEMPLATE_ID_1 = 'b2ajmyb';
export const EMAILJS_TEMPLATE_ID_2 = 'b2ajmyb';
export const EMAILJS_PUBLIC_KEY = 'ErJBQ4x8wsDLGLIBo';

export const ADMIN_CREDENTIALS = {
  username: 'yokesh_admin',
  password: 'Yokesh@2024'
};

// SMS Provider Configuration
// Option 1: Fast2SMS (India) — https://www.fast2sms.com
// Sign up free, get API key from dashboard
export const SMS_PROVIDER = {
  USE: false,
  PROVIDER: 'fast2sms', // 'fast2sms' | 'textlocal' | 'msg91'
  API_KEY: '',
  SENDER_ID: 'YOKESH'
};

export const BUSINESS_INFO = {
  name: 'Yokesh Auto Mobiles',
  phone: '+919003244967',
  email: 'yokeshautomobiles@gmail.com',
  address: 'No 49, Gopal Nagar, 2nd St, Narayanapuram, Pallikaranai, Chennai, Tamil Nadu 600100',
  hours: 'Mon-Sat: 9:30 AM - 7:00 PM',
  closedDays: 'Sunday',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Yokesh+Auto+Mobiles+Pallikaranai+Chennai',
  mapsCoords: '12.939253376311177,80.2036280065026'
};

export const SERVICES = {
  mechanical: [
    { id: 'oil-change', name: 'Oil Change & Filter', icon: 'oil' },
    { id: 'brake-service', name: 'Brake Repair & Service', icon: 'disc' },
    { id: 'engine-diagnostics', name: 'Engine Diagnostics', icon: 'engine' },
    { id: 'transmission', name: 'Transmission Service', icon: 'cog' },
    { id: 'suspension', name: 'Suspension & Steering', icon: 'car' },
    { id: 'battery-electrical', name: 'Battery & Electrical', icon: 'battery' },
    { id: 'ac-service', name: 'AC Service & Repair', icon: 'snowflake' },
    { id: 'tire-services', name: 'Tire Services', icon: 'tire' },
    { id: 'general-repair', name: 'General Repair', icon: 'wrench' }
  ],
  wash: [
    { id: 'express-wash', name: 'Express Wash', price: '₹799' },
    { id: 'deluxe-wash', name: 'Deluxe Wash', price: '₹999' },
    { id: 'premium-detail', name: 'Premium Detail', price: '₹1200' }
  ],
  packages: [
    { id: 'basic-care', name: 'Basic Care', price: '₹1499/yr' },
    { id: 'premium-care', name: 'Premium Care', price: '₹3999/yr' },
    { id: 'fleet-care', name: 'Fleet Care', price: 'Custom' }
  ]
};

export const SERVICE_OPTIONS = [
  'Oil Change & Filter',
  'Brake Repair & Service',
  'Engine Diagnostics',
  'Transmission Service',
  'Suspension & Steering',
  'Battery & Electrical',
  'AC Service & Repair',
  'Tire Services',
  'General Repair',
  'Express Wash (₹799)',
  'Deluxe Wash (₹999)',
  'Premium Detail (₹1200)',
  'Basic Care Package (₹1499/yr)',
  'Premium Care Package (₹3999/yr)',
  'Fleet Care (Custom)',
  'Other / Multiple Services'
];