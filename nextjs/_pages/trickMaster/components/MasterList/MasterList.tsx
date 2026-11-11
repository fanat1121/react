import { Button } from '@/components/common/ui/Button';
import styles from './MasterList.module.scss';
import type { MasterListItem } from '../../types';

type MasterListProps = {
  title: string;
  items: MasterListItem[];
  emptyMessage: string;
  isLoading?: boolean;
  errorMessage?: string;
  deletingId: number | null;
  onDelete: (item: MasterListItem) => void;
};

export const MasterList: React.FC<MasterListProps> = ({
  title,
  items,
  emptyMessage,
  isLoading = false,
  errorMessage = '',
  deletingId,
  onDelete,
}) => {
  return (
    <section className={styles.list}>
      <h3 className={styles.title}>{title}</h3>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      {isLoading ? (
        <p className={styles.message}>読み込み中...</p>
      ) : items.length === 0 ? (
        <p className={styles.message}>{emptyMessage}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>名前</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td className={styles.actionCell}>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => onDelete(item)}
                    disabled={deletingId !== null}
                  >
                    {deletingId === item.id ? '削除中...' : '削除'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};
