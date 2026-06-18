'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        throw new Error('Gagal mengirim pesan');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      // Auto-reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <main className="container section">
      <div className="section-header" style={{ marginBottom: '3.5rem' }}>
        <h1 className="section-title">Hubungi Kami</h1>
        <p className="section-subtitle">
          Punya pertanyaan, keluhan, atau ingin memesan katering khusus? Jangan ragu untuk menghubungi kami.
        </p>
      </div>

      <div className="contact-grid">
        {/* Contact Info Cards */}
        <div className="contact-info-card animate-fade-in">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-dark)' }}>
            Informasi Kontak
          </h3>

          <div className="contact-item">
            <div className="contact-icon" aria-hidden="true">
              📍
            </div>
            <div className="contact-details">
              <h4>Alamat</h4>
              <p>Jl. Ubi Ungu No. 12, Braga, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40111</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon" aria-hidden="true">
              📞
            </div>
            <div className="contact-details">
              <h4>Telepon / WhatsApp</h4>
              <p>+62 812-3456-789</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon" aria-hidden="true">
              ✉️
            </div>
            <div className="contact-details">
              <h4>Email</h4>
              <p>
                halo@purplebite.com
                <br />
                info@purplebite.com
              </p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon" aria-hidden="true">
              🕒
            </div>
            <div className="contact-details">
              <h4>Jam Operasional</h4>
              <p>Setiap Hari: 08:00 - 20:00 WIB</p>
            </div>
          </div>
        </div>

        {/* Contact Form Wrapper */}
        <div className="contact-form-wrapper animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="contact-form-title">Kirim Pesan</h2>
          <p className="contact-form-subtitle">
            Tulis pesan Anda di bawah ini, tim kami akan merespons dalam waktu 1x24 jam.
          </p>

          {status === 'success' && (
            <div className="alert-success" style={{ display: 'block', marginBottom: '1.5rem' }}>
              Terima kasih! Pesan Anda telah terkirim dan disimpan di database kami.
            </div>
          )}

          {status === 'error' && (
            <div
              className="alert-success"
              style={{
                display: 'block',
                marginBottom: '1.5rem',
                backgroundColor: 'rgba(229, 62, 62, 0.1)',
                color: '#E53E3E',
                borderColor: 'rgba(229, 62, 62, 0.2)',
              }}
            >
              Gagal mengirim pesan. Silakan coba kembali beberapa saat lagi.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactName" className="form-label">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="contactName"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Masukkan nama Anda"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail" className="form-label">
                  Email Aktif *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactSubject" className="form-label">
                Subjek Pesan
              </label>
              <input
                type="text"
                id="contactSubject"
                className="form-control"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Pemesanan Acara, Kemitraan, dll."
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactMessage" className="form-label">
                Isi Pesan *
              </label>
              <textarea
                id="contactMessage"
                rows={5}
                className="form-control"
                style={{ resize: 'vertical' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Tuliskan pesan Anda secara detail..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn btn-primary"
            >
              {status === 'submitting' ? 'Mengirim...' : 'Kirim Pesan Sekarang'}
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
