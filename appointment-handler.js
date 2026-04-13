/**
 * Appointment Handler - Supports 3 Backend Systems
 * 1. Google Sheets
 * 2. EmailJS
 * 3. Supabase Database
 */

// Load configuration (adjust path as needed)
// In HTML, include: <script src="config.js"></script> before this script

class AppointmentHandler {
    constructor() {
        this.config = window.APPOINTMENT_CONFIG || {
            GOOGLE_CONFIG: { USE: false, URL: '' },
            EMAILJS_CONFIG: { USE: false },
            SUPABASE_CONFIG: { USE: false },
            SETTINGS: { DEBUG: true }
        };

        // Initialize Supabase if needed
        if (this.config.SUPABASE_CONFIG.USE && window.supabase) {
            this.supabase = window.supabase.createClient(
                this.config.SUPABASE_CONFIG.URL,
                this.config.SUPABASE_CONFIG.ANON_PUBLIC_KEY
            );
        }
    }

    // Main submission handler - tries all configured systems
    async submitAppointment(formData) {
        const results = {
            success: false,
            systems: [],
            errors: []
        };

        const data = this.formatFormData(formData);

        // 1. Try Local Storage (always)
        this.saveToLocalStorage(data);
        results.systems.push('localStorage');

        // 2. Try Google Sheets
        if (this.config.GOOGLE_CONFIG.USE) {
            try {
                await this.saveToGoogleSheets(data);
                results.systems.push('Google Sheets');
            } catch (error) {
                results.errors.push(`Google Sheets: ${error.message}`);
                console.warn('Google Sheets failed:', error);
            }
        }

        // 3. Try EmailJS
        if (this.config.EMAILJS_CONFIG.USE && window.emailjs) {
            try {
                await this.saveViaEmailJS(data);
                results.systems.push('EmailJS');
            } catch (error) {
                results.errors.push(`EmailJS: ${error.message}`);
                console.warn('EmailJS failed:', error);
            }
        }

        // 4. Send customer confirmation email
        if (results.success && data.email) {
            try {
                await this.sendCustomerConfirmationEmail(data);
                results.systems.push('CustomerConfirmationEmail');
            } catch (error) {
                results.errors.push(`CustomerConfirmationEmail: ${error.message}`);
                console.warn('Customer confirmation email failed:', error);
            }
        }

        // 4. Try Supabase
        if (this.config.SUPABASE_CONFIG.USE && this.supabase) {
            try {
                await this.saveToSupabase(data);
                results.systems.push('Supabase');
            } catch (error) {
                results.errors.push(`Supabase: ${error.message}`);
                console.warn('Supabase failed:', error);
            }
        }

        results.success = results.systems.length > 0;
        return results;
    }

    formatFormData(formData) {
        return {
            id: Date.now().toString(),
            name: formData.get('name')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            phone: formData.get('phone')?.trim() || '',
            vehicle: formData.get('vehicle')?.trim() || '',
            service: formData.get('service') || '',
            message: formData.get('message')?.trim() || '',
            appointment_date: formData.get('appointment_date') || '',
            newsletter: formData.get('newsletter') === 'on',
            contact_consent: formData.get('contact_consent') === 'on',
            timestamp: new Date().toISOString()
        };
    }

    // ============================================
    // METHOD 1: Local Storage (Fallback)
    // ============================================
    saveToLocalStorage(data) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(data);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        console.log('Saved to localStorage:', data);
    }

    // ============================================
    // METHOD 2: Google Sheets
    // ============================================
    async saveToGoogleSheets(data) {
        const response = await fetch(this.config.GOOGLE_CONFIG.URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok && response.status !== 0) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log('Saved to Google Sheets:', data);
        return response;
    }

    // ============================================
    // METHOD 3: EmailJS
    // ============================================
    async saveViaEmailJS(data) {
        if (!window.emailjs) {
            throw new Error('EmailJS library not loaded');
        }

        // Send notification email to you
        await emailjs.send(
            this.config.EMAILJS_CONFIG.SERVICE_ID,
            this.config.EMAILJS_CONFIG.TEMPLATE_ID,
            {
                name: data.name,
                email: data.email,
                phone: data.phone,
                vehicle: data.vehicle,
                service: data.service,
                appointment_date: data.appointment_date,
                message: data.message || 'No message'
            },
            this.config.EMAILJS_CONFIG.PUBLIC_KEY
        );

        console.log('Email sent via EmailJS:', data);
    }

    // ============================================// METHOD 3: EmailJS - Customer Confirmation// ============================================async sendCustomerConfirmationEmail(data) {
        if (!window.emailjs) {
            throw new Error('EmailJS library not loaded');
        }

        // Send confirmation email to customer
        await emailjs.send(
            this.config.EMAILJS_CONFIG.SERVICE_ID,
            this.config.EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID,
            {
                name: data.name,
                email: data.email,
                phone: data.phone,
                vehicle: data.vehicle,
                service: data.service,
                appointment_date: data.appointment_date,
                message: data.message || 'No message',
                confirmation_message: `Thank you for booking with Yokesh Auto Mobiles! We have received your appointment request for ${data.service} on ${data.appointment_date}. Our team will contact you within 1 hour to confirm your appointment.`
            },
            this.config.EMAILJS_CONFIG.PUBLIC_KEY
        );

        console.log('Customer confirmation email sent:', data.email);
    }

    // ============================================
    // METHOD 4: Supabase Database
    // ============================================
    async saveToSupabase(data) {
        if (!this.supabase) {
            throw new Error('Supabase client not initialized');
        }

        const { data: result, error } = await this.supabase
            .from(this.config.SUPABASE_CONFIG.TABLE_NAME)
            .insert([{
                name: data.name,
                email: data.email,
                phone: data.phone,
                vehicle: data.vehicle,
                service: data.service,
                message: data.message,
                appointment_date: data.appointment_date,
                newsletter: data.newsletter,
                status: 'pending',
                created_at: data.timestamp
            }]);

        if (error) throw error;
        console.log('Saved to Supabase:', result);
        return result;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppointmentHandler;
}

// Initialize globally if in browser
if (typeof window !== 'undefined') {
    window.AppointmentHandler = AppointmentHandler;
}
