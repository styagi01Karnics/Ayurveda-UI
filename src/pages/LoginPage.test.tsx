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
  it('renders Figma login fields and role tabs by default', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'System Admin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Users' })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your username or email address'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
      'href',
      '/signup',
    );

    await waitFor(() => {
      expect(screen.getByText('GANESHA AYURVEDAA')).toBeInTheDocument();
    });
  });

  it('hides clinic field on System Admin tab', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'System Admin' }));

    expect(screen.queryByText('Clinic')).not.toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('superadmin@gmail.com'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
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

  it('logs in with dummy credentials and navigates to dashboard', async () => {
    const user = userEvent.setup();
    mockNavigate.mockClear();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
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
