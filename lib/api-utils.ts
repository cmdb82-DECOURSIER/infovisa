import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

/** Standard success response */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

/** Standard error response */
export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

/** Handle caught errors uniformly */
export function handleError(error: unknown) {
  console.error('[API Error]', error)
  if (error instanceof ZodError) {
    return err(error.errors.map((e) => e.message).join(', '), 400)
  }
  if (error instanceof Error) {
    return err(error.message, 500)
  }
  return err('Internal server error', 500)
}

/** CORS headers for public API */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
