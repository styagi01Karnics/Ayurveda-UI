import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider } from '@/app/ToastContext';
import { DoctorsPage } from '@/pages/DoctorsPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderDoctors() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <PageActionContext.Provider value={{ setHeaderAction: () => {} }}>
          <DoctorsPage />
        </PageActionContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('DoctorsPage', () => {
  it('renders stat cards and schedule table', () => {
    renderDoctors();
    expect(screen.getByText('Total Patients')).toBeInTheDocument();
    expect(screen.getByText('Follow Ups Due')).toBeInTheDocument();
    expect(screen.getAllByText('Khushi Shroff').length).toBeGreaterThan(0);
  });

  it('navigates to patient details on start', async () => {
    const user = userEvent.setup();
    mockNavigate.mockClear();
    renderDoctors();
    const startButtons = screen.getAllByRole('button', { name: 'Start' });
    await user.click(startButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/doctors/patient/37944397');
  });

  it('shows cancel confirmation modal', async () => {
    const user = userEvent.setup();
    renderDoctors();
    const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
    await user.click(cancelButtons[0]);
    expect(screen.getByText('Cancel Appointment')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this appointment?'),
    ).toBeInTheDocument();
  });

  it('filters by visit type', async () => {
    const user = userEvent.setup();
    renderDoctors();
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[1], 'Therapy');
    expect(screen.getAllByText('Therapy').length).toBeGreaterThan(0);
  });
});
