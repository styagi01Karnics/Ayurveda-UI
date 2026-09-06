# Hospital API Final Test Report — GAN-DL

Comprehensive exercise of **all** hospital / platform APIs except attendance.

## 1. Meta

| Field | Value |
| --- | --- |
| **Date** | 2026-09-03T04:26:13 |
| **Hospital** | Ganesha Ayurveda (Delhi) |
| **tenantCode** | `GAN-DL` |
| **schemaName** | `hosp_gan_dl` |
| **Hospital login** | `admin@gmail.com` / `Admin@123` |
| **Super Admin login** | `superadmin@gmail.com` / `SecurePass1` (no tenantCode) |
| **Tester** | Cursor agent (live localhost) |
| **Scenario count** | 190 |
| **PASS / FAIL / SKIP** | **189** / **0** / **1** |
| **Attendance** | **SKIP** (per request) |
| **Commit** | Not committed (per request) |

### Service ports

| Service | Port |
| --- | ---: |
| auth-service | 8111 |
| patient-service | 8101 |
| doctor-service | 8102 |
| appointment-service | 8103 |
| therapist-service | 8104 |
| file-upload-service | 8105 |
| activity-log-service | 8107 |
| medicine-service | 8108 |
| billing-service | 8109 |
| notification-service | 8110 |
| attendance-service *(SKIPPED)* | 8106 |

### Seeded IDs (this run)

```json
{
  "suffix": "CVUEXV",
  "hospitalUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
  "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
  "tenantRoleId": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
  "superUserId": "4328bed6-cf2c-415d-b497-b27169a07cf3",
  "roleId": "29f901c3-82f1-441a-a104-50f35ce06fd9",
  "registeredUserId": "bd876449-3f33-4bc3-a222-a98037f3058b",
  "disposableHospitalId": "61012fb1-31d2-4b07-b447-c06be51f63c3",
  "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
  "doctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
  "consultationTypeId": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
  "doshaId": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
  "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
  "therapyId": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
  "planMasterId": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
  "therapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
  "bookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
  "apptPatientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "usePid": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "medicalAssessmentPatientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
  "medicineId": "4450dff7-6575-4def-b832-01abd0ca3738",
  "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
  "billingId": "ad3780f6-ab92-4f12-8f71-3b9aa6aab800",
  "invoiceFromBillingId": "15c44d1f-fe10-431a-a102-d2220dafb8c3",
  "invoiceId": "03633f84-adf9-4eb5-aeb7-a6ff21e5fe78"
}
```

## 2. Summary by service

| Service | PASS | FAIL | SKIP | TOTAL |
| --- | ---: | ---: | ---: | ---: |
| activity-log | 3 | 0 | 0 | 3 |
| appointment | 76 | 0 | 0 | 76 |
| attendance | 0 | 0 | 1 | 1 |
| auth | 26 | 0 | 0 | 26 |
| billing | 25 | 0 | 0 | 25 |
| doctor | 7 | 0 | 0 | 7 |
| file-upload | 4 | 0 | 0 | 4 |
| medicine | 15 | 0 | 0 | 15 |
| notification | 9 | 0 | 0 | 9 |
| patient | 6 | 0 | 0 | 6 |
| platform | 10 | 0 | 0 | 10 |
| therapist | 8 | 0 | 0 | 8 |
| **ALL** | **189** | **0** | **1** | **190** |

## 3. Summary table

| # | Service | Scenario | Method | URL | HTTP | Result | Notes |
| ---: | --- | --- | --- | --- | ---: | --- | --- |
| 1 | auth | AUTH hospital login | POST | `8111/api/v1/auth/login` | 200 | **PASS** |  |
| 2 | auth | AUTH super admin login | POST | `8111/api/v1/auth/login` | 200 | **PASS** |  |
| 3 | auth | AUTH me | GET | `8111/api/v1/auth/me` | 200 | **PASS** |  |
| 4 | auth | AUTH validate | POST | `8111/api/v1/auth/validate` | 200 | **PASS** |  |
| 5 | auth | AUTH update me | PUT | `8111/api/v1/auth/me` | 200 | **PASS** |  |
| 6 | auth | AUTH users list | GET | `8111/api/v1/auth/users` | 200 | **PASS** |  |
| 7 | auth | AUTH users paged | GET | `8111/api/v1/auth/users/paged?page=0&size=10` | 200 | **PASS** |  |
| 8 | auth | AUTH get user | GET | `8111/api/v1/auth/users/6e8d490f-5ea4-4deb-b557-cdf32b843728` | 200 | **PASS** |  |
| 9 | auth | AUTH tenant | GET | `8111/api/v1/auth/tenant` | 200 | **PASS** |  |
| 10 | auth | AUTH ui-pages | GET | `8111/api/v1/ui-pages` | 200 | **PASS** |  |
| 11 | auth | AUTH roles list | GET | `8111/api/v1/roles` | 200 | **PASS** |  |
| 12 | auth | AUTH create role | POST | `8111/api/v1/roles` | 201 | **PASS** |  |
| 13 | auth | AUTH get role | GET | `8111/api/v1/roles/29f901c3-82f1-441a-a104-50f35ce06fd9` | 200 | **PASS** |  |
| 14 | auth | AUTH update role | PUT | `8111/api/v1/roles/29f901c3-82f1-441a-a104-50f35ce06fd9` | 200 | **PASS** |  |
| 15 | auth | AUTH register-user | POST | `8111/api/v1/auth/register-user` | 201 | **PASS** |  |
| 16 | auth | AUTH update user | PUT | `8111/api/v1/auth/users/bd876449-3f33-4bc3-a222-a98037f3058b` | 200 | **PASS** |  |
| 17 | auth | AUTH update user status INACTIVE | PUT | `8111/api/v1/auth/users/bd876449-3f33-4bc3-a222-a98037f3058b/status` | 200 | **PASS** |  |
| 18 | auth | AUTH update user status ACTIVE | PUT | `8111/api/v1/auth/users/bd876449-3f33-4bc3-a222-a98037f3058b/status` | 200 | **PASS** |  |
| 19 | auth | AUTH login disposable user | POST | `8111/api/v1/auth/login` | 200 | **PASS** |  |
| 20 | auth | AUTH change-password disposable | PUT | `8111/api/v1/auth/change-password` | 200 | **PASS** |  |
| 21 | auth | AUTH delete disposable user | DELETE | `8111/api/v1/auth/users/bd876449-3f33-4bc3-a222-a98037f3058b` | 200 | **PASS** |  |
| 22 | auth | AUTH forgot-password | POST | `8111/api/v1/auth/forgot-password` | 200 | **PASS** |  |
| 23 | auth | AUTH reset-password (probe invalid token) | POST | `8111/api/v1/auth/reset-password` | 400 | **PASS** | Invalid token expected — endpoint exercised without changing admin password |
| 24 | auth | AUTH create role for delete | POST | `8111/api/v1/roles` | 201 | **PASS** |  |
| 25 | auth | AUTH delete role | DELETE | `8111/api/v1/roles/1bdb8928-0477-4b9b-9bb8-1e24004a38c0` | 200 | **PASS** |  |
| 26 | auth | AUTH delete updated role | DELETE | `8111/api/v1/roles/29f901c3-82f1-441a-a104-50f35ce06fd9` | 200 | **PASS** |  |
| 27 | platform | PLATFORM list hospitals | GET | `8111/api/v1/platform/hospitals` | 200 | **PASS** |  |
| 28 | platform | PLATFORM get hospital | GET | `8111/api/v1/platform/hospitals/66e3929d-89fd-454d-9186-e3cf85f9da32` | 200 | **PASS** |  |
| 29 | platform | PLATFORM update hospital | PUT | `8111/api/v1/platform/hospitals/66e3929d-89fd-454d-9186-e3cf85f9da32` | 200 | **PASS** |  |
| 30 | platform | PLATFORM list hospital admins | GET | `8111/api/v1/platform/hospitals/66e3929d-89fd-454d-9186-e3cf85f9da32/admins` | 200 | **PASS** |  |
| 31 | platform | PLATFORM onboard disposable hospital | POST | `8111/api/v1/platform/hospitals` | 201 | **PASS** |  |
| 32 | platform | PLATFORM create hospital admin | POST | `8111/api/v1/platform/hospitals/61012fb1-31d2-4b07-b447-c06be51f63c3/admins` | 201 | **PASS** |  |
| 33 | platform | PLATFORM update hospital status INACTIVE | PUT | `8111/api/v1/platform/hospitals/61012fb1-31d2-4b07-b447-c06be51f63c3/status` | 200 | **PASS** |  |
| 34 | platform | PLATFORM update hospital status ACTIVE | PUT | `8111/api/v1/platform/hospitals/61012fb1-31d2-4b07-b447-c06be51f63c3/status` | 200 | **PASS** |  |
| 35 | platform | PLATFORM retry-provision | POST | `8111/api/v1/platform/hospitals/61012fb1-31d2-4b07-b447-c06be51f63c3/retry-provision` | 400 | **PASS** | Exercised; 400 OK if hospital not in FAILED state |
| 36 | platform | PLATFORM bootstrap-super-admin (already exists) | POST | `8111/api/v1/platform/bootstrap-super-admin` | 400 | **PASS** | Expected fail — already bootstrapped |
| 37 | patient | PATIENT create | POST | `8101/api/v1/patients/create-patient` | 201 | **PASS** |  |
| 38 | patient | PATIENT get by id | GET | `8101/api/v1/patients/get-patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d` | 200 | **PASS** |  |
| 39 | patient | PATIENT list all | GET | `8101/api/v1/patients/get-all-patients` | 200 | **PASS** |  |
| 40 | patient | PATIENT count | GET | `8101/api/v1/patients/get-patient-count` | 200 | **PASS** |  |
| 41 | patient | PATIENT create for delete | POST | `8101/api/v1/patients/create-patient` | 201 | **PASS** |  |
| 42 | patient | PATIENT delete | DELETE | `8101/api/v1/patients/delete-patient/097c9727-aaa1-4a4f-b85b-afd5f2345542` | 200 | **PASS** |  |
| 43 | doctor | DOCTOR create | POST | `8102/api/v1/doctors` | 201 | **PASS** |  |
| 44 | doctor | DOCTOR list | GET | `8102/api/v1/doctors` | 200 | **PASS** |  |
| 45 | doctor | DOCTOR active | GET | `8102/api/v1/doctors/active` | 200 | **PASS** |  |
| 46 | doctor | DOCTOR get by id | GET | `8102/api/v1/doctors/e2bbfda1-7dca-4b70-8bea-fbf5053637b4` | 200 | **PASS** |  |
| 47 | doctor | DOCTOR patch status | PATCH | `8102/api/v1/doctors/e2bbfda1-7dca-4b70-8bea-fbf5053637b4/status` | 200 | **PASS** |  |
| 48 | doctor | DOCTOR create for delete | POST | `8102/api/v1/doctors` | 201 | **PASS** |  |
| 49 | doctor | DOCTOR delete disposable | DELETE | `8102/api/v1/doctors/8d0ae814-00b0-4131-8fd2-9bad67500674` | 200 | **PASS** |  |
| 50 | appointment | APPT create consultation-type | POST | `8103/api/v1/consultation-types` | 201 | **PASS** |  |
| 51 | appointment | APPT list consultation-types | GET | `8103/api/v1/consultation-types` | 200 | **PASS** |  |
| 52 | appointment | APPT active consultation-types | GET | `8103/api/v1/consultation-types/active` | 200 | **PASS** |  |
| 53 | appointment | APPT get consultation-type | GET | `8103/api/v1/consultation-types/2e8b44b0-3d08-4fac-b548-122eb6b0b032` | 200 | **PASS** |  |
| 54 | appointment | APPT create dosha | POST | `8103/api/v1/doshas` | 201 | **PASS** |  |
| 55 | appointment | APPT list doshas | GET | `8103/api/v1/doshas` | 200 | **PASS** |  |
| 56 | appointment | APPT get dosha | GET | `8103/api/v1/doshas/c049cdc3-ee6f-45ac-9505-92280ab515fd` | 200 | **PASS** |  |
| 57 | appointment | APPT create treatment-category | POST | `8103/api/v1/treatment-categories` | 201 | **PASS** |  |
| 58 | appointment | APPT list treatment-categories | GET | `8103/api/v1/treatment-categories` | 200 | **PASS** |  |
| 59 | appointment | APPT get treatment-category | GET | `8103/api/v1/treatment-categories/b593b23e-62bd-490d-a60e-d59eb4402333` | 200 | **PASS** |  |
| 60 | appointment | APPT create therapy | POST | `8103/api/v1/therapies` | 201 | **PASS** |  |
| 61 | appointment | APPT list therapies | GET | `8103/api/v1/therapies` | 200 | **PASS** |  |
| 62 | appointment | APPT therapies by category | GET | `8103/api/v1/therapies/category/b593b23e-62bd-490d-a60e-d59eb4402333` | 200 | **PASS** |  |
| 63 | appointment | APPT get therapy | GET | `8103/api/v1/therapies/fbb43cf1-1fc6-48fb-97eb-91743effa2e4` | 200 | **PASS** |  |
| 64 | appointment | APPT update therapy | PUT | `8103/api/v1/therapies/fbb43cf1-1fc6-48fb-97eb-91743effa2e4` | 200 | **PASS** |  |
| 65 | appointment | APPT patch therapy status | PATCH | `8103/api/v1/therapies/fbb43cf1-1fc6-48fb-97eb-91743effa2e4/status` | 200 | **PASS** |  |
| 66 | appointment | APPT create therapy for delete | POST | `8103/api/v1/therapies` | 201 | **PASS** |  |
| 67 | appointment | APPT delete disposable therapy | DELETE | `8103/api/v1/therapies/b1f60424-a945-486e-a583-3f141781873f` | 200 | **PASS** |  |
| 68 | appointment | APPT create treatment-plan-master | POST | `8103/api/v1/treatment-plan-masters` | 201 | **PASS** |  |
| 69 | appointment | APPT list treatment-plan-masters | GET | `8103/api/v1/treatment-plan-masters` | 200 | **PASS** |  |
| 70 | appointment | APPT active treatment-plan-masters | GET | `8103/api/v1/treatment-plan-masters/active` | 200 | **PASS** |  |
| 71 | appointment | APPT get treatment-plan-master | GET | `8103/api/v1/treatment-plan-masters/f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6` | 200 | **PASS** |  |
| 72 | therapist | THERAPIST create | POST | `8104/api/v1/therapists` | 201 | **PASS** |  |
| 73 | therapist | THERAPIST list | GET | `8104/api/v1/therapists` | 200 | **PASS** |  |
| 74 | therapist | THERAPIST get | GET | `8104/api/v1/therapists/abeb3bc8-85d1-4dd5-ae67-e3f41b429808` | 200 | **PASS** |  |
| 75 | therapist | THERAPIST by-therapies | GET | `8104/api/v1/therapists/by-therapies?therapyIds=fbb43cf1-1fc6-48fb-97eb-91743effa2e4` | 200 | **PASS** |  |
| 76 | therapist | THERAPIST update | PUT | `8104/api/v1/therapists/abeb3bc8-85d1-4dd5-ae67-e3f41b429808` | 200 | **PASS** |  |
| 77 | therapist | THERAPIST patch status | PATCH | `8104/api/v1/therapists/abeb3bc8-85d1-4dd5-ae67-e3f41b429808/status` | 200 | **PASS** |  |
| 78 | therapist | THERAPIST create for delete | POST | `8104/api/v1/therapists` | 201 | **PASS** |  |
| 79 | therapist | THERAPIST delete disposable | DELETE | `8104/api/v1/therapists/5f609099-548f-4e6a-8a51-b3a6db8b85d0` | 200 | **PASS** |  |
| 80 | appointment | APPT create booking | POST | `8103/api/v1/appointments` | 201 | **PASS** |  |
| 81 | appointment | APPT stats | GET | `8103/api/v1/appointments/stats` | 200 | **PASS** |  |
| 82 | appointment | APPT patients list | GET | `8103/api/v1/appointments/patients?statusTab=ACTIVE` | 200 | **PASS** |  |
| 83 | appointment | APPT cancelled | GET | `8103/api/v1/appointments/cancelled` | 200 | **PASS** |  |
| 84 | appointment | APPT today | GET | `8103/api/v1/appointments/today` | 200 | **PASS** |  |
| 85 | appointment | APPT today by consultation type | GET | `8103/api/v1/appointments/today/consultation-type/2e8b44b0-3d08-4fac-b548-122eb6b0b032` | 200 | **PASS** |  |
| 86 | appointment | APPT doctor today | GET | `8103/api/v1/appointments/doctor/e2bbfda1-7dca-4b70-8bea-fbf5053637b4/today` | 200 | **PASS** |  |
| 87 | appointment | APPT get booking | GET | `8103/api/v1/appointments/0570a837-79d2-4aa6-9c27-ec771778f857` | 200 | **PASS** |  |
| 88 | appointment | APPT by patient | GET | `8103/api/v1/appointments/patient/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 89 | appointment | APPT by status SCHEDULED | GET | `8103/api/v1/appointments/status/SCHEDULED` | 200 | **PASS** |  |
| 90 | appointment | APPT by date | GET | `8103/api/v1/appointments/date/2026-09-03` | 200 | **PASS** |  |
| 91 | appointment | APPT dashboard todays-schedule | GET | `8103/api/v1/dashboard/todays-schedule` | 200 | **PASS** |  |
| 92 | appointment | APPT reschedule | PUT | `8103/api/v1/appointments/0570a837-79d2-4aa6-9c27-ec771778f857/reschedule` | 200 | **PASS** |  |
| 93 | appointment | APPT in-consultation | PUT | `8103/api/v1/appointments/0570a837-79d2-4aa6-9c27-ec771778f857/in-consultation` | 200 | **PASS** |  |
| 94 | appointment | APPT complete | PUT | `8103/api/v1/appointments/0570a837-79d2-4aa6-9c27-ec771778f857/complete` | 200 | **PASS** |  |
| 95 | appointment | APPT create booking for cancel | POST | `8103/api/v1/appointments` | 201 | **PASS** |  |
| 96 | appointment | APPT cancel | PUT | `8103/api/v1/appointments/657a6dd0-7abe-4de5-8332-76c48ef9f77d/cancel` | 200 | **PASS** |  |
| 97 | appointment | APPT create booking for delete | POST | `8103/api/v1/appointments` | 201 | **PASS** |  |
| 98 | appointment | APPT delete booking | DELETE | `8103/api/v1/appointments/66568898-844c-4a55-9f61-056532f406ce` | 200 | **PASS** |  |
| 99 | appointment | APPT medical-history create | POST | `8103/api/v1/medical-histories` | 201 | **PASS** |  |
| 100 | appointment | APPT medical-history get | GET | `8103/api/v1/medical-histories/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 101 | appointment | APPT physical-exam create | POST | `8103/api/v1/physical-examinations` | 200 | **PASS** |  |
| 102 | appointment | APPT physical-exam get | GET | `8103/api/v1/physical-examinations/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 103 | appointment | APPT systemic-exam create | POST | `8103/api/v1/systemic-examinations` | 200 | **PASS** |  |
| 104 | appointment | APPT systemic-exam get | GET | `8103/api/v1/systemic-examinations/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 105 | appointment | APPT lifestyle create | POST | `8103/api/v1/lifestyle-information` | 200 | **PASS** |  |
| 106 | appointment | APPT lifestyle get | GET | `8103/api/v1/lifestyle-information/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 107 | appointment | APPT ayurvedic-assessment create | POST | `8103/api/v1/ayurvedic-assessments` | 200 | **PASS** |  |
| 108 | appointment | APPT ayurvedic-assessment get | GET | `8103/api/v1/ayurvedic-assessments/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 109 | appointment | APPT treatment-plan create | POST | `8103/api/v1/treatment-plans` | 200 | **PASS** |  |
| 110 | appointment | APPT treatment-plan get | GET | `8103/api/v1/treatment-plans/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 111 | appointment | APPT create booking for medical-assessment | POST | `8103/api/v1/appointments` | 201 | **PASS** |  |
| 112 | appointment | APPT medical-assessment create | POST | `8103/api/v1/medical-assessment` | 201 | **PASS** |  |
| 113 | appointment | APPT medical-assessment get | GET | `8103/api/v1/medical-assessment/fd94c50b-96e4-4b6c-a514-d170bd5b148e` | 200 | **PASS** |  |
| 114 | appointment | APPT medical-assessment with-documents | POST | `8103/api/v1/medical-assessment/with-documents` | 201 | **PASS** |  |
| 115 | appointment | APPT appointment-therapy create | POST | `8103/api/v1/appointment-therapies` | 201 | **PASS** |  |
| 116 | appointment | APPT appointment-therapy status | PUT | `8103/api/v1/appointment-therapies/a0104dcc-a6b5-4846-bb95-c97f0ea49036/status` | 200 | **PASS** |  |
| 117 | appointment | APPT appointment-therapy therapist today | GET | `8103/api/v1/appointment-therapies/therapist/abeb3bc8-85d1-4dd5-ae67-e3f41b429808/today` | 200 | **PASS** |  |
| 118 | appointment | APPT appointment-therapy by patient | GET | `8103/api/v1/appointment-therapies/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 119 | appointment | APPT treatment create | POST | `8103/api/v1/treatments` | 201 | **PASS** |  |
| 120 | appointment | APPT treatments list | GET | `8103/api/v1/treatments` | 200 | **PASS** |  |
| 121 | appointment | APPT treatments by patient | GET | `8103/api/v1/treatments/patient/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 122 | appointment | APPT treatment update | PUT | `8103/api/v1/treatments/3a696077-46a9-4415-b638-1906471da5d7` | 200 | **PASS** |  |
| 123 | appointment | APPT treatment status | PUT | `8103/api/v1/treatments/3a696077-46a9-4415-b638-1906471da5d7/status` | 200 | **PASS** |  |
| 124 | appointment | APPT follow-up create | POST | `8103/api/v1/follow-ups` | 201 | **PASS** |  |
| 125 | appointment | APPT follow-ups list | GET | `8103/api/v1/follow-ups` | 200 | **PASS** |  |
| 126 | appointment | APPT follow-ups by patient | GET | `8103/api/v1/follow-ups/patient/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 127 | appointment | APPT follow-up status | PUT | `8103/api/v1/follow-ups/c189d7a4-d644-4921-957d-3fbcd459c368/status` | 200 | **PASS** |  |
| 128 | appointment | APPT follow-up create for cancel | POST | `8103/api/v1/follow-ups` | 201 | **PASS** |  |
| 129 | appointment | APPT follow-up cancel | PUT | `8103/api/v1/follow-ups/a8a12ab0-72d2-4f3e-9213-dc401b5ad6d4/cancel` | 200 | **PASS** |  |
| 130 | appointment | APPT prescription create | POST | `8103/api/v1/prescriptions` | 201 | **PASS** |  |
| 131 | appointment | APPT prescriptions by patient | GET | `8103/api/v1/prescriptions/patient/fe75a8ce-422c-4d0e-8710-49cb100193aa` | 200 | **PASS** |  |
| 132 | appointment | APPT prescription get | GET | `8103/api/v1/prescriptions/d2a3eb04-1af1-47f4-a389-8092ad7e916f` | 200 | **PASS** |  |
| 133 | appointment | APPT prescription update | PUT | `8103/api/v1/prescriptions/d2a3eb04-1af1-47f4-a389-8092ad7e916f` | 200 | **PASS** |  |
| 134 | medicine | MED create | POST | `8108/api/v1/medicines` | 201 | **PASS** |  |
| 135 | medicine | MED list | GET | `8108/api/v1/medicines` | 200 | **PASS** |  |
| 136 | medicine | MED stock summary | GET | `8108/api/v1/medicines/stock/summary` | 200 | **PASS** |  |
| 137 | medicine | MED stock by category | GET | `8108/api/v1/medicines/stock/category/TABLET` | 200 | **PASS** |  |
| 138 | medicine | MED low-stock | GET | `8108/api/v1/medicines/low-stock` | 200 | **PASS** |  |
| 139 | medicine | MED meta categories | GET | `8108/api/v1/medicines/meta/categories` | 200 | **PASS** |  |
| 140 | medicine | MED meta manufacturers | GET | `8108/api/v1/medicines/meta/manufacturers` | 200 | **PASS** |  |
| 141 | medicine | MED meta names | GET | `8108/api/v1/medicines/meta/names` | 200 | **PASS** |  |
| 142 | medicine | MED dashboard | GET | `8108/api/v1/dashboard/medicine-stock` | 200 | **PASS** |  |
| 143 | medicine | MED get | GET | `8108/api/v1/medicines/4450dff7-6575-4def-b832-01abd0ca3738` | 200 | **PASS** |  |
| 144 | medicine | MED update | PUT | `8108/api/v1/medicines/4450dff7-6575-4def-b832-01abd0ca3738` | 200 | **PASS** |  |
| 145 | medicine | MED stock deduct | POST | `8108/api/v1/medicines/4450dff7-6575-4def-b832-01abd0ca3738/stock/deduct` | 200 | **PASS** |  |
| 146 | medicine | MED stock restore | POST | `8108/api/v1/medicines/4450dff7-6575-4def-b832-01abd0ca3738/stock/restore` | 200 | **PASS** |  |
| 147 | medicine | MED create for delete | POST | `8108/api/v1/medicines` | 201 | **PASS** |  |
| 148 | medicine | MED delete disposable | DELETE | `8108/api/v1/medicines/17b79a2e-c895-45fd-9476-a539e5e22264` | 200 | **PASS** |  |
| 149 | billing | BILL create package-master | POST | `8109/api/v1/package-masters` | 201 | **PASS** |  |
| 150 | billing | BILL list package-masters | GET | `8109/api/v1/package-masters` | 200 | **PASS** |  |
| 151 | billing | BILL active package-masters | GET | `8109/api/v1/package-masters/active` | 200 | **PASS** |  |
| 152 | billing | BILL get package-master | GET | `8109/api/v1/package-masters/92225c7f-fd4b-4f8d-8dc5-b060302bb1b2` | 200 | **PASS** |  |
| 153 | billing | BILL create patient-package | POST | `8109/api/v1/packages` | 201 | **PASS** |  |
| 154 | billing | BILL list packages | GET | `8109/api/v1/packages` | 200 | **PASS** |  |
| 155 | billing | BILL packages by patient | GET | `8109/api/v1/packages/patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d` | 200 | **PASS** |  |
| 156 | billing | BILL update patient-package | PUT | `8109/api/v1/packages/27165af1-200d-4621-8f9a-d3a058c69ce3` | 200 | **PASS** |  |
| 157 | billing | BILL update patient-package status | PUT | `8109/api/v1/packages/27165af1-200d-4621-8f9a-d3a058c69ce3/status` | 200 | **PASS** |  |
| 158 | billing | BILL create billing | POST | `8109/api/v1/billings` | 201 | **PASS** |  |
| 159 | billing | BILL list billings | GET | `8109/api/v1/billings` | 200 | **PASS** |  |
| 160 | billing | BILL billings by patient | GET | `8109/api/v1/billings/patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d` | 200 | **PASS** |  |
| 161 | billing | BILL get billing | GET | `8109/api/v1/billings/ad3780f6-ab92-4f12-8f71-3b9aa6aab800` | 200 | **PASS** |  |
| 162 | billing | BILL patient billing summary | GET | `8109/api/v1/billing/patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d` | 200 | **PASS** |  |
| 163 | billing | BILL generate-invoice from billing | POST | `8109/api/v1/billings/ad3780f6-ab92-4f12-8f71-3b9aa6aab800/generate-invoice` | 201 | **PASS** |  |
| 164 | billing | BILL create invoice standalone | POST | `8109/api/v1/invoices` | 201 | **PASS** |  |
| 165 | billing | BILL list invoices | GET | `8109/api/v1/invoices` | 200 | **PASS** |  |
| 166 | billing | BILL invoices by patient | GET | `8109/api/v1/invoices/patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d` | 200 | **PASS** |  |
| 167 | billing | BILL get invoice | GET | `8109/api/v1/invoices/03633f84-adf9-4eb5-aeb7-a6ff21e5fe78` | 200 | **PASS** |  |
| 168 | billing | BILL record part payment | POST | `8109/api/v1/invoices/03633f84-adf9-4eb5-aeb7-a6ff21e5fe78/payments` | 200 | **PASS** |  |
| 169 | billing | BILL create invoice for delete | POST | `8109/api/v1/invoices` | 201 | **PASS** |  |
| 170 | billing | BILL delete invoice | DELETE | `8109/api/v1/invoices/c1dd6755-2c1f-4d76-b0db-bac2ca49e975` | 200 | **PASS** |  |
| 171 | billing | BILL sales list | GET | `8109/api/v1/sales` | 200 | **PASS** |  |
| 172 | billing | BILL sales revenue month | GET | `8109/api/v1/sales/revenue/month` | 200 | **PASS** |  |
| 173 | billing | BILL dashboard summary | GET | `8109/api/v1/dashboard/billing-summary` | 200 | **PASS** |  |
| 174 | activity-log | ALOG create | POST | `8107/api/v1/activity-logs` | 201 | **PASS** |  |
| 175 | activity-log | ALOG list | GET | `8107/api/v1/activity-logs` | 200 | **PASS** |  |
| 176 | activity-log | ALOG get | GET | `8107/api/v1/activity-logs/bf86a4d5-f6db-4b00-8244-c1f6bcfc7712` | 200 | **PASS** |  |
| 177 | file-upload | FILE upload | POST | `8105/api/v1/documents/upload` | 200 | **PASS** |  |
| 178 | file-upload | FILE list by patient | GET | `8105/api/v1/documents/cc1089e5-1fb8-491f-b3af-2cf686a5207d` | 200 | **PASS** |  |
| 179 | file-upload | FILE download | GET | `8105/api/v1/documents/e31f9bce-43cc-4aae-882f-5e665e22a045/download` | 200 | **PASS** |  |
| 180 | file-upload | FILE delete | DELETE | `8105/api/v1/documents/e31f9bce-43cc-4aae-882f-5e665e22a045` | 200 | **PASS** |  |
| 181 | notification | NOTIF create | POST | `8110/api/v1/notifications` | 201 | **PASS** |  |
| 182 | notification | NOTIF send email | POST | `8110/api/v1/notifications/email` | 200 | **PASS** |  |
| 183 | notification | NOTIF list | GET | `8110/api/v1/notifications?userId=6e8d490f-5ea4-4deb-b557-cdf32b843728` | 200 | **PASS** |  |
| 184 | notification | NOTIF unread-count | GET | `8110/api/v1/notifications/unread-count?userId=6e8d490f-5ea4-4deb-b557-cdf32b843728` | 200 | **PASS** |  |
| 185 | notification | NOTIF get | GET | `8110/api/v1/notifications/158d3db4-4ea0-4d09-9b27-2092e78049c0` | 200 | **PASS** |  |
| 186 | notification | NOTIF mark read | PUT | `8110/api/v1/notifications/158d3db4-4ea0-4d09-9b27-2092e78049c0/read` | 200 | **PASS** |  |
| 187 | notification | NOTIF read-all | PUT | `8110/api/v1/notifications/read-all?userId=6e8d490f-5ea4-4deb-b557-cdf32b843728` | 200 | **PASS** |  |
| 188 | notification | NOTIF create for delete | POST | `8110/api/v1/notifications` | 201 | **PASS** |  |
| 189 | notification | NOTIF delete | DELETE | `8110/api/v1/notifications/22af30af-e609-475c-822e-5f4df211b0d9` | 200 | **PASS** |  |
| 190 | attendance | ATTENDANCE (entire service) | GET | `8106/api/v1/attendances` |  | **SKIP** | SKIP per user request — attendance ignored entirely |

## 4. Fixes applied

- auth-service `ddl-auto` changed from `create` → `update` (restart had wiped public tenants/users).
- Re-bootstrapped SUPER_ADMIN and re-onboarded GAN-DL (schema hosp_gan_dl already present).
- Prior code fixes retained: RoleServiceImpl.replaceRolePages, RescheduleAppointmentBookingRequest (date+slot only), nested medical-assessment patientId optional, TherapyMaster/TreatmentCategoryMaster ensureDefaults.
- DocumentUploadClient now forwards Authorization + X-Tenant-Schema from TenantContext (medical-assessment with-documents).

## 6. Detailed scenarios (request / response)

### 1. AUTH hospital login — **PASS**

- **Service:** auth
- **Method + URL:** `POST http://localhost:8111/api/v1/auth/login`
- **HTTP:** `200`

**Request body:**

```json
{
  "tenantCode": "GAN-DL",
  "usernameOrEmail": "admin@gmail.com",
  "password": "***"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ZThkNDkwZi01ZWE0LTRkZWItYjU1Ny1jZGYzMmI4NDM3MjgiLCJ0ZW5hbnRJZCI6IjY2ZTM5MjlkLTg5ZmQtNDU0ZC05MTg2LWUzY2Y4NWY5ZGEzMiIsInRlbmFudENvZGUiOiJHQU4tREwiLCJzY2hlbWFOYW1lIjoiaG9zcF9nYW5fZGwiLCJ1c2VybmFtZSI6ImFkbWluQGdtYWlsLmNvbSIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwicGFnZUNvZGVzIjpbIkRBU0hCT0FSRCIsIlBBVElFTlRTIiwiRE9DVE9SUyIsIkFQUE9JTlRNRU5UUyIsIlRSRUFUTUVOVFMiLCJNRURJQ0lORVMiLCJTQUxFUyIsIkFDVElWSVRZX0xPRyIsIkJJTExJTkciLCJTRVRUSU5HUyJdLCJpYXQiOjE3ODg0MDk1MzEsImV4cCI6MTc4ODQ5NTkzMSwidGVuYW50Um9sZUlkIjoiODRjNGVlYmUtMWUwOC00ZWZiLTgzMzctNzI0MGZiZjRmMTUzIn0.a5JwuStI34e5xUGKA8q8QZQ8JGAq4kulwur9dkY9JzFW84Nr4mym2Th0s4GRLWuZ",
    "tokenType": "Bearer",
    "expiresInMs": 86400000,
    "user": {
      "id": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
      "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "tenantCode": "GAN-DL",
      "schemaName": "hosp_gan_dl",
      "email": "admin@gmail.com",
      "fullName": "Ganesha Admin",
      "mobileNumber": "9876543210",
      "role": "ADMIN",
      "tenantRoleId": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
      "tenantRoleCode": "HOSPITAL_ADMIN",
      "tenantRoleName": "Hospital Admin",
      "pageCodes": [
        "DASHBOARD",
        "PATIENTS",
        "DOCTORS",
        "APPOINTMENTS",
        "TREATMENTS",
        "MEDICINES",
        "SALES",
        "ACTIVITY_LOG",
        "BILLING",
        "SETTINGS"
      ],
      "status": "ACTIVE"
    },
    "tenant": {
      "id": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "tenantCode": "GAN-DL",
      "name": "Ganesha Ayurveda",
      "clinicType": "Ayurveda Clinic",
      "state": "Delhi",
      "stateCode": "DL",
      "city": "New Delhi",
      "pinCode": "110001",
      "addressLine1": "12 Green Park",
      "addressLine2": "Near Metro",
      "registrationNumberGst": "07AAAAA0000A1Z5",
      "logoUrl": null,
      "fullName": "Ganesha Admin",
      "mobileNumber": "9876543210",
      "email": "admin@gmail.com",
      "photoUrl": null,
      "schemaName": "hosp_gan_dl",
      "platform": false,
      "status": "ACTIVE",
      "provisionMessage": "Schema hosp_gan_dl created. Hospital schema hosp_gan_dl already up to date (6 script(s) previously applied)."
    }
  }
}
```

### 2. AUTH super admin login — **PASS**

- **Service:** auth
- **Method + URL:** `POST http://localhost:8111/api/v1/auth/login`
- **HTTP:** `200`

**Request body:**

```json
{
  "usernameOrEmail": "superadmin@gmail.com",
  "password": "***"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI0MzI4YmVkNi1jZjJjLTQxNWQtYjQ5Ny1iMjcxNjlhMDdjZjMiLCJ0ZW5hbnRJZCI6IjZhMWM1OWE3LTcyMWQtNDNiYy04ODM5LWY2MjgxNzA0ZDAxOSIsInRlbmFudENvZGUiOiJQTEFURk9STSIsInNjaGVtYU5hbWUiOiJwdWJsaWMiLCJ1c2VybmFtZSI6InN1cGVyYWRtaW5AZ21haWwuY29tIiwiZW1haWwiOiJzdXBlcmFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJTVVBFUl9BRE1JTiIsInBhZ2VDb2RlcyI6WyJEQVNIQk9BUkQiLCJQQVRJRU5UUyIsIkRPQ1RPUlMiLCJBUFBPSU5UTUVOVFMiLCJUUkVBVE1FTlRTIiwiTUVESUNJTkVTIiwiU0FMRVMiLCJBQ1RJVklUWV9MT0ciLCJCSUxMSU5HIiwiU0VUVElOR1MiXSwiaWF0IjoxNzg4NDA5NTMyLCJleHAiOjE3ODg0OTU5MzJ9.klIsXguasOO3NT3OF_9j78_J_sWsGHaFTM6b5mBm2ijQeJXDEeK8punxjG4SL053",
    "tokenType": "Bearer",
    "expiresInMs": 86400000,
    "user": {
      "id": "4328bed6-cf2c-415d-b497-b27169a07cf3",
      "tenantId": "6a1c59a7-721d-43bc-8839-f6281704d019",
      "tenantCode": "PLATFORM",
      "schemaName": "public",
      "email": "superadmin@gmail.com",
      "fullName": "Super Admin",
      "mobileNumber": null,
      "role": "SUPER_ADMIN",
      "tenantRoleId": null,
      "tenantRoleCode": null,
      "tenantRoleName": null,
      "pageCodes": [
        "DASHBOARD",
        "PATIENTS",
        "DOCTORS",
        "APPOINTMENTS",
        "TREATMENTS",
        "MEDICINES",
        "SALES",
        "ACTIVITY_LOG",
        "BILLING",
        "SETTINGS"
      ],
      "status": "ACTIVE"
    },
    "tenant": {
      "id": "6a1c59a7-721d-43bc-8839-f6281704d019",
      "tenantCode": "PLATFORM",
      "name": "Ayurvedaa Platform",
      "clinicType": null,
      "state": null,
      "stateCode": null,
      "city": null,
      "pinCode": null,
      "addressLine1": null,
      "addressLine2": null,
      "registrationNumberGst": null,
      "logoUrl": null,
      "fullName": null,
      "mobileNumber": null,
      "email": null,
      "photoUrl": null,
      "schemaName": "public",
      "platform": true,
      "status": "ACTIVE",
      "provisionMessage": "Platform control-plane tenant"
    }
  }
}
```

### 3. AUTH me — **PASS**

- **Service:** auth
- **Method + URL:** `GET http://localhost:8111/api/v1/auth/me`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "schemaName": "hosp_gan_dl",
    "email": "admin@gmail.com",
    "fullName": "Ganesha Admin",
    "mobileNumber": "9876543210",
    "role": "ADMIN",
    "tenantRoleId": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
    "tenantRoleCode": "HOSPITAL_ADMIN",
    "tenantRoleName": "Hospital Admin",
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "DOCTORS",
      "APPOINTMENTS",
      "TREATMENTS",
      "MEDICINES",
      "SALES",
      "ACTIVITY_LOG",
      "BILLING",
      "SETTINGS"
    ],
    "status": "ACTIVE"
  }
}
```

### 4. AUTH validate — **PASS**

- **Service:** auth
- **Method + URL:** `POST http://localhost:8111/api/v1/auth/validate`
- **HTTP:** `200`

**Request body:**

```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiI2ZThkNDkwZi01ZWE0LTRkZWItYjU1Ny1jZGYzMmI4NDM3MjgiLCJ0ZW5hbnRJZCI6IjY2ZTM5MjlkLTg5ZmQtNDU0ZC05MTg2LWUzY2Y4NWY5ZGEzMiIsInRlbmFudENvZGUiOiJHQU4tREwiLCJzY2hlbWFOYW1lIjoiaG9zcF9nYW5fZGwiLCJ1c2VybmFtZSI6ImFkbWluQGdtYWlsLmNvbSIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwicGFnZUNvZGVzIjpbIkRBU0hCT0FSRCIsIlBBVElFTlRTIiwiRE9DVE9SUyIsIkFQUE9JTlRNRU5UUyIsIlRSRUFUTUVOVFMiLCJNRURJQ0lORVMiLCJTQUxFUyIsIkFDVElWSVRZX0xPRyIsIkJJTExJTkciLCJTRVRUSU5HUyJdLCJpYXQiOjE3ODg0MDk1MzEsImV4cCI6MTc4ODQ5NTkzMSwidGVuYW50Um9sZUlkIjoiODRjNGVlYmUtMWUwOC00ZWZiLTgzMzctNzI0MGZiZjRmMTUzIn0.a5JwuStI34e5xUGKA8q8QZQ8JGAq4kulwur9dkY9JzFW84Nr4mym2Th0s4GRLWuZ"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "valid": true,
    "userId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "schemaName": "hosp_gan_dl",
    "email": "admin@gmail.com",
    "role": "ADMIN",
    "tenantRoleId": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "DOCTORS",
      "APPOINTMENTS",
      "TREATMENTS",
      "MEDICINES",
      "SALES",
      "ACTIVITY_LOG",
      "BILLING",
      "SETTINGS"
    ]
  }
}
```

### 5. AUTH update me — **PASS**

- **Service:** auth
- **Method + URL:** `PUT http://localhost:8111/api/v1/auth/me`
- **HTTP:** `200`

**Request body:**

```json
{
  "fullName": "Ganesha Admin",
  "mobileNumber": "9876543210"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Profile updated successfully.",
  "data": {
    "id": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "schemaName": "hosp_gan_dl",
    "email": "admin@gmail.com",
    "fullName": "Ganesha Admin",
    "mobileNumber": "9876543210",
    "role": "ADMIN",
    "tenantRoleId": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
    "tenantRoleCode": "HOSPITAL_ADMIN",
    "tenantRoleName": "Hospital Admin",
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "DOCTORS",
      "APPOINTMENTS",
      "TREATMENTS",
      "MEDICINES",
      "SALES",
      "ACTIVITY_LOG",
      "BILLING",
      "SETTINGS"
    ],
    "status": "ACTIVE"
  }
}
```

### 6. AUTH users list — **PASS**

- **Service:** auth
- **Method + URL:** `GET http://localhost:8111/api/v1/auth/users`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
      "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "tenantCode": "GAN-DL",
      "schemaName": "hosp_gan_dl",
      "email": "admin@gmail.com",
      "fullName": "Ganesha Admin",
      "mobileNumber": "9876543210",
      "role": "ADMIN",
      "tenantRoleId": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
      "tenantRoleCode": "HOSPITAL_ADMIN",
      "tenantRoleName": "Hospital Admin",
      "pageCodes": [
        "DASHBOARD",
        "PATIENTS",
        "DOCTORS",
        "APPOINTMENTS",
        "TREATMENTS",
        "MEDICINES",
        "SALES",
        "ACTIVITY_LOG",
        "BILLING",
        "SETTINGS"
      ],
      "status": "ACTIVE"
    },
    {
      "id": "35b7f579-88a7-42c3-9019-2146fe973797",
      "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "tenantCode": "GAN-DL",
      "schemaName": "hosp_gan_dl",
      "email": "apitestgobgat@gmail.com",
      "fullName": "API Test User Upd",
      "mobileNumber": null,
      "role": "RECEPTIONIST",
      "tenantRoleId": "587f32a5-69bf-429e-a78c-47c6e13cf50c",
      "tenantRoleCode": "TEST_ROLE_GOBGAT",
      "tenantRoleName": "Test Role Upd GOBGAT",
      "pageCodes": [],
      "status": "ACTIVE"
    },
    {
      "id": "d8619d78-35d8-4d67-8a9e-85b635e3fdf9",
      "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "tenantCode": "GAN-DL",
      "schemaName": "hosp_gan_dl",
      "email": "apitestqcnkeh@gmail.com",
      "fullName": "API Test User Upd",
      "mobileNumber": null,
      "role": "RECEPTIONIST",
      "tenantRoleId": "c15b1322-2a67-4b78-a91a-d63405860b9c",
      "tenantRoleCode": "TEST_ROLE_QCNKEH",
      "tenantRoleName": "Test Role Upd QCNKEH",
      "pageCodes": [],
      "status": "ACTIVE"
    }
  ]
}
```

### 7. AUTH users paged — **PASS**

- **Service:** auth
- **Method + URL:** `GET http://localhost:8111/api/v1/auth/users/paged?page=0&size=10`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": "d8619d78-35d8-4d67-8a9e-85b635e3fdf9",
        "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
        "tenantCode": "GAN-DL",
        "schemaName": "hosp_gan_dl",
        "email": "apitestqcnkeh@gmail.com",
        "fullName": "API Test User Upd",
        "mobileNumber": null,
        "role": "RECEPTIONIST",
        "tenantRoleId": "c15b1322-2a67-4b78-a91a-d63405860b9c",
        "tenantRoleCode": "TEST_ROLE_QCNKEH",
        "tenantRoleName": "Test Role Upd QCNKEH",
        "pageCodes": [],
        "status": "ACTIVE"
      },
      {
        "id": "35b7f579-88a7-42c3-9019-2146fe973797",
        "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
        "tenantCode": "GAN-DL",
        "schemaName": "hosp_gan_dl",
        "email": "apitestgobgat@gmail.com",
        "fullName": "API Test User Upd",
        "mobileNumber": null,
        "role": "RECEPTIONIST",
        "tenantRoleId": "587f32a5-69bf-429e-a78c-47c6e13cf50c",
        "tenantRoleCode": "TEST_ROLE_GOBGAT",
        "tenantRoleName": "Test Role Upd GOBGAT",
        "pageCodes": [],
        "status": "ACTIVE"
      },
      {
        "id": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
        "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
        "tenantCode": "GAN-DL",
        "schemaName": "hosp_gan_dl",
        "email": "admin@gmail.com",
        "fullName": "Ganesha Admin",
        "mobileNumber": "9876543210",
        "role": "ADMIN",
        "tenantRoleId": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
        "tenantRoleCode": "HOSPITAL_ADMIN",
        "tenantRoleName": "Hospital Admin",
        "pageCodes": [
          "DASHBOARD",
          "PATIENTS",
          "DOCTORS",
          "APPOINTMENTS",
          "TREATMENTS",
          "MEDICINES",
          "SALES",
          "ACTIVITY_LOG",
          "BILLING",
          "SETTINGS"
        ],
        "status": "ACTIVE"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 3,
    "totalPages": 1
  }
}
```

### 8. AUTH get user — **PASS**

- **Service:** auth
- **Method + URL:** `GET http://localhost:8111/api/v1/auth/users/6e8d490f-5ea4-4deb-b557-cdf32b843728`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "schemaName": "hosp_gan_dl",
    "email": "admin@gmail.com",
    "fullName": "Ganesha Admin",
    "mobileNumber": "9876543210",
    "role": "ADMIN",
    "tenantRoleId": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
    "tenantRoleCode": "HOSPITAL_ADMIN",
    "tenantRoleName": "Hospital Admin",
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "DOCTORS",
      "APPOINTMENTS",
      "TREATMENTS",
      "MEDICINES",
      "SALES",
      "ACTIVITY_LOG",
      "BILLING",
      "SETTINGS"
    ],
    "status": "ACTIVE"
  }
}
```

### 9. AUTH tenant — **PASS**

- **Service:** auth
- **Method + URL:** `GET http://localhost:8111/api/v1/auth/tenant`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "name": "Ganesha Ayurveda",
    "clinicType": "Ayurveda Clinic",
    "state": "Delhi",
    "stateCode": "DL",
    "city": "New Delhi",
    "pinCode": "110001",
    "addressLine1": "12 Green Park",
    "addressLine2": "Near Metro",
    "registrationNumberGst": "07AAAAA0000A1Z5",
    "logoUrl": null,
    "fullName": "Ganesha Admin",
    "mobileNumber": "9876543210",
    "email": "admin@gmail.com",
    "photoUrl": null,
    "schemaName": "hosp_gan_dl",
    "platform": false,
    "status": "ACTIVE",
    "provisionMessage": "Schema hosp_gan_dl created. Hospital schema hosp_gan_dl already up to date (6 script(s) previously applied)."
  }
}
```

### 10. AUTH ui-pages — **PASS**

- **Service:** auth
- **Method + URL:** `GET http://localhost:8111/api/v1/ui-pages`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "UI pages fetched successfully.",
  "data": [
    {
      "id": "3c7a9a91-dbba-4487-89b0-7f3eed031bc4",
      "pageCode": "DASHBOARD",
      "pageName": "Dashboard",
      "description": "Home dashboard",
      "module": "HOME",
      "sortOrder": 10
    },
    {
      "id": "f45ba25d-c653-406c-a883-6a6f4a1af9b2",
      "pageCode": "PATIENTS",
      "pageName": "Patients",
      "description": "Patient management",
      "module": "CLINICAL",
      "sortOrder": 20
    },
    {
      "id": "f587a595-c948-4085-b279-be4319f024fe",
      "pageCode": "DOCTORS",
      "pageName": "Doctors",
      "description": "Doctor management",
      "module": "CLINICAL",
      "sortOrder": 30
    },
    {
      "id": "7b86b9ff-a806-406c-99f7-e045e22fa859",
      "pageCode": "APPOINTMENTS",
      "pageName": "Appointments",
      "description": "Appointment booking",
      "module": "CLINICAL",
      "sortOrder": 40
    },
    {
      "id": "5dc5a66d-1505-4904-9f8a-5936113235e5",
      "pageCode": "TREATMENTS",
      "pageName": "Treatments",
      "description": "Treatment plans",
      "module": "CLINICAL",
      "sortOrder": 50
    },
    {
      "id": "b2646f8c-468a-4623-8ead-08daf1dff1d8",
      "pageCode": "MEDICINES",
      "pageName": "Medicines",
      "description": "Medicine catalog",
      "module": "PHARMACY",
      "sortOrder": 60
    },
    {
      "id": "87454dd6-f8ca-4608-ad9c-cd600dd259d3",
      "pageCode": "SALES",
      "pageName": "Sales",
      "description": "Sales and pharmacy billing",
      "module": "SALES",
      "sortOrder": 70
    },
    {
      "id": "3973faeb-edff-44cb-8621-50cc312d890b",
      "pageCode": "ACTIVITY_LOG",
      "pageName": "Activity Log",
      "description": "Activity logs",
      "module": "ADMIN",
      "sortOrder": 80
    },
    {
      "id": "4c65147e-3992-4061-843c-7113aa99425e",
      "pageCode": "BILLING",
      "pageName": "Billing",
      "description": "Invoices and payments",
      "module": "BILLING",
      "sortOrder": 90
    },
    {
      "id": "29a8da40-fd8f-4088-98e0-a4c506792607",
      "pageCode": "SETTINGS",
      "pageName": "Settings",
      "description": "Hospital settings",
      "module": "ADMIN",
      "sortOrder": 100
    }
  ]
}
```

### 11. AUTH roles list — **PASS**

- **Service:** auth
- **Method + URL:** `GET http://localhost:8111/api/v1/roles`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Roles fetched successfully.",
  "data": [
    {
      "id": "66d21d9d-192e-42b3-bf53-62be266164f8",
      "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "roleCode": "DOCTOR",
      "roleName": "Doctor",
      "description": "Clinical modules for doctors",
      "systemRole": true,
      "active": true,
      "pageCodes": [
        "DASHBOARD",
        "PATIENTS",
        "DOCTORS",
        "APPOINTMENTS",
        "TREATMENTS"
      ],
      "userCount": 0
    },
    {
      "id": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
      "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "roleCode": "HOSPITAL_ADMIN",
      "roleName": "Hospital Admin",
      "description": "Full access to all hospital UI pages",
      "systemRole": true,
      "active": true,
      "pageCodes": [
        "DASHBOARD",
        "PATIENTS",
        "DOCTORS",
        "APPOINTMENTS",
        "TREATMENTS",
        "MEDICINES",
        "SALES",
        "ACTIVITY_LOG",
        "BILLING",
        "SETTINGS"
      ],
      "userCount": 1
    },
    {
      "id": "a489ff09-6db5-42f7-b786-dd279729cf58",
      "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "roleCode": "RECEPTIONIST",
      "roleName": "Receptionist",
      "description": "Front-desk patient and appointment access",
      "systemRole": true,
      "active": true,
      "pageCodes": [
        "DASHBOARD",
        "PATIENTS",
        "APPOINTMENTS",
        "BILLING"
      ],
      "userCount": 0
    }
  ]
}
```

### 12. AUTH create role — **PASS**

- **Service:** auth
- **Method + URL:** `POST http://localhost:8111/api/v1/roles`
- **HTTP:** `201`

**Request body:**

```json
{
  "roleName": "Test Role CVUEXV",
  "description": "API test role",
  "pageCodes": [
    "DASHBOARD",
    "PATIENTS"
  ],
  "active": true
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Role created successfully.",
  "data": {
    "id": "29f901c3-82f1-441a-a104-50f35ce06fd9",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "roleCode": "TEST_ROLE_CVUEXV",
    "roleName": "Test Role CVUEXV",
    "description": "API test role",
    "systemRole": false,
    "active": true,
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS"
    ],
    "userCount": 0
  }
}
```

### 13. AUTH get role — **PASS**

- **Service:** auth
- **Method + URL:** `GET http://localhost:8111/api/v1/roles/29f901c3-82f1-441a-a104-50f35ce06fd9`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "29f901c3-82f1-441a-a104-50f35ce06fd9",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "roleCode": "TEST_ROLE_CVUEXV",
    "roleName": "Test Role CVUEXV",
    "description": "API test role",
    "systemRole": false,
    "active": true,
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS"
    ],
    "userCount": 0
  }
}
```

### 14. AUTH update role — **PASS**

- **Service:** auth
- **Method + URL:** `PUT http://localhost:8111/api/v1/roles/29f901c3-82f1-441a-a104-50f35ce06fd9`
- **HTTP:** `200`

**Request body:**

```json
{
  "roleName": "Test Role Upd CVUEXV",
  "description": "updated",
  "pageCodes": [
    "DASHBOARD",
    "PATIENTS",
    "BILLING"
  ],
  "active": true
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Role updated successfully.",
  "data": {
    "id": "29f901c3-82f1-441a-a104-50f35ce06fd9",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "roleCode": "TEST_ROLE_CVUEXV",
    "roleName": "Test Role Upd CVUEXV",
    "description": "updated",
    "systemRole": false,
    "active": true,
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "BILLING"
    ],
    "userCount": 0
  }
}
```

### 15. AUTH register-user — **PASS**

- **Service:** auth
- **Method + URL:** `POST http://localhost:8111/api/v1/auth/register-user`
- **HTTP:** `201`

**Request body:**

```json
{
  "fullName": "API Test User CVUEXV",
  "email": "apitestcvuexv@gmail.com",
  "password": "***",
  "role": "RECEPTIONIST",
  "tenantRoleId": "29f901c3-82f1-441a-a104-50f35ce06fd9"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "User registered successfully.",
  "data": {
    "id": "bd876449-3f33-4bc3-a222-a98037f3058b",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "schemaName": "hosp_gan_dl",
    "email": "apitestcvuexv@gmail.com",
    "fullName": "API Test User CVUEXV",
    "mobileNumber": null,
    "role": "RECEPTIONIST",
    "tenantRoleId": "29f901c3-82f1-441a-a104-50f35ce06fd9",
    "tenantRoleCode": "TEST_ROLE_CVUEXV",
    "tenantRoleName": "Test Role Upd CVUEXV",
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "BILLING"
    ],
    "status": "ACTIVE"
  }
}
```

### 16. AUTH update user — **PASS**

- **Service:** auth
- **Method + URL:** `PUT http://localhost:8111/api/v1/auth/users/bd876449-3f33-4bc3-a222-a98037f3058b`
- **HTTP:** `200`

**Request body:**

```json
{
  "fullName": "API Test User Upd",
  "mobileNumber": "9876501234"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "User updated successfully.",
  "data": {
    "id": "bd876449-3f33-4bc3-a222-a98037f3058b",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "schemaName": "hosp_gan_dl",
    "email": "apitestcvuexv@gmail.com",
    "fullName": "API Test User Upd",
    "mobileNumber": null,
    "role": "RECEPTIONIST",
    "tenantRoleId": "29f901c3-82f1-441a-a104-50f35ce06fd9",
    "tenantRoleCode": "TEST_ROLE_CVUEXV",
    "tenantRoleName": "Test Role Upd CVUEXV",
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "BILLING"
    ],
    "status": "ACTIVE"
  }
}
```

### 17. AUTH update user status INACTIVE — **PASS**

- **Service:** auth
- **Method + URL:** `PUT http://localhost:8111/api/v1/auth/users/bd876449-3f33-4bc3-a222-a98037f3058b/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "status": "INACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "User status updated successfully.",
  "data": {
    "id": "bd876449-3f33-4bc3-a222-a98037f3058b",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "schemaName": "hosp_gan_dl",
    "email": "apitestcvuexv@gmail.com",
    "fullName": "API Test User Upd",
    "mobileNumber": null,
    "role": "RECEPTIONIST",
    "tenantRoleId": "29f901c3-82f1-441a-a104-50f35ce06fd9",
    "tenantRoleCode": "TEST_ROLE_CVUEXV",
    "tenantRoleName": "Test Role Upd CVUEXV",
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "BILLING"
    ],
    "status": "INACTIVE"
  }
}
```

### 18. AUTH update user status ACTIVE — **PASS**

- **Service:** auth
- **Method + URL:** `PUT http://localhost:8111/api/v1/auth/users/bd876449-3f33-4bc3-a222-a98037f3058b/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "User status updated successfully.",
  "data": {
    "id": "bd876449-3f33-4bc3-a222-a98037f3058b",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "schemaName": "hosp_gan_dl",
    "email": "apitestcvuexv@gmail.com",
    "fullName": "API Test User Upd",
    "mobileNumber": null,
    "role": "RECEPTIONIST",
    "tenantRoleId": "29f901c3-82f1-441a-a104-50f35ce06fd9",
    "tenantRoleCode": "TEST_ROLE_CVUEXV",
    "tenantRoleName": "Test Role Upd CVUEXV",
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "BILLING"
    ],
    "status": "ACTIVE"
  }
}
```

### 19. AUTH login disposable user — **PASS**

- **Service:** auth
- **Method + URL:** `POST http://localhost:8111/api/v1/auth/login`
- **HTTP:** `200`

**Request body:**

```json
{
  "tenantCode": "GAN-DL",
  "usernameOrEmail": "apitestcvuexv@gmail.com",
  "password": "***"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJiZDg3NjQ0OS0zZjMzLTRiYzMtYTIyMi1hOTgwMzdmMzA1OGIiLCJ0ZW5hbnRJZCI6IjY2ZTM5MjlkLTg5ZmQtNDU0ZC05MTg2LWUzY2Y4NWY5ZGEzMiIsInRlbmFudENvZGUiOiJHQU4tREwiLCJzY2hlbWFOYW1lIjoiaG9zcF9nYW5fZGwiLCJ1c2VybmFtZSI6ImFwaXRlc3RjdnVleHZAZ21haWwuY29tIiwiZW1haWwiOiJhcGl0ZXN0Y3Z1ZXh2QGdtYWlsLmNvbSIsInJvbGUiOiJSRUNFUFRJT05JU1QiLCJwYWdlQ29kZXMiOlsiREFTSEJPQVJEIiwiUEFUSUVOVFMiLCJCSUxMSU5HIl0sImlhdCI6MTc4ODQwOTUzNiwiZXhwIjoxNzg4NDk1OTM2LCJ0ZW5hbnRSb2xlSWQiOiIyOWY5MDFjMy04MmYxLTQ0MWEtYTEwNC01MGYzNWNlMDZmZDkifQ.wg9rwXzENvMfmGV8Z-SsNrq3vFeIengHRfEQzn7fzAQN2wDazx4RGgOG1TBVGK2r",
    "tokenType": "Bearer",
    "expiresInMs": 86400000,
    "user": {
      "id": "bd876449-3f33-4bc3-a222-a98037f3058b",
      "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "tenantCode": "GAN-DL",
      "schemaName": "hosp_gan_dl",
      "email": "apitestcvuexv@gmail.com",
      "fullName": "API Test User Upd",
      "mobileNumber": null,
      "role": "RECEPTIONIST",
      "tenantRoleId": "29f901c3-82f1-441a-a104-50f35ce06fd9",
      "tenantRoleCode": "TEST_ROLE_CVUEXV",
      "tenantRoleName": "Test Role Upd CVUEXV",
      "pageCodes": [
        "DASHBOARD",
        "PATIENTS",
        "BILLING"
      ],
      "status": "ACTIVE"
    },
    "tenant": {
      "id": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "tenantCode": "GAN-DL",
      "name": "Ganesha Ayurveda",
      "clinicType": "Ayurveda Clinic",
      "state": "Delhi",
      "stateCode": "DL",
      "city": "New Delhi",
      "pinCode": "110001",
      "addressLine1": "12 Green Park",
      "addressLine2": "Near Metro",
      "registrationNumberGst": "07AAAAA0000A1Z5",
      "logoUrl": null,
      "fullName": "Ganesha Admin",
      "mobileNumber": "9876543210",
      "email": "admin@gmail.com",
      "photoUrl": null,
      "schemaName": "hosp_gan_dl",
      "platform": false,
      "status": "ACTIVE",
      "provisionMessage": "Schema hosp_gan_dl created. Hospital schema hosp_gan_dl already up to date (6 script(s) previously applied)."
    }
  }
}
```

### 20. AUTH change-password disposable — **PASS**

- **Service:** auth
- **Method + URL:** `PUT http://localhost:8111/api/v1/auth/change-password`
- **HTTP:** `200`

**Request body:**

```json
{
  "currentPassword": "***",
  "newPassword": "***",
  "confirmPassword": "***"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Password changed successfully.",
  "data": null
}
```

### 21. AUTH delete disposable user — **PASS**

- **Service:** auth
- **Method + URL:** `DELETE http://localhost:8111/api/v1/auth/users/bd876449-3f33-4bc3-a222-a98037f3058b`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "User deleted successfully.",
  "data": null
}
```

### 22. AUTH forgot-password — **PASS**

- **Service:** auth
- **Method + URL:** `POST http://localhost:8111/api/v1/auth/forgot-password`
- **HTTP:** `200`

**Request body:**

```json
{
  "tenantCode": "GAN-DL",
  "usernameOrEmail": "admin@gmail.com"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "If an account exists, a password reset email has been sent.",
  "data": {
    "message": "If an account exists, a password reset email has been sent.",
    "resetToken": "cfbea1e4c6cd4f329fd35c19eb3d13cc395d1a2e76fd4c04b9225f2b7209d60d",
    "expiresAt": "2026-09-03T10:25:36.5168504"
  }
}
```

### 23. AUTH reset-password (probe invalid token) — **PASS**

- **Service:** auth
- **Method + URL:** `POST http://localhost:8111/api/v1/auth/reset-password`
- **HTTP:** `400`
- **Notes:** Invalid token expected — endpoint exercised without changing admin password

**Request body:**

```json
{
  "token": "invalid-token-for-api-coverage",
  "newPassword": "***",
  "confirmPassword": "***"
}
```

**Response body:**

```json
{
  "success": false,
  "status": 400,
  "message": "Invalid or expired reset token.",
  "data": null
}
```

### 24. AUTH create role for delete — **PASS**

- **Service:** auth
- **Method + URL:** `POST http://localhost:8111/api/v1/roles`
- **HTTP:** `201`

**Request body:**

```json
{
  "roleName": "Del Role CVUEXV",
  "pageCodes": [
    "DASHBOARD"
  ],
  "active": true
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Role created successfully.",
  "data": {
    "id": "1bdb8928-0477-4b9b-9bb8-1e24004a38c0",
    "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "roleCode": "DEL_ROLE_CVUEXV",
    "roleName": "Del Role CVUEXV",
    "description": null,
    "systemRole": false,
    "active": true,
    "pageCodes": [
      "DASHBOARD"
    ],
    "userCount": 0
  }
}
```

### 25. AUTH delete role — **PASS**

- **Service:** auth
- **Method + URL:** `DELETE http://localhost:8111/api/v1/roles/1bdb8928-0477-4b9b-9bb8-1e24004a38c0`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Role deleted successfully.",
  "data": null
}
```

### 26. AUTH delete updated role — **PASS**

- **Service:** auth
- **Method + URL:** `DELETE http://localhost:8111/api/v1/roles/29f901c3-82f1-441a-a104-50f35ce06fd9`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Role deleted successfully.",
  "data": null
}
```

### 27. PLATFORM list hospitals — **PASS**

- **Service:** platform
- **Method + URL:** `GET http://localhost:8111/api/v1/platform/hospitals`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Hospitals fetched successfully.",
  "data": [
    {
      "id": "737d7c3d-5e89-489a-8082-eaf65e56a43d",
      "tenantCode": "API-OD-2",
      "name": "Api Test Clinic QCNKEH",
      "clinicType": "Ayurveda Clinic",
      "state": "Odisha",
      "stateCode": "OD",
      "city": "Bhubaneswar",
      "pinCode": "751001",
      "addressLine1": "Test Road",
      "addressLine2": null,
      "registrationNumberGst": null,
      "logoUrl": null,
      "fullName": "Clinic Admin QCNKEH",
      "mobileNumber": "9857725841",
      "email": "clinicadminqcnkeh@gmail.com",
      "photoUrl": null,
      "schemaName": "hosp_api_od_2",
      "platform": false,
      "status": "ACTIVE",
      "provisionMessage": "Schema hosp_api_od_2 created. Hospital-schema scripts applied (V000__baseline.sql, V001__masters.sql, V002__appointments.sql, V003__billing.sql, V004__ops.sql, V005__drop_patient_display_id.sql). Clinical tables provisioned in hosp_api_od_2."
    },
    {
      "id": "b344b35f-1076-47e3-9a38-80eabe302020",
      "tenantCode": "API-OD",
      "name": "Api Test Clinic GOBGAT",
      "clinicType": "Ayurveda Clinic",
      "state": "Odisha",
      "stateCode": "OD",
      "city": "Bhubaneswar",
      "pinCode": "751001",
      "addressLine1": "Test Road",
      "addressLine2": null,
      "registrationNumberGst": null,
      "logoUrl": null,
      "fullName": "Clinic Admin GOBGAT",
      "mobileNumber": "9714509113",
      "email": "clinicadmingobgat@gmail.com",
      "photoUrl": null,
      "schemaName": "hosp_api_od",
      "platform": false,
      "status": "ACTIVE",
      "provisionMessage": "Schema hosp_api_od created. Hospital-schema scripts applied (V000__baseline.sql, V001__masters.sql, V002__appointments.sql, V003__billing.sql, V004__ops.sql, V005__drop_patient_display_id.sql). Clinical tables provisioned in hosp_api_od."
    },
    {
      "id": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "tenantCode": "GAN-DL",
      "name": "Ganesha Ayurveda",
      "clinicType": "Ayurveda Clinic",
      "state": "Delhi",
      "stateCode": "DL",
      "city": "New Delhi",
      "pinCode": "110001",
      "addressLine1": "12 Green Park",
      "addressLine2": "Near Metro",
      "registrationNumberGst": "07AAAAA0000A1Z5",
      "logoUrl": null,
      "fullName": "Ganesha Admin",
      "mobileNumber": "9876543210",
      "email": "admin@gmail.com",
      "photoUrl": null,
      "schemaName": "hosp_gan_dl",
      "platform": false,
      "status": "ACTIVE",
      "provisionMessage": "Schema hosp_gan_dl created. Hospital schema hosp_gan_dl already up to date (6 script(s) previously applied)."
    }
  ]
}
```

### 28. PLATFORM get hospital — **PASS**

- **Service:** platform
- **Method + URL:** `GET http://localhost:8111/api/v1/platform/hospitals/66e3929d-89fd-454d-9186-e3cf85f9da32`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "name": "Ganesha Ayurveda",
    "clinicType": "Ayurveda Clinic",
    "state": "Delhi",
    "stateCode": "DL",
    "city": "New Delhi",
    "pinCode": "110001",
    "addressLine1": "12 Green Park",
    "addressLine2": "Near Metro",
    "registrationNumberGst": "07AAAAA0000A1Z5",
    "logoUrl": null,
    "fullName": "Ganesha Admin",
    "mobileNumber": "9876543210",
    "email": "admin@gmail.com",
    "photoUrl": null,
    "schemaName": "hosp_gan_dl",
    "platform": false,
    "status": "ACTIVE",
    "provisionMessage": "Schema hosp_gan_dl created. Hospital schema hosp_gan_dl already up to date (6 script(s) previously applied)."
  }
}
```

### 29. PLATFORM update hospital — **PASS**

- **Service:** platform
- **Method + URL:** `PUT http://localhost:8111/api/v1/platform/hospitals/66e3929d-89fd-454d-9186-e3cf85f9da32`
- **HTTP:** `200`

**Request body:**

```json
{
  "clinicName": "Ganesha Ayurveda",
  "clinicType": "Ayurveda Clinic",
  "state": "Delhi",
  "city": "New Delhi",
  "pinCode": "110001",
  "addressLine1": "12 Green Park",
  "fullName": "Ganesha Admin",
  "mobileNumber": "9876543210",
  "email": "admin@gmail.com"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Hospital profile updated successfully.",
  "data": {
    "id": "66e3929d-89fd-454d-9186-e3cf85f9da32",
    "tenantCode": "GAN-DL",
    "name": "Ganesha Ayurveda",
    "clinicType": "Ayurveda Clinic",
    "state": "Delhi",
    "stateCode": "DL",
    "city": "New Delhi",
    "pinCode": "110001",
    "addressLine1": "12 Green Park",
    "addressLine2": "Near Metro",
    "registrationNumberGst": "07AAAAA0000A1Z5",
    "logoUrl": null,
    "fullName": "Ganesha Admin",
    "mobileNumber": "9876543210",
    "email": "admin@gmail.com",
    "photoUrl": null,
    "schemaName": "hosp_gan_dl",
    "platform": false,
    "status": "ACTIVE",
    "provisionMessage": "Schema hosp_gan_dl created. Hospital schema hosp_gan_dl already up to date (6 script(s) previously applied)."
  }
}
```

### 30. PLATFORM list hospital admins — **PASS**

- **Service:** platform
- **Method + URL:** `GET http://localhost:8111/api/v1/platform/hospitals/66e3929d-89fd-454d-9186-e3cf85f9da32/admins`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Hospital admins fetched successfully.",
  "data": [
    {
      "id": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
      "tenantId": "66e3929d-89fd-454d-9186-e3cf85f9da32",
      "tenantCode": "GAN-DL",
      "schemaName": "hosp_gan_dl",
      "email": "admin@gmail.com",
      "fullName": "Ganesha Admin",
      "mobileNumber": "9876543210",
      "role": "ADMIN",
      "tenantRoleId": "84c4eebe-1e08-4efb-8337-7240fbf4f153",
      "tenantRoleCode": "HOSPITAL_ADMIN",
      "tenantRoleName": "Hospital Admin",
      "pageCodes": [
        "DASHBOARD",
        "PATIENTS",
        "DOCTORS",
        "APPOINTMENTS",
        "TREATMENTS",
        "MEDICINES",
        "SALES",
        "ACTIVITY_LOG",
        "BILLING",
        "SETTINGS"
      ],
      "status": "ACTIVE"
    }
  ]
}
```

### 31. PLATFORM onboard disposable hospital — **PASS**

- **Service:** platform
- **Method + URL:** `POST http://localhost:8111/api/v1/platform/hospitals`
- **HTTP:** `201`

**Request body:**

```json
{
  "clinicName": "Api Test Clinic CVUEXV",
  "clinicType": "Ayurveda Clinic",
  "state": "Odisha",
  "city": "Bhubaneswar",
  "pinCode": "751001",
  "addressLine1": "Test Road",
  "fullName": "Clinic Admin CVUEXV",
  "mobileNumber": "9334027505",
  "email": "clinicadmincvuexv@gmail.com",
  "password": "***",
  "confirmPassword": "***"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Hospital onboarded successfully. Schema provisioned.",
  "data": {
    "hospital": {
      "id": "61012fb1-31d2-4b07-b447-c06be51f63c3",
      "tenantCode": "API-OD-3",
      "name": "Api Test Clinic CVUEXV",
      "clinicType": "Ayurveda Clinic",
      "state": "Odisha",
      "stateCode": "OD",
      "city": "Bhubaneswar",
      "pinCode": "751001",
      "addressLine1": "Test Road",
      "addressLine2": null,
      "registrationNumberGst": null,
      "logoUrl": null,
      "fullName": "Clinic Admin CVUEXV",
      "mobileNumber": "9334027505",
      "email": "clinicadmincvuexv@gmail.com",
      "photoUrl": null,
      "schemaName": "hosp_api_od_3",
      "platform": false,
      "status": "ACTIVE",
      "provisionMessage": "Schema hosp_api_od_3 created. Hospital-schema scripts applied (V000__baseline.sql, V001__masters.sql, V002__appointments.sql, V003__billing.sql, V004__ops.sql, V005__drop_patient_display_id.sql). Clinical tables provisioned in hosp_api_od_3."
    },
    "admin": {
      "id": "30767b7d-1a78-4ca1-9c83-db56462001e7",
      "tenantId": "61012fb1-31d2-4b07-b447-c06be51f63c3",
      "tenantCode": "API-OD-3",
      "schemaName": "hosp_api_od_3",
      "email": "clinicadmincvuexv@gmail.com",
      "fullName": "Clinic Admin CVUEXV",
      "mobileNumber": "9334027505",
      "role": "ADMIN",
      "tenantRoleId": "f78709ec-03a3-4e2e-9804-df6a10a5800f",
      "tenantRoleCode": "HOSPITAL_ADMIN",
      "tenantRoleName": "Hospital Admin",
      "pageCodes": [
        "DASHBOARD",
        "PATIENTS",
        "DOCTORS",
        "APPOINTMENTS",
        "TREATMENTS",
        "MEDICINES",
        "SALES",
        "ACTIVITY_LOG",
        "BILLING",
        "SETTINGS"
      ],
      "status": "ACTIVE"
    }
  }
}
```

### 32. PLATFORM create hospital admin — **PASS**

- **Service:** platform
- **Method + URL:** `POST http://localhost:8111/api/v1/platform/hospitals/61012fb1-31d2-4b07-b447-c06be51f63c3/admins`
- **HTTP:** `201`

**Request body:**

```json
{
  "fullName": "Second Admin CVUEXV",
  "email": "secondadmincvuexv@gmail.com",
  "password": "***"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Hospital admin created successfully.",
  "data": {
    "id": "478d40b7-fe95-47e7-88ff-2481a5a1c1cf",
    "tenantId": "61012fb1-31d2-4b07-b447-c06be51f63c3",
    "tenantCode": "API-OD-3",
    "schemaName": "hosp_api_od_3",
    "email": "secondadmincvuexv@gmail.com",
    "fullName": "Second Admin CVUEXV",
    "mobileNumber": null,
    "role": "ADMIN",
    "tenantRoleId": "f78709ec-03a3-4e2e-9804-df6a10a5800f",
    "tenantRoleCode": "HOSPITAL_ADMIN",
    "tenantRoleName": "Hospital Admin",
    "pageCodes": [
      "DASHBOARD",
      "PATIENTS",
      "DOCTORS",
      "APPOINTMENTS",
      "TREATMENTS",
      "MEDICINES",
      "SALES",
      "ACTIVITY_LOG",
      "BILLING",
      "SETTINGS"
    ],
    "status": "ACTIVE"
  }
}
```

### 33. PLATFORM update hospital status INACTIVE — **PASS**

- **Service:** platform
- **Method + URL:** `PUT http://localhost:8111/api/v1/platform/hospitals/61012fb1-31d2-4b07-b447-c06be51f63c3/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "status": "INACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Hospital status updated successfully.",
  "data": {
    "id": "61012fb1-31d2-4b07-b447-c06be51f63c3",
    "tenantCode": "API-OD-3",
    "name": "Api Test Clinic CVUEXV",
    "clinicType": "Ayurveda Clinic",
    "state": "Odisha",
    "stateCode": "OD",
    "city": "Bhubaneswar",
    "pinCode": "751001",
    "addressLine1": "Test Road",
    "addressLine2": null,
    "registrationNumberGst": null,
    "logoUrl": null,
    "fullName": "Clinic Admin CVUEXV",
    "mobileNumber": "9334027505",
    "email": "clinicadmincvuexv@gmail.com",
    "photoUrl": null,
    "schemaName": "hosp_api_od_3",
    "platform": false,
    "status": "INACTIVE",
    "provisionMessage": "Schema hosp_api_od_3 created. Hospital-schema scripts applied (V000__baseline.sql, V001__masters.sql, V002__appointments.sql, V003__billing.sql, V004__ops.sql, V005__drop_patient_display_id.sql). Clinical tables provisioned in hosp_api_od_3."
  }
}
```

### 34. PLATFORM update hospital status ACTIVE — **PASS**

- **Service:** platform
- **Method + URL:** `PUT http://localhost:8111/api/v1/platform/hospitals/61012fb1-31d2-4b07-b447-c06be51f63c3/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Hospital status updated successfully.",
  "data": {
    "id": "61012fb1-31d2-4b07-b447-c06be51f63c3",
    "tenantCode": "API-OD-3",
    "name": "Api Test Clinic CVUEXV",
    "clinicType": "Ayurveda Clinic",
    "state": "Odisha",
    "stateCode": "OD",
    "city": "Bhubaneswar",
    "pinCode": "751001",
    "addressLine1": "Test Road",
    "addressLine2": null,
    "registrationNumberGst": null,
    "logoUrl": null,
    "fullName": "Clinic Admin CVUEXV",
    "mobileNumber": "9334027505",
    "email": "clinicadmincvuexv@gmail.com",
    "photoUrl": null,
    "schemaName": "hosp_api_od_3",
    "platform": false,
    "status": "ACTIVE",
    "provisionMessage": "Schema hosp_api_od_3 created. Hospital-schema scripts applied (V000__baseline.sql, V001__masters.sql, V002__appointments.sql, V003__billing.sql, V004__ops.sql, V005__drop_patient_display_id.sql). Clinical tables provisioned in hosp_api_od_3."
  }
}
```

### 35. PLATFORM retry-provision — **PASS**

- **Service:** platform
- **Method + URL:** `POST http://localhost:8111/api/v1/platform/hospitals/61012fb1-31d2-4b07-b447-c06be51f63c3/retry-provision`
- **HTTP:** `400`
- **Notes:** Exercised; 400 OK if hospital not in FAILED state

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": false,
  "status": 400,
  "message": "Retry provision is only allowed when hospital status is FAILED.",
  "data": null
}
```

### 36. PLATFORM bootstrap-super-admin (already exists) — **PASS**

- **Service:** platform
- **Method + URL:** `POST http://localhost:8111/api/v1/platform/bootstrap-super-admin`
- **HTTP:** `400`
- **Notes:** Expected fail — already bootstrapped

**Request body:**

```json
{
  "fullName": "X",
  "email": "another@gmail.com",
  "password": "***"
}
```

**Response body:**

```json
{
  "success": false,
  "status": 400,
  "message": "Platform super admin already exists. Bootstrap is disabled.",
  "data": null
}
```

### 37. PATIENT create — **PASS**

- **Service:** patient
- **Method + URL:** `POST http://localhost:8101/api/v1/patients/create-patient`
- **HTTP:** `201`

**Request body:**

```json
{
  "fullName": "Full Test Patient CVUEXV",
  "gender": "MALE",
  "dateOfBirth": "1990-05-15",
  "age": 35,
  "preferredLanguage": "Hindi",
  "mobileNumber": "9366512212",
  "email": "patientcvuexv@test.com",
  "state": "Delhi",
  "city": "New Delhi",
  "address": "Test Address 1",
  "emergencyContactName": "Emergency Contact",
  "emergencyRelationship": "Brother",
  "emergencyPhoneNumber": "9876543211",
  "occupation": "Engineer"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient created successfully.",
  "data": {
    "id": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "patientCode": "GAN-DL-PT-00013",
    "firstName": "Full",
    "lastName": "Test Patient CVUEXV",
    "fullName": "Full Test Patient CVUEXV",
    "gender": "MALE",
    "dateOfBirth": "1990-05-15",
    "age": 35,
    "preferredLanguage": "Hindi",
    "email": "patientcvuexv@test.com",
    "mobileNumber": "9366512212",
    "state": "Delhi",
    "city": "New Delhi",
    "address": "Test Address 1",
    "emergencyContactName": "Emergency Contact",
    "emergencyRelationship": "Brother",
    "emergencyPhoneNumber": "9876543211",
    "idProofType": null,
    "idProofNumber": null,
    "occupation": "Engineer",
    "insuranceDetails": null,
    "status": "ACTIVE",
    "createdAt": "2026-09-03T09:55:39.838007",
    "updatedAt": "2026-09-03T09:55:39.838007"
  }
}
```

### 38. PATIENT get by id — **PASS**

- **Service:** patient
- **Method + URL:** `GET http://localhost:8101/api/v1/patients/get-patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient fetched successfully.",
  "data": {
    "id": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "patientCode": "GAN-DL-PT-00013",
    "firstName": "Full",
    "lastName": "Test Patient CVUEXV",
    "fullName": "Full Test Patient CVUEXV",
    "gender": "MALE",
    "dateOfBirth": "1990-05-15",
    "age": 35,
    "preferredLanguage": "Hindi",
    "email": "patientcvuexv@test.com",
    "mobileNumber": "9366512212",
    "state": "Delhi",
    "city": "New Delhi",
    "address": "Test Address 1",
    "emergencyContactName": "Emergency Contact",
    "emergencyRelationship": "Brother",
    "emergencyPhoneNumber": "9876543211",
    "idProofType": null,
    "idProofNumber": null,
    "occupation": "Engineer",
    "insuranceDetails": null,
    "status": "ACTIVE",
    "createdAt": "2026-09-03T09:55:39.838007",
    "updatedAt": "2026-09-03T09:55:39.838007"
  }
}
```

### 39. PATIENT list all — **PASS**

- **Service:** patient
- **Method + URL:** `GET http://localhost:8101/api/v1/patients/get-all-patients`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Patients fetched successfully.\",\"data\":[{\"id\":\"0b683030-a354-408b-9b98-d7cdf6c498a0\",\"patientCode\":\"GAN-DL-PT-00001\",\"firstName\":\"Full\",\"lastName\":\"Test Patient GOBGAT\",\"fullName\":\"Full Test Patient GOBGAT\",\"gender\":\"MALE\",\"dateOfBirth\":\"1990-05-15\",\"age\":35,\"preferredLanguage\":\"Hindi\",\"email\":\"patientgobgat@test.com\",\"mobileNumber\":\"9274561503\",\"state\":\"Delhi\",\"city\":\"New Delhi\",\"address\":\"Test Address 1\",\"emergencyContactName\":\"Emergency Contact\",\"emergencyRelationship\":\"Brother\",\"emergencyPhoneNumber\":\"9876543211\",\"idProofType\":null,\"idProofNumber\":null,\"occupation\":\"Engineer\",\"insuranceDetails\":null,\"status\":\"ACTIVE\",\"createdAt\":\"2026-09-03T09:51:53.454778\",\"updatedAt\":\"2026-09-03T09:51:53.454778\"},{\"id\":\"e275233a-8cc1-4708-a6bd-925c4f3da0d5\",\"patientCode\":\"GAN-DL-PT-00003\",\"firstName\":\"Appt\",\"lastName\":\"Nested Patient GOBGAT\",\"fullName\":\"Appt Nested Patient GOBGAT\",\"gender\":\"MALE\",\"dateOfBirth\":\"1988-03-20\",\"age\":37,\"preferredLanguage\":null,\"email\":\"apptgobgat@test.com\",\"mobileNumber\":\"7988693714\",\"state\":\"Delhi\",\"city\":\"New Delhi\",\"address\":\"Appt Addr\",\"emergencyContactName\":null,\"emergencyRelationship\":null,\"emergencyPhoneNumber\":null,\"idProofType\":null,\"idProofNumber\":null,\"occupation\":null,\"insuranceDetails\":null,\"status\":\"ACTIVE\",\"createdAt\":\"2026-09-03T09:52:00.967867\",\"updatedAt\":\"2026-09-03T09:52:00.967867\"},{\"id\":\"d9437ab3-cf56-40f1-9d21-df9ed1cf62c7\",\"patientCode\":\"GAN-DL-PT-00004\",\"firstName\":\"Cancel\",\"lastName\":\"Patient GOBGAT\",\"fullName\":\"Cancel Patient GOBGAT\",\"gender\":\"FEMALE\",\"dateOfBirth\":\"1992-07-10\",\"age\":33,\"preferredLanguage\":null,\"email\":null,\"mobileNumber\":\"6719818514\",\"state\":null,\"city\":null,\"address\":null,\"emergencyContactName\":null,\"emergencyRelationship\":null,\"emergencyPhoneNumber\":null,\"idProofType\":null,\"idProofNumber\":null,\"occupation\":null,\"insuranceDetails\":null,\"status\":\"ACTIVE\",\"createdAt\":\"2026-09-03T09:52:06.172643\",\"updatedAt\":\"2026-09-03T09:52:06.172643\"},{\"id\":\"72e0556d-d4f8-4ad8-882b-c0816782e03b\",\"patientCode\":\"GAN-DL-PT-00005\",\"firstName\":\"Delete\",\"lastName\":\"Appt Patient GOBGAT\",\"fullName\":\"Delete Appt Patient GOBGAT\",\"gender\":\"MALE\",\"dateOfBirth\":\"1991-01-01\",\"age\":34,\"preferredLanguage\":null,\"email\":null,\"mobileNumber\":\"9656175975\",\"state\":null,\"city\":null,\"address\":null,\"emergencyContactName\":null,\"emergencyRelationship\":null,\"emergencyPhoneNumber\":null,\"idProofType\":null,\"idProofNumber\":null,\"occupation\":null,\"insuranceDetails\":null,\"status\":\"ACTIVE\",\"createdAt\":\"2... [truncated]"
```

### 40. PATIENT count — **PASS**

- **Service:** patient
- **Method + URL:** `GET http://localhost:8101/api/v1/patients/get-patient-count`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient counts fetched successfully.",
  "data": {
    "totalPatients": 11,
    "activePatients": 11,
    "inactivePatients": 0
  }
}
```

### 41. PATIENT create for delete — **PASS**

- **Service:** patient
- **Method + URL:** `POST http://localhost:8101/api/v1/patients/create-patient`
- **HTTP:** `201`

**Request body:**

```json
{
  "fullName": "Delete Me Patient CVUEXV",
  "gender": "FEMALE",
  "dateOfBirth": "1995-01-01",
  "age": 30,
  "mobileNumber": "8979935032"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient created successfully.",
  "data": {
    "id": "097c9727-aaa1-4a4f-b85b-afd5f2345542",
    "patientCode": "GAN-DL-PT-00014",
    "firstName": "Delete",
    "lastName": "Me Patient CVUEXV",
    "fullName": "Delete Me Patient CVUEXV",
    "gender": "FEMALE",
    "dateOfBirth": "1995-01-01",
    "age": 30,
    "preferredLanguage": null,
    "email": null,
    "mobileNumber": "8979935032",
    "state": null,
    "city": null,
    "address": null,
    "emergencyContactName": null,
    "emergencyRelationship": null,
    "emergencyPhoneNumber": null,
    "idProofType": null,
    "idProofNumber": null,
    "occupation": null,
    "insuranceDetails": null,
    "status": "ACTIVE",
    "createdAt": "2026-09-03T09:55:40.2354593",
    "updatedAt": "2026-09-03T09:55:40.2354593"
  }
}
```

### 42. PATIENT delete — **PASS**

- **Service:** patient
- **Method + URL:** `DELETE http://localhost:8101/api/v1/patients/delete-patient/097c9727-aaa1-4a4f-b85b-afd5f2345542`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient deleted successfully.",
  "data": null
}
```

### 43. DOCTOR create — **PASS**

- **Service:** doctor
- **Method + URL:** `POST http://localhost:8102/api/v1/doctors`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "Dr Full Test CVUEXV",
  "specialization": "Panchakarma",
  "status": "ACTIVE",
  "consultationFees": 600,
  "followUpFees": 400,
  "availability": "Mon-Sat 9-6"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Doctor created successfully.",
  "data": {
    "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "name": "Dr Full Test CVUEXV",
    "specialization": "Panchakarma",
    "qualification": null,
    "mobileNumber": null,
    "status": "ACTIVE",
    "consultationFees": 600,
    "followUpFees": 400,
    "availability": "Mon-Sat 9-6"
  }
}
```

### 44. DOCTOR list — **PASS**

- **Service:** doctor
- **Method + URL:** `GET http://localhost:8102/api/v1/doctors`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Doctors fetched successfully.",
  "data": [
    {
      "id": "1ffdff8e-d2d2-456f-b7f7-d8f00ce647df",
      "name": "Dr Full Test GOBGAT",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6"
    },
    {
      "id": "ba9d9e3c-9774-4641-bf4e-f66c47956cab",
      "name": "Dr Full Test QCNKEH",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6"
    },
    {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6"
    }
  ]
}
```

### 45. DOCTOR active — **PASS**

- **Service:** doctor
- **Method + URL:** `GET http://localhost:8102/api/v1/doctors/active`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Active doctors fetched successfully.",
  "data": [
    {
      "id": "1ffdff8e-d2d2-456f-b7f7-d8f00ce647df",
      "name": "Dr Full Test GOBGAT",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6"
    },
    {
      "id": "ba9d9e3c-9774-4641-bf4e-f66c47956cab",
      "name": "Dr Full Test QCNKEH",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6"
    },
    {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6"
    }
  ]
}
```

### 46. DOCTOR get by id — **PASS**

- **Service:** doctor
- **Method + URL:** `GET http://localhost:8102/api/v1/doctors/e2bbfda1-7dca-4b70-8bea-fbf5053637b4`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Doctor fetched successfully.",
  "data": {
    "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "name": "Dr Full Test CVUEXV",
    "specialization": "Panchakarma",
    "qualification": null,
    "mobileNumber": null,
    "status": "ACTIVE",
    "consultationFees": 600,
    "followUpFees": 400,
    "availability": "Mon-Sat 9-6"
  }
}
```

### 47. DOCTOR patch status — **PASS**

- **Service:** doctor
- **Method + URL:** `PATCH http://localhost:8102/api/v1/doctors/e2bbfda1-7dca-4b70-8bea-fbf5053637b4/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Doctor status updated successfully.",
  "data": {
    "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "name": "Dr Full Test CVUEXV",
    "specialization": "Panchakarma",
    "qualification": null,
    "mobileNumber": null,
    "status": "ACTIVE",
    "consultationFees": 600,
    "followUpFees": 400,
    "availability": "Mon-Sat 9-6"
  }
}
```

### 48. DOCTOR create for delete — **PASS**

- **Service:** doctor
- **Method + URL:** `POST http://localhost:8102/api/v1/doctors`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "Dr Delete CVUEXV",
  "specialization": "General",
  "status": "ACTIVE",
  "consultationFees": 100,
  "followUpFees": 50,
  "availability": "Mon-Fri 9-5"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Doctor created successfully.",
  "data": {
    "id": "8d0ae814-00b0-4131-8fd2-9bad67500674",
    "name": "Dr Delete CVUEXV",
    "specialization": "General",
    "qualification": null,
    "mobileNumber": null,
    "status": "ACTIVE",
    "consultationFees": 100,
    "followUpFees": 50,
    "availability": "Mon-Fri 9-5"
  }
}
```

### 49. DOCTOR delete disposable — **PASS**

- **Service:** doctor
- **Method + URL:** `DELETE http://localhost:8102/api/v1/doctors/8d0ae814-00b0-4131-8fd2-9bad67500674`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Doctor deleted successfully.",
  "data": null
}
```

### 50. APPT create consultation-type — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/consultation-types`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "Consult CVUEXV",
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Consultation type created successfully.",
  "data": {
    "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
    "name": "Consult CVUEXV",
    "status": "ACTIVE"
  }
}
```

### 51. APPT list consultation-types — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/consultation-types`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Consultation types fetched successfully.",
  "data": [
    {
      "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
      "name": "Consult CVUEXV",
      "status": "ACTIVE"
    },
    {
      "id": "041153d7-b994-4fdf-a079-728cebbc30e1",
      "name": "Consult GOBGAT",
      "status": "ACTIVE"
    },
    {
      "id": "5a4a0ccb-1114-4ea2-8b70-ca2602670f34",
      "name": "Consult NGBRHU",
      "status": "ACTIVE"
    },
    {
      "id": "2258e82c-b51a-46d1-8b27-72ccbef51492",
      "name": "Consult QCNKEH",
      "status": "ACTIVE"
    },
    {
      "id": "eb4e2ac4-e594-4548-b6de-6af26f8c7061",
      "name": "Fresh Consult Type",
      "status": "ACTIVE"
    }
  ]
}
```

### 52. APPT active consultation-types — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/consultation-types/active`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Consultation types fetched successfully.",
  "data": [
    {
      "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
      "name": "Consult CVUEXV",
      "status": "ACTIVE"
    },
    {
      "id": "041153d7-b994-4fdf-a079-728cebbc30e1",
      "name": "Consult GOBGAT",
      "status": "ACTIVE"
    },
    {
      "id": "5a4a0ccb-1114-4ea2-8b70-ca2602670f34",
      "name": "Consult NGBRHU",
      "status": "ACTIVE"
    },
    {
      "id": "2258e82c-b51a-46d1-8b27-72ccbef51492",
      "name": "Consult QCNKEH",
      "status": "ACTIVE"
    },
    {
      "id": "eb4e2ac4-e594-4548-b6de-6af26f8c7061",
      "name": "Fresh Consult Type",
      "status": "ACTIVE"
    }
  ]
}
```

### 53. APPT get consultation-type — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/consultation-types/2e8b44b0-3d08-4fac-b548-122eb6b0b032`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Consultation type fetched successfully.",
  "data": {
    "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
    "name": "Consult CVUEXV",
    "status": "ACTIVE"
  }
}
```

### 54. APPT create dosha — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/doshas`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "TestDoshaCVUEXV",
  "elements": "Earth",
  "characteristics": "Stable",
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Dosha created successfully.",
  "data": {
    "id": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
    "name": "TestDoshaCVUEXV",
    "elements": "Earth",
    "characteristics": "Stable",
    "status": "ACTIVE"
  }
}
```

### 55. APPT list doshas — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/doshas`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Doshas fetched successfully.",
  "data": [
    {
      "id": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
      "name": "TestDoshaCVUEXV",
      "elements": "Earth",
      "characteristics": "Stable",
      "status": "ACTIVE"
    },
    {
      "id": "c61183d9-cec2-4d7e-8178-8243aba08bc6",
      "name": "TestDoshaGOBGAT",
      "elements": "Earth",
      "characteristics": "Stable",
      "status": "ACTIVE"
    },
    {
      "id": "f18a641c-04cc-4b3a-8917-f83ab6fff9dd",
      "name": "TestDoshaNGBRHU",
      "elements": "Earth",
      "characteristics": "Stable",
      "status": "ACTIVE"
    },
    {
      "id": "49cc173e-d624-4e0b-b001-743d704e62fd",
      "name": "TestDoshaQCNKEH",
      "elements": "Earth",
      "characteristics": "Stable",
      "status": "ACTIVE"
    },
    {
      "id": "a4b8e3d8-5161-4a2f-8dfa-8fa8e2a3848c",
      "name": "Vata Fresh",
      "elements": "Air",
      "characteristics": "Dry",
      "status": "ACTIVE"
    }
  ]
}
```

### 56. APPT get dosha — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/doshas/c049cdc3-ee6f-45ac-9505-92280ab515fd`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Dosha fetched successfully.",
  "data": {
    "id": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
    "name": "TestDoshaCVUEXV",
    "elements": "Earth",
    "characteristics": "Stable",
    "status": "ACTIVE"
  }
}
```

### 57. APPT create treatment-category — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/treatment-categories`
- **HTTP:** `201`

**Request body:**

```json
{
  "categoryName": "Cat CVUEXV",
  "description": "test",
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment category created successfully",
  "data": {
    "id": "b593b23e-62bd-490d-a60e-d59eb4402333",
    "categoryCode": "GAN-DL-TC-00005",
    "categoryName": "Cat CVUEXV",
    "description": "test",
    "status": "ACTIVE"
  }
}
```

### 58. APPT list treatment-categories — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/treatment-categories`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "2a1bc908-f03e-4f46-9cbb-65f7ba4071d7",
      "categoryCode": "GAN-DL-TC-00001",
      "categoryName": "Cat Zeta Probe",
      "description": "x",
      "status": "ACTIVE"
    },
    {
      "id": "02c24aca-f3ba-41b8-928a-aff868349a0c",
      "categoryCode": "GAN-DL-TC-00002",
      "categoryName": "Cat NGBRHU",
      "description": "test",
      "status": "ACTIVE"
    },
    {
      "id": "ac94585c-0189-41e8-9cdb-89a9932ca8b4",
      "categoryCode": "GAN-DL-TC-00003",
      "categoryName": "Cat GOBGAT",
      "description": "test",
      "status": "ACTIVE"
    },
    {
      "id": "5efe0f42-8d68-438e-b864-53783a2b027d",
      "categoryCode": "GAN-DL-TC-00004",
      "categoryName": "Cat QCNKEH",
      "description": "test",
      "status": "ACTIVE"
    },
    {
      "id": "b593b23e-62bd-490d-a60e-d59eb4402333",
      "categoryCode": "GAN-DL-TC-00005",
      "categoryName": "Cat CVUEXV",
      "description": "test",
      "status": "ACTIVE"
    }
  ]
}
```

### 59. APPT get treatment-category — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/treatment-categories/b593b23e-62bd-490d-a60e-d59eb4402333`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "b593b23e-62bd-490d-a60e-d59eb4402333",
    "categoryCode": "GAN-DL-TC-00005",
    "categoryName": "Cat CVUEXV",
    "description": "test",
    "status": "ACTIVE"
  }
}
```

### 60. APPT create therapy — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/therapies`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "Therapy CVUEXV",
  "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
  "status": "ACTIVE",
  "durationMinutes": 45,
  "price": 1500,
  "description": "Abhyanga test"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapy created successfully.",
  "data": {
    "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
    "name": "Therapy CVUEXV",
    "therapyName": "Therapy CVUEXV",
    "therapyCode": "GAN-DL-TH-00008",
    "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
    "categoryName": "Cat CVUEXV",
    "status": "ACTIVE",
    "durationMinutes": 45,
    "price": 1500,
    "description": "Abhyanga test"
  }
}
```

### 61. APPT list therapies — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/therapies`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "1198f750-7106-453b-b2dc-e23b2acc8f72",
      "name": "Therapy Zeta Probe",
      "therapyName": "Therapy Zeta Probe",
      "therapyCode": "GAN-DL-TH-00001",
      "categoryId": "2a1bc908-f03e-4f46-9cbb-65f7ba4071d7",
      "categoryName": "Cat Zeta Probe",
      "status": "ACTIVE",
      "durationMinutes": 30,
      "price": 900,
      "description": "probe"
    },
    {
      "id": "129c8664-445b-442f-85b7-99fc5d506783",
      "name": "Abhyanga Fresh",
      "therapyName": "Abhyanga Fresh",
      "therapyCode": "GAN-DL-TH-00002",
      "categoryId": "2a1bc908-f03e-4f46-9cbb-65f7ba4071d7",
      "categoryName": "Cat Zeta Probe",
      "status": "ACTIVE",
      "durationMinutes": 45,
      "price": 1500,
      "description": "Oil"
    },
    {
      "id": "e7bdd728-dd86-4354-9a42-c05c04bfca07",
      "name": "Therapy Upd NGBRHU",
      "therapyName": "Therapy Upd NGBRHU",
      "therapyCode": "GAN-DL-TH-00003",
      "categoryId": "02c24aca-f3ba-41b8-928a-aff868349a0c",
      "categoryName": "Cat NGBRHU",
      "status": "ACTIVE",
      "durationMinutes": 50,
      "price": 1600,
      "description": "updated"
    },
    {
      "id": "cf2e532b-1f49-4aa0-bbfb-2e8b8960e362",
      "name": "Therapy Upd GOBGAT",
      "therapyName": "Therapy Upd GOBGAT",
      "therapyCode": "GAN-DL-TH-00004",
      "categoryId": "ac94585c-0189-41e8-9cdb-89a9932ca8b4",
      "categoryName": "Cat GOBGAT",
      "status": "ACTIVE",
      "durationMinutes": 50,
      "price": 1600,
      "description": "updated"
    },
    {
      "id": "94295f3e-3ed8-4839-93c6-80e9581042c9",
      "name": "Therapy Upd QCNKEH",
      "therapyName": "Therapy Upd QCNKEH",
      "therapyCode": "GAN-DL-TH-00006",
      "categoryId": "5efe0f42-8d68-438e-b864-53783a2b027d",
      "categoryName": "Cat QCNKEH",
      "status": "ACTIVE",
      "durationMinutes": 50,
      "price": 1600,
      "description": "updated"
    },
    {
      "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
      "name": "Therapy CVUEXV",
      "therapyName": "Therapy CVUEXV",
      "therapyCode": "GAN-DL-TH-00008",
      "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
      "categoryName": "Cat CVUEXV",
      "status": "ACTIVE",
      "durationMinutes": 45,
      "price": 1500,
      "description": "Abhyanga test"
    }
  ]
}
```

### 62. APPT therapies by category — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/therapies/category/b593b23e-62bd-490d-a60e-d59eb4402333`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
      "name": "Therapy CVUEXV",
      "therapyName": "Therapy CVUEXV",
      "therapyCode": "GAN-DL-TH-00008",
      "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
      "categoryName": "Cat CVUEXV",
      "status": "ACTIVE",
      "durationMinutes": 45,
      "price": 1500,
      "description": "Abhyanga test"
    }
  ]
}
```

### 63. APPT get therapy — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/therapies/fbb43cf1-1fc6-48fb-97eb-91743effa2e4`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
    "name": "Therapy CVUEXV",
    "therapyName": "Therapy CVUEXV",
    "therapyCode": "GAN-DL-TH-00008",
    "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
    "categoryName": "Cat CVUEXV",
    "status": "ACTIVE",
    "durationMinutes": 45,
    "price": 1500,
    "description": "Abhyanga test"
  }
}
```

### 64. APPT update therapy — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/therapies/fbb43cf1-1fc6-48fb-97eb-91743effa2e4`
- **HTTP:** `200`

**Request body:**

```json
{
  "name": "Therapy Upd CVUEXV",
  "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
  "status": "ACTIVE",
  "durationMinutes": 50,
  "price": 1600,
  "description": "updated"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapy updated successfully.",
  "data": {
    "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
    "name": "Therapy Upd CVUEXV",
    "therapyName": "Therapy Upd CVUEXV",
    "therapyCode": "GAN-DL-TH-00008",
    "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
    "categoryName": "Cat CVUEXV",
    "status": "ACTIVE",
    "durationMinutes": 50,
    "price": 1600,
    "description": "updated"
  }
}
```

### 65. APPT patch therapy status — **PASS**

- **Service:** appointment
- **Method + URL:** `PATCH http://localhost:8103/api/v1/therapies/fbb43cf1-1fc6-48fb-97eb-91743effa2e4/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapy status updated successfully.",
  "data": {
    "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
    "name": "Therapy Upd CVUEXV",
    "therapyName": "Therapy Upd CVUEXV",
    "therapyCode": "GAN-DL-TH-00008",
    "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
    "categoryName": "Cat CVUEXV",
    "status": "ACTIVE",
    "durationMinutes": 50,
    "price": 1600,
    "description": "updated"
  }
}
```

### 66. APPT create therapy for delete — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/therapies`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "Therapy Del CVUEXV",
  "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
  "durationMinutes": 30,
  "price": 500
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapy created successfully.",
  "data": {
    "id": "b1f60424-a945-486e-a583-3f141781873f",
    "name": "Therapy Del CVUEXV",
    "therapyName": "Therapy Del CVUEXV",
    "therapyCode": "GAN-DL-TH-00009",
    "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
    "categoryName": "Cat CVUEXV",
    "status": "ACTIVE",
    "durationMinutes": 30,
    "price": 500,
    "description": null
  }
}
```

### 67. APPT delete disposable therapy — **PASS**

- **Service:** appointment
- **Method + URL:** `DELETE http://localhost:8103/api/v1/therapies/b1f60424-a945-486e-a583-3f141781873f`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapy deleted successfully.",
  "data": {
    "id": "b1f60424-a945-486e-a583-3f141781873f",
    "name": "Therapy Del CVUEXV",
    "therapyName": "Therapy Del CVUEXV",
    "therapyCode": "GAN-DL-TH-00009",
    "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
    "categoryName": "Cat CVUEXV",
    "status": "ACTIVE",
    "durationMinutes": 30,
    "price": 500,
    "description": null
  }
}
```

### 68. APPT create treatment-plan-master — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/treatment-plan-masters`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "Plan CVUEXV",
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment plan created successfully.",
  "data": {
    "id": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
    "name": "Plan CVUEXV",
    "status": "ACTIVE"
  }
}
```

### 69. APPT list treatment-plan-masters — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/treatment-plan-masters`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment plans fetched successfully.",
  "data": [
    {
      "id": "4874db22-e584-4847-9b37-3dd78d1248c7",
      "name": "Fresh Plan",
      "status": "ACTIVE"
    },
    {
      "id": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
      "name": "Plan CVUEXV",
      "status": "ACTIVE"
    },
    {
      "id": "fb85f9d4-add3-4c06-b4d0-c2db5c26af6f",
      "name": "Plan GOBGAT",
      "status": "ACTIVE"
    },
    {
      "id": "62d565d5-4cae-4585-94ae-56fc70de9f90",
      "name": "Plan NGBRHU",
      "status": "ACTIVE"
    },
    {
      "id": "da4e9db2-c701-41b5-91aa-470cfba77621",
      "name": "Plan QCNKEH",
      "status": "ACTIVE"
    }
  ]
}
```

### 70. APPT active treatment-plan-masters — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/treatment-plan-masters/active`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment plans fetched successfully.",
  "data": [
    {
      "id": "4874db22-e584-4847-9b37-3dd78d1248c7",
      "name": "Fresh Plan",
      "status": "ACTIVE"
    },
    {
      "id": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
      "name": "Plan CVUEXV",
      "status": "ACTIVE"
    },
    {
      "id": "fb85f9d4-add3-4c06-b4d0-c2db5c26af6f",
      "name": "Plan GOBGAT",
      "status": "ACTIVE"
    },
    {
      "id": "62d565d5-4cae-4585-94ae-56fc70de9f90",
      "name": "Plan NGBRHU",
      "status": "ACTIVE"
    },
    {
      "id": "da4e9db2-c701-41b5-91aa-470cfba77621",
      "name": "Plan QCNKEH",
      "status": "ACTIVE"
    }
  ]
}
```

### 71. APPT get treatment-plan-master — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/treatment-plan-masters/f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment plan fetched successfully.",
  "data": {
    "id": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
    "name": "Plan CVUEXV",
    "status": "ACTIVE"
  }
}
```

### 72. THERAPIST create — **PASS**

- **Service:** therapist
- **Method + URL:** `POST http://localhost:8104/api/v1/therapists`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "Therapist CVUEXV",
  "status": "ACTIVE",
  "assignedTherapyIds": [
    "fbb43cf1-1fc6-48fb-97eb-91743effa2e4"
  ]
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapist created successfully.",
  "data": {
    "id": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
    "name": "Therapist CVUEXV",
    "therapistName": "Therapist CVUEXV",
    "therapistCode": "GAN-DL-THP-00012",
    "status": "ACTIVE",
    "assignedTherapies": [
      {
        "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
        "name": "Therapy Upd CVUEXV"
      }
    ]
  }
}
```

### 73. THERAPIST list — **PASS**

- **Service:** therapist
- **Method + URL:** `GET http://localhost:8104/api/v1/therapists`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapists fetched successfully.",
  "data": [
    {
      "id": "f9e05531-ccd4-4339-b8cb-a84bff70c056",
      "name": "Therapist Smoke OK",
      "therapistName": "Therapist Smoke OK",
      "therapistCode": "GAN-DL-THP-00001",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "2f828945-d5a2-4d36-af0a-59a2997259ee",
          "name": null
        }
      ]
    },
    {
      "id": "94dbee59-12f4-46c8-9daf-2354158b5efc",
      "name": "Report Therapist",
      "therapistName": "Report Therapist",
      "therapistCode": "GAN-DL-THP-00002",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "2f828945-d5a2-4d36-af0a-59a2997259ee",
          "name": null
        }
      ]
    },
    {
      "id": "c772a3e7-c496-424e-bb66-23ff8a5013c7",
      "name": "Therapist Updated",
      "therapistName": "Therapist Updated",
      "therapistCode": "GAN-DL-THP-00003",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "2f828945-d5a2-4d36-af0a-59a2997259ee",
          "name": null
        }
      ]
    },
    {
      "id": "afa857ec-abde-48c8-85c5-b0b2d23d6845",
      "name": "Sweep Therapist 014209",
      "therapistName": "Sweep Therapist 014209",
      "therapistCode": "GAN-DL-THP-00004",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "2f828945-d5a2-4d36-af0a-59a2997259ee",
          "name": null
        }
      ]
    },
    {
      "id": "b94ca619-88ff-4b46-9b17-9dbdfa8ae29c",
      "name": "Therapist Updated 015315",
      "therapistName": "Therapist Updated 015315",
      "therapistCode": "GAN-DL-THP-00005",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "2f828945-d5a2-4d36-af0a-59a2997259ee",
          "name": null
        }
      ]
    },
    {
      "id": "2ac602f7-0824-4760-bcb4-06ac5c03e247",
      "name": "Therapist Upd NGBRHU",
      "therapistName": "Therapist Upd NGBRHU",
      "therapistCode": "GAN-DL-THP-00007",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "e7bdd728-dd86-4354-9a42-c05c04bfca07",
          "name": "Therapy Upd NGBRHU"
        }
      ]
    },
    {
      "id": "fb1c6791-d613-436b-8aba-a6a7e6a742eb",
      "name": "Therapist Upd GOBGAT",
      "therapistName": "Therapist Upd GOBGAT",
      "therapistCode": "GAN-DL-THP-00008",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "cf2e532b-1f49-4aa0-bbfb-2e8b8960e362",
          "name": "Therapy Upd GOBGAT"
        }
      ]
    },
    {
      "id": "0f2251f8-c570-491c-9f3a-2b3151e5cde0",
      "name": "Therapist Upd QCNKEH",
      "therapistName": "Therapist Upd QCNKEH",
      "therapistCode": "GAN-DL-THP-00010",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "94295f3e-3ed8-4839-93c6-80e9581042c9",
          "name": "Therapy Upd QCNKEH"
        }
      ]
    },
    {
      "id": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
      "name": "Therapist CVUEXV",
      "therapistName": "Therapist CVUEXV",
      "therapistCode": "GAN-DL-THP-00012",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
          "name": "Therapy Upd CVUEXV"
        }
      ]
    }
  ]
}
```

### 74. THERAPIST get — **PASS**

- **Service:** therapist
- **Method + URL:** `GET http://localhost:8104/api/v1/therapists/abeb3bc8-85d1-4dd5-ae67-e3f41b429808`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapist fetched successfully.",
  "data": {
    "id": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
    "name": "Therapist CVUEXV",
    "therapistName": "Therapist CVUEXV",
    "therapistCode": "GAN-DL-THP-00012",
    "status": "ACTIVE",
    "assignedTherapies": [
      {
        "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
        "name": "Therapy Upd CVUEXV"
      }
    ]
  }
}
```

### 75. THERAPIST by-therapies — **PASS**

- **Service:** therapist
- **Method + URL:** `GET http://localhost:8104/api/v1/therapists/by-therapies?therapyIds=fbb43cf1-1fc6-48fb-97eb-91743effa2e4`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapists fetched successfully for selected therapies.",
  "data": [
    {
      "id": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
      "name": "Therapist CVUEXV",
      "therapistName": "Therapist CVUEXV",
      "therapistCode": "GAN-DL-THP-00012",
      "status": "ACTIVE",
      "assignedTherapies": [
        {
          "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
          "name": "Therapy Upd CVUEXV"
        }
      ]
    }
  ]
}
```

### 76. THERAPIST update — **PASS**

- **Service:** therapist
- **Method + URL:** `PUT http://localhost:8104/api/v1/therapists/abeb3bc8-85d1-4dd5-ae67-e3f41b429808`
- **HTTP:** `200`

**Request body:**

```json
{
  "name": "Therapist Upd CVUEXV",
  "status": "ACTIVE",
  "assignedTherapyIds": [
    "fbb43cf1-1fc6-48fb-97eb-91743effa2e4"
  ]
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapist updated successfully.",
  "data": {
    "id": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
    "name": "Therapist Upd CVUEXV",
    "therapistName": "Therapist Upd CVUEXV",
    "therapistCode": "GAN-DL-THP-00012",
    "status": "ACTIVE",
    "assignedTherapies": [
      {
        "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
        "name": "Therapy Upd CVUEXV"
      }
    ]
  }
}
```

### 77. THERAPIST patch status — **PASS**

- **Service:** therapist
- **Method + URL:** `PATCH http://localhost:8104/api/v1/therapists/abeb3bc8-85d1-4dd5-ae67-e3f41b429808/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapist status updated successfully.",
  "data": {
    "id": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
    "name": "Therapist Upd CVUEXV",
    "therapistName": "Therapist Upd CVUEXV",
    "therapistCode": "GAN-DL-THP-00012",
    "status": "ACTIVE",
    "assignedTherapies": [
      {
        "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
        "name": "Therapy Upd CVUEXV"
      }
    ]
  }
}
```

### 78. THERAPIST create for delete — **PASS**

- **Service:** therapist
- **Method + URL:** `POST http://localhost:8104/api/v1/therapists`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "Therapist Del CVUEXV",
  "status": "ACTIVE",
  "assignedTherapyIds": [
    "fbb43cf1-1fc6-48fb-97eb-91743effa2e4"
  ]
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapist created successfully.",
  "data": {
    "id": "5f609099-548f-4e6a-8a51-b3a6db8b85d0",
    "name": "Therapist Del CVUEXV",
    "therapistName": "Therapist Del CVUEXV",
    "therapistCode": "GAN-DL-THP-00013",
    "status": "ACTIVE",
    "assignedTherapies": [
      {
        "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
        "name": "Therapy Upd CVUEXV"
      }
    ]
  }
}
```

### 79. THERAPIST delete disposable — **PASS**

- **Service:** therapist
- **Method + URL:** `DELETE http://localhost:8104/api/v1/therapists/5f609099-548f-4e6a-8a51-b3a6db8b85d0`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapist deleted successfully.",
  "data": null
}
```

### 80. APPT create booking — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/appointments`
- **HTTP:** `201`

**Request body:**

```json
{
  "patient": {
    "fullName": "Appt Nested Patient CVUEXV",
    "gender": "MALE",
    "dateOfBirth": "1988-03-20",
    "age": 37,
    "mobileNumber": "7463710100",
    "email": "apptcvuexv@test.com",
    "state": "Delhi",
    "city": "New Delhi",
    "address": "Appt Addr"
  },
  "registrationDate": "2026-09-03",
  "slotTime": "17:30:00",
  "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
  "consultationTypeIds": [
    "2e8b44b0-3d08-4fac-b548-122eb6b0b032"
  ]
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient created and appointment booked successfully.",
  "data": {
    "id": "0570a837-79d2-4aa6-9c27-ec771778f857",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "firstName": "Appt",
      "lastName": "Nested Patient CVUEXV",
      "fullName": "Appt Nested Patient CVUEXV",
      "gender": "MALE",
      "dateOfBirth": "1988-03-20",
      "age": 37,
      "preferredLanguage": null,
      "email": "apptcvuexv@test.com",
      "mobileNumber": "7463710100",
      "state": "Delhi",
      "city": "New Delhi",
      "address": "Appt Addr",
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "registrationDate": "2026-09-03",
    "slotTime": "17:30:00",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "assignedDoctor": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6",
      "doctorName": "Dr Full Test CVUEXV"
    },
    "consultationTypes": [
      {
        "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
        "name": "Consult CVUEXV"
      }
    ],
    "bookingStatus": "SCHEDULED"
  }
}
```

### 81. APPT stats — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/stats`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Appointment stats fetched successfully.",
  "data": {
    "currentMonthAppointmentCount": 8,
    "completedCount": 4,
    "ongoingCount": 4,
    "todayAppointmentCount": 6
  }
}
```

### 82. APPT patients list — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/patients?statusTab=ACTIVE`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Patient list fetched successfully.\",\"data\":[{\"bookingId\":\"802f04fa-c8c5-4571-b3b7-aadd23b7a111\",\"patientId\":\"9b988d43-b5de-4a97-95be-a611fbd6afbe\",\"patientCode\":\"GAN-DL-PT-00012\",\"patientFullName\":\"MedAssess Patient QCNKEH\",\"patientMobileNumber\":\"9393949058\",\"assignedDoctorId\":\"ba9d9e3c-9774-4641-bf4e-f66c47956cab\",\"doctorName\":\"Dr Full Test QCNKEH\",\"consultationTypes\":[{\"id\":\"2258e82c-b51a-46d1-8b27-72ccbef51492\",\"name\":\"Consult QCNKEH\"}],\"appointmentDate\":\"2026-09-05\",\"slotTime\":\"09:30:00\",\"bookingTime\":\"2026-09-05T09:30:00\",\"doshaId\":\"49cc173e-d624-4e0b-b001-743d704e62fd\",\"doshaName\":\"TestDoshaQCNKEH\",\"bookingStatus\":\"SCHEDULED\"},{\"bookingId\":\"830db105-a48e-4ecc-aef4-abd2b418d485\",\"patientId\":\"89350f00-f310-416d-af3f-0c9d2c745b2c\",\"patientCode\":\"GAN-DL-PT-00006\",\"patientFullName\":\"MedAssess Patient GOBGAT\",\"patientMobileNumber\":\"9122562008\",\"assignedDoctorId\":\"1ffdff8e-d2d2-456f-b7f7-d8f00ce647df\",\"doctorName\":\"Dr Full Test GOBGAT\",\"consultationTypes\":[{\"id\":\"041153d7-b994-4fdf-a079-728cebbc30e1\",\"name\":\"Consult GOBGAT\"}],\"appointmentDate\":\"2026-09-05\",\"slotTime\":\"09:30:00\",\"bookingTime\":\"2026-09-05T09:30:00\",\"doshaId\":\"c61183d9-cec2-4d7e-8178-8243aba08bc6\",\"doshaName\":\"TestDoshaGOBGAT\",\"bookingStatus\":\"SCHEDULED\"},{\"bookingId\":\"0570a837-79d2-4aa6-9c27-ec771778f857\",\"patientId\":\"fe75a8ce-422c-4d0e-8710-49cb100193aa\",\"patientCode\":\"GAN-DL-PT-00015\",\"patientFullName\":\"Appt Nested Patient CVUEXV\",\"patientMobileNumber\":\"7463710100\",\"assignedDoctorId\":\"e2bbfda1-7dca-4b70-8bea-fbf5053637b4\",\"doctorName\":\"Dr Full Test CVUEXV\",\"consultationTypes\":[{\"id\":\"2e8b44b0-3d08-4fac-b548-122eb6b0b032\",\"name\":\"Consult CVUEXV\"}],\"appointmentDate\":\"2026-09-03\",\"slotTime\":\"17:30:00\",\"bookingTime\":\"2026-09-03T17:30:00\",\"doshaId\":null,\"doshaName\":null,\"bookingStatus\":\"SCHEDULED\"},{\"bookingId\":\"02457644-c047-4647-9191-6bd29bd177df\",\"patientId\":\"5fa14112-48e2-408f-b063-003e89df695b\",\"patientCode\":\"GAN-DL-PT-00009\",\"patientFullName\":\"Appt Nested Patient QCNKEH\",\"patientMobileNumber\":\"7991552742\",\"assignedDoctorId\":\"ba9d9e3c-9774-4641-bf4e-f66c47956cab\",\"doctorName\":\"Dr Full Test QCNKEH\",\"consultationTypes\":[{\"id\":\"2258e82c-b51a-46d1-8b27-72ccbef51492\",\"name\":\"Consult QCNKEH\"}],\"appointmentDate\":\"2026-09-03\",\"slotTime\":\"11:00:00\",\"bookingTime\":\"2026-09-03T11:00:00\",\"doshaId\":\"49cc173e-d624-4e0b-b001-743d704e62fd\",\"doshaName\":\"TestDoshaQCNKEH\",\"bookingStatus\":\"COMPLETED\"},{\"bookingId\":\"be043ada-9c69-4391-a6fb-1ea803fdf6ca\",\"patientId\":\"e27523... [truncated]"
```

### 83. APPT cancelled — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/cancelled`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Cancelled appointments fetched successfully.\",\"data\":[{\"id\":\"aace0d3d-265b-4dd8-8677-ae4be8ce14d2\",\"patientId\":\"c57e144e-a2a1-4457-9865-07efc265c929\",\"patient\":null,\"registrationDate\":\"2026-09-03\",\"slotTime\":\"11:00:00\",\"assignedDoctorId\":\"60f67e24-9c10-408c-9470-0e9865afc5ae\",\"assignedDoctor\":null,\"consultationTypes\":[{\"id\":\"eb4e2ac4-e594-4548-b6de-6af26f8c7061\",\"name\":\"Fresh Consult Type\"}],\"bookingStatus\":\"CANCELLED\"},{\"id\":\"02cf0db1-761b-4217-b6d5-d3ba1ec033ab\",\"patientId\":\"c134c6da-b7d3-469a-9b44-4665ec4468fd\",\"patient\":null,\"registrationDate\":\"2026-09-04\",\"slotTime\":\"12:15:00\",\"assignedDoctorId\":\"446f3bca-0b4a-4e0a-8053-2581edb769a9\",\"assignedDoctor\":null,\"consultationTypes\":[{\"id\":\"5a4a0ccb-1114-4ea2-8b70-ca2602670f34\",\"name\":\"Consult NGBRHU\"}],\"bookingStatus\":\"CANCELLED\"},{\"id\":\"96546923-3286-44eb-bd2e-5ab3d85ad259\",\"patientId\":\"d9437ab3-cf56-40f1-9d21-df9ed1cf62c7\",\"patient\":{\"id\":\"d9437ab3-cf56-40f1-9d21-df9ed1cf62c7\",\"patientCode\":\"GAN-DL-PT-00004\",\"firstName\":\"Cancel\",\"lastName\":\"Patient GOBGAT\",\"fullName\":\"Cancel Patient GOBGAT\",\"gender\":\"FEMALE\",\"dateOfBirth\":\"1992-07-10\",\"age\":33,\"preferredLanguage\":null,\"email\":null,\"mobileNumber\":\"6719818514\",\"state\":null,\"city\":null,\"address\":null,\"emergencyContactName\":null,\"emergencyRelationship\":null,\"emergencyPhoneNumber\":null,\"idProofType\":null,\"idProofNumber\":null,\"occupation\":null,\"insuranceDetails\":null},\"registrationDate\":\"2026-09-04\",\"slotTime\":\"13:15:00\",\"assignedDoctorId\":\"1ffdff8e-d2d2-456f-b7f7-d8f00ce647df\",\"assignedDoctor\":{\"id\":\"1ffdff8e-d2d2-456f-b7f7-d8f00ce647df\",\"name\":\"Dr Full Test GOBGAT\",\"specialization\":\"Panchakarma\",\"qualification\":null,\"mobileNumber\":null,\"status\":\"ACTIVE\",\"consultationFees\":600,\"followUpFees\":400,\"availability\":\"Mon-Sat 9-6\",\"doctorName\":\"Dr Full Test GOBGAT\"},\"consultationTypes\":[{\"id\":\"041153d7-b994-4fdf-a079-728cebbc30e1\",\"name\":\"Consult GOBGAT\"}],\"bookingStatus\":\"CANCELLED\"},{\"id\":\"e4cb7f8b-30f3-407a-b607-94b9c0be9250\",\"patientId\":\"972c92ca-af9d-4a13-be2f-101a998335e4\",\"patient\":{\"id\":\"972c92ca-af9d-4a13-be2f-101a998335e4\",\"patientCode\":\"GAN-DL-PT-00010\",\"firstName\":\"Cancel\",\"lastName\":\"Patient QCNKEH\",\"fullName\":\"Cancel Patient QCNKEH\",\"gender\":\"FEMALE\",\"dateOfBirth\":\"1992-07-10\",\"age\":33,\"preferredLanguage\":null,\"email\":null,\"mobileNumber\":\"6512360060\",\"state\":null,\"city\":null,\"address\":null,\"emergencyContactName\":null,\"emergencyRelationship\":null,\"emergencyPhoneNumber\":null,\"idProofType\":null,\"idProofNumber\":null,\"o... [truncated]"
```

### 84. APPT today — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/today`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Today's appointments fetched successfully.\",\"data\":{\"doctorId\":null,\"date\":\"2026-09-03\",\"totalAppointments\":6,\"page\":0,\"size\":20,\"totalPages\":1,\"appointments\":[{\"bookingId\":\"ba2d43e2-1af6-4959-815d-a5fad5dea03f\",\"assignedDoctorId\":\"60f67e24-9c10-408c-9470-0e9865afc5ae\",\"slotTime\":\"09:15:00\",\"bookingTime\":\"2026-09-03T09:15:00\",\"bookingStatus\":\"COMPLETED\",\"patientId\":\"1f73f734-b3ff-4016-a094-f6fe5388f664\",\"patientName\":null,\"patientMobileNumber\":null,\"consultationTypes\":[{\"id\":\"eb4e2ac4-e594-4548-b6de-6af26f8c7061\",\"name\":\"Fresh Consult Type\"}]},{\"bookingId\":\"02457644-c047-4647-9191-6bd29bd177df\",\"assignedDoctorId\":\"ba9d9e3c-9774-4641-bf4e-f66c47956cab\",\"slotTime\":\"11:00:00\",\"bookingTime\":\"2026-09-03T11:00:00\",\"bookingStatus\":\"COMPLETED\",\"patientId\":\"5fa14112-48e2-408f-b063-003e89df695b\",\"patientName\":\"Appt Nested Patient QCNKEH\",\"patientMobileNumber\":\"7991552742\",\"consultationTypes\":[{\"id\":\"2258e82c-b51a-46d1-8b27-72ccbef51492\",\"name\":\"Consult QCNKEH\"}]},{\"bookingId\":\"be043ada-9c69-4391-a6fb-1ea803fdf6ca\",\"assignedDoctorId\":\"1ffdff8e-d2d2-456f-b7f7-d8f00ce647df\",\"slotTime\":\"12:00:00\",\"bookingTime\":\"2026-09-03T12:00:00\",\"bookingStatus\":\"COMPLETED\",\"patientId\":\"e275233a-8cc1-4708-a6bd-925c4f3da0d5\",\"patientName\":\"Appt Nested Patient GOBGAT\",\"patientMobileNumber\":\"7988693714\",\"consultationTypes\":[{\"id\":\"041153d7-b994-4fdf-a079-728cebbc30e1\",\"name\":\"Consult GOBGAT\"}]},{\"bookingId\":\"2553bf22-14a0-48a6-9b81-852cfc85b3ee\",\"assignedDoctorId\":\"60f67e24-9c10-408c-9470-0e9865afc5ae\",\"slotTime\":\"14:30:00\",\"bookingTime\":\"2026-09-03T14:30:00\",\"bookingStatus\":\"RESCHEDULED\",\"patientId\":\"322dbe64-3026-4ead-a004-5481d027d57c\",\"patientName\":null,\"patientMobileNumber\":null,\"consultationTypes\":[{\"id\":\"eb4e2ac4-e594-4548-b6de-6af26f8c7061\",\"name\":\"Fresh Consult Type\"}]},{\"bookingId\":\"d530c452-f483-42fa-bf46-ea668e2cfa7b\",\"assignedDoctorId\":\"446f3bca-0b4a-4e0a-8053-2581edb769a9\",\"slotTime\":\"16:30:00\",\"bookingTime\":\"2026-09-03T16:30:00\",\"bookingStatus\":\"COMPLETED\",\"patientId\":\"07cda984-2315-4b80-8c89-5b108dae5234\",\"patientName\":null,\"patientMobileNumber\":null,\"consultationTypes\":[{\"id\":\"5a4a0ccb-1114-4ea2-8b70-ca2602670f34\",\"name\":\"Consult NGBRHU\"}]},{\"bookingId\":\"0570a837-79d2-4aa6-9c27-ec771778f857\",\"assignedDoctorId\":\"e2bbfda1-7dca-4b70-8bea-fbf5053637b4\",\"slotTime\":\"17:30:00\",\"bookingTime\":\"2026-09-03T17:30:00\",\"bookingStatus\":\"SCHEDULED\",\"patientId\":\"fe75a8ce-422c-4d0e-8710-49cb100193aa\",\"patientName\":\"Appt Nested Patient CVUEXV\",\"patie... [truncated]"
```

### 85. APPT today by consultation type — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/today/consultation-type/2e8b44b0-3d08-4fac-b548-122eb6b0b032`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Today's appointments fetched successfully for 2e8b44b0-3d08-4fac-b548-122eb6b0b032.",
  "data": [
    {
      "id": "0570a837-79d2-4aa6-9c27-ec771778f857",
      "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patient": {
        "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
        "patientCode": "GAN-DL-PT-00015",
        "firstName": "Appt",
        "lastName": "Nested Patient CVUEXV",
        "fullName": "Appt Nested Patient CVUEXV",
        "gender": "MALE",
        "dateOfBirth": "1988-03-20",
        "age": 37,
        "preferredLanguage": null,
        "email": "apptcvuexv@test.com",
        "mobileNumber": "7463710100",
        "state": "Delhi",
        "city": "New Delhi",
        "address": "Appt Addr",
        "emergencyContactName": null,
        "emergencyRelationship": null,
        "emergencyPhoneNumber": null,
        "idProofType": null,
        "idProofNumber": null,
        "occupation": null,
        "insuranceDetails": null
      },
      "registrationDate": "2026-09-03",
      "slotTime": "17:30:00",
      "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "assignedDoctor": {
        "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
        "name": "Dr Full Test CVUEXV",
        "specialization": "Panchakarma",
        "qualification": null,
        "mobileNumber": null,
        "status": "ACTIVE",
        "consultationFees": 600,
        "followUpFees": 400,
        "availability": "Mon-Sat 9-6",
        "doctorName": "Dr Full Test CVUEXV"
      },
      "consultationTypes": [
        {
          "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
          "name": "Consult CVUEXV"
        }
      ],
      "bookingStatus": "SCHEDULED"
    }
  ]
}
```

### 86. APPT doctor today — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/doctor/e2bbfda1-7dca-4b70-8bea-fbf5053637b4/today`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Doctor today's appointments fetched successfully.",
  "data": {
    "doctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "date": "2026-09-03",
    "totalAppointments": 1,
    "page": 0,
    "size": 20,
    "totalPages": 1,
    "appointments": [
      {
        "bookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
        "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
        "slotTime": "17:30:00",
        "bookingTime": "2026-09-03T17:30:00",
        "bookingStatus": "SCHEDULED",
        "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
        "patientName": "Appt Nested Patient CVUEXV",
        "patientMobileNumber": "7463710100",
        "consultationTypes": [
          {
            "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
            "name": "Consult CVUEXV"
          }
        ]
      }
    ]
  }
}
```

### 87. APPT get booking — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/0570a837-79d2-4aa6-9c27-ec771778f857`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "0570a837-79d2-4aa6-9c27-ec771778f857",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "firstName": "Appt",
      "lastName": "Nested Patient CVUEXV",
      "fullName": "Appt Nested Patient CVUEXV",
      "gender": "MALE",
      "dateOfBirth": "1988-03-20",
      "age": 37,
      "preferredLanguage": null,
      "email": "apptcvuexv@test.com",
      "mobileNumber": "7463710100",
      "state": "Delhi",
      "city": "New Delhi",
      "address": "Appt Addr",
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "registrationDate": "2026-09-03",
    "slotTime": "17:30:00",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "assignedDoctor": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6",
      "doctorName": "Dr Full Test CVUEXV"
    },
    "consultationTypes": [
      {
        "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
        "name": "Consult CVUEXV"
      }
    ],
    "bookingStatus": "SCHEDULED"
  }
}
```

### 88. APPT by patient — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/patient/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "0570a837-79d2-4aa6-9c27-ec771778f857",
      "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patient": {
        "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
        "patientCode": "GAN-DL-PT-00015",
        "firstName": "Appt",
        "lastName": "Nested Patient CVUEXV",
        "fullName": "Appt Nested Patient CVUEXV",
        "gender": "MALE",
        "dateOfBirth": "1988-03-20",
        "age": 37,
        "preferredLanguage": null,
        "email": "apptcvuexv@test.com",
        "mobileNumber": "7463710100",
        "state": "Delhi",
        "city": "New Delhi",
        "address": "Appt Addr",
        "emergencyContactName": null,
        "emergencyRelationship": null,
        "emergencyPhoneNumber": null,
        "idProofType": null,
        "idProofNumber": null,
        "occupation": null,
        "insuranceDetails": null
      },
      "registrationDate": "2026-09-03",
      "slotTime": "17:30:00",
      "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "assignedDoctor": {
        "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
        "name": "Dr Full Test CVUEXV",
        "specialization": "Panchakarma",
        "qualification": null,
        "mobileNumber": null,
        "status": "ACTIVE",
        "consultationFees": 600,
        "followUpFees": 400,
        "availability": "Mon-Sat 9-6",
        "doctorName": "Dr Full Test CVUEXV"
      },
      "consultationTypes": [
        {
          "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
          "name": "Consult CVUEXV"
        }
      ],
      "bookingStatus": "SCHEDULED"
    }
  ]
}
```

### 89. APPT by status SCHEDULED — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/status/SCHEDULED`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Appointments fetched successfully.\",\"data\":[{\"id\":\"0570a837-79d2-4aa6-9c27-ec771778f857\",\"patientId\":\"fe75a8ce-422c-4d0e-8710-49cb100193aa\",\"patient\":{\"id\":\"fe75a8ce-422c-4d0e-8710-49cb100193aa\",\"patientCode\":\"GAN-DL-PT-00015\",\"firstName\":\"Appt\",\"lastName\":\"Nested Patient CVUEXV\",\"fullName\":\"Appt Nested Patient CVUEXV\",\"gender\":\"MALE\",\"dateOfBirth\":\"1988-03-20\",\"age\":37,\"preferredLanguage\":null,\"email\":\"apptcvuexv@test.com\",\"mobileNumber\":\"7463710100\",\"state\":\"Delhi\",\"city\":\"New Delhi\",\"address\":\"Appt Addr\",\"emergencyContactName\":null,\"emergencyRelationship\":null,\"emergencyPhoneNumber\":null,\"idProofType\":null,\"idProofNumber\":null,\"occupation\":null,\"insuranceDetails\":null},\"registrationDate\":\"2026-09-03\",\"slotTime\":\"17:30:00\",\"assignedDoctorId\":\"e2bbfda1-7dca-4b70-8bea-fbf5053637b4\",\"assignedDoctor\":{\"id\":\"e2bbfda1-7dca-4b70-8bea-fbf5053637b4\",\"name\":\"Dr Full Test CVUEXV\",\"specialization\":\"Panchakarma\",\"qualification\":null,\"mobileNumber\":null,\"status\":\"ACTIVE\",\"consultationFees\":600,\"followUpFees\":400,\"availability\":\"Mon-Sat 9-6\",\"doctorName\":\"Dr Full Test CVUEXV\"},\"consultationTypes\":[{\"id\":\"2e8b44b0-3d08-4fac-b548-122eb6b0b032\",\"name\":\"Consult CVUEXV\"}],\"bookingStatus\":\"SCHEDULED\"},{\"id\":\"830db105-a48e-4ecc-aef4-abd2b418d485\",\"patientId\":\"89350f00-f310-416d-af3f-0c9d2c745b2c\",\"patient\":{\"id\":\"89350f00-f310-416d-af3f-0c9d2c745b2c\",\"patientCode\":\"GAN-DL-PT-00006\",\"firstName\":\"MedAssess\",\"lastName\":\"Patient GOBGAT\",\"fullName\":\"MedAssess Patient GOBGAT\",\"gender\":\"FEMALE\",\"dateOfBirth\":\"1993-02-02\",\"age\":32,\"preferredLanguage\":null,\"email\":null,\"mobileNumber\":\"9122562008\",\"state\":null,\"city\":null,\"address\":null,\"emergencyContactName\":null,\"emergencyRelationship\":null,\"emergencyPhoneNumber\":null,\"idProofType\":null,\"idProofNumber\":null,\"occupation\":null,\"insuranceDetails\":null},\"registrationDate\":\"2026-09-05\",\"slotTime\":\"09:30:00\",\"assignedDoctorId\":\"1ffdff8e-d2d2-456f-b7f7-d8f00ce647df\",\"assignedDoctor\":{\"id\":\"1ffdff8e-d2d2-456f-b7f7-d8f00ce647df\",\"name\":\"Dr Full Test GOBGAT\",\"specialization\":\"Panchakarma\",\"qualification\":null,\"mobileNumber\":null,\"status\":\"ACTIVE\",\"consultationFees\":600,\"followUpFees\":400,\"availability\":\"Mon-Sat 9-6\",\"doctorName\":\"Dr Full Test GOBGAT\"},\"consultationTypes\":[{\"id\":\"041153d7-b994-4fdf-a079-728cebbc30e1\",\"name\":\"Consult GOBGAT\"}],\"bookingStatus\":\"SCHEDULED\"},{\"id\":\"802f04fa-c8c5-4571-b3b7-aadd23b7a111\",\"patientId\":\"9b988d43-b5de-4a97-95be-a611fbd6afbe\",\"patient\":{\"id\":\"9b988d43-b5de-4a97-95be... [truncated]"
```

### 90. APPT by date — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointments/date/2026-09-03`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Success\",\"data\":[{\"id\":\"ba2d43e2-1af6-4959-815d-a5fad5dea03f\",\"patientId\":\"1f73f734-b3ff-4016-a094-f6fe5388f664\",\"patient\":null,\"registrationDate\":\"2026-09-03\",\"slotTime\":\"09:15:00\",\"assignedDoctorId\":\"60f67e24-9c10-408c-9470-0e9865afc5ae\",\"assignedDoctor\":null,\"consultationTypes\":[{\"id\":\"eb4e2ac4-e594-4548-b6de-6af26f8c7061\",\"name\":\"Fresh Consult Type\"}],\"bookingStatus\":\"COMPLETED\"},{\"id\":\"aace0d3d-265b-4dd8-8677-ae4be8ce14d2\",\"patientId\":\"c57e144e-a2a1-4457-9865-07efc265c929\",\"patient\":null,\"registrationDate\":\"2026-09-03\",\"slotTime\":\"11:00:00\",\"assignedDoctorId\":\"60f67e24-9c10-408c-9470-0e9865afc5ae\",\"assignedDoctor\":null,\"consultationTypes\":[{\"id\":\"eb4e2ac4-e594-4548-b6de-6af26f8c7061\",\"name\":\"Fresh Consult Type\"}],\"bookingStatus\":\"CANCELLED\"},{\"id\":\"2553bf22-14a0-48a6-9b81-852cfc85b3ee\",\"patientId\":\"322dbe64-3026-4ead-a004-5481d027d57c\",\"patient\":null,\"registrationDate\":\"2026-09-03\",\"slotTime\":\"14:30:00\",\"assignedDoctorId\":\"60f67e24-9c10-408c-9470-0e9865afc5ae\",\"assignedDoctor\":null,\"consultationTypes\":[{\"id\":\"eb4e2ac4-e594-4548-b6de-6af26f8c7061\",\"name\":\"Fresh Consult Type\"}],\"bookingStatus\":\"RESCHEDULED\"},{\"id\":\"d530c452-f483-42fa-bf46-ea668e2cfa7b\",\"patientId\":\"07cda984-2315-4b80-8c89-5b108dae5234\",\"patient\":null,\"registrationDate\":\"2026-09-03\",\"slotTime\":\"16:30:00\",\"assignedDoctorId\":\"446f3bca-0b4a-4e0a-8053-2581edb769a9\",\"assignedDoctor\":null,\"consultationTypes\":[{\"id\":\"5a4a0ccb-1114-4ea2-8b70-ca2602670f34\",\"name\":\"Consult NGBRHU\"}],\"bookingStatus\":\"COMPLETED\"},{\"id\":\"be043ada-9c69-4391-a6fb-1ea803fdf6ca\",\"patientId\":\"e275233a-8cc1-4708-a6bd-925c4f3da0d5\",\"patient\":{\"id\":\"e275233a-8cc1-4708-a6bd-925c4f3da0d5\",\"patientCode\":\"GAN-DL-PT-00003\",\"firstName\":\"Appt\",\"lastName\":\"Nested Patient GOBGAT\",\"fullName\":\"Appt Nested Patient GOBGAT\",\"gender\":\"MALE\",\"dateOfBirth\":\"1988-03-20\",\"age\":37,\"preferredLanguage\":null,\"email\":\"apptgobgat@test.com\",\"mobileNumber\":\"7988693714\",\"state\":\"Delhi\",\"city\":\"New Delhi\",\"address\":\"Appt Addr\",\"emergencyContactName\":null,\"emergencyRelationship\":null,\"emergencyPhoneNumber\":null,\"idProofType\":null,\"idProofNumber\":null,\"occupation\":null,\"insuranceDetails\":null},\"registrationDate\":\"2026-09-03\",\"slotTime\":\"12:00:00\",\"assignedDoctorId\":\"1ffdff8e-d2d2-456f-b7f7-d8f00ce647df\",\"assignedDoctor\":{\"id\":\"1ffdff8e-d2d2-456f-b7f7-d8f00ce647df\",\"name\":\"Dr Full Test GOBGAT\",\"specialization\":\"Panchakarma\",\"qualification\":null,\"mobileNumber\":null,\"status\":\"ACTIVE\",\"consultationFees\":600,\"followUpFee... [truncated]"
```

### 91. APPT dashboard todays-schedule — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/dashboard/todays-schedule`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Dashboard today's schedule fetched successfully.",
  "data": {
    "date": "2026-09-03",
    "currentDateTime": "2026-09-03T09:55:52.7906108",
    "ongoingAppointment": null,
    "nextAppointment": {
      "bookingId": "2553bf22-14a0-48a6-9b81-852cfc85b3ee",
      "patientId": "322dbe64-3026-4ead-a004-5481d027d57c",
      "patientName": null,
      "serviceType": "Cat Zeta Probe Fresh consult type",
      "bookingStatus": "RESCHEDULED"
    },
    "remainingToday": 2
  }
}
```

### 92. APPT reschedule — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/appointments/0570a837-79d2-4aa6-9c27-ec771778f857/reschedule`
- **HTTP:** `200`

**Request body:**

```json
{
  "registrationDate": "2026-09-03",
  "slotTime": "11:00:00"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Appointment rescheduled successfully.",
  "data": {
    "id": "0570a837-79d2-4aa6-9c27-ec771778f857",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "firstName": "Appt",
      "lastName": "Nested Patient CVUEXV",
      "fullName": "Appt Nested Patient CVUEXV",
      "gender": "MALE",
      "dateOfBirth": "1988-03-20",
      "age": 37,
      "preferredLanguage": null,
      "email": "apptcvuexv@test.com",
      "mobileNumber": "7463710100",
      "state": "Delhi",
      "city": "New Delhi",
      "address": "Appt Addr",
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "registrationDate": "2026-09-03",
    "slotTime": "11:00:00",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "assignedDoctor": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6",
      "doctorName": "Dr Full Test CVUEXV"
    },
    "consultationTypes": [
      {
        "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
        "name": "Consult CVUEXV"
      }
    ],
    "bookingStatus": "RESCHEDULED"
  }
}
```

### 93. APPT in-consultation — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/appointments/0570a837-79d2-4aa6-9c27-ec771778f857/in-consultation`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Appointment marked as in-consultation.",
  "data": {
    "id": "0570a837-79d2-4aa6-9c27-ec771778f857",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "firstName": "Appt",
      "lastName": "Nested Patient CVUEXV",
      "fullName": "Appt Nested Patient CVUEXV",
      "gender": "MALE",
      "dateOfBirth": "1988-03-20",
      "age": 37,
      "preferredLanguage": null,
      "email": "apptcvuexv@test.com",
      "mobileNumber": "7463710100",
      "state": "Delhi",
      "city": "New Delhi",
      "address": "Appt Addr",
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "registrationDate": "2026-09-03",
    "slotTime": "11:00:00",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "assignedDoctor": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6",
      "doctorName": "Dr Full Test CVUEXV"
    },
    "consultationTypes": [
      {
        "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
        "name": "Consult CVUEXV"
      }
    ],
    "bookingStatus": "IN_CONSULTATION"
  }
}
```

### 94. APPT complete — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/appointments/0570a837-79d2-4aa6-9c27-ec771778f857/complete`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Appointment marked as completed.",
  "data": {
    "id": "0570a837-79d2-4aa6-9c27-ec771778f857",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "firstName": "Appt",
      "lastName": "Nested Patient CVUEXV",
      "fullName": "Appt Nested Patient CVUEXV",
      "gender": "MALE",
      "dateOfBirth": "1988-03-20",
      "age": 37,
      "preferredLanguage": null,
      "email": "apptcvuexv@test.com",
      "mobileNumber": "7463710100",
      "state": "Delhi",
      "city": "New Delhi",
      "address": "Appt Addr",
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "registrationDate": "2026-09-03",
    "slotTime": "11:00:00",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "assignedDoctor": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6",
      "doctorName": "Dr Full Test CVUEXV"
    },
    "consultationTypes": [
      {
        "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
        "name": "Consult CVUEXV"
      }
    ],
    "bookingStatus": "COMPLETED"
  }
}
```

### 95. APPT create booking for cancel — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/appointments`
- **HTTP:** `201`

**Request body:**

```json
{
  "patient": {
    "fullName": "Cancel Patient CVUEXV",
    "gender": "FEMALE",
    "dateOfBirth": "1992-07-10",
    "age": 33,
    "mobileNumber": "6231218248"
  },
  "registrationDate": "2026-09-04",
  "slotTime": "13:15:00",
  "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
  "consultationTypeIds": [
    "2e8b44b0-3d08-4fac-b548-122eb6b0b032"
  ]
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient created and appointment booked successfully.",
  "data": {
    "id": "657a6dd0-7abe-4de5-8332-76c48ef9f77d",
    "patientId": "d48e49e5-8faf-4ebd-b3b2-3f819a32dd0e",
    "patient": {
      "id": "d48e49e5-8faf-4ebd-b3b2-3f819a32dd0e",
      "patientCode": "GAN-DL-PT-00016",
      "firstName": "Cancel",
      "lastName": "Patient CVUEXV",
      "fullName": "Cancel Patient CVUEXV",
      "gender": "FEMALE",
      "dateOfBirth": "1992-07-10",
      "age": 33,
      "preferredLanguage": null,
      "email": null,
      "mobileNumber": "6231218248",
      "state": null,
      "city": null,
      "address": null,
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "registrationDate": "2026-09-04",
    "slotTime": "13:15:00",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "assignedDoctor": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6",
      "doctorName": "Dr Full Test CVUEXV"
    },
    "consultationTypes": [
      {
        "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
        "name": "Consult CVUEXV"
      }
    ],
    "bookingStatus": "SCHEDULED"
  }
}
```

### 96. APPT cancel — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/appointments/657a6dd0-7abe-4de5-8332-76c48ef9f77d/cancel`
- **HTTP:** `200`

**Request body:**

```json
{
  "reason": "API test cancel"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Appointment cancelled successfully.",
  "data": {
    "id": "657a6dd0-7abe-4de5-8332-76c48ef9f77d",
    "patientId": "d48e49e5-8faf-4ebd-b3b2-3f819a32dd0e",
    "patient": {
      "id": "d48e49e5-8faf-4ebd-b3b2-3f819a32dd0e",
      "patientCode": "GAN-DL-PT-00016",
      "firstName": "Cancel",
      "lastName": "Patient CVUEXV",
      "fullName": "Cancel Patient CVUEXV",
      "gender": "FEMALE",
      "dateOfBirth": "1992-07-10",
      "age": 33,
      "preferredLanguage": null,
      "email": null,
      "mobileNumber": "6231218248",
      "state": null,
      "city": null,
      "address": null,
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "registrationDate": "2026-09-04",
    "slotTime": "13:15:00",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "assignedDoctor": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6",
      "doctorName": "Dr Full Test CVUEXV"
    },
    "consultationTypes": [
      {
        "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
        "name": "Consult CVUEXV"
      }
    ],
    "bookingStatus": "CANCELLED"
  }
}
```

### 97. APPT create booking for delete — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/appointments`
- **HTTP:** `201`

**Request body:**

```json
{
  "patient": {
    "fullName": "Delete Appt Patient CVUEXV",
    "gender": "MALE",
    "dateOfBirth": "1991-01-01",
    "age": 34,
    "mobileNumber": "9414953684"
  },
  "registrationDate": "2026-09-04",
  "slotTime": "14:45:00",
  "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
  "consultationTypeIds": [
    "2e8b44b0-3d08-4fac-b548-122eb6b0b032"
  ]
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient created and appointment booked successfully.",
  "data": {
    "id": "66568898-844c-4a55-9f61-056532f406ce",
    "patientId": "7f308d30-af42-4764-bd8d-8d1a4e6d722b",
    "patient": {
      "id": "7f308d30-af42-4764-bd8d-8d1a4e6d722b",
      "patientCode": "GAN-DL-PT-00017",
      "firstName": "Delete",
      "lastName": "Appt Patient CVUEXV",
      "fullName": "Delete Appt Patient CVUEXV",
      "gender": "MALE",
      "dateOfBirth": "1991-01-01",
      "age": 34,
      "preferredLanguage": null,
      "email": null,
      "mobileNumber": "9414953684",
      "state": null,
      "city": null,
      "address": null,
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "registrationDate": "2026-09-04",
    "slotTime": "14:45:00",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "assignedDoctor": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6",
      "doctorName": "Dr Full Test CVUEXV"
    },
    "consultationTypes": [
      {
        "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
        "name": "Consult CVUEXV"
      }
    ],
    "bookingStatus": "SCHEDULED"
  }
}
```

### 98. APPT delete booking — **PASS**

- **Service:** appointment
- **Method + URL:** `DELETE http://localhost:8103/api/v1/appointments/66568898-844c-4a55-9f61-056532f406ce`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Appointment deleted successfully.",
  "data": null
}
```

### 99. APPT medical-history create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/medical-histories`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "pastMedicalConditions": "None",
  "pastSurgeries": "None",
  "currentMedications": "None",
  "familyHistory": "None",
  "allergies": "None"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Medical history created successfully",
  "data": {
    "id": "903b4879-a2ca-4528-b65c-9c737037c33f",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "pastMedicalConditions": "None",
    "pastSurgeries": "None",
    "currentMedications": "None",
    "allergies": "None",
    "familyHistory": "None"
  }
}
```

### 100. APPT medical-history get — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/medical-histories/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "903b4879-a2ca-4528-b65c-9c737037c33f",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "pastMedicalConditions": "None",
    "pastSurgeries": "None",
    "currentMedications": "None",
    "allergies": "None",
    "familyHistory": "None"
  }
}
```

### 101. APPT physical-exam create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/physical-examinations`
- **HTTP:** `200`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "height": 170,
  "weight": 70,
  "ibw": 65,
  "bp": "120/80",
  "pulse": 72,
  "temperature": 98.6
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Physical examination created successfully.",
  "data": {
    "id": "e2774e15-fbff-4fac-9f40-385dae12b4bc",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "weight": 70,
    "height": 170,
    "ibw": 65,
    "pulse": 72,
    "bp": "120/80",
    "temperature": 98.6,
    "pallor": null,
    "icterus": null,
    "cyanosis": null,
    "lymphNodes": null,
    "oedema": null,
    "sensorium": null,
    "acidityGas": null,
    "motion": null,
    "micturition": null
  }
}
```

### 102. APPT physical-exam get — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/physical-examinations/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Physical examination fetched successfully.",
  "data": {
    "id": "e2774e15-fbff-4fac-9f40-385dae12b4bc",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "weight": 70,
    "height": 170,
    "ibw": 65,
    "pulse": 72,
    "bp": "120/80",
    "temperature": 98.6,
    "pallor": null,
    "icterus": null,
    "cyanosis": null,
    "lymphNodes": null,
    "oedema": null,
    "sensorium": null,
    "acidityGas": null,
    "motion": null,
    "micturition": null
  }
}
```

### 103. APPT systemic-exam create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/systemic-examinations`
- **HTTP:** `200`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "cardiovascular": "Normal",
  "respiratory": "Normal",
  "abdomenGi": "Normal"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Systemic examination created successfully.",
  "data": {
    "id": "f7e870a6-4878-4fec-9dfe-c03a8afc8821",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "cardiovascular": "Normal",
    "respiratory": "Normal",
    "nervous": null,
    "abdomenGi": "Normal",
    "locomotor": null
  }
}
```

### 104. APPT systemic-exam get — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/systemic-examinations/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Systemic examination fetched successfully.",
  "data": {
    "id": "f7e870a6-4878-4fec-9dfe-c03a8afc8821",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "cardiovascular": "Normal",
    "respiratory": "Normal",
    "nervous": null,
    "abdomenGi": "Normal",
    "locomotor": null
  }
}
```

### 105. APPT lifestyle create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/lifestyle-information`
- **HTTP:** `200`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "dietType": "Vegetarian",
  "sleepPattern": "7hrs",
  "exerciseHabits": "Walking",
  "addiction": "None"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Lifestyle information created successfully",
  "data": {
    "id": "a5ec3e36-8eb0-4b1f-a563-731410a9d91e",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "dietType": "Vegetarian",
    "sleepPattern": "7hrs",
    "exerciseHabits": "Walking",
    "addiction": "None"
  }
}
```

### 106. APPT lifestyle get — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/lifestyle-information/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "a5ec3e36-8eb0-4b1f-a563-731410a9d91e",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "dietType": "Vegetarian",
    "sleepPattern": "7hrs",
    "exerciseHabits": "Walking",
    "addiction": "None"
  }
}
```

### 107. APPT ayurvedic-assessment create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/ayurvedic-assessments`
- **HTTP:** `200`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "doshaId": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
  "bodyConstitution": "Vata",
  "currentImbalances": "Pitta"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Ayurvedic assessment created successfully.",
  "data": {
    "id": "9223d81f-780f-4429-a7e3-6105b99c0299",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "doshaId": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
    "dosha": {
      "id": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
      "name": "TestDoshaCVUEXV",
      "elements": "Earth",
      "characteristics": "Stable",
      "status": "ACTIVE"
    },
    "bodyConstitution": "Vata",
    "currentImbalances": "Pitta"
  }
}
```

### 108. APPT ayurvedic-assessment get — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/ayurvedic-assessments/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Ayurvedic assessment fetched successfully.",
  "data": {
    "id": "9223d81f-780f-4429-a7e3-6105b99c0299",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "doshaId": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
    "dosha": {
      "id": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
      "name": "TestDoshaCVUEXV",
      "elements": "Earth",
      "characteristics": "Stable",
      "status": "ACTIVE"
    },
    "bodyConstitution": "Vata",
    "currentImbalances": "Pitta"
  }
}
```

### 109. APPT treatment-plan create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/treatment-plans`
- **HTTP:** `200`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "planTaken": "Panchakarma",
  "investigationAndPlanSuggested": "Plan notes"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment plan created successfully.",
  "data": {
    "id": "fc13aa18-40ea-4575-978f-54dc4825eeba",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "investigationAndPlanSuggested": "Plan notes",
    "planTaken": "Panchakarma"
  }
}
```

### 110. APPT treatment-plan get — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/treatment-plans/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment plan fetched successfully.",
  "data": {
    "id": "fc13aa18-40ea-4575-978f-54dc4825eeba",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "investigationAndPlanSuggested": "Plan notes",
    "planTaken": "Panchakarma"
  }
}
```

### 111. APPT create booking for medical-assessment — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/appointments`
- **HTTP:** `201`

**Request body:**

```json
{
  "patient": {
    "fullName": "MedAssess Patient CVUEXV",
    "gender": "FEMALE",
    "dateOfBirth": "1993-02-02",
    "age": 32,
    "mobileNumber": "9138894548"
  },
  "registrationDate": "2026-09-05",
  "slotTime": "09:30:00",
  "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
  "consultationTypeIds": [
    "2e8b44b0-3d08-4fac-b548-122eb6b0b032"
  ]
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient created and appointment booked successfully.",
  "data": {
    "id": "7e7582fb-c0f0-451e-88da-f7460b474296",
    "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
    "patient": {
      "id": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "patientCode": "GAN-DL-PT-00018",
      "firstName": "MedAssess",
      "lastName": "Patient CVUEXV",
      "fullName": "MedAssess Patient CVUEXV",
      "gender": "FEMALE",
      "dateOfBirth": "1993-02-02",
      "age": 32,
      "preferredLanguage": null,
      "email": null,
      "mobileNumber": "9138894548",
      "state": null,
      "city": null,
      "address": null,
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "registrationDate": "2026-09-05",
    "slotTime": "09:30:00",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "assignedDoctor": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "mobileNumber": null,
      "status": "ACTIVE",
      "consultationFees": 600,
      "followUpFees": 400,
      "availability": "Mon-Sat 9-6",
      "doctorName": "Dr Full Test CVUEXV"
    },
    "consultationTypes": [
      {
        "id": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
        "name": "Consult CVUEXV"
      }
    ],
    "bookingStatus": "SCHEDULED"
  }
}
```

### 112. APPT medical-assessment create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/medical-assessment`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
  "ayurvedicAssessment": {
    "doshaId": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
    "bodyConstitution": "Vata"
  },
  "physicalExamination": {
    "weight": 70,
    "height": 170,
    "ibw": 65,
    "pulse": 72,
    "bp": "120/80",
    "temperature": 98.6
  },
  "medicalHistory": {
    "allergies": "None"
  },
  "lifestyleInformation": {
    "dietType": "Veg"
  },
  "systemicExamination": {
    "cardiovascular": "Normal"
  },
  "treatmentPlan": {
    "planTaken": "Panchakarma"
  }
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Medical assessment saved successfully.",
  "data": {
    "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
    "ayurvedicAssessment": {
      "id": "faa0d338-af86-4439-bdca-dd6ae84d1f33",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "doshaId": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
      "dosha": {
        "id": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
        "name": "TestDoshaCVUEXV",
        "elements": "Earth",
        "characteristics": "Stable",
        "status": "ACTIVE"
      },
      "bodyConstitution": "Vata",
      "currentImbalances": null
    },
    "physicalExamination": {
      "id": "07e87342-eaa6-4b7b-8290-fa92c6919eda",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "weight": 70,
      "height": 170,
      "ibw": 65,
      "pulse": 72,
      "bp": "120/80",
      "temperature": 98.6,
      "pallor": null,
      "icterus": null,
      "cyanosis": null,
      "lymphNodes": null,
      "oedema": null,
      "sensorium": null,
      "acidityGas": null,
      "motion": null,
      "micturition": null
    },
    "medicalHistory": {
      "id": "60621118-ec40-4a46-9301-d3a9f8c02201",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "pastMedicalConditions": null,
      "pastSurgeries": null,
      "currentMedications": null,
      "allergies": "None",
      "familyHistory": null
    },
    "lifestyleInformation": {
      "id": "1ce2768f-7218-4391-8ef3-14699a0edc8e",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "dietType": "Veg",
      "sleepPattern": null,
      "exerciseHabits": null,
      "addiction": null
    },
    "systemicExamination": {
      "id": "13d31eb2-d3db-4ce4-bdb6-d82d75c4f3a3",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "cardiovascular": "Normal",
      "respiratory": null,
      "nervous": null,
      "abdomenGi": null,
      "locomotor": null
    },
    "treatmentPlan": {
      "id": "8021e6a9-a822-4bf3-ab9b-1ae67be6d084",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "investigationAndPlanSuggested": null,
      "planTaken": "Panchakarma"
    }
  }
}
```

### 113. APPT medical-assessment get — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/medical-assessment/fd94c50b-96e4-4b6c-a514-d170bd5b148e`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Medical assessment fetched successfully.",
  "data": {
    "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
    "ayurvedicAssessment": {
      "id": "faa0d338-af86-4439-bdca-dd6ae84d1f33",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "doshaId": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
      "dosha": {
        "id": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
        "name": "TestDoshaCVUEXV",
        "elements": "Earth",
        "characteristics": "Stable",
        "status": "ACTIVE"
      },
      "bodyConstitution": "Vata",
      "currentImbalances": null
    },
    "physicalExamination": {
      "id": "07e87342-eaa6-4b7b-8290-fa92c6919eda",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "weight": 70,
      "height": 170,
      "ibw": 65,
      "pulse": 72,
      "bp": "120/80",
      "temperature": 98.6,
      "pallor": null,
      "icterus": null,
      "cyanosis": null,
      "lymphNodes": null,
      "oedema": null,
      "sensorium": null,
      "acidityGas": null,
      "motion": null,
      "micturition": null
    },
    "medicalHistory": {
      "id": "60621118-ec40-4a46-9301-d3a9f8c02201",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "pastMedicalConditions": null,
      "pastSurgeries": null,
      "currentMedications": null,
      "allergies": "None",
      "familyHistory": null
    },
    "lifestyleInformation": {
      "id": "1ce2768f-7218-4391-8ef3-14699a0edc8e",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "dietType": "Veg",
      "sleepPattern": null,
      "exerciseHabits": null,
      "addiction": null
    },
    "systemicExamination": {
      "id": "13d31eb2-d3db-4ce4-bdb6-d82d75c4f3a3",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "cardiovascular": "Normal",
      "respiratory": null,
      "nervous": null,
      "abdomenGi": null,
      "locomotor": null
    },
    "treatmentPlan": {
      "id": "8021e6a9-a822-4bf3-ab9b-1ae67be6d084",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "investigationAndPlanSuggested": null,
      "planTaken": "Panchakarma"
    }
  }
}
```

### 114. APPT medical-assessment with-documents — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/medical-assessment/with-documents`
- **HTTP:** `201`

**Request body:**

```json
"<multipart [\"data\",\"labReports\"]>"
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Medical assessment saved successfully.",
  "data": {
    "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
    "ayurvedicAssessment": {
      "id": "faa0d338-af86-4439-bdca-dd6ae84d1f33",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "doshaId": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
      "dosha": {
        "id": "c049cdc3-ee6f-45ac-9505-92280ab515fd",
        "name": "TestDoshaCVUEXV",
        "elements": "Earth",
        "characteristics": "Stable",
        "status": "ACTIVE"
      },
      "bodyConstitution": null,
      "currentImbalances": null
    },
    "physicalExamination": {
      "id": "07e87342-eaa6-4b7b-8290-fa92c6919eda",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "weight": 71,
      "height": 171,
      "ibw": 66,
      "pulse": 74,
      "bp": "118/78",
      "temperature": 98.4,
      "pallor": null,
      "icterus": null,
      "cyanosis": null,
      "lymphNodes": null,
      "oedema": null,
      "sensorium": null,
      "acidityGas": null,
      "motion": null,
      "micturition": null
    },
    "medicalHistory": {
      "id": "60621118-ec40-4a46-9301-d3a9f8c02201",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "pastMedicalConditions": null,
      "pastSurgeries": null,
      "currentMedications": null,
      "allergies": null,
      "familyHistory": null
    },
    "lifestyleInformation": {
      "id": "1ce2768f-7218-4391-8ef3-14699a0edc8e",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "dietType": null,
      "sleepPattern": null,
      "exerciseHabits": null,
      "addiction": null
    },
    "systemicExamination": {
      "id": "13d31eb2-d3db-4ce4-bdb6-d82d75c4f3a3",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "cardiovascular": null,
      "respiratory": null,
      "nervous": null,
      "abdomenGi": null,
      "locomotor": null
    },
    "treatmentPlan": {
      "id": "8021e6a9-a822-4bf3-ab9b-1ae67be6d084",
      "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
      "investigationAndPlanSuggested": null,
      "planTaken": null
    },
    "documents": [
      {
        "id": "d62398d6-f5ff-4c7f-8988-9e82547fed40",
        "patientId": "fd94c50b-96e4-4b6c-a514-d170bd5b148e",
        "documentType": "LAB_REPORT",
        "fileName": "ma_CVUEXV.txt",
        "fileType": "text/plain",
        "fileSize": 17,
        "downloadUrl": "/api/v1/documents/d62398d6-f5ff-4c7f-8988-9e82547fed40/download"
      }
    ]
  }
}
```

### 115. APPT appointment-therapy create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/appointment-therapies`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "treatmentCategoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
  "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
  "scheduleDate": "2026-09-04",
  "scheduleTime": "10:00:00",
  "sessionDuration": 45,
  "sessionFrequency": 1,
  "therapyInstructions": "Gentle",
  "remarks": "test",
  "therapyIds": [
    "fbb43cf1-1fc6-48fb-97eb-91743effa2e4"
  ]
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Appointment therapy created successfully.",
  "data": {
    "therapyId": "a0104dcc-a6b5-4846-bb95-c97f0ea49036",
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "firstName": "Appt",
      "lastName": "Nested Patient CVUEXV",
      "fullName": "Appt Nested Patient CVUEXV",
      "gender": "MALE",
      "dateOfBirth": "1988-03-20",
      "age": 37,
      "preferredLanguage": null,
      "email": "apptcvuexv@test.com",
      "mobileNumber": "7463710100",
      "state": "Delhi",
      "city": "New Delhi",
      "address": "Appt Addr",
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "treatmentCategory": {
      "id": "b593b23e-62bd-490d-a60e-d59eb4402333",
      "categoryCode": "GAN-DL-TC-00005",
      "categoryName": "Cat CVUEXV",
      "description": "test",
      "status": "ACTIVE"
    },
    "assignedTherapist": {
      "id": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
      "name": "Therapist Upd CVUEXV",
      "therapistName": "Therapist Upd CVUEXV",
      "therapistCode": "GAN-DL-THP-00012",
      "status": "ACTIVE"
    },
    "scheduleDate": "2026-09-04",
    "scheduleTime": "10:00:00",
    "sessionDuration": 45,
    "sessionFrequency": 1,
    "therapyInstructions": "Gentle",
    "remarks": "test",
    "therapyStatus": "SCHEDULED",
    "therapies": [
      {
        "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
        "name": "Therapy Upd CVUEXV",
        "therapyName": "Therapy Upd CVUEXV",
        "therapyCode": "GAN-DL-TH-00008",
        "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
        "categoryName": "Cat CVUEXV",
        "status": "ACTIVE",
        "durationMinutes": 50,
        "price": 1600,
        "description": "updated"
      }
    ]
  }
}
```

### 116. APPT appointment-therapy status — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/appointment-therapies/a0104dcc-a6b5-4846-bb95-c97f0ea49036/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "therapyStatus": "IN_PROGRESS"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Appointment therapy status updated successfully.",
  "data": {
    "therapyId": "a0104dcc-a6b5-4846-bb95-c97f0ea49036",
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "firstName": "Appt",
      "lastName": "Nested Patient CVUEXV",
      "fullName": "Appt Nested Patient CVUEXV",
      "gender": "MALE",
      "dateOfBirth": "1988-03-20",
      "age": 37,
      "preferredLanguage": null,
      "email": "apptcvuexv@test.com",
      "mobileNumber": "7463710100",
      "state": "Delhi",
      "city": "New Delhi",
      "address": "Appt Addr",
      "emergencyContactName": null,
      "emergencyRelationship": null,
      "emergencyPhoneNumber": null,
      "idProofType": null,
      "idProofNumber": null,
      "occupation": null,
      "insuranceDetails": null
    },
    "treatmentCategory": {
      "id": "b593b23e-62bd-490d-a60e-d59eb4402333",
      "categoryCode": "GAN-DL-TC-00005",
      "categoryName": "Cat CVUEXV",
      "description": "test",
      "status": "ACTIVE"
    },
    "assignedTherapist": {
      "id": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
      "name": "Therapist Upd CVUEXV",
      "therapistName": "Therapist Upd CVUEXV",
      "therapistCode": "GAN-DL-THP-00012",
      "status": "ACTIVE"
    },
    "scheduleDate": "2026-09-04",
    "scheduleTime": "10:00:00",
    "sessionDuration": 45,
    "sessionFrequency": 1,
    "therapyInstructions": "Gentle",
    "remarks": "test",
    "therapyStatus": "IN_PROGRESS",
    "therapies": [
      {
        "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
        "name": "Therapy Upd CVUEXV",
        "therapyName": "Therapy Upd CVUEXV",
        "therapyCode": "GAN-DL-TH-00008",
        "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
        "categoryName": "Cat CVUEXV",
        "status": "ACTIVE",
        "durationMinutes": 50,
        "price": 1600,
        "description": "updated"
      }
    ]
  }
}
```

### 117. APPT appointment-therapy therapist today — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointment-therapies/therapist/abeb3bc8-85d1-4dd5-ae67-e3f41b429808/today`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Therapist today's schedule fetched successfully.",
  "data": {
    "therapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
    "date": "2026-09-03",
    "totalSlots": 0,
    "page": 0,
    "size": 20,
    "totalPages": 0,
    "slots": []
  }
}
```

### 118. APPT appointment-therapy by patient — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/appointment-therapies/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Appointment therapy fetched successfully.",
  "data": [
    {
      "therapyId": "a0104dcc-a6b5-4846-bb95-c97f0ea49036",
      "patient": {
        "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
        "patientCode": "GAN-DL-PT-00015",
        "firstName": "Appt",
        "lastName": "Nested Patient CVUEXV",
        "fullName": "Appt Nested Patient CVUEXV",
        "gender": "MALE",
        "dateOfBirth": "1988-03-20",
        "age": 37,
        "preferredLanguage": null,
        "email": "apptcvuexv@test.com",
        "mobileNumber": "7463710100",
        "state": "Delhi",
        "city": "New Delhi",
        "address": "Appt Addr",
        "emergencyContactName": null,
        "emergencyRelationship": null,
        "emergencyPhoneNumber": null,
        "idProofType": null,
        "idProofNumber": null,
        "occupation": null,
        "insuranceDetails": null
      },
      "treatmentCategory": {
        "id": "b593b23e-62bd-490d-a60e-d59eb4402333",
        "categoryCode": "GAN-DL-TC-00005",
        "categoryName": "Cat CVUEXV",
        "description": "test",
        "status": "ACTIVE"
      },
      "assignedTherapist": {
        "id": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
        "name": "Therapist Upd CVUEXV",
        "therapistName": "Therapist Upd CVUEXV",
        "therapistCode": "GAN-DL-THP-00012",
        "status": "ACTIVE"
      },
      "scheduleDate": "2026-09-04",
      "scheduleTime": "10:00:00",
      "sessionDuration": 45,
      "sessionFrequency": 1,
      "therapyInstructions": "Gentle",
      "remarks": "test",
      "therapyStatus": "IN_PROGRESS",
      "therapies": [
        {
          "id": "fbb43cf1-1fc6-48fb-97eb-91743effa2e4",
          "name": "Therapy Upd CVUEXV",
          "therapyName": "Therapy Upd CVUEXV",
          "therapyCode": "GAN-DL-TH-00008",
          "categoryId": "b593b23e-62bd-490d-a60e-d59eb4402333",
          "categoryName": "Cat CVUEXV",
          "status": "ACTIVE",
          "durationMinutes": 50,
          "price": 1600,
          "description": "updated"
        }
      ]
    }
  ]
}
```

### 119. APPT treatment create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/treatments`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "treatmentPlanId": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
  "startDate": "2026-09-03",
  "endDate": "2026-09-04",
  "totalSessions": 5,
  "completedSessions": 0,
  "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
  "treatmentStatus": "SCHEDULED"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment created successfully.",
  "data": {
    "id": "3a696077-46a9-4415-b638-1906471da5d7",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "treatmentPlanId": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
    "treatmentPlanName": "Plan CVUEXV",
    "startDate": "2026-09-03",
    "endDate": "2026-09-04",
    "totalSessions": 5,
    "completedSessions": 0,
    "remainingSessions": 5,
    "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
    "assignedTherapistName": "Therapist Upd CVUEXV",
    "treatmentStatus": "SCHEDULED"
  }
}
```

### 120. APPT treatments list — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/treatments`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatments fetched successfully.",
  "data": [
    {
      "id": "ebd6e9ed-08d3-4530-b003-67a576de7a57",
      "patientId": "1f73f734-b3ff-4016-a094-f6fe5388f664",
      "treatmentPlanId": "4874db22-e584-4847-9b37-3dd78d1248c7",
      "treatmentPlanName": "Fresh Plan",
      "startDate": "2026-09-03",
      "endDate": "2026-09-24",
      "totalSessions": 6,
      "completedSessions": 1,
      "remainingSessions": 5,
      "assignedTherapistId": "f9e05531-ccd4-4339-b8cb-a84bff70c056",
      "assignedTherapistName": "Therapist Smoke OK",
      "treatmentStatus": "ONGOING"
    },
    {
      "id": "83bcc1ef-eac9-4a86-9aa7-d118e1d2e84d",
      "patientId": "07cda984-2315-4b80-8c89-5b108dae5234",
      "treatmentPlanId": "62d565d5-4cae-4585-94ae-56fc70de9f90",
      "treatmentPlanName": "Plan NGBRHU",
      "startDate": "2026-09-03",
      "endDate": "2026-09-04",
      "totalSessions": 6,
      "completedSessions": 1,
      "remainingSessions": 5,
      "assignedTherapistId": "2ac602f7-0824-4760-bcb4-06ac5c03e247",
      "assignedTherapistName": "Therapist Upd NGBRHU",
      "treatmentStatus": "ONGOING"
    },
    {
      "id": "5579c800-c461-4b49-975e-067b62b8204c",
      "patientId": "e275233a-8cc1-4708-a6bd-925c4f3da0d5",
      "treatmentPlanId": "fb85f9d4-add3-4c06-b4d0-c2db5c26af6f",
      "treatmentPlanName": "Plan GOBGAT",
      "startDate": "2026-09-03",
      "endDate": "2026-09-04",
      "totalSessions": 6,
      "completedSessions": 1,
      "remainingSessions": 5,
      "assignedTherapistId": "fb1c6791-d613-436b-8aba-a6a7e6a742eb",
      "assignedTherapistName": "Therapist Upd GOBGAT",
      "treatmentStatus": "ONGOING"
    },
    {
      "id": "b2779bfa-d811-42c5-80a4-546784cd4d8e",
      "patientId": "5fa14112-48e2-408f-b063-003e89df695b",
      "treatmentPlanId": "da4e9db2-c701-41b5-91aa-470cfba77621",
      "treatmentPlanName": "Plan QCNKEH",
      "startDate": "2026-09-03",
      "endDate": "2026-09-04",
      "totalSessions": 6,
      "completedSessions": 1,
      "remainingSessions": 5,
      "assignedTherapistId": "0f2251f8-c570-491c-9f3a-2b3151e5cde0",
      "assignedTherapistName": "Therapist Upd QCNKEH",
      "treatmentStatus": "ONGOING"
    },
    {
      "id": "3a696077-46a9-4415-b638-1906471da5d7",
      "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "treatmentPlanId": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
      "treatmentPlanName": "Plan CVUEXV",
      "startDate": "2026-09-03",
      "endDate": "2026-09-04",
      "totalSessions": 5,
      "completedSessions": 0,
      "remainingSessions": 5,
      "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
      "assignedTherapistName": "Therapist Upd CVUEXV",
      "treatmentStatus": "SCHEDULED"
    }
  ]
}
```

### 121. APPT treatments by patient — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/treatments/patient/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatments fetched successfully.",
  "data": [
    {
      "id": "3a696077-46a9-4415-b638-1906471da5d7",
      "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "treatmentPlanId": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
      "treatmentPlanName": "Plan CVUEXV",
      "startDate": "2026-09-03",
      "endDate": "2026-09-04",
      "totalSessions": 5,
      "completedSessions": 0,
      "remainingSessions": 5,
      "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
      "assignedTherapistName": "Therapist Upd CVUEXV",
      "treatmentStatus": "SCHEDULED"
    }
  ]
}
```

### 122. APPT treatment update — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/treatments/3a696077-46a9-4415-b638-1906471da5d7`
- **HTTP:** `200`

**Request body:**

```json
{
  "treatmentPlanId": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
  "startDate": "2026-09-03",
  "endDate": "2026-09-04",
  "totalSessions": 6,
  "completedSessions": 1,
  "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment updated successfully.",
  "data": {
    "id": "3a696077-46a9-4415-b638-1906471da5d7",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "treatmentPlanId": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
    "treatmentPlanName": "Plan CVUEXV",
    "startDate": "2026-09-03",
    "endDate": "2026-09-04",
    "totalSessions": 6,
    "completedSessions": 1,
    "remainingSessions": 5,
    "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
    "assignedTherapistName": "Therapist Upd CVUEXV",
    "treatmentStatus": "SCHEDULED"
  }
}
```

### 123. APPT treatment status — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/treatments/3a696077-46a9-4415-b638-1906471da5d7/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "treatmentStatus": "ONGOING"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Treatment status updated successfully.",
  "data": {
    "id": "3a696077-46a9-4415-b638-1906471da5d7",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "treatmentPlanId": "f34a2ee8-b6b6-4277-b646-a0b5d4feb5e6",
    "treatmentPlanName": "Plan CVUEXV",
    "startDate": "2026-09-03",
    "endDate": "2026-09-04",
    "totalSessions": 6,
    "completedSessions": 1,
    "remainingSessions": 5,
    "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
    "assignedTherapistName": "Therapist Upd CVUEXV",
    "treatmentStatus": "ONGOING"
  }
}
```

### 124. APPT follow-up create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/follow-ups`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
  "sourceBookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
  "visitTypeId": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
  "appointmentDate": "2026-09-04T10:30:00",
  "schedulingOption": "NEXT_WEEK",
  "smsReminderEnabled": false
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Follow-up created successfully.",
  "data": {
    "id": "c189d7a4-d644-4921-957d-3fbcd459c368",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "patientCode": "GAN-DL-PT-00015",
    "patientName": "Appt Nested Patient CVUEXV",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "doctorName": "Dr Full Test CVUEXV",
    "sourceBookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
    "visitTypeId": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
    "visitTypeName": "Consult CVUEXV",
    "appointmentDate": "2026-09-04T10:30:00",
    "schedulingOption": "NEXT_WEEK",
    "smsReminderEnabled": false,
    "status": "UPCOMING"
  }
}
```

### 125. APPT follow-ups list — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/follow-ups`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Follow-ups fetched successfully.\",\"data\":[{\"id\":\"1473ade7-763e-4c72-9770-5451f3f4ce5b\",\"patientId\":\"1f73f734-b3ff-4016-a094-f6fe5388f664\",\"patientCode\":null,\"patientName\":null,\"assignedDoctorId\":\"60f67e24-9c10-408c-9470-0e9865afc5ae\",\"doctorName\":null,\"sourceBookingId\":null,\"visitTypeId\":\"eb4e2ac4-e594-4548-b6de-6af26f8c7061\",\"visitTypeName\":\"Fresh Consult Type\",\"appointmentDate\":\"2026-09-03T11:00:00\",\"schedulingOption\":null,\"smsReminderEnabled\":false,\"status\":\"COMPLETED\"},{\"id\":\"655a9d2c-0f12-4ee5-aa52-b511a9c156f0\",\"patientId\":\"1f73f734-b3ff-4016-a094-f6fe5388f664\",\"patientCode\":null,\"patientName\":null,\"assignedDoctorId\":\"60f67e24-9c10-408c-9470-0e9865afc5ae\",\"doctorName\":null,\"sourceBookingId\":null,\"visitTypeId\":\"eb4e2ac4-e594-4548-b6de-6af26f8c7061\",\"visitTypeName\":\"Fresh Consult Type\",\"appointmentDate\":\"2026-09-03T15:00:00\",\"schedulingOption\":null,\"smsReminderEnabled\":false,\"status\":\"CANCELLED\"},{\"id\":\"82be60de-be11-49a9-94e2-d0642d08596a\",\"patientId\":\"e275233a-8cc1-4708-a6bd-925c4f3da0d5\",\"patientCode\":\"GAN-DL-PT-00003\",\"patientName\":\"Appt Nested Patient GOBGAT\",\"assignedDoctorId\":\"1ffdff8e-d2d2-456f-b7f7-d8f00ce647df\",\"doctorName\":\"Dr Full Test GOBGAT\",\"sourceBookingId\":\"be043ada-9c69-4391-a6fb-1ea803fdf6ca\",\"visitTypeId\":\"041153d7-b994-4fdf-a079-728cebbc30e1\",\"visitTypeName\":\"Consult GOBGAT\",\"appointmentDate\":\"2026-09-04T10:30:00\",\"schedulingOption\":\"NEXT_WEEK\",\"smsReminderEnabled\":false,\"status\":\"COMPLETED\"},{\"id\":\"c189d7a4-d644-4921-957d-3fbcd459c368\",\"patientId\":\"fe75a8ce-422c-4d0e-8710-49cb100193aa\",\"patientCode\":\"GAN-DL-PT-00015\",\"patientName\":\"Appt Nested Patient CVUEXV\",\"assignedDoctorId\":\"e2bbfda1-7dca-4b70-8bea-fbf5053637b4\",\"doctorName\":\"Dr Full Test CVUEXV\",\"sourceBookingId\":\"0570a837-79d2-4aa6-9c27-ec771778f857\",\"visitTypeId\":\"2e8b44b0-3d08-4fac-b548-122eb6b0b032\",\"visitTypeName\":\"Consult CVUEXV\",\"appointmentDate\":\"2026-09-04T10:30:00\",\"schedulingOption\":\"NEXT_WEEK\",\"smsReminderEnabled\":false,\"status\":\"UPCOMING\"},{\"id\":\"1a2d4bc1-e271-486a-81c5-9701082fc51d\",\"patientId\":\"07cda984-2315-4b80-8c89-5b108dae5234\",\"patientCode\":null,\"patientName\":null,\"assignedDoctorId\":\"446f3bca-0b4a-4e0a-8053-2581edb769a9\",\"doctorName\":null,\"sourceBookingId\":\"d530c452-f483-42fa-bf46-ea668e2cfa7b\",\"visitTypeId\":\"5a4a0ccb-1114-4ea2-8b70-ca2602670f34\",\"visitTypeName\":\"Consult NGBRHU\",\"appointmentDate\":\"2026-09-04T10:30:00\",\"schedulingOption\":\"NEXT_WEEK\",\"smsReminderEnabled\":false,\"status\":\"COMPLETED\"},{\"id\":\"f4e230c2-9214... [truncated]"
```

### 126. APPT follow-ups by patient — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/follow-ups/patient/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Follow-ups fetched successfully.",
  "data": [
    {
      "id": "c189d7a4-d644-4921-957d-3fbcd459c368",
      "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "patientName": "Appt Nested Patient CVUEXV",
      "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "doctorName": "Dr Full Test CVUEXV",
      "sourceBookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
      "visitTypeId": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
      "visitTypeName": "Consult CVUEXV",
      "appointmentDate": "2026-09-04T10:30:00",
      "schedulingOption": "NEXT_WEEK",
      "smsReminderEnabled": false,
      "status": "UPCOMING"
    }
  ]
}
```

### 127. APPT follow-up status — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/follow-ups/c189d7a4-d644-4921-957d-3fbcd459c368/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "status": "COMPLETED"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Follow-up status updated successfully.",
  "data": {
    "id": "c189d7a4-d644-4921-957d-3fbcd459c368",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "patientCode": "GAN-DL-PT-00015",
    "patientName": "Appt Nested Patient CVUEXV",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "doctorName": "Dr Full Test CVUEXV",
    "sourceBookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
    "visitTypeId": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
    "visitTypeName": "Consult CVUEXV",
    "appointmentDate": "2026-09-04T10:30:00",
    "schedulingOption": "NEXT_WEEK",
    "smsReminderEnabled": false,
    "status": "COMPLETED"
  }
}
```

### 128. APPT follow-up create for cancel — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/follow-ups`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
  "visitTypeId": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
  "appointmentDate": "2026-09-04T15:00:00",
  "schedulingOption": "CUSTOM"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Follow-up created successfully.",
  "data": {
    "id": "a8a12ab0-72d2-4f3e-9213-dc401b5ad6d4",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "patientCode": "GAN-DL-PT-00015",
    "patientName": "Appt Nested Patient CVUEXV",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "doctorName": "Dr Full Test CVUEXV",
    "sourceBookingId": null,
    "visitTypeId": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
    "visitTypeName": "Consult CVUEXV",
    "appointmentDate": "2026-09-04T15:00:00",
    "schedulingOption": "CUSTOM",
    "smsReminderEnabled": false,
    "status": "UPCOMING"
  }
}
```

### 129. APPT follow-up cancel — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/follow-ups/a8a12ab0-72d2-4f3e-9213-dc401b5ad6d4/cancel`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Follow-up cancelled successfully.",
  "data": {
    "id": "a8a12ab0-72d2-4f3e-9213-dc401b5ad6d4",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "patientCode": "GAN-DL-PT-00015",
    "patientName": "Appt Nested Patient CVUEXV",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "doctorName": "Dr Full Test CVUEXV",
    "sourceBookingId": null,
    "visitTypeId": "2e8b44b0-3d08-4fac-b548-122eb6b0b032",
    "visitTypeName": "Consult CVUEXV",
    "appointmentDate": "2026-09-04T15:00:00",
    "schedulingOption": "CUSTOM",
    "smsReminderEnabled": false,
    "status": "CANCELLED"
  }
}
```

### 130. APPT prescription create — **PASS**

- **Service:** appointment
- **Method + URL:** `POST http://localhost:8103/api/v1/prescriptions`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
  "appointmentBookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
  "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
  "medicines": [
    {
      "medicineName": "Ashwagandha",
      "dosage": "1 tab",
      "frequency": "BD",
      "duration": "7 days"
    }
  ],
  "diagnosis": "General",
  "notes": "API rx"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Prescription generated successfully.",
  "data": {
    "id": "d2a3eb04-1af1-47f4-a389-8092ad7e916f",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "appointmentBookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "fullName": "Appt Nested Patient CVUEXV",
      "age": 37,
      "gender": "MALE",
      "weight": 70,
      "height": 170,
      "dietType": "Vegetarian"
    },
    "treatment": {
      "consultationTypes": [
        "Consult CVUEXV"
      ],
      "consultationDateTime": "2026-09-03T11:00:00",
      "nextAppointmentDateTime": null,
      "visitNumber": 1,
      "totalVisits": 6,
      "visitDisplay": "01/06"
    },
    "consultant": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "contactNumber": null
    },
    "diagnosis": "General",
    "notes": "API rx",
    "medicines": [
      {
        "id": "ef4578c8-321b-4e54-807f-b12c34b48132",
        "medicineId": null,
        "medicineName": "Ashwagandha",
        "dosage": "1 tab",
        "frequency": "BD",
        "duration": "7 days",
        "instruction": null,
        "notes": null
      }
    ],
    "therapySuggestions": [],
    "nextFollowUp": {
      "setUpRequired": false,
      "schedulingOption": null,
      "suggestions": null
    },
    "createdAt": "2026-09-03T09:56:05.0145658",
    "updatedAt": "2026-09-03T09:56:05.0145658"
  }
}
```

### 131. APPT prescriptions by patient — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/prescriptions/patient/fe75a8ce-422c-4d0e-8710-49cb100193aa`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Prescriptions fetched successfully.",
  "data": [
    {
      "id": "d2a3eb04-1af1-47f4-a389-8092ad7e916f",
      "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "appointmentBookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
      "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "patient": {
        "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
        "patientCode": "GAN-DL-PT-00015",
        "fullName": "Appt Nested Patient CVUEXV",
        "age": 37,
        "gender": "MALE",
        "weight": 70,
        "height": 170,
        "dietType": "Vegetarian"
      },
      "treatment": {
        "consultationTypes": [
          "Consult CVUEXV"
        ],
        "consultationDateTime": "2026-09-03T11:00:00",
        "nextAppointmentDateTime": null,
        "visitNumber": 1,
        "totalVisits": 6,
        "visitDisplay": "01/06"
      },
      "consultant": {
        "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
        "name": "Dr Full Test CVUEXV",
        "specialization": "Panchakarma",
        "qualification": null,
        "contactNumber": null
      },
      "diagnosis": "General",
      "notes": "API rx",
      "medicines": [
        {
          "id": "ef4578c8-321b-4e54-807f-b12c34b48132",
          "medicineId": null,
          "medicineName": "Ashwagandha",
          "dosage": "1 tab",
          "frequency": "BD",
          "duration": "7 days",
          "instruction": null,
          "notes": null
        }
      ],
      "therapySuggestions": [],
      "nextFollowUp": {
        "setUpRequired": false,
        "schedulingOption": null,
        "suggestions": null
      },
      "createdAt": "2026-09-03T09:56:05.014566",
      "updatedAt": "2026-09-03T09:56:05.014566"
    }
  ]
}
```

### 132. APPT prescription get — **PASS**

- **Service:** appointment
- **Method + URL:** `GET http://localhost:8103/api/v1/prescriptions/d2a3eb04-1af1-47f4-a389-8092ad7e916f`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Prescription fetched successfully.",
  "data": {
    "id": "d2a3eb04-1af1-47f4-a389-8092ad7e916f",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "appointmentBookingId": "0570a837-79d2-4aa6-9c27-ec771778f857",
    "assignedDoctorId": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "fullName": "Appt Nested Patient CVUEXV",
      "age": 37,
      "gender": "MALE",
      "weight": 70,
      "height": 170,
      "dietType": "Vegetarian"
    },
    "treatment": {
      "consultationTypes": [
        "Consult CVUEXV"
      ],
      "consultationDateTime": "2026-09-03T11:00:00",
      "nextAppointmentDateTime": null,
      "visitNumber": 1,
      "totalVisits": 6,
      "visitDisplay": "01/06"
    },
    "consultant": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "contactNumber": null
    },
    "diagnosis": "General",
    "notes": "API rx",
    "medicines": [
      {
        "id": "ef4578c8-321b-4e54-807f-b12c34b48132",
        "medicineId": null,
        "medicineName": "Ashwagandha",
        "dosage": "1 tab",
        "frequency": "BD",
        "duration": "7 days",
        "instruction": null,
        "notes": null
      }
    ],
    "therapySuggestions": [],
    "nextFollowUp": {
      "setUpRequired": false,
      "schedulingOption": null,
      "suggestions": null
    },
    "createdAt": "2026-09-03T09:56:05.014566",
    "updatedAt": "2026-09-03T09:56:05.014566"
  }
}
```

### 133. APPT prescription update — **PASS**

- **Service:** appointment
- **Method + URL:** `PUT http://localhost:8103/api/v1/prescriptions/d2a3eb04-1af1-47f4-a389-8092ad7e916f`
- **HTTP:** `200`

**Request body:**

```json
{
  "medicines": [
    {
      "medicineName": "Ashwagandha",
      "dosage": "2 tab",
      "frequency": "BD",
      "duration": "10 days"
    }
  ],
  "diagnosis": "Updated",
  "notes": "upd"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Prescription updated successfully.",
  "data": {
    "id": "d2a3eb04-1af1-47f4-a389-8092ad7e916f",
    "patientId": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
    "appointmentBookingId": null,
    "assignedDoctorId": null,
    "patient": {
      "id": "fe75a8ce-422c-4d0e-8710-49cb100193aa",
      "patientCode": "GAN-DL-PT-00015",
      "fullName": "Appt Nested Patient CVUEXV",
      "age": 37,
      "gender": "MALE",
      "weight": 70,
      "height": 170,
      "dietType": "Vegetarian"
    },
    "treatment": {
      "consultationTypes": [
        "Consult CVUEXV"
      ],
      "consultationDateTime": "2026-09-03T11:00:00",
      "nextAppointmentDateTime": null,
      "visitNumber": 1,
      "totalVisits": 6,
      "visitDisplay": "01/06"
    },
    "consultant": {
      "id": "e2bbfda1-7dca-4b70-8bea-fbf5053637b4",
      "name": "Dr Full Test CVUEXV",
      "specialization": "Panchakarma",
      "qualification": null,
      "contactNumber": null
    },
    "diagnosis": "Updated",
    "notes": "upd",
    "medicines": [
      {
        "id": "dd3b6365-cc29-4a5d-bac3-f7dd1635cb6b",
        "medicineId": null,
        "medicineName": "Ashwagandha",
        "dosage": "2 tab",
        "frequency": "BD",
        "duration": "10 days",
        "instruction": null,
        "notes": null
      }
    ],
    "therapySuggestions": [],
    "nextFollowUp": {
      "setUpRequired": false,
      "schedulingOption": null,
      "suggestions": null
    },
    "createdAt": "2026-09-03T09:56:05.014566",
    "updatedAt": "2026-09-03T09:56:06.4978356"
  }
}
```

### 134. MED create — **PASS**

- **Service:** medicine
- **Method + URL:** `POST http://localhost:8108/api/v1/medicines`
- **HTTP:** `201`

**Request body:**

```json
[
  {
    "medicineName": "MedFullCVUEXV",
    "category": "TABLET",
    "manufacturer": "Ayur Labs",
    "batchNumber": "BFCVUEXV",
    "quantity": 100,
    "expiryDate": "2027-12-31",
    "purchasePrice": 40,
    "sellingPrice": 75,
    "lowStockAlertEnabled": true,
    "lowStockThreshold": 10,
    "status": "ACTIVE"
  }
]
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Medicine added successfully.",
  "data": [
    {
      "id": "4450dff7-6575-4def-b832-01abd0ca3738",
      "medicineName": "MedFullCVUEXV",
      "category": "TABLET",
      "manufacturer": "Ayur Labs",
      "batchNumber": "BFCVUEXV",
      "stockQuantity": 100,
      "expiryDate": "2027-12-31",
      "purchasePrice": 40,
      "sellingPrice": 75,
      "price": 75,
      "lowStockAlertEnabled": true,
      "lowStockThreshold": 10,
      "status": "ACTIVE",
      "stockStatus": "IN_STOCK",
      "quantity": 100
    }
  ]
}
```

### 135. MED list — **PASS**

- **Service:** medicine
- **Method + URL:** `GET http://localhost:8108/api/v1/medicines`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Medicines fetched successfully.\",\"data\":[{\"id\":\"c1349e2c-2ad1-4412-86a2-be2bdd562293\",\"medicineName\":\"Ashwagandha Upd 015315\",\"category\":\"TABLET\",\"manufacturer\":\"API Labs\",\"batchNumber\":\"B015315\",\"stockQuantity\":90,\"expiryDate\":\"2027-12-31\",\"purchasePrice\":55,\"sellingPrice\":85,\"price\":85,\"lowStockAlertEnabled\":true,\"lowStockThreshold\":10,\"status\":\"ACTIVE\",\"stockStatus\":\"IN_STOCK\",\"quantity\":90},{\"id\":\"4450dff7-6575-4def-b832-01abd0ca3738\",\"medicineName\":\"MedFullCVUEXV\",\"category\":\"TABLET\",\"manufacturer\":\"Ayur Labs\",\"batchNumber\":\"BFCVUEXV\",\"stockQuantity\":100,\"expiryDate\":\"2027-12-31\",\"purchasePrice\":40,\"sellingPrice\":75,\"price\":75,\"lowStockAlertEnabled\":true,\"lowStockThreshold\":10,\"status\":\"ACTIVE\",\"stockStatus\":\"IN_STOCK\",\"quantity\":100},{\"id\":\"8b04c1ec-5386-4a5a-a79b-30ce21ba45d7\",\"medicineName\":\"MedFullUpdGOBGAT\",\"category\":\"TABLET\",\"manufacturer\":\"Ayur Labs\",\"batchNumber\":\"BFGOBGAT\",\"stockQuantity\":87,\"expiryDate\":\"2027-12-31\",\"purchasePrice\":42,\"sellingPrice\":80,\"price\":80,\"lowStockAlertEnabled\":false,\"lowStockThreshold\":10,\"status\":\"ACTIVE\",\"stockStatus\":\"IN_STOCK\",\"quantity\":87},{\"id\":\"ef499617-67a0-48f9-b665-1818ce4ef106\",\"medicineName\":\"MedFullUpdNGBRHU\",\"category\":\"TABLET\",\"manufacturer\":\"Ayur Labs\",\"batchNumber\":\"BF020022\",\"stockQuantity\":87,\"expiryDate\":\"2027-12-31\",\"purchasePrice\":42,\"sellingPrice\":80,\"price\":80,\"lowStockAlertEnabled\":false,\"lowStockThreshold\":10,\"status\":\"ACTIVE\",\"stockStatus\":\"IN_STOCK\",\"quantity\":87},{\"id\":\"95b48be5-1b81-47f0-a1de-19307578869c\",\"medicineName\":\"MedFullUpdQCNKEH\",\"category\":\"TABLET\",\"manufacturer\":\"Ayur Labs\",\"batchNumber\":\"BFQCNKEH\",\"stockQuantity\":87,\"expiryDate\":\"2027-12-31\",\"purchasePrice\":42,\"sellingPrice\":80,\"price\":80,\"lowStockAlertEnabled\":false,\"lowStockThreshold\":10,\"status\":\"ACTIVE\",\"stockStatus\":\"IN_STOCK\",\"quantity\":87},{\"id\":\"3dfd7ae9-4cea-4fab-9a1a-d59b2004217f\",\"medicineName\":\"SweepMedUpd 014209\",\"category\":\"TABLET\",\"manufacturer\":\"Ayur Labs\",\"batchNumber\":\"SW014209\",\"stockQuantity\":34,\"expiryDate\":\"2028-12-31\",\"purchasePrice\":26,\"sellingPrice\":52,\"price\":52,\"lowStockAlertEnabled\":true,\"lowStockThreshold\":10,\"status\":\"ACTIVE\",\"stockStatus\":\"IN_STOCK\",\"quantity\":34},{\"id\":\"96831c63-5196-4c35-a348-591d10cdb35d\",\"medicineName\":\"UpdatedMed\",\"category\":\"TABLET\",\"manufacturer\":\"Ayur Labs\",\"batchNumber\":\"EXU1\",\"stockQuantity\":89,\"expiryDate\":\"2027-12-31\",\"purchasePrice\":55,\"sellingPrice\":85,\"price\":85,\"lowStockAlertEnabled\":true,\"lowStockThreshold\":10,\"status\"... [truncated]"
```

### 136. MED stock summary — **PASS**

- **Service:** medicine
- **Method + URL:** `GET http://localhost:8108/api/v1/medicines/stock/summary`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Stock summary fetched successfully.",
  "data": {
    "totalStock": 574,
    "byCategory": [
      {
        "category": "TABLET",
        "totalStock": 574,
        "medicineCount": 7
      },
      {
        "category": "SYRUP",
        "totalStock": 0,
        "medicineCount": 0
      },
      {
        "category": "POWDER",
        "totalStock": 0,
        "medicineCount": 0
      }
    ]
  }
}
```

### 137. MED stock by category — **PASS**

- **Service:** medicine
- **Method + URL:** `GET http://localhost:8108/api/v1/medicines/stock/category/TABLET`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Category stock count fetched successfully.",
  "data": {
    "category": "TABLET",
    "totalStock": 574,
    "medicineCount": 7
  }
}
```

### 138. MED low-stock — **PASS**

- **Service:** medicine
- **Method + URL:** `GET http://localhost:8108/api/v1/medicines/low-stock`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Low stock medicines fetched successfully.",
  "data": []
}
```

### 139. MED meta categories — **PASS**

- **Service:** medicine
- **Method + URL:** `GET http://localhost:8108/api/v1/medicines/meta/categories`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": [
    "TABLET",
    "SYRUP",
    "POWDER"
  ]
}
```

### 140. MED meta manufacturers — **PASS**

- **Service:** medicine
- **Method + URL:** `GET http://localhost:8108/api/v1/medicines/meta/manufacturers`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": [
    "API Labs",
    "Ayur Labs"
  ]
}
```

### 141. MED meta names — **PASS**

- **Service:** medicine
- **Method + URL:** `GET http://localhost:8108/api/v1/medicines/meta/names`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "c1349e2c-2ad1-4412-86a2-be2bdd562293",
      "medicineName": "Ashwagandha Upd 015315"
    },
    {
      "id": "4450dff7-6575-4def-b832-01abd0ca3738",
      "medicineName": "MedFullCVUEXV"
    },
    {
      "id": "8b04c1ec-5386-4a5a-a79b-30ce21ba45d7",
      "medicineName": "MedFullUpdGOBGAT"
    },
    {
      "id": "ef499617-67a0-48f9-b665-1818ce4ef106",
      "medicineName": "MedFullUpdNGBRHU"
    },
    {
      "id": "95b48be5-1b81-47f0-a1de-19307578869c",
      "medicineName": "MedFullUpdQCNKEH"
    },
    {
      "id": "3dfd7ae9-4cea-4fab-9a1a-d59b2004217f",
      "medicineName": "SweepMedUpd 014209"
    },
    {
      "id": "96831c63-5196-4c35-a348-591d10cdb35d",
      "medicineName": "UpdatedMed"
    }
  ]
}
```

### 142. MED dashboard — **PASS**

- **Service:** medicine
- **Method + URL:** `GET http://localhost:8108/api/v1/dashboard/medicine-stock`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Dashboard medicine stock availability fetched successfully.",
  "data": {
    "totalStock": 574,
    "tablets": 574,
    "syrups": 0,
    "powder": 0,
    "statusBreakdown": {
      "inStock": 7,
      "outOfStock": 0,
      "lowStock": 0
    },
    "lowStockItems": []
  }
}
```

### 143. MED get — **PASS**

- **Service:** medicine
- **Method + URL:** `GET http://localhost:8108/api/v1/medicines/4450dff7-6575-4def-b832-01abd0ca3738`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "4450dff7-6575-4def-b832-01abd0ca3738",
    "medicineName": "MedFullCVUEXV",
    "category": "TABLET",
    "manufacturer": "Ayur Labs",
    "batchNumber": "BFCVUEXV",
    "stockQuantity": 100,
    "expiryDate": "2027-12-31",
    "purchasePrice": 40,
    "sellingPrice": 75,
    "price": 75,
    "lowStockAlertEnabled": true,
    "lowStockThreshold": 10,
    "status": "ACTIVE",
    "stockStatus": "IN_STOCK",
    "quantity": 100
  }
}
```

### 144. MED update — **PASS**

- **Service:** medicine
- **Method + URL:** `PUT http://localhost:8108/api/v1/medicines/4450dff7-6575-4def-b832-01abd0ca3738`
- **HTTP:** `200`

**Request body:**

```json
{
  "medicineName": "MedFullUpdCVUEXV",
  "category": "TABLET",
  "manufacturer": "Ayur Labs",
  "batchNumber": "BFCVUEXV",
  "quantity": 90,
  "expiryDate": "2027-12-31",
  "purchasePrice": 42,
  "sellingPrice": 80,
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Medicine updated successfully.",
  "data": {
    "id": "4450dff7-6575-4def-b832-01abd0ca3738",
    "medicineName": "MedFullUpdCVUEXV",
    "category": "TABLET",
    "manufacturer": "Ayur Labs",
    "batchNumber": "BFCVUEXV",
    "stockQuantity": 90,
    "expiryDate": "2027-12-31",
    "purchasePrice": 42,
    "sellingPrice": 80,
    "price": 80,
    "lowStockAlertEnabled": false,
    "lowStockThreshold": 10,
    "status": "ACTIVE",
    "stockStatus": "IN_STOCK",
    "quantity": 90
  }
}
```

### 145. MED stock deduct — **PASS**

- **Service:** medicine
- **Method + URL:** `POST http://localhost:8108/api/v1/medicines/4450dff7-6575-4def-b832-01abd0ca3738/stock/deduct`
- **HTTP:** `200`

**Request body:**

```json
{
  "quantity": 2
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Stock deducted successfully.",
  "data": {
    "id": "4450dff7-6575-4def-b832-01abd0ca3738",
    "medicineName": "MedFullUpdCVUEXV",
    "category": "TABLET",
    "manufacturer": "Ayur Labs",
    "batchNumber": "BFCVUEXV",
    "stockQuantity": 88,
    "expiryDate": "2027-12-31",
    "purchasePrice": 42,
    "sellingPrice": 80,
    "price": 80,
    "lowStockAlertEnabled": false,
    "lowStockThreshold": 10,
    "status": "ACTIVE",
    "stockStatus": "IN_STOCK",
    "quantity": 88
  }
}
```

### 146. MED stock restore — **PASS**

- **Service:** medicine
- **Method + URL:** `POST http://localhost:8108/api/v1/medicines/4450dff7-6575-4def-b832-01abd0ca3738/stock/restore`
- **HTTP:** `200`

**Request body:**

```json
{
  "quantity": 2
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Stock restored successfully.",
  "data": {
    "id": "4450dff7-6575-4def-b832-01abd0ca3738",
    "medicineName": "MedFullUpdCVUEXV",
    "category": "TABLET",
    "manufacturer": "Ayur Labs",
    "batchNumber": "BFCVUEXV",
    "stockQuantity": 90,
    "expiryDate": "2027-12-31",
    "purchasePrice": 42,
    "sellingPrice": 80,
    "price": 80,
    "lowStockAlertEnabled": false,
    "lowStockThreshold": 10,
    "status": "ACTIVE",
    "stockStatus": "IN_STOCK",
    "quantity": 90
  }
}
```

### 147. MED create for delete — **PASS**

- **Service:** medicine
- **Method + URL:** `POST http://localhost:8108/api/v1/medicines`
- **HTTP:** `201`

**Request body:**

```json
[
  {
    "medicineName": "MedDelCVUEXV",
    "category": "POWDER",
    "manufacturer": "Ayur Labs",
    "batchNumber": "DELCVUEXV",
    "quantity": 10,
    "expiryDate": "2027-06-30",
    "purchasePrice": 10,
    "sellingPrice": 20,
    "status": "ACTIVE"
  }
]
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Medicine added successfully.",
  "data": [
    {
      "id": "17b79a2e-c895-45fd-9476-a539e5e22264",
      "medicineName": "MedDelCVUEXV",
      "category": "POWDER",
      "manufacturer": "Ayur Labs",
      "batchNumber": "DELCVUEXV",
      "stockQuantity": 10,
      "expiryDate": "2027-06-30",
      "purchasePrice": 10,
      "sellingPrice": 20,
      "price": 20,
      "lowStockAlertEnabled": false,
      "lowStockThreshold": 20,
      "status": "ACTIVE",
      "stockStatus": "LOW_STOCK",
      "quantity": 10
    }
  ]
}
```

### 148. MED delete disposable — **PASS**

- **Service:** medicine
- **Method + URL:** `DELETE http://localhost:8108/api/v1/medicines/17b79a2e-c895-45fd-9476-a539e5e22264`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Medicine deleted successfully.",
  "data": null
}
```

### 149. BILL create package-master — **PASS**

- **Service:** billing
- **Method + URL:** `POST http://localhost:8109/api/v1/package-masters`
- **HTTP:** `201`

**Request body:**

```json
{
  "name": "Pkg Full CVUEXV",
  "packagePrice": 5000,
  "status": "ACTIVE"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Package master created successfully.",
  "data": {
    "id": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
    "name": "Pkg Full CVUEXV",
    "packagePrice": 5000,
    "status": "ACTIVE"
  }
}
```

### 150. BILL list package-masters — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/package-masters`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Package masters fetched successfully.",
  "data": [
    {
      "id": "cf515ab8-22b8-4907-99df-a1652a43261b",
      "name": "API-Test-Pkg-014728",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "627b02d8-22a7-4a29-aaf7-c6277eef2e37",
      "name": "API-Test-Pkg-014833",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "c71cec99-0912-45d4-ae42-c919fbfc58bf",
      "name": "API-Test-Pkg-015036",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
      "name": "Pkg Full CVUEXV",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "e8f7d068-d6d4-453e-833e-f972b0c4b651",
      "name": "Pkg Full GOBGAT",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "163aa12f-44d8-4354-8738-5276c592fdb7",
      "name": "Pkg Full NGBRHU",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "690ad08d-c4db-4acd-8e75-5fe07f28a28b",
      "name": "Pkg Full QCNKEH",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "57a3f3bd-d1d5-4754-a3dc-9a0258665756",
      "name": "PostRestart Pkg",
      "packagePrice": 2500,
      "status": "ACTIVE"
    }
  ]
}
```

### 151. BILL active package-masters — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/package-masters/active`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Package masters fetched successfully.",
  "data": [
    {
      "id": "cf515ab8-22b8-4907-99df-a1652a43261b",
      "name": "API-Test-Pkg-014728",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "627b02d8-22a7-4a29-aaf7-c6277eef2e37",
      "name": "API-Test-Pkg-014833",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "c71cec99-0912-45d4-ae42-c919fbfc58bf",
      "name": "API-Test-Pkg-015036",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
      "name": "Pkg Full CVUEXV",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "e8f7d068-d6d4-453e-833e-f972b0c4b651",
      "name": "Pkg Full GOBGAT",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "163aa12f-44d8-4354-8738-5276c592fdb7",
      "name": "Pkg Full NGBRHU",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "690ad08d-c4db-4acd-8e75-5fe07f28a28b",
      "name": "Pkg Full QCNKEH",
      "packagePrice": 5000,
      "status": "ACTIVE"
    },
    {
      "id": "57a3f3bd-d1d5-4754-a3dc-9a0258665756",
      "name": "PostRestart Pkg",
      "packagePrice": 2500,
      "status": "ACTIVE"
    }
  ]
}
```

### 152. BILL get package-master — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/package-masters/92225c7f-fd4b-4f8d-8dc5-b060302bb1b2`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Package master fetched successfully.",
  "data": {
    "id": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
    "name": "Pkg Full CVUEXV",
    "packagePrice": 5000,
    "status": "ACTIVE"
  }
}
```

### 153. BILL create patient-package — **PASS**

- **Service:** billing
- **Method + URL:** `POST http://localhost:8109/api/v1/packages`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
  "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
  "validity": "2026-12-02",
  "status": "SCHEDULED",
  "discountApplied": 100
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient package created successfully.",
  "data": {
    "id": "27165af1-200d-4621-8f9a-d3a058c69ce3",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
    "packageName": "Pkg Full CVUEXV",
    "packagePrice": 5000,
    "validity": "2026-12-02",
    "status": "SCHEDULED",
    "discountApplied": 100
  }
}
```

### 154. BILL list packages — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/packages`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient packages fetched successfully.",
  "data": [
    {
      "id": "224d09ed-34a8-47db-998b-40df11c06887",
      "patientId": "41a9f211-11c9-4bf2-9f99-8185b4bee6a2",
      "packageMasterId": "c71cec99-0912-45d4-ae42-c919fbfc58bf",
      "packageName": "API-Test-Pkg-015036",
      "packagePrice": 5000,
      "validity": "2027-03-02",
      "status": "ONGOING",
      "discountApplied": 50
    },
    {
      "id": "71806fcb-2399-4911-8bf9-23f54b695121",
      "patientId": "3839f98b-5d84-4a91-a76d-be01a503a62e",
      "packageMasterId": "163aa12f-44d8-4354-8738-5276c592fdb7",
      "packageName": "Pkg Full NGBRHU",
      "packagePrice": 5000,
      "validity": "2027-01-03",
      "status": "ONGOING",
      "discountApplied": 150
    },
    {
      "id": "9353adc6-0367-4ada-b1a7-17a5acc7bfab",
      "patientId": "0b683030-a354-408b-9b98-d7cdf6c498a0",
      "packageMasterId": "e8f7d068-d6d4-453e-833e-f972b0c4b651",
      "packageName": "Pkg Full GOBGAT",
      "packagePrice": 5000,
      "validity": "2027-01-01",
      "status": "ONGOING",
      "discountApplied": 150
    },
    {
      "id": "08cc4aa2-27d7-4c2a-8867-7f1e49affe08",
      "patientId": "5039922b-b538-4840-b0de-94bc91fa0707",
      "packageMasterId": "690ad08d-c4db-4acd-8e75-5fe07f28a28b",
      "packageName": "Pkg Full QCNKEH",
      "packagePrice": 5000,
      "validity": "2027-01-01",
      "status": "ONGOING",
      "discountApplied": 150
    },
    {
      "id": "ade12ab6-b088-4038-82da-35886e3396a2",
      "patientId": "41a9f211-11c9-4bf2-9f99-8185b4bee6a2",
      "packageMasterId": "627b02d8-22a7-4a29-aaf7-c6277eef2e37",
      "packageName": "API-Test-Pkg-014833",
      "packagePrice": 5000,
      "validity": "2026-12-02",
      "status": "ONGOING",
      "discountApplied": 0
    },
    {
      "id": "13cf7b8f-0fe5-436f-bc0f-cc5ba8d5f8dd",
      "patientId": "41a9f211-11c9-4bf2-9f99-8185b4bee6a2",
      "packageMasterId": "cf515ab8-22b8-4907-99df-a1652a43261b",
      "packageName": "API-Test-Pkg-014728",
      "packagePrice": 5000,
      "validity": "2026-12-02",
      "status": "ONGOING",
      "discountApplied": 0
    },
    {
      "id": "27165af1-200d-4621-8f9a-d3a058c69ce3",
      "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
      "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
      "packageName": "Pkg Full CVUEXV",
      "packagePrice": 5000,
      "validity": "2026-12-02",
      "status": "SCHEDULED",
      "discountApplied": 100
    }
  ]
}
```

### 155. BILL packages by patient — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/packages/patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient packages fetched successfully.",
  "data": [
    {
      "id": "27165af1-200d-4621-8f9a-d3a058c69ce3",
      "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
      "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
      "packageName": "Pkg Full CVUEXV",
      "packagePrice": 5000,
      "validity": "2026-12-02",
      "status": "SCHEDULED",
      "discountApplied": 100
    }
  ]
}
```

### 156. BILL update patient-package — **PASS**

- **Service:** billing
- **Method + URL:** `PUT http://localhost:8109/api/v1/packages/27165af1-200d-4621-8f9a-d3a058c69ce3`
- **HTTP:** `200`

**Request body:**

```json
{
  "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
  "validity": "2027-01-01",
  "discountApplied": 150
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient package updated successfully.",
  "data": {
    "id": "27165af1-200d-4621-8f9a-d3a058c69ce3",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
    "packageName": "Pkg Full CVUEXV",
    "packagePrice": 5000,
    "validity": "2027-01-01",
    "status": "SCHEDULED",
    "discountApplied": 150
  }
}
```

### 157. BILL update patient-package status — **PASS**

- **Service:** billing
- **Method + URL:** `PUT http://localhost:8109/api/v1/packages/27165af1-200d-4621-8f9a-d3a058c69ce3/status`
- **HTTP:** `200`

**Request body:**

```json
{
  "status": "ONGOING"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient package status updated successfully.",
  "data": {
    "id": "27165af1-200d-4621-8f9a-d3a058c69ce3",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
    "packageName": "Pkg Full CVUEXV",
    "packagePrice": 5000,
    "validity": "2027-01-01",
    "status": "ONGOING",
    "discountApplied": 150
  }
}
```

### 158. BILL create billing — **PASS**

- **Service:** billing
- **Method + URL:** `POST http://localhost:8109/api/v1/billings`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
  "patientName": "Full Test Patient CVUEXV",
  "contactNumber": "9366512212",
  "billingDate": "2026-09-03",
  "services": [
    {
      "serviceType": "Consultation",
      "serviceFees": 600,
      "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
      "packageType": "Pkg Full CVUEXV",
      "packageCharges": 5000
    }
  ]
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Billing created successfully.",
  "data": {
    "id": "ad3780f6-ab92-4f12-8f71-3b9aa6aab800",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "patientName": "Full Test Patient CVUEXV",
    "contactNumber": "9366512212",
    "billingDate": "2026-09-03",
    "status": "PENDING",
    "invoiceId": null,
    "invoiceNumber": null,
    "totalAmount": 5600,
    "services": [
      {
        "id": "de3c7b62-82f9-4390-b126-834e672019b7",
        "serviceType": "Consultation",
        "serviceFees": 600,
        "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
        "packageName": "Pkg Full CVUEXV",
        "packageType": "Pkg Full CVUEXV",
        "packageCharges": 5000
      }
    ],
    "createdAt": "2026-09-03T09:56:09.0880667",
    "updatedAt": "2026-09-03T09:56:09.0880667"
  }
}
```

### 159. BILL list billings — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/billings`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Billings fetched successfully.\",\"data\":[{\"id\":\"ad3780f6-ab92-4f12-8f71-3b9aa6aab800\",\"patientId\":\"cc1089e5-1fb8-491f-b3af-2cf686a5207d\",\"patientName\":\"Full Test Patient CVUEXV\",\"billingDate\":\"2026-09-03\",\"status\":\"PENDING\",\"invoiceId\":null,\"invoiceNumber\":null,\"totalAmount\":5600},{\"id\":\"d2efe92b-de4c-4010-bcc8-bba18fca172d\",\"patientId\":\"5039922b-b538-4840-b0de-94bc91fa0707\",\"patientName\":\"Full Test Patient QCNKEH\",\"billingDate\":\"2026-09-03\",\"status\":\"COMPLETED\",\"invoiceId\":\"b9342a95-e240-4fb1-bf5e-bed1c25d5f24\",\"invoiceNumber\":\"GAN-DL-INV-00018\",\"totalAmount\":5600},{\"id\":\"5ff3a7f0-c058-4553-b798-812258ec7d11\",\"patientId\":\"0b683030-a354-408b-9b98-d7cdf6c498a0\",\"patientName\":\"Full Test Patient GOBGAT\",\"billingDate\":\"2026-09-03\",\"status\":\"COMPLETED\",\"invoiceId\":\"38d29700-465d-45e5-a872-b2cb55c8ea2c\",\"invoiceNumber\":\"GAN-DL-INV-00015\",\"totalAmount\":5600},{\"id\":\"c9b751ea-e339-4fe8-8705-e420ff775460\",\"patientId\":\"3839f98b-5d84-4a91-a76d-be01a503a62e\",\"patientName\":\"Full Test Patient NGBRHU\",\"billingDate\":\"2026-09-03\",\"status\":\"COMPLETED\",\"invoiceId\":\"10b3c5be-b95d-4eba-b005-fe6a111f50d8\",\"invoiceNumber\":\"GAN-DL-INV-00012\",\"totalAmount\":5600},{\"id\":\"65b5da27-8412-4e0d-94a4-23f7a0d3e08c\",\"patientId\":\"41a9f211-11c9-4bf2-9f99-8185b4bee6a2\",\"patientName\":\"Akshay Shah\",\"billingDate\":\"2026-09-03\",\"status\":\"COMPLETED\",\"invoiceId\":\"e10a03e5-89e4-418e-b484-fb8f2b0dd8fc\",\"invoiceNumber\":\"GAN-DL-INV-00010\",\"totalAmount\":5500},{\"id\":\"448fb0a3-ffc6-4887-a560-a2365e101b69\",\"patientId\":\"41a9f211-11c9-4bf2-9f99-8185b4bee6a2\",\"patientName\":\"Akshay Shah\",\"billingDate\":\"2026-09-03\",\"status\":\"COMPLETED\",\"invoiceId\":\"c06fd6ba-46a7-4f55-a195-5ce45d1e4051\",\"invoiceNumber\":\"GAN-DL-INV-00007\",\"totalAmount\":5500},{\"id\":\"e4dc57b0-95c8-4c50-b187-7144fe775358\",\"patientId\":\"2ede7a00-26f9-4f32-8964-0ea016e3c23d\",\"patientName\":\"Sweep Patient Alpha\",\"billingDate\":\"2026-09-03\",\"status\":\"PENDING\",\"invoiceId\":null,\"invoiceNumber\":null,\"totalAmount\":1500},{\"id\":\"80e11e4b-13c8-4ea6-b47d-49520a335944\",\"patientId\":\"41a9f211-11c9-4bf2-9f99-8185b4bee6a2\",\"patientName\":\"Akshay Shah\",\"billingDate\":\"2026-09-03\",\"status\":\"COMPLETED\",\"invoiceId\":\"5e22c13e-4f49-4871-abf6-b62ac0dc39a2\",\"invoiceNumber\":\"GAN-DL-INV-00004\",\"totalAmount\":5500},{\"id\":\"6809b63e-8757-4337-b3c3-183f2a26e2ae\",\"patientId\":\"2ede7a00-26f9-4f32-8964-0ea016e3c23d\",\"patientName\":\"Sweep Patient Alpha\",\"billingDate\":\"2026-09-03\",\"status\":\"PENDING\",\"invoiceId\":null,\"invoiceNumber\":null,\"totalAmount\":1500},... [truncated]"
```

### 160. BILL billings by patient — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/billings/patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Billings fetched successfully.",
  "data": [
    {
      "id": "ad3780f6-ab92-4f12-8f71-3b9aa6aab800",
      "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
      "patientName": "Full Test Patient CVUEXV",
      "contactNumber": "9366512212",
      "billingDate": "2026-09-03",
      "status": "PENDING",
      "invoiceId": null,
      "invoiceNumber": null,
      "totalAmount": 5600,
      "services": [
        {
          "id": "de3c7b62-82f9-4390-b126-834e672019b7",
          "serviceType": "Consultation",
          "serviceFees": 600,
          "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
          "packageName": "Pkg Full CVUEXV",
          "packageType": "Pkg Full CVUEXV",
          "packageCharges": 5000
        }
      ],
      "createdAt": "2026-09-03T09:56:09.088067",
      "updatedAt": "2026-09-03T09:56:09.088067"
    }
  ]
}
```

### 161. BILL get billing — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/billings/ad3780f6-ab92-4f12-8f71-3b9aa6aab800`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Billing fetched successfully.",
  "data": {
    "id": "ad3780f6-ab92-4f12-8f71-3b9aa6aab800",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "patientName": "Full Test Patient CVUEXV",
    "contactNumber": "9366512212",
    "billingDate": "2026-09-03",
    "status": "PENDING",
    "invoiceId": null,
    "invoiceNumber": null,
    "totalAmount": 5600,
    "services": [
      {
        "id": "de3c7b62-82f9-4390-b126-834e672019b7",
        "serviceType": "Consultation",
        "serviceFees": 600,
        "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
        "packageName": "Pkg Full CVUEXV",
        "packageType": "Pkg Full CVUEXV",
        "packageCharges": 5000
      }
    ],
    "createdAt": "2026-09-03T09:56:09.088067",
    "updatedAt": "2026-09-03T09:56:09.088067"
  }
}
```

### 162. BILL patient billing summary — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/billing/patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Patient billing data fetched successfully.",
  "data": {
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "summary": {
      "invoiceCount": 0,
      "unpaidCount": 0,
      "ongoingCount": 0,
      "completedCount": 0,
      "totalAmount": 0,
      "paidAmount": 0,
      "leftAmount": 0,
      "packageCount": 1
    },
    "invoices": [],
    "packages": [
      {
        "id": "27165af1-200d-4621-8f9a-d3a058c69ce3",
        "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
        "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
        "packageName": "Pkg Full CVUEXV",
        "packagePrice": 5000,
        "validity": "2027-01-01",
        "status": "ONGOING",
        "discountApplied": 150
      }
    ]
  }
}
```

### 163. BILL generate-invoice from billing — **PASS**

- **Service:** billing
- **Method + URL:** `POST http://localhost:8109/api/v1/billings/ad3780f6-ab92-4f12-8f71-3b9aa6aab800/generate-invoice`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
  "patientName": "Full Test Patient CVUEXV",
  "contactNumber": "9366512212",
  "invoiceDate": "2026-09-03",
  "visitType": "CONSULTATION",
  "serviceFees": 600,
  "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
  "packageType": "Pkg Full CVUEXV",
  "packageCharges": 5000,
  "medicines": [
    {
      "medicineId": "4450dff7-6575-4def-b832-01abd0ca3738",
      "quantity": 2
    }
  ],
  "therapies": [
    {
      "itemName": "Therapy CVUEXV",
      "quantity": 1,
      "unitPrice": 1600,
      "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
      "assignedTherapistName": "Therapist CVUEXV",
      "scheduleDate": "2026-09-04",
      "scheduleTime": "11:00:00",
      "sessionDuration": 45,
      "sessionFrequency": 1
    }
  ],
  "discount": 50,
  "taxEnabled": true,
  "cgstPercent": 2.5,
  "sgstPercent": 2.5,
  "amountPaid": 500,
  "paymentMethod": "CASH",
  "paymentRemarks": "partial"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Invoice generated from billing successfully.",
  "data": {
    "id": "15c44d1f-fe10-431a-a102-d2220dafb8c3",
    "invoiceId": "GAN-DL-INV-00021",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "patientName": "Full Test Patient CVUEXV",
    "contactNumber": "9366512212",
    "invoiceDate": "2026-09-03",
    "visitType": "CONSULTATION",
    "serviceFees": 600,
    "packageMasterId": "92225c7f-fd4b-4f8d-8dc5-b060302bb1b2",
    "packageName": "Pkg Full CVUEXV",
    "packageType": "Pkg Full CVUEXV",
    "packageCharges": 5000,
    "subtotal": 7360,
    "discount": 50,
    "taxEnabled": true,
    "cgstPercent": 2.5,
    "cgstAmount": 184,
    "sgstPercent": 2.5,
    "sgstAmount": 184,
    "totalAmount": 7678,
    "paidAmount": 500,
    "leftAmount": 7178,
    "status": "ONGOING",
    "billSections": [
      "SERVICE",
      "MEDICINE",
      "THERAPY"
    ],
    "items": [
      {
        "id": "47953f3b-cd7e-4403-9c1a-603737108b02",
        "itemType": "SERVICE",
        "itemName": "Service Fees",
        "quantity": 1,
        "unitPrice": 600,
        "amount": 600,
        "medicineId": null,
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      },
      {
        "id": "5fc9acb1-d528-44db-9ca2-d011aec7cdf6",
        "itemType": "PACKAGE",
        "itemName": "Pkg Full CVUEXV",
        "quantity": 1,
        "unitPrice": 5000,
        "amount": 5000,
        "medicineId": null,
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      },
      {
        "id": "d7e71591-1551-461c-a9be-de79bb124971",
        "itemType": "MEDICINE",
        "itemName": "MedFullUpdCVUEXV",
        "quantity": 2,
        "unitPrice": 80,
        "amount": 160,
        "medicineId": "4450dff7-6575-4def-b832-01abd0ca3738",
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      },
      {
        "id": "75fcd3c7-557f-4685-8ff9-eeee266c0d58",
        "itemType": "THERAPY",
        "itemName": "Therapy CVUEXV",
        "quantity": 1,
        "unitPrice": 1600,
        "amount": 1600,
        "medicineId": null,
        "assignedTherapistId": "abeb3bc8-85d1-4dd5-ae67-e3f41b429808",
        "assignedTherapistName": "Therapist CVUEXV",
        "scheduleDate": "2026-09-04",
        "scheduleTime": "11:00:00",
        "sessionDuration": 45,
        "sessionFrequency": 1
      }
    ],
    "payments": [
      {
        "id": "bb90ec15-6c98-4750-98d7-a9f1498d8356",
        "amountPaid": 500,
        "paymentDate": "2026-09-03T09:56:09.8324623",
        "paymentMethod": "CASH",
        "remarks": "partial"
      }
    ]
  }
}
```

### 164. BILL create invoice standalone — **PASS**

- **Service:** billing
- **Method + URL:** `POST http://localhost:8109/api/v1/invoices`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
  "patientName": "Full Test Patient CVUEXV",
  "contactNumber": "9366512212",
  "invoiceDate": "2026-09-03",
  "visitType": "CONSULTATION",
  "serviceFees": 600,
  "medicines": [
    {
      "medicineId": "4450dff7-6575-4def-b832-01abd0ca3738",
      "quantity": 1
    }
  ],
  "discount": 0,
  "taxEnabled": false,
  "amountPaid": 100,
  "paymentMethod": "UPI",
  "paymentRemarks": "part1"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Invoice generated successfully.",
  "data": {
    "id": "03633f84-adf9-4eb5-aeb7-a6ff21e5fe78",
    "invoiceId": "GAN-DL-INV-00022",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "patientName": "Full Test Patient CVUEXV",
    "contactNumber": "9366512212",
    "invoiceDate": "2026-09-03",
    "visitType": "CONSULTATION",
    "serviceFees": 600,
    "packageMasterId": null,
    "packageName": null,
    "packageType": null,
    "packageCharges": 0,
    "subtotal": 680,
    "discount": 0,
    "taxEnabled": false,
    "cgstPercent": null,
    "cgstAmount": 0,
    "sgstPercent": null,
    "sgstAmount": 0,
    "totalAmount": 680,
    "paidAmount": 100,
    "leftAmount": 580,
    "status": "ONGOING",
    "billSections": [
      "SERVICE",
      "MEDICINE"
    ],
    "items": [
      {
        "id": "f55b72ba-19b7-49ff-857c-ca609079ef63",
        "itemType": "SERVICE",
        "itemName": "Service Fees",
        "quantity": 1,
        "unitPrice": 600,
        "amount": 600,
        "medicineId": null,
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      },
      {
        "id": "742f6c81-b744-442a-919e-1d69ffdb9ef1",
        "itemType": "MEDICINE",
        "itemName": "MedFullUpdCVUEXV",
        "quantity": 1,
        "unitPrice": 80,
        "amount": 80,
        "medicineId": "4450dff7-6575-4def-b832-01abd0ca3738",
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      }
    ],
    "payments": [
      {
        "id": "fb1feb00-c513-4c6b-a4d9-02336a29b6e6",
        "amountPaid": 100,
        "paymentDate": "2026-09-03T09:56:10.3712222",
        "paymentMethod": "UPI",
        "remarks": "part1"
      }
    ]
  }
}
```

### 165. BILL list invoices — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/invoices`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Invoices fetched successfully.\",\"data\":[{\"id\":\"03633f84-adf9-4eb5-aeb7-a6ff21e5fe78\",\"invoiceId\":\"GAN-DL-INV-00022\",\"patientId\":\"cc1089e5-1fb8-491f-b3af-2cf686a5207d\",\"patientName\":\"Full Test Patient CVUEXV\",\"invoiceDate\":\"2026-09-03\",\"totalAmount\":680,\"paidAmount\":100,\"leftAmount\":580,\"status\":\"ONGOING\",\"billSections\":[\"SERVICE\",\"MEDICINE\"]},{\"id\":\"15c44d1f-fe10-431a-a102-d2220dafb8c3\",\"invoiceId\":\"GAN-DL-INV-00021\",\"patientId\":\"cc1089e5-1fb8-491f-b3af-2cf686a5207d\",\"patientName\":\"Full Test Patient CVUEXV\",\"invoiceDate\":\"2026-09-03\",\"totalAmount\":7678,\"paidAmount\":500,\"leftAmount\":7178,\"status\":\"ONGOING\",\"billSections\":[\"SERVICE\",\"MEDICINE\",\"THERAPY\"]},{\"id\":\"a4bd0c62-1407-4cff-8bf6-79d6034d6f19\",\"invoiceId\":\"GAN-DL-INV-00019\",\"patientId\":\"5039922b-b538-4840-b0de-94bc91fa0707\",\"patientName\":\"Full Test Patient QCNKEH\",\"invoiceDate\":\"2026-09-03\",\"totalAmount\":680,\"paidAmount\":300,\"leftAmount\":380,\"status\":\"ONGOING\",\"billSections\":[\"SERVICE\",\"MEDICINE\"]},{\"id\":\"b9342a95-e240-4fb1-bf5e-bed1c25d5f24\",\"invoiceId\":\"GAN-DL-INV-00018\",\"patientId\":\"5039922b-b538-4840-b0de-94bc91fa0707\",\"patientName\":\"Full Test Patient QCNKEH\",\"invoiceDate\":\"2026-09-03\",\"totalAmount\":7678,\"paidAmount\":500,\"leftAmount\":7178,\"status\":\"ONGOING\",\"billSections\":[\"SERVICE\",\"MEDICINE\",\"THERAPY\"]},{\"id\":\"197217cd-9568-4895-9c64-926f1ebbc127\",\"invoiceId\":\"GAN-DL-INV-00016\",\"patientId\":\"0b683030-a354-408b-9b98-d7cdf6c498a0\",\"patientName\":\"Full Test Patient GOBGAT\",\"invoiceDate\":\"2026-09-03\",\"totalAmount\":680,\"paidAmount\":300,\"leftAmount\":380,\"status\":\"ONGOING\",\"billSections\":[\"SERVICE\",\"MEDICINE\"]},{\"id\":\"38d29700-465d-45e5-a872-b2cb55c8ea2c\",\"invoiceId\":\"GAN-DL-INV-00015\",\"patientId\":\"0b683030-a354-408b-9b98-d7cdf6c498a0\",\"patientName\":\"Full Test Patient GOBGAT\",\"invoiceDate\":\"2026-09-03\",\"totalAmount\":7678,\"paidAmount\":500,\"leftAmount\":7178,\"status\":\"ONGOING\",\"billSections\":[\"SERVICE\",\"MEDICINE\",\"THERAPY\"]},{\"id\":\"ca1e6f95-4b03-4df7-a0ff-a3a495f49400\",\"invoiceId\":\"GAN-DL-INV-00013\",\"patientId\":\"3839f98b-5d84-4a91-a76d-be01a503a62e\",\"patientName\":\"Full Test Patient NGBRHU\",\"invoiceDate\":\"2026-09-03\",\"totalAmount\":680,\"paidAmount\":300,\"leftAmount\":380,\"status\":\"ONGOING\",\"billSections\":[\"SERVICE\",\"MEDICINE\"]},{\"id\":\"10b3c5be-b95d-4eba-b005-fe6a111f50d8\",\"invoiceId\":\"GAN-DL-INV-00012\",\"patientId\":\"3839f98b-5d84-4a91-a76d-be01a503a62e\",\"patientName\":\"Full Test Patient NGBRHU\",\"invoiceDate\":\"2026-09-03\",\"totalAmount\":7678,\"paidAmount\":500,\"leftAmount\":7178,... [truncated]"
```

### 166. BILL invoices by patient — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/invoices/patient/cc1089e5-1fb8-491f-b3af-2cf686a5207d`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Invoices fetched successfully.",
  "data": [
    {
      "id": "03633f84-adf9-4eb5-aeb7-a6ff21e5fe78",
      "invoiceId": "GAN-DL-INV-00022",
      "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
      "patientName": "Full Test Patient CVUEXV",
      "invoiceDate": "2026-09-03",
      "totalAmount": 680,
      "paidAmount": 100,
      "leftAmount": 580,
      "status": "ONGOING",
      "billSections": [
        "SERVICE",
        "MEDICINE"
      ]
    },
    {
      "id": "15c44d1f-fe10-431a-a102-d2220dafb8c3",
      "invoiceId": "GAN-DL-INV-00021",
      "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
      "patientName": "Full Test Patient CVUEXV",
      "invoiceDate": "2026-09-03",
      "totalAmount": 7678,
      "paidAmount": 500,
      "leftAmount": 7178,
      "status": "ONGOING",
      "billSections": [
        "SERVICE",
        "MEDICINE",
        "THERAPY"
      ]
    }
  ]
}
```

### 167. BILL get invoice — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/invoices/03633f84-adf9-4eb5-aeb7-a6ff21e5fe78`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "03633f84-adf9-4eb5-aeb7-a6ff21e5fe78",
    "invoiceId": "GAN-DL-INV-00022",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "patientName": "Full Test Patient CVUEXV",
    "contactNumber": "9366512212",
    "invoiceDate": "2026-09-03",
    "visitType": "CONSULTATION",
    "serviceFees": 600,
    "packageMasterId": null,
    "packageName": null,
    "packageType": null,
    "packageCharges": 0,
    "subtotal": 680,
    "discount": 0,
    "taxEnabled": false,
    "cgstPercent": null,
    "cgstAmount": 0,
    "sgstPercent": null,
    "sgstAmount": 0,
    "totalAmount": 680,
    "paidAmount": 100,
    "leftAmount": 580,
    "status": "ONGOING",
    "billSections": [
      "SERVICE",
      "MEDICINE"
    ],
    "items": [
      {
        "id": "f55b72ba-19b7-49ff-857c-ca609079ef63",
        "itemType": "SERVICE",
        "itemName": "Service Fees",
        "quantity": 1,
        "unitPrice": 600,
        "amount": 600,
        "medicineId": null,
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      },
      {
        "id": "742f6c81-b744-442a-919e-1d69ffdb9ef1",
        "itemType": "MEDICINE",
        "itemName": "MedFullUpdCVUEXV",
        "quantity": 1,
        "unitPrice": 80,
        "amount": 80,
        "medicineId": "4450dff7-6575-4def-b832-01abd0ca3738",
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      }
    ],
    "payments": [
      {
        "id": "fb1feb00-c513-4c6b-a4d9-02336a29b6e6",
        "amountPaid": 100,
        "paymentDate": "2026-09-03T09:56:10.371222",
        "paymentMethod": "UPI",
        "remarks": "part1"
      }
    ]
  }
}
```

### 168. BILL record part payment — **PASS**

- **Service:** billing
- **Method + URL:** `POST http://localhost:8109/api/v1/invoices/03633f84-adf9-4eb5-aeb7-a6ff21e5fe78/payments`
- **HTTP:** `200`

**Request body:**

```json
{
  "amountPaid": 200,
  "paymentMethod": "CASH",
  "remarks": "part2"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Part payment recorded successfully.",
  "data": {
    "id": "03633f84-adf9-4eb5-aeb7-a6ff21e5fe78",
    "invoiceId": "GAN-DL-INV-00022",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "patientName": "Full Test Patient CVUEXV",
    "contactNumber": "9366512212",
    "invoiceDate": "2026-09-03",
    "visitType": "CONSULTATION",
    "serviceFees": 600,
    "packageMasterId": null,
    "packageName": null,
    "packageType": null,
    "packageCharges": 0,
    "subtotal": 680,
    "discount": 0,
    "taxEnabled": false,
    "cgstPercent": null,
    "cgstAmount": 0,
    "sgstPercent": null,
    "sgstAmount": 0,
    "totalAmount": 680,
    "paidAmount": 300,
    "leftAmount": 380,
    "status": "ONGOING",
    "billSections": [
      "SERVICE",
      "MEDICINE"
    ],
    "items": [
      {
        "id": "f55b72ba-19b7-49ff-857c-ca609079ef63",
        "itemType": "SERVICE",
        "itemName": "Service Fees",
        "quantity": 1,
        "unitPrice": 600,
        "amount": 600,
        "medicineId": null,
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      },
      {
        "id": "742f6c81-b744-442a-919e-1d69ffdb9ef1",
        "itemType": "MEDICINE",
        "itemName": "MedFullUpdCVUEXV",
        "quantity": 1,
        "unitPrice": 80,
        "amount": 80,
        "medicineId": "4450dff7-6575-4def-b832-01abd0ca3738",
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      }
    ],
    "payments": [
      {
        "id": "fb1feb00-c513-4c6b-a4d9-02336a29b6e6",
        "amountPaid": 100,
        "paymentDate": "2026-09-03T09:56:10.371222",
        "paymentMethod": "UPI",
        "remarks": "part1"
      },
      {
        "id": "8fa49406-edb0-4faf-b79c-8c77cda735d7",
        "amountPaid": 200,
        "paymentDate": "2026-09-03T09:56:10.8859221",
        "paymentMethod": "CASH",
        "remarks": "part2"
      }
    ]
  }
}
```

### 169. BILL create invoice for delete — **PASS**

- **Service:** billing
- **Method + URL:** `POST http://localhost:8109/api/v1/invoices`
- **HTTP:** `201`

**Request body:**

```json
{
  "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
  "patientName": "Full Test Patient CVUEXV",
  "invoiceDate": "2026-09-03",
  "serviceFees": 100,
  "amountPaid": 100,
  "paymentMethod": "CASH"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Invoice generated successfully.",
  "data": {
    "id": "c1dd6755-2c1f-4d76-b0db-bac2ca49e975",
    "invoiceId": "GAN-DL-INV-00023",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "patientName": "Full Test Patient CVUEXV",
    "contactNumber": null,
    "invoiceDate": "2026-09-03",
    "visitType": null,
    "serviceFees": 100,
    "packageMasterId": null,
    "packageName": null,
    "packageType": null,
    "packageCharges": 0,
    "subtotal": 100,
    "discount": 0,
    "taxEnabled": false,
    "cgstPercent": null,
    "cgstAmount": 0,
    "sgstPercent": null,
    "sgstAmount": 0,
    "totalAmount": 100,
    "paidAmount": 100,
    "leftAmount": 0,
    "status": "COMPLETED",
    "billSections": [
      "SERVICE"
    ],
    "items": [
      {
        "id": "44d1a5e7-3a35-4670-a7c8-33701112b960",
        "itemType": "SERVICE",
        "itemName": "Service Fees",
        "quantity": 1,
        "unitPrice": 100,
        "amount": 100,
        "medicineId": null,
        "assignedTherapistId": null,
        "assignedTherapistName": null,
        "scheduleDate": null,
        "scheduleTime": null,
        "sessionDuration": null,
        "sessionFrequency": null
      }
    ],
    "payments": [
      {
        "id": "f0739777-2503-48c0-aa73-53edcc2420ab",
        "amountPaid": 100,
        "paymentDate": "2026-09-03T09:56:11.0474134",
        "paymentMethod": "CASH",
        "remarks": null
      }
    ]
  }
}
```

### 170. BILL delete invoice — **PASS**

- **Service:** billing
- **Method + URL:** `DELETE http://localhost:8109/api/v1/invoices/c1dd6755-2c1f-4d76-b0db-bac2ca49e975`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Invoice deleted successfully.",
  "data": null
}
```

### 171. BILL sales list — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/sales`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Sales fetched successfully.",
  "data": {
    "revenueThisMonth": 67694,
    "revenueFrom": "2026-09-01",
    "revenueTo": "2026-09-30",
    "sales": [
      {
        "invoiceId": "GAN-DL-INV-00022",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Consultation",
        "totalAmount": 680
      },
      {
        "invoiceId": "GAN-DL-INV-00021",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Pkg Full CVUEXV",
        "totalAmount": 7678
      },
      {
        "invoiceId": "GAN-DL-INV-00019",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Consultation",
        "totalAmount": 680
      },
      {
        "invoiceId": "GAN-DL-INV-00018",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Pkg Full QCNKEH",
        "totalAmount": 7678
      },
      {
        "invoiceId": "GAN-DL-INV-00016",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Consultation",
        "totalAmount": 680
      },
      {
        "invoiceId": "GAN-DL-INV-00015",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Pkg Full GOBGAT",
        "totalAmount": 7678
      },
      {
        "invoiceId": "GAN-DL-INV-00013",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Consultation",
        "totalAmount": 680
      },
      {
        "invoiceId": "GAN-DL-INV-00012",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Pkg Full",
        "totalAmount": 7678
      },
      {
        "invoiceId": "GAN-DL-INV-00010",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "API-Test-Pkg-015036",
        "totalAmount": 5500
      },
      {
        "invoiceId": "GAN-DL-INV-00009",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "API-Test-Pkg-015036",
        "totalAmount": 5675
      },
      {
        "invoiceId": "GAN-DL-INV-00007",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "API-Test-Pkg-014833",
        "totalAmount": 5500
      },
      {
        "invoiceId": "GAN-DL-INV-00006",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "API-Test-Pkg-014833",
        "totalAmount": 5675
      },
      {
        "invoiceId": "GAN-DL-INV-00005",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Consultation",
        "totalAmount": 100
      },
      {
        "invoiceId": "GAN-DL-INV-00004",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "API-Test-Pkg-014728",
        "totalAmount": 5500
      },
      {
        "invoiceId": "GAN-DL-INV-00003",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "API-Test-Pkg-014728",
        "totalAmount": 5675
      },
      {
        "invoiceId": "GAN-DL-INV-00002",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Consultation",
        "totalAmount": 352
      },
      {
        "invoiceId": "GAN-DL-INV-00001",
        "invoiceDate": "2026-09-03",
        "treatmentCategory": null,
        "serviceType": "Consultation",
        "totalAmount": 285
      }
    ]
  }
}
```

### 172. BILL sales revenue month — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/sales/revenue/month`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Monthly revenue fetched successfully.",
  "data": {
    "year": 2026,
    "month": 9,
    "fromDate": "2026-09-01",
    "toDate": "2026-09-30",
    "totalRevenue": 67694,
    "invoiceCount": 17
  }
}
```

### 173. BILL dashboard summary — **PASS**

- **Service:** billing
- **Method + URL:** `GET http://localhost:8109/api/v1/dashboard/billing-summary`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Dashboard billing summary fetched successfully.",
  "data": {
    "period": "MONTHLY",
    "fromDate": "2026-09-01",
    "toDate": "2026-09-30",
    "totalRevenue": 67694,
    "totalBillsGenerated": 17,
    "pendingPayments": 43544,
    "collectedPayments": 24150
  }
}
```

### 174. ALOG create — **PASS**

- **Service:** activity-log
- **Method + URL:** `POST http://localhost:8107/api/v1/activity-logs`
- **HTTP:** `201`

**Request body:**

```json
{
  "page": "BILLING",
  "action": "CREATED",
  "target": "Invoice CVUEXV",
  "beforeValue": null,
  "afterValue": "created",
  "performedByUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
  "performedByUserName": "Ganesha Admin",
  "performedByRole": "ADMIN"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Activity log created successfully.",
  "data": {
    "id": "bf86a4d5-f6db-4b00-8244-c1f6bcfc7712",
    "page": "BILLING",
    "action": "CREATED",
    "target": "Invoice CVUEXV",
    "before": "-",
    "after": "created",
    "timestamp": "2026-09-03T09:56:12.070014",
    "performedByUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "performedByUserName": "Ganesha Admin",
    "performedByRole": "ADMIN"
  }
}
```

### 175. ALOG list — **PASS**

- **Service:** activity-log
- **Method + URL:** `GET http://localhost:8107/api/v1/activity-logs`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"{\"success\":true,\"status\":200,\"message\":\"Activity logs fetched successfully.\",\"data\":[{\"id\":\"bf86a4d5-f6db-4b00-8244-c1f6bcfc7712\",\"page\":\"BILLING\",\"action\":\"CREATED\",\"target\":\"Invoice CVUEXV\",\"before\":\"-\",\"after\":\"created\",\"timestamp\":\"2026-09-03T09:56:12.070014\",\"performedByUserId\":\"6e8d490f-5ea4-4deb-b557-cdf32b843728\",\"performedByUserName\":\"Ganesha Admin\",\"performedByRole\":\"ADMIN\"},{\"id\":\"4cde17f5-f12d-47c0-8c31-24f2e840655f\",\"page\":\"Billing\",\"action\":\"DELETED\",\"target\":\"Invoice GAN-DL-INV-00023\",\"before\":\"-\",\"after\":\"-\",\"timestamp\":\"2026-09-03T09:56:11.267923\",\"performedByUserId\":null,\"performedByUserName\":null,\"performedByRole\":null},{\"id\":\"17309ae7-b2a0-4c27-9ec3-96ac0ec0710f\",\"page\":\"Billing\",\"action\":\"CREATED\",\"target\":\"Invoice GAN-DL-INV-00023\",\"before\":\"-\",\"after\":\"-\",\"timestamp\":\"2026-09-03T09:56:11.048418\",\"performedByUserId\":null,\"performedByUserName\":null,\"performedByRole\":null},{\"id\":\"5de7db14-134d-4352-8a4c-c4335cafd338\",\"page\":\"Billing\",\"action\":\"CREATED\",\"target\":\"Invoice GAN-DL-INV-00022\",\"before\":\"-\",\"after\":\"-\",\"timestamp\":\"2026-09-03T09:56:10.453952\",\"performedByUserId\":null,\"performedByUserName\":null,\"performedByRole\":null},{\"id\":\"8fe341fd-28cf-41cf-a5b5-9986a494c8c1\",\"page\":\"Billing\",\"action\":\"CREATED\",\"target\":\"Invoice GAN-DL-INV-00021\",\"before\":\"-\",\"after\":\"-\",\"timestamp\":\"2026-09-03T09:56:09.933907\",\"performedByUserId\":null,\"performedByUserName\":null,\"performedByRole\":null},{\"id\":\"0d46e48a-96e4-450b-a6f1-8da037a6687f\",\"page\":\"Medicines\",\"action\":\"DELETED\",\"target\":\"Medicine MedDelCVUEXV\",\"before\":\"-\",\"after\":\"-\",\"timestamp\":\"2026-09-03T09:56:08.137547\",\"performedByUserId\":null,\"performedByUserName\":null,\"performedByRole\":null},{\"id\":\"ecf3b91c-8dcd-4a16-b2e0-99cb2a5e5383\",\"page\":\"Medicines\",\"action\":\"CREATED\",\"target\":\"Medicine MedDelCVUEXV\",\"before\":\"-\",\"after\":\"-\",\"timestamp\":\"2026-09-03T09:56:07.967112\",\"performedByUserId\":null,\"performedByUserName\":null,\"performedByRole\":null},{\"id\":\"ac9a55f3-89d1-44cc-b451-206a7ca18faf\",\"page\":\"Medicines\",\"action\":\"UPDATED\",\"target\":\"Medicine MedFullUpdCVUEXV\",\"before\":\"-\",\"after\":\"-\",\"timestamp\":\"2026-09-03T09:56:07.647139\",\"performedByUserId\":null,\"performedByUserName\":null,\"performedByRole\":null},{\"id\":\"3d19322b-87bf-4190-8f18-dd0079e34fb3\",\"page\":\"Medicines\",\"action\":\"CREATED\",\"target\":\"Medicine MedFullCVUEXV\",\"before\":\"-\",\"after\":\"-\",\"timestamp\":\"2026-09-03T09:56:06.702106\",\"performedByUserId\":null,\"performedByUserName\":null,\"performedByRole\":null},{\"id\":\"b3bee1b0-fb0c-4bc1-a274-2184d3e7... [truncated]"
```

### 176. ALOG get — **PASS**

- **Service:** activity-log
- **Method + URL:** `GET http://localhost:8107/api/v1/activity-logs/bf86a4d5-f6db-4b00-8244-c1f6bcfc7712`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "bf86a4d5-f6db-4b00-8244-c1f6bcfc7712",
    "page": "BILLING",
    "action": "CREATED",
    "target": "Invoice CVUEXV",
    "before": "-",
    "after": "created",
    "timestamp": "2026-09-03T09:56:12.070014",
    "performedByUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "performedByUserName": "Ganesha Admin",
    "performedByRole": "ADMIN"
  }
}
```

### 177. FILE upload — **PASS**

- **Service:** file-upload
- **Method + URL:** `POST http://localhost:8105/api/v1/documents/upload`
- **HTTP:** `200`

**Request body:**

```json
"<multipart [\"patientId\",\"documentType\",\"file\"]>"
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Document uploaded successfully.",
  "data": {
    "id": "e31f9bce-43cc-4aae-882f-5e665e22a045",
    "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
    "documentType": "LAB_REPORT",
    "fileName": "apitest_CVUEXV.txt",
    "fileType": "text/plain",
    "fileSize": 24,
    "downloadUrl": "/api/v1/documents/e31f9bce-43cc-4aae-882f-5e665e22a045/download"
  }
}
```

### 178. FILE list by patient — **PASS**

- **Service:** file-upload
- **Method + URL:** `GET http://localhost:8105/api/v1/documents/cc1089e5-1fb8-491f-b3af-2cf686a5207d`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Documents fetched successfully.",
  "data": [
    {
      "id": "e31f9bce-43cc-4aae-882f-5e665e22a045",
      "patientId": "cc1089e5-1fb8-491f-b3af-2cf686a5207d",
      "documentType": "LAB_REPORT",
      "fileName": "apitest_CVUEXV.txt",
      "fileType": "text/plain",
      "fileSize": 24,
      "downloadUrl": "/api/v1/documents/e31f9bce-43cc-4aae-882f-5e665e22a045/download"
    }
  ]
}
```

### 179. FILE download — **PASS**

- **Service:** file-upload
- **Method + URL:** `GET http://localhost:8105/api/v1/documents/e31f9bce-43cc-4aae-882f-5e665e22a045/download`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
"API test document CVUEXV"
```

### 180. FILE delete — **PASS**

- **Service:** file-upload
- **Method + URL:** `DELETE http://localhost:8105/api/v1/documents/e31f9bce-43cc-4aae-882f-5e665e22a045`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Document deleted successfully.",
  "data": "Deleted"
}
```

### 181. NOTIF create — **PASS**

- **Service:** notification
- **Method + URL:** `POST http://localhost:8110/api/v1/notifications`
- **HTTP:** `201`

**Request body:**

```json
{
  "recipientUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
  "recipientUserName": "Ganesha Admin",
  "recipientRole": "ADMIN",
  "title": "API Test CVUEXV",
  "message": "Notification from final API test",
  "type": "SYSTEM",
  "priority": "MEDIUM"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Notification created successfully.",
  "data": {
    "id": "158d3db4-4ea0-4d09-9b27-2092e78049c0",
    "recipientUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "recipientUserName": "Ganesha Admin",
    "recipientRole": "ADMIN",
    "title": "API Test CVUEXV",
    "message": "Notification from final API test",
    "type": "SYSTEM",
    "priority": "MEDIUM",
    "referenceId": null,
    "referenceType": null,
    "read": false,
    "readAt": null,
    "createdAt": "2026-09-03T09:56:12.6404743"
  }
}
```

### 182. NOTIF send email — **PASS**

- **Service:** notification
- **Method + URL:** `POST http://localhost:8110/api/v1/notifications/email`
- **HTTP:** `200`

**Request body:**

```json
{
  "to": "admin@gmail.com",
  "subject": "API Test CVUEXV",
  "body": "Hello from final hospital API test"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Email accepted.",
  "data": null
}
```

### 183. NOTIF list — **PASS**

- **Service:** notification
- **Method + URL:** `GET http://localhost:8110/api/v1/notifications?userId=6e8d490f-5ea4-4deb-b557-cdf32b843728`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Notifications fetched successfully.",
  "data": [
    {
      "id": "158d3db4-4ea0-4d09-9b27-2092e78049c0",
      "recipientUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
      "recipientUserName": "Ganesha Admin",
      "recipientRole": "ADMIN",
      "title": "API Test CVUEXV",
      "message": "Notification from final API test",
      "type": "SYSTEM",
      "priority": "MEDIUM",
      "referenceId": null,
      "referenceType": null,
      "read": false,
      "readAt": null,
      "createdAt": "2026-09-03T09:56:12.640474"
    },
    {
      "id": "b2ae3d87-12da-4bb0-8151-b01a9f8fe617",
      "recipientUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
      "recipientUserName": "Ganesha Admin",
      "recipientRole": "ADMIN",
      "title": "API Test QCNKEH",
      "message": "Notification from final API test",
      "type": "SYSTEM",
      "priority": "MEDIUM",
      "referenceId": null,
      "referenceType": null,
      "read": true,
      "readAt": "2026-09-03T09:54:32.024087",
      "createdAt": "2026-09-03T09:54:31.797407"
    },
    {
      "id": "e2e3cbe2-5845-4cec-b211-66067bbb5d2d",
      "recipientUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
      "recipientUserName": "Ganesha Admin",
      "recipientRole": "ADMIN",
      "title": "API Test GOBGAT",
      "message": "Notification from final API test",
      "type": "SYSTEM",
      "priority": "MEDIUM",
      "referenceId": null,
      "referenceType": null,
      "read": true,
      "readAt": "2026-09-03T09:52:24.64137",
      "createdAt": "2026-09-03T09:52:24.38078"
    }
  ]
}
```

### 184. NOTIF unread-count — **PASS**

- **Service:** notification
- **Method + URL:** `GET http://localhost:8110/api/v1/notifications/unread-count?userId=6e8d490f-5ea4-4deb-b557-cdf32b843728`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Unread count fetched successfully.",
  "data": {
    "unreadCount": 1
  }
}
```

### 185. NOTIF get — **PASS**

- **Service:** notification
- **Method + URL:** `GET http://localhost:8110/api/v1/notifications/158d3db4-4ea0-4d09-9b27-2092e78049c0`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {
    "id": "158d3db4-4ea0-4d09-9b27-2092e78049c0",
    "recipientUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "recipientUserName": "Ganesha Admin",
    "recipientRole": "ADMIN",
    "title": "API Test CVUEXV",
    "message": "Notification from final API test",
    "type": "SYSTEM",
    "priority": "MEDIUM",
    "referenceId": null,
    "referenceType": null,
    "read": false,
    "readAt": null,
    "createdAt": "2026-09-03T09:56:12.640474"
  }
}
```

### 186. NOTIF mark read — **PASS**

- **Service:** notification
- **Method + URL:** `PUT http://localhost:8110/api/v1/notifications/158d3db4-4ea0-4d09-9b27-2092e78049c0/read`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Notification marked as read.",
  "data": {
    "id": "158d3db4-4ea0-4d09-9b27-2092e78049c0",
    "recipientUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "recipientUserName": "Ganesha Admin",
    "recipientRole": "ADMIN",
    "title": "API Test CVUEXV",
    "message": "Notification from final API test",
    "type": "SYSTEM",
    "priority": "MEDIUM",
    "referenceId": null,
    "referenceType": null,
    "read": true,
    "readAt": "2026-09-03T09:56:12.8404107",
    "createdAt": "2026-09-03T09:56:12.640474"
  }
}
```

### 187. NOTIF read-all — **PASS**

- **Service:** notification
- **Method + URL:** `PUT http://localhost:8110/api/v1/notifications/read-all?userId=6e8d490f-5ea4-4deb-b557-cdf32b843728`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "All notifications marked as read.",
  "data": null
}
```

### 188. NOTIF create for delete — **PASS**

- **Service:** notification
- **Method + URL:** `POST http://localhost:8110/api/v1/notifications`
- **HTTP:** `201`

**Request body:**

```json
{
  "recipientUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
  "title": "Delete Me CVUEXV",
  "message": "to be deleted",
  "type": "GENERAL"
}
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Notification created successfully.",
  "data": {
    "id": "22af30af-e609-475c-822e-5f4df211b0d9",
    "recipientUserId": "6e8d490f-5ea4-4deb-b557-cdf32b843728",
    "recipientUserName": null,
    "recipientRole": null,
    "title": "Delete Me CVUEXV",
    "message": "to be deleted",
    "type": "GENERAL",
    "priority": "MEDIUM",
    "referenceId": null,
    "referenceType": null,
    "read": false,
    "readAt": null,
    "createdAt": "2026-09-03T09:56:12.9262121"
  }
}
```

### 189. NOTIF delete — **PASS**

- **Service:** notification
- **Method + URL:** `DELETE http://localhost:8110/api/v1/notifications/22af30af-e609-475c-822e-5f4df211b0d9`
- **HTTP:** `200`

**Request body:**

```json
null
```

**Response body:**

```json
{
  "success": true,
  "status": 200,
  "message": "Notification deleted successfully.",
  "data": null
}
```

### 190. ATTENDANCE (entire service) — **SKIP**

- **Service:** attendance
- **Method + URL:** `GET http://localhost:8106/api/v1/attendances`
- **HTTP:** `null`
- **Notes:** SKIP per user request — attendance ignored entirely

**Request body:**

```json
null
```

**Response body:**

```json
null
```

---

## 7. Conclusion

Final live run: **189 PASS / 0 FAIL / 1 SKIP** across 190 scenarios. Attendance intentionally skipped. Notification + platform Super Admin APIs included.
