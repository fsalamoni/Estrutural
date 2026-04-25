import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = '__session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

// Firebase UIDs são 28 caracteres alfanuméricos
const FIREBASE_UID_RE = /^[a-zA-Z0-9]{20,128}$/;

// POST /api/auth/session — define o cookie de sessão com HttpOnly
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { uid } = body;

  if (!uid || typeof uid !== 'string' || !FIREBASE_UID_RE.test(uid)) {
    return NextResponse.json({ error: 'UID inválido' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, uid, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}

// DELETE /api/auth/session — remove o cookie de sessão
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
