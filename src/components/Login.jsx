import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, verify it and auto-redirect based on role
    const checkToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const res = await fetch('https://https://portfolio-backend-malik.bonto.run/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.role === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/profile');
            }
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
        } catch (err) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        }
      }
    };
    checkToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://https://portfolio-backend-malik.bonto.run/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrUsername, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify({ 
        username: data.username, 
        email: data.email, 
        profilePic: data.profilePic,
        role: data.role 
      }));

      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] px-4">
      <div className="w-full max-w-md card p-8 md:p-10 shadow-[0_0_50px_rgba(16,185,129,0.05)] border-emerald-500/10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-[var(--color-text-secondary)] text-sm mt-2">Sign in to access your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Email or Username</label>
            <input
              type="text"
              required
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors animate-none"
              placeholder="Username or email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors animate-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg font-semibold transition-all flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)] space-y-4">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-400 hover:underline">
              Sign Up
            </Link>
          </p>
          <div className="pt-2">
            <Link to="/" className="inline-flex items-center gap-1 text-xs hover:text-white transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
