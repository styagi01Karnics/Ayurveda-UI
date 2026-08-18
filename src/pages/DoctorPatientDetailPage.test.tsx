import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider } from '@/app/ToastContext';
import { DoctorPatientDetailPage } from '@/pages/DoctorPatientDetailPage';

function renderPatientDetail() {
  return render(
    <MemoryRouter initialEntries={['/doctors/patient/37944397']}>
      <ToastProvider>
        <PageActionContext.Provider value={{ setHeaderAction: () => {} }}>
          <Routes>
            <Route path="/doctors/patient/:patientId" element={<DoctorPatientDetailPage />} />
          </Routes>
        </PageActionContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('DoctorPatientDetailPage', () => {
  it('renders patient header and tabs', async () => {
    renderPatientDetail();
    expect(await screen.findByRole('heading', { name: 'Khushi Shroff' })).toBeInTheDocument();
    expect(screen.getByText('Under Treatment')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Medical Assessment')).toBeInTheDocument();
  });

  it('shows breadcrumbs', () => {
    renderPatientDetail();
    expect(screen.getByRole('navigation')).toHaveTextContent('Doctors');
    expect(screen.getByRole('navigation')).toHaveTextContent('Patient Details');
  });

  it('switches to edit mode', async () => {
    const user = userEvent.setup();
    renderPatientDetail();
    await user.click(await screen.findByLabelText('Edit patient details'));
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('advances workflow stepper on next from billing tab', async () => {
    const user = userEvent.setup();
    renderPatientDetail();
    await user.click(await screen.findByRole('button', { name: 'Billing & Membership' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Create Prescription')).toBeInTheDocument();
    expect(screen.getByLabelText('Diagnosis')).toBeInTheDocument();
  });
});
