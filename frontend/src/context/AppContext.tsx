import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Ticket, Transaction } from '../data/constants';
import { ApiError, bootstrapSession, setAccessToken, WS_BASE_URL } from '../lib/api';
import { authApi, portfolioApi, profileApi, securityApi, supportApi } from '../lib/endpoints';
import type { ActiveDevice, Balances, Prices, SecurityLogEntry, SessionUser, TwoFactorSetup } from '../lib/types';

export type { ActiveDevice, Balances, Prices, TwoFactorSetup };

export type ViewName =
  | 'home' | 'about' | 'know-us' | 'contact'
  | 'login' | 'register' | 'forgot' | 'profile' | 'dashboard';
export type DashboardTab = 'assets' | 'swap' | 'security' | 'support';
export type SupportMode = 'form' | 'tracker';
export type ForgotStep = 'request' | 'reset';
export type ToastType = 'success' | 'error' | 'info';

export interface RegisterForm { name: string; email: string; password: string; confirm: string; }
export interface ComplaintForm {
  name: string; email: string; category: string; subject: string; message: string; enableNotifications: boolean;
}
export interface SecuritySettings {
  is2faEnabled: boolean; lockTimeout: number; lockCounter: number; isLocked: boolean;
}
export interface SecurityLog extends SecurityLogEntry {}
export interface Toast { id: string; message: string; type: ToastType; }

function errorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}

interface AppContextValue {
  // Navigation
  currentView: ViewName;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewName>>;
  dashboardTab: DashboardTab;
  setDashboardTab: React.Dispatch<React.SetStateAction<DashboardTab>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeModalMember: string | null;
  setActiveModalMember: React.Dispatch<React.SetStateAction<string | null>>;
  modalBioExtendLoading: boolean;
  setModalBioExtendLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleNavigation: (viewName: ViewName) => void;

  // Auth
  currentSession: SessionUser | null;
  tempLoginStore: string | null;
  setTempLoginStore: React.Dispatch<React.SetStateAction<string | null>>;
  loginEmail: string;
  setLoginEmail: React.Dispatch<React.SetStateAction<string>>;
  loginPassword: string;
  setLoginPassword: React.Dispatch<React.SetStateAction<string>>;
  loginToken2FA: string;
  setLoginToken2FA: React.Dispatch<React.SetStateAction<string>>;
  registerForm: RegisterForm;
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterForm>>;
  forgotEmail: string;
  setForgotEmail: React.Dispatch<React.SetStateAction<string>>;
  forgotStep: ForgotStep;
  setForgotStep: React.Dispatch<React.SetStateAction<ForgotStep>>;
  forgotTokenInput: string;
  setForgotTokenInput: React.Dispatch<React.SetStateAction<string>>;
  forgotNewPassword: string;
  setForgotNewPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLoginNextStep: (e: React.FormEvent) => void;
  handleLoginFinalSubmit: (e: React.FormEvent) => void;
  logout: () => void;
  handleRegister: (e: React.FormEvent) => void;
  handleForgotRequest: (e: React.FormEvent) => void;
  handleForgotComplete: (e: React.FormEvent) => void;

  // Profile
  profileNameInput: string;
  setProfileNameInput: React.Dispatch<React.SetStateAction<string>>;
  profileCurrentPassword: string;
  setProfileCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
  profileNewPassword: string;
  setProfileNewPassword: React.Dispatch<React.SetStateAction<string>>;
  handleProfileUpdate: (e: React.FormEvent) => void;
  handlePasswordRotate: (e: React.FormEvent) => void;

  // Portfolio / trading
  balances: Balances;
  prices: Prices;
  transactions: Transaction[];
  tradeAsset: string;
  setTradeAsset: React.Dispatch<React.SetStateAction<string>>;
  tradeAction: string;
  setTradeAction: React.Dispatch<React.SetStateAction<string>>;
  tradeVolume: string;
  setTradeVolume: React.Dispatch<React.SetStateAction<string>>;
  executeTrade: (e: React.FormEvent) => void;
  replenishUSD: () => void;
  handleManualTickerSync: () => void;
  btcUSDVal: number;
  ethUSDVal: number;
  vrdUSDVal: number;
  totalValuation: number;

  // Support / tickets
  tickets: Ticket[];
  complaintForm: ComplaintForm;
  setComplaintForm: React.Dispatch<React.SetStateAction<ComplaintForm>>;
  uploadedFiles: File[];
  searchTicketId: string;
  setSearchTicketId: React.Dispatch<React.SetStateAction<string>>;
  searchedTicketResult: Ticket | null;
  setSearchedTicketResult: React.Dispatch<React.SetStateAction<Ticket | null>>;
  supportMode: SupportMode;
  setSupportMode: React.Dispatch<React.SetStateAction<SupportMode>>;
  aiPolishLoading: boolean;
  handleComplaintSubmit: (e: React.FormEvent) => void;
  handleTicketSearch: (e: React.FormEvent) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAttachment: (index: number) => void;
  triggerComplaintNavigation: () => void;
  polishComplaintText: () => void;
  simulateDownload: () => void;

  // Security center
  securitySettings: SecuritySettings;
  activeDevices: ActiveDevice[];
  securityLogs: SecurityLog[];
  twoFactorSetup: TwoFactorSetup | null;
  beginTwoFactorSetup: () => void;
  confirmTwoFactorSetup: (code: string) => void;
  cancelTwoFactorSetup: () => void;
  disableTwoFactor: (password: string) => void;
  updateLockTimeout: (seconds: number) => void;
  revokeDeviceSession: (deviceId: string) => void;
  handleRestoreLock: (e: React.FormEvent) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Navigation & General Routing
  const [currentView, setCurrentView] = useState<ViewName>('home');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('assets');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModalMember, setActiveModalMember] = useState<string | null>(null);
  const [modalBioExtendLoading, setModalBioExtendLoading] = useState(false);

  // Authentication & Session State
  const [currentSession, setCurrentSession] = useState<SessionUser | null>(null);
  const [tempLoginStore, setTempLoginStore] = useState<string | null>(null);

  // Forms Binding State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginToken2FA, setLoginToken2FA] = useState('');
  const [registerForm, setRegisterForm] = useState<RegisterForm>({ name: '', email: '', password: '', confirm: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('request');
  const [forgotTokenInput, setForgotTokenInput] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  // Profile Form bindings
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileCurrentPassword, setProfileCurrentPassword] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');

  // Dynamic Portfolio & Market Asset State
  const [balances, setBalances] = useState<Balances>({ USD: 0, BTC: 0, ETH: 0, VRD: 0 });
  const [prices, setPrices] = useState<Prices>({ BTC: 67240.5, ETH: 3480.2, VRD: 1.25 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Quick Trade variables
  const [tradeAsset, setTradeAsset] = useState('BTC');
  const [tradeAction, setTradeAction] = useState('BUY');
  const [tradeVolume, setTradeVolume] = useState('');

  // Support & Incident System State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [complaintForm, setComplaintForm] = useState<ComplaintForm>({
    name: '', email: '', category: '', subject: '', message: '', enableNotifications: true,
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [searchTicketId, setSearchTicketId] = useState('');
  const [searchedTicketResult, setSearchedTicketResult] = useState<Ticket | null>(null);
  const [supportMode, setSupportMode] = useState<SupportMode>('form');
  const [aiPolishLoading, setAiPolishLoading] = useState(false);

  // Security & Inactivity firewall variables
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    is2faEnabled: false, lockTimeout: 60, lockCounter: 60, isLocked: false,
  });
  const [activeDevices, setActiveDevices] = useState<ActiveDevice[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetup | null>(null);

  // Toast deck state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Data loaders -------------------------------------------------------

  const refreshPortfolio = useCallback(async () => {
    try {
      const data = await portfolioApi.get();
      setBalances(data.balances);
      setPrices(data.prices);
      setTransactions(data.transactions);
    } catch {
      // best-effort; keep last known state on transient failure
    }
  }, []);

  const refreshSecurityData = useCallback(async () => {
    try {
      const [settings, devices, logs] = await Promise.all([
        securityApi.getSettings(),
        securityApi.listDevices(),
        securityApi.listAuditLogs(),
      ]);
      setSecuritySettings((prev) => ({ ...prev, is2faEnabled: settings.is2faEnabled, lockTimeout: settings.lockTimeoutSeconds }));
      setActiveDevices(devices.activeDevices);
      setSecurityLogs(logs.securityLogs);
    } catch {
      // best-effort
    }
  }, []);

  const refreshTickets = useCallback(async () => {
    try {
      setTickets(await supportApi.listTickets());
    } catch {
      // best-effort
    }
  }, []);

  const loadSessionData = useCallback(async () => {
    await Promise.all([refreshPortfolio(), refreshSecurityData(), refreshTickets()]);
  }, [refreshPortfolio, refreshSecurityData, refreshTickets]);

  const establishSession = useCallback(async (user: SessionUser) => {
    setCurrentSession(user);
    setSecuritySettings((prev) => ({
      ...prev,
      is2faEnabled: user.is2faEnabled,
      lockTimeout: user.lockTimeoutSeconds,
      lockCounter: user.lockTimeoutSeconds,
      isLocked: false,
    }));
    setLoginEmail('');
    setLoginPassword('');
    setLoginToken2FA('');
    setTempLoginStore(null);
    setCurrentView('dashboard');
    await loadSessionData();
  }, [loadSessionData]);

  // Restore session from the refresh-token cookie on first load.
  useEffect(() => {
    (async () => {
      const restored = await bootstrapSession();
      if (!restored) return;
      try {
        const user = await profileApi.get();
        setCurrentSession(user);
        setSecuritySettings((prev) => ({
          ...prev,
          is2faEnabled: user.is2faEnabled,
          lockTimeout: user.lockTimeoutSeconds,
          lockCounter: user.lockTimeoutSeconds,
        }));
        await loadSessionData();
      } catch {
        setAccessToken(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh security center data whenever it's opened.
  useEffect(() => {
    if (currentSession && dashboardTab === 'security') {
      refreshSecurityData();
    }
  }, [dashboardTab, currentSession, refreshSecurityData]);

  // Inactivity auto-lock countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (currentSession && !securitySettings.isLocked) {
      timer = setInterval(() => {
        setSecuritySettings((prev) => {
          if (prev.lockCounter <= 1) {
            showToast('Terminal locked due to user inactivity.', 'error');
            return { ...prev, lockCounter: prev.lockTimeout, isLocked: true };
          }
          return { ...prev, lockCounter: prev.lockCounter - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentSession, securitySettings.isLocked, securitySettings.lockTimeout, showToast]);

  const resetInactivityTimer = useCallback(() => {
    if (currentSession && !securitySettings.isLocked) {
      setSecuritySettings((prev) => ({ ...prev, lockCounter: prev.lockTimeout }));
    }
  }, [currentSession, securitySettings.isLocked]);

  useEffect(() => {
    const interactionEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    const handler = () => resetInactivityTimer();
    interactionEvents.forEach((evt) => window.addEventListener(evt, handler));
    return () => interactionEvents.forEach((evt) => window.removeEventListener(evt, handler));
  }, [resetInactivityTimer]);

  // Live price feed over WebSocket while an unlocked session is active.
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (!currentSession || securitySettings.isLocked) {
      wsRef.current?.close();
      wsRef.current = null;
      return;
    }

    const ws = new WebSocket(`${WS_BASE_URL}/ws/prices`);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.type === 'prices') {
          setPrices({ BTC: data.payload.BTC, ETH: data.payload.ETH, VRD: data.payload.VRD });
        }
      } catch {
        // ignore malformed frames
      }
    };
    wsRef.current = ws;

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [currentSession, securitySettings.isLocked]);

  const handleNavigation = (viewName: ViewName) => {
    setMobileMenuOpen(false);
    const protectedRoutes: ViewName[] = ['dashboard', 'profile'];
    if (protectedRoutes.includes(viewName) && !currentSession) {
      showToast('Authentication required. Redirecting to login portal...', 'error');
      setCurrentView('login');
      return;
    }
    setCurrentView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'profile' && currentSession) {
      setProfileNameInput(currentSession.name);
    }
  };

  const handleManualTickerSync = async () => {
    try {
      const result = await portfolioApi.getPrices();
      setPrices(result.prices);
      showToast('Ledger telemetry synchronized successfully.', 'success');
    } catch (err) {
      showToast(errorMessage(err, 'Synchronization failed'), 'error');
    }
  };

  const executeTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const volume = parseFloat(tradeVolume);
    if (!volume || volume <= 0) {
      showToast('Slippage error: Enter a valid asset quantity.', 'error');
      return;
    }

    try {
      const result = await portfolioApi.trade({
        asset: tradeAsset as 'BTC' | 'ETH' | 'VRD',
        action: tradeAction as 'BUY' | 'SELL',
        volume,
      });
      setBalances(result.balances);
      setTransactions((prev) => [result.transaction, ...prev]);
      setTradeVolume('');
      showToast(
        tradeAction === 'BUY' ? 'Exchange completed. Handshake authorized.' : 'Assets liquidated. Ledger coordinates update finalized.',
        'success',
      );
    } catch (err) {
      showToast(errorMessage(err, 'Execution Rejected: Trade could not be settled.'), 'error');
    }
  };

  const replenishUSD = async () => {
    try {
      const result = await portfolioApi.replenish();
      setBalances(result.balances);
      showToast('Drawn $10,000.00 mock cash into accounts.', 'success');
    } catch (err) {
      showToast(errorMessage(err, 'Cash pool replenishment failed'), 'error');
    }
  };

  const handleLoginNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await authApi.login({ email: loginEmail.trim().toLowerCase(), password: loginPassword });
      if ('requiresMfa' in result) {
        setTempLoginStore(result.tempToken);
        showToast('Credentials accepted. Awaiting MFA TOTP verification token.', 'info');
      } else {
        showToast(`Authentication accepted. Established session for ${result.name}.`, 'success');
        await establishSession(result);
      }
    } catch (err) {
      showToast(errorMessage(err, 'Rejected credentials verification coordinates.'), 'error');
    }
  };

  const handleLoginFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempLoginStore) return;
    try {
      const user = await authApi.loginMfa({ tempToken: tempLoginStore, code: loginToken2FA });
      showToast('MFA verification successful. Access granted.', 'success');
      await establishSession(user);
    } catch (err) {
      showToast(errorMessage(err, 'Verification code mismatched. Rejected access payload authorization.'), 'error');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // session may already be invalid server-side; proceed with local cleanup
    }
    showToast('Active credentials revoked. Session destroyed.', 'success');
    setCurrentSession(null);
    setCurrentView('home');
    setActiveDevices([]);
    setSecurityLogs([]);
    setTickets([]);
    setTransactions([]);
    setBalances({ USD: 0, BTC: 0, ETH: 0, VRD: 0 });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirm } = registerForm;
    if (password !== confirm) {
      showToast('Verification error: Passwords do not match.', 'error');
      return;
    }

    try {
      const user = await authApi.register({ name: name.trim(), email: email.trim(), password, confirm });
      showToast('Compliance index mapped. Welcome to Veridion.', 'success');
      setRegisterForm({ name: '', email: '', password: '', confirm: '' });
      await establishSession(user);
    } catch (err) {
      showToast(errorMessage(err, 'Operational Failure: Registration could not be completed.'), 'error');
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.forgot({ email: forgotEmail.trim().toLowerCase() });
      setForgotStep('reset');
      showToast('If that email is on file, a reset code has been issued. Check your inbox.', 'info');
    } catch (err) {
      showToast(errorMessage(err, 'Request failed'), 'error');
    }
  };

  const handleForgotComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.resetPassword({
        email: forgotEmail.trim().toLowerCase(),
        resetToken: forgotTokenInput.trim(),
        newPassword: forgotNewPassword,
      });
      showToast('Security variables rotated. Sign in using new parameters.', 'success');
      setForgotEmail('');
      setForgotTokenInput('');
      setForgotNewPassword('');
      setForgotStep('request');
      setCurrentView('login');
    } catch (err) {
      showToast(errorMessage(err, 'Disruption validation failed. Master lock enforced.'), 'error');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession) return;
    try {
      const user = await profileApi.updateName({ newName: profileNameInput });
      setCurrentSession(user);
      showToast('Metadata credentials updated successfully.', 'success');
    } catch (err) {
      showToast(errorMessage(err, 'Profile update failed'), 'error');
    }
  };

  const handlePasswordRotate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession) return;
    try {
      await profileApi.updatePassword({ currentPassword: profileCurrentPassword, newPassword: profileNewPassword });
      showToast('Security secret keys successfully rotated.', 'success');
      setProfileCurrentPassword('');
      setProfileNewPassword('');
    } catch (err) {
      showToast(errorMessage(err, 'Security error: Current verification value incorrect.'), 'error');
    }
  };

  const beginTwoFactorSetup = async () => {
    try {
      setTwoFactorSetup(await securityApi.beginTwoFactorSetup());
    } catch (err) {
      showToast(errorMessage(err, 'Could not start 2FA setup'), 'error');
    }
  };

  const confirmTwoFactorSetup = async (code: string) => {
    try {
      await securityApi.confirmTwoFactorSetup(code);
      setTwoFactorSetup(null);
      setSecuritySettings((prev) => ({ ...prev, is2faEnabled: true }));
      showToast('Dual factor authentication enforced.', 'success');
      await refreshSecurityData();
    } catch (err) {
      showToast(errorMessage(err, 'Invalid 2FA code'), 'error');
    }
  };

  const cancelTwoFactorSetup = () => setTwoFactorSetup(null);

  const disableTwoFactor = async (password: string) => {
    try {
      await securityApi.disableTwoFactor(password);
      setSecuritySettings((prev) => ({ ...prev, is2faEnabled: false }));
      showToast('Dual factor authentication deactivated.', 'info');
      await refreshSecurityData();
    } catch (err) {
      showToast(errorMessage(err, 'Could not disable 2FA'), 'error');
    }
  };

  const updateLockTimeout = async (seconds: number) => {
    try {
      await securityApi.updateLockTimeout(seconds);
      setSecuritySettings((prev) => ({ ...prev, lockTimeout: seconds, lockCounter: seconds }));
      showToast(`Inactivity schedule updated to: ${seconds}s`, 'success');
    } catch (err) {
      showToast(errorMessage(err, 'Could not update inactivity timeout'), 'error');
    }
  };

  const revokeDeviceSession = async (deviceId: string) => {
    try {
      const result = await securityApi.revokeDevice(deviceId);
      setActiveDevices(result.activeDevices);
      showToast(`Session code signature ${deviceId} successfully revoked.`, 'success');
    } catch (err) {
      showToast(errorMessage(err, 'Could not revoke device session'), 'error');
    }
  };

  const handleRestoreLock = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const passInput = form.elements.namedItem('lockPass') as HTMLInputElement;
    try {
      await securityApi.unlock(passInput.value);
      setSecuritySettings((prev) => ({ ...prev, isLocked: false, lockCounter: prev.lockTimeout }));
      showToast('Identity verified. Restoration process finalized.', 'success');
      form.reset();
    } catch (err) {
      showToast(errorMessage(err, 'Authorization rejected. Session lock maintained.'), 'error');
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', complaintForm.name);
      formData.append('email', complaintForm.email);
      formData.append('category', complaintForm.category);
      formData.append('subject', complaintForm.subject);
      formData.append('description', complaintForm.message);
      formData.append('emailNotifications', String(complaintForm.enableNotifications));
      uploadedFiles.forEach((file) => formData.append('attachments', file));

      const ticket = await supportApi.createTicket(formData);
      setTickets((prev) => [ticket, ...prev]);
      showToast(`Telemetry incident registered. Ticket reference: ${ticket.id}`, 'success');

      setComplaintForm({ name: '', email: '', category: '', subject: '', message: '', enableNotifications: true });
      setUploadedFiles([]);
      setSupportMode('tracker');
      setSearchTicketId(ticket.id);
      setSearchedTicketResult(ticket);
    } catch (err) {
      showToast(errorMessage(err, 'Incident registration failed'), 'error');
    }
  };

  const handleTicketSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = searchTicketId.trim().toUpperCase();
    try {
      const ticket = await supportApi.trackTicket(targetId);
      setSearchedTicketResult(ticket);
      showToast('Found incident tracking telemetry database.', 'success');
    } catch {
      setSearchedTicketResult(null);
      showToast('Incident reference index not discovered.', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
      showToast(`Mapped ${files.length} diagnostic elements.`, 'success');
    }
  };

  const removeAttachment = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
    showToast('Diagnostic element unmapped.', 'info');
  };

  const triggerComplaintNavigation = () => {
    setCurrentView('contact');
    setSupportMode('form');
    setComplaintForm({
      name: currentSession?.name || 'Administrator Demo',
      email: currentSession?.email || 'user@example.com',
      category: 'Transaction issues',
      subject: 'Complaint: Telemetry Handshake Timeout Verification',
      message: 'Processing a simulated asset trade experienced delayed confirmation. Database update pipelines did not respond within established SOC 2 compliant milestones.',
      enableNotifications: true,
    });
    showToast('Incident template successfully mapped.', 'info');
  };

  const polishComplaintText = () => {
    if (!complaintForm.message.trim()) {
      showToast('Operational Error: Message narrative is blank.', 'error');
      return;
    }
    setAiPolishLoading(true);
    setTimeout(() => {
      setComplaintForm((prev) => ({
        ...prev,
        message: `[COMPLIANT INCIDENT ANALYSIS REPORT]\nSUBJECT COORDINATE: ${prev.subject || 'UNASSIGNED'}\n\nERROR NARRATIVE:\n${prev.message}\n\nTECHNICAL REPERCUSSIONS:\n1. Network latency parameters exceeded established SOC 2 threshold windows.\n2. Threat evaluation: Minor system state lag, awaiting administrative cache reset.`,
      }));
      setAiPolishLoading(false);
      showToast('Gemini telemetry narrative polishing complete.', 'success');
    }, 1500);
  };

  const simulateDownload = () => {
    showToast('Querying regional secure package mirror nodes...', 'info');
    setTimeout(() => {
      showToast('Started binary download: veridion-crypto-ledger-cli.pkg 🚀', 'success');
    }, 1500);
  };

  const btcUSDVal = balances.BTC * prices.BTC;
  const ethUSDVal = balances.ETH * prices.ETH;
  const vrdUSDVal = balances.VRD * prices.VRD;
  const totalValuation = balances.USD + btcUSDVal + ethUSDVal + vrdUSDVal;

  const value: AppContextValue = {
    currentView, setCurrentView, dashboardTab, setDashboardTab, mobileMenuOpen, setMobileMenuOpen,
    activeModalMember, setActiveModalMember, modalBioExtendLoading, setModalBioExtendLoading, handleNavigation,
    currentSession, tempLoginStore, setTempLoginStore,
    loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginToken2FA, setLoginToken2FA,
    registerForm, setRegisterForm,
    forgotEmail, setForgotEmail, forgotStep, setForgotStep, forgotTokenInput, setForgotTokenInput,
    forgotNewPassword, setForgotNewPassword,
    handleLoginNextStep, handleLoginFinalSubmit, logout, handleRegister, handleForgotRequest, handleForgotComplete,
    profileNameInput, setProfileNameInput, profileCurrentPassword, setProfileCurrentPassword,
    profileNewPassword, setProfileNewPassword, handleProfileUpdate, handlePasswordRotate,
    balances, prices, transactions, tradeAsset, setTradeAsset, tradeAction, setTradeAction,
    tradeVolume, setTradeVolume, executeTrade, replenishUSD, handleManualTickerSync,
    btcUSDVal, ethUSDVal, vrdUSDVal, totalValuation,
    tickets, complaintForm, setComplaintForm, uploadedFiles, searchTicketId, setSearchTicketId,
    searchedTicketResult, setSearchedTicketResult, supportMode, setSupportMode, aiPolishLoading,
    handleComplaintSubmit, handleTicketSearch, handleFileUpload, removeAttachment,
    triggerComplaintNavigation, polishComplaintText, simulateDownload,
    securitySettings, activeDevices, securityLogs, twoFactorSetup,
    beginTwoFactorSetup, confirmTwoFactorSetup, cancelTwoFactorSetup, disableTwoFactor,
    updateLockTimeout, revokeDeviceSession, handleRestoreLock,
    toasts, showToast, dismissToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
