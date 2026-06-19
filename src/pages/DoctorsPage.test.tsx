import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider } from '@/app/ToastContext';
import { DoctorsPage } from '@/pages/DoctorsPage';

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

  it('marks appointment as completed on start', async () => {
    const user = userEvent.setup();
    renderDoctors();
    const startButtons = screen.getAllByRole('button', { name: 'Start' });
    await user.click(startButtons[0]);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
  });

  it('filters by visit type', async () => {
    const user = userEvent.setup();
    renderDoctors();
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[1], 'Therapy');
    expect(screen.getAllByText('Therapy').length).toBeGreaterThan(0);
  });
});
