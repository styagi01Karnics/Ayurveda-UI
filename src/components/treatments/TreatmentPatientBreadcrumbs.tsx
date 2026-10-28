import { Link } from 'react-router-dom';

export function TreatmentPatientBreadcrumbs() {
  return (
    <nav className="text-sm text-text-muted">
      <Link to="/treatments" className="hover:text-gold">
        Treatment
      </Link>
      <span className="mx-2">/</span>
      <span className="text-brown">Patient Details</span>
    </nav>
  );
}
