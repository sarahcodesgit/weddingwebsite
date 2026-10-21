// @ts-nocheck -- Supabase Edge Functions are type-checked by the Deno runtime, not this Vite workspace.
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' }

function configuredOrigins() {
  return (Deno.env.get('ALLOWED_ORIGINS') || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export function isAllowedOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return Boolean(origin && configuredOrigins().includes(origin))
}

function headersFor(request: Request) {
  const origin = request.headers.get('origin')
  const allowed = origin && configuredOrigins().includes(origin)
  return {
    ...JSON_HEADERS,
    ...(allowed ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

export function optionsResponse(request: Request) {
  return new Response(null, { status: 204, headers: headersFor(request) })
}

export function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headersFor(request) })
}

export function originDenied(request: Request) {
  return json(request, { error: 'This request origin is not allowed.' }, 403)
}
