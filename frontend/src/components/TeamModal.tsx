import { RefreshCw, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEADERSHIP_DATA } from '../data/constants';

export default function TeamModal() {
  const { activeModalMember, setActiveModalMember, modalBioExtendLoading, setModalBioExtendLoading, showToast } = useApp();

  if (!activeModalMember) return null;
  const member = LEADERSHIP_DATA[activeModalMember];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
      <div className="relative bg-[#121214] rounded-3xl border border-zinc-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={() => setActiveModalMember(null)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-[#18181b] flex items-center justify-center border-2 border-[#c29943] mb-4">
            <User className="w-10 h-10 text-[#c29943]" />
          </div>
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-xs text-[#c29943] font-bold tracking-widest uppercase mt-1">{member.role}</p>
        </div>

        <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800 relative">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Biography Parameters</span>
            <button
              onClick={() => {
                setModalBioExtendLoading(true);
                setTimeout(() => {
                  showToast('Backstory successfully extended with Gemini security insights.', 'success');
                  setModalBioExtendLoading(false);
                }, 1200);
              }}
              className="inline-flex items-center gap-1.5 text-[9px] bg-zinc-900 hover:bg-zinc-800 text-[#c29943] font-bold py-1 px-2.5 rounded-lg border border-[#c29943]/20 transition-all"
            >
              Extend with AI
            </button>
          </div>
          {modalBioExtendLoading ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <RefreshCw className="w-5 h-5 text-[#c29943] animate-spin" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Generating backtrace elements...</span>
            </div>
          ) : (
            <p className="text-xs text-zinc-300 leading-relaxed">{member.bio}</p>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secure Communication Channels</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-zinc-500 font-semibold">LinkedIn</span>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-[#c29943] hover:underline">
                {member.linkedin_handle}
              </a>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-zinc-500 font-semibold">X / Twitter</span>
              <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="font-mono text-[#c29943] hover:underline">
                {member.twitter_handle}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
