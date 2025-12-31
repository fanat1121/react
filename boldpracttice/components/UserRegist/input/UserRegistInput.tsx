import { UserRegistForm } from './components/UserRegistForm/UserRegistForm';

export const UserRegistPage: React.FC = () => {
  const handleSubmit = async (data: { userName: string; email: string; password: string }) => {
    console.log('User registration data:', data);
  };

  return (
    <div className="p-32">
      <h1 className="mb-24">ユーザー登録</h1>
      <p className="mb-32">以下のフォームに必要事項を入力してください。</p>
      <UserRegistForm onSubmit={handleSubmit} />
    </div>
  );
};
