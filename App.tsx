import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Gallery from './components/Gallery';
import BookingSection from './components/BookingSection';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-neon-green selection:text-black overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Gallery />
        <BookingSection />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;