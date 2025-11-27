from flask import Flask, request, jsonify, render_template, session, redirect, url_for, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import csv
import requests
import json
import os
from io import StringIO, BytesIO
import uuid

# Import analytics and email modules
try:
    from analytics import get_dashboard_analytics, get_conversion_funnel, get_lead_quality_scores, calculate_lead_quality_score
    from email_notifications import email_notifier
    ANALYTICS_ENABLED = True
    EMAIL_ENABLED = True
except ImportError:
    ANALYTICS_ENABLED = False
    EMAIL_ENABLED = False
    print("⚠️  Analytics and email modules not loaded")

# Serve frontend from parent directory
app = Flask(__name__, 
            static_folder='../frontend',
            static_url_path='/static',
            template_folder='../frontend')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'trade-gpt-secret-key-2025')

# Use PostgreSQL in production, SQLite in development
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL or 'sqlite:///leads.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_HTTPONLY'] = True

db = SQLAlchemy(app)

# Manual CORS configuration
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin', '')
    allowed_origins = [
        'https://tradegpt.sbs',
        'https://www.tradegpt.sbs', 
        'https://admin.tradegpt.sbs',
        'https://api.tradegpt.sbs',
        'http://localhost:8080', 
        'http://127.0.0.1:8080', 
        'http://localhost:8000', 
        'http://127.0.0.1:8000'
    ]
    
    if origin in allowed_origins:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    
    return response

# Handle OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        origin = request.headers.get('Origin', '')
        allowed_origins = [
            'https://tradegpt.sbs',
            'https://www.tradegpt.sbs',
            'https://admin.tradegpt.sbs', 
            'https://api.tradegpt.sbs',
            'http://localhost:8080', 
            'http://127.0.0.1:8080', 
            'http://localhost:8000', 
            'http://127.0.0.1:8000'
        ]
        
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        
        return response

# Database Models
class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    investment = db.Column(db.String(50), nullable=False)
    source = db.Column(db.String(100), default='website')
    status = db.Column(db.String(50), default='new')
    notes = db.Column(db.Text)
    # Enhanced tracking fields
    utm_source = db.Column(db.String(100))
    utm_medium = db.Column(db.String(100))
    utm_campaign = db.Column(db.String(100))
    utm_term = db.Column(db.String(200))
    utm_content = db.Column(db.String(200))
    referrer = db.Column(db.String(500))
    landing_page = db.Column(db.String(500))
    user_agent = db.Column(db.String(500))
    device_type = db.Column(db.String(50))
    ip_address = db.Column(db.String(50))
    country_code = db.Column(db.String(10))
    city = db.Column(db.String(100))
    conversion_value = db.Column(db.Float, default=0.0)
    quality_score = db.Column(db.Integer, default=0)
    last_activity = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'investment': self.investment,
            'source': self.source,
            'status': self.status,
            'notes': self.notes,
            'utm_source': self.utm_source,
            'utm_medium': self.utm_medium,
            'utm_campaign': self.utm_campaign,
            'utm_term': self.utm_term,
            'utm_content': self.utm_content,
            'referrer': self.referrer,
            'landing_page': self.landing_page,
            'device_type': self.device_type,
            'ip_address': self.ip_address,
            'country_code': self.country_code,
            'city': self.city,
            'conversion_value': self.conversion_value,
            'quality_score': self.quality_score,
            'last_activity': self.last_activity.isoformat() if self.last_activity else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ContactSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.String(50))
    message = db.Column(db.Text)
    source = db.Column(db.String(100), default='education-page')
    status = db.Column(db.String(50), default='new')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'country': self.country,
            'experience': self.experience,
            'message': self.message,
            'source': self.source,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CRMIntegration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    api_key = db.Column(db.String(500))
    api_secret = db.Column(db.String(500))
    webhook_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=False)
    settings = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# API Routes
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['fullName', 'email', 'phone', 'country']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if submission already exists
        existing = ContactSubmission.query.filter_by(email=data['email']).first()
        if existing:
            # Update existing submission
            existing.full_name = data['fullName']
            existing.phone = data['phone']
            existing.country = data['country']
            existing.experience = data.get('experience', '')
            existing.message = data.get('message', '')
            existing.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                'message': 'Contact submission updated successfully',
                'submission': existing.to_dict()
            }), 200
        
        # Create new contact submission
        submission = ContactSubmission(
            full_name=data['fullName'],
            email=data['email'],
            phone=data['phone'],
            country=data['country'],
            experience=data.get('experience', ''),
            message=data.get('message', ''),
            source='education-page'
        )
        
        db.session.add(submission)
        db.session.commit()
        
        # Trigger CRM integrations
        trigger_contact_crm_integrations(submission)
        
        return jsonify({
            'message': 'Contact submission received successfully',
            'submission': submission.to_dict()
        }), 201
        
    except Exception as e:
        print(f"Contact submission error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/leads', methods=['POST'])
def create_lead():
    try:
        data = request.get_json()
        
        # Support multiple form formats
        first_name = data.get('firstName', '')
        last_name = data.get('lastName', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        investment = data.get('investment', 'Not specified')
        country = data.get('country', 'Not specified')
        has_deposit = data.get('hasDeposit', 'unknown')
        call_time = data.get('callTime', 'anytime')
        experience = data.get('experience', '')
        message = data.get('message', '')
        
        # Validate required fields
        if not email or not phone:
            return jsonify({'error': 'Email and phone are required'}), 400
        
        if not first_name and not last_name:
            return jsonify({'error': 'Name is required'}), 400
        
        # Check if lead already exists
        existing_lead = Lead.query.filter_by(email=email).first()
        if existing_lead:
            # Build notes with all available information
            notes_parts = [f"Country: {country}"]
            if has_deposit != 'unknown':
                notes_parts.append(f"Has Deposit: {has_deposit}")
            if call_time != 'anytime':
                notes_parts.append(f"Call Time: {call_time}")
            if experience:
                notes_parts.append(f"Experience: {experience}")
            if message:
                notes_parts.append(f"Message: {message}")
            
            notes = ", ".join(notes_parts)
            
            # Update existing lead with new information
            existing_lead.first_name = first_name
            existing_lead.last_name = last_name
            existing_lead.phone = phone
            existing_lead.investment = investment
            existing_lead.source = data.get('source', 'website')
            existing_lead.notes = notes
            existing_lead.updated_at = datetime.utcnow()
            db.session.commit()
            
            # Trigger CRM integrations for updated lead
            trigger_crm_integrations(existing_lead)
            
            return jsonify({
                'message': 'Lead updated successfully',
                'lead': existing_lead.to_dict()
            }), 200
        
        # Build notes with all available information
        notes_parts = [f"Country: {country}"]
        if has_deposit != 'unknown':
            notes_parts.append(f"Has Deposit: {has_deposit}")
        if call_time != 'anytime':
            notes_parts.append(f"Call Time: {call_time}")
        if experience:
            notes_parts.append(f"Experience: {experience}")
        if message:
            notes_parts.append(f"Message: {message}")
        
        notes = ", ".join(notes_parts)
        
        # Get IP address
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        if ip_address and ',' in ip_address:
            ip_address = ip_address.split(',')[0].strip()
        
        # Calculate quality score
        quality_score = 50  # Default
        if ANALYTICS_ENABLED:
            quality_score = calculate_lead_quality_score(data)
        
        # Create new lead with enhanced tracking
        lead = Lead(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            investment=investment,
            source=data.get('source', 'website'),
            notes=notes,
            # Enhanced tracking
            utm_source=data.get('utm_source'),
            utm_medium=data.get('utm_medium'),
            utm_campaign=data.get('utm_campaign'),
            utm_term=data.get('utm_term'),
            utm_content=data.get('utm_content'),
            referrer=data.get('referrer'),
            landing_page=data.get('landing_page'),
            user_agent=data.get('user_agent'),
            device_type=data.get('device_type'),
            ip_address=ip_address,
            quality_score=quality_score,
            last_activity=datetime.utcnow()
        )
        
        db.session.add(lead)
        db.session.commit()
        
        # Send email notifications
        if EMAIL_ENABLED:
            try:
                email_notifier.notify_new_lead(lead.to_dict())
                email_notifier.send_welcome_email(lead.to_dict())
            except Exception as e:
                print(f"Email notification error: {e}")
        
        # Trigger CRM integrations
        trigger_crm_integrations(lead)
        
        return jsonify({
            'message': 'Lead created successfully',
            'lead': lead.to_dict()
        }), 201
        
    except Exception as e:
        print(f"Lead creation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/leads', methods=['GET'])
def get_leads():
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        status = request.args.get('status')
        search = request.args.get('search')
        
        query = Lead.query
        
        if status:
            query = query.filter(Lead.status == status)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                db.or_(
                    Lead.first_name.like(search_filter),
                    Lead.last_name.like(search_filter),
                    Lead.email.like(search_filter),
                    Lead.phone.like(search_filter)
                )
            )
        
        query = query.order_by(Lead.created_at.desc())
        
        pagination = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        leads = [lead.to_dict() for lead in pagination.items]
        
        return jsonify({
            'leads': leads,
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'total_pages': pagination.pages
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/leads/<int:lead_id>', methods=['PUT'])
def update_lead(lead_id):
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        lead = Lead.query.get_or_404(lead_id)
        data = request.get_json()
        
        # Track status change
        old_status = lead.status
        new_status = data.get('status', lead.status)
        
        # Update lead fields
        lead.first_name = data.get('first_name', lead.first_name)
        lead.last_name = data.get('last_name', lead.last_name)
        lead.email = data.get('email', lead.email)
        lead.phone = data.get('phone', lead.phone)
        lead.investment = data.get('investment', lead.investment)
        lead.status = new_status
        lead.notes = data.get('notes', lead.notes)
        lead.updated_at = datetime.utcnow()
        lead.last_activity = datetime.utcnow()
        
        db.session.commit()
        
        # Send status change notification
        if EMAIL_ENABLED and old_status != new_status:
            try:
                email_notifier.notify_status_change(lead.to_dict(), old_status, new_status)
            except Exception as e:
                print(f"Status change email error: {e}")
        
        return jsonify({
            'message': 'Lead updated successfully',
            'lead': lead.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/leads/<int:lead_id>', methods=['DELETE'])
def delete_lead(lead_id):
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        lead = Lead.query.get_or_404(lead_id)
        db.session.delete(lead)
        db.session.commit()
        
        return jsonify({'message': 'Lead deleted successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Export functionality
@app.route('/api/export/csv', methods=['GET', 'POST'])
def export_csv():
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        # Get lead IDs from request if selective export
        if request.method == 'POST':
            data = request.get_json()
            lead_ids = data.get('lead_ids', [])
            if lead_ids:
                leads = Lead.query.filter(Lead.id.in_(lead_ids)).order_by(Lead.created_at.desc()).all()
            else:
                leads = Lead.query.order_by(Lead.created_at.desc()).all()
        else:
            leads = Lead.query.order_by(Lead.created_at.desc()).all()
        
        output = StringIO()
        writer = csv.writer(output)
        
        # Write headers
        writer.writerow([
            'ID', 'First Name', 'Last Name', 'Email', 'Phone', 
            'Investment', 'Source', 'Status', 'Notes', 
            'Created At', 'Updated At'
        ])
        
        # Write data
        for lead in leads:
            writer.writerow([
                lead.id, lead.first_name, lead.last_name, lead.email,
                lead.phone, lead.investment, lead.source, lead.status,
                lead.notes or '', 
                lead.created_at.strftime('%Y-%m-%d %H:%M:%S') if lead.created_at else '',
                lead.updated_at.strftime('%Y-%m-%d %H:%M:%S') if lead.updated_at else ''
            ])
        
        # Create response
        output.seek(0)
        
        # Save to file
        filename = f'leads_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        filepath = os.path.join('exports', filename)
        os.makedirs('exports', exist_ok=True)
        
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            f.write(output.getvalue())
        
        return send_file(filepath, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export/excel', methods=['GET', 'POST'])
def export_excel():
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        # Get lead IDs from request if selective export
        if request.method == 'POST':
            data = request.get_json()
            lead_ids = data.get('lead_ids', [])
            if lead_ids:
                leads = Lead.query.filter(Lead.id.in_(lead_ids)).order_by(Lead.created_at.desc()).all()
            else:
                leads = Lead.query.order_by(Lead.created_at.desc()).all()
        else:
            leads = Lead.query.order_by(Lead.created_at.desc()).all()
        
        # Create DataFrame
        data = []
        for lead in leads:
            data.append({
                'ID': lead.id,
                'First Name': lead.first_name,
                'Last Name': lead.last_name,
                'Email': lead.email,
                'Phone': lead.phone,
                'Investment': lead.investment,
                'Source': lead.source,
                'Status': lead.status,
                'Notes': lead.notes or '',
                'Created At': lead.created_at.strftime('%Y-%m-%d %H:%M:%S') if lead.created_at else '',
                'Updated At': lead.updated_at.strftime('%Y-%m-%d %H:%M:%S') if lead.updated_at else ''
            })
        
        # Create CSV export instead of Excel
        filename = f'leads_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        filepath = os.path.join('exports', filename)
        os.makedirs('exports', exist_ok=True)
        
        # Write CSV file
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            if data:
                fieldnames = data[0].keys()
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(data)
        
        return send_file(filepath, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Webhook sending endpoint
@app.route('/api/leads/send-webhook', methods=['POST'])
def send_leads_webhook():
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        data = request.get_json()
        webhook_url = data.get('webhook_url')
        lead_ids = data.get('lead_ids', [])
        
        if not webhook_url:
            return jsonify({'error': 'Webhook URL is required'}), 400
        
        # Get leads
        if lead_ids:
            leads = Lead.query.filter(Lead.id.in_(lead_ids)).all()
        else:
            leads = Lead.query.all()
        
        if not leads:
            return jsonify({'error': 'No leads found'}), 404
        
        # Prepare payload
        payload = {
            'event': 'leads_export',
            'timestamp': datetime.utcnow().isoformat(),
            'count': len(leads),
            'leads': [lead.to_dict() for lead in leads]
        }
        
        # Send to webhook
        response = requests.post(
            webhook_url,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code in [200, 201, 202]:
            return jsonify({
                'message': f'Successfully sent {len(leads)} leads to webhook',
                'status_code': response.status_code,
                'count': len(leads)
            })
        else:
            return jsonify({
                'error': f'Webhook returned status code {response.status_code}',
                'response': response.text
            }), 400
        
    except requests.RequestException as e:
        return jsonify({'error': f'Failed to send webhook: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Authentication
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print(f"Login attempt - Data received: {data}")  # Debug log
        username = data.get('username')
        password = data.get('password')
        
        print(f"Looking for username: {username}")  # Debug log
        admin = Admin.query.filter_by(username=username, is_active=True).first()
        
        if admin:
            print(f"Admin found: {admin.username}")  # Debug log
            if check_password_hash(admin.password_hash, password):
                session['admin_id'] = admin.id
                session['username'] = admin.username
                print(f"Login successful for: {username}")  # Debug log
                return jsonify({'message': 'Login successful', 'username': admin.username})
            else:
                print("Password check failed")  # Debug log
                return jsonify({'error': 'Invalid credentials'}), 401
        else:
            print("Admin not found")  # Debug log
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'})

def is_authenticated():
    return 'admin_id' in session

# CRM Integration functions
def trigger_contact_crm_integrations(submission):
    """Trigger all active CRM integrations for a new contact submission"""
    try:
        integrations = CRMIntegration.query.filter_by(is_active=True).all()
        
        for integration in integrations:
            if integration.webhook_url:
                # Send contact submission to webhook
                try:
                    data = submission.to_dict()
                    requests.post(integration.webhook_url, json=data, timeout=10)
                except Exception as e:
                    print(f"Webhook integration error for contact: {e}")
                
    except Exception as e:
        print(f"Error triggering contact CRM integrations: {e}")

def trigger_crm_integrations(lead):
    """Trigger all active CRM integrations for a new lead"""
    try:
        integrations = CRMIntegration.query.filter_by(is_active=True).all()
        
        for integration in integrations:
            if integration.name.lower() == 'hubspot':
                trigger_hubspot_integration(lead, integration)
            elif integration.name.lower() == 'salesforce':
                trigger_salesforce_integration(lead, integration)
            elif integration.name.lower() == 'pipedrive':
                trigger_pipedrive_integration(lead, integration)
            elif integration.webhook_url:
                trigger_webhook_integration(lead, integration)
                
    except Exception as e:
        print(f"Error triggering CRM integrations: {e}")

def trigger_hubspot_integration(lead, integration):
    """Send lead to HubSpot CRM"""
    try:
        url = "https://api.hubapi.com/contacts/v1/contact"
        headers = {
            'Authorization': f'Bearer {integration.api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'properties': [
                {'property': 'firstname', 'value': lead.first_name},
                {'property': 'lastname', 'value': lead.last_name},
                {'property': 'email', 'value': lead.email},
                {'property': 'phone', 'value': lead.phone},
                {'property': 'investment_amount', 'value': lead.investment},
                {'property': 'lead_source', 'value': lead.source}
            ]
        }
        
        response = requests.post(url, headers=headers, json=data)
        print(f"HubSpot integration response: {response.status_code}")
        
    except Exception as e:
        print(f"HubSpot integration error: {e}")

def trigger_salesforce_integration(lead, integration):
    """Send lead to Salesforce CRM"""
    # Implement Salesforce API integration
    pass

def trigger_pipedrive_integration(lead, integration):
    """Send lead to Pipedrive CRM"""
    try:
        url = f"https://api.pipedrive.com/v1/persons?api_token={integration.api_key}"
        
        data = {
            'name': f"{lead.first_name} {lead.last_name}",
            'email': [lead.email],
            'phone': [lead.phone],
            'custom_fields': {
                'investment_amount': lead.investment,
                'lead_source': lead.source
            }
        }
        
        response = requests.post(url, json=data)
        print(f"Pipedrive integration response: {response.status_code}")
        
    except Exception as e:
        print(f"Pipedrive integration error: {e}")

def trigger_webhook_integration(lead, integration):
    """Send lead to custom webhook"""
    try:
        data = lead.to_dict()
        response = requests.post(integration.webhook_url, json=data, timeout=10)
        print(f"Webhook integration response: {response.status_code}")
        
    except Exception as e:
        print(f"Webhook integration error: {e}")

# CRM Integration management
@app.route('/api/integrations', methods=['GET'])
def get_integrations():
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    integrations = CRMIntegration.query.all()
    return jsonify([{
        'id': i.id,
        'name': i.name,
        'is_active': i.is_active,
        'created_at': i.created_at.isoformat() if i.created_at else None
    } for i in integrations])

@app.route('/api/integrations', methods=['POST'])
def create_integration():
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    try:
        data = request.get_json()
        integration = CRMIntegration(
            name=data['name'],
            api_key=data.get('api_key'),
            api_secret=data.get('api_secret'),
            webhook_url=data.get('webhook_url'),
            is_active=data.get('is_active', False),
            settings=json.dumps(data.get('settings', {}))
        )
        
        db.session.add(integration)
        db.session.commit()
        
        return jsonify({'message': 'Integration created successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Analytics endpoints
@app.route('/api/analytics/dashboard', methods=['GET'])
def get_analytics_dashboard():
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    if not ANALYTICS_ENABLED:
        return jsonify({'error': 'Analytics module not available'}), 503
    
    try:
        analytics = get_dashboard_analytics(db, Lead)
        return jsonify(analytics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/funnel', methods=['GET'])
def get_analytics_funnel():
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    if not ANALYTICS_ENABLED:
        return jsonify({'error': 'Analytics module not available'}), 503
    
    try:
        funnel = get_conversion_funnel(db, Lead)
        return jsonify(funnel)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/quality', methods=['GET'])
def get_analytics_quality():
    if not is_authenticated():
        return jsonify({'error': 'Authentication required'}), 401
    
    if not ANALYTICS_ENABLED:
        return jsonify({'error': 'Analytics module not available'}), 503
    
    try:
        quality = get_lead_quality_scores(db, Lead)
        return jsonify(quality)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database and create default admin
def init_db():
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created/verified")
            
            # Create default admin if none exists
            existing_admin = Admin.query.filter_by(username='tradeadmin').first()
            if not existing_admin:
                admin = Admin(
                    username='tradeadmin',
                    email='admin@tradegpt.sbs',
                    password_hash=generate_password_hash('adm1234'),
                    is_active=True
                )
                db.session.add(admin)
                db.session.commit()
                print("✅ Default admin created: tradeadmin / adm1234")
                print("⚠️  IMPORTANT: Change the password after first login!")
            else:
                print("✅ Admin user exists: tradeadmin")
            
            # List all tables
            inspector = db.inspect(db.engine)
            table_names = inspector.get_table_names()
            print(f"✅ Database initialized with {len(table_names)} tables: {', '.join(table_names)}")
            
            if ANALYTICS_ENABLED:
                print("✅ Analytics enabled")
            if EMAIL_ENABLED:
                print("✅ Email notifications enabled")
                
        except Exception as e:
            print(f"❌ Database initialization error: {e}")
            import traceback
            traceback.print_exc()

# ========================================
# FRONTEND ROUTES - Serve HTML Pages
# ========================================

@app.route('/')
def index():
    """Serve main landing page"""
    return send_file('../frontend/index.html')

@app.route('/admin')
@app.route('/admin/')
def admin_page():
    """Serve admin dashboard"""
    return send_file('../frontend/admin/index.html')

@app.route('/page2-lead-capture.html')
def page2():
    """Serve lead capture page"""
    return send_file('../frontend/page2-lead-capture.html')

@app.route('/page3-thankyou.html')
def page3():
    """Serve thank you page"""
    return send_file('../frontend/page3-thankyou.html')

@app.route('/landing-page-trade-gpt.html')
@app.route('/landing-page-trade-gpt')
def landing():
    """Serve alternative landing page"""
    return send_file('../frontend/landing-page-trade-gpt.html')

@app.route('/education.html')
def education():
    """Serve education page"""
    return send_file('../frontend/education.html')

@app.route('/privacy-policy')
def privacy():
    """Serve privacy policy page"""
    return send_file('../frontend/privacy-policy.html')

@app.route('/terms-conditions')
def terms():
    """Serve terms and conditions page"""
    return send_file('../frontend/terms-conditions.html')

# Always initialize database on import (for production)
try:
    init_db()
except Exception as e:
    print(f"⚠️  Database initialization warning: {e}")

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
