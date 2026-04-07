# Yokesh Auto Mobiles - Car Mechanical Shop & Car Wash Website in Chennai

Professional responsive website for an automotive service center in Chennai offering mechanical repairs and water wash services.

## Features

### Mechanical Services
- Oil Change & Filter Replacement
- Brake Repair & Service
- Engine Diagnostics
- Transmission Service
- Suspension & Steering
- Battery & Electrical
- AC Service & Repair
- Tire Services
- General Repair

### Water Wash Services
- Express Wash (₹799 incl. tax)
- Deluxe Wash (₹999 incl. tax)
- Premium Detail (₹1200 incl. tax)
- Add-on Services (Undercarriage ₹299, Engine Wash ₹499, Headlight Restoration ₹799, etc.)

### Maintenance Packages
- Basic Care (₹1499/year)
- Premium Care (₹3999/year)
- Fleet Care (Custom pricing)

### Additional Features
- Fully responsive design (mobile, tablet, desktop)
- Smooth scroll navigation
- Interactive contact form with validation
- Service pricing display
- Customer testimonials
- Modern, professional UI
- Mobile-friendly hamburger menu
- Animated elements on scroll
- Dark mode toggle (Ctrl+D)

## Files

```
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Quick Start

### Option 1: Direct File Access
Simply open `index.html` in any modern web browser:
- Double-click the file, or
- Right-click → Open with → Your browser

### Option 2: Local Server (Recommended)
For best results, run a local server:

**Python 3:**
```bash
python -m http.server 8000
# Then open http://localhost:8000
```

**Node.js (with http-server):**
```bash
npx http-server -p 8000
# Then open http://localhost:8000
```

**VS Code Live Server:**
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

## Customization Guide

### 1. Update Business Information

**In `index.html`:**

- **Business Name**: Already set to "Yokesh Auto Mobiles"
- **Address**: Currently "No 49, Gopal Nagar, Ponniyamman Kovil 2nd Cross St, Narayanapuram, Pallikaranai, Chennai, Tamil Nadu 600100, India"
- **Phone**: Currently "+91 9003244967"
- **Email**: Currently "yokeshautomobiles@gmail.com"
- **Hours**: Currently "Monday-Saturday: 9:30 AM - 7:00 PM, Sunday: Closed"

**In `script.js` (line ~177):**
Update tracking/API endpoints for form submissions.

### 2. Change Pricing

**Water Wash Services** (in INR):
- Express Wash - Currently ₹199
- Deluxe Wash - Currently ₹399  
- Premium Detail - Currently ₹1999
- Add-ons - Various prices (₹299 - ₹2999)

**Maintenance Packages** (in INR):
- Basic Care - Currently ₹1499/year
- Premium Care - Currently ₹3999/year
- Fleet Care - Custom pricing

### 3. Update Colors

In `styles.css`, modify CSS variables in `:root`:
```css
:root {
    --primary-color: #e74c3c;      /* Main brand color (red) */
    --secondary-color: #3498db;    /* Secondary color (blue) */
    --accent-color: #f39c12;       /* Accent/highlight (orange) */
}
```

### 4. Add Real Contact Form Backend

Currently, form data is stored in browser's localStorage. To connect to a real backend:

In `script.js`, modify the `simulateFormSubmission` function:
```javascript
async function simulateFormSubmission(data) {
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}
```

### 5. Connect Google Analytics (Optional)

In `script.js`, find the analytics section (around line 195) and uncomment/add your tracking ID:
```javascript
// Replace with your GA tracking ID
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');
```

## Testing the Contact Form

1. Fill out the form
2. Submit - data is stored in browser's localStorage
3. View submissions in browser console:
   - Open DevTools (F12)
   - Run: `JSON.parse(localStorage.getItem('contactSubmissions'))`
   - OR in `script.js` console: `console.log(...)`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features to Add (Optional)

1. **Online Booking Calendar**: Integrate Calendly or custom calendar
2. **Payment Gateway**: Stripe, PayPal for deposits
3. **Live Chat**: Tawk.to, Intercom
4. **Photo Gallery**: Customer cars, shop photos
5. **Review System**: Google Reviews integration
6. **SEO**: Add meta tags, schema markup
7. **Blog**: Car maintenance tips section
8. **Inventory**: Show tires/parts in stock
9. **Mobile App**: Convert to PWA

## Structure Overview

```
index.html
├── Navigation (fixed top)
├── Hero Section
├── Mechanical Services (9 services)
├── Water Wash (4 packages + add-ons)
├── Maintenance Packages (3 tiers)
├── About Us
├── Testimonials
├── Contact Form
└── Footer
```

## Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1024px
- Mobile: < 768px
- Small Mobile: < 480px

## SEO Considerations

1. Add unique meta tags per page (if multi-page)
2. Add structured data (JSON-LD) for LocalBusiness
3. Create XML sitemap
4. Optimize images (compress, add alt text)
5. Add Google Search Console
6. Set up Google Business Profile

## Security Notes

- Form validation prevents basic attacks
- Sanitize inputs before backend processing
- Consider reCAPTCHA for spam prevention
- Use HTTPS in production
- Never expose API keys in frontend code

## Performance Tips

1. Compress images (use WebP)
2. Minify CSS/JS for production
3. Enable gzip/brotli compression
4. Add lazy loading for images
5. Use CDN for fonts if possible

## Maintenance

- Test form quarterly
- Update pricing as needed
- Refresh testimonials monthly
- Check broken links
- Update services based on offerings

## License

This project is provided as-is for business use. Feel free to modify and deploy.

## Support

For issues or customization help, refer to the code comments or reach out to a web developer.

---

## 🎯 Chennai-Specific Tips

### For Local SEO:
1. Add Chennai-specific keywords: "car service in Anna Nagar", "car wash Chennai", "best mechanic in Tamil Nadu"
2. Create Google Business Profile listing for "Yokesh Auto Mobiles"
3. Get reviews from local customers
4. Add your service area: Anna Nagar, Chennai and nearby neighborhoods
5. Include landmark references (near SPIC Nagar, near Thirumangalam, etc.)

### For Local Customers:
- Consider adding Tamil language option
- Display Indian phone number format prominently
- Mention that you service all major car brands in Chennai (Maruti, Hyundai, Honda, Tata, Mahindra, etc.)
- Highlight Chennai-specific challenges: monsoon maintenance, coastal corrosion protection

### Pricing Localization:
- Consider showing prices in INR instead of USD for local customers
- Typical Chennai rates:
  - Oil change: ₹500-1500
  - Water wash: ₹200-500
  - Full detailing: ₹2000-5000

---

**Ready to deploy?** Upload these files to any web hosting service (shared hosting, VPS, Netlify, Vercel, AWS S3, etc.)

**Need help?** All code is commented for easy customization.
