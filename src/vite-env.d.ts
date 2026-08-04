/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PATIENT_API_URL: string;
    readonly VITE_DOCTOR_API_URL: string;
    readonly VITE_APPOINTMENT_API_URL: string;
    readonly VITE_THERAPIST_API_URL: string;
    readonly VITE_MEDICINE_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
