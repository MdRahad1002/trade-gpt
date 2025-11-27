"""
Email Notification System for TradeGPT
Sends automated emails to admin and leads
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os

class EmailNotifier:
    def __init__(self):
        # Email configuration - Set these in environment variables
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', 587))
        self.sender_email = os.getenv('SENDER_EMAIL', '')
        self.sender_password = os.getenv('SENDER_PASSWORD', '')
        self.admin_email = os.getenv('ADMIN_EMAIL', 'admin@tradegpt.com')
        
    def send_email(self, to_email, subject, html_content, text_content=None):
        """Send an email with HTML and plain text versions"""
        try:
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = self.sender_email
            message['To'] = to_email
            
            # Add plain text version (fallback)
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                message.attach(text_part)
            
            # Add HTML version
            html_part = MIMEText(html_content, 'html')
            message.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
                
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    def notify_new_lead(self, lead):
        """Send notification to admin when new lead is received"""
        subject = f"🎯 New Lead: {lead['first_name']} {lead['last_name']}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }}
                .info-box {{ background: white; padding: 20px; margin: 15px 0; border-radius: 8px; 
                            border-left: 4px solid #667eea; }}
                .label {{ font-weight: bold; color: #667eea; }}
                .value {{ color: #333; }}
                .btn {{ display: inline-block; padding: 12px 24px; background: #667eea; 
                       color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 New Lead Received!</h1>
                    <p>A new potential customer has signed up</p>
                </div>
                <div class="content">
                    <div class="info-box">
                        <p><span class="label">Name:</span> <span class="value">{lead['first_name']} {lead['last_name']}</span></p>
                        <p><span class="label">Email:</span> <span class="value">{lead['email']}</span></p>
                        <p><span class="label">Phone:</span> <span class="value">{lead['phone']}</span></p>
                        <p><span class="label">Investment Range:</span> <span class="value">{lead['investment']}</span></p>
                    </div>
                    
                    <div class="info-box">
                        <h3>📊 Lead Details</h3>
                        <p><span class="label">Source:</span> <span class="value">{lead.get('source', 'Unknown')}</span></p>
                        <p><span class="label">UTM Campaign:</span> <span class="value">{lead.get('utm_campaign', 'Direct')}</span></p>
                        <p><span class="label">Device:</span> <span class="value">{lead.get('device_type', 'Unknown')}</span></p>
                        <p><span class="label">Submitted:</span> <span class="value">{datetime.now().strftime('%B %d, %Y at %I:%M %p')}</span></p>
                    </div>
                    
                    {f'<div class="info-box"><h3>📝 Notes</h3><p>{lead.get("notes", "")}</p></div>' if lead.get('notes') else ''}
                    
                    <div style="text-align: center;">
                        <a href="https://admin.tradegpt.sbs" class="btn">View in Admin Dashboard</a>
                    </div>
                </div>
                <div class="footer">
                    <p>TradeGPT Lead Management System</p>
                    <p>This is an automated notification. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        New Lead Received!
        
        Name: {lead['first_name']} {lead['last_name']}
        Email: {lead['email']}
        Phone: {lead['phone']}
        Investment: {lead['investment']}
        Source: {lead.get('source', 'Unknown')}
        Time: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
        
        View in admin dashboard: https://admin.tradegpt.sbs
        """
        
        return self.send_email(self.admin_email, subject, html_content, text_content)
    
    def send_welcome_email(self, lead):
        """Send welcome email to the new lead"""
        subject = f"Welcome to TradeGPT, {lead['first_name']}!"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }}
                .highlight {{ background: white; padding: 20px; margin: 20px 0; border-radius: 8px; 
                             border-left: 4px solid #10b981; }}
                .btn {{ display: inline-block; padding: 15px 30px; background: #667eea; 
                       color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; 
                       font-weight: bold; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 Welcome to TradeGPT!</h1>
                    <p>Your AI Trading Journey Starts Here</p>
                </div>
                <div class="content">
                    <p>Hi {lead['first_name']},</p>
                    
                    <p>Thank you for your interest in TradeGPT! We're excited to help you start your automated trading journey.</p>
                    
                    <div class="highlight">
                        <h3>✅ What Happens Next?</h3>
                        <ol style="padding-left: 20px;">
                            <li><strong>Account Review:</strong> Our team will review your registration within 2-4 hours</li>
                            <li><strong>Setup Call:</strong> A specialist will contact you at {lead['phone']} to explain the platform</li>
                            <li><strong>Account Activation:</strong> We'll help you set up your trading account and AI strategies</li>
                            <li><strong>Start Trading:</strong> Begin earning with AI-powered automation</li>
                        </ol>
                    </div>
                    
                    <div class="highlight">
                        <h3>📚 While You Wait</h3>
                        <p>Learn more about TradeGPT:</p>
                        <ul style="padding-left: 20px;">
                            <li>How our AI analyzes market conditions 24/7</li>
                            <li>Risk management and stop-loss features</li>
                            <li>Compatible trading platforms and brokers</li>
                            <li>Success stories from our users</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="https://tradegpt.sbs/education.html" class="btn">Learn More</a>
                    </div>
                    
                    <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email or call us at +1 (234) 567-890.</p>
                    
                    <p>Best regards,<br>
                    <strong>The TradeGPT Team</strong></p>
                </div>
                <div class="footer">
                    <p>⚠️ Trading involves risk. Please ensure you understand the risks before investing.</p>
                    <p>TradeGPT | support@tradegpt.sbs</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to TradeGPT, {lead['first_name']}!
        
        Thank you for your interest in TradeGPT!
        
        What Happens Next?
        1. Account Review - Our team will review your registration within 2-4 hours
        2. Setup Call - A specialist will contact you at {lead['phone']}
        3. Account Activation - We'll help you set up your trading account
        4. Start Trading - Begin earning with AI automation
        
        If you have any questions, contact us at support@tradegpt.com or +1 (234) 567-890.
        
        Best regards,
        The TradeGPT Team
        
        ⚠️ Trading involves risk. Please ensure you understand the risks before investing.
        """
        
        return self.send_email(lead['email'], subject, html_content, text_content)
    
    def notify_status_change(self, lead, old_status, new_status):
        """Notify admin when lead status changes"""
        subject = f"📊 Lead Status Update: {lead['first_name']} {lead['last_name']}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #667eea; color: white; padding: 20px; text-align: center; }}
                .content {{ background: #f8f9fa; padding: 20px; }}
                .status-box {{ background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }}
                .old-status {{ color: #f59e0b; font-weight: bold; }}
                .new-status {{ color: #10b981; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Lead Status Changed</h2>
                </div>
                <div class="content">
                    <div class="status-box">
                        <p><strong>Lead:</strong> {lead['first_name']} {lead['last_name']}</p>
                        <p><strong>Email:</strong> {lead['email']}</p>
                        <p><strong>Status Change:</strong> 
                           <span class="old-status">{old_status}</span> → 
                           <span class="new-status">{new_status}</span>
                        </p>
                        <p><strong>Time:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(self.admin_email, subject, html_content)

# Initialize email notifier
email_notifier = EmailNotifier()
