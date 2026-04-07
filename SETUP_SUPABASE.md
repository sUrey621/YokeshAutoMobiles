# Supabase Database & Admin Dashboard Setup

This guide helps you set up a professional database backend with an admin dashboard to view and manage appointments.

## 🗄️ **Step 1: Create Supabase Project**

1. Go to https://supabase.com/
2. Sign up / Log in
3. Click **New Project**
4. Fill in:
   - **Name:** `yokesh-auto-mobiles`
   - **Database Password:** (save this - your password)
   - **Region:** Select closest to India (e.g., Singapore)
5. Click **Create new project**
6. Wait ~2 minutes for provisioning

## 📊 **Step 2: Create Appointments Table**

1. In your Supabase dashboard, go to **Table Editor**
2. Click **New Table**
3. Table name: `appointments`
4. Check **Enable Row Level Security (RLS)** = OFF (for simplicity)
5. Add these columns:

| Column Name | Type | Default | Description |
|-------------|------|---------|-------------|
| id | uuid | `gen_random_uuid()` | Primary key |
| created_at | timestamptz | `now()` | Auto-created |
| name | text | - | Customer name |
| email | text | - | Customer email |
| phone | text | - | Customer phone |
| vehicle | text | - | Car details |
| service | text | - | Service type |
| message | text | - | Additional notes |
| appointment_date | date | - | Preferred date |
| newsletter | boolean | false | Newsletter opt-in |
| status | text | `'pending'` | pending/confirmed/cancelled |

6. Click **Create table**

## 🔐 **Step 3: Get API Credentials**

1. Go to **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** (e.g., `https://abcde.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
3. Save these to `config.js`:
```javascript
const SUPABASE_CONFIG = {
    URL: 'YOUR_PROJECT_URL',
    ANON_PUBLIC_KEY: 'YOUR_ANON_KEY',
    TABLE_NAME: 'appointments',
    ADMIN_PASSWORD: 'CHANGE_THIS_TO_STRONG_PASSWORD',
    ADMIN_EMAIL: 'yokeshautomobiles@gmail.com'
};
```

## 🛡️ **Step 4: Enable Realtime (Optional but Recommended)**

1. Go to **Database** → **Replication**
2. Toggle **Realtime** ON
3. Select table: `appointments`
4. This enables live updates in admin dashboard

## 📊 **Step 5: Create Admin Dashboard**

Create a new page `admin.html` with this code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Yokesh Auto Mobiles</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        .admin-login {
            max-width: 400px;
            margin: 100px auto;
            padding: 40px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .admin-dashboard {
            display: none;
        }
        .dashboard-header {
            background: var(--primary-color);
            color: white;
            padding: 20px;
            margin: -40px -40px 30px;
            border-radius: 12px 12px 0 0;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-card h3 {
            font-size: 2rem;
            color: var(--primary-color);
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: var(--primary-color);
            color: white;
            font-weight: 600;
        }
        tr:hover {
            background: #f9f9f9;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-confirmed { background: #d4edda; color: #155724; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        .btn-logout {
            background: var(--secondary-color);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            float: right;
        }
        .export-btn {
            background: var(--success-color);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <!-- Login Form -->
    <div class="admin-login" id="loginForm">
        <h2 style="text-align: center; margin-bottom: 20px; color: var(--primary-color);">Admin Login</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">Enter password to view appointments</p>
        <input type="password" id="adminPassword" placeholder="Enter admin password" style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 6px;">
        <button onclick="login()" style="width: 100%; padding: 12px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">Login</button>
        <p id="loginError" style="color: red; margin-top: 10px; display: none;">Incorrect password</p>
    </div>

    <!-- Dashboard -->
    <div class="admin-dashboard" id="dashboard">
        <div class="container" style="padding: 0 20px;">
            <div class="dashboard-header">
                <button class="btn-logout" onclick="logout()">Logout</button>
                <h1>📋 Appointment Dashboard</h1>
                <p>Yokesh Auto Mobiles - Manage All Bookings</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3 id="totalCount">0</h3>
                    <p>Total Appointments</p>
                </div>
                <div class="stat-card">
                    <h3 id="pendingCount">0</h3>
                    <p>Pending</p>
                </div>
                <div class="stat-card">
                    <h3 id="confirmedCount">0</h3>
                    <p>Confirmed</p>
                </div>
            </div>

            <button class="export-btn" onclick="exportToCSV()">📥 Export to CSV</button>

            <div style="overflow-x: auto;">
                <table id="appointmentsTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Vehicle</th>
                            <th>Service</th>
                            <th>Appointment Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Supabase Client Library -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <script>
        // Load config
        const CONFIG = {
            SUPABASE_CONFIG: {
                URL: 'YOUR_SUPABASE_URL',
                ANON_PUBLIC_KEY: 'YOUR_SUPABASE_ANON_KEY'
            },
            ADMIN_PASSWORD: 'YOUR_ADMIN_PASSWORD'
        };

        const supabase = window.supabase.createClient(
            CONFIG.SUPABASE_CONFIG.URL,
            CONFIG.SUPABASE_CONFIG.ANON_PUBLIC_KEY
        );

        // Login logic
        function login() {
            const password = document.getElementById('adminPassword').value;
            if (password === CONFIG.ADMIN_PASSWORD) {
                localStorage.setItem('adminLoggedIn', 'true');
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
                loadAppointments();
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        }

        function logout() {
            localStorage.removeItem('adminLoggedIn');
            location.reload();
        }

        // Check if already logged in
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            loadAppointments();
        }

        // Load appointments from Supabase
        async function loadAppointments() {
            try {
                const { data: appointments, error } = await supabase
                    .from('appointments')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                updateStats(appointments);
                renderTable(appointments);
            } catch (error) {
                console.error('Error loading appointments:', error);
                alert('Failed to load appointments. Please try again.');
            }
        }

        function updateStats(appointments) {
            const total = appointments.length;
            const pending = appointments.filter(a => a.status === 'pending').length;
            const confirmed = appointments.filter(a => a.status === 'confirmed').length;

            document.getElementById('totalCount').textContent = total;
            document.getElementById('pendingCount').textContent = pending;
            document.getElementById('confirmedCount').textContent = confirmed;
        }

        function renderTable(appointments) {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';

            appointments.forEach(apt => {
                const row = document.createElement('tr');
                const date = new Date(apt.appointment_date).toLocaleDateString();
                const statusClass = `status-${apt.status || 'pending'}`;

                row.innerHTML = `
                    <td>${new Date(apt.created_at).toLocaleDateString()}</td>
                    <td>${apt.name}</td>
                    <td>${apt.phone}</td>
                    <td>${apt.vehicle}</td>
                    <td>${apt.service}</td>
                    <td>${date}</td>
                    <td><span class="status-badge ${statusClass}">${apt.status || 'pending'}</span></td>
                    <td>
                        <button onclick="updateStatus('${apt.id}', 'confirmed')" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✓</button>
                        <button onclick="updateStatus('${apt.id}', 'cancelled')" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">✗</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        async function updateStatus(id, status) {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id);

            if (error) {
                alert('Failed to update status');
            } else {
                loadAppointments();
            }
        }

        function exportToCSV() {
            const rows = document.querySelectorAll('#appointmentsTable tr');
            const csv = [];

            rows.forEach(row => {
                const cols = row.querySelectorAll('td, th');
                const rowData = [];
                cols.forEach(col => {
                    rowData.push('"' + col.textContent.replace(/"/g, '""') + '"');
                });
                csv.push(rowData.join(','));
            });

            const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
            const link = document.createElement('a');
            link.href = encodeURI(csvContent);
            link.download = 'appointments_' + new Date().toISOString().split('T')[0] + '.csv';
            link.click();
        }
    </script>
</body>
</html>
```

## 🚀 **Step 6: Deploy Admin Dashboard**

1. Save the above as `admin.html` in your website folder
2. Commit and push to GitHub
3. Access at: `https://yokeshautomobiles.vercel.app/admin.html`
4. Login with your admin password

## 🔄 **Step 7: Update Appointment Form to Save to Supabase**

In `appointment.html`, add this JavaScript:

```javascript
async function saveToSupabase(data) {
    const { data: result, error } = await supabase
        .from('appointments')
        .insert([
            {
                name: data.name,
                email: data.email,
                phone: data.phone,
                vehicle: data.vehicle,
                service: data.service,
                message: data.message,
                appointment_date: data.appointment_date,
                newsletter: data.newsletter || false,
                status: 'pending'
            }
        ]);

    if (error) throw error;
    return result;
}

// Initialize Supabase
const supabase = window.supabase.createClient(
    CONFIG.SUPABASE_CONFIG.URL,
    CONFIG.SUPABASE_CONFIG.ANON_PUBLIC_KEY
);

// In the form submit handler, add:
await saveToSupabase(data);
```

---

## 📊 **Admin Dashboard Features:**

✅ View all appointments in a table
✅ Update status (Pending → Confirmed/Cancelled)
✅ Export to CSV
✅ Real-time updates (if you enable Realtime in Supabase)
✅ Statistics dashboard (Total, Pending, Confirmed)
✅ Mobile responsive
✅ Password protected

---

## 💡 **Benefits of Supabase:**

- 🆓 **Free tier:** 500 MB database, unlimited API calls
- 🚀 **Real-time:** Live updates (optional)
- 📱 **Admin Dashboard:** Professional interface
- 🔒 **Secure:** Row Level Security (RLS) available
- 📈 **Scalable:** Easy to upgrade as you grow
- 🔗 **REST API:** Auto-generated API endpoints

---

## 🎯 **Complete Flow:**

1. Customer fills form on website → Data saved to Supabase
2. You view appointments at `admin.html` (password protected)
3. Update status (Confirmed/Cancelled)
4. Export to CSV if needed
5. Email notifications (if also using EmailJS)

---

**After setup:** Your appointment system will be professional and scalable!
