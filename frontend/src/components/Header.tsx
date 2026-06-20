import { LayoutDashboard, Menu, User } from 'lucide-react';
import { useApp, ViewName } from '../context/AppContext';
import Logo from './Logo';

const NAV_VIEWS: ViewName[] = ['home', 'about', 'know-us', 'contact'];

function navLabel(view: ViewName) {
  if (view === 'know-us') return 'Know Us';
  if (view === 'contact') return 'Contact Us';
  return view;
}

export default function Header() {
  const {
    currentView, handleNavigation, mobileMenuOpen, setMobileMenuOpen,
    currentSession, securitySettings, logout,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/95 border-b border-zinc-900 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div onClick={() => handleNavigation('home')} className="flex items-center gap-3 cursor-pointer select-none">
            <div className="h-9 w-9 flex-shrink-0">
              <Logo size={36} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-widest text-white leading-none">VERIDION</span>
              <span className="text-[8px] font-bold text-[#c29943] tracking-widest uppercase mt-0.5">FINANCIAL SANDBOX</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_VIEWS.map((view) => (
              <button
                key={view}
                onClick={() => handleNavigation(view)}
                className={`text-xs font-bold uppercase tracking-wider transition-colors py-1 ${
                  currentView === view ? 'text-[#c29943] border-b border-[#c29943]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {navLabel(view)}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {!currentSession ? (
              <>
                <button onClick={() => handleNavigation('login')} className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white px-3 py-2 transition-all">
                  Sign In
                </button>
                <button onClick={() => handleNavigation('register')} className="text-xs font-bold uppercase tracking-wider bg-[#c29943] hover:bg-[#aa8032] text-black px-4 py-2.5 rounded-lg transition-all shadow-md">
                  Get Started
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-zinc-400">
                    Inactivity: {securitySettings.lockCounter}s
                  </span>
                </div>

                <button
                  onClick={() => handleNavigation('dashboard')}
                  className={`text-xs font-bold uppercase tracking-wider transition-all px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                    currentView === 'dashboard' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Console
                </button>

                <div className="h-4 w-[1px] bg-zinc-800"></div>

                <button onClick={() => handleNavigation('profile')} className="flex items-center gap-2.5 text-left focus:outline-none group">
                  <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-[#c29943] transition-all">
                    <User className="w-4 h-4 text-[#c29943]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200 leading-none group-hover:text-white">{currentSession.name}</p>
                    <p className="text-[9px] text-[#c29943] tracking-widest uppercase mt-0.5 font-bold">Profile</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-zinc-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-zinc-900 bg-[#0a0a0c] md:hidden px-4 py-4 space-y-3">
          {NAV_VIEWS.map((view) => (
            <button
              key={view}
              onClick={() => handleNavigation(view)}
              className="block w-full text-left py-2.5 px-3 text-sm font-semibold rounded-lg hover:bg-zinc-900 text-zinc-300"
            >
              {view === 'know-us' ? 'Know Us' : view === 'contact' ? 'Contact Us' : view.toUpperCase()}
            </button>
          ))}
          <div className="border-t border-zinc-900 pt-3">
            {!currentSession ? (
              <div className="space-y-2">
                <button onClick={() => handleNavigation('login')} className="block w-full text-center py-2.5 text-sm font-bold text-zinc-300 hover:bg-zinc-900 border border-zinc-800 rounded-xl">
                  Sign In
                </button>
                <button onClick={() => handleNavigation('register')} className="block w-full text-center py-2.5 text-sm font-bold text-black bg-[#c29943] rounded-xl">
                  Get Started
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => handleNavigation('dashboard')} className="block w-full text-left py-2 px-3 text-sm font-semibold hover:bg-zinc-900 text-white rounded-lg">
                  Console Dashboard
                </button>
                <button onClick={() => handleNavigation('profile')} className="block w-full text-left py-2 px-3 text-sm font-semibold hover:bg-zinc-900 text-white rounded-lg">
                  Profile Configuration
                </button>
                <button onClick={logout} className="block w-full text-left py-2 px-3 text-sm font-semibold hover:bg-red-950/20 text-red-500 rounded-lg">
                  Revoke Session
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
