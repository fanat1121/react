import { NextRequest, NextResponse } from 'next/server';
import { getJevClient } from '@/_pages/jevDemo/api/jevClient';
import { toJevErrorResponse } from '@/_pages/jevDemo/api/jevErrorResponse';
import { requireJevDemoSession } from '@/_pages/jevDemo/api/requireJevDemoSession';
import { shapeRequestSchema } from '@/_pages/jevDemo/schemas/schema';
import { buildShapeRequest, toShapeJudgeResponse } from '@/_pages/jevDemo/utils/buildShapeRequest';

export async function POST(request: NextRequest) {
  const unauthorized = await requireJevDemoSession();
  if (unauthorized) return unauthorized;

  const parsed = shapeRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: '描いた画像の形式が正しくありません' } },
      { status: 400 }
    );
  }

  try {
    const result = await getJevClient().systemOne(buildShapeRequest(parsed.data.drawing));
    return NextResponse.json({ success: true, data: toShapeJudgeResponse(result.answers.shape, result.raw) });
  } catch (error) {
    return toJevErrorResponse(error, 'shape');
  }
}
