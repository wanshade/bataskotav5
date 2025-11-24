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

      <div className="container mx-auto px-6 relative z-20 text-center">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white uppercase mb-6">
          Setiap Permainan <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500 drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">Punya Cerita</span>.
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
