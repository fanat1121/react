import { NextRequest, NextResponse } from 'next/server';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

const FORWARDED_PARAMS = ['name', 'equipment_id', 'category_id', 'state_id'] as const;

export async function GET(request: NextRequest) {
  const params = new URLSearchParams();
  for (const key of FORWARDED_PARAMS) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  const url = query ? `${GO_API_URL}/api/tricks?${query}` : `${GO_API_URL}/api/tricks`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const json = await response.json();
    return NextResponse.json(json, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: '技一覧の取得に失敗しました' } },
      { status: 500 }
    );
  }
}
