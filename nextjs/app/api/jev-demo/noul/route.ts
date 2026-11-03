import { NextRequest, NextResponse } from 'next/server';
import { getJevClient } from '@/_pages/jevDemo/api/jevClient';
import { toJevErrorResponse } from '@/_pages/jevDemo/api/jevErrorResponse';
import { STATEMENT_MAX_LENGTH } from '@/_pages/jevDemo/const/noul';
import { noulRequestSchema } from '@/_pages/jevDemo/schemas/schema';
import { buildNoulRequest, toNoulJudgeResponse } from '@/_pages/jevDemo/utils/buildNoulRequest';

export async function POST(request: NextRequest) {
  const parsed = noulRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: `描いた画像の形式か、文（1〜${STATEMENT_MAX_LENGTH}文字）が正しくありません`,
        },
      },
      { status: 400 }
    );
  }

  const { drawing, statement } = parsed.data;
  try {
    const result = await getJevClient().systemOne(buildNoulRequest(drawing, statement));
    return NextResponse.json({
      success: true,
      data: toNoulJudgeResponse(statement, result.answers.statement, result.raw),
    });
  } catch (error) {
    return toJevErrorResponse(error, 'noul');
  }
}
