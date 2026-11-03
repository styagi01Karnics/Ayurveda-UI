import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider } from '@/app/ToastContext';
import { getUsers } from '@/lib/api/auth';
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
  it('renders settings tabs', async () => {
    renderSettings();
    expect(screen.getByText('Clinic Settings')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Role Management')).toBeInTheDocument();
    expect(screen.getByText('Doctor Management')).toBeInTheDocument();
    expect(screen.getByText('Therapist Management')).toBeInTheDocument();
    expect(await screen.findByText('Treatment Categories')).toBeInTheDocument();
  });

  it('renders clinic treatment categories and therapy sections by default', async () => {
    renderSettings();
    expect(await screen.findByText('Treatment Categories')).toBeInTheDocument();
    expect(await screen.findByText('Therapy')).toBeInTheDocument();
    expect(screen.getAllByText('Panchakarma').length).toBeGreaterThan(0);
  });

  it('shows user management table', async () => {
    const user = userEvent.setup();
    vi.mocked(getUsers).mockResolvedValueOnce([
      {
        id: 'user-2',
        tenantId: 'tenant-1',
        tenantCode: 'GAN',
        username: 'admin',
        email: 'admin@test.com',
        fullName: 'Rahul Sharma',
        role: 'TENANT_ADMIN',
        status: 'ACTIVE',
      },
    ]);
    renderSettings();
    await screen.findByText('Treatment Categories');
    await user.click(screen.getByText('User Management'));
    expect(await screen.findByText('Rahul Sharma')).toBeInTheDocument();
  });

  it('shows role management cards', async () => {
    const user = userEvent.setup();
    renderSettings();
    await screen.findByText('Treatment Categories');
    await user.click(screen.getByText('Role Management'));
    expect(screen.getAllByText('Super Admin').length).toBeGreaterThan(0);
    expect(screen.getByText('Full Access')).toBeInTheDocument();
  });

  it('shows doctor management tab', async () => {
    const user = userEvent.setup();
    renderSettings();
    await screen.findByText('Treatment Categories');
    await user.click(screen.getByText('Doctor Management'));
    expect(await screen.findByText('Doctors')).toBeInTheDocument();
    expect(await screen.findByText('Dr. Shweta Arya')).toBeInTheDocument();
  });

  it('shows delete confirmation for therapist', async () => {
    const user = userEvent.setup();
    renderSettings();
    await screen.findByText('Treatment Categories');
    await user.click(screen.getByText('Therapist Management'));
    await screen.findAllByText('Dr. Narendra Jain');
    const deleteButtons = screen.getAllByLabelText('Delete Dr. Narendra Jain');
    await user.click(deleteButtons[0]);
    expect(screen.getByText('Delete Therapist')).toBeInTheDocument();
  });
});
