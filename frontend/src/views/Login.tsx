import { ArrowRight, CheckSquare, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const {
    tempLoginStore, setTempLoginStore, loginEmail, setLoginEmail, loginPassword, setLoginPassword,
    loginToken2FA, setLoginToken2FA, handleLoginNextStep, handleLoginFinalSubmit, setCurrentView,
  } = useApp();

  return (
    <section className="py-20 max-w-md mx-auto px-4">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">

        {!tempLoginStore ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Sign In to Sandbox</h2>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Credentials Match Code:<br />
                <strong className="font-mono text-[#c29943] bg-zinc-950 px-2 py-0.5 rounded">user@example.com / password123</strong>
              </p>
            </div>

            <form onSubmit={handleLoginNextStep} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Password</label>
                  <button type="button" onClick={() => setCurrentView('forgot')} className="text-[10px] text-[#c29943] hover:underline font-bold">Forgot Password?</button>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                />
              </div>

              <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                <span>Authorize Handshake</span> <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-zinc-950 text-[#c29943] border border-zinc-850 mb-2">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">MFA Handshake Code</h2>
              <p className="text-[11px] text-zinc-400 leading-normal">
                TOTP challenge required. Enter the 6-digit code from your authenticator app.
              </p>
            </div>

            <form onSubmit={handleLoginFinalSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-widest text-center">Verification Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={loginToken2FA}
                  onChange={(e) => setLoginToken2FA(e.target.value)}
                  placeholder="000000"
                  className="w-full text-center font-mono tracking-widest text-lg rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                />
              </div>

              <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                <CheckSquare className="w-4 h-4" /> Match MFA Parameters
              </button>
              <button type="button" onClick={() => setTempLoginStore(null)} className="w-full text-zinc-500 hover:text-zinc-300 text-xs font-semibold">
                Cancel Checkpoint
              </button>
            </form>
          </div>
        )}

        <div className="border-t border-zinc-850 pt-4 text-center">
          <p className="text-xs text-zinc-400">
            New client registration?{' '}
            <button onClick={() => setCurrentView('register')} className="text-[#c29943] font-bold hover:underline">Register Account</button>
          </p>
        </div>
      </div>
    </section>
  );
}
