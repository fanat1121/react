import React from 'react';
import Image from 'next/image';
import styles from './NekoImage.module.scss';
import type { NekoImageData } from '../../schemas/schema';

const TITLE = '本日の一枚';
const ALT_FALLBACK = 'アニメのイラスト';
const ARTIST_FALLBACK = '作者不明';
const SOURCE_LINK_TEXT = '出典';
const CREDIT_TEXT = 'Nekos API';
const CREDIT_URL = 'https://nekosapi.com';
const IMAGE_SIZE_PX = 240;

type NekoImageProps = {
  image: NekoImageData;
};

export const NekoImage: React.FC<NekoImageProps> = ({ image }) => {
  const alt = image.tags.length ? image.tags.map((tag) => tag.name).join('、') : ALT_FALLBACK;

  return (
    <figure className={styles.nekoImage}>
      <h4 className={styles.title}>{TITLE}</h4>
      <Image
        className={styles.image}
        src={image.url}
        alt={alt}
        width={IMAGE_SIZE_PX}
        height={IMAGE_SIZE_PX}
        // Vercel の画像最適化の枠を使わないよう、CDN の画像をそのまま表示する
        unoptimized
      />
      <figcaption className={styles.caption}>
        <span>{image.artist_name || ARTIST_FALLBACK}</span>
        {image.source_url && (
          <a href={image.source_url} target="_blank" rel="noopener noreferrer">
            {SOURCE_LINK_TEXT}
          </a>
        )}
        <a href={CREDIT_URL} target="_blank" rel="noopener noreferrer">
          {CREDIT_TEXT}
        </a>
      </figcaption>
    </figure>
  );
};
