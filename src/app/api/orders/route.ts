import { NextResponse } from 'next/server';
import db from '@/lib/db';

interface DBOrder {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  notes: string | null;
  created_at: string;
}

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY id DESC');
    const orders = stmt.all() as DBOrder[];
    
    // Parse JSON strings in items
    const parsedOrders = orders.map((order) => {
      let parsedItems = [];
      try {
        parsedItems = JSON.parse(order.items);
      } catch {
        parsedItems = [];
      }
      return {
        ...order,
        items: parsedItems
      };
    });

    return NextResponse.json(parsedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    const message = error instanceof Error ? error.message : 'Gagal mengambil data pesanan';
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, items, subtotal, deliveryFee, total, paymentMethod, notes } = body;

    if (!name || !phone || !address || !items || items.length === 0 || !subtotal || !total || !paymentMethod) {
      return NextResponse.json(
        { error: { message: 'Data formulir pemesanan tidak lengkap' } },
        { status: 400 }
      );
    }

    const createdAt = new Date().toISOString();
    const itemsJson = JSON.stringify(items);

    const stmt = db.prepare(`
      INSERT INTO orders (customer_name, customer_phone, customer_address, items, subtotal, delivery_fee, total, payment_method, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      name,
      phone,
      address,
      itemsJson,
      Number(subtotal),
      Number(deliveryFee),
      Number(total),
      paymentMethod,
      notes || null,
      createdAt
    ) as { lastInsertRowid: number };

    return NextResponse.json({ success: true, orderId: info.lastInsertRowid });
  } catch (error) {
    console.error('Error creating order:', error);
    const message = error instanceof Error ? error.message : 'Gagal menyimpan pesanan baru';
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}
