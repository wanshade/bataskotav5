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

      {/* Geometric Soccer Art */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Geometric Ball 1 - Large Hexagon Pattern Left */}
        <div className="absolute left-[5%] top-1/4 animate-geo-float-1">
          <svg viewBox="0 0 200 200" className="w-32 h-32 md:w-48 md:h-48 opacity-60">
            {/* Outer ring */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="#147c60" strokeWidth="1" opacity="0.3"/>
            {/* Hexagon frame */}
            <path d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z" 
                  fill="none" stroke="#147c60" strokeWidth="2" opacity="0.8"/>
            {/* Inner hexagons */}
            <path d="M100 50 L143 75 L143 125 L100 150 L57 125 L57 75 Z" 
                  fill="#147c60" opacity="0.2"/>
            {/* Pentagon center */}
            <path d="M100 80 L115 95 L108 115 L92 115 L85 95 Z" 
                  fill="#147c60" opacity="0.6"/>
            {/* Connecting lines */}
            <line x1="100" y1="20" x2="100" y2="50" stroke="#147c60" strokeWidth="1"/>
            <line x1="170" y1="60" x2="143" y2="75" stroke="#147c60" strokeWidth="1"/>
            <line x1="170" y1="140" x2="143" y2="125" stroke="#147c60" strokeWidth="1"/>
            <line x1="100" y1="180" x2="100" y2="150" stroke="#147c60" strokeWidth="1"/>
            <line x1="30" y1="140" x2="57" y2="125" stroke="#147c60" strokeWidth="1"/>
            <line x1="30" y1="60" x2="57" y2="75" stroke="#147c60" strokeWidth="1"/>
            {/* Dots at vertices */}
            <circle cx="100" cy="20" r="3" fill="#147c60"/>
            <circle cx="170" cy="60" r="3" fill="#147c60"/>
            <circle cx="170" cy="140" r="3" fill="#147c60"/>
            <circle cx="100" cy="180" r="3" fill="#147c60"/>
            <circle cx="30" cy="140" r="3" fill="#147c60"/>
            <circle cx="30" cy="60" r="3" fill="#147c60"/>
          </svg>
        </div>

        {/* Geometric Ball 2 - Wireframe Style Right */}
        <div className="absolute right-[8%] top-1/3 animate-geo-float-2">
          <svg viewBox="0 0 160 160" className="w-24 h-24 md:w-40 md:h-40 opacity-50">
            {/* Main circle */}
            <circle cx="80" cy="80" r="75" fill="none" stroke="#147c60" strokeWidth="1.5" opacity="0.4"/>
            {/* Pentagon pattern */}
            <path d="M80 25 L95 55 L125 65 L110 95 L80 85 L50 95 L35 65 L65 55 Z" 
                  fill="none" stroke="#147c60" strokeWidth="1.5"/>
            {/* Inner pentagon */}
            <path d="M80 45 L88 62 L105 68 L95 85 L65 85 L55 68 L72 62 Z" 
                  fill="#147c60" opacity="0.15"/>
            {/* Radiating lines */}
            <line x1="80" y1="80" x2="80" y2="5" stroke="#147c60" strokeWidth="0.5" opacity="0.6"/>
            <line x1="80" y1="80" x2="147" y2="45" stroke="#147c60" strokeWidth="0.5" opacity="0.6"/>
            <line x1="80" y1="80" x2="147" y2="115" stroke="#147c60" strokeWidth="0.5" opacity="0.6"/>
            <line x1="80" y1="80" x2="80" y2="155" stroke="#147c60" strokeWidth="0.5" opacity="0.6"/>
            <line x1="80" y1="80" x2="13" y2="115" stroke="#147c60" strokeWidth="0.5" opacity="0.6"/>
            <line x1="80" y1="80" x2="13" y2="45" stroke="#147c60" strokeWidth="0.5" opacity="0.6"/>
            {/* Center glow */}
            <circle cx="80" cy="80" r="15" fill="#147c60" opacity="0.3"/>
          </svg>
        </div>

        {/* Geometric Ball 3 - Minimalist Bottom */}
        <div className="absolute left-[15%] bottom-[15%] animate-geo-rotate">
          <svg viewBox="0 0 120 120" className="w-20 h-20 md:w-28 md:h-28 opacity-40">
            {/* Concentric circles */}
            <circle cx="60" cy="60" r="55" fill="none" stroke="#147c60" strokeWidth="1"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#147c60" strokeWidth="0.5" strokeDasharray="5,5"/>
            <circle cx="60" cy="60" r="25" fill="none" stroke="#147c60" strokeWidth="2"/>
            {/* Hexagon in center */}
            <path d="M60 35 L80 47 L80 73 L60 85 L40 73 L40 47 Z" 
                  fill="#147c60" opacity="0.25"/>
            {/* Small triangles at corners */}
            <path d="M60 10 L65 20 L55 20 Z" fill="#147c60" opacity="0.5"/>
            <path d="M105 35 L110 45 L100 42 Z" fill="#147c60" opacity="0.5"/>
            <path d="M105 85 L100 78 L110 75 Z" fill="#147c60" opacity="0.5"/>
            <path d="M60 110 L55 100 L65 100 Z" fill="#147c60" opacity="0.5"/>
            <path d="M15 85 L20 78 L10 75 Z" fill="#147c60" opacity="0.5"/>
            <path d="M15 35 L10 45 L20 42 Z" fill="#147c60" opacity="0.5"/>
          </svg>
        </div>

        {/* Geometric Ball 4 - Abstract Pattern Top Right */}
        <div className="absolute right-[20%] top-[10%] animate-geo-pulse">
          <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24 opacity-50">
            {/* Rotating squares forming ball shape */}
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="#147c60" strokeWidth="1" 
                  transform="rotate(45 50 50)"/>
            <rect x="30" y="30" width="40" height="40" fill="#147c60" opacity="0.1" 
                  transform="rotate(45 50 50)"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="#147c60" strokeWidth="2"/>
            {/* Cross lines */}
            <line x1="50" y1="20" x2="50" y2="80" stroke="#147c60" strokeWidth="1" opacity="0.5"/>
            <line x1="20" y1="50" x2="80" y2="50" stroke="#147c60" strokeWidth="1" opacity="0.5"/>
            {/* Corner dots */}
            <circle cx="35" cy="35" r="2" fill="#147c60"/>
            <circle cx="65" cy="35" r="2" fill="#147c60"/>
            <circle cx="65" cy="65" r="2" fill="#147c60"/>
            <circle cx="35" cy="65" r="2" fill="#147c60"/>
          </svg>
        </div>

        {/* Geometric Lines - Abstract Field Markings */}
        <div className="absolute left-0 right-0 top-1/2 animate-geo-slide">
          <svg viewBox="0 0 1200 100" className="w-full h-24 opacity-20" preserveAspectRatio="none">
            {/* Center line */}
            <line x1="0" y1="50" x2="1200" y2="50" stroke="#147c60" strokeWidth="0.5" strokeDasharray="20,10"/>
            {/* Center circle partial */}
            <path d="M500 50 A100 100 0 0 1 700 50" fill="none" stroke="#147c60" strokeWidth="1"/>
            <path d="M500 50 A100 100 0 0 0 700 50" fill="none" stroke="#147c60" strokeWidth="0.5" opacity="0.5"/>
            {/* Hexagon pattern repeated */}
            <path d="M200 30 L220 20 L240 30 L240 50 L220 60 L200 50 Z" fill="none" stroke="#147c60" strokeWidth="0.5"/>
            <path d="M800 30 L820 20 L840 30 L840 50 L820 60 L800 50 Z" fill="none" stroke="#147c60" strokeWidth="0.5"/>
            <path d="M1000 40 L1015 32 L1030 40 L1030 56 L1015 64 L1000 56 Z" fill="#147c60" opacity="0.1"/>
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute left-[40%] top-[20%] animate-geo-bounce">
          <svg viewBox="0 0 60 60" className="w-10 h-10 opacity-30">
            <polygon points="30,5 55,20 55,45 30,55 5,45 5,20" 
                     fill="none" stroke="#147c60" strokeWidth="1.5"/>
            <polygon points="30,15 45,25 45,40 30,48 15,40 15,25" 
                     fill="#147c60" opacity="0.2"/>
          </svg>
        </div>

        <div className="absolute right-[35%] bottom-[25%] animate-geo-bounce-delayed">
          <svg viewBox="0 0 50 50" className="w-8 h-8 opacity-25">
            <circle cx="25" cy="25" r="20" fill="none" stroke="#147c60" strokeWidth="1"/>
            <path d="M25 5 L28 22 L45 25 L28 28 L25 45 L22 28 L5 25 L22 22 Z" 
                  fill="#147c60" opacity="0.3"/>
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
