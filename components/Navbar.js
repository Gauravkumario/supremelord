import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <span className={styles.logoText}>Portfolio</span>
          </Link>
        </div>
        
        <div className={styles.menuToggle} onClick={toggleMenu}>
          <div className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}></div>
        </div>
        
        <div className={`${styles.menu} ${menuOpen ? styles.active : ''}`}>
          <Link href="/" className={router.pathname === '/' ? styles.active : ''}>
            Home
          </Link>
          
          {session ? (
            <>
              <Link href="/admin" className={router.pathname.startsWith('/admin') ? styles.active : ''}>
                Admin
              </Link>
              <button className={styles.signOutButton} onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className={router.pathname === '/login' ? styles.active : ''}>
              Login
            </Link>
          )}
          
          <div className={styles.themeToggle}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
