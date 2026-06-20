import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ToastProvider } from '@/app/ToastContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientDetailPage } from '@/pages/PatientDetailPage';

function renderDetail(patientId = '37944397') {
  return render(
    <MemoryRouter initialEntries={[`/patients/${patientId}`]}>
      <ToastProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/patients/:patientId" element={<PatientDetailPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('PatientDetailPage', () => {
  it('renders patient header and personal info tab', () => {
    renderDetail();
    expect(screen.getByText('Patient Details')).toBeInTheDocument();
    expect(screen.getByText('#37944397')).toBeInTheDocument();
    expect(screen.getByText('Under Treatment')).toBeInTheDocument();
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Khushi Shroff')).toBeInTheDocument();
  });

  it('switches to medical assessment tab', async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.click(screen.getByText('Medical Assessment'));
    expect(screen.getByText('Ayurvedic Assessment')).toBeInTheDocument();
    expect(screen.getByText('Physical Examination')).toBeInTheDocument();
  });

  it('switches to treatment tab', async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.click(screen.getByText('Treatment & Follow Up'));
    expect(screen.getByText('Active Treatment Plan')).toBeInTheDocument();
    expect(screen.getByText('Joint Pain Package')).toBeInTheDocument();
  });

  it('switches to billing tab', async () => {
    const user = userEvent.setup();
    renderDetail();
    await user.click(screen.getByText('Billing & Membership'));
    expect(screen.getByText('Payment Setup')).toBeInTheDocument();
    expect(screen.getByText('Debit Card')).toBeInTheDocument();
  });
});
