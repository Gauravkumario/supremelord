import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import AdminNavbar from '../../components/AdminNavbar';
import ProfileForm from '../../components/ProfileForm';
import ProjectForm from '../../components/ProjectForm';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { fetchProjects, fetchUserProfile, createProject, updateProject, deleteProject } from '../../lib/api';
import styles from '../../styles/AdminProjects.module.css';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('projects');
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Project management state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user profile data
        const profileData = await fetchUserProfile();
        setProfile(profileData);
        
        // Load projects data
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      loadData();
    }
  }, [status]);
  
  // Handle profile update
  const handleProfileUpdate = async (updatedProfile) => {
    setProfile(updatedProfile);
  };
  
  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  
  // Project management handlers
  const handleCreateProject = () => {
    setCurrentProject(null);
    setIsProjectModalOpen(true);
  };
  
  const handleEditProject = (project) => {
    setCurrentProject(project);
    setIsProjectModalOpen(true);
  };
  
  const handleProjectSubmit = async (projectData) => {
    try {
      if (currentProject) {
        // Update existing project
        const updatedProject = await updateProject(currentProject.id, projectData);
        setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
      } else {
        // Create new project
        const newProject = await createProject(projectData);
        setProjects([...projects, newProject]);
      }
      
      setIsProjectModalOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  };
  
  // Delete project handlers
  const handleDeleteClick = (id) => {
    const project = projects.find(p => p.id === id);
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteProject(projectToDelete.id);
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };
  
  // Loading state
  if (status === 'loading' || loading) {
    return (
      <Layout title="Admin Dashboard">
        <Loader message="Loading dashboard..." />
      </Layout>
    );
  }
  
  return (
    <Layout title="Admin Dashboard">
      <div className="admin-layout">
        <AdminNavbar onSectionChange={handleSectionChange} activeSection={activeSection} />
        
        <div className="admin-content">
          {/* Profile Section */}
          {activeSection === 'profile' && profile && (
            <div className="admin-section">
              <h1 className="section-title">Profile Settings</h1>
              <ProfileForm profile={profile} onSubmit={handleProfileUpdate} />
            </div>
          )}
          
          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className={styles.projectsContainer}>
              <div className={styles.header}>
                <h1 className={styles.title}>Projects</h1>
                <button 
                  className={styles.addButton} 
                  onClick={handleCreateProject}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Project
                </button>
              </div>
              
              <div className={styles.tableContainer}>
                {projects.length > 0 ? (
                  <table className={styles.projectsTable}>
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>Image</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Tech Stack</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(project => (
                        <tr key={project.id}>
                          <td>
                            <div 
                              className={styles.projectImage}
                              style={{
                                backgroundImage: `url(${project.image || `/uploads/1742909823823-photo.jpg`})`,
                              }}
                            >
                            </div>
                          </td>
                          <td className={styles.projectTitle}>{project.title}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles[`status${project.status.replace(' ', '')}`]}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className={styles.techStack}>
                            {project.techStack.slice(0, 3).map((tech, index) => (
                              <span key={index} className={styles.techBadge}>
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className={`${styles.techBadge} ${styles.techMore}`}>
                                +{project.techStack.length - 3}
                              </span>
                            )}
                          </td>
                          <td className={styles.actions}>
                            <button 
                              className={`${styles.actionButton} ${styles.editButton}`}
                              onClick={() => handleEditProject(project)}
                              title="Edit project"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button 
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              onClick={() => handleDeleteClick(project.id)}
                              title="Delete project"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`${styles.actionButton} ${styles.viewButton} ${!project.liveUrl ? styles.disabled : ''}`}
                              title="View live demo"
                              onClick={(e) => !project.liveUrl && e.preventDefault()}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={styles.emptyState}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                    </svg>
                    <h3>No projects yet</h3>
                    <p>Create your first project by clicking the "Add Project" button.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Project form modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={currentProject ? 'Edit Project' : 'Add New Project'}
        size="large"
      >
        <ProjectForm
          project={currentProject}
          onSubmit={handleProjectSubmit}
          onCancel={() => setIsProjectModalOpen(false)}
        />
      </Modal>
      
      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project"
        size="small"
      >
        <div className={styles.deleteConfirmation}>
          <p>Are you sure you want to delete <strong>{projectToDelete?.title}</strong>?</p>
          <p>This action cannot be undone.</p>
          
          <div className={styles.deleteActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className={styles.deleteConfirmButton}
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      
      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 180px);
          gap: 1rem;
          padding: 1rem;
        }
        
        .admin-content {
          flex: 1;
          background-color: var(--bg-primary);
          border-radius: 4px;
          padding: 1.25rem;
          border: 1px solid var(--border-color);
        }
        
        .admin-section {
          width: 100%;
        }
        
        .section-title {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
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