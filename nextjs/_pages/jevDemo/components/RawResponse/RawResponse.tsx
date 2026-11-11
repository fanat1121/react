import styles from './RawResponse.module.scss';

type RawResponseProps = {
  /** Jev が返したレスポンス */
  value: unknown;
};

/** JSON.stringify のインデント幅 */
const JSON_INDENT = 2;

/** Jev のレスポンスを加工せず JSON のまま表示する */
export const RawResponse: React.FC<RawResponseProps> = ({ value }) => {
  return (
    <div className={styles.rawResponse}>
      <h3 className={styles.heading}>Jev のレスポンス</h3>
      <pre className={styles.raw} aria-label="Jev のレスポンス">
        {JSON.stringify(value, null, JSON_INDENT)}
      </pre>
    </div>
  );
};
