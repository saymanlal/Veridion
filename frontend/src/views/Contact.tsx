import { AlertTriangle, Mail, Paperclip, PlusCircle, RefreshCw, Search, Send, ShieldCheck, UploadCloud, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Contact() {
  const {
    supportMode, setSupportMode, complaintForm, setComplaintForm, handleComplaintSubmit,
    polishComplaintText, aiPolishLoading, uploadedFiles, handleFileUpload, removeAttachment,
    searchTicketId, setSearchTicketId, handleTicketSearch, searchedTicketResult,
  } = useApp();

  return (
    <section className="py-16 max-w-6xl mx-auto px-6 space-y-12">
      <div className="text-center space-y-3">
        <span className="bg-zinc-900 text-[#c29943] border border-[#c29943]/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
          Support Node Desk
        </span>
        <h1 className="text-3xl font-extrabold text-white">Secure Incident Portal</h1>
        <p className="text-xs text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Log regulatory complaints, submit logs for system verification, or track ticket statuses under active databases.
        </p>
      </div>

      <div className="flex justify-center gap-3 border-b border-zinc-900 pb-6">
        <button
          onClick={() => setSupportMode('form')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            supportMode === 'form' ? 'bg-[#c29943] text-black' : 'bg-zinc-900 text-zinc-300'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> Submit Case Payload
        </button>
        <button
          onClick={() => setSupportMode('tracker')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            supportMode === 'tracker' ? 'bg-[#c29943] text-black' : 'bg-zinc-900 text-zinc-300'
          }`}
        >
          <Search className="w-4 h-4" /> Track Incident Status
        </button>
      </div>

      {supportMode === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Record Incident</h3>

            <form onSubmit={handleComplaintSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Registered Identity</label>
                  <input
                    type="text"
                    required
                    value={complaintForm.name}
                    onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Communications Email</label>
                  <input
                    type="email"
                    required
                    value={complaintForm.email}
                    onChange={(e) => setComplaintForm({ ...complaintForm, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Issue Classification</label>
                  <select
                    required
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] bg-[#0a0a0c]"
                  >
                    <option value="" disabled>Select category...</option>
                    <option value="Transaction issues">Transaction issues (Delays, swaps, ledger balance)</option>
                    <option value="Account access problems">Account access problems (Login lockouts, 2FA errors)</option>
                    <option value="App bugs">App bugs (Simulation, UI state, terminal issues)</option>
                    <option value="Payment/deposit issues">Payment/deposit issues (Mock cash pool, settlements)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">Ticket Subject Line</label>
                  <input
                    type="text"
                    required
                    value={complaintForm.subject}
                    onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                    placeholder="Brief summary of the challenge"
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Regulated Narrative</label>
                  <button
                    type="button"
                    onClick={polishComplaintText}
                    className="bg-zinc-900 hover:bg-zinc-800 text-[#c29943] border border-[#c29943]/20 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    Polish with AI
                  </button>
                </div>
                <textarea
                  required
                  rows={5}
                  value={complaintForm.message}
                  onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
                  placeholder="Provide deep details of your challenge or complaint..."
                  className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#c29943] resize-none"
                />
                {aiPolishLoading && (
                  <div className="absolute inset-0 bg-[#0a0a0c]/80 rounded-xl flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-6 h-6 text-[#c29943] animate-spin" />
                    <span className="text-xs font-mono font-bold text-zinc-300">Evaluating telemetry via Gemini...</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase text-zinc-400 tracking-wider">Diagnostic Attachments</label>
                <div className="border-2 border-dashed border-zinc-800 hover:border-[#c29943]/30 bg-zinc-950/40 hover:bg-zinc-950 transition-all rounded-2xl p-6 text-center cursor-pointer relative">
                  <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="space-y-2 pointer-events-none">
                    <UploadCloud className="w-8 h-8 text-[#c29943] mx-auto" />
                    <p className="text-xs font-bold text-zinc-300">Drag & drop files or click to upload</p>
                    <p className="text-[10px] text-zinc-500">Supported formats: PDF, PNG, JPG, JSON (Max 5MB each)</p>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {uploadedFiles.map((file, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-850 px-3 py-1 rounded-lg text-xs font-mono text-zinc-300">
                        <Paperclip className="w-3.5 h-3.5 text-[#c29943]" />
                        <span>{file.name}</span>
                        <button type="button" onClick={() => removeAttachment(idx)} className="text-zinc-500 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
                <input
                  id="notifToggle"
                  type="checkbox"
                  checked={complaintForm.enableNotifications}
                  onChange={(e) => setComplaintForm({ ...complaintForm, enableNotifications: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-800 text-[#c29943] bg-zinc-950 focus:ring-0"
                />
                <label htmlFor="notifToggle" className="text-xs text-zinc-400 select-none cursor-pointer">
                  Enable automated communications telemetry regarding updates of this incident.
                </label>
              </div>

              <button
                type="submit"
                className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Commit Case Payload
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-white text-sm">Regulatory Policies</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Incident workflows operate inside our certified SOC 2 playground context. Logs will mock standard response protocols.
              </p>
              <div className="space-y-2 text-[11px] text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#c29943]" />
                  <span>SLA: Updates in 120 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#c29943]" />
                  <span>Communications secure endpoint</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-widest text-[#c29943]">Dynamic Search</h4>
              <p className="text-xs text-zinc-400">
                Look up existing security tickets dynamically to check logs.
              </p>
              <button
                onClick={() => setSupportMode('tracker')}
                className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Track Incident Status
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Track Ticket</h3>
            <form onSubmit={handleTicketSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={searchTicketId}
                onChange={(e) => setSearchTicketId(e.target.value)}
                placeholder="e.g. VRD-TKT-1082"
                className="flex-grow rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#c29943] uppercase"
              />
              <button type="submit" className="bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Trace Logs
              </button>
            </form>
            <p className="text-xs text-zinc-500 font-mono text-center">
              Active Demo Codes: <span onClick={() => setSearchTicketId('VRD-TKT-1082')} className="text-[#c29943] font-bold hover:underline cursor-pointer">VRD-TKT-1082</span> or <span onClick={() => setSearchTicketId('VRD-TKT-0941')} className="text-[#c29943] font-bold hover:underline cursor-pointer">VRD-TKT-0941</span>
            </p>
          </div>

          {searchedTicketResult ? (
            <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-500">{searchedTicketResult.id}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${
                      searchedTicketResult.status === 'RESOLVED' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/50' : 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                    }`}>
                      {searchedTicketResult.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">{searchedTicketResult.subject}</h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{searchedTicketResult.date}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description Narrative</span>
                <p className="text-xs text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-850 leading-relaxed">
                  {searchedTicketResult.description}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Analyst Log Entries</span>
                <div className="space-y-3">
                  {searchedTicketResult.responses.map((resp, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white uppercase tracking-wider">{resp.sender}</span>
                        <span className="font-mono text-zinc-500">{resp.date}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{resp.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : searchTicketId && (
            <div className="bg-red-950/10 border border-red-900/30 rounded-3xl p-8 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
              <h4 className="font-bold text-white text-sm">Database Sync Mismatch</h4>
              <p className="text-xs text-red-400">Incident coordinate verification signature was not discovered in directory.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
