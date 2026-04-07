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
    USE: false,  // Set to true when configured
    URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE', // e.g., https://script.google.com/macros/s/...
    SHEET_NAME: 'Appointments'
};

// ============================================
// EMAILJS CONFIGURATION
// ============================================
const EMAILJS_CONFIG = {
    // Get these from https://dashboard.emailjs.com/
    USE: false,  // Set to true when configured
    SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID', // e.g., service_xxx
    TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID', // e.g., template_xxx
    PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY', // e.g., user_xxx

    // Email addresses
    RECEIVER_EMAIL: 'yokeshautomobiles@gmail.com',
    ADMIN_EMAIL: 'yokeshautomobiles@gmail.com'
};

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_CONFIG = {
    // Get these from your Supabase project settings
    USE: false,  // Set to true when configured
    URL: 'YOUR_SUPABASE_PROJECT_URL', // e.g., https://abcde.supabase.co
    ANON_PUBLIC_KEY: 'YOUR_SUPABASE_ANON_PUBLIC_KEY', // starts with eyJ...
    TABLE_NAME: 'appointments',

    // Admin credentials for dashboard (simple password protection)
    ADMIN_PASSWORD: 'CHANGE_THIS_TO_STRONG_PASSWORD',
    ADMIN_EMAIL: 'yokeshautomobiles@gmail.com'
};

// ============================================
// SETTINGS
// ============================================
const SETTINGS = {
    // Which systems to use? (set to true/false)
    USE_GOOGLE_SHEETS: false,
    USE_EMAILJS: false,
    USE_SUPABASE: false,

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
