import { NextRequest, NextResponse } from 'next/server';
import { getJevClient } from '@/_pages/jevDemo/api/jevClient';
import { toJevErrorResponse } from '@/_pages/jevDemo/api/jevErrorResponse';
import { TARGET_MAX_LENGTH } from '@/_pages/jevDemo/const/box';
import { boxRequestSchema } from '@/_pages/jevDemo/schemas/schema';
import { buildBoxRequest, toBoxJudgeResponse } from '@/_pages/jevDemo/utils/buildBoxRequest';

export async function POST(request: NextRequest) {
  const parsed = boxRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: `描いた画像の形式か、探すもの（1〜${TARGET_MAX_LENGTH}文字）が正しくありません`,
        },
      },
      { status: 400 }
    );
  }

  const { drawing, target } = parsed.data;
  try {
    const result = await getJevClient().systemOne(buildBoxRequest(drawing, target));
    return NextResponse.json({ success: true, data: toBoxJudgeResponse(target, result.answers.location, result.raw) });
  } catch (error) {
    return toJevErrorResponse(error, 'box');
  }
}
