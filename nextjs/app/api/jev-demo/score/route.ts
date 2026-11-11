import { NextRequest, NextResponse } from 'next/server';
import { getJevClient } from '@/_pages/jevDemo/api/jevClient';
import { toJevErrorResponse } from '@/_pages/jevDemo/api/jevErrorResponse';
import { requireJevDemoSession } from '@/_pages/jevDemo/api/requireJevDemoSession';
import { scoreRequestSchema } from '@/_pages/jevDemo/schemas/schema';
import { buildScoreRequest, toScoreJudgeResponse } from '@/_pages/jevDemo/utils/buildScoreRequest';

export async function POST(request: NextRequest) {
  const unauthorized = await requireJevDemoSession();
  if (unauthorized) return unauthorized;

  const parsed = scoreRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: '描いた画像の形式が正しくありません' } },
      { status: 400 }
    );
  }

  try {
    const result = await getJevClient().systemOne(buildScoreRequest(parsed.data.drawing));
    return NextResponse.json({ success: true, data: toScoreJudgeResponse(result.answers.roundness, result.raw) });
  } catch (error) {
    return toJevErrorResponse(error, 'score');
  }
}
