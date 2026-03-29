'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // Book a demo modal state
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ fullName: '', email: '', mobile: '', company: '', address: '' });
  const [demoStatus, setDemoStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Contact form state (footer "Get Started")
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const submitDemoForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoStatus('submitting');
    try {
      const res = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoForm)
      });
      if (res.ok) {
        setDemoStatus('success');
      } else {
        setDemoStatus('error');
      }
    } catch {
      setDemoStatus('error');
    }
  };

  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('submitting');
    try {
      const res = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: 'Contact Form', email: contactEmail, mobile: '', company: '', address: '', message: contactMessage })
      });
      if (res.ok) {
        setContactStatus('success');
        setContactEmail('');
        setContactMessage('');
      } else {
        setContactStatus('error');
      }
    } catch {
      setContactStatus('error');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(142, 108, 239, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(142, 108, 239, 0); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideRight { animation: slideRight 0.6s ease-out forwards; }
        .animate-pulseGlow { animation: pulseGlow 2s ease-in-out infinite; }

        .hero-gradient {
          background: linear-gradient(135deg, #f8f6ff 0%, #ede8ff 30%, #e0d6ff 50%, #f0ecff 70%, #ffffff 100%);
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(142, 108, 239, 0.15);
        }

        .benefit-card {
          background: linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%);
          transition: all 0.3s ease;
        }
        .benefit-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 35px rgba(142, 108, 239, 0.3);
        }

        .meet-section {
          background: linear-gradient(180deg, #f5ebe0 0%, #fae8d4 30%, #f5ebe0 100%);
        }

        .feature-icon-box {
          background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%);
          transition: all 0.3s ease;
        }
        .feature-icon-box:hover {
          transform: scale(1.05);
        }

        .stats-card {
          transition: all 0.3s ease;
        }
        .stats-card:hover {
          transform: translateY(-4px);
        }

        .footer-gradient {
          background: linear-gradient(180deg, #e9d5ff 0%, #ddd6fe 50%, #c4b5fd 100%);
        }

        .nav-glass {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .nav-scrolled {
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        }

        .cta-section-bg {
          background: linear-gradient(180deg, #f0e6ff 0%, #e4d4ff 100%);
        }

        /* Smooth scrollbar */
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ===== NAVIGATION ===== */}
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${headerScrolled ? 'nav-glass nav-scrolled' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/haylo-logo.jpg" alt="Haylo Logo" className="h-8 md:h-10 w-auto mix-blend-multiply" />
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="text-gray-800 hover:text-purple-600 transition font-medium text-sm">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="text-gray-800 hover:text-purple-600 transition font-medium text-sm">About Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('solution'); }} className="text-gray-800 hover:text-purple-600 transition font-medium text-sm">Solution</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="text-gray-800 hover:text-purple-600 transition font-medium text-sm">FAQs</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="text-gray-800 hover:text-purple-600 transition font-medium text-sm">Contact</a>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="hidden md:flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
              >
                Book A Demo
              </button>
              <Link href="/login" className="hidden md:flex w-10 h-10 bg-purple-600 rounded-full items-center justify-center hover:bg-purple-700 transition">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </Link>
              {/* Mobile hamburger */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl animate-fadeIn">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="text-gray-700 hover:text-purple-600 font-medium text-base py-3 px-3 rounded-lg transition">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="text-gray-700 hover:text-purple-600 font-medium text-base py-3 px-3 rounded-lg transition">About Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('solution'); }} className="text-gray-700 hover:text-purple-600 font-medium text-base py-3 px-3 rounded-lg transition">Solution</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="text-gray-700 hover:text-purple-600 font-medium text-base py-3 px-3 rounded-lg transition">FAQs</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="text-gray-700 hover:text-purple-600 font-medium text-base py-3 px-3 rounded-lg transition">Contact</a>
              <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium text-base py-3 px-3 rounded-lg transition">Sign In</Link>
              <button onClick={() => { setDemoModalOpen(true); setMobileMenuOpen(false); }} className="bg-purple-600 text-white w-full py-3 rounded-full font-semibold text-sm mt-3">
                Book A Demo
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="hero-gradient pt-24 md:pt-32 pb-16 md:pb-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            {/* Left content */}
            <div className="flex-1 text-left animate-fadeInUp">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]" style={{ letterSpacing: '-0.02em' }}>
                Never Miss<br />Another Patient<br />Call Again
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-xl mb-8 leading-relaxed">
                Haylo is your AI receptionist for Allied Health clinics across Australia.
                It answers calls, books appointments, and handles admin so
                your front desk doesn&apos;t burn out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="bg-purple-600 text-white px-8 py-3.5 rounded-full hover:bg-purple-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-base"
                >
                  Book a Demo
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="border-2 border-purple-400 text-purple-700 px-8 py-3.5 rounded-full hover:bg-purple-50 transition font-semibold text-base"
                >
                  Listen to a Live Call
                </button>
              </div>
            </div>

            {/* Right visual - Phone with floating tags */}
            <div className="flex-1 relative flex justify-center items-center min-h-[400px] md:min-h-[500px]">
              {/* Floating tag - Dental practices */}
              <div className="absolute left-0 md:left-4 top-16 md:top-20 z-20 animate-float" style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-3 bg-purple-600 text-white px-5 py-3 rounded-2xl shadow-xl">
                  <div className="w-10 h-10 bg-purple-800 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h-2zm0 6h2v2h-2z"/></svg>
                  </div>
                  <span className="font-semibold text-sm">Dental practices</span>
                </div>
              </div>

              {/* Floating tag - Physiotherapy Clinics */}
              <div className="absolute right-0 md:right-0 bottom-16 md:bottom-20 z-20 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3 bg-purple-500/90 text-white px-5 py-3 rounded-2xl shadow-xl backdrop-blur-sm">
                  <div className="w-10 h-10 bg-purple-700/50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>
                  </div>
                  <span className="font-semibold text-sm">Physiotherapy Clinics</span>
                </div>
              </div>

              {/* Phone image */}
              <div className="relative z-10">
                <img
                  src="/hero-phone.png"
                  alt="Haylo appointment booking interface on smartphone"
                  className="w-[280px] md:w-[380px] h-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Background purple glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-purple-200/40 rounded-full blur-3xl z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BUILT FOR ALLIED HEALTH CLINICS ===== */}
      <section id="about" className="py-16 md:py-24 px-4 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-10 md:mb-14">
            Built for Allied Health Clinics Across Australia
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: '🏥', label: 'Physiotherapy clinics' },
              { icon: '🦷', label: 'Dental practices' },
              { icon: '🦊', label: 'Chiropractors' },
              { icon: '➕', label: 'NDIS providers' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-purple-600">
                <span className="text-3xl md:text-4xl">{item.icon}</span>
                <span className="text-base md:text-lg font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROBLEM: YOUR FRONT DESK IS LOSING YOU MONEY ===== */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left - Image with floating indicators */}
            <div className="flex-1 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/stressed-receptionist.png"
                  alt="Stressed receptionist on the phone"
                  className="w-full h-auto object-cover"
                />
                {/* 118 missed calls badge */}
                <div className="absolute top-4 left-4 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="bg-white rounded-xl p-3 shadow-lg flex items-center gap-2">
                    <div className="relative">
                      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">118</span>
                    </div>
                  </div>
                </div>
                {/* Low rating badge */}
                <div className="absolute top-4 right-4 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="bg-white rounded-xl p-3 shadow-lg">
                    <div className="flex gap-0.5 mb-1">
                      <span className="text-purple-500">★</span>
                      <span className="text-gray-300">★</span>
                      <span className="text-gray-300">★</span>
                      <span className="text-gray-300">★</span>
                      <span className="text-gray-300">★</span>
                    </div>
                    <div className="w-12 h-1 bg-purple-200 rounded mb-0.5"></div>
                    <div className="w-8 h-1 bg-purple-100 rounded"></div>
                  </div>
                </div>
                {/* Sad emoji badges */}
                <div className="absolute bottom-4 right-4 flex gap-2 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center text-lg">😐</div>
                  <div className="bg-purple-200 w-10 h-10 rounded-lg flex items-center justify-center text-lg">😐</div>
                </div>
              </div>
            </div>

            {/* Right - Text content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Your Front Desk<br />Is Losing You Money
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  'Missed calls during peak hours',
                  'Slow response times killing conversions',
                  'Admin overload from bookings + follow-ups',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-gray-700 text-base md:text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MEET HAYLO - YOUR 24/7 AI RECEPTIONIST ===== */}
      <section id="solution" className="meet-section py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            {/* Left content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Meet <span className="text-purple-600">Haylo</span>,<br />
                Your 24/7 AI Receptionist.
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mb-6">
                Haylo handles every patient call for your clinic — answering instantly,
                booking appointments, and managing admin tasks so your team can
                focus on care, not phones.
              </p>
              {/* Rating badges */}
              <div className="flex flex-col sm:flex-row gap-6 mt-8">
                <div className="flex items-center gap-3">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">5.0</div>
                  <div className="text-sm text-gray-500">/ 5 rating</div>
                </div>
                <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
                <div>
                  <div className="font-semibold text-gray-900">24/7 Availability</div>
                  <div className="text-sm text-gray-500">Never miss a patient call</div>
                </div>
                <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">5.0</div>
                  <div className="text-sm text-gray-500">/ 5 rating</div>
                </div>
                <div className="h-12 w-px bg-gray-300 hidden sm:block"></div>
                <div>
                  <div className="font-semibold text-gray-900">Instant Response</div>
                  <div className="text-sm text-gray-500">Every call answered in seconds</div>
                </div>
              </div>
            </div>

            {/* Right features */}
            <div className="flex-1 space-y-8">
              {[
                {
                  icon: '📞',
                  title: 'Call Handling',
                  desc1: 'Answers every inbound call instantly',
                  desc2: 'No more missed opportunities'
                },
                {
                  icon: '📅',
                  title: 'Smart Booking',
                  desc1: 'Books appointments directly into your calendar',
                  desc2: 'Syncs seamlessly with your existing systems'
                },
                {
                  icon: '💬',
                  title: 'Patient Communication',
                  desc1: 'Handles FAQs, confirmations, and reminders',
                  desc2: 'Professional and natural conversations'
                },
                {
                  icon: '⚙️',
                  title: 'Admin Automation',
                  desc1: 'Handles FAQs, rescheduling, and cancellations',
                  desc2: 'Frees up your front desk from repetitive tasks'
                }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="feature-icon-box w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl shadow-sm">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-500 text-sm">{feature.desc1}</p>
                    <p className="text-gray-500 text-sm">{feature.desc2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== KEY BENEFITS CARDS ===== */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { icon: '📋', text: 'Increase bookings without hiring more staff' },
              { icon: '📵', text: 'Capture missed revenue from unanswered calls' },
              { icon: '💆', text: 'Reduce front desk burnout' },
              { icon: '🤝', text: 'Improve patient experience instantly' },
              { icon: '🔄', text: 'Operate 24/7 without extra costs' },
            ].map((item, i) => (
              <div key={i} className="benefit-card rounded-2xl p-6 md:p-8 flex flex-col items-center text-center text-white shadow-lg">
                <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center text-2xl mb-4 bg-white/10">
                  {item.icon}
                </div>
                <p className="text-sm md:text-base font-medium leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: '/ai-call-handling.png',
                title: 'AI Call Handling',
                subtitle: 'Answers every call, every time'
              },
              {
                image: '/appointment-booking.png',
                title: 'Appointment Booking',
                subtitle: 'Books patients instantly'
              },
              {
                image: '/patient-followup.png',
                title: 'Patient Follow-Up',
                subtitle: 'Automated reminders & confirmations'
              }
            ].map((item, i) => (
              <div key={i} className="card-hover bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="bg-purple-50 p-6 md:p-8 flex items-center justify-center h-[220px] md:h-[280px]">
                  <img src={item.image} alt={item.title} className="h-full w-auto object-contain max-w-[90%]" />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-500 text-sm md:text-base">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS + TESTIMONIAL ===== */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="stats-card bg-gray-100 rounded-2xl p-8 md:p-10">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 mb-1">37%</div>
              <p className="text-gray-600 font-medium text-lg">Increase in<br />recovered calls</p>
            </div>
            <div className="stats-card bg-purple-400 rounded-2xl p-8 md:p-10 text-white">
              <div className="text-5xl md:text-6xl font-bold mb-1">60%</div>
              <p className="font-medium text-lg text-white/90">Reduction in<br />admin workload</p>
            </div>
            <div className="stats-card bg-gray-100 rounded-2xl p-6 md:p-8 flex items-center gap-4">
              <img src="/testimonial-doctor.png" alt="Clinic Owner" className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover" />
              <div>
                <p className="text-gray-600 text-sm italic mb-2">&ldquo;Reception used to get overwhelmed during busy periods. Haylo changed everything.&rdquo;</p>
                <p className="font-bold text-gray-900 text-sm">Clinic Owner</p>
                <p className="text-gray-500 text-xs">Allied Health Practice</p>
              </div>
            </div>
          </div>

          {/* Testimonial + Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main testimonial */}
            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 flex items-center gap-6 border border-gray-100">
              <img src="/testimonial-doctor.png" alt="Practice Manager" className="w-24 h-32 md:w-28 md:h-36 rounded-xl object-cover flex-shrink-0" />
              <div>
                <p className="text-gray-700 text-base md:text-lg italic leading-relaxed mb-4">
                  &ldquo;Before Haylo we were constantly missing calls during treatment hours. Now every enquiry gets handled and our bookings are much more consistent.&rdquo;
                </p>
                <p className="font-bold text-gray-900">Practice Manager</p>
                <p className="text-gray-500 text-sm">Physiotherapy Clinic</p>
              </div>
            </div>

            {/* 14 Days card */}
            <div className="stats-card bg-purple-400 rounded-2xl p-8 md:p-10 text-white flex flex-col justify-between">
              <div className="text-5xl md:text-6xl font-bold">14<span className="text-xl md:text-2xl font-normal ml-1">Days</span></div>
              <p className="text-white/90 font-medium text-lg mt-4">Boost<br />in bookings</p>
            </div>

            {/* 24/7 card */}
            <div className="stats-card bg-purple-100 rounded-2xl p-8 md:p-10 flex flex-col justify-between">
              <div className="text-5xl md:text-6xl font-bold text-gray-900">24/7</div>
              <p className="text-gray-700 font-medium text-lg mt-4">Continuous<br />patient support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section id="contact" className="cta-section-bg py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left CTA */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                Stop losing<br />patients.
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-4 leading-relaxed max-w-lg">
                Every missed call is a lost booking. Haylo answers
                instantly, books appointments, and keeps your clinic
                running smoothly — even after hours.
              </p>
              <p className="text-base md:text-lg text-gray-700 font-medium mb-8 max-w-lg">
                Never let another patient go elsewhere because no
                one picked up.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="bg-purple-600 text-white px-8 py-3.5 rounded-full hover:bg-purple-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-base"
                >
                  Book a Demo
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="border-2 border-purple-400 text-purple-700 px-8 py-3.5 rounded-full hover:bg-white/50 transition font-semibold text-base"
                >
                  Hear Haylo in Action
                </button>
              </div>
            </div>

            {/* Right - Get Started form */}
            <div className="flex-1 max-w-md">
              <div className="bg-purple-200/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Get Started</h3>

                {contactStatus === 'success' ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="font-bold text-gray-900 mb-2">Request Submitted!</p>
                    <p className="text-gray-600 text-sm">We&apos;ll be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={submitContactForm} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        required
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 placeholder-gray-400 h-28 resize-none"
                        placeholder="What are you say ?"
                      />
                    </div>

                    {contactStatus === 'error' && (
                      <p className="text-red-500 text-sm">There was an error. Please try again.</p>
                    )}

                    <button
                      disabled={contactStatus === 'submitting'}
                      type="submit"
                      className="w-full bg-purple-400 hover:bg-purple-500 text-white py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:bg-purple-300 text-base shadow-md"
                    >
                      {contactStatus === 'submitting' ? 'Sending...' : 'Request Demo'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section id="faq" className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is Haylo?',
                a: 'Haylo is a virtual receptionist designed for Allied Health practices. It answers calls, manages bookings, captures enquiries, and supports your front desk.'
              },
              {
                q: 'What types of calls can Haylo handle?',
                a: 'Haylo can manage new patient enquiries, appointment bookings, reschedules, cancellations, and general practice questions.'
              },
              {
                q: 'Will Haylo replace my reception team?',
                a: 'No. Haylo supports your reception team by handling repetitive calls and enquiries so staff can focus on patients and higher value tasks.'
              },
              {
                q: 'How long does setup take?',
                a: 'Most practices can get started quickly with a simple configuration based on your services, availability, and workflows.'
              }
            ].map((faq, i) => (
              <div key={i} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 md:px-8 py-5 md:py-6 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900 text-left text-base md:text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 md:px-8 pb-5 md:pb-6 text-gray-600 leading-relaxed text-base md:text-lg">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer-gradient py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Left - Logo & email */}
            <div>
              <img src="/haylo-logo.jpg" alt="Haylo" className="h-10 md:h-12 w-auto mb-6 mix-blend-multiply" />
              <p className="text-gray-600 text-sm mb-6">Get started now try our product</p>
              <div className="flex items-center bg-white/60 backdrop-blur rounded-full p-1.5 max-w-sm shadow-sm border border-purple-200/50">
                <input
                  type="email"
                  placeholder="Enter your email here"
                  className="flex-1 px-4 py-2.5 bg-transparent border-0 outline-none text-gray-700 placeholder-gray-400 text-sm"
                />
                <button className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center hover:bg-purple-500 transition flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Right - Link columns */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-sm">Support</h4>
                <ul className="space-y-2.5 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-purple-600 transition">Help centre</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Account information</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">About</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Contact us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-sm">Help and Solution</h4>
                <ul className="space-y-2.5 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-purple-600 transition">Talk to support</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Support docs</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">System status</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Covid responde</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-sm">Product</h4>
                <ul className="space-y-2.5 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-purple-600 transition">Update</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Security</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Beta test</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition">Pricing product</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-purple-300/40 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
            <p>© 2025 Haylo. Copyright and rights reserved</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-purple-600 transition">Terms and Conditions</a>
              <span>•</span>
              <Link href="/privacy-policy" className="hover:text-purple-600 transition">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== BOOK A DEMO MODAL ===== */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => { setDemoModalOpen(false); setDemoStatus('idle'); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Book a Demo</h3>
            <p className="text-gray-500 mb-6">Enter your details and our team will get in touch to show you how Haylo can automate your clinic.</p>

            {demoStatus === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h4>
                <p className="text-gray-600 mb-6">We&apos;ve received your details and will be in touch shortly.</p>
                <button
                  onClick={() => { setDemoModalOpen(false); setDemoStatus('idle'); }}
                  className="bg-purple-600 text-white w-full py-3 rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitDemoForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input required type="text" value={demoForm.fullName} onChange={e => setDemoForm({ ...demoForm, fullName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="Jane Doe" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                    <input required type="tel" value={demoForm.mobile} onChange={e => setDemoForm({ ...demoForm, mobile: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="+61 400 000 000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={demoForm.email} onChange={e => setDemoForm({ ...demoForm, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="jane@clinic.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company / Clinic Name</label>
                  <input type="text" value={demoForm.company} onChange={e => setDemoForm({ ...demoForm, company: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="Radiance MedSpa" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={demoForm.address} onChange={e => setDemoForm({ ...demoForm, address: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="123 Wellness Ave, Suite 100" />
                </div>

                {demoStatus === 'error' && (
                  <p className="text-red-500 text-sm mt-2">There was an error submitting your request. Please try again.</p>
                )}

                <div className="pt-2">
                  <button
                    disabled={demoStatus === 'submitting'}
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:bg-purple-400"
                  >
                    {demoStatus === 'submitting' ? 'Submitting...' : 'Request Demo'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}