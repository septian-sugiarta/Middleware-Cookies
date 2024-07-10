import {SignJWT, jwtVerify} from 'jose';
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any){
  return await new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('10 sec from now')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const {payload} = await jwtVerify(input, key, {algorithms: ['HS256'],});
  return payload;
}

export async function login (formData : FormData){
  const user = {email : formData.get('email'), name: 'Lee'};

  // Buat Session
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt ({user, expires});

  cookies().set('session', session, {expires, httpOnly: true}); 
}

export async function logout() {
  // Destroy Session
  cookies().set('session', '', {expires: new Date(0)});
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest){
  const session = request.cookies.get('session')?.value;
  if (!session) return;

}