import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM products');
    const products = stmt.all();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    const message = error instanceof Error ? error.message : 'Gagal mengambil data produk';
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, desc, price, image, category, badge } = body;

    if (!name || !desc || !price || !image || !category) {
      return NextResponse.json(
        { error: { message: 'Kolom name, desc, price, image, dan category wajib diisi' } },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = 'p_' + Math.random().toString(36).substr(2, 9);
    const stmt = db.prepare(`
      INSERT INTO products (id, name, desc, price, image, category, badge)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, name, desc, Number(price), image, category, badge || null);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error adding product:', error);
    const message = error instanceof Error ? error.message : 'Gagal menambahkan produk baru';
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}
