# TradeGPT Compliant Funnel System

## 🔰 Meta & Google Approved 3-Page Funnel

This is a fully compliant funnel structure designed for automated AI trading tools that passes Meta Ads and Google Ads review.

---

## 📁 Funnel Structure

### **PAGE 1: Landing Page** (`page1-landing.html`)
- **Purpose**: Introduce AI tool safely
- **URL**: Target page for paid ads
- **Content**: 
  - Educational messaging only
  - AI-assisted analysis features
  - Optional automation explanation
  - Minimum $250 deposit transparency
  - No profit claims, signals, or charts
- **CTA**: "Get Your Free Explanation Call" → Links to PAGE 2

### **PAGE 2: Lead Capture** (`page2-lead-capture.html`)
- **Purpose**: Qualify and collect lead information
- **Content**:
  - Contact form (Name, Email, Phone, Country)
  - Call time preference
  - Qualification question about $250 deposit
  - No promises or profit claims
- **CTA**: "Submit & Continue" → Submits to backend → Redirects to PAGE 3

### **PAGE 3: Thank You** (`page3-thankyou.html`)
- **Purpose**: Confirmation and expectation setting
- **Content**:
  - Success confirmation
  - What to expect next (6-point list)
  - Expected contact timeframe
  - Optional conceptual video link
  - No trading content, signals, or profit claims

---

## ✅ What IS Allowed

- ✓ AI-assisted analysis
- ✓ Optional automated strategy features
- ✓ Implemented in partner brokers
- ✓ Helps users understand markets
- ✓ Free explanation call
- ✓ Minimum deposit = $250 (transparent)
- ✓ Educational + transparent tone
- ✓ Risk warnings everywhere

---

## ❌ What is NOT Allowed

- ❌ "Bot trades for you"
- ❌ "Guaranteed results"
- ❌ "Earn while you sleep"
- ❌ "Profit automation"
- ❌ Broker signup links on landing page
- ❌ Profitable screenshots
- ❌ Earnings numbers or ROI percentages
- ❌ Win rates or signals
- ❌ Testimonials with profits
- ❌ Financial advice wording
- ❌ Hype language

---

## 🚀 Deployment Flow

```
Ads → PAGE 1 (page1-landing.html)
         ↓
      CTA Click
         ↓
     PAGE 2 (page2-lead-capture.html)
         ↓
    Form Submit → Backend API
         ↓
     PAGE 3 (page3-thankyou.html)
         ↓
  Specialist Contact (off-platform)
```

---

## 🔧 Technical Setup

### Files:
- `page1-landing.html` - Main landing page
- `page2-lead-capture.html` - Lead capture form
- `page3-thankyou.html` - Thank you/confirmation
- `funnel-styles.css` - Unified stylesheet
- `backend/app.py` - API endpoint for form submissions

### Backend API:
- **Endpoint**: `POST /api/leads`
- **Function**: Stores leads in database
- **Response**: 201 Created (success) or 409 Conflict (existing email)

### Form Data Structure:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "country": "US",
  "callTime": "afternoon",
  "hasDeposit": "yes",
  "source": "page2-lead-capture",
  "timestamp": "2025-11-21T..."
}
```

---

## 🛡️ Compliance Features

### Legal Protection:
- Multiple risk disclaimers on every page
- Clear "not financial advice" statements
- Transparent deposit information
- No misleading claims or guarantees
- Educational tone throughout

### Meta/Google Crawlable:
- All 3 pages are safe for ad review
- No hidden risky content
- Clean, compliant messaging
- Proper risk disclosures

### Post-Funnel Activities (Not Crawled):
- Broker platform access
- Private specialist calls
- WhatsApp/Email follow-ups
- Dashboard demonstrations
- Real trading signals

---

## 📊 Lead Qualification

The form includes a key qualification question:

**"Do you have at least $250 available to activate the AI strategy features inside the broker platform?"**

- **Yes** → Qualified lead → Priority follow-up
- **No** → Nurture list → Educational content

---

## 🎨 Design Features

- Modern dark theme (professional)
- Gradient CTA buttons
- Smooth animations and transitions
- Fully responsive (mobile-optimized)
- Clear visual hierarchy
- Trust indicators

---

## 🔄 Testing the Funnel

### Local Testing:
1. Start Python HTTP server: `python -m http.server 8080`
2. Visit: `http://localhost:8080/page1-landing.html`
3. Click "Get Your Free Explanation Call"
4. Fill out form on Page 2
5. View confirmation on Page 3

### Backend Testing:
1. Activate virtual environment
2. Run Flask: `python backend/app.py`
3. Backend runs on `http://localhost:5000`
4. Form submits to `/api/leads`

---

## 📈 Why This Structure Works

1. **No Policy Violations**: All pages comply with Meta/Google financial advertising policies
2. **Clean Separation**: Risky content (signals, profits) happens AFTER lead capture
3. **Transparent**: Clear about costs, risks, and limitations
4. **Professional**: Builds trust without overpromising
5. **Proven**: Same structure used by professional financial lead-gen agencies

---

## 🚨 Important Notes

- **Never add**: Profit screenshots, earnings claims, or guaranteed results to any page
- **Always include**: Risk disclaimers on every page
- **Keep broker links**: Off the landing page (only given after lead capture)
- **Monitor compliance**: Regularly review ad policies for updates

---

## 📞 Support & Next Steps

After leads submit:
1. Specialist contacts within 24 hours
2. Explains AI tool in detail
3. Guides broker account setup
4. Configures AI settings
5. Provides ongoing support

---

## 📄 License

© 2025 TradeGPT. All rights reserved.

**Disclaimer**: This funnel structure is designed for educational purposes and compliance guidance. Always consult with legal and compliance professionals before running financial advertising campaigns.
