import type { NekosRating } from '../const/nekosApi';
import type { NekoImageData } from '../schemas/schema';

/**
 * API が返した画像を表示してよいか。
 * クエリで絞っていても、返ってきた rating を表示対象と突き合わせて二重に確認する。
 */
export const isDisplayableImage = (image: NekoImageData, allowedRatings: readonly NekosRating[]): boolean =>
  allowedRatings.includes(image.rating);
