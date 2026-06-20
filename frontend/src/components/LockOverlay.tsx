import { ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LockOverlay() {
  const { currentSession, securitySettings, handleRestoreLock } = useApp();

  if (!currentSession || !securitySettings.isLocked) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-[#0a0a0c]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
      <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
        <div className="inline-flex h-16 w-16 bg-red-950/40 text-red-500 rounded-2xl items-center justify-center border border-red-900/30">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white">Console Session Locked</h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Terminal secured automatically due to user keyboard/mouse inactivity to prevent terminal exposure.
          </p>
        </div>
        <form onSubmit={handleRestoreLock} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Authenticator Signature Pass</label>
            <input
              name="lockPass"
              type="password"
              required
              placeholder="Enter session security key"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Unlock Session Environment
          </button>
        </form>
      </div>
    </div>
  );
}
