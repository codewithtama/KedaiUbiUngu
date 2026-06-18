'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';

export default function CartDrawer() {
  const { cart, isOpen, toggleDrawer, updateQty, removeItem } = useCartStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => toggleDrawer(false)}
      ></div>
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3 style={{ fontSize: '1.25rem' }}>Keranjang Belanja</h3>
          <button
            className="cart-close-btn"
            onClick={() => toggleDrawer(false)}
            aria-label="Tutup Keranjang"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="cart-empty-message">
              <svg
                style={{
                  margin: '0 auto 1rem',
                  color: 'var(--color-primary)',
                  width: '48px',
                  height: '48px',
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              <p>Keranjang belanja masih kosong.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-price">Rp {item.price.toLocaleString('id-ID')}</p>
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeItem(item.id)}>
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Total:</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <Link
              href="/delivery"
              onClick={() => toggleDrawer(false)}
              className="btn btn-primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              Lanjut Pembayaran
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
