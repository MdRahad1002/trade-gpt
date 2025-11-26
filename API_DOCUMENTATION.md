# Trade GPT CRM API Documentation

## 📋 Overview

The Trade GPT API allows you to integrate lead data with external CRM platforms, automation tools, and custom applications. This documentation covers all available endpoints, authentication methods, and integration examples.

**Base URL:** `http://localhost:5000/api`  
**Production URL:** `https://your-domain.com/api`

---

## 🔐 Authentication

Most endpoints require authentication. Use session-based authentication by logging in first.

### Login
```http
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

---

## 📊 Lead Management Endpoints

### 1. Create Lead (Public)

**POST** `/api/leads`

Creates a new lead in the system. This endpoint is public and used by the registration form.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "investment": "250-999",
  "source": "website"
}
```

**Investment Options:**
- `"0-249"` - $0 - $249 USD
- `"250-999"` - $250 - $999 USD
- `"1000-1499"` - $1,000 - $1,499 USD
- `"1500+"` - $1,500+ USD

**Response (201 Created):**
```json
{
  "message": "Lead created successfully",
  "lead": {
    "id": 123,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "investment": "250-999",
    "source": "website",
    "status": "new",
    "notes": null,
    "created_at": "2025-11-13T10:30:00.000000",
    "updated_at": "2025-11-13T10:30:00.000000"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing required fields
```json
{
  "error": "Missing required field: email"
}
```

- **409 Conflict** - Email already exists
```json
{
  "error": "Lead with this email already exists"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "investment": "250-999",
    "source": "website"
  }'
```

**PowerShell Example:**
```powershell
$body = @{
    firstName = "John"
    lastName = "Doe"
    email = "john.doe@example.com"
    phone = "+1234567890"
    investment = "250-999"
    source = "website"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/leads" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

### 2. Get All Leads (Protected)

**GET** `/api/leads`

Retrieves all leads with optional filtering and pagination.

**Authentication:** Required (Login first)

**Query Parameters:**
- `page` (integer, optional) - Page number (default: 1)
- `per_page` (integer, optional) - Results per page (default: 50)
- `status` (string, optional) - Filter by status: `new`, `contacted`, `qualified`, `converted`, `rejected`
- `search` (string, optional) - Search by name or email

**Example Request:**
```http
GET /api/leads?page=1&per_page=25&status=new
```

**Response (200 OK):**
```json
{
  "leads": [
    {
      "id": 123,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "investment": "250-999",
      "source": "website",
      "status": "new",
      "notes": null,
      "created_at": "2025-11-13T10:30:00.000000",
      "updated_at": "2025-11-13T10:30:00.000000"
    }
  ],
  "total": 100,
  "page": 1,
  "per_page": 25,
  "pages": 4
}
```

---

### 3. Get Single Lead (Protected)

**GET** `/api/leads/{id}`

Retrieves a specific lead by ID.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": 123,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "investment": "250-999",
  "source": "website",
  "status": "new",
  "notes": null,
  "created_at": "2025-11-13T10:30:00.000000",
  "updated_at": "2025-11-13T10:30:00.000000"
}
```

**Error Response (404):**
```json
{
  "error": "Lead not found"
}
```

---

### 4. Update Lead (Protected)

**PUT** `/api/leads/{id}`

Updates an existing lead.

**Authentication:** Required

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "+1234567890",
  "investment": "1000-1499",
  "status": "contacted",
  "notes": "Follow up on Friday"
}
```

**Status Options:**
- `"new"` - New lead (default)
- `"contacted"` - Lead has been contacted
- `"qualified"` - Lead is qualified
- `"converted"` - Lead converted to customer
- `"rejected"` - Lead rejected/disqualified

**Response (200 OK):**
```json
{
  "message": "Lead updated successfully",
  "lead": {
    "id": 123,
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "investment": "1000-1499",
    "source": "website",
    "status": "contacted",
    "notes": "Follow up on Friday",
    "created_at": "2025-11-13T10:30:00.000000",
    "updated_at": "2025-11-13T15:45:00.000000"
  }
}
```

---

### 5. Delete Lead (Protected)

**DELETE** `/api/leads/{id}`

Permanently deletes a lead.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "message": "Lead deleted successfully"
}
```

---

## 🔗 Webhook Integration Endpoints

### 6. Send Leads to Webhook (Protected)

**POST** `/api/leads/send-webhook`

Sends selected leads to a webhook URL (e.g., Make.com, Zapier, custom endpoint).

**Authentication:** Required

**Request Body:**
```json
{
  "webhook_url": "https://hooks.make.com/your-webhook-id",
  "lead_ids": [1, 2, 3, 4, 5]
}
```

**Response (200 OK):**
```json
{
  "message": "Successfully sent 5 leads to webhook",
  "results": [
    {
      "lead_id": 1,
      "status": "success",
      "code": 200
    },
    {
      "lead_id": 2,
      "status": "success",
      "code": 200
    }
  ]
}
```

**Webhook Payload Format:**

Each lead is sent individually to your webhook URL as a POST request:

```json
{
  "id": 123,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "investment": "250-999",
  "source": "website",
  "status": "new",
  "notes": null,
  "created_at": "2025-11-13T10:30:00.000000",
  "updated_at": "2025-11-13T10:30:00.000000"
}
```

---

### 7. Manage CRM Integrations (Protected)

#### Get All Integrations

**GET** `/api/integrations`

**Authentication:** Required

**Response:**
```json
[
  {
    "id": 1,
    "name": "Make.com Automation",
    "is_active": true,
    "created_at": "2025-11-13T10:00:00.000000"
  }
]
```

#### Create Webhook Integration

**POST** `/api/integrations/webhook`

**Authentication:** Required

**Request Body:**
```json
{
  "webhook_url": "https://hooks.make.com/your-webhook-id",
  "name": "Make.com Integration",
  "active": true,
  "type": "webhook"
}
```

**Response (201 Created):**
```json
{
  "message": "Integration created successfully",
  "integration": {
    "id": 1,
    "name": "Make.com Integration",
    "webhook_url": "https://hooks.make.com/your-webhook-id",
    "is_active": true,
    "created_at": "2025-11-13T10:00:00.000000"
  }
}
```

#### Create HubSpot Integration

**POST** `/api/integrations/hubspot`

**Request Body:**
```json
{
  "api_key": "your-hubspot-api-key",
  "active": true,
  "type": "hubspot"
}
```

---

## 📤 Export Endpoints

### 8. Export Leads to CSV (Protected)

**POST** `/api/export/csv`

**Authentication:** Required

**Request Body:**
```json
{
  "lead_ids": [1, 2, 3, 4, 5]
}
```

**Response:**
Returns a CSV file download with headers:
```
id,first_name,last_name,email,phone,investment,status,source,created_at,updated_at
```

---

### 9. Export Leads to Excel (Protected)

**POST** `/api/export/excel`

**Authentication:** Required

**Request Body:**
```json
{
  "lead_ids": [1, 2, 3, 4, 5]
}
```

**Response:**
Returns an Excel (.xlsx) file download with formatted columns and headers.

---

## 🔌 Integration Examples

### Make.com (Integromat)

1. Create a new scenario in Make.com
2. Add "Webhooks" → "Custom Webhook" trigger
3. Copy the webhook URL
4. Configure in Trade GPT Admin → Integrations → Webhook
5. Paste URL and activate

**Example Make.com Scenario:**
```
Webhook Trigger → Parse JSON → Router:
  ├─→ Google Sheets (Add Row)
  ├─→ Email Notification
  └─→ CRM (Create Contact)
```

---

### Zapier

1. Create a new Zap
2. Choose "Webhooks by Zapier" as trigger
3. Select "Catch Hook"
4. Copy the webhook URL
5. Configure in Trade GPT Admin
6. Test by submitting a lead

**Example Zap:**
```
Webhook → Filter (investment > $1000) → Salesforce (Create Lead)
```

---

### HubSpot Direct Integration

**Requirements:**
- HubSpot API Key
- HubSpot account with Contacts access

**Setup:**
1. Get API key from HubSpot: Settings → Integrations → API Key
2. Admin Panel → Integrations → Configure HubSpot
3. Enter API key
4. All new leads automatically sync to HubSpot

**HubSpot Contact Properties Mapped:**
- `firstname` ← first_name
- `lastname` ← last_name
- `email` ← email
- `phone` ← phone
- `investment_amount` ← investment
- `lead_source` ← source

---

### Salesforce Integration

**Coming Soon** - Use Webhook for now

**Current Workaround:**
1. Use Make.com or Zapier
2. Connect webhook → Salesforce module
3. Map fields automatically

---

### Custom API Integration

**Example: Node.js Server**

```javascript
const express = require('express');
const app = express();

app.post('/webhook', express.json(), (req, res) => {
  const lead = req.body;
  
  console.log('New lead received:', lead);
  
  // Process lead
  // Send to your CRM
  // Send email notification
  // Store in database
  
  res.status(200).json({ success: true });
});

app.listen(3000);
```

**Example: Python Flask Server**

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    lead = request.json
    
    print(f"New lead: {lead['email']}")
    
    # Process lead
    # Forward to your CRM
    # Send notifications
    
    return jsonify({'success': True}), 200

if __name__ == '__main__':
    app.run(port=3000)
```

---

## 🌐 Exposing Local API to Internet

For external services like Make.com or Zapier to access your local API:

### Option 1: ngrok (Recommended)

```bash
# Download ngrok from https://ngrok.com
ngrok http 5000
```

This gives you a public URL like:
```
https://abc123.ngrok.io → http://localhost:5000
```

Use: `https://abc123.ngrok.io/api/leads` in external services

### Option 2: localtunnel

```bash
npm install -g localtunnel
lt --port 5000
```

### Option 3: Deploy to Production

Deploy your backend to:
- **Heroku** (Free tier available)
- **Railway** (Free tier)
- **Render** (Free tier)
- **DigitalOcean** (Starting at $5/month)
- **AWS/Azure** (Various pricing)

---

## 📊 Rate Limits

Currently no rate limits are implemented. For production:

**Recommended limits:**
- Public endpoints: 100 requests/hour per IP
- Protected endpoints: 1000 requests/hour per session
- Webhook sends: 50 requests/minute

---

## 🔒 Security Best Practices

### For Production Deployment:

1. **Enable HTTPS**
   - Use SSL certificates
   - Force HTTPS redirects

2. **Change Default Credentials**
   ```python
   # In app.py, change:
   default_username = "admin"
   default_password = "your-secure-password"
   ```

3. **Use Environment Variables**
   ```python
   SECRET_KEY = os.environ.get('SECRET_KEY')
   DATABASE_URL = os.environ.get('DATABASE_URL')
   ```

4. **Implement API Keys**
   - Add API key authentication for public endpoints
   - Rotate keys regularly

5. **Rate Limiting**
   ```python
   from flask_limiter import Limiter
   limiter = Limiter(app, key_func=get_remote_address)
   ```

6. **Input Validation**
   - Validate email format
   - Sanitize phone numbers
   - Validate investment ranges

7. **CORS Configuration**
   ```python
   CORS(app, origins=['https://your-domain.com'])
   ```

---

## 🐛 Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (email exists) |
| 500 | Server Error | Internal server error |

---

## 📞 Support

For issues or questions:
- Check backend console logs
- Verify both servers are running (ports 5000 and 8000)
- Test with cURL or Postman first
- Check CORS settings if requests fail from frontend

---

## 📝 Changelog

### Version 1.0.0 (2025-11-13)
- Initial API release
- Lead CRUD operations
- Webhook integration
- CSV/Excel export
- HubSpot integration
- Admin authentication
- Automatic lead forwarding

---

**Last Updated:** November 13, 2025  
**API Version:** 1.0.0  
**Backend:** Flask 3.1.2 + SQLAlchemy
