# Ganesha Ayurvedaa — Admin Dashboard

React + TypeScript admin dashboard matching the [Figma prototype](https://www.figma.com/proto/DKxVFXhqgNwlbIVMSQrvAF/Ganesha-Ayurvedaa-Prototype-Link).

## Getting Started

```bash
npm install
npm run dev
```

API calls use Vite proxy prefixes (avoids CORS in local dev). The browser hits same-origin paths; Vite forwards to the real servers:

| Env / prefix | Forwards to |
|--------------|-------------|
| `/patient-api` | `http://103.174.103.250:8101` |
| `/doctor-api` | `http://103.174.103.250:8102` |
| `/appointment-api` | `http://103.174.103.250:8103` |
| `/therapist-api` | `http://103.174.103.250:8104` |

Example: UI calls `/doctor-api/api/v1/doctors` → server `http://103.174.103.250:8102/api/v1/doctors`.

**Restart `npm run dev` after changing `.env`.** Direct browser calls to `103.174.103.250` will show CORS errors unless the backend allows your origin.

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
