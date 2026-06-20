import { Zap } from 'lucide-react';
import { Balances, Prices, useApp } from '../../context/AppContext';

export default function TradeTab() {
  const {
    balances, prices, tradeAsset, setTradeAsset, tradeAction, setTradeAction,
    tradeVolume, setTradeVolume, executeTrade, replenishUSD,
  } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Execute Sandbox Exchange</h3>
          <p className="text-xs text-zinc-400 mt-1">Configure asset volume, calculate instant costs, and confirm transaction logs.</p>
        </div>

        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#c29943]/10 border border-[#c29943]/20 text-[#c29943] rounded-xl flex items-center justify-center font-bold">
              $
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Simulated Cash Pool (USD)</p>
              <p className="text-base font-black text-zinc-200 leading-tight">${balances.USD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
          <button onClick={replenishUSD} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider">
            Load Mock cash
          </button>
        </div>

        <form onSubmit={executeTrade} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Target Asset</label>
              <select
                value={tradeAsset}
                onChange={(e) => setTradeAsset(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] bg-[#0a0a0c] font-bold"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="VRD">Veridion Coin (VRD)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Trade Action</label>
              <select
                value={tradeAction}
                onChange={(e) => setTradeAction(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] bg-[#0a0a0c] font-bold"
              >
                <option value="BUY">BUY (Deduct USD cash)</option>
                <option value="SELL">SELL (Credit USD cash)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Asset Amount</label>
              <button
                type="button"
                onClick={() => {
                  if (tradeAction === 'BUY') {
                    setTradeVolume((balances.USD / prices[tradeAsset as keyof Prices]).toFixed(6));
                  } else {
                    setTradeVolume(balances[tradeAsset as keyof Balances].toString());
                  }
                }}
                className="text-[10px] text-[#c29943] font-bold hover:underline"
              >
                Use Maximum Limit
              </button>
            </div>
            <input
              type="number"
              step="any"
              required
              value={tradeVolume}
              onChange={(e) => setTradeVolume(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
            />
          </div>

          <div className="bg-zinc-950/60 p-4 border border-zinc-900 rounded-xl space-y-2 text-xs text-zinc-455 font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-500">Current Index rate</span>
              <span className="font-bold text-white">${prices[tradeAsset as keyof Prices].toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Estimated Slippage</span>
              <span className="font-bold text-emerald-400">0.05%</span>
            </div>
            <div className="border-t border-zinc-850 pt-2 flex justify-between text-sm font-bold">
              <span className="text-zinc-400">Estimated aggregate Settlement</span>
              <span className="text-[#c29943] font-bold">
                ${((parseFloat(tradeVolume) || 0) * prices[tradeAsset as keyof Prices]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </span>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md">
            <Zap className="w-4 h-4" /> Commit Settlement Handshake
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-3xl space-y-4">
          <h4 className="font-bold text-white text-xs uppercase tracking-widest text-[#c29943]">Live Indices Tickers</h4>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
              <span className="text-zinc-400">BTC / USD</span>
              <span className="font-bold text-white">${prices.BTC.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
              <span className="text-zinc-400">ETH / USD</span>
              <span className="font-bold text-white">${prices.ETH.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">VRD / USD</span>
              <span className="font-bold text-[#c29943]">${prices.VRD.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-3 text-xs leading-relaxed text-zinc-400">
          <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Settlement Matrix Rules</h4>
          <p>
            Assets exchanges execute directly into temporary local storage arrays. Recalculation ticks refresh telemetry every 12 seconds to emulate dynamic market fluctuation structures.
          </p>
        </div>
      </div>
    </div>
  );
}
