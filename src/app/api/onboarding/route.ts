import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.json()
  console.log('Received form data:', formData)
  return NextResponse.json({ success: true, message: 'Form data received' })
}