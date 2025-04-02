import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useTheme } from "../contexts/ThemeContext";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { darkMode } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If user is already logged in, redirect to admin dashboard
  if (status === "authenticated") {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (result.error) {
        setError("Invalid username or password");
        setIsLoading(false);
      } else {
        // Redirect will be handled by the useSession hook
        router.push("/admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-page ${darkMode ? "dark-theme" : "light-theme"}`}>
      <Head>
        <title>Login | Developer Portfolio</title>
        <meta
          name="description"
          content="Login to manage your developer portfolio"
        />
      </Head>

      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <Image src="/logo.svg" alt="Logo" width={50} height={50} />
          </div>
          <h1>Welcome Back</h1>
          <p>Login to manage your portfolio</p>
        </div>

        {error && (
          <div className="error-message">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="login-hint">
            <p>
              Default credentials: username: <strong>admin</strong>, password:{" "}
              <strong>admin123</strong>
            </p>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="back-link">
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--bg-primary);
          padding: 1rem;
        }

        .login-container {
          width: 100%;
          max-width: 380px;
          background-color: var(--bg-primary);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          border: 1px solid var(--border-color);
        }

        .login-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .logo {
          margin: 0 auto 1rem;
          width: 50px;
          height: 50px;
        }

        .login-header h1 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .login-header p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .login-form {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 500;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.7rem 0.8rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .login-button {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.8rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .login-button:hover {
          background-color: var(--primary-hover);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--error-color);
          padding: 0.7rem 0.8rem;
          border-radius: 4px;
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .login-hint {
          margin-bottom: 1.2rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: 4px;
          background-color: var(--bg-secondary);
        }

        .login-hint strong {
          color: var(--primary-color);
        }

        .back-link {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .back-link a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }

        .back-link a:hover {
          color: var(--primary-color);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
