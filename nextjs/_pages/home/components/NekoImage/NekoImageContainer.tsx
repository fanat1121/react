import React from 'react';
import { NekoImage } from './NekoImage';
import { fetchRandomNekoImage } from '../../api/fetchRandomNekoImage';

// ----------------------------------
// コンテナコンポーネント (サーバーコンポーネント)
// 取得できなかったときは何も出さない（名言の表示を邪魔しない）
// ----------------------------------
export const NekoImageContainer = async () => {
  const image = await fetchRandomNekoImage();
  return image ? <NekoImage image={image} /> : null;
};
