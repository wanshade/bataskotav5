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
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '0'
        }}>
          {/* White inner card */}
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            {/* Header with gradient */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '32px',
              textAlign: 'center',
              color: '#ffffff'
            }}>
              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                margin: '0 0 8px 0',
                letterSpacing: '1px'
              }}>
                BATAS KOTA
              </h1>
              <p style={{ 
                fontSize: '16px', 
                margin: '0',
                opacity: '0.95'
              }}>
                The Town Space
              </p>
              <div style={{ 
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '2px solid rgba(255,255,255,0.3)'
              }}>
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: '600',
                  margin: '0',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  KWITANSI
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  margin: '8px 0 0 0',
                  opacity: '0.9'
                }}>
                  {booking.bookingId || `#${booking.id}`}
                </p>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '32px' }}>
              {/* Date Badge */}
              <div style={{ 
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: '#f3f4f6',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {formatDate(booking.approvedAt ? new Date(booking.approvedAt).toISOString() : new Date().toISOString())}
                </div>
              </div>

              {/* Booking Info */}
              <div style={{ 
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '2px solid #e5e7eb'
              }}>
                <h3 style={{ 
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  margin: '0 0 16px 0'
                }}>
                  Detail Booking
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ 
                        padding: '8px 0',
                        fontSize: '15px',
                        color: '#6b7280',
                        width: '40%'
                      }}>
                        Tanggal Main
                      </td>
                      <td style={{ 
                        padding: '8px 0',
                        fontSize: '15px',
                        color: '#111827',
                        fontWeight: '600',
                        textAlign: 'right'
                      }}>
                        {formatDate(booking.bookingDate)}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ 
                        padding: '8px 0',
                        fontSize: '15px',
                        color: '#6b7280'
                      }}>
                        Waktu
                      </td>
                      <td style={{ 
                        padding: '8px 0',
                        fontSize: '15px',
                        color: '#111827',
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
                backgroundColor: '#f0f9ff',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '2px solid #bae6fd'
              }}>
                <h3 style={{ 
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#0369a1',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  margin: '0 0 16px 0'
                }}>
                  Informasi Pemesan
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ 
                        padding: '8px 0',
                        fontSize: '15px',
                        color: '#075985',
                        width: '40%'
                      }}>
                        Nama Tim
                      </td>
                      <td style={{ 
                        padding: '8px 0',
                        fontSize: '15px',
                        color: '#0c4a6e',
                        fontWeight: '600',
                        textAlign: 'right'
                      }}>
                        {booking.teamName}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ 
                        padding: '8px 0',
                        fontSize: '15px',
                        color: '#075985'
                      }}>
                        Kontak
                      </td>
                      <td style={{ 
                        padding: '8px 0',
                        fontSize: '15px',
                        color: '#0c4a6e',
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ 
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.9)',
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Total Pembayaran
                </p>
                <p style={{ 
                  fontSize: '42px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  margin: '0',
                  letterSpacing: '-1px'
                }}>
                  Rp {booking.price.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Payment Status */}
              <div style={{ 
                backgroundColor: '#f0fdf4',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #86efac',
                textAlign: 'center'
              }}>
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  padding: '10px 24px',
                  borderRadius: '50px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  LUNAS
                </div>
                <p style={{ 
                  fontSize: '13px',
                  color: '#15803d',
                  margin: '0'
                }}>
                  Disetujui oleh Admin • {new Date(booking.approvedAt || new Date()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ 
              backgroundColor: '#f9fafb',
              padding: '24px',
              textAlign: 'center',
              borderTop: '2px dashed #e5e7eb'
            }}>
              <p style={{ 
                fontSize: '13px',
                color: '#6b7280',
                margin: '0 0 4px 0'
              }}>
                Terima kasih telah mempercayai kami!
              </p>
              <p style={{ 
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0'
              }}>
                Simpan kwitansi ini sebagai bukti pembayaran
              </p>
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
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
          } text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Membuat Kwitansi...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Unduh Kwitansi (Gambar)
            </>
          )}
        </button>
      </div>
    </>
  );
}
