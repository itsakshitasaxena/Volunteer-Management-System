import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Settings, UserPlus } from 'lucide-react';
import { authService } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'VOLUNTEER',
    skills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData);
      await authService.login(formData.email, formData.password);
      if (formData.role === 'VOLUNTEER') {
        navigate('/dashboard/volunteer');
      } else {
        navigate('/dashboard/organizer');
      }
    } catch (err) {
      setError('Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="glass-card" style={{ maxWidth: '480px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Join ImpactHub</h1>
          <p style={{ color: 'var(--text-muted)' }}>Start your journey of making an impact</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
             <button 
                type="button" 
                className={formData.role === 'VOLUNTEER' ? 'btn-primary' : 'btn-secondary'} 
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setFormData({...formData, role: 'VOLUNTEER'})}
             >
                Volunteer
             </button>
             <button 
                type="button" 
                className={formData.role === 'ORGANIZER' ? 'btn-primary' : 'btn-secondary'} 
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setFormData({...formData, role: 'ORGANIZER'})}
             >
                Organizer
             </button>
        </div>
        
        {error && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            border: '1px solid var(--danger)', 
            color: 'var(--danger)', 
            padding: '12px', 
            borderRadius: '12px', 
            marginBottom: '24px', 
            textAlign: 'center', 
            fontSize: '0.9rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Full Name" 
              style={{ paddingLeft: '48px' }}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email Address" 
              style={{ paddingLeft: '48px' }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="password" 
              className="input-field" 
              placeholder="Password" 
              style={{ paddingLeft: '48px' }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {formData.role === 'VOLUNTEER' && (
            <div style={{ position: 'relative' }}>
              <Settings style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }} size={20} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Skills (e.g. First Aid, Driving)" 
                style={{ paddingLeft: '48px' }}
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>
          )}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
            {loading ? 'Creating Account...' : (
              <>
                <UserPlus size={20} /> Sign Up
              </>
            )}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--surface-border)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
