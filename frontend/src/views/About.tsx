import { Eye, Feather, Info, Lightbulb, ServerCrash, Target } from 'lucide-react';

export default function About() {
  return (
    <section className="py-16 max-w-4xl mx-auto px-6 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">Corporate Architecture</h1>
        <p className="text-xs text-[#c29943] font-bold tracking-widest uppercase">DISCOVER OUR MISSION AND CORE INFRASTRUCTURE</p>
      </div>

      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-850 pb-4">
          <Info className="w-6 h-6 text-[#c29943]" />
          <h3 className="text-lg font-bold text-white">Architecture Overview</h3>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Veridion is designed to evaluate, test, and authenticate cryptographic payloads in high-throughput database ecosystems. Our tools allow system coordinators to trace data streams without deployment vulnerability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Target className="w-4.5 h-4.5 text-[#c29943]" />
            <span>Our Mission</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Simplify integration checks through reliable APIs and secure testing structures. We verify operational flows to maintain standards consistency.
          </p>
        </div>

        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Eye className="w-4.5 h-4.5 text-[#c29943]" />
            <span>Our Vision</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            To provide the standard testing framework for financial payload validations, keeping system safety the core priority.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white text-center uppercase tracking-wider">Our Core Pillars</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl text-center space-y-3">
            <Lightbulb className="w-6 h-6 text-[#c29943] mx-auto" />
            <h4 className="font-bold text-white text-sm">Innovation</h4>
            <p className="text-[11px] text-zinc-400">Streamlining high-frequency checks with reliable state operations.</p>
          </div>

          <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl text-center space-y-3">
            <Feather className="w-6 h-6 text-[#c29943] mx-auto" />
            <h4 className="font-bold text-white text-sm">Simplicity</h4>
            <p className="text-[11px] text-zinc-400">Making complex system monitoring straightforward and readable.</p>
          </div>

          <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl text-center space-y-3">
            <ServerCrash className="w-6 h-6 text-[#c29943] mx-auto" />
            <h4 className="font-bold text-white text-sm">Reliability</h4>
            <p className="text-[11px] text-zinc-400">Mitigating integration hazards via robust local safety modules.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
