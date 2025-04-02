import React from 'react';

const Loader = ({ fullScreen = false, message = null }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loader-content">
        <div className="loader"></div>
        {message && <p className="loader-message">{message}</p>}
      </div>
      
      <style jsx>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          min-height: 200px;
        }
        
        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .loader-message {
          font-size: 1rem;
          color: var(--text-secondary);
          margin: 0;
          text-align: center;
        }
        
        .fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--bg-primary);
          z-index: 1000;
        }
        
        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid var(--text-secondary);
          border-bottom-color: var(--primary-color);
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        
        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
