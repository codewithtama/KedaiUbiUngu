'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: Array<{ id: string; name: string; price: number; qty: number }>;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  notes: string;
  created_at: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'messages' | 'products'>('orders');
  
  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States (for Add/Edit Product)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('cake');
  const [prodImage, setProdImage] = useState('/images/product_roll_cake.png');
  const [prodBadge, setProdBadge] = useState('');

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, messagesRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/contact'),
        fetch('/api/products'),
      ]);

      const [ordersData, messagesData, productsData] = await Promise.all([
        ordersRes.json(),
        messagesRes.json(),
        productsRes.json(),
      ]);

      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(messagesData)) setMessages(messagesData);
      if (Array.isArray(productsData)) setProducts(productsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Product Actions
  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdCategory('cake');
    setProdImage('/images/product_roll_cake.png');
    setProdBadge('');
    setShowProductForm(true);
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDesc(prod.desc);
    setProdPrice(prod.price.toString());
    setProdCategory(prod.category);
    setProdImage(prod.image);
    setProdBadge(prod.badge || '');
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: prodName,
      desc: prodDesc,
      price: Number(prodPrice),
      image: prodImage,
      category: prodCategory,
      badge: prodBadge || undefined,
    };

    try {
      let url = '/api/products';
      let method = 'POST';

      if (editingProduct) {
        url = `/api/products/${editingProduct.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Gagal menyimpan produk');

      setShowProductForm(false);
      fetchData(); // Reload listings
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan produk. Periksa kembali inputan Anda.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini dari database?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus produk');
      fetchData(); // Reload listings
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus produk.');
    }
  };

  // Stats calculations
  const totalIncome = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="container section">
      <div className="section-header" style={{ marginBottom: '2.5rem', textAlign: 'left', marginLeft: 0 }}>
        <h1 className="section-title">Dashboard Administrator</h1>
        <p className="section-subtitle">Kelola database produk, pantau pesanan masuk, dan respon formulir kontak.</p>
      </div>

      {/* Stats Counter Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>Total Pendapatan</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-dark)', marginTop: '0.25rem' }}>
            Rp {totalIncome.toLocaleString('id-ID')}
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>Pesanan Masuk</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-dark)', marginTop: '0.25rem' }}>
            {orders.length} Transaksi
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--color-cream)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>Pesan Kontak Masuk</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-dark)', marginTop: '0.25rem' }}>
            {messages.length} Pesan
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--color-accent)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            color: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-text)',
            borderBottom: activeTab === 'orders' ? '3px solid var(--color-primary)' : 'none',
            marginTop: '-8px',
          }}
        >
          📥 Pesanan Masuk ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            color: activeTab === 'messages' ? 'var(--color-primary)' : 'var(--color-text)',
            borderBottom: activeTab === 'messages' ? '3px solid var(--color-primary)' : 'none',
            marginTop: '-8px',
          }}
        >
          ✉️ Pesan Kontak ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            color: activeTab === 'products' ? 'var(--color-primary)' : 'var(--color-text)',
            borderBottom: activeTab === 'products' ? '3px solid var(--color-primary)' : 'none',
            marginTop: '-8px',
          }}
        >
          📦 Kelola Produk ({products.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Memuat data dari database...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(183, 148, 244, 0.05)', padding: '1rem' }}>
              {orders.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text)' }}>Belum ada pesanan masuk.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-accent)', color: 'var(--color-dark)' }}>
                      <th style={{ padding: '1rem 0.5rem' }}>ID</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Tanggal</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Pelanggan</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Produk Yang Dipesan</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Pembayaran</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Total Bayar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid var(--color-accent)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>#{order.id}</td>
                        <td style={{ padding: '1rem 0.5rem', color: 'var(--color-text)' }}>
                          {new Date(order.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <strong>{order.customer_name}</strong>
                          <br />
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>{order.customer_phone}</span>
                          <br />
                          <span style={{ fontSize: '0.75rem', color: '#718096' }}>{order.customer_address}</span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.name} <strong>x{item.qty}</strong>
                              </li>
                            ))}
                          </ul>
                          {order.notes && (
                            <div style={{ fontSize: '0.75rem', color: '#E53E3E', marginTop: '0.25rem' }}>
                              * Catatan: {order.notes}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{ backgroundColor: 'var(--color-primary-light)', color: '#805AD5', padding: '0.2rem 0.6rem', borderRadius: 'var(--border-radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                            {order.payment_method}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>
                          Rp {order.total.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: MESSAGES */}
          {activeTab === 'messages' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {messages.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text)' }}>Tidak ada pesan masuk.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(183, 148, 244, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-accent)', paddingBottom: '0.5rem' }}>
                      <div>
                        <h4 style={{ margin: 0 }}>{msg.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>{msg.email}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#718096' }}>
                        {new Date(msg.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {msg.subject && (
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        Subjek: {msg.subject}
                      </div>
                    )}
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button className="btn btn-primary" onClick={handleOpenAddForm}>
                  ➕ Tambah Produk Baru
                </button>
              </div>

              {/* Product Edit / Add Form Modal-Like View */}
              {showProductForm && (
                <div style={{ backgroundColor: 'var(--color-cream)', padding: '2rem', borderRadius: 'var(--border-radius-md)', marginBottom: '2.5rem', border: '1px solid var(--color-primary-light)' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>
                    {editingProduct ? `Edit Produk: ${editingProduct.name}` : 'Tambah Produk Baru'}
                  </h3>
                  <form onSubmit={handleSaveProduct}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Nama Produk *</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Harga (Rupiah) *</label>
                        <input
                          type="number"
                          className="form-control"
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Kategori *</label>
                        <select
                          className="form-control"
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                        >
                          <option value="cake">Bolu & Kue</option>
                          <option value="brownies">Brownies</option>
                          <option value="snack">Cemilan</option>
                          <option value="beverage">Minuman</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Badge (Opsional)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={prodBadge}
                          onChange={(e) => setProdBadge(e.target.value)}
                          placeholder="Contoh: Terlaris, Premium, Sehat"
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">URL / Path Gambar *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">Deskripsi Produk *</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        required
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary">
                        Simpan Produk
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowProductForm(false)}
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(183, 148, 244, 0.05)', padding: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-accent)', color: 'var(--color-dark)' }}>
                      <th style={{ padding: '1rem 0.5rem' }}>Gambar</th>
                      <th style={{ padding: '1rem 0.5rem' }}>ID</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Nama Produk</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Kategori</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Harga</th>
                      <th style={{ padding: '1rem 0.5rem' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid var(--color-accent)' }}>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <img
                            src={prod.image}
                            alt={prod.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }}
                          />
                        </td>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>{prod.id}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <strong>{prod.name}</strong>
                          {prod.badge && (
                            <span style={{ marginLeft: '0.5rem', backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                              {prod.badge}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem 0.5rem', textTransform: 'capitalize' }}>{prod.category}</td>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>
                          Rp {prod.price.toLocaleString('id-ID')}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEditForm(prod)}
                              style={{ backgroundColor: '#EDF2F7', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                            >
                              ✍️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              style={{ backgroundColor: '#FED7D7', color: '#C53030', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                            >
                              🗑️ Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
