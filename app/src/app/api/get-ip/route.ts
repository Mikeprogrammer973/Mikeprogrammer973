
import { getClientIp } from 'mdp/lib/getClientIp'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientIp = await getClientIp(request);
  
  return NextResponse.json({ 
    ip: clientIp 
  });
}