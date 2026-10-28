import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider } from '@/app/ToastContext';
import { AppointmentsPage } from '@/pages/AppointmentsPage';

function renderAppointments() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <PageActionContext.Provider value={{ setHeaderAction: () => {} }}>
          <AppointmentsPage />
        </PageActionContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('AppointmentsPage', () => {
  it('renders appointment tabs and table', async () => {
    renderAppointments();
    expect(screen.getByText('All Appointments')).toBeInTheDocument();
    expect(screen.getByText('All Follow Ups')).toBeInTheDocument();
    expect((await screen.findAllByText('Khushi Shroff')).length).toBeGreaterThan(0);
  });

  it('filters appointments by patient id', async () => {
    const user = userEvent.setup();
    renderAppointments();
    await screen.findAllByText('Khushi Shroff');
    await user.type(screen.getByPlaceholderText('Patient Code'), 'PT458653');
    expect(screen.queryByText('Khushi Shroff')).not.toBeInTheDocument();
  });

  it('switches to follow ups tab', async () => {
    const user = userEvent.setup();
    renderAppointments();
    await user.click(screen.getByText('All Follow Ups'));
    expect(screen.getAllByText('Khushi Shroff').length).toBeGreaterThan(0);
  });

  it('shows cancel confirmation modal', async () => {
    const user = userEvent.setup();
    renderAppointments();
    await screen.findAllByText('Khushi Shroff');
    const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
    await user.click(cancelButtons[0]);
    expect(screen.getByText('Cancel Appointment')).toBeInTheDocument();
  });

  it('opens reschedule modal for cancelled appointments', async () => {
    const user = userEvent.setup();
    renderAppointments();
    await screen.findAllByText('Khushi Shroff');
    await user.click(screen.getByRole('button', { name: 'Reschedule' }));
    expect(screen.getByText('Reschedule Appointment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('opens calendar view', async () => {
    const user = userEvent.setup();
    renderAppointments();
    await user.click(screen.getByLabelText('Calendar view'));
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument();
  });
});
