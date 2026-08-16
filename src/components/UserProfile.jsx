import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, ShieldAlert, LogOut, Settings, Camera } from "lucide-react";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [shouldRemovePic, setShouldRemovePic] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  const getAvatarUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (!storedToken) {
      navigate('/login');
      return;
    }

    setToken(storedToken);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setCurrentUser(parsed);
      setUsername(parsed.username || '');
      setEmail(parsed.email || '');
      setProfilePic(parsed.profilePic || '');
    }

    // Verify token with backend
    const verifyToken = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        if (!res.ok) {
          throw new Error('Session expired');
        }
        const data = await res.json();
        setCurrentUser(data);
        setUsername(data.username || '');
        setEmail(data.email || '');
        setProfilePic(data.profilePic || '');
        setPreviewUrl('');
        setProfilePicFile(null);
        setShouldRemovePic(false);
        localStorage.setItem('authUser', JSON.stringify({
          username: data.username,
          email: data.email,
          profilePic: data.profilePic,
          role: data.role
        }));
        setLoading(false);
      } catch (err) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShouldRemovePic(false);
    }
  };

  const handleRemovePicture = () => {
    setProfilePicFile(null);
    setPreviewUrl('');
    setShouldRemovePic(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      
      if (newPassword) {
        formData.append('password', newPassword);
      }

      if (profilePicFile) {
        formData.append('profilePic', profilePicFile);
      } else if (shouldRemovePic) {
        formData.append('removeProfilePic', 'true');
      }

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedUser = { 
        username: data.username, 
        email: data.email, 
        profilePic: data.profilePic,
        role: data.role 
      };
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      setCurrentUser(data);
      setProfilePic(data.profilePic || '');
      setPreviewUrl('');
      setProfilePicFile(null);
      setShouldRemovePic(false);
      setSuccess('Profile updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  if (loading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-border-subtle)] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Manage your profile details and security settings</p>
          </div>
          <div className="flex gap-3">
            {currentUser?.role === 'admin' && (
              <Link to="/admin/dashboard" className="px-4 py-2 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg text-sm font-semibold transition-all animate-none">
                Admin Panel
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Avatar & Overview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card p-6 text-center flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4 group rounded-full overflow-hidden">
                {profilePic ? (
                  <img 
                    src={getAvatarUrl(profilePic)} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover border-2 border-emerald-500/30"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=fallback';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-dashed border-emerald-500/30">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-white">{currentUser?.username}</h2>
              <p className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full mt-2 capitalize">
                {currentUser?.role || 'User'}
              </p>
              <div className="w-full border-t border-[var(--color-border-subtle)] my-6"></div>
              
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">{currentUser?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Settings Form */}
          <div className="lg:col-span-8">
            <div className="card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-4">
                <Settings className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-white">Profile Settings</h3>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Profile Picture Uploader */}
                <div className="space-y-4 border-b border-[var(--color-border-subtle)] pb-6">
                  <label className="text-sm font-medium text-[var(--color-text-primary)]">Profile Picture</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] overflow-hidden flex items-center justify-center shrink-0">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (profilePic && !shouldRemovePic) ? (
                        <img src={getAvatarUrl(profilePic)} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-[var(--color-text-secondary)]" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                          Upload New
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        {((profilePic && !shouldRemovePic) || previewUrl) && (
                          <button
                            type="button"
                            onClick={handleRemovePicture}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-lg text-xs font-semibold transition-all cursor-pointer animate-none"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)]">PNG, JPG, JPEG, GIF or WEBP. Max size 5MB.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-primary)]">Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors animate-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--color-text-primary)]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors animate-none"
                    />
                  </div>
                </div>

                <div className="border-t border-[var(--color-border-subtle)] pt-6">
                  <h4 className="text-sm font-bold text-white mb-4">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors animate-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--color-text-primary)]">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors animate-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--color-border-subtle)]">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {updating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-sm hover:text-white text-[var(--color-text-secondary)] transition-colors">
            ← Back to Portfolio
          </Link>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
