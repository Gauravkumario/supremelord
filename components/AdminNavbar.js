import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

const AdminNavbar = ({ onSectionChange, activeSection }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <div className="admin-sidebar-menu">
        <div
          className={`admin-nav-item ${
            activeSection === "projects" ? "active" : ""
          }`}
          onClick={() => onSectionChange("projects")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span>Projects</span>
        </div>

        <div
          className={`admin-nav-item ${
            activeSection === "profile" ? "active" : ""
          }`}
          onClick={() => onSectionChange("profile")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </div>
      </div>

      <div className="admin-sidebar-footer">
        <div className="admin-nav-item gap-2">
          <Link href="/" className="admin-nav-item view-site-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="view-site-text">View Site</span>
          </Link>
        </div>

        <div className="admin-nav-item logout-button" onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </div>
      </div>

      <style jsx>{`
        .admin-sidebar {
          background-color: var(--bg-secondary);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 220px;
          border-right: 1px solid var(--border-color);
        }

        .admin-sidebar-header {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .admin-sidebar-header h2 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .admin-sidebar-menu {
          padding: 1rem 0.5rem;
          flex-grow: 1;
        }

        .admin-sidebar-footer {
          border-top: 1px solid var(--border-color);
          padding: 0.75rem 0.5rem;
          display: flex;
          flex-direction: column;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.8rem;
          border-radius: 4px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: background-color 0.2s ease, color 0.2s ease;
          cursor: pointer;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .admin-nav-item:hover {
          background-color: var(--hover-bg);
          color: var(--text-primary);
        }

        .admin-nav-item.active {
          background-color: var(--primary-color);
          color: white;
        }

        .view-site-link {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .view-site-text {
          display: inline;
        }

        .logout-button {
          color: var(--error-color);
        }

        .logout-button:hover {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--error-color);
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 1rem;
          }

          .admin-sidebar-menu,
          .admin-sidebar-footer {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            padding: 0.5rem;
          }

          .admin-nav-item {
            flex: 1;
            min-width: 120px;
            margin-bottom: 0;
          }

          .view-site-link {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminNavbar;
