'use client';

import { useState } from 'react';
import styles from './Tabs.module.scss';

type TabItem = {
  key: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultActiveKey?: string;
};

export const Tabs: React.FC<TabsProps> = ({ items, defaultActiveKey }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey ?? items[0]?.key);
  const activeItem = items.find((item) => item.key === activeKey) ?? items[0];

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList} role="tablist">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={item.key === activeKey}
            className={[styles.tab, item.key === activeKey && styles['tab--active']]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveKey(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.tabPanel} role="tabpanel">
        {activeItem?.content}
      </div>
    </div>
  );
};
