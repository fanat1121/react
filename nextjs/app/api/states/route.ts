import { NextRequest, NextResponse } from 'next/server';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

export async function GET(request: NextRequest) {
  const equipmentId = request.nextUrl.searchParams.get('equipment_id');
  const url = equipmentId
    ? `${GO_API_URL}/api/states?equipment_id=${encodeURIComponent(equipmentId)}`
    : `${GO_API_URL}/api/states`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const json = await response.json();
    return NextResponse.json(json, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: '状態一覧の取得に失敗しました' } },
      { status: 500 }
    );
  }
}
