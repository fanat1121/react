import { z } from 'zod';
import { NEKOS_RATINGS } from '../const/nekosApi';

// GET /images/random のレスポンス（ImageReadSchema）のうち、表示に使う項目だけを検証する
export const nekoImageSchema = z.object({
  id: z.string(),
  url: z.url(),
  rating: z.enum(NEKOS_RATINGS),
  artist_name: z.string().nullish(),
  source_url: z.url().nullish(),
  tags: z.array(z.object({ name: z.string() })),
});

export type NekoImageData = z.infer<typeof nekoImageSchema>;
