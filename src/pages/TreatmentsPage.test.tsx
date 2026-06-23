import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { TreatmentsPage } from '@/pages/TreatmentsPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderTreatments() {
  return render(
    <MemoryRouter>
      <TreatmentsPage />
    </MemoryRouter>,
  );
}

describe('TreatmentsPage', () => {
  it('renders treatments table', () => {
    renderTreatments();
    expect(screen.getAllByText('Khushi Shroff').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Panchakarma').length).toBeGreaterThan(0);
  });

  it('filters by patient name', async () => {
    const user = userEvent.setup();
    renderTreatments();
    await user.type(screen.getByPlaceholderText('Patient'), 'Unknown');
    expect(screen.queryByText('Khushi Shroff')).not.toBeInTheDocument();
  });

  it('navigates to patient detail on row click', async () => {
    const user = userEvent.setup();
    mockNavigate.mockClear();
    renderTreatments();
    await user.click(screen.getAllByText('Khushi Shroff')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/treatments/patient/37944397');
  });
});

describe('TreatmentPatientDetailPage', () => {
  it('renders patient detail with breadcrumbs', async () => {
    const { TreatmentPatientDetailPage } = await import(
      '@/pages/TreatmentPatientDetailPage'
    );
    render(
      <MemoryRouter initialEntries={['/treatments/patient/37944397']}>
        <Routes>
          <Route
            path="/treatments/patient/:patientId"
            element={<TreatmentPatientDetailPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('#37944397')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveTextContent('Treatment');
  });
});
