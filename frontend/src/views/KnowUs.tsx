import { ChevronRight, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEADERSHIP_DATA } from '../data/constants';

const TAGS = ['Dynamic Core Team', 'Telemetry Focused', 'Assurance Obsessed'];

export default function KnowUs() {
  const { setActiveModalMember } = useApp();

  return (
    <section className="py-16 max-w-5xl mx-auto px-6 space-y-16">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">Meet Veridion</h1>
        <p className="text-xs text-[#c29943] font-bold tracking-widest uppercase font-mono">The software engineering team behind the platform</p>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-8 sm:p-12 space-y-6 text-center sm:text-left">
        <h3 className="text-xl font-bold text-white">Who We Are</h3>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          We are a distributed software team focused on designing transaction tracking tools. By pairing secure standards with complete event logs, we enable administrators to manage systems safely.
        </p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          {TAGS.map((lbl) => (
            <span key={lbl} className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              {lbl}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-lg font-bold text-white text-center uppercase tracking-widest">Leadership Spotlight</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.keys(LEADERSHIP_DATA).map((key) => {
            const m = LEADERSHIP_DATA[key];
            return (
              <div
                key={key}
                onClick={() => setActiveModalMember(key)}
                className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-6 hover:border-[#c29943] transition-all cursor-pointer flex flex-col justify-between group h-full space-y-6"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-[#c29943]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-[#c29943] transition-all">{m.name}</h4>
                    <p className="text-[10px] text-[#c29943] font-bold tracking-wider uppercase mt-1">{m.role}</p>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{m.bio}</p>
                </div>
                <span className="text-xs text-[#c29943] font-bold uppercase tracking-wider flex items-center gap-1">
                  View Profile <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
