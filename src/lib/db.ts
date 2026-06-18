import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const dbPath = path.join(process.cwd(), 'kedaiubiungu.db');

export interface ProductRecord {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  badge?: string | null;
}

export const DEFAULT_PRODUCTS: ProductRecord[] = [
  {
    id: 'p1',
    name: 'Purple Sweet Potato Roll Cake',
    desc: 'Bolu gulung ubi ungu super lembut dengan isian krim vanila premium.',
    price: 45000,
    image: '/images/product_roll_cake.png',
    category: 'cake',
    badge: 'Terlaris'
  },
  {
    id: 'p2',
    name: 'Gourmet Purple Brownies',
    desc: 'Brownies panggang dengan tekstur fudgy dan rasa ubi ungu manis alami yang khas.',
    price: 38000,
    image: '/images/product_brownies.png',
    category: 'brownies',
    badge: 'Premium'
  },
  {
    id: 'p3',
    name: 'Crispy Ubi Ungu Chips',
    desc: 'Keripik ubi ungu renyah bebas pengawet, cemilan sehat kaya serat untuk menemani hari Anda.',
    price: 18000,
    image: '/images/product_chips.png',
    category: 'snack',
    badge: 'Sehat'
  },
  {
    id: 'p4',
    name: 'Purple Taro Premium Latte',
    desc: 'Minuman latte creamy perpaduan taro alami dan ekstrak ubi ungu segar.',
    price: 22000,
    image: '/images/product_roll_cake.png',
    category: 'beverage',
    badge: 'Segar'
  }
];

let db: DatabaseSync | null = null;

function ensureDb() {
  if (!db) {
    db = new DatabaseSync(dbPath);
    initDB();
  }
  return db;
}

export function getDb() {
  return ensureDb();
}

export function getFeaturedProducts(limit = 3): ProductRecord[] {
  try {
    const rows = getDb().prepare(`SELECT * FROM products LIMIT ${limit}`).all() as ProductRecord[];
    return rows.length ? rows.map((row) => ({ ...row })) : DEFAULT_PRODUCTS.slice(0, limit);
  } catch (error) {
    console.warn('Falling back to default products:', error);
    return DEFAULT_PRODUCTS.slice(0, limit);
  }
}

function initDB() {
  if (!db) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      desc TEXT NOT NULL,
      price INTEGER NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      badge TEXT
    )
  `);

  // Create orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      items TEXT NOT NULL, -- JSON Stringified array
      subtotal INTEGER NOT NULL,
      delivery_fee INTEGER NOT NULL,
      total INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    )
  `);

  // Create contact_submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // Pre-populate products if empty
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM products');
  const result = countStmt.get() as { count: number };

  if (result.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO products (id, name, desc, price, image, category, badge)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const prod of DEFAULT_PRODUCTS) {
      insertStmt.run(prod.id, prod.name, prod.desc, prod.price, prod.image, prod.category, prod.badge ?? null);
    }
  }
}

export default function dbInstance() {
  return getDb();
}
