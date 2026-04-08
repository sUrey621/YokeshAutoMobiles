# Google Sheets Integration Setup

This guide will help you set up Google Sheets to automatically receive and store appointment form submissions.

## 📋 **Step 1: Create a Google Sheet**

1. Go to https://sheets.google.com
2. Click **+ Blank** to create new spreadsheet
3. Rename it to "Yokesh Auto Mobiles - Appointments"
4. Set up column headers in Row 1:
   ```
   A1: ID
   B1: Timestamp
   C1: Name
   D1: Email
   E1: Phone
   F1: Vehicle
   G1: Service
   H: Message
   I: Appointment Date
   J: Newsletter
   K: Status
   ```

## 📝 **Step 2: Create Google Apps Script**

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code and paste the code from `google-apps-script.js`
3. Save the project (Ctrl+S) - name it "Appointment Form Handler"
4. Click **Deploy** → **New deployment**
5. Select type: **Web app**
6. Configure:
   - Execute as: **Me** (your email)
   - Who has access: **Anyone** (for form submissions)
7. Click **Deploy**
8. Copy the **Web App URL** (looks like: `https://script.google.com/macros/s/AKfycbxtYwJkxGihOGcUFIexC_FxcFuibRLsBHdOEWQpLMG9PkO_mq0RSMjoc8VX8nj8Al6X/exec`)
9. Paste this URL in `config.js` → `GOOGLE_CONFIG.SHEETS_WEBAPP_URL`

## 📤 **Step 3: Test the Integration**

1. Fill out the appointment form on your website
2. Check Google Sheets - new row should appear with the appointment data
3. If it doesn't work:
   - Check browser console for errors
   - Verify the web app URL is correct
   - Make sure the sheet has the correct column headers

## 🔧 **Google Apps Script Code:**

```javascript
// google-apps-script.js
function doPost(e) {
  try {
    // Parse the form data
    const data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet and sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Appointments') || ss.getSheets()[0];

    // Prepare row data
    const row = [
      data.id || new Date().getTime(),
      new Date().toLocaleString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.vehicle || '',
      data.service || '',
      data.message || '',
      data.appointment_date || '',
      data.newsletter || false,
      'Pending' // Status
    ];

    // Append to sheet
    sheet.appendRow(row);

    // Send email notification
    sendNotificationEmail(data);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Appointment saved' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotificationEmail(data) {
  const subject = `New Appointment: ${data.name} - ${data.service}`;
  const body = `
New appointment booked!

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Vehicle: ${data.vehicle}
Service: ${data.service}
Date: ${data.appointment_date}
Message: ${data.message || 'None'}

Booked at: ${new Date().toLocaleString()}
  `;

  // Send to your email
  MailApp.sendEmail({
    to: 'yokeshautomobiles@gmail.com',
    subject: subject,
    body: body
  });
}

// For testing in browser (optional)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ message: 'Appointment endpoint is working' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 🎯 **What This Does:**

✅ Automatically saves form submissions to Google Sheets
✅ Sends you an email notification for each appointment
✅ Timestamps every entry
✅ Includes all form fields
✅ Simple and free forever

---

## 🔄 **Alternative: Use a Free Third-Party Service**

If Google Apps Script seems complex, you can use:

**SheetDB** (https://sheetdb.io/) - Turns your Google Sheet into a REST API
**Sheet.Best** (https://sheet.best/) - Similar service

Both have free tiers and are easier to set up.

---

**After setup:** Update `config.js` with your Google Apps Script URL and set `USE_GOOGLE_SHEETS = true` in `SETTINGS`.
