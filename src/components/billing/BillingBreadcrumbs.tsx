import { Link } from 'react-router-dom';

export function BillingBreadcrumbs() {
  return (
    <nav className="text-sm text-text-muted">
      <Link to="/billing" className="hover:text-gold">
        Billing
      </Link>
      <span className="mx-2">/</span>
      <span className="text-brown">Generate Invoice</span>
    </nav>
  );
}
