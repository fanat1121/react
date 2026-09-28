import type { CardData } from '../const/types';

/** カード名・効果（無印）に検索語を含むカードだけを返す。前後の空白のみの検索語は全件を返す */
export const filterCardsByQuery = (cards: CardData[], query: string): CardData[] => {
  const normalizedQuery = query.trim();
  if (normalizedQuery === '') return cards;
  return cards.filter((card) => card.name.includes(normalizedQuery) || card.effectBase.includes(normalizedQuery));
};
