export type MenuItem = {
  href: string;
  label: string;
};

export const MENU_ITEMS: MenuItem[] = [
  {
    href: '/hooks-demo',
    label: 'ドロップ計算機',
  },
  {
    href: '/block',
    label: 'テトリス',
  },
  {
    href: '/about',
    label: 'About',
  },
];
