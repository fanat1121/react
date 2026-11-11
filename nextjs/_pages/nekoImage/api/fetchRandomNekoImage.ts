import { DISPLAY_RATINGS, type NekosRating } from '../const/nekosApi';
import { nekoImageSchema, type NekoImageData } from '../schemas/schema';
import { buildRandomImageUrl } from '../utils/buildRandomImageUrl';
import { isDisplayableImage } from '../utils/isDisplayableImage';

const REQUEST_TIMEOUT_MS = 5000;

/**
 * 表示してよい年齢区分のランダム画像を1枚取得する。
 * 取得失敗・形式不正・区分が表示対象外のときは null（TOP の表示を止めないため例外は投げない）。
 */
export const fetchRandomNekoImage = async (
  ratings: readonly NekosRating[] = DISPLAY_RATINGS
): Promise<NekoImageData | null> => {
  try {
    const response = await fetch(buildRandomImageUrl(ratings), {
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`[nekoImage] HTTP ${response.status}`);
      return null;
    }
    const parsed = nekoImageSchema.safeParse(await response.json());
    if (!parsed.success) {
      console.error('[nekoImage] unexpected response shape', parsed.error.issues);
      return null;
    }
    if (!isDisplayableImage(parsed.data, ratings)) {
      console.error(`[nekoImage] rating ${parsed.data.rating} is not allowed`);
      return null;
    }
    return parsed.data;
  } catch (error) {
    console.error('[nekoImage] fetch failed', error);
    return null;
  }
};
