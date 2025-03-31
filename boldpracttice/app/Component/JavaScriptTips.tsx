import React from "react";
import styles from "../styles/javascript-tips.module.scss";

const JavaScriptTips: React.FC = () => {
  return (
    <div className={styles["javascript-tips"]}>
      <h2>JavaScriptのはまりやすいポイント</h2>
      <ul>
        <li>
          変数のスコープ:
          <div className="tip-section">
            <p>
              グローバル変数とローカル変数の違いを理解することが重要です。グローバル変数はどこからでもアクセスできるため、予期せぬバグの原因となることがあります。
            </p>
          </div>
        </li>
        <li>
          非同期処理:
          <div className="tip-section">
            <p>
              コールバック、プロミス、async/awaitを使った非同期処理の違いを理解することが重要です。特に、ネストされたコールバックはコードの可読性を損ないます。
            </p>
          </div>
        </li>
        <li>
          イベントハンドリング:
          <div className="tip-section">
            <p>
              イベントリスナーの追加と削除を正しく行うことが重要です。特に、メモリリークを防ぐためにイベントリスナーを適切に削除することが求められます。
            </p>
          </div>
        </li>
        <li>
          クロージャ:
          <div className="tip-section">
            <p>
              クロージャを使うことで、関数が宣言された時のスコープを保持できます。これにより、非同期処理やコールバック関数で変数の値を保持することができます。
            </p>
          </div>
        </li>
        <li>
          プロトタイプチェーン:
          <div className="tip-section">
            <p>
              JavaScriptのプロトタイプチェーンを理解することで、オブジェクト指向プログラミングの基本概念を掴むことができます。プロトタイプチェーンを使うことで、継承やメソッドの共有が可能になります。
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default JavaScriptTips;
