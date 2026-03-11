'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FormMode = 'signin' | 'signup' | 'forgot';

/** Maps raw Supabase/API error messages to friendly user-facing messages */
function friendlyError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes('invalid login') || lower.includes('invalid credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email address has not been confirmed. Please check your inbox.';
  }
  if (lower.includes('user not found') || lower.includes('no user') || lower.includes('no account')) {
    return 'No account found with that email address.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [mode, setMode] = useState<FormMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Forgot-password specific fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Inline validation helpers
  const newPasswordLongEnough = newPassword === '' || newPassword.length >= 6;
  const passwordsMatch = confirmPassword === '' || newPassword === confirmPassword;

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const switchMode = (newMode: FormMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    setNewPassword('');
    setConfirmPassword('');
  };

  // ─── Sign In ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(friendlyError(error.message));
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  // ─── Sign Up ────────────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(friendlyError(data.error || 'Failed to create account'));
        setLoading(false);
        return;
      }

      // Auto sign-in after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setSuccess('Account created successfully! Please sign in.');
        setMode('signin');
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // ─── Forgot Password (direct reset — no email link) ─────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(friendlyError(data.error || 'Failed to reset password.'));
        setLoading(false);
        return;
      }

      setSuccess('Password updated! You can now sign in with your new password.');
      setNewPassword('');
      setConfirmPassword('');
      // Switch to sign-in after a short delay
      setTimeout(() => {
        setMode('signin');
        setSuccess(null);
      }, 3000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create your account';
      case 'forgot': return 'Reset your password';
      default: return 'Welcome to Haylo';
    }
  };

  const getSubmitHandler = () => {
    switch (mode) {
      case 'signup': return handleSignUp;
      case 'forgot': return handleResetPassword;
      default: return handleSignIn;
    }
  };

  const getButtonText = () => {
    if (loading) {
      switch (mode) {
        case 'signup': return 'Creating account…';
        case 'forgot': return 'Updating password…';
        default: return 'Signing in…';
      }
    }
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'forgot': return 'Update Password';
      default: return 'Sign In';
    }
  };

  const isButtonDisabled =
    loading ||
    (mode === 'forgot' && (!newPasswordLongEnough || !passwordsMatch || newPassword === '' || confirmPassword === ''));

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <img src="/haylo-logo.jpg" alt="Haylo Logo" className="h-10 w-auto mix-blend-multiply" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {getTitle()}
        </h2>
        {mode === 'forgot' && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and choose a new password
          </p>
        )}
        {mode !== 'forgot' && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/" className="font-medium text-purple-600 hover:text-purple-500">
              return to home
            </Link>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-8 shadow-xl sm:rounded-2xl border border-gray-100">

          {/* ── Error banner ── */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
              </svg>
              <p className="text-red-700 text-sm leading-snug">{error}</p>
            </div>
          )}

          {/* ── Success banner ── */}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2.5">
              <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 text-sm leading-snug">{success}</p>
            </div>
          )}

          <form onSubmit={getSubmitHandler()} className="flex flex-col gap-4">

            {/* ── Email (all modes) ── */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* ── Password (signin / signup only) ── */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                  placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
                />
              </div>
            )}

            {/* ── New Password fields (forgot mode only) ── */}
            {mode === 'forgot' && (
              <>
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
                      className={`w-full px-4 py-2.5 pr-11 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm ${!newPasswordLongEnough ? 'border-amber-300 bg-amber-50/30' : 'border-gray-300'
                        }`}
                      placeholder="Enter a new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88 6.59 6.59m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {!newPasswordLongEnough && (
                    <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
                      </svg>
                      Minimum 6 characters required
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                      className={`w-full px-4 py-2.5 pr-11 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm ${!passwordsMatch
                          ? 'border-red-300 bg-red-50/30'
                          : confirmPassword.length > 0 && passwordsMatch
                            ? 'border-green-300 bg-green-50/30'
                            : 'border-gray-300'
                        }`}
                      placeholder="Re-enter your new password"
                    />
                    {/* Show/hide toggle */}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88 6.59 6.59m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    {/* Match check icon */}
                    {confirmPassword.length > 0 && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        {passwordsMatch ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Inline hints */}
                  {!passwordsMatch && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Passwords do not match
                    </p>
                  )}
                  {confirmPassword.length > 0 && passwordsMatch && (
                    <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Passwords match
                    </p>
                  )}
                </div>
              </>
            )}

            {/* ── Submit button ── */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-sm hover:shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8H4z" />
                  </svg>
                  {getButtonText()}
                </span>
              ) : getButtonText()}
            </button>
          </form>

          {/* ── Bottom links ── */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => switchMode('signup')}
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                  Sign Up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('signin')}
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                  Sign In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button type="button" onClick={() => switchMode('signin')}
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
