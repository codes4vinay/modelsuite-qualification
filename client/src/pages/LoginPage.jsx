import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Logo = () => (
  <img src="/modelsuite-talents.png" alt="ModelSuite Talents Logo" className="w-80 h-auto object-contain mx-auto block hover:scale-105 transition-transform duration-300" />
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a2 2 0 002.8 2.8" />
    <path d="M9.5 5.3A9.8 9.8 0 0112 5c6.5 0 10 7 10 7a17.8 17.8 0 01-3.1 4.1" />
    <path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 7 10 7a9.8 9.8 0 004.1-.9" />
  </svg>
);

const inputCls = 'w-full bg-bg-input border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary outline-none placeholder:text-[#4e4a6e] focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all duration-200 font-sans hover:border-border-light';
const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.6px] text-text-muted group-focus-within:text-primary transition-colors duration-200';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data);
      data.role === 'Admin' ? navigate('/admin/dashboard') : navigate('/talent/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[480px_1fr]">
      {/* ── Left: Form panel ── */}
      <div className="relative flex flex-col justify-center px-14 py-16 bg-bg-card border-r border-border overflow-hidden sidebar-glow animate-fade-in">
        <div className="mb-10 relative z-10 animate-fade-slide" style={{ filter: 'drop-shadow(0 4px 16px rgba(59,130,246,0.3))', animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Logo id="login-grad" />
        </div>

        <div className="mb-10 text-center relative z-10 animate-fade-slide" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
          <h1 className="text-[26px] font-bold tracking-tight text-text-primary mb-1.5">Assessment Portal</h1>
          <p className="text-sm text-text-muted">Sign in to view assignments</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10 animate-fade-slide" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="flex flex-col gap-2 group">
            <label className={labelCls} htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@company.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
          </div>

          <div className="flex flex-col gap-2 group">
            <label className={labelCls} htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required className={`${inputCls} pr-12`} />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors duration-200 p-1 rounded-md">
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <button type="submit"
            className="mt-1.5 w-full py-3.5 rounded-[10px] text-[15px] font-semibold text-white cursor-pointer btn-gradient border-none hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
            Sign In
          </button>
        </form>

        <p className="mt-7 text-sm text-text-muted text-center relative z-10 animate-fade-slide" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
          New candidate?{' '}
          <Link to="/register" className="text-primary font-medium hover:text-white hover:underline transition-all duration-200">
            Setup your profile
          </Link>
        </p>
      </div>

      {/* ── Right: Visual panel ── */}
      <div className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden p-16 animate-fade-in min-h-screen"
        style={{ background: 'linear-gradient(140deg, #050505 0%, #111111 50%, #000000 100%)', animationDelay: '0.1s', animationFillMode: 'both' }}>
        
        {/* Top Right Info Icon */}
        <div className="absolute top-12 right-12 group z-50">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-all duration-300 cursor-help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          
          {/* Tooltip Popup */}
          <div className="absolute right-0 top-14 w-[340px] p-6 rounded-2xl bg-[#0D0D0D]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] opacity-0 translate-y-3 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
            <h3 className="text-white font-bold text-[15px] mb-4 font-display">Intern Selection Flow</h3>
            <ol className="flex flex-col gap-4 relative">
              {/* Vertical line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-white/10 rounded-full"></div>
              
              <li className="flex items-start gap-4 relative opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-100">
                <div className="w-[20px] h-[20px] rounded-full bg-[#10B981] flex-shrink-0 mt-0.5 border-[3px] border-[#0D0D0D] relative z-10 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse"></div>
                <div>
                  <p className="text-[13px] font-semibold text-white">1. Start Working</p>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">Review your pre-assigned issues and begin development.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 relative opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-200">
                <div className="w-[20px] h-[20px] rounded-full bg-[#3B82F6] flex-shrink-0 mt-0.5 border-[3px] border-[#0D0D0D] relative z-10 shadow-[0_0_12px_rgba(59,130,246,0.5)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div>
                  <p className="text-[13px] font-semibold text-white">2. Resolve & Push</p>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">Fix the issue in code and submit a Pull Request.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 relative opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-300">
                <div className="w-[20px] h-[20px] rounded-full bg-[#8B5CF6] flex-shrink-0 mt-0.5 border-[3px] border-[#0D0D0D] relative z-10 shadow-[0_0_12px_rgba(139,92,246,0.5)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <div>
                  <p className="text-[13px] font-semibold text-white">3. Core Review</p>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">The core team reviews your PR to make a hiring decision.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="relative z-10 max-w-[440px] w-full">
          <h2 className="text-[42px] font-extrabold leading-[1.15] tracking-tight gradient-text mb-5 animate-slide-left" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            Intern Assessment<br />Pipeline.
          </h2>
          <p className="text-base text-text-muted leading-relaxed mb-12 animate-slide-left" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
            Resolve assigned issues and submit tasks via PR for core team review in our selection process.
          </p>
          <div className="flex gap-10">
            {[{ num: 'PR', label: 'Submission Format', delay: '0.4s' }, { num: 'Core', label: 'Team Review', delay: '0.45s' }, { num: '100%', label: 'Skill Focus', delay: '0.5s' }]
              .map(({ num, label, delay }) => (
                <div key={label} className="flex flex-col gap-1 animate-fade-slide hover:-translate-y-1 transition-transform duration-300 cursor-default" style={{ animationDelay: delay, animationFillMode: 'both' }}>
                  <span className="text-[28px] font-bold text-text-primary tracking-tight">{num}</span>
                  <span className="text-[11px] text-text-muted uppercase tracking-[0.8px] font-medium">{label}</span>
                </div>
              ))}
          </div>
        </div>
        
        {/* Full-width Marquee Ticker */}
        <div className="absolute bottom-16 left-0 w-full marquee-container animate-fade-slide" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="animate-marquee gap-16">
            {['Production Grade System', 'Scalable Apps', 'Streamline Development', 'Enterprise Security', 'Cloud Native', 'High Performance', 'Production Grade System', 'Scalable Apps', 'Streamline Development', 'Enterprise Security', 'Cloud Native', 'High Performance'].map((word, i) => (
              <span key={i} className="text-[13px] md:text-[15px] font-bold uppercase tracking-[0.25em] text-text-faint/80 whitespace-nowrap">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
