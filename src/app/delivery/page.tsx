'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';

export default function DeliveryPage() {
  const { cart, clearCart } = useCartStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = 15000;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Keranjang Anda kosong! Silakan pilih produk terlebih dahulu.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Post to our API to save to the database
      const orderPayload = {
        name,
        phone,
        address,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        notes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('Gagal menyimpan pesanan ke database');
      }

      // 2. Format WhatsApp message
      const WHATSAPP_NUMBER = '628123456789';
      let itemsMessage = '';
      cart.forEach((item, idx) => {
        const cost = item.price * item.qty;
        itemsMessage += `${idx + 1}. ${item.name} (x${item.qty}) - Rp ${cost.toLocaleString('id-ID')}\n`;
      });

      const waMessage = `*Pemesanan Baru - PurpleBite*\n\n` +
                        `*Data Pelanggan:*\n` +
                        `Nama: ${name}\n` +
                        `Telepon: ${phone}\n` +
                        `Alamat Pengiriman:\n${address}\n\n` +
                        `*Rincian Pesanan:*\n` +
                        `${itemsMessage}\n` +
                        `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n` +
                        `Ongkos Kirim: Rp ${deliveryFee.toLocaleString('id-ID')}\n` +
                        `*Total Bayar: Rp ${total.toLocaleString('id-ID')}*\n\n` +
                        `*Metode Pembayaran:* ${paymentMethod}\n` +
                        `*Catatan:* ${notes || 'Tidak ada'}\n\n` +
                        `Terima kasih! Mohon segera konfirmasi pesanan saya.`;

      const encodedMessage = encodeURIComponent(waMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

      // 3. Clear cart in store
      clearCart();

      // 4. Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (err: any) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses pesanan Anda. Silakan coba kembali.');
    } finally {
      setSubmitting(false);
    }
  };

  const paymentOptions = [
    { key: 'COD', label: 'COD (Bayar di Tempat)', icon: '💵' },
    { key: 'TRANSFER', label: 'Transfer Bank', icon: '🏦' },
    { key: 'EWALLET', label: 'E-Wallet (OVO/Gopay)', icon: '📱' },
  ];

  return (
    <main className="container section">
      <div className="section-header" style={{ marginBottom: '3.5rem' }}>
        <h1 className="section-title">Informasi Pengiriman</h1>
        <p className="section-subtitle">
          Selesaikan pesanan Anda dan nikmati kelezatan ubi ungu premium langsung di depan pintu rumah Anda.
        </p>
      </div>

      <div className="checkout-grid">
        {/* Checkout Form */}
        <div className="checkout-card">
          <div className="delivery-info-badge">
            <div className="delivery-info-title">⚡ Estimasi Pengiriman Cepat</div>
            <p style={{ fontSize: '0.9rem', marginBottom: 0, color: 'var(--color-text)' }}>
              Pesanan Anda akan tiba dalam waktu <strong>30–60 menit</strong> untuk area Bandung. Dipacking secara higienis menggunakan kantong ramah lingkungan.
            </p>
          </div>

          <h2 className="checkout-subtitle">Detail Pengiriman</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="checkoutName" className="form-label">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="checkoutName"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Masukkan nama penerima"
              />
            </div>

            <div className="form-group">
              <label htmlFor="checkoutPhone" className="form-label">
                Nomor Telepon / WhatsApp *
              </label>
              <input
                type="tel"
                id="checkoutPhone"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Contoh: 08123456789"
              />
            </div>

            <div className="form-group">
              <label htmlFor="checkoutAddress" className="form-label">
                Alamat Lengkap Pengiriman *
              </label>
              <textarea
                id="checkoutAddress"
                rows={3}
                className="form-control"
                style={{ resize: 'vertical' }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="checkoutNotes" className="form-label">
                Catatan Pengiriman (Opsional)
              </label>
              <input
                type="text"
                id="checkoutNotes"
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Titipkan di satpam, pagar warna putih"
              />
            </div>

            <h2 className="checkout-subtitle" style={{ marginTop: '2.5rem' }}>
              Metode Pembayaran
            </h2>
            <div className="payment-options">
              {paymentOptions.map((opt) => (
                <label
                  key={opt.key}
                  className={`payment-radio-label ${paymentMethod === opt.key ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={opt.key}
                    checked={paymentMethod === opt.key}
                    onChange={() => setPaymentMethod(opt.key)}
                  />
                  <span className="payment-icon">{opt.icon}</span>
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '2.5rem' }}
            >
              {submitting ? 'Memproses Pesanan...' : 'Kirim Pesanan ke WhatsApp'}
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </form>
        </div>

        {/* Order Summary Card */}
        <div className="checkout-card" style={{ position: 'sticky', top: '120px' }}>
          <h2 className="checkout-subtitle">Ringkasan Pesanan</h2>
          <div className="checkout-summary-list">
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text)', padding: '1.5rem 0' }}>
                Keranjang belanja Anda kosong.
              </p>
            ) : (
              cart.map((item) => (
                <div className="checkout-summary-item" key={item.id}>
                  <span>
                    {item.name} <strong>x{item.qty}</strong>
                  </span>
                  <span>Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                </div>
              ))
            )}
          </div>
          <div className="checkout-summary-list">
            <div className="checkout-summary-item">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="checkout-summary-item">
              <span>Ongkos Kirim</span>
              <span>Rp {subtotal > 0 ? deliveryFee.toLocaleString('id-ID') : 'Rp 0'}</span>
            </div>
            <div className="checkout-summary-item total">
              <span>Total Bayar</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
