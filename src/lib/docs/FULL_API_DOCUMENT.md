# Ayurvedaa API — Frontend alignment notes

**Source:** FULL_API_DOCUMENT (11 Sep 2026)  
**Branch baseline:** `fixes-development`

This frontend is aligned to the service ports and `/api/v1` contracts in that document.

## Service ports (Vite proxy)

| Service | Port |
|---------|-----:|
| patient | 8101 |
| doctor | 8102 |
| appointment | 8103 |
| therapist | 8104 |
| file-upload | 8105 |
| attendance | 8106 |
| activity-log | 8107 |
| medicine | 8108 |
| billing | 8109 |
| notification | 8110 |
| auth | 8111 |
| payment | 8112 |

Default remote host: `http://45.195.229.15` (`VITE_BACKEND_HOST`).

## FE integration checklist (from API doc)

1. Login → store `accessToken`, `user.pageCodes`, `tenant`
2. `Authorization: Bearer …` on clinical calls
3. Super Admin: platform hospitals / mail / payment-gateway only
4. Lists: unwrap `data.content` (sales → `data.sales`) via `apiRequestList` / `apiRequestPage`
5. Appointment patients: `statusTab=ACTIVE|INACTIVE`
6. Invoice: send `patientEmail` when available
7. Online pay: payment-service links (`src/lib/api/payments.ts`)
8. Nav from `user.pageCodes`

## Public tenants

`GET /api/v1/public/tenants` drives the Users login hospital picker (tenantCode + city/state for location display).

## Dashboard charts

- `GET /api/v1/dashboard/patient-trends` (appointment :8103)
- `GET /api/v1/dashboard/new-patients-by-month` (patient :8101) — endpoint wired; chart currently prefers patient-trends

## Still optional / partial UI

- Payment link create UI on billing detail (API client ready)
- Platform hospital SMTP mail + PayU gateway config screens (API client ready)
- Invoice refund UI (API client ready)
- Full attendance / biometric device surfaces
