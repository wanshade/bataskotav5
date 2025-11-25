"use client";

import { Booking } from "@/lib/schema";
import { useState } from "react";

interface ReceiptGeneratorProps {
  booking: Booking;
  onGenerate?: () => void;
}

export default function ReceiptGenerator({ booking, onGenerate }: ReceiptGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;

    setIsGenerating(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const fileName = `kwitansi-${booking.bookingId || booking.id}-${new Date().toISOString().split('T')[0]}.png`;
      
      // Make element visible for capture
      element.style.display = 'block';
      element.style.position = 'fixed';
      element.style.left = '50%';
      element.style.top = '50%';
      element.style.transform = 'translate(-50%, -50%)';
      element.style.zIndex = '9999';
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 600,
          height: element.scrollHeight
        });

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      } finally {
        // Hide element again
        element.style.display = 'none';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        element.style.transform = 'none';
      }

      onGenerate?.();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Gagal membuat kwitansi. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  

  return (
    <>
      {/* Hidden receipt content for image generation */}
      <div 
        id="receipt-content" 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px',
          display: 'none',
          width: '600px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Cyberpunk Background with Grid */}
        <div style={{ 
          background: '#050505',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Grid Pattern Background */}
          <div style={{
            position: 'absolute',
            inset: '0',
            backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.05) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            opacity: '0.3'
          }} />
          
          {/* Neon Glow Circles */}
          <div style={{
            position: 'absolute',
            top: '50px',
            left: '-100px',
            width: '250px',
            height: '250px',
            background: 'rgba(57, 255, 20, 0.1)',
            borderRadius: '50%',
            filter: 'blur(80px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '50px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'rgba(57, 255, 20, 0.08)',
            borderRadius: '50%',
            filter: 'blur(100px)'
          }} />

          {/* Main Card */}
          <div style={{ 
            backgroundColor: '#0a0a0a',
            border: '2px solid #1a1a1a',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 0 40px rgba(57, 255, 20, 0.1), 0 20px 60px rgba(0,0,0,0.5)'
          }}>
            {/* Neon Top Border */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #39FF14, transparent)',
              boxShadow: '0 0 10px #39FF14'
            }} />

            {/* Corner Brackets */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              width: '32px',
              height: '32px',
              borderTop: '3px solid #39FF14',
              borderLeft: '3px solid #39FF14',
              opacity: '0.6'
            }} />
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderTop: '3px solid #39FF14',
              borderRight: '3px solid #39FF14',
              opacity: '0.6'
            }} />
            
            {/* Header */}
            <div style={{ 
              background: 'linear-gradient(to bottom, #0f0f0f, #0a0a0a)',
              padding: '32px',
              textAlign: 'center',
              position: 'relative',
              borderBottom: '1px solid #1a1a1a'
            }}>
              {/* Status Indicator */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#39FF14',
                  boxShadow: '0 0 10px #39FF14',
                  animation: 'pulse 2s infinite'
                }} />
                <span style={{
                  fontSize: '11px',
                  color: '#39FF14',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: 'bold'
                }}>
                  PAYMENT CONFIRMED
                </span>
              </div>

              <h1 style={{ 
                fontSize: '42px', 
                fontWeight: '900', 
                margin: '0 0 4px 0',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#ffffff',
                textShadow: '0 0 20px rgba(255,255,255,0.1)'
              }}>
                BATAS<span style={{ color: '#39FF14', textShadow: '0 0 20px rgba(57, 255, 20, 0.5)' }}>KOTA</span>
              </h1>
              <p style={{ 
                fontSize: '12px', 
                margin: '0',
                color: '#666',
                letterSpacing: '3px',
                textTransform: 'uppercase'
              }}>
                The Town Space
              </p>
              
              <div style={{ 
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(57, 255, 20, 0.1)'
              }}>
                <p style={{ 
                  fontSize: '13px', 
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#888'
                }}>
                  KWITANSI
                </p>
                <p style={{ 
                  fontSize: '20px', 
                  margin: '0',
                  color: '#39FF14',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  textShadow: '0 0 10px rgba(57, 255, 20, 0.3)'
                }}>
                  {booking.bookingId || `#${booking.id}`}
                </p>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '32px', position: 'relative' }}>
              {/* Date Badge */}
              <div style={{ 
                textAlign: 'center',
                marginBottom: '28px'
              }}>
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: 'rgba(57, 255, 20, 0.1)',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#39FF14',
                  border: '1px solid rgba(57, 255, 20, 0.2)',
                  letterSpacing: '1px'
                }}>
                  {formatDate(booking.approvedAt ? new Date(booking.approvedAt).toISOString() : new Date().toISOString())}
                </div>
              </div>

              {/* Booking Info */}
              <div style={{ 
                backgroundColor: '#0f0f0f',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid rgba(57, 255, 20, 0.15)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '20px',
                  width: '60px',
                  height: '2px',
                  background: '#39FF14',
                  boxShadow: '0 0 10px #39FF14'
                }} />
                <h3 style={{ 
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#39FF14',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  margin: '0 0 16px 0'
                }}>
                  Detail Booking
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ 
                        padding: '10px 0',
                        fontSize: '14px',
                        color: '#666',
                        width: '40%'
                      }}>
                        Tanggal Main
                      </td>
                      <td style={{ 
                        padding: '10px 0',
                        fontSize: '14px',
                        color: '#ffffff',
                        fontWeight: '600',
                        textAlign: 'right'
                      }}>
                        {formatDate(booking.bookingDate)}
                      </td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #1a1a1a' }}>
                      <td style={{ 
                        padding: '10px 0',
                        fontSize: '14px',
                        color: '#666'
                      }}>
                        Waktu
                      </td>
                      <td style={{ 
                        padding: '10px 0',
                        fontSize: '14px',
                        color: '#ffffff',
                        fontWeight: '600',
                        textAlign: 'right'
                      }}>
                        {booking.timeSlot}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Customer Info */}
              <div style={{ 
                backgroundColor: '#0f0f0f',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid rgba(57, 255, 20, 0.15)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '20px',
                  width: '60px',
                  height: '2px',
                  background: '#39FF14',
                  boxShadow: '0 0 10px #39FF14'
                }} />
                <h3 style={{ 
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#39FF14',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  margin: '0 0 16px 0'
                }}>
                  Informasi Pemesan
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ 
                        padding: '10px 0',
                        fontSize: '14px',
                        color: '#666',
                        width: '40%'
                      }}>
                        Nama Tim
                      </td>
                      <td style={{ 
                        padding: '10px 0',
                        fontSize: '14px',
                        color: '#ffffff',
                        fontWeight: '600',
                        textAlign: 'right'
                      }}>
                        {booking.teamName}
                      </td>
                    </tr>
                    <tr style={{ borderTop: '1px solid #1a1a1a' }}>
                      <td style={{ 
                        padding: '10px 0',
                        fontSize: '14px',
                        color: '#666'
                      }}>
                        Kontak
                      </td>
                      <td style={{ 
                        padding: '10px 0',
                        fontSize: '14px',
                        color: '#ffffff',
                        fontWeight: '600',
                        textAlign: 'right'
                      }}>
                        {booking.phone}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Price - Large Display */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(57, 255, 20, 0.05) 100%)',
                padding: '28px',
                borderRadius: '8px',
                marginBottom: '16px',
                textAlign: 'center',
                border: '2px solid rgba(57, 255, 20, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(57, 255, 20, 0.05)',
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }} />
                <p style={{ 
                  fontSize: '12px',
                  color: '#666',
                  margin: '0 0 12px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: '600',
                  position: 'relative'
                }}>
                  Total Pembayaran
                </p>
                <p style={{ 
                  fontSize: '48px',
                  fontWeight: '900',
                  color: '#39FF14',
                  margin: '0',
                  letterSpacing: '-2px',
                  textShadow: '0 0 30px rgba(57, 255, 20, 0.5)',
                  position: 'relative'
                }}>
                  Rp {booking.price.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Payment Status */}
              <div style={{ 
                backgroundColor: '#0f0f0f',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid rgba(57, 255, 20, 0.3)',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#39FF14',
                  color: '#000000',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '900',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)'
                }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                  LUNAS
                </div>
                <p style={{ 
                  fontSize: '12px',
                  color: '#666',
                  margin: '0',
                  fontFamily: 'monospace'
                }}>
                  Approved by Admin • {new Date(booking.approvedAt || new Date()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
              backgroundColor: '#050505',
              padding: '24px',
              textAlign: 'center',
              borderTop: '1px solid rgba(57, 255, 20, 0.1)',
              position: 'relative'
            }}>
              {/* Bottom Corner Brackets */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                width: '32px',
                height: '32px',
                borderBottom: '3px solid #39FF14',
                borderLeft: '3px solid #39FF14',
                opacity: '0.6'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderBottom: '3px solid #39FF14',
                borderRight: '3px solid #39FF14',
                opacity: '0.6'
              }} />
              
              <p style={{ 
                fontSize: '11px',
                color: '#666',
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '600'
              }}>
                Terima kasih telah mempercayai kami!
              </p>
              <p style={{ 
                fontSize: '10px',
                color: '#444',
                margin: '0',
                fontFamily: 'monospace'
              }}>
                Simpan kwitansi ini sebagai bukti pembayaran
              </p>
              
              {/* Neon Line */}
              <div style={{
                marginTop: '16px',
                width: '80px',
                height: '2px',
                background: '#39FF14',
                margin: '16px auto 0',
                boxShadow: '0 0 10px #39FF14',
                borderRadius: '2px'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center p-4">
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className={`${
            isGenerating 
              ? 'bg-gray-800 cursor-not-allowed border-gray-700' 
              : 'bg-black border-neon-green hover:bg-neon-green hover:text-black shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]'
          } text-neon-green border-2 px-6 py-3 font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2 transition-all duration-300 skew-x-[-5deg]`}
        >
          <span className="block skew-x-[5deg]">
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2">Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="ml-2">Download Receipt</span>
              </>
            )}
          </span>
        </button>
      </div>
    </>
  );
}
