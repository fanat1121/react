import React from 'react';
import { CountDisplay } from '@/components/common/ui/CountDisplay';
import { CounterField } from '@/components/common/ui/CounterField';
import { Button } from '@/components/common/ui/Button';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@/components/common/ui/Button/const/buttonVariants';
import { Input } from '@/components/common/ui/Input';
import { INPUT_TYPES } from '@/components/common/ui/Input/const/inputVariants';
import type { UseCounterResult } from '@/hooks/useCounter';
import { CARDS } from './const/cards';
import { COLORLESS_CARDS } from './const/colorlessCards';
import { ANCIENT_CARDS } from './const/ancientCards';
import { CRESCENT_SPEAR } from '@/lib/cards/crescentSpear';
import type { CardType } from './const/types';
import type { CardCounts, DeckBuildSummary } from './hooks/useDeckBuild';
import { CardRow } from './CardRow';
import styles from './DeckBuild.module.scss';

const TYPE_LABELS: Record<CardType, string> = {
  attack: 'アタック',
  skill: 'スキル',
  power: 'パワー',
};

const CARD_TYPES: CardType[] = ['attack', 'skill', 'power'];

export type DeckBuildProps = {
  counts: CardCounts;
  colorlessCounts: CardCounts;
  ancientCounts: CardCounts;
  junkCount: number;
  irregularAttack: UseCounterResult;
  irregularSkill: UseCounterResult;
  irregularPower: UseCounterResult;
  totalPowerAdjustment: UseCounterResult;
  totalBlockAdjustment: UseCounterResult;
  summary: DeckBuildSummary;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onIncrementBase: (cardId: string) => void;
  onDecrementBase: (cardId: string) => void;
  onIncrementPlus: (cardId: string) => void;
  onDecrementPlus: (cardId: string) => void;
  onIncrementColorlessBase: (cardId: string) => void;
  onDecrementColorlessBase: (cardId: string) => void;
  onIncrementColorlessPlus: (cardId: string) => void;
  onDecrementColorlessPlus: (cardId: string) => void;
  onIncrementAncientBase: (cardId: string) => void;
  onDecrementAncientBase: (cardId: string) => void;
  onIncrementAncientPlus: (cardId: string) => void;
  onDecrementAncientPlus: (cardId: string) => void;
  onIncrementJunk: () => void;
  onDecrementJunk: () => void;
  onResetAll: () => void;
};

/**
 * UI層。stateを持たず、Container層から受け取ったcounts/summary/ハンドラを
 * カード一覧・集計パネルへそのまま橋渡しして描画するだけの純粋コンポーネント。
 */
export const DeckBuild: React.FC<DeckBuildProps> = ({
  counts,
  colorlessCounts,
  ancientCounts,
  junkCount,
  irregularAttack,
  irregularSkill,
  irregularPower,
  totalPowerAdjustment,
  totalBlockAdjustment,
  summary,
  searchQuery,
  onSearchQueryChange,
  onIncrementBase,
  onDecrementBase,
  onIncrementPlus,
  onDecrementPlus,
  onIncrementColorlessBase,
  onDecrementColorlessBase,
  onIncrementColorlessPlus,
  onDecrementColorlessPlus,
  onIncrementAncientBase,
  onDecrementAncientBase,
  onIncrementAncientPlus,
  onDecrementAncientPlus,
  onIncrementJunk,
  onDecrementJunk,
  onResetAll,
}) => {
  const normalizedQuery = searchQuery.trim();
  const matchesQuery = (card: { name: string; effectBase: string }) =>
    normalizedQuery === '' || card.name.includes(normalizedQuery) || card.effectBase.includes(normalizedQuery);
  const filteredCards = CARDS.filter(matchesQuery);
  const filteredColorlessCards = COLORLESS_CARDS.filter(matchesQuery);
  const filteredAncientCards = ANCIENT_CARDS.filter(matchesQuery);

  return (
    <div className={styles.container}>
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

      <div className={styles.summary}>
        <CountDisplay label="デッキ総数（ごみ札込み）" value={summary.totalDeckCount} unit="枚" />
        <CountDisplay label="カード枚数（登録カードのみ）" value={summary.totalCardCount} unit="枚" />
        <CountDisplay label="アタック枚数" value={summary.countByType.attack} unit="枚" />
        <CountDisplay label="ブロック枚数" value={summary.blockSkillCount} unit="枚" />
        <CountDisplay label="スキル枚数（非ブロック）" value={summary.nonBlockSkillCount} unit="枚" />
        <CountDisplay label="パワー枚数" value={summary.countByType.power} unit="枚" />
        <CountDisplay label="総スター消費" value={summary.totalStarCost} unit="✦" />
        <CountDisplay label="総スター回収" value={summary.totalStarGain} unit="✦" />
        <CountDisplay label="✦コストカード枚数" value={summary.starCostCardCount} unit="枚" />
        <CountDisplay label="✦回収カード枚数" value={summary.starGainCardCount} unit="枚" />
        <CountDisplay label={CRESCENT_SPEAR.label} value={summary.crescentSpearPower} />
        <CountDisplay label={CRESCENT_SPEAR.plusLabel} value={summary.crescentSpearPlusPower} />
        <CountDisplay label="平均ATK" value={Math.round(summary.averageAttackPower * 10) / 10} />
        <CountDisplay label="平均ブロック" value={Math.round(summary.averageBlock * 10) / 10} />
        <CountDisplay label="平均コスト" value={Math.round(summary.averageEnergyCost * 10) / 10} />
        <CountDisplay label="平均消費スター" value={Math.round(summary.averageStarCost * 10) / 10} unit="✦" />
        <CountDisplay label="平均回収スター" value={Math.round(summary.averageStarGain * 10) / 10} unit="✦" />
      </div>

      <div className={styles.adjustmentRow}>
        <CounterField
          label="総威力"
          value={summary.totalPower}
          bigStep={10}
          onIncrement={totalPowerAdjustment.increment}
          onDecrement={totalPowerAdjustment.decrement}
          onIncrementBy={totalPowerAdjustment.incrementBy}
          onDecrementBy={totalPowerAdjustment.decrementBy}
          onReset={totalPowerAdjustment.reset}
        />
        <CounterField
          label="総ブロック"
          value={summary.totalBlock}
          bigStep={10}
          onIncrement={totalBlockAdjustment.increment}
          onDecrement={totalBlockAdjustment.decrement}
          onIncrementBy={totalBlockAdjustment.incrementBy}
          onDecrementBy={totalBlockAdjustment.decrementBy}
          onReset={totalBlockAdjustment.reset}
        />
      </div>
      <p className={styles.note}>
        総威力・総ブロックはカードから自動集計した値に、エンチャント等のズレ分を+/-で上乗せ調整できるのです（リセットは調整分のみ0に戻すのです）。
      </p>

      <div className={styles.junkRow}>
        <CounterField
          label="ごみ札"
          value={junkCount}
          unit="枚"
          onIncrement={onIncrementJunk}
          onDecrement={onDecrementJunk}
        />
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>イレギュラーカード（手動追加）</h3>
        <div className={styles.list}>
          <CounterField
            label="アタック"
            value={irregularAttack.value}
            unit="枚"
            onIncrement={irregularAttack.increment}
            onDecrement={irregularAttack.decrement}
            onReset={irregularAttack.reset}
          />
          <CounterField
            label="スキル"
            value={irregularSkill.value}
            unit="枚"
            onIncrement={irregularSkill.increment}
            onDecrement={irregularSkill.decrement}
            onReset={irregularSkill.reset}
          />
          <CounterField
            label="パワー"
            value={irregularPower.value}
            unit="枚"
            onIncrement={irregularPower.increment}
            onDecrement={irregularPower.decrement}
            onReset={irregularPower.reset}
          />
        </div>
      </section>

      <p className={styles.note}>
        「集計対象外」タグのカードはXコスト・条件付き効果・パワーカードのため、枚数のみカウントし総威力/総ブロックには含めていないのです。
        イレギュラーカード・ごみ札はカタログに無いカードを手動で加算する枠で、枚数のみデッキ総数に反映し総威力/総ブロック等の集計には含めていないのです。
      </p>

      {CARD_TYPES.map((type) => (
        <section key={type} className={styles.section}>
          <h3 className={styles.sectionTitle}>
            {TYPE_LABELS[type]}（{summary.countByType[type]}枚）
          </h3>
          <div className={styles.list}>
            {filteredCards
              .filter((card) => card.type === type)
              .map((card) => (
                <CardRow
                  key={card.id}
                  card={card}
                  baseCount={counts[card.id].base}
                  plusCount={counts[card.id].plus}
                  onIncrementBase={() => onIncrementBase(card.id)}
                  onDecrementBase={() => onDecrementBase(card.id)}
                  onIncrementPlus={() => onIncrementPlus(card.id)}
                  onDecrementPlus={() => onDecrementPlus(card.id)}
                />
              ))}
          </div>
        </section>
      ))}

      <h2 className={styles.subHeading}>無色カード（全クラス共通）</h2>
      {CARD_TYPES.map((type) => (
        <section key={`colorless-${type}`} className={styles.section}>
          <h3 className={styles.sectionTitle}>{TYPE_LABELS[type]}</h3>
          <div className={styles.list}>
            {filteredColorlessCards
              .filter((card) => card.type === type)
              .map((card) => (
                <CardRow
                  key={card.id}
                  card={card}
                  baseCount={colorlessCounts[card.id].base}
                  plusCount={colorlessCounts[card.id].plus}
                  onIncrementBase={() => onIncrementColorlessBase(card.id)}
                  onDecrementBase={() => onDecrementColorlessBase(card.id)}
                  onIncrementPlus={() => onIncrementColorlessPlus(card.id)}
                  onDecrementPlus={() => onDecrementColorlessPlus(card.id)}
                />
              ))}
          </div>
        </section>
      ))}

      <h2 className={styles.subHeading}>エンシェント入手カード</h2>
      {CARD_TYPES.filter((type) => filteredAncientCards.some((card) => card.type === type)).map((type) => (
        <section key={`ancient-${type}`} className={styles.section}>
          <h3 className={styles.sectionTitle}>{TYPE_LABELS[type]}</h3>
          <div className={styles.list}>
            {filteredAncientCards
              .filter((card) => card.type === type)
              .map((card) => (
                <CardRow
                  key={card.id}
                  card={card}
                  baseCount={ancientCounts[card.id].base}
                  plusCount={ancientCounts[card.id].plus}
                  onIncrementBase={() => onIncrementAncientBase(card.id)}
                  onDecrementBase={() => onDecrementAncientBase(card.id)}
                  onIncrementPlus={() => onIncrementAncientPlus(card.id)}
                  onDecrementPlus={() => onDecrementAncientPlus(card.id)}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};
