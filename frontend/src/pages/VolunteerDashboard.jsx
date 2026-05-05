import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, CheckCircle, Award, LogOut, Compass, Briefcase, User as UserIcon } from 'lucide-react';
import { authService, taskService, applicationService, userService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function VolunteerDashboard() {
  const [activeTab, setActiveTab] = useState('discover');
  const [user, setUser] = useState(authService.getCurrentUser());
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'discover') {
        let recommended = await taskService.getRecommendedTasks(user.id);
        if (!recommended || recommended.length === 0) {
          recommended = await taskService.getAllTasks();
        }
        setTasks(recommended);
      } else if (activeTab === 'shifts') {
        const apps = await applicationService.getVolunteerApplications(user.id);
        setApplications(apps);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (taskId) => {
    try {
      await taskService.applyForTask(taskId, user.id);
      alert('Application submitted successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to apply. You might have already applied.');
    }
  };

  const handleCheckIn = async (appId) => {
    try {
      await applicationService.checkIn(appId);
      alert('Check-in successful! You earned XP!');
      
      // Fetch REAL updated user data from backend
      const updatedUser = await userService.getUserProfile(user.id);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      fetchData();
    } catch (err) {
      alert('Check-in failed.');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>ImpactHub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome back, <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{user?.name}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '10px' }}>
              <Award color="var(--success)" size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Contribution</p>
              <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{user?.hoursWorked || 0} Hours</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ width: '48px', height: '48px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px' }}>
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '40px', 
        padding: '6px', 
        background: 'rgba(15, 23, 42, 0.4)', 
        borderRadius: '16px',
        width: 'fit-content'
      }}>
        <button 
          className={activeTab === 'discover' ? 'btn-primary' : 'btn-secondary'}
          style={{ border: 'none', boxShadow: activeTab === 'discover' ? undefined : 'none' }}
          onClick={() => setActiveTab('discover')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} /> Discover
          </div>
        </button>
        <button 
          className={activeTab === 'shifts' ? 'btn-primary' : 'btn-secondary'}
          style={{ border: 'none', boxShadow: activeTab === 'shifts' ? undefined : 'none' }}
          onClick={() => setActiveTab('shifts')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} /> My Shifts
          </div>
        </button>
        <button 
          className={activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}
          style={{ border: 'none', boxShadow: activeTab === 'profile' ? undefined : 'none' }}
          onClick={() => setActiveTab('profile')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserIcon size={18} /> Profile
          </div>
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="flex-center" style={{ marginBottom: '16px' }}>
             <div style={{ width: '40px', height: '40px', border: '3px solid var(--surface-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Fetching latest opportunities...</p>
        </div>
      )}

      {activeTab === 'discover' && !loading && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <Search style={{ position: 'absolute', top: '16px', left: '20px', color: 'var(--text-muted)' }} size={22} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search tasks by skill, location, or cause..." 
              style={{ paddingLeft: '56px', height: '56px', marginBottom: '0' }}
            />
          </div>

          <h3 style={{ marginBottom: '24px', fontSize: '1.5rem', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>Recommended for you</h3>
          <div className="grid-cols-2">
            {tasks.map(task => (
              <div key={task.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span className="badge" style={{ color: 'var(--primary)', borderColor: 'rgba(139, 92, 246, 0.3)' }}>{task.event?.name}</span>
                  <span className="badge">{task.requiredSkills}</span>
                </div>
                <h3 style={{ marginBottom: '12px', fontSize: '1.3rem', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>{task.title}</h3>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <MapPin size={18} /> {task.location || 'Various Locations'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                    <Clock size={18} /> {task.hours} Hours
                  </div>
                </div>
                <button onClick={() => handleApply(task.id)} className="btn-primary" style={{ width: '100%' }}>Apply Now</button>
              </div>
            ))}
          </div>
          {tasks.length === 0 && <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>No tasks found matching your profile yet.</div>}
        </div>
      )}

      {activeTab === 'shifts' && !loading && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1.5rem', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>My Applications & Shifts</h3>
          {applications.map(app => (
            <div key={app.id} className="glass-card" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ marginBottom: '6px', fontSize: '1.1rem', color: 'var(--text-main)', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>{app.task.title}</h4>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status:</span>
                  <span className="badge" style={{ 
                    color: app.status === 'APPROVED' ? 'var(--success)' : (app.status === 'COMPLETED' ? 'var(--accent)' : 'var(--primary)'),
                    borderColor: 'transparent',
                    background: 'rgba(255,255,255,0.05)'
                  }}>
                    {app.status}
                  </span>
                </div>
              </div>
              {app.status === 'APPROVED' && (
                <button onClick={() => handleCheckIn(app.id)} className="btn-secondary" style={{ color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                  <CheckCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Check In
                </button>
              )}
            </div>
          ))}
          {applications.length === 0 && <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>You haven't applied for any tasks yet. Explore the "Discover" tab!</div>}
        </div>
      )}

      {activeTab === 'profile' && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '35%', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              margin: '0 auto 24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)'
            }}>
              {user?.name?.substring(0, 2).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{user?.name}</h2>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
              <span className="badge" style={{ background: 'var(--primary-glow)', color: 'white', borderColor: 'transparent' }}>Level {user?.level || 1} Volunteer</span>
              <span className="badge">Skills: {user?.skills}</span>
            </div>

            <div style={{ maxWidth: '400px', margin: '0 auto 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>XP Progress</span>
                <span>{user?.xp % 100}/100 XP to next level</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${user?.xp % 100}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--accent))', transition: 'width 1s ease-out' }}></div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', padding: '32px 0', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)', marginBottom: '40px' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Hours Completed</p>
                <h3 style={{ fontSize: '2.5rem', textAlign: 'center', background: 'none', WebkitTextFillColor: 'initial' }}>{user?.hoursWorked || 0}</h3>
              </div>
              <div style={{ width: '1px', background: 'var(--surface-border)' }}></div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>XP Gained</p>
                <h3 style={{ fontSize: '2.5rem', textAlign: 'center', background: 'none', WebkitTextFillColor: 'initial' }}>{user?.xp || 0}</h3>
              </div>
            </div>
            
            <h3 style={{ marginBottom: '24px', fontSize: '1.5rem', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>My Badges</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {user?.badges ? user.badges.split(',').map(badge => (
                <div key={badge} className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', animation: 'float 3s ease-in-out infinite' }}>
                  <Award color="var(--primary)" size={24} style={{ marginBottom: '8px' }} />
                  <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{badge}</p>
                </div>
              )) : <p style={{ color: 'var(--text-muted)', width: '100%', textAlign: 'center' }}>Complete tasks to earn exclusive badges!</p>}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
