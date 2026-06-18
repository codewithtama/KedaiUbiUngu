'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Semua Menu', key: 'all' },
    { name: 'Bolu & Kue', key: 'cake' },
    { name: 'Brownies', key: 'brownies' },
    { name: 'Cemilan', key: 'snack' },
    { name: 'Minuman', key: 'beverage' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="container section">
      <div className="section-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="section-title">Menu Pilihan Kami</h1>
        <p className="section-subtitle">
          Pesan hidangan ubi ungu favorit Anda dengan mudah dan praktis.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ubi gulung, keripik, brownies..."
          />
        </div>
        <div className="filter-categories">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="product-grid">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="product-card"
              style={{ height: '380px', backgroundColor: '#F7F7F7', animation: 'pulse 1.5s infinite ease-in-out' }}
            >
              <div style={{ height: '220px', backgroundColor: '#E2E8F0' }} />
              <div style={{ padding: '1.5rem' }}>
                <div style={{ height: '1.25rem', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '0.5rem', width: '70%' }} />
                <div style={{ height: '1rem', backgroundColor: '#E2E8F0', borderRadius: '4px', marginBottom: '1.5rem', width: '90%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ height: '1.2rem', backgroundColor: '#E2E8F0', borderRadius: '4px', width: '30%' }} />
                  <div style={{ height: '40px', width: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text)' }}>
          <svg style={{ margin: '0 auto 1rem', color: 'var(--color-primary)', width: '48px', height: '48px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3>Produk tidak ditemukan</h3>
          <p>Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
