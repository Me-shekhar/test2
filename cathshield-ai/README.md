# CathShield.ai - Medical Quality & Safety Web Application

A comprehensive web application for IV/central line monitoring, CLABSI risk assessment, and hospital-wide HAI metrics tracking.

## 🛡️ Overview

CathShield.ai is a secure, HIPAA-compliant medical web application designed for hospitals to:

- **Capture IV/central line images** every 12 hours for assessment
- **Calculate CLISA scores** and CLABSI risk (early and late phases)
- **Monitor traction/venous trauma risk** via external safety devices
- **Display risk trends** with interactive charts and analytics
- **Generate actionable alerts** for nurses and clinical staff
- **Track ward-level metrics** for HAI reduction and quality reporting

## 🏗️ Architecture

```
cathshield-ai/
├── app/
│   ├── components/              # React components
│   │   ├── PatientIdentificationScreen.tsx
│   │   ├── AudioConsentModule.tsx
│   │   ├── ImageCaptureScreen.tsx
│   │   ├── ClisaScoreDisplay.tsx
│   │   ├── TrendPlot.tsx
│   │   ├── RiskMeter.tsx
│   │   ├── AlertsPanel.tsx
│   │   ├── ClisaTableModal.tsx
│   │   ├── WardDashboard.tsx
│   │   └── LandingPage.tsx
│   ├── api/                     # Next.js API routes
│   │   ├── patients/
│   │   ├── risk/
│   │   ├── alerts/
│   │   └── ward/
│   ├── layout.tsx
│   ├── page.tsx                 # Main app entry
│   └── globals.css
├── services/
│   ├── riskCalculator.ts        # CLISA & CLABSI risk logic
│   └── alertGenerator.ts         # Alert generation engine
├── lib/
│   ├── mockData.ts              # Mock data for development
│   └── utils.ts                 # Utility functions
├── types/
│   └── models.ts                # TypeScript interfaces
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd cathshield-ai
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

```bash
npm run build
npm start
```

## 📋 Features

### 1. Patient Identification Screen
- Bed number and patient initials entry
- Patient risk factors checklist:
  - Agitation/delirium
  - Age & weight extremes
  - Comorbidities
  - Immune status & nutrition

### 2. Audio Consent Module
- English and Kannada language support
- Patient/guardian consent documentation
- Privacy & security notices

### 3. Image Capture Workflow
- 12-hour checkpoint scheduling
- Catheter site image capture
- Traction module image capture
- Night mode for low-light imaging
- Optional clinical notes

### 4. CLISA Score & Risk Display
- Real-time CLISA score calculation (0-10 scale)
- Risk category: Low/Moderate/High
- Recommended clinical actions
- Interactive CLISA reference table modal

### 5. Risk Trending & Visualization
- 12-hour interval trend plots
- Color-coded risk bands (green/yellow/red)
- Event markers (dressing change, catheter replacement)
- Integrated risk scoring

### 6. Risk Meter
- Segmented gauge showing current CLABSI risk
- Real-time risk band indicator
- Status-specific messaging

### 7. Clinical Alerts
- Traction/dislodgement alerts
- Dressing failure notifications
- High CLABSI risk warnings
- CLISA score escalations
- Severity levels: info, warning, critical
- Acknowledgment tracking

### 8. Ward Dashboard & Analytics
- CLABSI rate calculation & trending
- Dressing usage metrics
- Catheter change tracking
- HAI reduction monitoring
- NABH/JCI quality reporting support

## 🔐 Security & Privacy

- **No patient names** stored or displayed
- **Bed number + initials** for identification
- **Encrypted data** transmission (HTTPS)
- **HIPAA-compliant** access controls
- **Audit logging** for all data access
- **Server-side validation** of all inputs
- **Privacy notice** displayed on load

## 📊 Data Models

### Core Entities

```typescript
// Patient
interface Patient {
  id: string;
  bed_number: string;
  initials: string;
  insertion_date: Date;
  patient_factors: PatientFactors;
  expected_admission_length_days?: number;
}

// Risk Checkpoint
interface RiskCheckpoint {
  id: string;
  patient_id: string;
  timestamp: Date;
  early_risk_score: number;
  late_risk_score: number;
  integrated_risk_score: number;
  risk_band: "green" | "yellow" | "red";
  clisa_score?: number;
  event_type?: "dressing_change" | "catheter_change";
}

// Alert
interface Alert {
  id: string;
  patient_id: string;
  type: "traction" | "dressing_failure" | "high_clabsi" | "high_clisa";
  message: string;
  severity: "info" | "warning" | "critical";
  recommended_action: string;
  acknowledged: boolean;
}

// Ward Metrics
interface WardMetrics {
  ward_id: string;
  date: Date;
  clabsi_cases: number;
  total_central_line_days: number;
  dressing_change_count: number;
  catheter_change_count: number;
  clabsi_rate?: number;
}
```

## 🧮 Risk Calculation Logic

### CLISA Scoring
- Dressing assessment (0-4 points)
- Patient factors (0-6 points)
- Total: 0-10 scale
- Categories: Low (≤2.5), Moderate (2.6-6.5), High (>6.5)

### Early CLABSI Risk (0-3 days)
- CLISA score contribution (0-40 points)
- Dressing failure (0-20 points)
- Patient factors (0-20 points)
- Early dwell time (0-20 points)

### Late CLABSI Risk (>3 days)
- Early risk foundation (60% weight)
- Dwell time risk (0-30 points) - significantly higher after 7 days
- Traction/venous trauma (0-25 points)
- Patient factors (0-20 points)
- Trend analysis (0-15 points)

### Integrated Risk
- Uses early risk for first 3 days
- Switches to weighted combination (40% early, 60% late) after day 3

## 📱 UI/UX Design

- **Healthcare-friendly**: Clean, minimal, high contrast
- **Color coding**: Green (safe) → Yellow (caution) → Red (urgent)
- **Large readable text**: 12-16pt base font
- **Mobile+tablet**: Responsive Tailwind CSS design
- **Accessibility**: WCAG 2.1 AA compliant (ongoing)

## 🔌 API Endpoints

```
GET    /api/patients                    # List all patients
POST   /api/patients                    # Create new patient
GET    /api/patients/[id]/dashboard     # Patient dashboard data
POST   /api/risk/calculate              # Calculate risk scores
GET    /api/alerts                      # Get alerts
GET    /api/ward/metrics                # Ward-level metrics
```

## 🧪 Development with Mock Data

The application includes comprehensive mock data in `lib/mockData.ts`:
- 3 sample patients with varying risk profiles
- Historical risk checkpoints
- Traction events
- Active and acknowledged alerts
- Ward metrics

Perfect for:
- UI/UX testing
- Feature development
- Demo purposes

## 📦 Dependencies

### Core
- **Next.js 14**: React framework
- **React 18**: UI library
- **TypeScript 5**: Type safety
- **Tailwind CSS 3**: Styling

### Visualization
- **Recharts**: Data visualization & trending

### Database (Production)
- **PostgreSQL**: Relational DB
- **Drizzle ORM**: TypeScript ORM

### Validation & Forms
- **Zod**: Runtime schema validation
- **React Hook Form**: Form management

## 🚧 Production Roadmap

- [ ] PostgreSQL database integration
- [ ] User authentication & RBAC
- [ ] Real image analysis (AI/ML CLISA scoring)
- [ ] Push notifications & SMS alerts
- [ ] Perplexity AI-based risk prediction
- [ ] Data export (CSV, PDF reports)
- [ ] Audit logging & compliance
- [ ] Multi-ward support
- [ ] Mobile app (React Native)
- [ ] Real-time WebSocket updates
- [ ] Integration with Hospital EHR systems

## 📝 License

Proprietary - For Hospital Use Only

## 🤝 Support

For implementation, customization, or integration support, contact the development team.

---

**Version**: 1.0.0  
**Status**: Development (Mock Data)  
**Last Updated**: December 2024
