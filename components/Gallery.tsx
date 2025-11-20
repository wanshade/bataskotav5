import React from 'react';

const images = [
  {
    src: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2070&auto=format&fit=crop",
    title: "Night Matches",
    category: "Atmosphere"
  },
  {
    src: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop",
    title: "Pro Turf",
    category: "Facilities"
  },
  {
    src: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2071&auto=format&fit=crop",
    title: "Team Locker",
    category: "Amenities"
  },
  {
    src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2070&auto=format&fit=crop",
    title: "Strategic Play",
    category: "Action"
  }
];

const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="py-24 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-display font-bold text-4xl uppercase mb-2">The <span className="text-neon-green">Arena</span></h2>
            <p className="text-gray-400">A glimpse into the Batas Kota experience.</p>
          </div>
          <button className="hidden md:block text-neon-green font-display text-sm uppercase tracking-widest hover:text-white transition-colors">
            View All Photos &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`group relative overflow-hidden rounded-xl h-64 md:h-80 ${idx === 0 || idx === 3 ? 'md:col-span-2' : ''}`}
            >
              <img 
                src={img.src} 
                alt={img.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-300" />
              
              {/* Border overlay */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-green/50 transition-colors duration-300 m-4 rounded-lg" />

              <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-neon-green font-sans text-xs font-bold uppercase tracking-widest mb-1 block opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  {img.category}
                </span>
                <h3 className="font-display font-bold text-2xl text-white">{img.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;