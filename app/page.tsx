'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Calendar, CheckCircle2, Users, TrendingUp, Star, ChevronDown, Infinity, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'restaurant' | 'hotel'>('restaurant');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Book a demo modal state
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ fullName: '', email: '', mobile: '', company: '', address: '' });
  const [demoStatus, setDemoStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % 200);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes slideInfinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-slide {
          animation: slideInfinite 20s linear infinite;
        }

        .trust-marquee {
          animation: marqueeScroll 15s linear infinite;
        }

        .card-3d {
          transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
          transform-style: preserve-3d;
        }

        .card-3d:hover {
          transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
          box-shadow: 
            0 20px 40px rgba(91, 77, 255, 0.2),
            0 0 100px rgba(91, 77, 255, 0.1);
        }

        .perspective-container {
          perspective: 1000px;
        }

        .gradient-mesh {
          background: 
            radial-gradient(at 20% 30%, rgba(91, 77, 255, 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 70%, rgba(147, 51, 234, 0.1) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.08) 0px, transparent 50%);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>

      {/* Navigation - Same style on mobile & desktop */}
      <nav className="fixed top-0 left-0 right-0 w-full glass-effect z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/haylo-logo.jpg" alt="Haylo Logo" className="h-8 md:h-10 w-auto mix-blend-multiply" />
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition">Home</a>
              <a href="#solutions" className="text-gray-600 hover:text-gray-900 transition">Solutions</a>
            </div>

            {/* Right side: Sign in + Book a demo + Hamburger (mobile only) */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition text-xs md:text-sm font-medium">Sign in</Link>
              <button onClick={() => setDemoModalOpen(true)} className="bg-purple-600 text-white px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg hover:bg-purple-700 transition font-medium shadow-md hover:shadow-xl transform hover:scale-105 text-xs md:text-sm">
                Book a demo
              </button>
              {/* Hamburger - mobile only */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1 text-gray-700 hover:text-gray-900 transition">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm py-3 px-3 rounded-lg transition">Home</a>
              <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm py-3 px-3 rounded-lg transition">Solutions</a>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium text-sm py-3 px-3 rounded-lg transition">Sign in</Link>
              <button onClick={() => { setDemoModalOpen(true); setMobileMenuOpen(false); }} className="bg-gray-900 text-white w-full py-3 rounded-full font-semibold text-sm mt-3">
                Book a Demo
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-16 md:pb-24 px-4 gradient-mesh relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-purple-600 font-semibold text-xs md:text-sm uppercase tracking-wide inline-block mb-3 md:mb-4">
              AI RECEPTIONIST FOR MED SPAS & AESTHETIC CLINICS
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Turn Every Missed Call<br />
              Into Booked Treatments
            </h1>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed px-2">
              Your 24/7 AI receptionist answers every enquiry, books consultations, captures leads, and keeps your clinic fully scheduled without hiring more staff.
            </p>
            <button onClick={() => setDemoModalOpen(true)} className="bg-purple-600 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base">
              Book a Demo
            </button>
          </div>

          {/* 3D Tilted Stats Cards - Horizontal scroll on mobile, positioned on desktop */}
          <div className="max-w-5xl mx-auto">
            {/* Mobile: horizontal scroll */}
            <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="snap-center flex-shrink-0 w-[240px]">
                <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      +5.97% <TrendingUp className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">156</div>
                  <div className="text-xs text-gray-600">Enquiries Answered</div>
                  <div className="text-[10px] text-gray-500 mt-1">+32 than last month</div>
                </div>
              </div>

              <div className="snap-center flex-shrink-0 w-[240px]">
                <div className="bg-gradient-to-br from-purple-600 via-purple-600 to-indigo-600 rounded-2xl p-5 shadow-xl text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-semibold bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">
                      +250%
                    </span>
                  </div>
                  <div className="text-4xl font-bold mb-1">42</div>
                  <div className="text-xs opacity-90 mb-1">New Consultations</div>
                  <div className="text-[10px] opacity-80">+18 than last month</div>
                </div>
              </div>

              <div className="snap-center flex-shrink-0 w-[240px]">
                <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                  <div className="text-xs text-gray-600">Leads Captured</div>
                </div>
              </div>
            </div>

            {/* Desktop: 3D tilted positioning */}
            <div className="hidden md:block perspective-container">
              <div className="relative h-[250px]">
                <div className="absolute left-[5%] top-0 card-3d w-[320px]"
                  style={{ transform: 'rotate(-6deg) translateY(20px)', zIndex: 1 }}>
                  <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Phone className="w-7 h-7 text-purple-600" />
                      </div>
                      <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                        +5.97% <TrendingUp className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">156</div>
                    <div className="text-sm text-gray-600">Enquiries Answered</div>
                    <div className="text-xs text-gray-500 mt-2">+32 than last month</div>
                  </div>
                </div>

                <div className="absolute left-1/2 top-0 card-3d w-[320px]"
                  style={{ transform: 'translateX(-50%) rotate(2deg) translateY(0px)', zIndex: 3 }}>
                  <div className="bg-gradient-to-br from-purple-600 via-purple-600 to-indigo-600 rounded-2xl p-6 shadow-2xl text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-semibold bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                        +250%
                      </span>
                    </div>
                    <div className="text-5xl font-bold mb-1">42</div>
                    <div className="text-sm opacity-90 mb-2">New Consultations</div>
                    <div className="text-xs opacity-80">+18 than last month</div>
                  </div>
                </div>

                <div className="absolute right-[5%] top-0 card-3d w-[320px]"
                  style={{ transform: 'rotate(6deg) translateY(20px)', zIndex: 2 }}>
                  <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Users className="w-7 h-7 text-purple-600" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-1">100%</div>
                    <div className="text-sm text-gray-600">Leads Captured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-purple-600 font-semibold mb-3 md:mb-4 uppercase text-xs md:text-sm tracking-wide">
            TRUSTED BY CLINIC LEADERS
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
            Leading med spas and aesthetic clinics love using Haylo
          </h2>

          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-5 gap-12 opacity-40">
            {['Lumina Aesthetics', 'Radiance MedSpa', 'Elite Wellness', 'Glow Clinic', 'DermaCare'].map((brand) => (
              <div key={brand} className="text-xl font-bold text-gray-500 hover:opacity-100 transition">
                {brand}
              </div>
            ))}
          </div>

          {/* Mobile: auto-scrolling marquee */}
          <div className="md:hidden overflow-hidden relative">
            <div className="flex trust-marquee whitespace-nowrap gap-8 opacity-40" style={{ width: 'max-content' }}>
              {['Lumina Aesthetics', 'Radiance MedSpa', 'Elite Wellness', 'Glow Clinic', 'DermaCare', 'Lumina Aesthetics', 'Radiance MedSpa', 'Elite Wellness', 'Glow Clinic', 'DermaCare'].map((brand, i) => (
                <span key={`${brand}-${i}`} className="text-base font-bold text-gray-500 inline-block px-3">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Front Desk Section */}
      <section id="solutions" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold mb-4 uppercase text-sm tracking-wide">
              MEET YOUR VIRTUAL FRONT DESK
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Future of Aesthetic & Wellness Clinics
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI receptionist helps clinics increase bookings, capture every enquiry, and free up staff to focus on in-clinic treatments and patient experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mt-20">
            {/* Problem */}
            <div className="bg-white p-10 rounded-3xl shadow-lg border border-red-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">!</span>
                  The Problem
                </h3>
                <p className="text-lg font-medium text-gray-800 mb-6">Most clinics are losing revenue every single day.</p>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex gap-3"><span className="text-red-500 mt-1">✕</span> Missed calls.</li>
                  <li className="flex gap-3"><span className="text-red-500 mt-1">✕</span> Slow responses to new enquiries.</li>
                  <li className="flex gap-3"><span className="text-red-500 mt-1">✕</span> Reception teams overloaded with repetitive admin.</li>
                  <li className="flex gap-3"><span className="text-red-500 mt-1">✕</span> Potential clients going to competitors who answer first.</li>
                </ul>
                <div className="mt-8 p-4 bg-red-50 rounded-xl text-red-900 text-sm font-medium">
                  If a new treatment enquiry waits even 10 minutes, the chance of booking drops dramatically. You are already paying for marketing, staff, and software. But enquiries are still slipping through.
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-tr-full -ml-16 -mb-16 z-0"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  The Solution
                </h3>
                <p className="text-xl font-bold text-white mb-6">Never miss another high-value enquiry</p>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Our AI receptionist answers every call and enquiry instantly, books consultations, and captures new leads automatically.
                </p>
                <p className="text-white/90 mb-8 leading-relaxed">
                  It works alongside your existing front desk to make sure no opportunity is missed, even after hours or during busy periods.
                </p>
                <ul className="space-y-4 font-medium text-white">
                  <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-purple-300" /> More bookings.</li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-purple-300" /> Less admin.</li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-purple-300" /> A smoother patient experience.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Med Spas Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Med Spas & Aesthetic Clinics
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              On average, clinics miss a significant number of calls and new treatment enquiries each week, and most potential clients will simply move on to the next clinic if no one answers.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With your AI receptionist, every call and enquiry is handled instantly, leading to more consultations booked, a better client experience, and a consistently fuller calendar without adding more staff.
            </p>

            <div className="space-y-4 mb-10">
              {[
                'Answers every call and new client enquiry, 24/7',
                'Books, reschedules, and cancels consultations automatically',
                'Captures new treatment leads and client details instantly',
                'Reduces missed opportunities and enquiry drop-off',
                'Integrates with your booking system and calendar',
                'Provides call summaries, transcripts, and lead insights',
                'Go live quickly with minimal setup or training required'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 transform hover:translate-x-2 transition">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-purple-600 text-white px-8 py-3.5 rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                Book a Demo
              </button>
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-3.5 rounded-lg hover:bg-purple-50 transition font-semibold flex items-center justify-center gap-2 transform hover:scale-105">
                <Phone className="w-5 h-5" />
                Hear It Answer a Call
              </button>
            </div>
          </div>

          <div className="card-3d bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center md:aspect-square shadow-xl border border-purple-100">
            <Calendar className="w-16 h-16 md:w-24 md:h-24 text-purple-500 mb-4 md:mb-6 animate-float" />
            <h4 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-2">Seamless Calendar Sync</h4>
            <p className="text-gray-600 text-center text-sm md:text-base">Books appointments directly into your existing software perfectly.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold mb-4 uppercase text-sm tracking-wide">
              HOW IT WORKS
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              How your AI receptionist works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Answers every call instantly</h4>
              <p className="text-gray-600 text-sm">No voicemail. No missed opportunities. Every caller is greeted professionally and helped immediately.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Books consultations automatically</h4>
              <p className="text-gray-600 text-sm">Connects to your calendar and books appointments in real time based on your availability.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Captures and qualifies new leads</h4>
              <p className="text-gray-600 text-sm">Collects name, number, treatment interest, and urgency so your team knows exactly who is calling and why.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">4</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Sends confirmations and reminders</h4>
              <p className="text-gray-600 text-sm">SMS and email confirmations are sent automatically to reduce no-shows and back-and-forth.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">5</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Integrates with your existing systems</h4>
              <p className="text-gray-600 text-sm">Works alongside your current booking software, CRM, and workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold mb-4 uppercase text-sm tracking-wide">
              TESTIMONIALS
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real stories, real impact
            </h2>
            <p className="text-lg text-gray-600">
              From the first call to fully booked schedules, clinics are transforming how they connect with patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Haylo handled over 700 calls last month and made more than 100 bookings. That's huge. She shields us from the noise and only transfers truly complex cases.",
                author: "Chris",
                company: "Lumina Aesthetics"
              },
              {
                quote: "Your partnership and collaboration has sealed the deal for me for life. Most companies don't truly care, and I know because I talked to all your competitors.",
                author: "Ed",
                company: "Glow Wellness"
              },
              {
                quote: "I swear the manager hung up the phone and it hasn't stopped ringing coming in from the Haylo phone.",
                author: "Rob",
                company: "DermaCare Clinic"
              }
            ].map((item, i) => (
              <div key={i} className="card-3d bg-white rounded-2xl p-8 border border-gray-200 shadow-lg flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-purple-600 text-purple-600" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed flex-grow">"{item.quote}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-gray-900">{item.author}</div>
                  <div className="text-sm text-gray-600">{item.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-600 font-semibold mb-4 uppercase text-sm tracking-wide">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">Clear answers to common questions about Haylo.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is Haylo and how does it work?',
                a: 'Haylo is the AI receptionist built for med spas and clinics. She answers every call, manages bookings, and assists patients around the clock. Fully customizable to your clinic, she keeps your team focused on delivering exceptional in-person care.'
              },
              {
                q: 'What types of calls can Haylo handle?',
                a: 'Haylo can handle reservation requests, treatment inquiries, hours of operation, event bookings, and general patient questions. She seamlessly integrates with your booking system.'
              },
              {
                q: 'How long does it take to set up Haylo?',
                a: 'Most clinics are up and running within 24-48 hours. Our onboarding team handles the technical setup and customization.'
              },
              {
                q: 'Which partners and platforms does Haylo integrate with?',
                a: 'Haylo integrates with major clinic management systems, booking platforms like Mango, Zenoti, scheduling tools, and communication tools. Contact us for the full list of integrations.'
              }
            ].map((faq, i) => (
              <div key={i} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900 text-left text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 gradient-mesh relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight">
            Start turning calls into bookings
          </h2>
          <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed px-2">
            Ready to grow revenue by elevating customer experience?<br />
            Start your 30-day free trial today!
          </p>
          <button onClick={() => setDemoModalOpen(true)} className="bg-purple-600 text-white px-8 md:px-12 py-3.5 md:py-4 rounded-lg hover:bg-purple-700 transition font-semibold text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
            Book a demo
          </button>
        </div>


      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="text-sm">AI Receptionist for Clinics</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Useful Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/login" className="hover:text-white transition">Sign in</Link></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
            <p>© Copyright 2025. Haylo All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Book a Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
                <p className="text-gray-600 mb-6">We've received your details and will be in touch shortly.</p>
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
                  <input required type="text" value={demoForm.fullName} onChange={e => setDemoForm({ ...demoForm, fullName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="Jane Doe" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                    <input required type="tel" value={demoForm.mobile} onChange={e => setDemoForm({ ...demoForm, mobile: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={demoForm.email} onChange={e => setDemoForm({ ...demoForm, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="jane@clinic.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company / Clinic Name</label>
                  <input type="text" value={demoForm.company} onChange={e => setDemoForm({ ...demoForm, company: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="Radiance MedSpa" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={demoForm.address} onChange={e => setDemoForm({ ...demoForm, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none text-gray-900" placeholder="123 Wellness Ave, Suite 100" />
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