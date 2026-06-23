import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider } from '@/app/ToastContext';
import { SettingsPage } from '@/pages/SettingsPage';

function renderSettings() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <PageActionContext.Provider value={{ setHeaderAction: () => {} }}>
          <SettingsPage />
        </PageActionContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('SettingsPage', () => {
  it('renders settings tabs', () => {
    renderSettings();
    expect(screen.getByText('Clinic Settings')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Role Management')).toBeInTheDocument();
    expect(screen.getByText('System Preference')).toBeInTheDocument();
  });

  it('renders clinic doctors section by default', () => {
    renderSettings();
    expect(screen.getByText('Doctors')).toBeInTheDocument();
    expect(screen.getByText('Dr. Shweta Arya')).toBeInTheDocument();
    expect(screen.getByText('Therapy')).toBeInTheDocument();
    expect(screen.getAllByText('Therapist').length).toBeGreaterThan(0);
  });

  it('shows user management table', async () => {
    const user = userEvent.setup();
    renderSettings();
    await user.click(screen.getByText('User Management'));
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('#GN458652')).toBeInTheDocument();
  });

  it('shows role management cards', async () => {
    const user = userEvent.setup();
    renderSettings();
    await user.click(screen.getByText('Role Management'));
    expect(screen.getAllByText('Super Admin').length).toBeGreaterThan(0);
    expect(screen.getByText('Full Access')).toBeInTheDocument();
  });

  it('shows system preference toggles', async () => {
    const user = userEvent.setup();
    renderSettings();
    await user.click(screen.getByText('System Preference'));
    expect(screen.getByText('Appointment Settings')).toBeInTheDocument();
    expect(screen.getByText('Billing Settings')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'SMS' })).toBeInTheDocument();
  });

  it('shows delete confirmation for therapist', async () => {
    const user = userEvent.setup();
    renderSettings();
    await user.click(screen.getByLabelText('Delete Dr. Narendra Jain'));
    expect(screen.getByText('Delete Therapist')).toBeInTheDocument();
  });
});
