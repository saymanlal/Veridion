export interface SessionUser {
  uuid: string;
  email: string;
  name: string;
  createdDate: string;
  is2faEnabled: boolean;
  lockTimeoutSeconds: number;
}

export interface Balances { USD: number; BTC: number; ETH: number; VRD: number; }
export interface Prices { BTC: number; ETH: number; VRD: number; }

export interface ActiveDevice {
  id: string;
  name: string;
  location: string;
  ip: string;
  timestamp: string;
  status: string;
}

export interface SecurityLogEntry {
  date: string;
  action: string;
  status: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeDataUrl: string;
}
