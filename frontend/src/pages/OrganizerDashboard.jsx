import React, { useState, useEffect } from 'react';
import { Plus, Users, BarChart, LogOut, Check, X, Calendar, MapPin, ClipboardList } from 'lucide-react';
import { authService, eventService, applicationService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [user] = useState(authService.getCurrentUser());
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', location: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', requiredSkills: '', hours: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ORGANIZER') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'events') {
        const data = await eventService.getOrganizerEvents(user.id);
        setEvents(data);
      } else if (activeTab === 'roster') {
        const data = await eventService.getPendingApplications();
        setApplications(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await eventService.createEvent({ ...newEvent, organizer: { id: user.id } });
      setNewEvent({ name: '', description: '', location: '' });
      setShowNewEventModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await eventService.createTask(selectedEventId, newTask);
      setNewTask({ title: '', description: '', requiredSkills: '', hours: 1 });
      setShowNewTaskModal(false);
      alert('Task created successfully! It is now visible to volunteers.');
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      await applicationService.updateStatus(appId, status);
      fetchData();
    } catch (err) {
      alert('Failed to update status');
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>ImpactHub Admin</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Managing as <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{user?.name}</span></p>
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={{ width: '48px', height: '48px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px' }}>
          <LogOut size={22} />
        </button>
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
          className={activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}
          style={{ border: 'none', boxShadow: activeTab === 'events' ? undefined : 'none' }}
          onClick={() => setActiveTab('events')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} /> Manage Events
          </div>
        </button>
        <button 
          className={activeTab === 'roster' ? 'btn-primary' : 'btn-secondary'}
          style={{ border: 'none', boxShadow: activeTab === 'roster' ? undefined : 'none' }}
          onClick={() => setActiveTab('roster')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={18} /> Review Applications
          </div>
        </button>
      </div>

      {activeTab === 'events' && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>Active Events</h3>
            <button className="btn-primary" onClick={() => setShowNewEventModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus size={20} /> Create New Event
            </button>
          </div>
          
          {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading events...</p>}
          
          <div className="grid-cols-2">
            {events.map(event => (
              <div key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.3rem', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>{event.name}</h3>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'transparent' }}>Active</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <MapPin size={18} /> {event.location}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '24px' }}>{event.description}</p>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setShowNewTaskModal(true);
                  }}
                >
                  <Plus size={16} /> Add Task to Event
                </button>
              </div>
            ))}
          </div>
          {events.length === 0 && !loading && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ color: 'var(--text-muted)' }}>No events created yet. Start by creating your first event!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'roster' && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <h3 style={{ marginBottom: '32px', fontSize: '1.5rem', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>Applications Roster</h3>
          {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading applications...</p>}
          {applications.map(app => (
            <div key={app.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: '14px', 
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: '700',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                }}>
                  {app.volunteer?.name?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ marginBottom: '6px', fontSize: '1.1rem', color: 'var(--text-main)', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>{app.volunteer?.name}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '6px' }}>Applied for: <span style={{ color: 'var(--text-main)' }}>{app.task?.title}</span></p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="badge" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>{app.volunteer?.skills}</span>
                    <span className="badge" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderColor: 'transparent' }}>{app.status}</span>
                  </div>
                </div>
              </div>
              {app.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleUpdateStatus(app.id, 'APPROVED')} className="btn-secondary" style={{ padding: '10px', borderColor: 'rgba(16, 185, 129, 0.3)', color: 'var(--success)' }}>
                    <Check size={20} />
                  </button>
                  <button onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="btn-secondary" style={{ padding: '10px', borderColor: 'rgba(244, 63, 94, 0.3)', color: 'var(--danger)' }}>
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {applications.length === 0 && !loading && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ color: 'var(--text-muted)' }}>No applications to review at the moment.</p>
            </div>
          )}
        </div>
      )}

      {showNewEventModal && (
        <div className="flex-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.85)', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-card" style={{ maxWidth: '460px', width: '100%', animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>Create New Event</h3>
            <form onSubmit={handleCreateEvent}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Event Title</p>
                <input 
                  className="input-field" 
                  placeholder="e.g. Annual Food Drive" 
                  value={newEvent.name} 
                  onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                  required 
                  style={{ marginBottom: '0' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Location</p>
                <input 
                  className="input-field" 
                  placeholder="e.g. City Central Park" 
                  value={newEvent.location} 
                  onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                  required 
                  style={{ marginBottom: '0' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Description</p>
                <textarea 
                  className="input-field" 
                  placeholder="What is this event about?" 
                  value={newEvent.description} 
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  rows={3} 
                  style={{ marginBottom: '0', resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Event</button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowNewEventModal(false)}>Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewTaskModal && (
        <div className="flex-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.85)', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div className="glass-card" style={{ maxWidth: '460px', width: '100%', animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'left', background: 'none', WebkitTextFillColor: 'initial' }}>Add Task to Event</h3>
            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Task Title</p>
                <input 
                  className="input-field" 
                  placeholder="e.g. Traffic Control" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  required 
                  style={{ marginBottom: '0' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Required Skills</p>
                <input 
                  className="input-field" 
                  placeholder="e.g. First Aid, Communication" 
                  value={newTask.requiredSkills} 
                  onChange={e => setNewTask({...newTask, required_skills: e.target.value, requiredSkills: e.target.value})}
                  style={{ marginBottom: '0' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Hours</p>
                <input 
                  type="number"
                  className="input-field" 
                  placeholder="Estimated hours" 
                  value={newTask.hours} 
                  onChange={e => setNewTask({...newTask, hours: parseInt(e.target.value)})}
                  required 
                  style={{ marginBottom: '0' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>Task Description</p>
                <textarea 
                  className="input-field" 
                  placeholder="What will the volunteer do?" 
                  value={newTask.description} 
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  rows={2} 
                  style={{ marginBottom: '0', resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Task</button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowNewTaskModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
