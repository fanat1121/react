import { z } from 'zod';
import { NEKOS_RATINGS } from '../const/nekosApi';

// GET /images/random のレスポンス（ImageReadSchema）のうち、表示に使う項目だけを検証する。
// 外部 API の値をそのまま src / href に入れるので、スキームを限定する
// （z.url() だけだと javascript: や data: も通る）。
export const nekoImageSchema = z.object({
  id: z.string(),
  // 画像は HTTPS のページに埋め込むので https のみ（http だと混在コンテンツになる）
  url: z.url({ protocol: /^https$/ }),
  rating: z.enum(NEKOS_RATINGS),
  artist_name: z.string().nullish(),
  // 「出典」リンクの href になるので http(s) のみ
  source_url: z.url({ protocol: /^https?$/ }).nullish(),
  tags: z.array(z.object({ name: z.string() })),
});

export type NekoImageData = z.infer<typeof nekoImageSchema>;
