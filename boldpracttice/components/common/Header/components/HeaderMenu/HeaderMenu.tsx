import Link from "next/link";
import styles from "./HeaderMenu.module.scss";
import { MenuItem } from "./const/menuItems";

type HeaderMenuProps = {
  items: MenuItem[];
};

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ items }) => {
  return (
    <nav className={styles.navigation}>
      <ul className={styles.navList}>
        {items.map((item) => (
          <li key={item.href} className={styles.navItem}>
            <Link href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
