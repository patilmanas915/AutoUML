import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY)
    
    return NextResponse.json({
      status: 'ok',
      hasApiKey,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        hasApiKey: false,
        error: error.message 
      },
      { status: 500 }
    )
  }
}
