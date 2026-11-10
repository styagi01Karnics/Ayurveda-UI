import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider, ToastViewport } from '@/app/ToastContext';
import { createMedicineCategory } from '@/lib/api/medicines';
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

  it('adds a new medicine category from the dropdown and selects it', async () => {
    const user = userEvent.setup();
    renderMedicines();
    await screen.findAllByText('Tab OCRIS 200');
    await user.click(screen.getAllByRole('button', { name: /Add Medicine/ })[0]);

    const trigger = () =>
      document.querySelector('button[aria-labelledby="medicine-category"]') as HTMLElement;
    await user.click(trigger());
    await user.type(screen.getByPlaceholderText('New category name'), 'Eye Drops');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() =>
      expect(createMedicineCategory).toHaveBeenCalledWith({ code: 'EYE_DROPS', name: 'Eye Drops' }),
    );
    await waitFor(() => expect(trigger()).toHaveTextContent('Eye Drops'));
    expect(screen.queryByPlaceholderText('New category name')).not.toBeInTheDocument();
  });

  it('asks for a name before adding a category', async () => {
    const user = userEvent.setup();
    vi.mocked(createMedicineCategory).mockClear();
    renderMedicines();
    await screen.findAllByText('Tab OCRIS 200');
    await user.click(screen.getAllByRole('button', { name: /Add Medicine/ })[0]);
    await user.click(
      document.querySelector('button[aria-labelledby="medicine-category"]') as HTMLElement,
    );
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(await screen.findByText('Enter a category name')).toBeInTheDocument();
    expect(createMedicineCategory).not.toHaveBeenCalled();
  });

  it('shows the API error inline when adding a category fails', async () => {
    const user = userEvent.setup();
    vi.mocked(createMedicineCategory).mockRejectedValueOnce(new Error('Category already exists'));
    renderMedicines();
    await screen.findAllByText('Tab OCRIS 200');
    await user.click(screen.getAllByRole('button', { name: /Add Medicine/ })[0]);
    await user.click(
      document.querySelector('button[aria-labelledby="medicine-category"]') as HTMLElement,
    );
    await user.type(screen.getByPlaceholderText('New category name'), 'Syrup');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(await screen.findByText('Category already exists')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New category name')).toBeInTheDocument();
  });
});

describe('BillingPage', () => {
  it('renders billing table', async () => {
    const { BillingPage } = await import('@/pages/BillingPage');
    render(
      <MemoryRouter>
        <ToastProvider>
          <PageActionContext.Provider value={{ setHeaderAction: () => {} }}>
            <BillingPage />
          </PageActionContext.Provider>
        </ToastProvider>
      </MemoryRouter>,
    );
    expect((await screen.findAllByText('#PT458652')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('INV-1024')).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Invoice Generated' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invoice Pending' })).toBeInTheDocument();
  });
});

describe('GenerateInvoicePage', () => {
  it('renders generate invoice tabs', async () => {
    const { GenerateInvoicePage } = await import('@/pages/GenerateInvoicePage');
    render(
      <MemoryRouter>
        <ToastProvider>
          <GenerateInvoicePage />
        </ToastProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Generate Invoice' })).toBeInTheDocument();
    expect(screen.getByText('Invoice Type')).toBeInTheDocument();
    expect(screen.getByText('Patient Details')).toBeInTheDocument();
  });

  it('requires patient details before continuing to payment', async () => {
    const user = userEvent.setup();
    const { GenerateInvoicePage } = await import('@/pages/GenerateInvoicePage');
    render(
      <MemoryRouter>
        <ToastProvider>
          <GenerateInvoicePage />
          <ToastViewport />
        </ToastProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Continue to Payment' }));
    expect(await screen.findByText('Patient details required')).toBeInTheDocument();
  });
});

