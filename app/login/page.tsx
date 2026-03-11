'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type FormMode = 'signin' | 'signup' | 'forgot';

// How long (seconds) the user must wait before requesting another reset email
// Supabase default SMTP allows ~2-3 emails/hour per address, so we use 5 min
const RESET_COOLDOWN_SECONDS = 300;

/** Maps raw Supabase/API error messages to friendly user-facing messages */
function friendlyError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes('rate limit') || lower.includes('too many')) {
    return 'A reset link was already sent to this email. Please check your inbox and spam folder. If you still need a new link, please wait about an hour before trying again.';
  }
  if (lower.includes('invalid login') || lower.includes('invalid credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email address has not been confirmed. Please check your inbox.';
  }
  if (lower.includes('user not found') || lower.includes('no user')) {
    return 'No account found with that email address.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  // Fallback: return as-is but capitalise first letter
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

  // Cooldown timer for the forgot-password form
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  /** Starts a countdown timer after a reset email is sent */
  const startCooldown = () => {
    setCooldown(RESET_COOLDOWN_SECONDS);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const switchMode = (newMode: FormMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
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

      // Account created — sign them in automatically
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

  // ─── Forgot Password ────────────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (cooldown > 0) return; // Guard against double-submit during cooldown

    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(friendlyError(error.message));
    } else {
      setSuccess('Reset link sent! Please check your inbox (and spam folder).');
      startCooldown();
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
      case 'forgot': return handleForgotPassword;
      default: return handleSignIn;
    }
  };

  const getButtonText = () => {
    if (loading) {
      switch (mode) {
        case 'signup': return 'Creating account…';
        case 'forgot': return 'Sending reset link…';
        default: return 'Signing in…';
      }
    }
    if (mode === 'forgot' && cooldown > 0) {
      return `Resend in ${cooldown}s`;
    }
    switch (mode) {
      case 'signup': return 'Create Account';
      case 'forgot': return 'Send Reset Link';
      default: return 'Sign In';
    }
  };

  const isButtonDisabled = loading || (mode === 'forgot' && cooldown > 0);

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
            Enter your email and we&apos;ll send you a link to reset your password
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
            {/* Email */}
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

            {/* Password (signin / signup only) */}
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

            {/* Cooldown hint for forgot-password */}
            {mode === 'forgot' && cooldown > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
                <p className="text-amber-700 text-sm">
                  You can request another link in{' '}
                  <span className="font-semibold">
                    {cooldown >= 60 ? `${Math.ceil(cooldown / 60)}m ${cooldown % 60}s` : `${cooldown}s`}
                  </span>
                </p>
              </div>
            )}

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

          {/* Bottom links */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Sign Up
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
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
