# Trade GPT CRM System - Complete Guide

A comprehensive lead management system with landing page, admin dashboard, selective exports, and webhook integrations.

## 🚀 New Features (v2.0)

### ✨ Enhanced Lead Management
- ✅ **Edit Leads** - Update any lead information directly from the dashboard
- ✅ **Delete Leads** - Remove leads with confirmation dialog
- ✅ **Timestamps** - View creation and update times for each lead
- ✅ **Selective Export** - Choose specific leads to export
- ✅ **Bulk Actions** - Perform actions on multiple leads at once

### 🔗 Webhook Integration
- ✅ **Make.com Integration** - Send leads directly to Make.com scenarios
- ✅ **Custom Webhooks** - Connect to any webhook endpoint
- ✅ **Selective Sending** - Choose which leads to send
- ✅ **JSON Payload** - Complete lead data in standard format
- ✅ **Real-time Feedback** - Status notifications for webhook calls

### 📊 Export Enhancements
- ✅ **Select Leads** - Use checkboxes to select individual leads
- ✅ **Select All** - Bulk select all visible leads
- ✅ **Filtered Export** - Export only selected leads
- ✅ **Both Formats** - CSV and Excel support for selective export

## 📋 System Overview

### Landing Page Features
- Modern, responsive design with dark theme
- Lead capture form with real-time validation
- Integration info for real trading platforms:
  - Trading212
  - IC Markets
  - eToro
  - Plus500
- Custom SVG logo
- Smooth animations and effects

### Admin Dashboard Features
- Secure authentication system
- Complete lead management interface
- Advanced search and filtering
- Statistics dashboard with real-time metrics
- Bulk operations support
- Mobile-responsive design

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.7 or higher
- Modern web browser
- Internet connection (for webhook integrations)

### Step 1: Install Dependencies
```bash
cd backend
pip install flask flask-sqlalchemy flask-cors pandas openpyxl requests
```

### Step 2: Start the System

#### Quick Start (Windows)
Double-click `start-system.bat` to automatically start both servers.

#### Manual Start

**Backend Server:**
```bash
cd backend
python app.py
```
Runs on: http://localhost:5000

**Frontend Server:**
```bash
cd trade-gpt-landing
python -m http.server 8000
```
Runs on: http://localhost:8000

## 📱 Accessing the System

- **Landing Page:** http://localhost:8000
- **Admin Dashboard:** http://localhost:8000/admin

### Default Admin Login
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change the default password before production use!

## 🎯 Using the Admin Dashboard

### 1. Lead Management

#### View Leads
- All leads displayed in paginated table
- Shows: ID, Name, Email, Phone, Investment, Status, Source, Created Date
- Hover over dates to see full timestamps (created + updated)

#### Edit Leads
1. Click the "✏️ Edit" button on any lead
2. Modify the information in the modal form
3. Click "Save Changes"
4. Lead is updated instantly

#### Delete Leads
1. Click the "🗑️ Delete" button on any lead
2. Confirm the deletion
3. Lead is permanently removed

#### Search & Filter
- **Search bar:** Filter by name, email, or phone
- **Status filter:** Filter by lead status (new, contacted, qualified, converted, rejected)
- **Investment filter:** Filter by investment amount range

### 2. Selective Export

#### Export Selected Leads
1. **Select Leads:**
   - Use checkboxes next to each lead
   - Or click the checkbox in the header to select all visible leads

2. **Bulk Actions Bar Appears:**
   - Shows number of selected leads
   - Displays export and webhook options

3. **Choose Export Format:**
   - Click "📥 Export CSV" for CSV format
   - Click "📊 Export Excel" for Excel format

4. **Download:**
   - File downloads automatically
   - Filename includes timestamp: `leads_export_YYYYMMDD_HHMMSS.csv`

#### Export All Leads
1. Navigate to "Exports" section in sidebar
2. Click "Export CSV" or "Export Excel"
3. All leads in database are exported

### 3. Webhook Integration

#### Send Leads to Webhook
1. **Select Leads** using checkboxes
2. **Click "🔗 Send to Webhook"** button in bulk actions bar
3. **Enter Webhook URL** in the modal:
   - Make.com webhook URL
   - Zapier webhook URL
   - Custom webhook endpoint
4. **Click "🚀 Send to Webhook"**
5. **Receive Confirmation** - Success notification appears

#### Webhook Payload Format
```json
{
  "event": "leads_export",
  "timestamp": "2025-11-13T10:30:00",
  "count": 5,
  "leads": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "investment": "1000-1499",
      "source": "website",
      "status": "new",
      "notes": "",
      "created_at": "2025-11-13T09:15:30.123456",
      "updated_at": "2025-11-13T09:15:30.123456"
    }
  ]
}
```

## 🔗 Make.com Integration Guide

### Setup Webhook in Make.com

1. **Create New Scenario** in Make.com
2. **Add Webhook Trigger:**
   - Click "+" to add first module
   - Search for "Webhooks"
   - Select "Custom webhook"
   - Click "Create a webhook"
   - Copy the webhook URL

3. **Configure in Trade GPT:**
   - Select leads in admin dashboard
   - Click "Send to Webhook"
   - Paste Make.com webhook URL
   - Click "Send to Webhook"

4. **Test the Connection:**
   - Make.com will receive the data
   - Click "Redetermine data structure"
   - You'll see the JSON structure

### Example Make.com Workflows

#### Workflow 1: Send to Google Sheets
```
Webhook → Parse JSON → Add Row to Google Sheets
```

#### Workflow 2: Send to CRM + Email
```
Webhook → Parse JSON → Iterator → [Create HubSpot Contact, Send Email via Gmail]
```

#### Workflow 3: Multi-Platform Sync
```
Webhook → Parse JSON → Router → [HubSpot, Salesforce, Slack Notification]
```

### Advanced Make.com Features

#### Data Transformation
Use Make.com's built-in functions to:
- Format phone numbers
- Calculate lead score
- Enrich lead data
- Validate email addresses

#### Conditional Logic
Add filters between modules:
- Send only high-value leads (investment > $1000)
- Different actions based on lead status
- Filter by lead source

## 📊 API Documentation

### Authentication
All admin endpoints require session authentication via login.

### Public Endpoints

#### Create Lead
```http
POST /api/leads
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "investment": "1000-1499",
  "source": "website"
}
```

### Admin Endpoints (Authenticated)

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Get Leads
```http
GET /api/leads?page=1&per_page=25&status=new&search=john
```

#### Update Lead
```http
PUT /api/leads/1
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "investment": "1500+",
  "status": "contacted",
  "notes": "Follow up next week"
}
```

#### Delete Lead
```http
DELETE /api/leads/1
```

#### Export Selected Leads (CSV)
```http
POST /api/export/csv
Content-Type: application/json

{
  "lead_ids": [1, 2, 3, 5, 8]
}
```

#### Export Selected Leads (Excel)
```http
POST /api/export/excel
Content-Type: application/json

{
  "lead_ids": [1, 2, 3, 5, 8]
}
```

#### Send Leads to Webhook
```http
POST /api/leads/send-webhook
Content-Type: application/json

{
  "webhook_url": "https://hooks.make.com/your-webhook-id",
  "lead_ids": [1, 2, 3]
}
```

## 💾 Database Schema

### Lead Table
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| first_name | String(100) | Lead's first name |
| last_name | String(100) | Lead's last name |
| email | String(200) | Email (unique) |
| phone | String(20) | Phone number |
| investment | String(50) | Investment range |
| source | String(100) | Lead source |
| status | String(50) | Lead status |
| notes | Text | Additional notes |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

### Admin Table
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| username | String(80) | Username (unique) |
| email | String(200) | Email (unique) |
| password_hash | String(128) | Hashed password |
| is_active | Boolean | Account status |
| created_at | DateTime | Creation timestamp |

### CRMIntegration Table
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| name | String(100) | Integration name |
| api_key | String(500) | API key |
| api_secret | String(500) | API secret |
| webhook_url | String(500) | Webhook URL |
| is_active | Boolean | Integration status |
| settings | Text | JSON settings |
| created_at | DateTime | Creation timestamp |

## 🔒 Security Best Practices

1. **Change Default Password**
   - Edit `backend/app.py`
   - Update admin password in `init_db()` function

2. **Use Environment Variables**
   ```python
   import os
   SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-key')
   ```

3. **Enable HTTPS in Production**
   - Use reverse proxy (Nginx, Apache)
   - Get SSL certificate (Let's Encrypt)

4. **Configure CORS Properly**
   - Update origins in `backend/app.py`
   - Restrict to your domain only

5. **Use Production WSGI Server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in app.py
app.run(debug=True, port=5001)
```

**Database locked error:**
- Close all connections to leads.db
- Restart the backend server

**Import errors:**
```bash
pip install --upgrade flask flask-sqlalchemy flask-cors pandas openpyxl requests
```

### Frontend Issues

**Port 8000 already in use:**
```bash
python -m http.server 8080
```
Update baseURL in `admin/admin-script.js` if needed.

**CORS errors:**
- Ensure backend is running
- Check CORS configuration in `backend/app.py`
- Use same origin (localhost vs 127.0.0.1)

### Webhook Issues

**Webhook not receiving data:**
- Test webhook URL with tools like webhook.site
- Check if webhook accepts POST requests
- Verify webhook URL is accessible from your network
- Review backend console for error messages

**Timeout errors:**
- Webhook endpoint may be slow
- Check your internet connection
- Try with a smaller number of leads

### Export Issues

**Download not starting:**
- Check browser download settings
- Disable popup blockers
- Try different browser

**Excel file corrupted:**
- Ensure openpyxl is installed correctly
- Check exports/ directory permissions

## 📦 Project Structure

```
trade-gpt-landing/
├── index.html                 # Landing page
├── styles.css                # Landing page styles
├── script.js                 # Landing page JavaScript
├── logo.svg                  # Custom logo
├── start-system.bat          # Windows startup script
├── README.md                 # This documentation
├── admin/
│   ├── index.html           # Admin dashboard HTML
│   ├── admin-styles.css     # Admin styles
│   └── admin-script.js      # Admin JavaScript
└── backend/
    ├── app.py               # Flask API
    ├── requirements.txt     # Python dependencies
    ├── leads.db            # SQLite database (auto-created)
    └── exports/            # Export files (auto-created)
```

## 🔄 Version History

### Version 2.0.0 (Current)
- ✅ Edit lead functionality
- ✅ Delete lead functionality
- ✅ Selective export (CSV & Excel)
- ✅ Webhook integration (Make.com, custom)
- ✅ Bulk actions interface
- ✅ Timestamp display (created & updated)
- ✅ Enhanced UI with checkboxes
- ✅ Improved error handling

### Version 1.0.0
- Landing page with lead capture
- Admin dashboard with authentication
- Basic lead management
- Full export functionality
- CRM integration framework

## 📞 Support

For technical support or questions:
1. Check this documentation
2. Review troubleshooting section
3. Check browser console for errors
4. Review backend terminal output
5. Contact your development team

## 📝 License

This project is for internal use by Trade GPT.

---

**Version:** 2.0.0  
**Last Updated:** November 13, 2025  
**Developed with:** Flask, SQLAlchemy, Vanilla JavaScript  
**Tested on:** Windows 10/11, Chrome, Firefox, Edge
