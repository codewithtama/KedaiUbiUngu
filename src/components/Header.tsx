'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';

export default function Header() {
  const pathname = usePathname();
  const cart = useCartStore((state) => state.cart);
  const toggleDrawer = useCartStore((state) => state.toggleDrawer);
  
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Delivery', href: '/delivery' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header>
      <div className="container navbar">
        <Link href="/" className="brand">
          Kedai <span>Ubi Ungu</span>
        </Link>
        <nav aria-label="Main Navigation">
          <ul className="nav-menu">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => toggleDrawer(true)}
                className="cart-icon-btn"
                aria-label="Buka Keranjang Belanja"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
                {totalQty > 0 && (
                  <span className="cart-badge">{totalQty}</span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
