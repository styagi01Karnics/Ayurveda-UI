import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PatientsPage } from '@/pages/PatientsPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('PatientsPage', () => {
  it('renders patient tabs and table', () => {
    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Active Patients')).toBeInTheDocument();
    expect(screen.getByText('Inactive Patients')).toBeInTheDocument();
    expect(screen.getByText('Khushi Shroff')).toBeInTheDocument();
    expect(screen.getByText('Bill')).toBeInTheDocument();
    expect(screen.getAllByText('Upload').length).toBeGreaterThan(0);
  });

  it('filters patients by search query', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByPlaceholderText('Patient ID'), 'PT458653');
    expect(screen.queryByText('Khushi Shroff')).not.toBeInTheDocument();
    expect(screen.getByText('Amit Verma')).toBeInTheDocument();
  });

  it('switches to inactive patients tab', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByText('Inactive Patients'));
    expect(screen.queryByText('Khushi Shroff')).not.toBeInTheDocument();
    expect(screen.getByText('Priya Nair')).toBeInTheDocument();
  });

  it('navigates to patient detail on row click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByText('Khushi Shroff'));
    expect(mockNavigate).toHaveBeenCalledWith('/patients/37944397');
  });

  it('opens bill modal when download clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByLabelText('Download bill for Khushi Shroff'));
    expect(screen.getByText('GST No. : 12334567890')).toBeInTheDocument();
  });

  it('opens upload modal when upload clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>,
    );

    const uploadButtons = screen.getAllByRole('button', { name: /Upload/i });
    await user.click(uploadButtons[0]);
    expect(screen.getByText('Upload Reports')).toBeInTheDocument();
  });
});
