import React from 'react';
import { cookies } from 'next/headers';
import { UserRegistCompletion } from '@/_pages/userRegist/completion';
import { USER_REGIST_LOGIN_ID_COOKIE } from '@/_pages/userRegist/const/cookies';

const UserRegistCompletionPage: React.FC = async () => {
  const cookieStore = await cookies();
  const loginId = cookieStore.get(USER_REGIST_LOGIN_ID_COOKIE)?.value;
  return <UserRegistCompletion userLoginId={loginId ?? ''} />;
};

export default UserRegistCompletionPage;
