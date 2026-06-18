import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM contact_submissions ORDER BY id DESC');
    const messages = stmt.all();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    const message = error instanceof Error ? error.message : 'Gagal mengambil data pesan masuk';
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: { message: 'Kolom name, email, dan message wajib diisi' } },
        { status: 400 }
      );
    }

    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO contact_submissions (name, email, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(name, email, subject || null, message, createdAt);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating contact message:', error);
    const message = error instanceof Error ? error.message : 'Gagal menyimpan pesan masuk';
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}
