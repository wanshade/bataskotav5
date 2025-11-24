import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-24 bg-dark-surface relative overflow-hidden">
       {/* Decorative Line */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent hidden md:block" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Map Visual */}
          <div className="order-2 md:order-1 relative">
            {/* Map Frame */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video md:aspect-square group">
               {/* Pseudo-Map Image */}
               <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                alt="Map Location"
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
              />
              
              {/* Tech Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 border-l-2 border-t-2 border-neon-green w-8 h-8" />
                <div className="absolute bottom-4 right-4 border-r-2 border-b-2 border-neon-green w-8 h-8" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-4 h-4 bg-neon-green rounded-full animate-ping absolute" />
                   <div className="w-4 h-4 bg-neon-green rounded-full relative shadow-[0_0_20px_#39FF14]" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded border border-zinc-700">
                 <p className="font-mono text-neon-green text-xs mb-1">COORDINATES</p>
                 <p className="font-display text-white text-sm">8°39'12.5"S 116°32'15.8"E</p>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <div className="order-1 md:order-2">
            <h2 className="font-display font-bold text-4xl uppercase mb-8">
              Temukan Kami Di <br />
              <span className="text-neon-green">Selong</span>
            </h2>

            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 group-hover:border-neon-green transition-colors">
                  <MapPin className="text-white w-5 h-5 group-hover:text-neon-green" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white">Batas Kota Space</h4>
                  <p className="text-gray-400">Jalan Gajah Mada No. 45<br/>Selong, Lombok Timur, NTB</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 group-hover:border-neon-green transition-colors">
                  <Clock className="text-white w-5 h-5 group-hover:text-neon-green" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white">Jam Operasional</h4>
                  <p className="text-gray-400">Setiap Hari: 08:00 - 23:00<br/><span className="text-neon-green text-sm">Pertandingan malam tersedia</span></p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 group-hover:border-neon-green transition-colors">
                  <Phone className="text-white w-5 h-5 group-hover:text-neon-green" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-white">Kontak</h4>
                  <p className="text-gray-400">+62 812-3456-7890</p>
                  <p className="text-gray-400 text-sm">booking@bataskota.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
               <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-block border-b border-neon-green text-neon-green pb-1 font-display text-sm tracking-widest hover:text-white hover:border-white transition-colors">
                 BUKA DI GOOGLE MAPS
               </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LocationSection;