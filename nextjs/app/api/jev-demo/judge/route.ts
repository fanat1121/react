import { NextRequest, NextResponse } from 'next/server';
import { fetchTrickCandidates } from '@/_pages/jevDemo/api/fetchTrickCandidates';
import { getJevClient } from '@/_pages/jevDemo/api/jevClient';
import { toJevErrorResponse } from '@/_pages/jevDemo/api/jevErrorResponse';
import { judgeVideo } from '@/_pages/jevDemo/api/judgeVideo';
import { judgeRequestSchema } from '@/_pages/jevDemo/schemas/schema';

export async function POST(request: NextRequest) {
  const parsed = judgeRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'フレーム画像の形式が正しくありません' } },
      { status: 400 }
    );
  }

  try {
    const client = getJevClient();
    // 候補はクライアントから受け取らず、サーバー側で技マスタから取り直す
    const { candidates } = await fetchTrickCandidates();
    const data = await judgeVideo(client, parsed.data.frames, candidates);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return toJevErrorResponse(error, 'judge');
  }
}
