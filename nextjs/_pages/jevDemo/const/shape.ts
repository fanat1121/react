/** 描画キャンバスの一辺(px)。Jev の画像は各辺 280px 以上が必要 */
export const SKETCH_SIZE = 320;

export const SKETCH_STROKE_WIDTH = 6;
export const SKETCH_STROKE_COLOR = '#111';
export const SKETCH_BACKGROUND_COLOR = '#fff';

/**
 * 判定する図形と、その説明
 * 「どれでもない」を入れておかないと、何を描いてもどれかに決まってしまう
 * 表示はこの順に固定する (確率順に並べ替えると、描くたびに行が入れ替わって読みにくい)
 */
export const SHAPE_OPTIONS = [
  { label: '丸', description: '線が途切れずにつながった、角のない円や楕円' },
  { label: '三角', description: '3本の直線と3つの角でできた閉じた図形' },
  { label: '四角', description: '4本の直線と4つの角でできた閉じた図形（正方形・長方形・ひし形など）' },
  { label: 'どれでもない', description: '丸・三角・四角のいずれにも見えない線や図形、または何も描かれていない' },
] as const;

export const SHAPE_INSTRUCTIONS =
  'state.drawing はユーザーがマウスや指で手描きした図形の画像です。どの図形に見えますか。手描きなので線のゆがみや多少のすき間は許容してください';
