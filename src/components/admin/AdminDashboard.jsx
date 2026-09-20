import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import {
  BarChart3,
  FolderGit2,
  Mail,
  Settings,
  LogOut,
  Plus,
  Edit,
  Globe,
  Laptop,
  Check,
  Eye,
  RefreshCw,
  ExternalLink,
  GitBranch,
  Calendar,
  User,
  ShieldAlert,
  Trash2,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  
  // Dashboard statistics state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    liveLink: '',
    githubLink: ''
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectError, setProjectError] = useState('');

  // Messages state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  // Profile update states
  const [updateUsername, setUpdateUsername] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileUpdating, setProfileUpdating] = useState(false);
  
  const navigate = useNavigate();

  // Verification & initialization
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (!storedToken) {
      navigate('/login');
      return;
    }

    setToken(storedToken);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        navigate('/profile');
        return;
      }
      setAdminUser(parsedUser);
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('https://https://portfolio-backend-malik.bonto.run/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        if (!res.ok) {
          throw new Error('Verification failed');
        }
        const data = await res.json();
        if (data.role !== 'admin') {
          navigate('/profile');
          return;
        }
        setAdminUser(data);
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

  // Bind profile fields when adminUser changes
  useEffect(() => {
    if (adminUser) {
      setUpdateUsername(adminUser.username || '');
      setUpdateEmail(adminUser.email || '');
      setProfilePicUrl(adminUser.profilePic || '');
    }
  }, [adminUser]);

  // Fetch Stats data
  const fetchStats = async (currentToken) => {
    setStatsLoading(true);
    try {
      const res = await fetch('https://https://portfolio-backend-malik.bonto.run/api/visitors/stats', {
        headers: {
          'Authorization': `Bearer ${currentToken || token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch Projects data
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch('https://https://portfolio-backend-malik.bonto.run/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch Messages data
  const fetchMessages = async (currentToken) => {
    setMessagesLoading(true);
    try {
      const res = await fetch('https://https://portfolio-backend-malik.bonto.run/api/messages', {
        headers: {
          'Authorization': `Bearer ${currentToken || token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Initial tab loading
  useEffect(() => {
    if (!token) return;
    if (activeTab === 'stats') {
      fetchStats(token);
    } else if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'messages') {
      fetchMessages(token);
    }
  }, [activeTab, token]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  // Profile Update Submit handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setProfileError('New passwords do not match');
      return;
    }

    setProfileUpdating(true);
    try {
      const body = {
        username: updateUsername,
        email: updateEmail,
        profilePic: profilePicUrl
      };
      if (newPassword) {
        body.password = newPassword;
      }

      const res = await fetch('https://https://portfolio-backend-malik.bonto.run/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Update state and local storage
      const updatedUser = { 
        username: data.username, 
        email: data.email, 
        profilePic: data.profilePic,
        role: data.role 
      };
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      setAdminUser(data);
      setProfileSuccess('Profile settings updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileUpdating(false);
    }
  };

  // Projects CRUD operations
  const handleOpenAddModal = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      description: '',
      technologies: '',
      imageUrl: '',
      liveLink: '',
      githubLink: ''
    });
    setProjectError('');
    setProjectModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      imageUrl: project.imageUrl,
      liveLink: project.liveLink,
      githubLink: project.githubLink
    });
    setProjectError('');
    setProjectModalOpen(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectError('');
    
    const url = editingProjectId 
      ? `https://https://portfolio-backend-malik.bonto.run/api/projects/${editingProjectId}`
      : 'https://https://portfolio-backend-malik.bonto.run/api/projects';
      
    const method = editingProjectId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectForm)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      setProjectModalOpen(false);
      fetchProjects();
    } catch (err) {
      setProjectError(err.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`https://https://portfolio-backend-malik.bonto.run/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Messages operations
  const handleMarkAsRead = async (messageId, currentStatus) => {
    try {
      const res = await fetch(`https://https://portfolio-backend-malik.bonto.run/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ read: !currentStatus })
      });

      if (res.ok) {
        fetchMessages(token);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      const res = await fetch(`https://https://portfolio-backend-malik.bonto.run/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchMessages(token);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[var(--color-text-secondary)] text-sm">Verifying session credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] flex flex-col shrink-0">
        <div className="p-6 border-b border-[var(--color-border-subtle)]">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            Dashboard
          </h1>
          
          {/* User profile DP & Details */}
          <div className="flex items-center gap-3 mt-4 mb-2">
            {adminUser?.profilePic ? (
              <img src={adminUser.profilePic} className="w-10 h-10 rounded-full object-cover border border-emerald-500/20" alt="Admin Profile Pic" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {adminUser?.username?.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-[10px] text-[var(--color-text-secondary)]">Signed in as</p>
              <p className="text-sm font-bold text-white leading-tight truncate">{adminUser?.username}</p>
            </div>
          </div>

          {/* Back to Portfolio CTA */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 rounded-xl text-xs font-semibold transition-all shadow-[0_0_10px_rgba(16,185,129,0.05)] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Back to Portfolio
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'stats' 
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]' 
                : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-hover)]'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'projects' 
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]' 
                : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-hover)]'
            }`}
          >
            <FolderGit2 className="w-5 h-5" />
            Manage Projects
          </button>
          
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${
              activeTab === 'messages' 
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]' 
                : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-hover)]'
            }`}
          >
            <Mail className="w-5 h-5" />
            Messages
            {messages.filter(m => !m.read).length > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {messages.filter(m => !m.read).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'settings' 
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]' 
                : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-bg-surface-hover)]'
            }`}
          >
            <Settings className="w-5 h-5" />
            Profile Settings
          </button>
        </nav>

        <div className="p-4 border-t border-[var(--color-border-subtle)] mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main administrative views */}
      <main className="flex-grow p-10 overflow-y-auto max-h-screen">
        
        {/* TAB 1: ANALYTICS & STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Visitor Analytics</h2>
                <p className="text-[var(--color-text-secondary)] mt-1">Real-time statistics of your portfolio traffic</p>
              </div>
              <button 
                onClick={() => fetchStats(token)}
                disabled={statsLoading}
                className="p-2.5 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-text-secondary)] hover:text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${statsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {statsLoading && !stats ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : stats ? (
              <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="card p-6 shadow-md border-emerald-500/5">
                    <p className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase">Total Pageviews</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{stats.totalViews}</h3>
                    <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Tracked
                    </div>
                  </div>
                  <div className="card p-6 shadow-md border-emerald-500/5">
                    <p className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase">Unique Visitors</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{stats.uniqueVisitors}</h3>
                    <p className="text-[var(--color-text-secondary)] text-[10px] mt-2">Aggregated by unique IP</p>
                  </div>
                  <div className="card p-6 shadow-md border-emerald-500/5">
                    <p className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase">Total Projects</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{projects.length || '...'}</h3>
                    <p className="text-emerald-400 text-xs mt-2 hover:underline cursor-pointer" onClick={() => setActiveTab('projects')}>Manage items →</p>
                  </div>
                  <div className="card p-6 shadow-md border-emerald-500/5">
                    <p className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-wider uppercase">Unread Inquiries</p>
                    <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">
                      {messages.filter(m => !m.read).length}
                    </h3>
                    <p className="text-emerald-400 text-xs mt-2 hover:underline cursor-pointer" onClick={() => setActiveTab('messages')}>View messages →</p>
                  </div>
                </div>

                {/* Graphics/Stats charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Traffic Daily chart */}
                  <div className="card p-6 lg:col-span-2 space-y-6">
                    <h4 className="font-bold text-white text-base">Traffic Trends (Last 7 Days)</h4>
                    <div className="h-64 flex items-end gap-4 pt-4 border-b border-[var(--color-border-subtle)] pb-2">
                      {stats.viewsByDay && stats.viewsByDay.length > 0 ? (
                        stats.viewsByDay.map((day, idx) => {
                          const maxCount = Math.max(...stats.viewsByDay.map(d => d.count), 1);
                          const barHeight = (day.count / maxCount) * 100;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                              <span className="text-[10px] text-emerald-400 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                {day.count}
                              </span>
                              <div 
                                style={{ height: `${barHeight}%` }} 
                                className="w-full bg-emerald-500/20 hover:bg-emerald-500/60 border border-emerald-500/30 group-hover:border-emerald-500 rounded-t-lg transition-all duration-500 min-h-[4px]"
                              ></div>
                              <span className="text-[9px] text-[var(--color-text-secondary)] font-mono shrink-0">
                                {day._id.substring(5)}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)] text-sm">
                          No daily data logged yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Device Analytics */}
                  <div className="card p-6 space-y-6">
                    <h4 className="font-bold text-white text-base">Devices & Browsers</h4>
                    
                    {/* Device distribution */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Device Types</h5>
                      <div className="space-y-3">
                        {stats.deviceStats.map((device, idx) => {
                          const percentage = stats.totalViews > 0 ? Math.round((device.count / stats.totalViews) * 100) : 0;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs font-medium">
                                <span className="text-white flex items-center gap-1.5">
                                  <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                                  {device._id}
                                </span>
                                <span className="text-[var(--color-text-secondary)] font-mono">{device.count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-[var(--color-bg-base)] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Browser distribution */}
                    <div className="space-y-4 pt-4 border-t border-[var(--color-border-subtle)]">
                      <h5 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Top Browsers</h5>
                      <div className="space-y-3">
                        {stats.browserStats.slice(0, 4).map((browser, idx) => {
                          const percentage = stats.totalViews > 0 ? Math.round((browser.count / stats.totalViews) * 100) : 0;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs font-medium">
                                <span className="text-white flex items-center gap-1.5">
                                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                                  {browser._id}
                                </span>
                                <span className="text-[var(--color-text-secondary)] font-mono">{browser.count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-[var(--color-bg-base)] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Recent Activity Logs */}
                <div className="card overflow-hidden">
                  <div className="p-6 border-b border-[var(--color-border-subtle)]">
                    <h4 className="font-bold text-white text-base">Recent Visitor Traffic</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/30 text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">
                          <th className="p-4 pl-6">IP Address</th>
                          <th className="p-4">OS / Browser</th>
                          <th className="p-4">Referrer</th>
                          <th className="p-4">Path</th>
                          <th className="p-4 pr-6">Visited At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border-subtle)]">
                        {stats.recentActivity && stats.recentActivity.length > 0 ? (
                          stats.recentActivity.map((log) => (
                            <tr key={log._id} className="hover:bg-[var(--color-bg-surface-hover)]/30 transition-colors">
                              <td className="p-4 pl-6 font-mono text-xs text-white">{log.ip}</td>
                              <td className="p-4 text-xs">
                                <span className="px-2 py-1 bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded text-[var(--color-text-primary)] font-medium mr-2 font-mono">
                                  {log.os}
                                </span>
                                <span className="text-[var(--color-text-secondary)] font-mono">{log.browser}</span>
                              </td>
                              <td className="p-4 text-xs text-[var(--color-text-secondary)] max-w-xs truncate font-mono">
                                {log.referrer}
                              </td>
                              <td className="p-4 text-xs font-mono font-semibold text-emerald-400">{log.path}</td>
                              <td className="p-4 pr-6 text-xs text-[var(--color-text-secondary)] font-mono">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-[var(--color-text-secondary)]">No visitor activity logs found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="card p-8 text-center text-[var(--color-text-secondary)]">
                <ShieldAlert className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                Failed to fetch analytics statistics. Ensure backend is running.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Manage Projects</h2>
                <p className="text-[var(--color-text-secondary)] mt-1">Add, update, or remove portfolio items</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Project
              </button>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project._id} className="card flex flex-col h-full hover:border-[var(--color-border-subtle)]">
                    {project.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden bg-[var(--color-bg-base)]">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mb-4 flex-grow line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-[var(--color-bg-base)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] rounded font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)] mt-auto">
                        <div className="flex gap-2">
                          {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--color-bg-base)] text-[var(--color-text-secondary)] hover:text-white border border-[var(--color-border-subtle)] rounded-lg">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--color-bg-base)] text-[var(--color-text-secondary)] hover:text-white border border-[var(--color-border-subtle)] rounded-lg">
                              <FaGithub className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                            title="Edit project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <div className="col-span-full card p-12 text-center text-[var(--color-text-secondary)] space-y-4">
                    <FolderGit2 className="w-12 h-12 text-emerald-500/40 mx-auto" />
                    <h4 className="font-bold text-white text-lg">No Projects Found</h4>
                    <p className="text-sm">Click "Add Project" to upload your first portfolio work!</p>
                  </div>
                )}
              </div>
            )}

            {/* Modal Dialog for Add/Edit Project */}
            {projectModalOpen && (
              <div className="fixed inset-0 z-50 bg-[var(--color-bg-base)]/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl overflow-hidden" data-aos="zoom-in" data-aos-duration="300">
                  <div className="px-6 py-4 border-b border-[var(--color-border-subtle)] flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      {editingProjectId ? 'Update Portfolio Card' : 'Add New Portfolio Project'}
                    </h3>
                    <button 
                      onClick={() => setProjectModalOpen(false)}
                      className="text-[var(--color-text-secondary)] hover:text-white text-2xl font-bold font-mono"
                    >
                      &times;
                    </button>
                  </div>

                  {projectError && (
                    <div className="mx-6 mt-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
                      {projectError}
                    </div>
                  )}

                  <form onSubmit={handleProjectSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                          className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="e.g. My Awesome Startup"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white">Technologies (Comma separated)</label>
                        <input
                          type="text"
                          required
                          value={projectForm.technologies}
                          onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                          className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="React, Node.js, Tailwind CSS"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white">Description</label>
                      <textarea
                        required
                        rows="4"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                        className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                        placeholder="Write a summary about this project..."
                      ></textarea>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white">Image URL</label>
                      <input
                        type="url"
                        value={projectForm.imageUrl}
                        onChange={(e) => setProjectForm({...projectForm, imageUrl: e.target.value})}
                        className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white">Live Demo Link</label>
                        <input
                          type="url"
                          value={projectForm.liveLink}
                          onChange={(e) => setProjectForm({...projectForm, liveLink: e.target.value})}
                          className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white">GitHub Repository Link</label>
                        <input
                          type="url"
                          value={projectForm.githubLink}
                          onChange={(e) => setProjectForm({...projectForm, githubLink: e.target.value})}
                          className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-[var(--color-border-subtle)] justify-end">
                      <button
                        type="button"
                        onClick={() => setProjectModalOpen(false)}
                        className="px-5 py-2.5 bg-transparent border border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-surface-hover)] rounded-xl font-semibold transition-all text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all"
                      >
                        {editingProjectId ? 'Save Changes' : 'Upload Card'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT FORM INQUIRIES */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Contact Messages</h2>
              <p className="text-[var(--color-text-secondary)] mt-1">Review submission messages from your portfolio contact form</p>
            </div>

            {messagesLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/30 text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">
                        <th className="p-4 pl-6">Status</th>
                        <th className="p-4">Sender Info</th>
                        <th className="p-4">Message Summary</th>
                        <th className="p-4">Received Date</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-subtle)]">
                      {messages.map((msg) => (
                        <tr key={msg._id} className={`hover:bg-[var(--color-bg-surface-hover)]/20 transition-colors ${!msg.read ? 'bg-emerald-500/[0.02]' : ''}`}>
                          <td className="p-4 pl-6">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                              msg.read 
                                ? 'bg-[var(--color-bg-base)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]' 
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${msg.read ? 'bg-slate-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                              {msg.read ? 'Read' : 'New'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-white font-bold">{msg.name}</div>
                            <div className="text-xs text-[var(--color-text-secondary)] font-mono">{msg.email}</div>
                          </td>
                          <td className="p-4 text-[var(--color-text-secondary)] max-w-md">
                            <p className={`line-clamp-2 leading-relaxed ${!msg.read ? 'text-white' : ''}`}>
                              {msg.message}
                            </p>
                          </td>
                          <td className="p-4 text-xs font-mono text-[var(--color-text-secondary)]">
                            {new Date(msg.createdAt).toLocaleString()}
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2 shrink-0">
                            <button
                              onClick={() => handleMarkAsRead(msg._id, msg.read)}
                              className={`p-2 rounded-lg transition-colors border ${
                                msg.read
                                  ? 'bg-[var(--color-bg-base)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-white'
                                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                              }`}
                              title={msg.read ? 'Mark as unread' : 'Mark as read'}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-transparent rounded-lg transition-colors"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {messages.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-12 text-center text-[var(--color-text-secondary)] space-y-4">
                            <Mail className="w-12 h-12 text-emerald-500/40 mx-auto" />
                            <h4 className="font-bold text-white text-base">Inbox is empty</h4>
                            <p className="text-xs">No client submissions recorded yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS & DETAILS (PROFILE FORMS) */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-xl">
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Profile</h2>
              <p className="text-[var(--color-text-secondary)] mt-1">Manage display details, credentials, and settings</p>
            </div>

            {profileError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm flex items-center gap-2">
                <Check className="w-5 h-5 shrink-0 text-emerald-400" />
                {profileSuccess}
              </div>
            )}

            <div className="card p-8 space-y-8">
              {/* Header profile info */}
              <div className="flex items-center gap-4">
                {adminUser?.profilePic ? (
                  <img src={adminUser.profilePic} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/20" alt="DP Preview" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
                    {adminUser?.username?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    {adminUser?.username}
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      Developer
                    </span>
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)] font-mono mt-0.5">{adminUser?.email}</p>
                </div>
              </div>

              {/* Settings Form */}
              <form onSubmit={handleProfileUpdate} className="space-y-5 border-t border-[var(--color-border-subtle)] pt-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Username</label>
                  <input
                    type="text"
                    required
                    value={updateUsername}
                    onChange={(e) => setUpdateUsername(e.target.value)}
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Username"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Email Address</label>
                  <input
                    type="email"
                    required
                    value={updateEmail}
                    onChange={(e) => setUpdateEmail(e.target.value)}
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Email"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Display Picture (DP) URL</label>
                  <input
                    type="url"
                    value={profilePicUrl}
                    onChange={(e) => setProfilePicUrl(e.target.value)}
                    className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="https://images.unsplash.com/your-dp.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white">New Password (Optional)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-[var(--color-border-subtle)]">
                  <button
                    type="submit"
                    disabled={profileUpdating}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {profileUpdating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
