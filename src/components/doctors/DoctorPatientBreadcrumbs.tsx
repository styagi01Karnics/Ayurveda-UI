import { Link } from 'react-router-dom';

export function DoctorPatientBreadcrumbs() {
  return (
    <nav className="text-sm text-text-muted">
      <Link to="/doctors" className="hover:text-gold">
        Doctors
      </Link>
      <span className="mx-2">/</span>
      <span className="text-brown">Patient Details</span>
    </nav>
  );
}
