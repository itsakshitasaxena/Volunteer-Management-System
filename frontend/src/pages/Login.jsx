import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authService.login(email, password);
      if (user.role === 'VOLUNTEER') {
        navigate('/dashboard/volunteer');
      } else {
        navigate('/dashboard/organizer');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="glass-card" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>ImpactHub</h1>
          <p style={{ color: 'var(--text-muted)' }}>Empowering Change Through Service</p>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', textAlign: 'left', color: 'var(--text-main)', background: 'none', WebkitTextFillColor: 'initial' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>Enter your credentials to access your dashboard.</p>
        
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

        <form onSubmit={handleLogin}>
          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', top: '14px', left: '16px', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email Address" 
              style={{ paddingLeft: '48px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--surface-border)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            New to ImpactHub? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
