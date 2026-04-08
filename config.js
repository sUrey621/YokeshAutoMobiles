/**
 * Yokesh Auto Mobiles - Appointment System Configuration
 *
 * This file contains configuration for 3 appointment tracking systems.
 * Fill in your actual credentials below.
 */

// ============================================
// GOOGLE SHEETS CONFIGURATION
// ============================================
const GOOGLE_CONFIG = {
    // The URL of your Google Apps Script web app deployment
    // Get it after deploying the Apps Script (see SETUP_GOOGLE_SHEETS.md)
    USE: true,  // Set to true when configured
    URL: 'https://script.google.com/macros/s/AKfycbxtYwJkxGihOGcUFIexC_FxcFuibRLsBHdOEWQpLMG9PkO_mq0RSMjoc8VX8nj8Al6X/exec', // e.g., https://script.google.com/macros/s/...
    SHEET_NAME: 'Appointments'
};

// ============================================
// EMAILJS CONFIGURATION
// ============================================
const EMAILJS_CONFIG = {
    // Get these from https://dashboard.emailjs.com/
    USE: true,  // Set to true when configured
    SERVICE_ID: 'service_b9hj86k', // e.g., service_xxx
    TEMPLATE_ID: 'Appointment Notification', // e.g., template_xxx
    PUBLIC_KEY: 'ErJBQ4x8wsDLGLIBo', // e.g., user_xxx

    // Email addresses
    RECEIVER_EMAIL: 'yokeshautomobiles@gmail.com',
    ADMIN_EMAIL: 'yokeshautomobiles@gmail.com'
};

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_CONFIG = {
    // Get these from your Supabase project settings
    USE: true,  // Set to true when configured
    URL: 'https://qajwaaazvatiyanmkaic.supabase.co', // e.g., https://abcde.supabase.co
    ANON_PUBLIC_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhandhYWF6dmF0aXlhbm1rYWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NzI5MDIsImV4cCI6MjA5MTE0ODkwMn0.SOknp-GR2HtmS3DfWFHqmrupt3Io7IAxDE8r6aJD5Jc', // starts with eyJ...
    TABLE_NAME: 'appointments',

    // Admin credentials for dashboard (simple password protection)
    ADMIN_PASSWORD: 'Surey@56',
    ADMIN_EMAIL: 'yokeshautomobiles@gmail.com'
};

// ============================================
// SETTINGS
// ============================================
const SETTINGS = {
    // Which systems to use? (set to true/false)
    USE_GOOGLE_SHEETS: true,
    USE_EMAILJS: true,
    USE_SUPABASE: true,

    // Fallback: If primary method fails, try others?
    FALLBACK_ENABLED: true,

    // Log to console for debugging (set to false in production)
    DEBUG: true
};

// Combine for easy access
window.APPOINTMENT_CONFIG = {
    GOOGLE_CONFIG: { ...GOOGLE_CONFIG, USE: SETTINGS.USE_GOOGLE_SHEETS },
    EMAILJS_CONFIG: { ...EMAILJS_CONFIG, USE: SETTINGS.USE_EMAILJS },
    SUPABASE_CONFIG: { ...SUPABASE_CONFIG, USE: SETTINGS.USE_SUPABASE },
    SETTINGS
};
