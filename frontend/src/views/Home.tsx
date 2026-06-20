import {
  ArrowRight, Clock, DownloadCloud, Fingerprint, FileCheck, Key, LifeBuoy,
  Lock, Mail, Phone, ShieldCheck, TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { handleNavigation, triggerComplaintNavigation, simulateDownload } = useApp();

  return (
    <section className="space-y-20 pb-20">
      <div className="relative overflow-hidden py-24 sm:py-32 bg-[#121214] border-b border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-[#c29943]/30 text-[#c29943] text-[10px] font-bold tracking-widest uppercase">
            <span className="flex h-2 w-2 rounded-full bg-[#c29943] animate-pulse"></span>
            SECURE DYNAMIC LEDGER PLAYGROUND
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Deploy Compliance <span className="text-[#c29943]">Sandbox Engines</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Analyze payloads and trade currencies within our real-time administrative mock framework. Protect transaction security using client-side inactivity firewalls and dynamic TOTP matrices.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button onClick={() => handleNavigation('login')} className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2">
              <Key className="w-4 h-4" /> Access Portal Dashboard
            </button>
            <button onClick={triggerComplaintNavigation} className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-[#c29943]" /> Submit Incident Case
            </button>
            <button onClick={simulateDownload} className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2">
              <DownloadCloud className="w-4 h-4 text-[#c29943]" /> Download App CLI
            </button>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#232329_1px,transparent_1px),linear-gradient(to_bottom,#232329_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      </div>

      <div className="bg-[#0e0e11] border-y border-zinc-900 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Enterprise Compliance & Regulatory Auditing</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-zinc-400 text-xs font-mono">
            <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-zinc-800/80">
              <ShieldCheck className="w-5 h-5 text-[#c29943]" />
              <span className="font-bold tracking-wider uppercase">SOC 2 TYPE II AUDITED</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-zinc-800/80">
              <FileCheck className="w-5 h-5 text-[#c29943]" />
              <span className="font-bold tracking-wider uppercase">ISO/IEC 27001 SECURED</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-zinc-800/80">
              <Fingerprint className="w-5 h-5 text-[#c29943]" />
              <span className="font-bold tracking-wider uppercase">GDPR CRYPTO ASSURANCE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Engineered for absolute session protection</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Minimal latency, cryptographically compliant components</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-2xl space-y-4 hover:border-[#c29943]/30 transition-all">
            <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-[#c29943]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Dynamic 2FA Handshake</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Verify account actions and control terminal authorization states with time-synced identity validations.
            </p>
          </div>

          <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-2xl space-y-4 hover:border-[#c29943]/30 transition-all">
            <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-[#c29943]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Simulated Trade Ledger</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Test payload mechanics and adjust coin balances instantly inside a localized, memory-safe data model.
            </p>
          </div>

          <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-2xl space-y-4 hover:border-[#c29943]/30 transition-all">
            <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-[#c29943]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Inactivity Shield Guard</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automatically lock environments and blur tracking indices when system interactions detect prolonged idling.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-900 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Ecosystem Integration Log</h3>
            <p className="text-xs text-zinc-400">Chronological telemetry audit announcements</p>
          </div>
          <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider mt-2 sm:mt-0">Node Status: Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#121214] border border-zinc-800 rounded-2xl space-y-3">
            <span className="text-[10px] font-mono font-bold text-[#c29943] uppercase tracking-widest">Update #1024 — June 2026</span>
            <h4 className="font-bold text-white text-sm">Enhanced Client Inactivity Triggers</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Deployed persistent timer listeners checking interface action triggers across all active DOM levels. Standardized auto-lock transitions mapped into user security parameters.
            </p>
          </div>

          <div className="p-6 bg-[#121214] border border-zinc-800 rounded-2xl space-y-3">
            <span className="text-[10px] font-mono font-bold text-[#c29943] uppercase tracking-widest">Update #1019 — May 2026</span>
            <h4 className="font-bold text-white text-sm">Strict 2FA Sandbox Enforcements</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Transitioned authentication pipeline checks to require multi-factor handshake actions on logins when system configuration properties indicate active security policies.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-[#121214] rounded-3xl p-8 sm:p-12 border border-zinc-800/80 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="space-y-4 relative z-10 max-w-lg">
            <h3 className="text-2xl font-bold text-white">Need administrative assistance?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our dynamic engineering desk monitors complaints and platform anomalies continuously. Submit incident logs for rapid diagnostic evaluations.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400 pt-2">
              <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#c29943]" /> support@veridion.xyz</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#c29943]" /> +1 (555) 234-8761</span>
            </div>
          </div>
          <button
            onClick={() => handleNavigation('contact')}
            className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 flex-shrink-0 relative z-10"
          >
            Contact Help Desk <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
