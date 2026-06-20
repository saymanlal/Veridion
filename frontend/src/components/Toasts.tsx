import { Info, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toasts() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm pointer-events-none w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-xl border shadow-2xl pointer-events-auto transition-all duration-300 bg-zinc-900 border-zinc-800 text-zinc-100 ${
            toast.type === 'success' ? 'border-[#c29943]/40' : toast.type === 'error' ? 'border-red-900/40' : 'border-zinc-700'
          }`}
        >
          {toast.type === 'success' && <ShieldCheck className="w-5 h-5 text-[#c29943] flex-shrink-0" />}
          {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-zinc-400 flex-shrink-0" />}
          <p className="text-xs font-semibold flex-grow leading-relaxed">{toast.message}</p>
          <button onClick={() => dismissToast(toast.id)} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
