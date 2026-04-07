# EmailJS Integration Setup

Send appointment form submissions directly to your Gmail inbox using EmailJS - no backend required!

## 📋 **Step 1: Create EmailJS Account**

1. Go to https://dashboard.emailjs.com/
2. Sign up (free) with your Google account or email
3. Verify your email

## 📧 **Step 2: Add Email Service**

1. Click **Add Service**
2. Select **Gmail** (or your email provider)
3. Connect your Gmail account: `yokeshautomobiles@gmail.com`
4. Service will be created (e.g., `service_xxx`)
5. Copy the **Service ID**

## 📝 **Step 3: Create Email Template**

1. Go to **Email Templates** → **Add Template**
2. Click **Create Template**
3. Design your email:

**Subject:** `New Appointment - {{service}}`

**Template Name:** `Appointment Notification`

**Email Content:**
```
Hello {{name}}! Your appointment has been received.

📋 APPOINTMENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: {{name}}
📧 Email: {{email}}
📱 Phone: {{phone}}
🚗 Vehicle: {{vehicle}}
🔧 Service: {{service}}

📅 Preferred Date: {{appointment_date}}

📝 Additional Message:
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: Pending Confirmation
We'll contact you within 1 hour to confirm.

Best regards,
Yokesh Auto Mobiles Team
```

4. **Important:** Create variables matching the form fields:
   - `{{name}}`
   - `{{email}}`
   - `{{phone}}`
   - `{{vehicle}}`
   - `{{service}}`
   - `{{appointment_date}}`
   - `{{message}}`

5. Save template
6. Copy the **Template ID**

## 🔐 **Step 4: Get API Keys**

1. Click on your profile → **Integration**
2. Copy your **Public Key**

## 🔧 **Step 5: Update Configuration**

In `config.js`, update:

```javascript
const EMAILJS_CONFIG = {
    SERVICE_ID: 'your_service_id_here',
    TEMPLATE_ID: 'your_template_id_here',
    PUBLIC_KEY: 'your_public_key_here',
    RECEIVER_EMAIL: 'yokeshautomobiles@gmail.com',
    ADMIN_EMAIL: 'yokeshautomobiles@gmail.com'
};

const SETTINGS = {
    USE_EMAILJS: true,  // Set to true
    ...
};
```

## 📦 **Step 6: Install EmailJS in Project**

```bash
cd "/c/Users/Suresh/OneDrive/Documents/Corel/Demo/YokeshAutoMobiles"
npm install emailjs-com
```

## 💻 **Step 7: Update Appointment Form Code**

In `appointment.html`, add this JavaScript function:

```javascript
// Add to the form submission handler
async function sendEmailViaEmailJS(data) {
    return new Promise((resolve, reject) => {
        emailjs.send(
            CONFIG.EMAILJS_CONFIG.SERVICE_ID,
            CONFIG.EMAILJS_CONFIG.TEMPLATE_ID,
            {
                name: data.name,
                email: data.email,
                phone: data.phone,
                vehicle: data.vehicle,
                service: data.service,
                appointment_date: data.appointment_date,
                message: data.message || 'No additional message'
            },
            CONFIG.EMAILJS_CONFIG.PUBLIC_KEY
        )
        .then((result) => {
            console.log('Email sent successfully:', result.text());
            resolve(result);
        })
        .catch((error) => {
            console.error('Email failed to send:', error);
            reject(error);
        });
    });
}
```

Then modify the form submission to call `sendEmailViaEmailJS(data)` after successful localStorage save.

## 🎯 **What EmailJS Gives You:**

✅ Instant email to your Gmail inbox
✅ Professional HTML email template
✅ No backend/server required
✅ Free tier: 200 emails/month
✅ Works with any email provider

## 📊 **Check Your Sends:**

Go to EmailJS Dashboard → **Emails** to see:
- Delivery status
- Open rates
- Failed sends

---

## ⚠️ **Important Notes:**

1. **EmailJS Public Key** is safe to expose (it's public by design)
2. **Template variables** must match exactly between form and template
3. **Rate limits:** Free tier allows 200 emails/month
4. **Spam folder:** Check spam folder initially - add to contacts if needed

---

**After setup:** Test by submitting a form - you should receive an email within seconds!<tool_call>
<function=Bash>