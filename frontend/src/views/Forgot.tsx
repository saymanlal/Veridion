import { Key } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Forgot() {
  const {
    forgotStep, setForgotStep, forgotEmail, setForgotEmail, forgotTokenInput, setForgotTokenInput,
    forgotNewPassword, setForgotNewPassword, handleForgotRequest, handleForgotComplete, setCurrentView,
  } = useApp();

  return (
    <section className="py-20 max-w-md mx-auto px-4">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">

        {forgotStep === 'request' ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Reset Credentials</h2>
              <p className="text-xs text-zinc-400">Verify user coordination directory index to dispatch reset keys.</p>
            </div>

            <form onSubmit={handleForgotRequest} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                />
              </div>
              <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all">
                Dispatch Authorization Keys
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 bg-zinc-950 border border-zinc-850 rounded-xl items-center justify-center text-[#c29943]">
                <Key className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white">Override System Keys</h2>
              <p className="text-[11px] text-zinc-400">
                If an account exists for that email, a reset code has been issued. Enter it below.
              </p>
            </div>

            <form onSubmit={handleForgotComplete} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Override Token</label>
                <input
                  type="text"
                  required
                  value={forgotTokenInput}
                  onChange={(e) => setForgotTokenInput(e.target.value)}
                  placeholder="VRD-777"
                  className="w-full text-center font-mono rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">New Password Parameters</label>
                <input
                  type="password"
                  required
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                />
              </div>

              <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all">
                Override Secrets Mappings
              </button>
            </form>
          </div>
        )}

        <div className="text-center">
          <button onClick={() => { setForgotStep('request'); setCurrentView('login'); }} className="text-xs text-zinc-400 hover:text-white transition-all underline">
            Back to Security Entrance
          </button>
        </div>
      </div>
    </section>
  );
}
