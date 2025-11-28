import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { password } = body

    const adminPassword = process.env.ADMIN_PASSWORD
    const sessionSecret = process.env.ADMIN_SESSION_SECRET

    if (!adminPassword || !sessionSecret) {
      console.error('Admin credentials not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function DELETE(): Promise<NextResponse> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return NextResponse.json({ success: true })
}

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  const isAuthenticated = session?.value === process.env.ADMIN_SESSION_SECRET
  
  return NextResponse.json({ authenticated: isAuthenticated })
}

