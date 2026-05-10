import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAdminConfigurationError, isAdmin } from './auth';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getAdminConfigurationError', () => {
  it('returns an error when the admin email is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_ADMIN_EMAIL', '');

    expect(getAdminConfigurationError()).toBe(
      'Admin nao configurado no ambiente atual. Campo ausente: NEXT_PUBLIC_ADMIN_EMAIL.'
    );
  });

  it('returns null when the admin email is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_ADMIN_EMAIL', 'admin@example.com');

    expect(getAdminConfigurationError()).toBeNull();
  });
});

describe('isAdmin', () => {
  it('matches the configured admin email case-insensitively', () => {
    vi.stubEnv('NEXT_PUBLIC_ADMIN_EMAIL', 'admin@example.com');

    expect(isAdmin({ email: 'ADMIN@EXAMPLE.COM' } as never)).toBe(true);
  });

  it('fails closed when the admin email is not configured', () => {
    vi.stubEnv('NEXT_PUBLIC_ADMIN_EMAIL', '');

    expect(isAdmin({ email: 'admin@example.com' } as never)).toBe(false);
  });
});