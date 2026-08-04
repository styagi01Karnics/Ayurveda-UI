const fs = require('fs');

function load(f) {
  let s = fs.readFileSync(f, 'utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  return JSON.parse(s);
}

function refName(ref) {
  if (!ref) return '';
  return ref.replace('#/components/schemas/', '');
}

function dumpApi(name, doc) {
  console.log(`\n======== ${name} ========`);
  for (const [path, methods] of Object.entries(doc.paths || {})) {
    for (const [method, op] of Object.entries(methods)) {
      const rb = op.requestBody?.content?.['application/json']?.schema;
      const schemaName = refName(rb?.$ref);
      console.log(`${method.toUpperCase().padEnd(7)} ${path}  -> ${schemaName || '(none)'}`);
    }
  }
  console.log('\nSchemas:', Object.keys(doc.components?.schemas || {}).sort().join(', '));
}

const interesting = [
  'CreateAppointmentRequest',
  'CreateAppointmentTherapyRequest',
  'CreateTreatmentCategoryRequest',
  'CreateTherapyRequest',
  'UpdateTherapyRequest',
  'CreateDoshaRequest',
  'RescheduleAppointmentRequest',
  'CancelAppointmentRequest',
  'CompleteAppointmentRequest',
  'InConsultationRequest',
];

function dumpSchema(doc, name) {
  const s = doc.components?.schemas?.[name];
  if (!s) return;
  console.log(`\n--- ${name} ---`);
  console.log(JSON.stringify(s, null, 2));
}

const d8102 = load('.tmp-8102-api-docs.json');
const d8103 = load('.tmp-8103-api-docs.json');
dumpApi('8102', d8102);
dumpApi('8103', d8103);

for (const n of interesting) dumpSchema(d8103, n);
dumpSchema(d8102, 'CreateDoctorRequest');
