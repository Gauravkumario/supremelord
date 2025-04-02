import React from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Loader from './Loader';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children, title = 'Developer Portfolio' }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { darkMode } = useTheme();
  
  // Routes that don't require authentication
  const publicRoutes = ['/login', '/'];
  
  // Check if current route is a public route
  const isPublicRoute = publicRoutes.includes(router.pathname);
  
  // If loading, show loader
  if (status === 'loading') {
    return <Loader />;
  }
  
  // If not authenticated and not on a public route, redirect to login
  if (!session && !isPublicRoute) {
    router.push('/login');
    return <Loader />;
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="A modern developer portfolio showcase" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Navbar />
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Developer Portfolio</p>
      </footer>

      <style jsx>{`
        .app-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
          background-color: var(--bg-primary);
        }
        
        .main-content {
          flex: 1;
          padding: 1.5rem;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        
        .footer {
          text-align: center;
          padding: 1rem;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-primary);
        }
      `}</style>
    </div>
  );
};

export default Layout;
