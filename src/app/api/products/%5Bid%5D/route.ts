import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, desc, price, image, category, badge } = body;

    if (!name || !desc || !price || !image || !category) {
      return NextResponse.json(
        { error: { message: 'Kolom name, desc, price, image, dan category wajib diisi' } },
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      UPDATE products
      SET name = ?, desc = ?, price = ?, image = ?, category = ?, badge = ?
      WHERE id = ?
    `);
    
    const info = stmt.run(name, desc, Number(price), image, category, badge || null, id) as { changes: number };

    if (info.changes === 0) {
      return NextResponse.json(
        { error: { message: 'Produk tidak ditemukan' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    const message = error instanceof Error ? error.message : 'Gagal mengubah produk';
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const info = stmt.run(id) as { changes: number };

    if (info.changes === 0) {
      return NextResponse.json(
        { error: { message: 'Produk tidak ditemukan' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    const message = error instanceof Error ? error.message : 'Gagal menghapus produk';
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}
