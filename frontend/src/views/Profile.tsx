import { Camera, LogOut, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const {
    currentSession, setCurrentView, showToast, logout,
    profileNameInput, setProfileNameInput, handleProfileUpdate,
    profileCurrentPassword, setProfileCurrentPassword,
    profileNewPassword, setProfileNewPassword, handlePasswordRotate,
  } = useApp();

  if (!currentSession) return null;

  return (
    <section className="py-16 max-w-4xl mx-auto px-6 space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('dashboard')} className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-zinc-400 hover:text-white rounded-xl transition-all">
          <X className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white leading-none">Security Mappings & Credentials</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage corporate identity profiles and authentication keys</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-xl h-fit">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-zinc-950 border-2 border-zinc-850 flex items-center justify-center">
              <User className="w-12 h-12 text-[#c29943]" />
            </div>
            <button onClick={() => showToast('Diagnostic: Profile assets modification locked in sandbox.', 'info')} className="absolute bottom-0 right-0 p-2 bg-[#c29943] text-black rounded-full hover:bg-[#aa8032] transition-all">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h3 className="font-bold text-white text-base">{currentSession.name}</h3>
            <p className="text-xs font-mono text-zinc-400">{currentSession.email}</p>
          </div>

          <div className="w-full border-t border-zinc-850 my-2"></div>

          <div className="w-full text-left space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Security Index</span>
              <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold">VERIFIED COHERENT</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Node Activation</span>
              <span className="font-mono text-zinc-300 font-bold">{currentSession.createdDate}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500">Session UUID</span>
              <span className="font-mono text-zinc-300 select-all truncate max-w-[110px] font-bold">{currentSession.uuid}</span>
            </div>
          </div>

          <button onClick={logout} className="w-full bg-red-950/20 text-red-400 border border-red-900/40 hover:bg-red-950/40 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
            <LogOut className="w-4 h-4" /> Revoke Session Credentials
          </button>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#c29943]">Credentials Parameters</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Full Identity Name</label>
                <input
                  type="text"
                  required
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-zinc-500 tracking-wider">Email Address coordinate (ReadOnly)</label>
                <input
                  type="email"
                  disabled
                  value={currentSession.email}
                  className="w-full rounded-xl bg-zinc-950/50 border border-zinc-850 px-4 py-3 text-sm text-zinc-500 font-mono cursor-not-allowed"
                />
              </div>
              <button type="submit" className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all">
                Save Mapped Data
              </button>
            </form>
          </div>

          <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#c29943]">Rotate Secret Signatures</h3>
            <form onSubmit={handlePasswordRotate} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Active Password</label>
                <input
                  type="password"
                  required
                  value={profileCurrentPassword}
                  onChange={(e) => setProfileCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">New Password Parameters</label>
                <input
                  type="password"
                  required
                  value={profileNewPassword}
                  onChange={(e) => setProfileNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                />
              </div>
              <button type="submit" className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all">
                Commit Secret Updates
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
