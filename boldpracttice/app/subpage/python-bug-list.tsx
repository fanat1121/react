import React from "react";

const PythonBugList = () => {
  return (
    <div>
      <h1>Pythonのバグのリスト</h1>
      <h2>よく発生しがちなエラー</h2>
      <ul>
        <li>
          <strong>List Indexエラー</strong>
          <p>リストのインデックスが範囲外である場合に発生します。</p>
          <p>解決策: インデックスがリストの長さ内にあることを確認する。</p>
          <h3>良く発生するシチュエーション</h3>
          <ul>
            <li>ループ内でリストのインデックスを誤って計算した場合</li>
            <li>
              ユーザー入力に基づいてリストの要素にアクセスする際に、入力がリストの範囲外である場合
            </li>
          </ul>
          <h3>凡例</h3>
          <pre>
            <code>
              {`# シチュエーション1: リストの長さを超えるインデックスにアクセスしようとする
my_list = [1, 2, 3]
print(my_list[3])  # IndexError: list index out of range

# シチュエーション2: ユーザー入力をそのままインデックスとして使用する
my_list = [1, 2, 3]
index = int(input("Enter an index: "))
if 0 <= index < len(my_list):
    print(my_list[index])
else:
    print("Invalid index")`}
            </code>
          </pre>
        </li>
      </ul>
    </div>
  );
};

export default PythonBugList;
