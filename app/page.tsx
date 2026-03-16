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
              AI Receptionist for Allied Health Practices
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Never Miss Another<br />
              Patient Call
            </h1>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed px-2">
              When your team is busy with patients, Haylo answers every call, captures new patient enquiries, and books appointments automatically.<br/><br/>
              No missed calls. No overwhelmed reception desk. No lost bookings. Just a more responsive, better organised practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={() => setDemoModalOpen(true)} className="bg-purple-600 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base w-full sm:w-auto">
                See How Haylo Handles Your Calls
              </button>
              <button className="border-2 border-purple-600 text-purple-600 px-6 md:px-8 py-3 md:py-3.5 rounded-lg hover:bg-purple-50 transition font-semibold flex items-center justify-center gap-2 transform hover:scale-105 text-sm md:text-base w-full sm:w-auto">
                <Phone className="w-5 h-5" />
                Hear Haylo Answer a Call
              </button>
            </div>
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
          {/* Missed Calls Section (NEW) */}
          <div className="bg-red-50 p-8 md:p-12 rounded-3xl mb-16 md:mb-24 shadow-sm border border-red-100 text-left max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Most Allied Health clinics lose new patients every week
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              When a potential patient calls your clinic and nobody answers, they rarely leave a voicemail. They simply call the next clinic on Google.
            </p>
            <p className="text-lg text-gray-800 font-semibold mb-4">That means missed calls often become:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-8 font-medium">
              <li className="flex gap-2 items-center"><span className="text-red-500 text-xl font-bold">×</span> Lost new patients</li>
              <li className="flex gap-2 items-center"><span className="text-red-500 text-xl font-bold">×</span> Lost treatment plans</li>
              <li className="flex gap-2 items-center"><span className="text-red-500 text-xl font-bold">×</span> Lost long term clients</li>
              <li className="flex gap-2 items-center"><span className="text-red-500 text-xl font-bold">×</span> Empty appointment slots</li>
            </ul>
            <p className="text-lg font-medium text-purple-700 bg-purple-50 p-6 rounded-xl mb-8">
              Haylo ensures every call is answered, every enquiry is captured, and every booking opportunity is handled instantly.
            </p>
            <button className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-3.5 rounded-lg hover:bg-purple-50 transition font-semibold flex items-center justify-center gap-2 transform hover:scale-105 inline-flex">
              <Phone className="w-5 h-5" />
              Hear Haylo Answer a Call
            </button>
          </div>

          <p className="text-purple-600 font-semibold mb-3 md:mb-4 uppercase text-xs md:text-sm tracking-wide">
            TRUSTED BY GROWING ALLIED HEALTH PRACTICES
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-12 max-w-4xl mx-auto px-2 leading-relaxed">
            Physio clinics, chiropractors, psychologists, podiatrists, speech pathologists, occupational therapists, and multidisciplinary clinics use Haylo to stay responsive and keep their calendars full.
          </h2>

          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-5 gap-12 opacity-40">
            {['Apex Physio', 'Mindful Psychology', 'Align Chiropractic', 'StepWise Podiatry', 'Bloom Therapy'].map((brand) => (
              <div key={brand} className="text-xl font-bold text-gray-500 hover:opacity-100 transition">
                {brand}
              </div>
            ))}
          </div>

          {/* Mobile: auto-scrolling marquee */}
          <div className="md:hidden overflow-hidden relative">
            <div className="flex trust-marquee whitespace-nowrap gap-8 opacity-40" style={{ width: 'max-content' }}>
              {['Apex Physio', 'Mindful Psychology', 'Align Chiropractic', 'StepWise Podiatry', 'Bloom Therapy', 'Apex Physio', 'Mindful Psychology', 'Align Chiropractic', 'StepWise', 'Bloom Therap'].map((brand, i) => (
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
              THE PROBLEM
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Running a busy Allied Health practice is demanding
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your team is focused on patient care. But the front desk is constantly managing:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mt-12">
            {/* Problem List */}
            <div className="bg-white p-10 rounded-3xl shadow-lg border border-red-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
              <div className="relative z-10">
                <ul className="space-y-4 text-gray-800 font-medium text-lg mb-8">
                  <li className="flex gap-3 items-center"><span className="w-2 h-2 rounded-full bg-red-400"></span> Incoming calls</li>
                  <li className="flex gap-3 items-center"><span className="w-2 h-2 rounded-full bg-red-400"></span> Appointment bookings</li>
                  <li className="flex gap-3 items-center"><span className="w-2 h-2 rounded-full bg-red-400"></span> Cancellations and reschedules</li>
                  <li className="flex gap-3 items-center"><span className="w-2 h-2 rounded-full bg-red-400"></span> New patient enquiries</li>
                  <li className="flex gap-3 items-center"><span className="w-2 h-2 rounded-full bg-red-400"></span> Practitioner schedules</li>
                  <li className="flex gap-3 items-center"><span className="w-2 h-2 rounded-full bg-red-400"></span> Admin tasks</li>
                </ul>
                <div className="p-5 bg-red-50 rounded-xl text-red-900 text-base font-semibold border border-red-100">
                  When things get busy, something gives. That’s when calls get missed, enquiries go unanswered, and new patients move on to the next clinic that picks up.
                </div>
              </div>
            </div>

            {/* Reception Overload */}
            <div className="bg-orange-50 p-10 rounded-3xl shadow-lg border border-orange-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -mr-16 -mt-16 z-0"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Your reception team is already stretched
                </h3>
                <p className="text-lg text-gray-800 mb-6">
                  During peak hours reception staff are juggling phone calls while managing patients at the desk. That’s when missed calls happen.
                </p>
                <p className="text-lg text-gray-800 mb-8">
                  Haylo works alongside your team to answer calls, handle enquiries, and capture booking requests so your staff can stay focused on patient care.
                </p>
                <div className="p-5 bg-white rounded-xl text-orange-900 text-base font-bold shadow-sm">
                  Haylo doesn't replace reception.<br/>It removes the pressure from the phones.
                </div>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="max-w-6xl mx-auto mt-12 bg-gradient-to-br from-purple-600 to-indigo-600 p-10 md:p-14 rounded-3xl shadow-xl text-white text-center relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-tl-full blur-2xl -mr-16 -mb-16 z-0"></div>
            <div className="relative z-10">
              <h3 className="text-purple-200 font-bold tracking-widest text-sm mb-4">THE SOLUTION</h3>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Meet Your Virtual Receptionist</h2>
              <h3 className="text-xl md:text-2xl font-semibold mb-8 text-purple-100">Haylo makes sure every call is answered</h3>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed">
                Haylo works alongside your practice to manage the constant flow of calls and enquiries that come in every day.
              </p>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
                It answers calls instantly, handles common patient questions, books appointments, and captures new patient details automatically.
              </p>
              <div className="inline-block bg-white/20 backdrop-blur border border-white/30 rounded-full px-8 py-4 font-bold text-white shadow-inner text-lg">
                So your team spends less time chasing admin and more time focused on patients.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Allied Health Businesses
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Whether you run a physiotherapy clinic, chiropractic practice, psychology clinic, podiatry business, speech pathology service, occupational therapy practice, or multidisciplinary centre, Haylo helps your practice stay organised and responsive.
            </p>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Haylo helps practices:</h4>
            <div className="space-y-4 mb-10">
              {[
                'Answer every call during consultations',
                'Capture new patient enquiries instantly',
                'Book appointments directly into your calendar',
                'Reduce reception overload during busy periods',
                'Respond faster to new patient enquiries',
                'Eliminate admin bottlenecks from manual booking',
                'Prevent lost bookings from missed calls'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 transform hover:translate-x-2 transition p-2 hover:bg-purple-50 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setDemoModalOpen(true)} className="bg-purple-600 text-white px-8 py-3.5 rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                Book a Demo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="card-3d bg-purple-50 rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border border-purple-100 text-center">
              <Phone className="w-12 h-12 text-purple-500 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Always On</h4>
              <p className="text-sm text-gray-600">Answers instantly during busy hours</p>
            </div>
            <div className="card-3d bg-indigo-50 rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border border-indigo-100 text-center mt-12">
              <Calendar className="w-12 h-12 text-indigo-500 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Smart Sync</h4>
              <p className="text-sm text-gray-600">Knows when practitioners are free</p>
            </div>
            <div className="card-3d bg-blue-50 rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border border-blue-100 text-center">
              <Users className="w-12 h-12 text-blue-500 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Patient Focused</h4>
              <p className="text-sm text-gray-600">Captures full details and preferences</p>
            </div>
            <div className="card-3d bg-green-50 rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border border-green-100 text-center mt-12">
              <TrendingUp className="w-12 h-12 text-green-500 mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Practice Growth</h4>
              <p className="text-sm text-gray-600">Eliminates lost bookings entirely</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              How Haylo supports your practice
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Answers every call instantly</h4>
              <p className="text-gray-600 text-sm leading-relaxed">No voicemail. No missed enquiries. Every caller is greeted and helped immediately.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Books appointments automatically</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Haylo connects to your calendar and schedules appointments in real time based on availability.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Captures new patient enquiries</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Patient details, reason for enquiry, and booking preferences are recorded instantly.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">4</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Reduces reception overload</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Your team no longer needs to handle every incoming call during busy clinic hours.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">5</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Keeps your practice responsive</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Patients receive immediate assistance, faster bookings, and a better overall experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Call Section (NEW) */}
      <section className="py-24 px-4 bg-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Call Haylo and hear it for yourself</h2>
          <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            The best way to understand Haylo is to experience it. Call the demo number below and speak with the virtual receptionist exactly like a patient would.
          </p>
          <p className="text-lg text-purple-200 mb-10 max-w-2xl mx-auto font-medium">
            Try booking an appointment or asking a question.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl inline-block shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-5xl font-black tracking-wider">
                03 XXXX XXXX
              </div>
            </div>
            <p className="text-purple-200 text-sm font-medium mt-4">See how Haylo could support your practice in seconds.</p>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Works with your existing systems
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Haylo connects with your calendar and booking platform so appointments, cancellations, and reschedules stay organised automatically.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-xl">
              <p className="text-lg font-semibold text-gray-900 mb-2">Your team keeps working the same way.</p>
              <p className="text-gray-700">Haylo simply removes the pressure from the phones.</p>
            </div>
          </div>
          <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-96 bg-gray-50 rounded-3xl border border-gray-200 p-8 flex flex-col items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-indigo-100/50"></div>
             <div className="relative z-10 flex gap-4 items-center">
                <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center animate-float" style={{ animationDelay: '0s' }}>
                  <span className="font-bold text-gray-400">PMS</span>
                </div>
                <div className="flex gap-2 text-gray-300">
                  <Infinity className="w-8 h-8" />
                </div>
                <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                  <img src="/haylo-logo.jpg" alt="Haylo" className="h-8 object-contain mix-blend-multiply" />
                </div>
             </div>
             <p className="relative z-10 mt-10 font-medium text-gray-600 text-center uppercase tracking-widest text-sm">Seamless Sync</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real results from real practices
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Before Haylo we were constantly missing calls during treatment hours. Now every enquiry gets handled and our bookings are much more consistent.",
                author: "Practice Manager",
                company: "Physiotherapy Clinic"
              },
              {
                quote: "Reception used to get overwhelmed during busy periods. Haylo has taken a huge amount of pressure off the team.",
                author: "Clinic Owner",
                company: "Allied Health Practice"
              },
              {
                quote: "New patient enquiries used to sit unanswered during busy days. Now they are captured instantly.",
                author: "Director",
                company: "Multidisciplinary Clinic"
              }
            ].map((item, i) => (
              <div key={i} className="card-3d bg-white rounded-2xl p-8 border border-gray-200 shadow-lg flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-purple-600 text-purple-600" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed flex-grow text-lg italic">"{item.quote}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-semibold text-gray-900">{item.author}</div>
                  <div className="text-sm text-purple-600 font-medium">{item.company}</div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              FAQ
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
                  className="w-full px-8 py-6 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900 text-left text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed text-lg">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA Section */}
      <section className="py-20 md:py-32 px-4 gradient-mesh relative overflow-hidden bg-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight">
            Stop losing appointments to missed calls
          </h2>
          <p className="text-base md:text-xl text-gray-700 mb-4 leading-relaxed px-2 font-medium">
            If your practice is growing, missed calls and admin overload become unavoidable.
          </p>
          <p className="text-base md:text-xl text-gray-600 mb-10 leading-relaxed px-2">
            Haylo ensures every enquiry is answered, every booking opportunity is captured, and your reception team stays focused on patient care.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setDemoModalOpen(true)} className="bg-purple-600 text-white px-8 md:px-12 py-3.5 md:py-4 rounded-lg hover:bg-purple-700 transition font-semibold text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
              Start your free trial today
            </button>
            <button onClick={() => setDemoModalOpen(true)} className="bg-white border-2 border-purple-600 text-purple-600 px-8 md:px-12 py-3.5 md:py-4 rounded-lg hover:bg-purple-50 transition font-semibold text-base md:text-lg shadow-md hover:shadow-lg transform hover:scale-105">
              See How Haylo Handles Your Calls
            </button>
          </div>
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