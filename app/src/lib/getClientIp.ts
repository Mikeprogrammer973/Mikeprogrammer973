"use server"

import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export async function getClientIp(request?: NextRequest | Request): Promise<string> {
  let headersList: Headers;
  
  if (request) {
    headersList = request.headers;
  } else {
    headersList = await headers();
  }

  const ip = headersList.get('x-real-ip') ||
             headersList.get('x-forwarded-for')?.split(',')[0] ||
             headersList.get('cf-connecting-ip') ||
             headersList.get('x-vercel-forwarded-for')?.split(',')[0] ||
             'unknown';

  return ip;
}

export async function getClientIpServer(): Promise<string> {
  const headersList = await headers();
  return getClientIp({ headers: headersList } as Request);
}