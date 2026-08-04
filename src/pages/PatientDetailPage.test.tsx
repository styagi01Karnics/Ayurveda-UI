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
  it('renders patient header and personal info tab', async () => {
    renderDetail();
    expect(await screen.findByText('Patient Details')).toBeInTheDocument();
    expect(screen.getByText('Khushi Shroff')).toBeInTheDocument();
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
  });

  it('switches to medical assessment tab and loads API data', async () => {
    const user = userEvent.setup();
    renderDetail();
    await screen.findByText('Khushi Shroff');
    await user.click(screen.getByText('Medical Assessment'));
    expect(screen.getByText('Ayurvedic Assessment')).toBeInTheDocument();
    expect(screen.getByText('Physical Examination')).toBeInTheDocument();
    expect(await screen.findByText('Lean, Dry Skin')).toBeInTheDocument();
    expect(screen.getByText('Systemic Examination')).toBeInTheDocument();
    expect(screen.getByText('Treatment Plan')).toBeInTheDocument();
  });

  it('switches to treatment tab', async () => {
    const user = userEvent.setup();
    renderDetail();
    await screen.findByText('Khushi Shroff');
    await user.click(screen.getByText('Treatment & Follow Up'));
    expect(screen.getByText('Active Treatment Plan')).toBeInTheDocument();
  });

  it('switches to billing tab', async () => {
    const user = userEvent.setup();
    renderDetail();
    await screen.findByText('Khushi Shroff');
    await user.click(screen.getByText('Billing & Membership'));
    expect(screen.getByText('Payment Setup')).toBeInTheDocument();
  });
});
