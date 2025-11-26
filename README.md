# Trade GPT CRM System

A comprehensive lead management system for Trade GPT with landing page, admin dashboard, and CRM integrations.

## 🚀 Features

### Landing Page
- ✅ Modern, responsive design
- ✅ Lead capture form with validation
- ✅ Real trading platform integration info (Trading212, IC Markets, eToro, Plus500)
- ✅ Enhanced testimonials with profit displays
- ✅ Custom logo integration
- ✅ Mobile-optimized

### Admin Dashboard
- ✅ Secure login system
- ✅ Complete lead management (view, edit, delete)
- ✅ Advanced filtering and search
- ✅ Real-time statistics dashboard
- ✅ CSV and Excel export functionality
- ✅ Responsive design for all devices

### CRM Integrations
- ✅ HubSpot integration
- ✅ Salesforce integration (basic structure)
- ✅ Pipedrive integration
- ✅ Custom webhook support
- ✅ Real-time lead synchronization

### Backend API
- ✅ RESTful API with Flask
- ✅ SQLite database for lead storage
- ✅ Authentication and session management
- ✅ Export functionality (CSV/Excel)
- ✅ CORS enabled for frontend integration

## 📋 Prerequisites

- Python 3.7 or higher
- Windows PowerShell or Command Prompt
- Modern web browser
- Internet connection (for CRM integrations)

## 🛠️ Quick Start

### Option 1: Automated Setup (Recommended)

1. **Download/Clone the project** to your desired location

2. **Run the startup script**:
   ```batch
   start-system.bat
   ```

3. **Access the applications**:
   - **Landing Page**: http://localhost:8000
   - **Admin Dashboard**: http://localhost:8000/admin/
   - **Backend API**: http://localhost:5000/api

4. **Default Admin Login**:
   - Username: `admin`
   - Password: `admin123`

### Option 2: Manual Setup

1. **Setup Backend**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   python app.py
   ```

2. **Setup Frontend** (in new terminal):
   ```bash
   python -m http.server 8000
   ```

## 📊 Admin Dashboard Features

### Lead Management
- **View all leads** in a paginated table
- **Search leads** by name, email, or phone
- **Filter leads** by status and investment amount
- **Edit lead information** including status and notes
- **Delete leads** with confirmation
- **Real-time statistics** showing totals and conversions

### Export Functionality
- **CSV Export**: Download leads in CSV format for spreadsheets
- **Excel Export**: Download formatted Excel file with proper columns
- **Automatic file naming** with timestamps

### CRM Integrations
- **HubSpot**: Automatic contact creation
- **Salesforce**: Lead synchronization (structure ready)
- **Pipedrive**: Person creation with custom fields
- **Webhook**: Send data to any custom endpoint

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout

### Leads Management
- `GET /api/leads` - Get leads (paginated, with filters)
- `POST /api/leads` - Create new lead
- `PUT /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead

### Export
- `GET /api/export/csv` - Export leads as CSV
- `GET /api/export/excel` - Export leads as Excel

### Integrations
- `GET /api/integrations` - Get CRM integrations
- `POST /api/integrations` - Add CRM integration

## 🔌 CRM Integration Setup

### HubSpot Integration
1. Go to Admin Dashboard → Integrations
2. Click "Configure" on HubSpot card
3. Enter your HubSpot API key
4. Activate integration

### Pipedrive Integration
1. Get API token from Pipedrive settings
2. Configure in Admin Dashboard
3. Test with a sample lead

### Custom Webhook
1. Set up your endpoint to receive POST requests
2. Configure webhook URL in dashboard
3. Leads will be sent as JSON payload

## 📁 Project Structure

```
trade-gpt-landing/
├── admin/                  # Admin Dashboard
│   ├── index.html         # Dashboard HTML
│   ├── admin-styles.css   # Dashboard styles
│   └── admin-script.js    # Dashboard functionality
├── backend/               # Flask Backend
│   ├── app.py            # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── exports/          # Generated export files
├── index.html            # Landing page
├── styles.css            # Landing page styles
├── script.js             # Landing page JavaScript
├── logo.svg              # Custom logo
├── start-system.bat      # Automated startup script
└── README.md             # This file
```

## 🎯 Usage Examples

### Adding a New Lead (Landing Page)
1. User fills out the form on the landing page
2. Form submits to `/api/leads`
3. Lead is stored in database
4. CRM integrations are triggered automatically
5. User receives confirmation message

### Managing Leads (Admin Dashboard)
1. Login with admin credentials
2. View all leads in the table
3. Use search/filters to find specific leads
4. Edit lead status as you follow up
5. Export data when needed

### Setting Up CRM Integration
1. Access Admin Dashboard → Integrations
2. Choose your CRM platform
3. Enter API credentials
4. Test with a sample lead
5. Activate integration

## 🔒 Security Features

- ✅ Password hashing for admin accounts
- ✅ Session-based authentication
- ✅ CSRF protection ready
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (SQLAlchemy ORM)

## 📈 Analytics & Reporting

### Dashboard Statistics
- **Total Leads**: All-time lead count
- **New Leads**: Leads with "new" status
- **Converted Leads**: Successful conversions
- **Today's Leads**: Leads acquired today

### Export Capabilities
- **CSV Format**: Compatible with Excel, Google Sheets
- **Excel Format**: Formatted spreadsheet with charts ready
- **Filtered Exports**: Export based on current filters

## 🛠️ Customization

### Adding New Lead Fields
1. Update the database model in `backend/app.py`
2. Add form fields in `index.html`
3. Update admin dashboard table and forms
4. Update CRM integration mappings

### Adding New CRM Integration
1. Create integration function in `backend/app.py`
2. Add configuration form in admin dashboard
3. Test the integration with sample data

### Styling Customization
- **Landing Page**: Edit `styles.css`
- **Admin Dashboard**: Edit `admin/admin-styles.css`
- **Logo**: Replace `logo.svg` with your design

## 🐛 Troubleshooting

### Common Issues

**"Connection refused" error**:
- Ensure both frontend and backend servers are running
- Check if ports 8000 and 5000 are available

**Admin login not working**:
- Default credentials: admin/admin123
- Check if database was properly initialized

**Form submission fails**:
- Verify backend server is running on port 5000
- Check browser console for CORS errors

**CRM integration not working**:
- Verify API keys are correct
- Check integration logs in browser console
- Test with manual API calls first

### Logs and Debugging
- **Backend logs**: Check the terminal running Flask app
- **Frontend logs**: Open browser Developer Tools → Console
- **Database**: Located at `backend/leads.db` (SQLite)

## 📞 Support

For technical support or customization requests:
- Check the browser console for detailed error messages
- Review the Flask application logs
- Verify all dependencies are properly installed

## 🔄 Updates and Maintenance

### Database Backup
```bash
# Backup the SQLite database
copy backend\leads.db backend\leads_backup.db
```

### Updating Dependencies
```bash
cd backend
pip install --upgrade -r requirements.txt
```

### Adding New Features
1. Update backend API endpoints
2. Update admin dashboard UI
3. Update landing page if needed
4. Test all integrations

---

**Made with ❤️ for Trade GPT Lead Management**