import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider } from '@/app/ToastContext';
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
      <ToastProvider>
        <PageActionContext.Provider value={{ setHeaderAction: () => {} }}>
          <TreatmentsPage />
        </PageActionContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  );
}
describe('TreatmentsPage', () => {
  it('renders treatments table', async () => {
    renderTreatments();
    expect((await screen.findAllByText('Khushi Shroff')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Detox Package').length).toBeGreaterThan(0);
  });

  it('filters by patient name', async () => {
    const user = userEvent.setup();
    renderTreatments();
    await screen.findAllByText('Khushi Shroff');
    await user.type(screen.getByPlaceholderText('Patient'), 'Unknown');
    expect(screen.queryByText('Khushi Shroff')).not.toBeInTheDocument();
  });

  it('navigates to patient detail on row click', async () => {
    const user = userEvent.setup();
    mockNavigate.mockClear();
    renderTreatments();
    await user.click((await screen.findAllByText('Khushi Shroff'))[0]);
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
    expect(await screen.findByText('#37944397')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveTextContent('Treatment');
  });
});
