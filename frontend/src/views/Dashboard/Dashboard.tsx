import { LayoutDashboard, LifeBuoy, LogOut, ShieldCheck, TrendingUp, Wallet, RefreshCw } from 'lucide-react';
import { useApp, DashboardTab as DashboardTabName } from '../../context/AppContext';
import PortfolioTab from './PortfolioTab';
import TradeTab from './TradeTab';
import SecurityTab from './SecurityTab';
import SupportTab from './SupportTab';

const TAB_LABELS: Record<DashboardTabName, string> = {
  assets: 'PORTFOLIO DECK',
  swap: 'TRADE DESK',
  security: 'SECURITY CENTER',
  support: 'SUPPORT DESK',
};

export default function Dashboard() {
  const { currentSession, dashboardTab, setDashboardTab, logout, handleManualTickerSync } = useApp();

  if (!currentSession) return null;

  return (
    <section className="bg-[#0e0e11] flex flex-col md:flex-row h-full">
      <aside className="w-full md:w-64 bg-[#121214] border-b md:border-b-0 md:border-r border-zinc-900 flex flex-col p-4 space-y-2">
        <div className="p-3 border-b border-zinc-850 hidden md:block">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Security Control</span>
        </div>

        <button
          onClick={() => setDashboardTab('assets')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
            dashboardTab === 'assets' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Wallet className="w-4.5 h-4.5" /> Portfolio Deck
        </button>

        <button
          onClick={() => setDashboardTab('swap')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
            dashboardTab === 'swap' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <TrendingUp className="w-4.5 h-4.5" /> Trade Desk
        </button>

        <button
          onClick={() => setDashboardTab('security')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
            dashboardTab === 'security' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <ShieldCheck className="w-4.5 h-4.5" /> Security Center
        </button>

        <button
          onClick={() => setDashboardTab('support')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
            dashboardTab === 'support' ? 'bg-[#c29943]/20 text-[#c29943]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <LifeBuoy className="w-4.5 h-4.5" /> Support Desk
        </button>

        <div className="flex-grow hidden md:block"></div>

        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-950/20 transition-all text-left">
          <LogOut className="w-4.5 h-4.5" /> Revoke Session
        </button>
      </aside>

      <div className="flex-grow p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div>
            <span className="px-2.5 py-1 text-[9px] font-bold font-mono tracking-widest text-[#c29943] bg-zinc-900 border border-zinc-800 rounded-lg uppercase">
              {TAB_LABELS[dashboardTab]}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              Compliant Sandbox Environment
            </h1>
            <p className="text-xs text-zinc-450 mt-1">Inspecting authenticated transactions, cryptographic variables, and user devices.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleManualTickerSync} className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-xs font-bold uppercase tracking-wider text-zinc-300 rounded-xl transition-all flex items-center gap-2 shadow-sm">
              <RefreshCw className="w-4 h-4 text-[#c29943]" /> Synchronize Ledger Nodes
            </button>
          </div>
        </div>

        {dashboardTab === 'assets' && <PortfolioTab />}
        {dashboardTab === 'swap' && <TradeTab />}
        {dashboardTab === 'security' && <SecurityTab />}
        {dashboardTab === 'support' && <SupportTab />}
      </div>
    </section>
  );
}
