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
  it('renders schedule stat cards and today appointments', async () => {
    renderDoctors();
    expect(await screen.findByText('Total Patients')).toBeInTheDocument();
    expect(screen.getByText('Active Treatment Plans')).toBeInTheDocument();
    expect((await screen.findAllByText('Khushi Shroff')).length).toBeGreaterThan(0);
  });

  it('filters schedule by visit type', async () => {
    const user = userEvent.setup();
    renderDoctors();
    await screen.findAllByText('Khushi Shroff');
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[1], 'Therapy');
    expect(screen.queryByText('Consultation')).not.toBeInTheDocument();
  });

  it('navigates to patient detail when Start is clicked', async () => {
    const user = userEvent.setup();
    renderDoctors();
    await screen.findAllByText('Khushi Shroff');
    const startButtons = screen.getAllByRole('button', { name: 'Start' });
    await user.click(startButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/doctors/patient/37944397');
  });
});
