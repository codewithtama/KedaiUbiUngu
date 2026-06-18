import Link from 'next/link';
import Image from 'next/image';
import db from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0; // Disable server caching to ensure live edits to products are seen instantly!

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export default function Home() {
  // Directly query the database on the server
  let featuredProducts: Product[] = [];
  try {
    const stmt = db.prepare('SELECT * FROM products LIMIT 3');
    // Spread into plain objects — DatabaseSync rows have a non-plain prototype
    // which Next.js cannot serialize when passing to Client Components.
    featuredProducts = (stmt.all() as Product[]).map((r) => ({ ...r }));
  } catch (error) {
    console.error('Error loading featured products:', error);
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1 className="hero-headline">
              Lezat dan Sehat dari <span>Ubi Ungu</span>
            </h1>
            <p className="hero-text">
              Rasakan kelezatan premium dari olahan ubi ungu pilihan. Diproses secara higienis, bebas bahan pengawet, dan menghadirkan cita rasa manis alami yang memanjakan lidah.
            </p>
            <Link href="/products" className="btn btn-primary">
              Pesan Sekarang
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          <div className="hero-image-wrapper">
            <Image src="/images/hero.png" alt="Sajian hidangan ubi ungu premium dari PurpleBite" width={600} height={500} priority />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Produk Unggulan Kami</h2>
            <p className="section-subtitle">
              Pilihan kreasi terbaik dari dapur PurpleBite yang menjadi favorit semua orang.
            </p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link href="/products" className="btn btn-secondary">
              Lihat Semua Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Mengapa Memilih Kami?</h2>
            <p className="section-subtitle">
              Setiap gigitan PurpleBite dibuat dengan cinta dan dedikasi untuk kepuasan Anda.
            </p>
          </div>
          <div className="benefits-grid">
            {/* Benefit 1 */}
            <div className="benefit-card">
              <div className="benefit-icon" aria-hidden="true">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
              </div>
              <h3 className="benefit-title">100% Bahan Alami</h3>
              <p className="benefit-desc">
                Menggunakan ubi ungu segar pilihan langsung dari petani lokal tanpa pewarna buatan.
              </p>
            </div>
            {/* Benefit 2 */}
            <div className="benefit-card">
              <div className="benefit-icon" aria-hidden="true">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                </svg>
              </div>
              <h3 className="benefit-title">Kemasan Higienis</h3>
              <p className="benefit-desc">
                Kemasan modern dengan standar sanitasi ketat untuk menjaga kesegaran rasa hingga di tangan Anda.
              </p>
            </div>
            {/* Benefit 3 */}
            <div className="benefit-card">
              <div className="benefit-icon" aria-hidden="true">
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="benefit-title">Pengiriman Cepat</h3>
              <p className="benefit-desc">
                Layanan pesan antar khusus dengan estimasi sampai dalam 30–60 menit untuk area jangkauan kami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Apa Kata Mereka?</h2>
            <p className="section-subtitle">
              Umpan balik jujur dari para pecinta hidangan ubi ungu kami.
            </p>
          </div>
          <div className="testimonials-slider">
            <div className="testimonial-item">
              <div className="testimonial-stars" aria-label="Bintang 5 dari 5">
                ★ ★ ★ ★ ★
              </div>
              <p className="testimonial-text">
                Roll cake ubi ungunya juara banget! Teksturnya lembut parah dan manisnya pas banget, gak bikin enek. Anak-anak di rumah suka sekali. Pasti bakal order lagi buat acara arisan nanti.
              </p>
              <div className="testimonial-author">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="testimonial-avatar"
                  src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23E9D8FD'/><text x='50' y='60' font-family='sans-serif' font-size='35' font-weight='bold' fill='%23805AD5' text-anchor='middle'>S</text></svg>"
                  alt="Avatar Sarah"
                />
                <div style={{ textAlign: 'left' }}>
                  <div className="testimonial-name">Sarah Kurnia</div>
                  <div className="testimonial-role">Ibu Rumah Tangga</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
