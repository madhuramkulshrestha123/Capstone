import { NextResponse } from 'next/server';

export async function GET() {
  // Return an empty configuration or a minimal valid configuration
  return NextResponse.json({
    "version": "1.0",
    "devtools": {}
  });
}