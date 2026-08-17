export interface MedicalHistoryDefaults {
  pastConditions: string;
  pastSurgeries: string;
  currentMedication: string;
  allergies: string;
}

export interface MedicalHistoryOptions {
  pastConditions: string[];
  pastSurgeries: string[];
  currentMedications: string[];
  allergies: string[];
}

const FEMALE_DEFAULTS: MedicalHistoryDefaults = {
  pastConditions: 'PCOS, Chronic gastritis, Mild anemia',
  pastSurgeries: 'Appendectomy (2018), C-section (2021)',
  currentMedication: 'Ashwagandha, Iron supplements, Multivitamins',
  allergies: 'Penicillin, Dust mites, Shellfish',
};

const MALE_DEFAULTS: MedicalHistoryDefaults = {
  pastConditions: 'Hypertension, Lower back pain, Acid reflux',
  pastSurgeries: 'Hernia repair (2016)',
  currentMedication: 'BP tablets, Triphala churna, Vitamin D',
  allergies: 'Sulfa drugs, Pollen',
};

const NEUTRAL_DEFAULTS: MedicalHistoryDefaults = {
  pastConditions: 'Seasonal allergies, Gastritis',
  pastSurgeries: 'None',
  currentMedication: 'Multivitamins, Triphala churna',
  allergies: 'No known drug allergies',
};

const FEMALE_OPTIONS: MedicalHistoryOptions = {
  pastConditions: [
    'PCOS',
    'Chronic gastritis',
    'Mild anemia',
    'Thyroid disorder',
    'Migraine',
    'None',
  ],
  pastSurgeries: [
    'Appendectomy (2018)',
    'C-section (2021)',
    'Hysterectomy (2019)',
    'None',
  ],
  currentMedications: [
    'Ashwagandha',
    'Iron supplements',
    'Multivitamins',
    'Thyroid medication',
    'None',
  ],
  allergies: ['Penicillin', 'Dust mites', 'Shellfish', 'Latex', 'None'],
};

const MALE_OPTIONS: MedicalHistoryOptions = {
  pastConditions: [
    'Hypertension',
    'Lower back pain',
    'Acid reflux',
    'Diabetes Type II',
    'Arthritis',
    'None',
  ],
  pastSurgeries: ['Hernia repair (2016)', 'Knee surgery (2020)', 'None'],
  currentMedications: [
    'BP tablets',
    'Triphala churna',
    'Vitamin D',
    'Metformin',
    'None',
  ],
  allergies: ['Sulfa drugs', 'Pollen', 'Peanuts', 'None'],
};

const NEUTRAL_OPTIONS: MedicalHistoryOptions = {
  pastConditions: [
    'Seasonal allergies',
    'Gastritis',
    'Anxiety',
    'Joint pain',
    'None',
  ],
  pastSurgeries: ['None', 'Appendectomy', 'Minor orthopedic procedure'],
  currentMedications: ['Multivitamins', 'Triphala churna', 'None', 'Other'],
  allergies: ['No known drug allergies', 'Dust', 'Pollen', 'None'],
};

function normalizeGender(gender?: string | null): 'female' | 'male' | 'neutral' {
  const value = gender?.trim().toLowerCase() ?? '';
  if (value.startsWith('f')) return 'female';
  if (value.startsWith('m')) return 'male';
  return 'neutral';
}

export function getMedicalHistoryDefaults(
  gender?: string | null,
): MedicalHistoryDefaults {
  const kind = normalizeGender(gender);
  if (kind === 'female') return FEMALE_DEFAULTS;
  if (kind === 'male') return MALE_DEFAULTS;
  return NEUTRAL_DEFAULTS;
}

export function getMedicalHistoryOptions(
  gender?: string | null,
): MedicalHistoryOptions {
  const kind = normalizeGender(gender);
  if (kind === 'female') return FEMALE_OPTIONS;
  if (kind === 'male') return MALE_OPTIONS;
  return NEUTRAL_OPTIONS;
}

export function isEmptyMedicalValue(value: string | null | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  return trimmed === '' || trimmed === '—' || trimmed.toLowerCase() === 'none';
}
