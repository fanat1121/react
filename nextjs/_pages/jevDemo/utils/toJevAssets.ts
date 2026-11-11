import { Image } from '@typesafe-ai/sdk';

const IMAGE_DATA_URL_PATTERN = /^data:image\/(jpeg|png);base64,(.+)$/;

/**
 * state 内の画像 data URL を SDK の Image に置き換える
 * Image.fromBase64 は data: 接頭辞なしの base64 だけを受け付けるため、接頭辞を外して渡す
 */
export function toJevAssets(value: unknown): unknown {
  if (typeof value === 'string') {
    const match = IMAGE_DATA_URL_PATTERN.exec(value);
    return match ? Image.fromBase64(match[2]) : value;
  }
  if (Array.isArray(value)) {
    return value.map(toJevAssets);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toJevAssets(item)]));
  }
  return value;
}
