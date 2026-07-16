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
  it('renders stat cards and doctors table from API', async () => {
    renderDoctors();
    expect(await screen.findByText('Total Doctors')).toBeInTheDocument();
    expect(screen.getByText('Dr. Shweta Arya')).toBeInTheDocument();
    expect(screen.getByText('BAMS (Ayurvedic Physician)')).toBeInTheDocument();
  });

  it('filters doctors by search query', async () => {
    const user = userEvent.setup();
    renderDoctors();
    await screen.findByText('Dr. Shweta Arya');
    await user.type(screen.getByPlaceholderText('Search doctor'), 'Unknown');
    expect(screen.queryByText('Dr. Shweta Arya')).not.toBeInTheDocument();
  });

  it('filters by status', async () => {
    const user = userEvent.setup();
    renderDoctors();
    await screen.findByText('Dr. Shweta Arya');
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'Inactive');
    expect(screen.queryByText('Dr. Shweta Arya')).not.toBeInTheDocument();
  });

  it('shows department filter options', async () => {
    renderDoctors();
    await screen.findByText('Dr. Shweta Arya');
    expect(screen.getByRole('option', { name: 'BAMS (Ayurvedic Physician)' })).toBeInTheDocument();
  });
});
