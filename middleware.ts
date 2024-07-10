import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userEmail = request.cookies.get('userEmail')

  // Jika route adalah '/guarded' dan tidak ada userEmail di cookies
  if (request.nextUrl.pathname === '/guarded' && !userEmail) {
    // Redirect ke halaman login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika route adalah '/login' dan ada userEmail di cookies
  if (request.nextUrl.pathname === '/login' && userEmail) {
    // Redirect ke halaman guarded
    return NextResponse.redirect(new URL('/guarded', request.url))
  }

  // Untuk semua route lainnya, lanjutkan seperti biasa
  return NextResponse.next()
}

// Tentukan pada path mana middleware ini akan dijalankan
export const config = {
  matcher: ['/guarded', '/login']
}