import { NextResponse } from "next/server"
import { cleanExpiredSessions } from "@/lib/student-auth"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const expected = `Bearer ${process.env.CRON_SECRET}`

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await cleanExpiredSessions()
    return NextResponse.json({ ok: true, cleanedAt: new Date().toISOString() })
  } catch (err) {
    console.error("[cron/clean-sessions] Error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
