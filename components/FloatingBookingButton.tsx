'use client'

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const FloatingBookingButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToBooking}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-neon-green text-black
        flex items-center justify-center
        shadow-[0_0_20px_rgba(57,255,20,0.5)]
        hover:shadow-[0_0_30px_rgba(57,255,20,0.8)]
        hover:scale-110
        active:scale-95
        transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
      aria-label="Book Now"
    >
      <Calendar className="w-6 h-6" />
    </button>
  );
};

export default FloatingBookingButton;
