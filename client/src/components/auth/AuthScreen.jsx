import React, { useState } from 'react';
import { Scissors, Mail, Lock, User, Store, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export function AuthScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salonName, setSalonName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      let endpoint = isSignUp ? '/auth/signup' : '/auth/login';
      const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
      const API_BASE = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

      const bodyData = isSignUp
        ? { name, email, password, salonName: salonName || 'Serene Salon & Studio' }
        : { email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store JWT token and user info
      localStorage.setItem('salon_jwt_token', data.token);
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message || 'Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setIsSignUp(false);
    setEmail('akshay@serenesalon.com');
    setPassword('salon123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1c30] via-[#162740] to-[#585990] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#8b8cc7]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#ceeac5]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 relative z-10 animate-fade-in">
        {/* Logo / Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#585990] to-[#8b8cc7] text-white flex items-center justify-center shadow-lg shadow-[#585990]/30 mb-3 border border-white/40">
            <Scissors className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0b1c30] tracking-tight">
            Salon Workspace
          </h1>
          <p className="text-xs text-[#46464f] mt-1 font-medium">
            {isSignUp
              ? 'Create your admin account to manage clients & revenue'
              : 'Log in to access your private salon dashboard'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#777680] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#585990] focus:bg-white rounded-xl text-xs font-semibold text-[#0b1c30] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Salon / Studio Name
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-[#777680] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Velvet Hair Studio"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#585990] focus:bg-white rounded-xl text-xs font-semibold text-[#0b1c30] outline-none transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#777680] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@salon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#585990] focus:bg-white rounded-xl text-xs font-semibold text-[#0b1c30] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777680] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9ff] border border-[#e2e8f0] focus:border-[#585990] focus:bg-white rounded-xl text-xs font-semibold text-[#0b1c30] outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#0b1c30] to-[#585990] hover:from-[#162740] hover:to-[#48497d] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Admin Account' : 'Log In to Salon'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login vs Signup */}
        <div className="mt-6 pt-5 border-t border-[#e2e8f0] text-center flex flex-col items-center gap-3">
          <p className="text-xs text-[#46464f]">
            {isSignUp ? 'Already have an admin account?' : "Don't have an admin account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="font-bold text-[#585990] hover:underline"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>

          {!isSignUp && (
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-[#46464f] hover:text-[#0b1c30] font-semibold flex items-center gap-1 bg-[#f8f9ff] px-3 py-1.5 rounded-lg border border-[#e2e8f0]"
            >
              <Sparkles className="w-3 h-3 text-[#585990]" />
              <span>Fill Demo Credentials (Akshay Kumar)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
