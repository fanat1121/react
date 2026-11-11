import { NextResponse } from 'next/server';
import { APIConnectionError, APIError } from '@typesafe-ai/sdk';
import { JevNotConfiguredError } from './jevClient';

/**
 * Jev 呼び出しの失敗を API Route のレスポンスにする
 * 詳細はサーバーログにだけ出し、ブラウザには状態コードまでに留める
 */
export function toJevErrorResponse(error: unknown, logLabel: string): NextResponse {
  console.error(`[jev-demo] ${logLabel} failed`, error);

  if (error instanceof JevNotConfiguredError) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_CONFIGURED', message: error.message } },
      { status: 503 }
    );
  }
  if (error instanceof APIError) {
    return NextResponse.json(
      { success: false, error: { code: 'JEV_API_ERROR', message: `Jev API がエラーを返しました（HTTP ${error.status}）` } },
      { status: 502 }
    );
  }
  if (error instanceof APIConnectionError) {
    return NextResponse.json(
      { success: false, error: { code: 'JEV_UNREACHABLE', message: 'Jev API に接続できませんでした' } },
      { status: 504 }
    );
  }
  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: '判定に失敗しました' } },
    { status: 500 }
  );
}
