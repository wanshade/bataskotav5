import React, { useEffect, useRef, useState } from 'react';
import { Activity, Award, Coffee, Moon, ShieldCheck, Wifi } from 'lucide-react';

const features = [
  {
    icon: <Award className="w-8 h-8 text-black" />,
    title: "FIFA Standard Turf",
    description: "High-performance synthetic grass designed for speed, control, and injury prevention."
  },
  {
    icon: <Moon className="w-8 h-8 text-black" />,
    title: "Night Mode Lighting",
    description: "Professional LED floodlights calibrated for zero-glare visibility during night matches."
  },
  {
    icon: <Activity className="w-8 h-8 text-black" />,
    title: "Performance Tracking",
    description: "Digital scoreboard integration and match recording capabilities available on request."
  },
  {
    icon: <Coffee className="w-8 h-8 text-black" />,
    title: "The Dugout Lounge",
    description: "Premium recovery zone with refreshments, AC, and tactical view of the pitch."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-black" />,
    title: "Secure Facility",
    description: "Private lockers, secure parking, and 24/7 CCTV surveillance for peace of mind."
  },
  {
    icon: <Wifi className="w-8 h-8 text-black" />,
    title: "High-Speed WiFi",
    description: "Stay connected. Stream your match live or share highlights instantly."
  }
];

const Features: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            // Card is entering viewport - add hover effects
            setVisibleCards((prev) => new Set(prev).add(index));
          } else {
            // Card is leaving viewport - remove hover effects
            setVisibleCards((prev) => {
              const newSet = new Set(prev);
              newSet.delete(index);
              return newSet;
            });
          }
        });
      },
      {
        threshold: [0, 0.3], // Trigger when 0% and 30% of the card is visible
        rootMargin: '-50px 0px -50px 0px' // Start animation slightly before fully visible
      }
    );

    // Observe all cards
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section id="features" className="py-24 bg-dark-surface relative overflow-hidden">
      {/* Section Header */}
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="font-display font-bold text-4xl md:text-5xl uppercase mb-4">
          Core <span className="text-neon-green">Specs</span>
        </h2>
        <div className="h-1 w-24 bg-neon-green mx-auto rounded-full shadow-[0_0_10px_#39FF14]" />
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {features.map((feature, index) => {
          const isVisible = visibleCards.has(index);
          return (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className={`group p-1 rounded-2xl transition-all duration-1000 ${
                isVisible
                  ? 'bg-gradient-to-br from-neon-green to-neon-dark scale-105'
                  : 'bg-gradient-to-br from-zinc-800 to-zinc-900 scale-100'
              } hover:from-neon-green hover:to-neon-dark hover:scale-105`}
            >
              <div className="h-full bg-dark-card p-8 rounded-xl flex flex-col items-start gap-4 relative overflow-hidden">
                {/* Icon Box */}
                <div className={`w-14 h-14 rounded-lg bg-neon-green flex items-center justify-center transition-all duration-700 shadow-[0_0_15px_rgba(57,255,20,0.3)] ${
                  isVisible ? 'scale-110 shadow-[0_0_25px_rgba(57,255,20,0.6)]' : 'scale-100'
                } hover:scale-110 hover:shadow-[0_0_25px_rgba(57,255,20,0.6)]`}>
                  {feature.icon}
                </div>

                <h3 className={`font-display font-bold text-xl mt-2 transition-colors duration-700 ${
                  isVisible ? 'text-neon-green' : 'text-white'
                } hover:text-neon-green`}>
                  {feature.title}
                </h3>

                <p className={`font-sans text-sm leading-relaxed transition-all duration-700 ${
                  isVisible ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  {feature.description}
                </p>

                {/* Decorative bg element */}
                <div className={`absolute -right-4 -bottom-4 transition-all duration-700 transform rotate-12 scale-150 pointer-events-none ${
                  isVisible ? 'text-zinc-700 opacity-30' : 'text-zinc-800 opacity-20'
                } hover:text-zinc-700 hover:opacity-30`}>
                  {feature.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;