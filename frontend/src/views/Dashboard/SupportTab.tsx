import { PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SupportTab() {
  const { tickets, handleNavigation, setSupportMode, setSearchTicketId, setSearchedTicketResult } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Previous Incident History</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Monitor and query previously lodged compliance tickets.</p>
          </div>
          <button
            onClick={() => handleNavigation('contact')}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4 text-[#c29943]" /> New Ticket
          </button>
        </div>

        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t.id} className="bg-[#121214] border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-all space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#c29943]">{t.id}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${
                      t.status === 'RESOLVED' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' : 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">{t.subject}</h4>
                </div>
                <button
                  onClick={() => {
                    setSupportMode('tracker');
                    setSearchTicketId(t.id);
                    setSearchedTicketResult(t);
                    handleNavigation('contact');
                  }}
                  className="text-xs font-bold text-[#c29943] hover:underline"
                >
                  Track Detail
                </button>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{t.description}</p>
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono pt-2 border-t border-zinc-850">
                <span>Diagnostic attachments: {t.attachments.length}</span>
                <span>SLA Status: Compliant</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-3xl space-y-3 text-xs leading-relaxed text-zinc-400">
          <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Administrative SLAs</h4>
          <p>
            Tickets checked by administrators are evaluated inside sandboxed clusters to identify operational anomalies. Secure notification integrations emit event signals dynamically.
          </p>
        </div>
      </div>
    </div>
  );
}
