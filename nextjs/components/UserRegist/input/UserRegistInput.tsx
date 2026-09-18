import { UserRegistForm } from './components/UserRegistForm/UserRegistForm';

export const UserRegistInput: React.FC = () => {
  return (
    <div className="p-32">
      <h1 className="mb-24">ユーザー登録</h1>
      <p className="mb-32">以下のフォームに必要事項を入力してください。</p>
      <UserRegistForm />
    </div>
  );
};
