import { useApp } from '../context/AppContext';
import Logo from './Logo';

export default function Footer() {
  const { handleNavigation, showToast } = useApp();

  return (
    <footer className="bg-[#121214] border-t border-zinc-900 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div onClick={() => handleNavigation('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="h-8 w-8">
              <Logo size={32} />
            </div>
            <span className="text-sm font-black tracking-widest text-white">VERIDION</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-zinc-500">
            <button onClick={() => showToast('Simulated operational privacy terms policy active.', 'info')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => showToast('Sandbox standard operations rules map context loaded.', 'info')} className="hover:text-white transition-colors">Terms of Operations</button>
            <button onClick={() => handleNavigation('contact')} className="hover:text-white transition-colors">Support Desk</button>
          </div>
        </div>

        <div className="border-t border-zinc-850 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>© 2026 VERIDION. Mapped and compiled under fully compliant single-page React framework standards.</p>
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-zinc-400 font-bold bg-zinc-950 border border-zinc-850 px-3 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Gateway status: active
          </div>
        </div>
      </div>
    </footer>
  );
}
