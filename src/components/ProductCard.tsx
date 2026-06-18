'use client';

import { useCartStore } from '@/lib/cartStore';

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="product-card animate-fade-in">
      {product.badge && <div className="product-badge">{product.badge}</div>}
      <div className="product-img-container">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-footer">
          <span className="product-price">Rp {product.price.toLocaleString('id-ID')}</span>
          <button
            className="product-btn"
            onClick={handleAddToCart}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
