import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Establishing Secure Gateway Connection...');

  useEffect(() => {
    // 1.5 seconds loader
    const duration = 1500;
    const intervalTime = 15; // smooth updates
    const increment = (100 / (duration / intervalTime));

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const statusTimeout1 = setTimeout(() => {
      setStatus('Verifying Authentication Signatures...');
    }, 500);

    const statusTimeout2 = setTimeout(() => {
      setStatus('Securing Sandbox Ledger Environment...');
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(statusTimeout1);
      clearTimeout(statusTimeout2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-[#0d1d3f] font-sans selection:bg-[#0d1d3f]/10 transition-all select-none">
      <div className="flex flex-col items-center max-w-sm w-full px-6 space-y-8 animate-fade-in">
        {/* Pulsing Logo Container */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#0d1d3f]/5 border border-[#0d1d3f]/10 shadow-sm animate-pulse-slow">
          <Logo size={56} />
        </div>

        {/* Brand Text */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-black tracking-widest leading-none uppercase">VERIDION</h2>
          <p className="text-[9px] font-bold text-[#0d1d3f]/60 tracking-widest uppercase">Compliance Sandbox Engine</p>
        </div>

        {/* Minimalist Progress Track */}
        <div className="w-full space-y-4">
          <div className="h-[2px] w-full bg-[#0d1d3f]/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0d1d3f] transition-all duration-75 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-bold font-mono tracking-wider text-[#0d1d3f]/75 uppercase">
            <span className="truncate max-w-[280px]">{status}</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
