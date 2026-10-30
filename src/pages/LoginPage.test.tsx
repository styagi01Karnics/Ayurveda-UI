import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from '@/pages/LoginPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  it('renders tenant login fields without role tabs or sign-up links', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'System Admin' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your username or email address'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign Up' })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('GANESHA AYURVEDAA')).toBeInTheDocument();
    });
  });

  it('renders the super admin page with Karnics branding and no clinic field', async () => {
    render(
      <MemoryRouter initialEntries={['/platform/login']}>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('KARNICS TECHNOLOGY')).toBeInTheDocument();
    expect(screen.queryByLabelText('Clinic code')).not.toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your email address'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign in to your clinic' })).not.toBeInTheDocument();
  });

  it('shows validation errors for empty submit', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const emailInput = screen.getByPlaceholderText(
      'Enter your username or email address',
    );
    const passwordInput = screen.getByPlaceholderText('Password');
    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Username or email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('does not show Create Super Admin on the login card', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole('link', { name: 'Create Super Admin' }),
    ).not.toBeInTheDocument();
  });
});
