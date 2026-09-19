import { LoginFormContainer } from './components/LoginForm/LoginFormContainer';

export const Login: React.FC = () => {
  return (
    <div className="p-32">
      <h1 className="mb-24">ログイン</h1>
      <p className="mb-32">ログインIDとパスワードを入力してください。</p>
      <LoginFormContainer />
    </div>
  );
};
