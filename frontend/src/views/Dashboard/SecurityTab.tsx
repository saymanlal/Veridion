import { useState } from 'react';
import { Clock, Monitor, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SecurityTab() {
  const {
    securitySettings, activeDevices, securityLogs, twoFactorSetup,
    beginTwoFactorSetup, confirmTwoFactorSetup, cancelTwoFactorSetup, disableTwoFactor,
    updateLockTimeout, revokeDeviceSession,
  } = useApp();

  const [mfaCode, setMfaCode] = useState('');

  const handleDisable2fa = () => {
    const password = window.prompt('Enter your password to disable 2FA:');
    if (password) disableTwoFactor(password);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Advanced Security Coordinates</h3>
          <p className="text-xs text-zinc-400 mt-1">Configure MFA state limits, inactivity firewalls, and review verified system sessions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Multi-Factor Token (2FA)</h4>
              {!twoFactorSetup && (
                <button
                  onClick={securitySettings.is2faEnabled ? handleDisable2fa : beginTwoFactorSetup}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all ${
                    securitySettings.is2faEnabled ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/50' : 'bg-amber-950/30 text-amber-400 border border-amber-900/50'
                  }`}
                >
                  {securitySettings.is2faEnabled ? '2FA ACTIVE' : '2FA DISABLED'}
                </button>
              )}
            </div>

            {twoFactorSetup ? (
              <div className="space-y-3">
                <p className="text-[10px] text-zinc-500">Scan with your authenticator app, then enter the 6-digit code.</p>
                <img src={twoFactorSetup.qrCodeDataUrl} alt="2FA QR code" className="w-32 h-32 rounded-lg border border-zinc-800 mx-auto" />
                <p className="text-[9px] font-mono text-zinc-500 break-all text-center">{twoFactorSetup.secret}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="000000"
                    className="flex-grow rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs font-mono text-center text-white focus:outline-none"
                  />
                  <button
                    onClick={() => { confirmTwoFactorSetup(mfaCode); setMfaCode(''); }}
                    className="bg-[#c29943] hover:bg-[#aa8032] text-black font-bold px-3 py-2 rounded-lg text-[10px] uppercase"
                  >
                    Confirm
                  </button>
                </div>
                <button onClick={cancelTwoFactorSetup} className="w-full text-[10px] text-zinc-500 hover:text-zinc-300">Cancel</button>
              </div>
            ) : (
              <p className="text-[10px] text-zinc-500 font-mono">
                {securitySettings.is2faEnabled ? 'Protected by an authenticator app.' : 'Not yet configured.'}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col justify-between space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Inactivity Auto-Lock</h4>
              <Clock className="w-4.5 h-4.5 text-zinc-500" />
            </div>
            <select
              value={securitySettings.lockTimeout}
              onChange={(e) => updateLockTimeout(parseInt(e.target.value))}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value={15}>15 Seconds (Debug)</option>
              <option value={30}>30 Seconds</option>
              <option value={60}>60 Seconds (Standard)</option>
              <option value={180}>3 Minutes</option>
              <option value={300}>5 Minutes</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest text-zinc-500">Active System Devices</h4>
          <div className="border border-zinc-850 rounded-xl divide-y divide-zinc-850 overflow-hidden bg-zinc-950/30">
            {activeDevices.map((dev) => (
              <div key={dev.id} className="p-4 flex items-center justify-between text-xs hover:bg-zinc-900/20 transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-900 rounded-lg text-[#c29943]">
                    {dev.status === 'Primary' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white">{dev.name}</p>
                      <span className="font-mono text-[10px] text-zinc-500">{dev.ip}</span>
                    </div>
                    <p className="text-[10px] text-zinc-450 mt-0.5">{dev.location} — {dev.timestamp}</p>
                  </div>
                </div>

                {dev.status !== 'Primary' ? (
                  <button
                    onClick={() => revokeDeviceSession(dev.id)}
                    className="bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/40 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                  >
                    Revoke Session
                  </button>
                ) : (
                  <span className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 px-2 py-1 rounded-lg text-[9px] font-mono font-bold">PRIMARY ACTIVE</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 p-6 rounded-3xl space-y-4 h-fit">
        <h4 className="font-bold text-white text-xs uppercase tracking-widest text-[#c29943]">Audit Logs Ledger</h4>
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {securityLogs.map((log, idx) => (
            <div key={idx} className="flex justify-between items-start text-xs border-b border-zinc-850 pb-3 gap-2">
              <div className="space-y-0.5">
                <p className="font-bold text-zinc-200">{log.action}</p>
                <p className="text-[9px] text-zinc-500 font-mono">{log.date}</p>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                log.status === 'SUCCESS' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' : 'bg-red-950/20 text-red-400 border border-red-900/40'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
