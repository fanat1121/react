import React from 'react';
import { UserRegistCompletion } from '@/components/UserRegist/completion';

type Props = {
  searchParams: Promise<{ loginId?: string }>;
};

const UserRegistCompletionPage: React.FC<Props> = async ({ searchParams }) => {
  const { loginId } = await searchParams;
  return <UserRegistCompletion userLoginId={loginId ?? ''} />;
};

export default UserRegistCompletionPage;
