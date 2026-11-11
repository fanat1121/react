import { NEKOS_API_BASE_URL, NEKOS_RANDOM_IMAGE_PATH, type NekosRating } from '../const/nekosApi';

/**
 * ランダム画像取得の URL を組み立てる。
 * rating は配列パラメータなので、値ごとに `rating=...` を繰り返す（FastAPI の配列クエリの形式）。
 */
export const buildRandomImageUrl = (ratings: readonly NekosRating[]): string => {
  const params = new URLSearchParams();
  [...new Set(ratings)].forEach((rating) => params.append('rating', rating));
  const query = params.toString();
  return `${NEKOS_API_BASE_URL}${NEKOS_RANDOM_IMAGE_PATH}${query ? `?${query}` : ''}`;
};
