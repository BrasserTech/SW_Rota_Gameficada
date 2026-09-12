import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';
import type { Role } from '@prisma/client';
export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('SESSION_SECRET precisa ter no mínimo 32 caracteres.');
  return new TextEncoder().encode(value);
}
export async function setSession(userId: string) {
  const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject(userId).setIssuedAt().setExpirationTime('7d').sign(secret());
  (await cookies()).set('rota_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 604800 });
}
export async function currentUser() {
  const token = (await cookies()).get('rota_session')?.value;
  if (!token) return null;
  let id: string | undefined;
  try { id = (await jwtVerify(token, secret(), { algorithms: ['HS256'] })).payload.sub; } catch { return null; }
  if (!id) return null;
  return db.user.findFirst({ where: { chave: id, ativo: true }, select: { chave: true, name: true, email: true, role: true, city: true, stars: true, starsExpiresAt: true, datahoracad: true } });
}
export async function requireUser(roles?: Role[]) {
  const user = await currentUser();
  if (!user) throw new ApiError(401, 'Entre na sua conta para continuar.');
  if (roles && !roles.includes(user.role)) throw new ApiError(403, 'Seu perfil não tem permissão para esta ação.');
  return user;
}
