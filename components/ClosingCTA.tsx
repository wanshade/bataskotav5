import React from 'react';
import NeonButton from './ui/NeonButton';
import { ChevronRight } from 'lucide-react';

const ClosingCTA: React.FC = () => {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-transparent to-dark-bg opacity-90" />
        
        {/* Football Pattern - Hexagons */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0Z' fill='none' stroke='%2339ff14' stroke-width='1'/%3E%3Cpath d='M30 52L60 69.32V103.96L30 121.28L0 103.96V69.32L30 52Z' fill='none' stroke='%2339ff14' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 104px',
          }}
        />

        {/* Football Field Abstract Lines - Center Circle & Midline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-neon-green/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-neon-green/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-neon-green/5 rounded-full pointer-events-none" />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Animated Soccer Balls */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Bouncing Soccer Ball - Left */}
        <div className="absolute left-[10%] top-1/3 animate-bounce-ball">
          <svg 
            viewBox="0 0 64 64" 
            className="w-16 h-16 md:w-24 md:h-24 drop-shadow-[0_0_15px_rgba(20,124,96,0.6)]"
          >
            {/* Ball base */}
            <circle cx="32" cy="32" r="30" fill="#1a1a1a" stroke="#147c60" strokeWidth="2"/>
            {/* Pentagon patterns - neon green */}
            <path d="M32 8 L38 16 L32 24 L26 16 Z" fill="#147c60"/>
            <path d="M32 56 L26 48 L32 40 L38 48 Z" fill="#147c60"/>
            <path d="M8 32 L16 26 L24 32 L16 38 Z" fill="#147c60"/>
            <path d="M56 32 L48 38 L40 32 L48 26 Z" fill="#147c60"/>
            {/* Connecting lines */}
            <path d="M38 16 L48 26 M48 38 L38 48 M26 48 L16 38 M16 26 L26 16" 
                  stroke="#147c60" strokeWidth="2" fill="none"/>
            {/* Inner pentagon details */}
            <circle cx="32" cy="32" r="8" fill="none" stroke="#147c60" strokeWidth="1.5"/>
            <path d="M32 24 L36 32 L32 40 L28 32 Z" fill="#0f5a47"/>
          </svg>
        </div>

        {/* Floating Soccer Ball - Right */}
        <div className="absolute right-[12%] top-1/2 animate-float-ball">
          <svg 
            viewBox="0 0 64 64" 
            className="w-12 h-12 md:w-20 md:h-20 drop-shadow-[0_0_10px_rgba(20,124,96,0.5)]"
          >
            <circle cx="32" cy="32" r="30" fill="#1a1a1a" stroke="#147c60" strokeWidth="2"/>
            <path d="M32 10 L36 18 L32 26 L28 18 Z" fill="#147c60"/>
            <path d="M32 54 L28 46 L32 38 L36 46 Z" fill="#147c60"/>
            <path d="M10 32 L18 28 L26 32 L18 36 Z" fill="#147c60"/>
            <path d="M54 32 L46 36 L38 32 L46 28 Z" fill="#147c60"/>
            <path d="M36 18 L46 28 M46 36 L36 46 M28 46 L18 36 M18 28 L28 18" 
                  stroke="#147c60" strokeWidth="2" fill="none"/>
            <circle cx="32" cy="32" r="6" fill="none" stroke="#147c60" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* Small Rolling Ball - Bottom Left */}
        <div className="absolute left-[20%] bottom-[20%] animate-roll-ball">
          <svg 
            viewBox="0 0 48 48" 
            className="w-8 h-8 md:w-12 md:h-12 drop-shadow-[0_0_8px_rgba(20,124,96,0.4)]"
          >
            <circle cx="24" cy="24" r="22" fill="#1a1a1a" stroke="#147c60" strokeWidth="1.5"/>
            <path d="M24 6 L27 12 L24 18 L21 12 Z" fill="#147c60"/>
            <path d="M24 42 L21 36 L24 30 L27 36 Z" fill="#147c60"/>
            <path d="M6 24 L12 21 L18 24 L12 27 Z" fill="#147c60"/>
            <path d="M42 24 L36 27 L30 24 L36 21 Z" fill="#147c60"/>
          </svg>
        </div>

        {/* Pulsing Ball - Top Right */}
        <div className="absolute right-[25%] top-[15%] animate-pulse-ball">
          <svg 
            viewBox="0 0 40 40" 
            className="w-6 h-6 md:w-10 md:h-10 drop-shadow-[0_0_12px_rgba(20,124,96,0.7)]"
          >
            <circle cx="20" cy="20" r="18" fill="#147c60" opacity="0.3"/>
            <circle cx="20" cy="20" r="12" fill="#1a1a1a" stroke="#147c60" strokeWidth="2"/>
            <path d="M20 10 L23 15 L20 20 L17 15 Z" fill="#147c60"/>
            <path d="M20 30 L17 25 L20 20 L23 25 Z" fill="#147c60"/>
            <path d="M10 20 L15 17 L20 20 L15 23 Z" fill="#147c60"/>
            <path d="M30 20 L25 23 L20 20 L25 17 Z" fill="#147c60"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-20 text-center">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white uppercase mb-6">
          Setiap Permainan <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500 drop-shadow-[0_0_10px_rgba(20,124,96,0.5)]">Punya Cerita</span>.
        </h2>

        <p className="font-sans text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-4 leading-relaxed">
          Biarkan Batas Kota menjadi tempat bermain mini soccermu
        </p>

        <p className="font-sans text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Saatnya kamu merasakan kualitas permainan yang sebenarnya mulai sekarang.
        </p>

        <a href="#booking">
          <NeonButton className="flex items-center gap-2 mx-auto">
            Pesan Lapangan <ChevronRight className="w-5 h-5" />
          </NeonButton>
        </a>
      </div>
    </section>
  );
};

export default ClosingCTA;
