import clsx from 'clsx';
import Link from 'next/link';
import styles from './DemoNav.module.scss';

export const DEMO_LINKS = [
  { href: '/jev-demo/shapes', label: 'Choice：図形判定' },
  { href: '/jev-demo/score', label: 'Score：丸のきれいさ' },
  { href: '/jev-demo/noul', label: 'Noul：文の正しさ' },
  { href: '/jev-demo/box', label: 'Box：位置さがし' },
  { href: '/jev-demo', label: '動画判定' },
] as const;

export type DemoHref = (typeof DEMO_LINKS)[number]['href'];

type DemoNavProps = {
  /** 今いるページ */
  current: DemoHref;
};

/** Jev デモのページ間を移動するリンク */
export const DemoNav: React.FC<DemoNavProps> = ({ current }) => {
  return (
    <nav aria-label="Jev デモ">
      <ul className={styles.list}>
        {DEMO_LINKS.map((link) => {
          const isCurrent = link.href === current;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(styles.link, isCurrent && styles.current)}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
