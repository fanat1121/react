// Nekos API v5（https://api.nekosapi.com/v5/docs）。認証不要・無料。
export const NEKOS_API_BASE_URL = 'https://api.nekosapi.com/v5';
export const NEKOS_RANDOM_IMAGE_PATH = '/images/random';

// API が受け付ける年齢区分（OpenAPI の Rating enum と同じ並び）
export const NEKOS_RATINGS = ['safe', 'suggestive', 'borderline', 'explicit'] as const;
export type NekosRating = (typeof NEKOS_RATINGS)[number];

// TOP に出してよい年齢区分。ここに足せば表示対象が広がる（例: ['safe', 'suggestive']）。
// 区分は API 側で AI が付けたもので正確とは限らないため、TOP は safe だけにしている。
export const DISPLAY_RATINGS: readonly NekosRating[] = ['safe'];

// 取得のタイムアウト。TOP は Suspense で待たずに描画するので、遅くても画像が後から出るだけ
export const REQUEST_TIMEOUT_MS = 5000;

// 画像の一辺。img の width/height と、CSS のカード幅（--neko-image-size）の両方に使う
export const NEKO_IMAGE_SIZE_PX = 240;
