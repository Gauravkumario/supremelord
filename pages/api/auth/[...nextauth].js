import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyCredentials } from '../../../lib/auth';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Verify credentials against our user data
        const isValid = verifyCredentials(
          credentials.username,
          credentials.password
        );
        
        if (isValid) {
          // Return user data
          const user = {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
          };
          
          return user;
        }
        
        // Authentication failed
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to token if available
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to session
      if (token) {
        session.user.id = token.userId;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: 'a-very-secret-key-that-should-be-changed',
  debug: false,
};

export default NextAuth(authOptions);
