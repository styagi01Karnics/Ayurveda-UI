import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProtectedRoute, PublicRoute } from '@/app/ProtectedRoute';
import {
  MOCK_AUTH_TOKEN,
  setAuthSession,
} from '@/lib/auth';

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

function renderPublic() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<div>Login page</div>} />
        </Route>
        <Route path="/dashboard" element={<div>Dashboard page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute / PublicRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects to login when there is no session', () => {
    renderProtected();
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('clears mock token session and redirects to login', () => {
    setAuthSession(MOCK_AUTH_TOKEN, {
      fullName: 'Mock User',
      role: 'Admin',
      email: 'mock@test.com',
    });
    renderProtected();
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(localStorage.getItem('ganesha_auth_token')).toBeNull();
  });

  it('allows dashboard when a real token is stored', () => {
    setAuthSession('real-jwt', {
      id: '1',
      fullName: 'Real User',
      role: 'Admin',
      email: 'real@test.com',
      tenantCode: 'HOSP-1',
    });
    renderProtected();
    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
  });

  it('redirects authenticated users away from public login', () => {
    setAuthSession('real-jwt', {
      fullName: 'Real User',
      role: 'Admin',
      email: 'real@test.com',
    });
    renderPublic();
    expect(screen.getByText('Dashboard page')).toBeInTheDocument();
  });
});
