import { TypeSafeClient } from '@typesafe-ai/sdk';
import type { Questions, SystemOneRequest } from '@typesafe-ai/sdk';
import { toJevAssets } from '../utils/toJevAssets';
import type { JevQuestion, JevRequest, JevResponse } from '../types';

// -----------------------------------
// Jev 呼び出し (サーバー専用)
// APIキーはブラウザに渡さず、この中でだけ扱う
// -----------------------------------

export type JevClient = {
  systemOne: <Q extends Record<string, JevQuestion>>(request: JevRequest<Q>) => Promise<JevResponse<Q>>;
};

export class JevNotConfiguredError extends Error {}

/** 画像を含むリクエストに必須のヘッダ (https://docs.typesafe.ai/images) */
const IMAGES_HEADER = { 'TypeSafe-Danger-Zone-Images': 'true' };

/** 画像10枚を送るので SDK 既定の 10 秒より長めに取る (1試行あたり) */
const TIMEOUT_MS = 30000;

let cachedClient: JevClient | null = null;

function createJevClient(apiKey: string): JevClient {
  const client = new TypeSafeClient({ apiKey, timeout: TIMEOUT_MS });
  return {
    async systemOne(request) {
      const result = await client.systemOne(
        {
          model: request.model,
          state: toJevAssets(request.state) as SystemOneRequest['state'],
          questions: request.questions as Questions,
        },
        { headers: IMAGES_HEADER }
      );
      return { model: result.model, answers: result.answers, raw: result } as unknown as JevResponse<typeof request.questions>;
    },
  };
}

export function getJevClient(): JevClient {
  const apiKey = process.env.JEV_API_KEY;
  if (!apiKey) throw new JevNotConfiguredError('JEV_API_KEY が設定されていません');

  cachedClient ??= createJevClient(apiKey);
  return cachedClient;
}
