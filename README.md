# Ganesha Ayurvedaa — Admin Dashboard

React + TypeScript admin dashboard matching the [Figma prototype](https://www.figma.com/proto/DKxVFXhqgNwlbIVMSQrvAF/Ganesha-Ayurvedaa-Prototype-Link).

## Getting Started

```bash
npm install
npm run dev
```

API base URLs are configured in `.env` (see `.env.example`). In development, Vite proxies:

| Prefix | Service | Port |
|--------|---------|------|
| `/patient-api` | Patients | 8101 |
| `/doctor-api` | Doctors | 8102 |
| `/appointment-api` | Appointments / therapies / doshas | 8103 |
| `/therapist-api` | Therapists | 8104 |

## Patients Module (Figma-aligned)

| Route | Screen |
|-------|--------|
| `/patients` | Active/Inactive tabs, filters, table with Bill & Report actions |
| `/patients/:patientId` | Patient details with 4 tabs |

### Patient list actions
- **Click patient name/ID** → Patient detail page
- **Download icon** → Invoice modal
- **Upload button** → Upload Reports modal (with progress)

### Patient detail tabs
1. **Personal Information** — Basic, contact, emergency, ID info
2. **Medical Assessment** — Ayurvedic, physical exam, history, lifestyle, reports
3. **Treatment & Follow Up** — Active plan, follow-ups, appointment history
4. **Billing & Membership** — Package, payment, billing breakdown

## Full App Flow

Login → Signup → Dashboard → Patients / Doctors / Appointments / Profile

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run Vitest tests |
