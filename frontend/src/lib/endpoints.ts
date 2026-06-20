import { apiRequest, setAccessToken } from './api';
import type { ActiveDevice, Balances, Prices, SecurityLogEntry, SessionUser, TwoFactorSetup } from './types';
import type { Ticket, Transaction } from '../data/constants';

interface AuthSuccess {
  user: SessionUser;
  accessToken: string;
  message: string;
}

interface MfaChallenge {
  requiresMfa: true;
  tempToken: string;
}

function applySession(result: AuthSuccess) {
  setAccessToken(result.accessToken);
  return result.user;
}

export const authApi = {
  async register(input: { name: string; email: string; password: string; confirm: string }) {
    const result = await apiRequest<AuthSuccess>('/api/auth/register', { method: 'POST', body: input });
    return applySession(result);
  },

  async login(input: { email: string; password: string }) {
    const result = await apiRequest<(AuthSuccess & { requiresMfa?: false }) | MfaChallenge>('/api/auth/login', {
      method: 'POST',
      body: input,
    });
    if (result.requiresMfa) return result;
    return applySession(result);
  },

  async loginMfa(input: { tempToken: string; code: string }) {
    const result = await apiRequest<AuthSuccess>('/api/auth/login/2fa', { method: 'POST', body: input });
    return applySession(result);
  },

  async logout() {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    setAccessToken(null);
  },

  forgot(input: { email: string }) {
    return apiRequest<{ message: string }>('/api/auth/forgot', { method: 'POST', body: input });
  },

  resetPassword(input: { email: string; resetToken: string; newPassword: string }) {
    return apiRequest<{ message: string }>('/api/auth/reset-password', { method: 'POST', body: input });
  },
};

export const profileApi = {
  async get() {
    const result = await apiRequest<{ user: SessionUser }>('/api/profile');
    return result.user;
  },
  async updateName(input: { newName: string }) {
    const result = await apiRequest<{ user: SessionUser; message: string }>('/api/profile/name', {
      method: 'PATCH',
      body: input,
    });
    return result.user;
  },
  updatePassword(input: { currentPassword: string; newPassword: string }) {
    return apiRequest<{ message: string }>('/api/profile/password', { method: 'PATCH', body: input });
  },
};

export const portfolioApi = {
  get() {
    return apiRequest<{ balances: Balances; prices: Prices; transactions: Transaction[]; totalValuation: number }>(
      '/api/portfolio',
    );
  },
  getPrices() {
    return apiRequest<{ prices: Prices }>('/api/portfolio/prices');
  },
  trade(input: { asset: 'BTC' | 'ETH' | 'VRD'; action: 'BUY' | 'SELL'; volume: number }) {
    return apiRequest<{ balances: Balances; transaction: Transaction; success: boolean; message: string }>(
      '/api/portfolio/trade',
      { method: 'POST', body: input },
    );
  },
  replenish() {
    return apiRequest<{ balances: Balances; message: string }>('/api/portfolio/cash-replenish', {
      method: 'POST',
      body: {},
    });
  },
};

export const securityApi = {
  getSettings() {
    return apiRequest<{ is2faEnabled: boolean; lockTimeoutSeconds: number }>('/api/security/settings');
  },
  beginTwoFactorSetup() {
    return apiRequest<TwoFactorSetup>('/api/security/2fa/setup', { method: 'POST' });
  },
  confirmTwoFactorSetup(code: string) {
    return apiRequest<{ is2faEnabled: boolean }>('/api/security/2fa/enable', { method: 'POST', body: { code } });
  },
  disableTwoFactor(password: string) {
    return apiRequest<{ is2faEnabled: boolean }>('/api/security/2fa/disable', { method: 'POST', body: { password } });
  },
  updateLockTimeout(lockTimeoutSeconds: number) {
    return apiRequest<{ lockTimeoutSeconds: number }>('/api/security/lock-timeout', {
      method: 'PATCH',
      body: { lockTimeoutSeconds },
    });
  },
  unlock(password: string) {
    return apiRequest<{ unlocked: boolean }>('/api/security/unlock', { method: 'POST', body: { password } });
  },
  listDevices() {
    return apiRequest<{ activeDevices: ActiveDevice[] }>('/api/security/devices');
  },
  revokeDevice(deviceId: string) {
    return apiRequest<{ activeDevices: ActiveDevice[]; message: string }>(`/api/security/devices/${deviceId}`, {
      method: 'DELETE',
    });
  },
  listAuditLogs() {
    return apiRequest<{ securityLogs: SecurityLogEntry[]; total: number }>('/api/security/audit-logs?pageSize=50');
  },
};

export const supportApi = {
  async createTicket(form: FormData) {
    const result = await apiRequest<{ ticket: Ticket; message: string }>('/api/tickets', {
      method: 'POST',
      body: form,
      isFormData: true,
    });
    return result.ticket;
  },
  async listTickets() {
    const result = await apiRequest<{ tickets: Ticket[]; total: number }>('/api/tickets');
    return result.tickets;
  },
  async trackTicket(displayId: string) {
    const result = await apiRequest<{ ticket: Ticket }>(`/api/tickets/track/${encodeURIComponent(displayId)}`);
    return result.ticket;
  },
};
