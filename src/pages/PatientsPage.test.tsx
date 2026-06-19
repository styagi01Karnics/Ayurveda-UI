import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PatientsPage } from '@/pages/PatientsPage';

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
});
