"""
Real-time Analytics Dashboard API
Provides advanced statistics and conversion tracking
"""

from flask import jsonify
from datetime import datetime, timedelta
from sqlalchemy import func
from collections import defaultdict

def get_dashboard_analytics(db, Lead):
    """Get comprehensive dashboard analytics"""
    
    # Time periods
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    week_start = now - timedelta(days=7)
    month_start = now - timedelta(days=30)
    
    # Total leads
    total_leads = Lead.query.count()
    
    # Leads by time period
    today_leads = Lead.query.filter(Lead.created_at >= today_start).count()
    week_leads = Lead.query.filter(Lead.created_at >= week_start).count()
    month_leads = Lead.query.filter(Lead.created_at >= month_start).count()
    
    # Leads by status
    status_breakdown = db.session.query(
        Lead.status,
        func.count(Lead.id)
    ).group_by(Lead.status).all()
    
    status_stats = {status: count for status, count in status_breakdown}
    
    # Conversion rates
    converted = status_stats.get('converted', 0)
    conversion_rate = (converted / total_leads * 100) if total_leads > 0 else 0
    
    # Leads by source
    source_breakdown = db.session.query(
        Lead.source,
        func.count(Lead.id)
    ).group_by(Lead.source).all()
    
    source_stats = {source: count for source, count in source_breakdown}
    
    # UTM Campaign performance
    campaign_breakdown = db.session.query(
        Lead.utm_campaign,
        func.count(Lead.id),
        func.sum(Lead.conversion_value)
    ).filter(Lead.utm_campaign.isnot(None)).group_by(Lead.utm_campaign).all()
    
    campaign_stats = [
        {
            'campaign': campaign,
            'leads': count,
            'value': float(value) if value else 0
        }
        for campaign, count, value in campaign_breakdown
    ]
    
    # Device breakdown
    device_breakdown = db.session.query(
        Lead.device_type,
        func.count(Lead.id)
    ).filter(Lead.device_type.isnot(None)).group_by(Lead.device_type).all()
    
    device_stats = {device: count for device, count in device_breakdown}
    
    # Average quality score
    avg_quality_score = db.session.query(
        func.avg(Lead.quality_score)
    ).filter(Lead.quality_score > 0).scalar() or 0
    
    # Leads by day (last 30 days)
    daily_leads = []
    for i in range(30):
        day_start = now - timedelta(days=i)
        day_end = day_start + timedelta(days=1)
        day_count = Lead.query.filter(
            Lead.created_at >= day_start,
            Lead.created_at < day_end
        ).count()
        daily_leads.append({
            'date': day_start.strftime('%Y-%m-%d'),
            'count': day_count
        })
    
    # Top investment ranges
    investment_breakdown = db.session.query(
        Lead.investment,
        func.count(Lead.id)
    ).group_by(Lead.investment).all()
    
    investment_stats = {inv: count for inv, count in investment_breakdown}
    
    # Response time stats (mock for now)
    avg_response_time = "2.5 hours"  # This would be calculated from actual response data
    
    return {
        'overview': {
            'total_leads': total_leads,
            'today_leads': today_leads,
            'week_leads': week_leads,
            'month_leads': month_leads,
            'conversion_rate': round(conversion_rate, 2),
            'avg_quality_score': round(avg_quality_score, 1)
        },
        'status': status_stats,
        'sources': source_stats,
        'campaigns': campaign_stats,
        'devices': device_stats,
        'investments': investment_stats,
        'daily_trend': list(reversed(daily_leads)),
        'performance': {
            'avg_response_time': avg_response_time,
            'high_quality_leads': Lead.query.filter(Lead.quality_score >= 70).count(),
            'hot_leads': status_stats.get('hot', 0) + status_stats.get('qualified', 0)
        }
    }

def get_conversion_funnel(db, Lead):
    """Get conversion funnel statistics"""
    
    total = Lead.query.count()
    new = Lead.query.filter_by(status='new').count()
    contacted = Lead.query.filter_by(status='contacted').count()
    qualified = Lead.query.filter_by(status='qualified').count()
    converted = Lead.query.filter_by(status='converted').count()
    
    return {
        'stages': [
            {'name': 'Total Leads', 'count': total, 'percentage': 100},
            {'name': 'New', 'count': new, 'percentage': round(new/total*100, 1) if total > 0 else 0},
            {'name': 'Contacted', 'count': contacted, 'percentage': round(contacted/total*100, 1) if total > 0 else 0},
            {'name': 'Qualified', 'count': qualified, 'percentage': round(qualified/total*100, 1) if total > 0 else 0},
            {'name': 'Converted', 'count': converted, 'percentage': round(converted/total*100, 1) if total > 0 else 0}
        ],
        'conversion_rate': round(converted/total*100, 2) if total > 0 else 0,
        'drop_off': {
            'new_to_contacted': round((new - contacted)/new*100, 1) if new > 0 else 0,
            'contacted_to_qualified': round((contacted - qualified)/contacted*100, 1) if contacted > 0 else 0,
            'qualified_to_converted': round((qualified - converted)/qualified*100, 1) if qualified > 0 else 0
        }
    }

def get_lead_quality_scores(db, Lead):
    """Calculate and return lead quality distribution"""
    
    high = Lead.query.filter(Lead.quality_score >= 70).count()
    medium = Lead.query.filter(Lead.quality_score >= 40, Lead.quality_score < 70).count()
    low = Lead.query.filter(Lead.quality_score < 40).count()
    
    total = high + medium + low
    
    return {
        'distribution': {
            'high': {'count': high, 'percentage': round(high/total*100, 1) if total > 0 else 0},
            'medium': {'count': medium, 'percentage': round(medium/total*100, 1) if total > 0 else 0},
            'low': {'count': low, 'percentage': round(low/total*100, 1) if total > 0 else 0}
        },
        'recommendations': [
            'Focus on high-quality leads first for better conversion rates',
            'Review medium-quality leads for potential qualification',
            'Consider automated follow-up for low-quality leads'
        ]
    }

def calculate_lead_quality_score(lead_data):
    """
    Calculate quality score based on multiple factors
    Score range: 0-100
    """
    score = 50  # Base score
    
    # Investment amount impact (+20 points max)
    investment_scores = {
        '1500+': 20,
        '1000-1499': 15,
        '250-999': 10,
        '0-249': 5
    }
    score += investment_scores.get(lead_data.get('investment', ''), 0)
    
    # Has deposit ready (+15 points)
    if 'yes' in str(lead_data.get('notes', '')).lower() and 'deposit' in str(lead_data.get('notes', '')).lower():
        score += 15
    
    # Source quality (+10 points for paid sources)
    if lead_data.get('utm_medium') in ['cpc', 'paid', 'ppc']:
        score += 10
    
    # Complete profile (+10 points)
    required_fields = ['first_name', 'last_name', 'email', 'phone']
    if all(lead_data.get(field) for field in required_fields):
        score += 10
    
    # Device type (desktop users slightly higher quality +5 points)
    if lead_data.get('device_type') == 'desktop':
        score += 5
    
    # Referrer quality (-10 points for direct traffic)
    if lead_data.get('referrer') == 'direct' or not lead_data.get('referrer'):
        score -= 10
    
    return min(100, max(0, score))  # Ensure score is between 0 and 100
