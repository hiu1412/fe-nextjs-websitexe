import { jwtVerify } from 'jose';

export async function verifyJWT(token: string) {
  try {
    if (!token) return null;
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
} 