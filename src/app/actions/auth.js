'use server';

import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'purelume-secret-key-change-in-production-32-chars'
);

export async function loginAction(formData) {
  const usernameInput = formData.get('username')?.toString().trim();
  const passwordInput = formData.get('password')?.toString().trim();

  if (!usernameInput || !passwordInput) {
    return { error: 'Username and password are required.' };
  }

  try {
    const client = await clientPromise;
    const db = client.db('purelume');
    const adminCollection = db.collection('admins');

    const admin = await adminCollection.findOne({
      username: { $regex: new RegExp(`^${usernameInput}$`, 'i') }
    });

    if (!admin) {
      return { error: 'Invalid credentials.' };
    }

    const isPasswordValid = await bcrypt.compare(passwordInput, admin.password);

    if (!isPasswordValid) {
      return { error: 'Invalid credentials.' };
    }

    const token = await new SignJWT({ 
      id: admin._id.toString(), 
      username: admin.username, 
      role: 'admin' 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    });

  } catch (error) {
    console.error('Login Server Error:', error);
    return { error: 'An unexpected server error occurred. Please try again.' };
  }

  redirect('/admin/dashboard');
}

// Ensure this function is exported!
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}