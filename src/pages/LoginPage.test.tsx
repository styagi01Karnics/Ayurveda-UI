import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/lib/api/client';
import { LoginPage } from '@/pages/LoginPage';

const mockNavigate = vi.fn();
const mockLoginApi = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/lib/api/auth', () => ({
  login: (...args: unknown[]) => mockLoginApi(...args),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLoginApi.mockReset();
    localStorage.clear();
  });

  it('renders login form fields', () => {
    renderLogin();

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. GAN-AP')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your username or email address'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows validation errors for empty submit and does not call API', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(
      await screen.findByText('Username or email is required'),
    ).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mockLoginApi).not.toHaveBeenCalled();
  });

  it('logs in hospital user with tenant code and stores token', async () => {
    const user = userEvent.setup();
    mockLoginApi.mockResolvedValue({
      accessToken: 'hospital-jwt',
      tokenType: 'Bearer',
      expiresInMs: 86400000,
      user: {
        id: '11111111-1111-4111-8111-111111111111',
        tenantId: '22222222-2222-4222-8222-222222222222',
        tenantCode: 'HOSP-1',
        username: 'admin@hospital.test',
        email: 'admin@hospital.test',
        fullName: 'Hospital Admin',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
      tenant: {
        id: '22222222-2222-4222-8222-222222222222',
        tenantCode: 'HOSP-1',
        name: 'Test Hospital',
        email: 'admin@hospital.test',
        phone: '',
        address: '',
        status: 'ACTIVE',
        city: 'Test City',
      },
    });

    renderLogin();

    await user.type(screen.getByPlaceholderText('e.g. GAN-AP'), 'HOSP-1');
    await user.type(
      screen.getByPlaceholderText('Enter your username or email address'),
      'admin@hospital.test',
    );
    await user.type(screen.getByPlaceholderText('Password'), 'Secret@123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLoginApi).toHaveBeenCalledWith({
        usernameOrEmail: 'admin@hospital.test',
        password: 'Secret@123',
        tenantCode: 'HOSP-1',
      });
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
    expect(localStorage.getItem('ganesha_auth_token')).toBe('hospital-jwt');
    expect(JSON.parse(localStorage.getItem('ganesha_auth_user')!).fullName).toBe(
      'Hospital Admin',
    );
  });

  it('logs in super admin without tenant code', async () => {
    const user = userEvent.setup();
    mockLoginApi.mockResolvedValue({
      accessToken: 'super-jwt',
      tokenType: 'Bearer',
      expiresInMs: 86400000,
      user: {
        id: '33333333-3333-4333-8333-333333333333',
        tenantId: '44444444-4444-4444-8444-444444444444',
        tenantCode: 'PLATFORM',
        username: 'super@platform.test',
        email: 'super@platform.test',
        fullName: 'Platform Admin',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      },
      tenant: {
        id: '44444444-4444-4444-8444-444444444444',
        tenantCode: 'PLATFORM',
        name: 'Platform',
        email: 'super@platform.test',
        phone: '',
        address: '',
        status: 'ACTIVE',
      },
    });

    renderLogin();

    await user.type(
      screen.getByPlaceholderText('Enter your username or email address'),
      'super@platform.test',
    );
    await user.type(screen.getByPlaceholderText('Password'), 'Secret@123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLoginApi).toHaveBeenCalledWith({
        usernameOrEmail: 'super@platform.test',
        password: 'Secret@123',
        tenantCode: undefined,
      });
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
    expect(localStorage.getItem('ganesha_auth_token')).toBe('super-jwt');
  });

  it('shows API error message on failed login', async () => {
    const user = userEvent.setup();
    mockLoginApi.mockRejectedValue(
      new ApiError('Invalid email or password.', 401),
    );

    renderLogin();

    await user.type(
      screen.getByPlaceholderText('Enter your username or email address'),
      'bad@hospital.test',
    );
    await user.type(screen.getByPlaceholderText('Password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(
      await screen.findByText('Invalid email or password.'),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('ganesha_auth_token')).toBeNull();
  });

  it('links to signup page', () => {
    renderLogin();

    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
      'href',
      '/signup',
    );
  });
});
