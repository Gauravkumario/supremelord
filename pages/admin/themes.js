import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import AdminNavbar from '../../components/AdminNavbar';
import ThemeSelector from '../../components/ThemeSelector';
import Loader from '../../components/Loader';
import { fetchProjects, fetchUserProfile } from '../../lib/api';

export default function AdminThemes() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeSection, setActiveSection] = useState('themes');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [profileData, projectsData] = await Promise.all([
        fetchUserProfile(),
        fetchProjects()
      ]);
      setProfile(profileData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAllData();
    }
  }, [status]);
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
    
    if (section === 'profile') {
      router.push('/admin');
    } else if (section === 'projects') {
      router.push('/admin/projects');
    }
  };
  
  if (status === 'loading' || isLoading) {
    return (
      <Layout title="Theme Customization">
        <Loader message="Loading..." />
      </Layout>
    );
  }
  
  return (
    <Layout title="Theme Customization">
      <div className="admin-layout">
        <AdminNavbar onSectionChange={handleSectionChange} />
        
        <div className="admin-content">
          <div className="admin-section">
            <h1 className="section-title">Theme Customization</h1>
            <ThemeSelector />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 180px);
          gap: 1.5rem;
          padding: 1.25rem;
        }
        
        .admin-content {
          flex: 1;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
        }
        
        .admin-section {
          width: 100%;
        }
        
        .section-title {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  );
}