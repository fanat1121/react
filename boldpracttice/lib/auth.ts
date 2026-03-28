import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const GO_API_URL = process.env.GO_API_URL ?? 'http://localhost:8080';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        userLoginId: { label: 'ログインID', type: 'text' },
        password: { label: 'パスワード', type: 'password' },
      },
      authorize: async (credentials) => {
        const res = await fetch(`${GO_API_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_login_id: credentials.userLoginId,
            password: credentials.password,
          }),
        });

        if (!res.ok) return null;

        const json = await res.json();
        if (!json.success) return null;

        const user = json.data;
        return {
          id: String(user.id),
          name: user.user_name,
          email: user.email,
          userLoginId: user.user_login_id,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userLoginId = (user as { userLoginId?: string }).userLoginId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      (session.user as { userLoginId?: string }).userLoginId = token.userLoginId as string;
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
});
