import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider } from '@/app/ToastContext';
import { MedicinesPage } from '@/pages/MedicinesPage';

function renderMedicines() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <PageActionContext.Provider value={{ setHeaderAction: () => {} }}>
          <MedicinesPage />
        </PageActionContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('MedicinesPage', () => {
  it('renders medicines table', async () => {
    renderMedicines();
    expect(await screen.findAllByText('Tab OCRIS 200')).toHaveLength(6);
    expect(screen.getAllByText('In Stock').length).toBeGreaterThan(0);
  });

  it('filters by medicine name', async () => {
    const user = userEvent.setup();
    renderMedicines();
    await screen.findAllByText('Tab OCRIS 200');
    await user.type(screen.getByPlaceholderText('Medicine Name'), 'Unknown');
    expect(screen.queryByText('Tab OCRIS 200')).not.toBeInTheDocument();
  });

  it('shows delete confirmation modal', async () => {
    const user = userEvent.setup();
    renderMedicines();
    await screen.findAllByText('Tab OCRIS 200');
    const deleteButtons = screen.getAllByLabelText(/Delete Tab OCRIS 200/);
    await user.click(deleteButtons[0]);
    expect(screen.getByText('Delete Medicine')).toBeInTheDocument();
  });
});

describe('BillingPage', () => {
  it('renders billing table', async () => {
    const { BillingPage } = await import('@/pages/BillingPage');
    render(
      <MemoryRouter>
        <PageActionContext.Provider value={{ setHeaderAction: () => {} }}>
          <BillingPage />
        </PageActionContext.Provider>
      </MemoryRouter>,
    );
    expect((await screen.findAllByText('INV-1024')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('#PT458652')).length).toBeGreaterThan(0);
  });
});

describe('GenerateInvoicePage', () => {
  it('renders generate invoice stepper', async () => {
    const { GenerateInvoicePage } = await import('@/pages/GenerateInvoicePage');
    render(
      <MemoryRouter>
        <ToastProvider>
          <GenerateInvoicePage />
        </ToastProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Generate Invoice' })).toBeInTheDocument();
    expect(screen.getByText('Service Type')).toBeInTheDocument();
    expect(screen.getByText('Medicine')).toBeInTheDocument();
  });
});
