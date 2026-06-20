import { useApp } from '../context/AppContext';

export default function Register() {
  const { registerForm, setRegisterForm, handleRegister, setCurrentView } = useApp();

  return (
    <section className="py-20 max-w-md mx-auto px-4">
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="text-xs text-zinc-400">Establish cryptographic parameters for sandbox execution</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Full Name</label>
            <input
              type="text"
              required
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              placeholder="Jane Doe"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Email Coordinate</label>
            <input
              type="email"
              required
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              placeholder="name@domain.com"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Password Parameters</label>
            <input
              type="password"
              required
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Confirm Password Parameters</label>
            <input
              type="password"
              required
              value={registerForm.confirm}
              onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
            />
          </div>

          <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all">
            Initialize Client Profile
          </button>
        </form>

        <div className="border-t border-zinc-850 pt-4 text-center">
          <p className="text-xs text-zinc-400">
            Already mapped account?{' '}
            <button onClick={() => setCurrentView('login')} className="text-[#c29943] font-bold hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </section>
  );
}
