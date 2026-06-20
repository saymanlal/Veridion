import { Banknote } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PortfolioTab() {
  const { totalValuation, balances, prices, btcUSDVal, ethUSDVal, vrdUSDVal, transactions } = useApp();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">NET AGGREGATE WORTH</span>
            <Banknote className="w-4 h-4 text-[#c29943]" />
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-black tracking-tight text-white">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-[9px] text-[#c29943] font-bold tracking-widest uppercase flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span> Real-time active indices
            </p>
          </div>
        </div>

        <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">BITCOIN (BTC)</span>
            <span className="text-[10px] font-mono text-[#c29943] font-bold">${prices.BTC.toLocaleString()}</span>
          </div>
          <p className="text-xl font-bold text-white">{balances.BTC.toFixed(4)} BTC</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-mono">${btcUSDVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
        </div>

        <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">ETHEREUM (ETH)</span>
            <span className="text-[10px] font-mono text-[#c29943] font-bold">${prices.ETH.toLocaleString()}</span>
          </div>
          <p className="text-xl font-bold text-white">{balances.ETH.toFixed(4)} ETH</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-mono">${ethUSDVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
        </div>

        <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">VERIDION COIN (VRD)</span>
            <span className="text-[10px] font-mono text-[#c29943] font-bold">${prices.VRD.toLocaleString()}</span>
          </div>
          <p className="text-xl font-bold text-white">{balances.VRD.toFixed(2)} VRD</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-mono">${vrdUSDVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-zinc-850 flex items-center justify-between">
          <h3 className="font-bold text-white text-xs uppercase tracking-widest">Recent Sandbox Operations Logs</h3>
          <span className="bg-zinc-950 text-[#c29943] border border-[#c29943]/20 px-2 py-0.5 rounded text-[9px] font-bold font-mono">LEDGER DESK ONLINE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs text-zinc-400">
            <thead className="bg-zinc-950/60 font-mono tracking-wider text-zinc-500 uppercase border-b border-zinc-850">
              <tr>
                <th className="px-6 py-3.5 font-bold">Operation Code</th>
                <th className="px-6 py-3.5 font-bold">Execution Date</th>
                <th className="px-6 py-3.5 font-bold">Operational Action</th>
                <th className="px-6 py-3.5 font-bold">Asset Flow Coordinates</th>
                <th className="px-6 py-3.5 font-bold">Dynamic Hash Signature</th>
                <th className="px-6 py-3.5 font-bold">MFA Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-white">{tx.id}</td>
                  <td className="px-6 py-4 font-mono text-zinc-500">{tx.date}</td>
                  <td className="px-6 py-4 font-bold text-white">{tx.action}</td>
                  <td className="px-6 py-4 font-mono text-zinc-300">{tx.flow}</td>
                  <td className="px-6 py-4 font-mono text-zinc-500">{tx.hash}</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded font-mono text-[9px] font-bold">
                      {tx.verification}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
