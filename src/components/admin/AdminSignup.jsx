import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminSignup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect immediately since signup is disabled and admin account is already created
    navigate('/admin/login');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] px-4">
      <div className="w-full max-w-md card p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Registration Disabled</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          The administrator account is already created. New registrations are disabled.
        </p>
        <Link to="/admin/login" className="text-emerald-400 hover:underline">
          Go to Sign In
        </Link>
      </div>
    </div>
  );
};

export default AdminSignup;
