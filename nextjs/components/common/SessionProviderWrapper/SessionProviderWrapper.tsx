'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export const SessionProviderWrapper: React.FC<Props> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
