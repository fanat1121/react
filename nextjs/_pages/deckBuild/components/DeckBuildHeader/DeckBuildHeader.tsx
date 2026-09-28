import React from 'react';
import { Button } from '@/components/common/ui/Button';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@/components/common/ui/Button/const/buttonVariants';
import { Input } from '@/components/common/ui/Input';
import { INPUT_TYPES } from '@/components/common/ui/Input/const/inputVariants';
import styles from './DeckBuildHeader.module.scss';

export type DeckBuildHeaderProps = {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onResetAll: () => void;
};

/** UI層。カード検索欄・画面タイトル・全項目リセットボタンを描画する */
export const DeckBuildHeader: React.FC<DeckBuildHeaderProps> = ({ searchQuery, onSearchQueryChange, onResetAll }) => {
  return (
    <>
      <Input
        inputType={INPUT_TYPES.TEXT}
        placeholder="カード名・効果で検索"
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.header}>
        <h2>リージェント デッキビルド</h2>
        <Button variant={BUTTON_VARIANTS.PRIMARY} size={BUTTON_SIZES.SMALL} onClick={onResetAll}>
          全項目リセット
        </Button>
      </div>
    </>
  );
};
