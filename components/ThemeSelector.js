import { useState } from 'react';
import { useTheme, themePresets } from '../contexts/ThemeContext';

const ThemeSelector = () => {
  const { theme, changeTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme.name);
  
  const handleThemeChange = (themeName) => {
    setSelectedTheme(themeName);
    changeTheme(themeName);
  };
  
  return (
    <div className="theme-selector">
      <p className="theme-description">
        Select a theme for your portfolio. Changes will be applied immediately and saved for all visitors.
      </p>
      
      <div className="theme-options">
        <div 
          className={`theme-option ${selectedTheme === 'light' ? 'active' : ''}`}
          onClick={() => handleThemeChange('light')}
        >
          <div className="theme-preview light-theme">
            <div className="preview-header"></div>
            <div className="preview-content">
              <div className="preview-sidebar"></div>
              <div className="preview-main">
                <div className="preview-card"></div>
                <div className="preview-card"></div>
              </div>
            </div>
          </div>
          <div className="theme-name">Light</div>
          <div className="theme-check">
            {selectedTheme === 'light' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </div>
        </div>
        
        <div 
          className={`theme-option ${selectedTheme === 'dark' ? 'active' : ''}`}
          onClick={() => handleThemeChange('dark')}
        >
          <div className="theme-preview dark-theme">
            <div className="preview-header"></div>
            <div className="preview-content">
              <div className="preview-sidebar"></div>
              <div className="preview-main">
                <div className="preview-card"></div>
                <div className="preview-card"></div>
              </div>
            </div>
          </div>
          <div className="theme-name">Dark</div>
          <div className="theme-check">
            {selectedTheme === 'dark' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .theme-selector {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .theme-description {
          margin-bottom: 2rem;
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .theme-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        
        .theme-option {
          border: 2px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .theme-option:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
        }
        
        .theme-option.active {
          border-color: var(--primary-color);
        }
        
        .theme-preview {
          height: 180px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }
        
        .light-theme {
          background-color: #ffffff;
          color: #1a1a1a;
        }
        
        .dark-theme {
          background-color: #121212;
          color: #ffffff;
        }
        
        .preview-header {
          height: 20px;
          background-color: currentColor;
          opacity: 0.1;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        
        .preview-content {
          display: flex;
          flex-grow: 1;
          gap: 0.5rem;
        }
        
        .preview-sidebar {
          width: 30%;
          background-color: currentColor;
          opacity: 0.15;
          border-radius: 4px;
        }
        
        .preview-main {
          width: 70%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .preview-card {
          flex-grow: 1;
          background-color: currentColor;
          opacity: 0.1;
          border-radius: 4px;
        }
        
        .theme-name {
          padding: 0.75rem;
          text-align: center;
          font-weight: 500;
          border-top: 1px solid var(--border-color);
          color: var(--text-primary);
        }
        
        .theme-check {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
        }
        
        @media (max-width: 480px) {
          .theme-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeSelector;