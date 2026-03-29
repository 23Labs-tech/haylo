'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  
  // Modals / Forms
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ fullName: '', email: '', mobile: '', company: '' });
  const [demoStatus, setDemoStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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
      if (res.ok) setDemoStatus('success');
      else setDemoStatus('error');
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
        body: JSON.stringify({ fullName: 'Contact Form', email: contactEmail, message: contactMessage })
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
    const handleScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans bg-[#f7f8fa] overflow-x-hidden selection:bg-[#e7d9f6] text-[#1e1e1e]">
      
      {/* ===== NAVIGATION ===== */}
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${headerScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6 md:py-8'}`}>
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="flex items-center gap-1">
                <span className="font-bold text-[36px] tracking-tight">HAYLO</span>
                <span className="text-[#1e1e1e] flex items-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path fill="white" d="M12 6l1.5 4.5L18 12l-4.5 1.5L12 18l-1.5-4.5L6 12l4.5-1.5z"/></svg>
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-10">
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="text-[#1e1e1e] hover:text-[#a824fa] transition font-medium text-[16px]">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="text-[#1e1e1e] hover:text-[#a824fa] transition font-medium text-[16px]">About Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('solution'); }} className="text-[#1e1e1e] hover:text-[#a824fa] transition font-medium text-[16px]">Solution</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="text-[#1e1e1e] hover:text-[#a824fa] transition font-medium text-[16px]">FAQs</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="text-[#1e1e1e] hover:text-[#a824fa] transition font-medium text-[16px]">Contact</a>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="hidden md:flex bg-[#a824fa] hover:bg-[#911fdb] text-white px-8 py-3.5 rounded-full transition font-semibold text-[16px]"
              >
                Book A Demo
              </button>
              <Link href="/login" className="hidden md:flex w-[48px] h-[48px] bg-[#c791fe] hover:bg-[#a824fa] text-white rounded-full items-center justify-center transition">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl px-6 py-6 flex flex-col gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="text-[18px] font-medium text-gray-800">Home</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="text-[18px] font-medium text-gray-800">About Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('solution'); }} className="text-[18px] font-medium text-gray-800">Solution</a>
            <button onClick={() => { setDemoModalOpen(true); setMobileMenuOpen(false); }} className="bg-[#a824fa] text-white w-full py-4 rounded-xl font-bold mt-2">Book A Demo</button>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="pt-32 md:pt-44 pb-16 md:pb-24 px-6 lg:px-8 relative overflow-hidden bg-gradient-to-r from-[#ffe5f9]/20 via-[#fcfaff] to-[#f3ebfa]/40">
        <div className="max-w-[1300px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 min-h-[500px]">
            
            <div className="w-full lg:w-[50%] z-20">
              <h1 className="text-[56px] md:text-[72px] lg:text-[84px] font-bold leading-[1.05] tracking-tight mb-6 text-[#1e1e1e]">
                Never Miss<br/>Another Patient<br/>Call Again
              </h1>
              <p className="text-[18px] md:text-[20px] text-gray-600 mb-10 max-w-[500px] leading-relaxed font-medium">
                Haylo is your AI receptionist for Allied Health clinics
                <br className="hidden md:block"/>It answers calls, books appointments, and handles admin so
                your front desk doesn&apos;t burn out
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="bg-[#a824fa] text-white px-9 py-4 rounded-full hover:bg-[#911fdb] transition font-bold text-[16px]"
                >
                  Book A Demo
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="bg-transparent border-[1.5px] border-[#1e1e1e]/20 text-[#1e1e1e] px-9 py-4 rounded-full hover:bg-black/5 transition font-bold text-[16px]"
                >
                  Listen to a Live Call
                </button>
              </div>
            </div>

            <div className="w-full lg:w-[50%] flex justify-center lg:justify-end relative mt-10 lg:mt-0">
               {/* Background purple card behind phone */}
               <div className="absolute top-[10%] right-[-5%] w-[90%] md:w-[85%] h-[90%] bg-[#dca6ff] rounded-[32px] rounded-tl-[100px] z-0 shadow-lg"></div>
               
               {/* White Chat Bubble Float */}
               <div className="absolute top-[0%] left-[8%] md:left-[15%] z-20 bg-white rounded-full rounded-bl-sm p-4 px-5 shadow-xl">
                 <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 bg-[#e0e0e0] rounded-full"></div>
                   <div className="w-2.5 h-2.5 bg-[#e0e0e0] rounded-full"></div>
                   <div className="w-2.5 h-2.5 bg-[#e0e0e0] rounded-full"></div>
                 </div>
               </div>

              {/* Dental Badge */}
              <div className="absolute top-[35%] left-[-10px] md:top-[40%] md:left-[-20px] z-30">
                <div className="flex items-center gap-4 bg-[#a824fa] text-white pl-2 pr-6 py-2.5 rounded-full shadow-2xl">
                  <div className="bg-white rounded-full w-[42px] h-[42px] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#a824fa]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7a5 5 0 00-10 0v2H7a5 5 0 000 10h10a5 5 0 000-10h-2V7z M9 9V7a3 3 0 016 0v2H9z"/></svg>
                  </div>
                  <span className="font-semibold text-[16px]">Dental practices</span>
                </div>
              </div>

              {/* Physio Badge */}
              <div className="absolute bottom-[15%] right-[-10px] md:bottom-[20%] md:right-[-20px] z-30">
                <div className="flex items-center gap-4 bg-[#b975ff] text-white pl-2 pr-6 py-2.5 rounded-full shadow-2xl">
                  <div className="bg-white rounded-full w-[42px] h-[42px] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#b975ff]" viewBox="0 0 24 24" fill="currentColor"><path d="M3 14h18v2H3zm16-4V8h-2v2h-4V8h-2v2H7V8H5v2H3v2h18v-2h-2z M10 4c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/></svg>
                  </div>
                  <span className="font-semibold text-[16px]">Physiotherapy Clinics</span>
                </div>
              </div>

              {/* Phone Image */}
              <div className="relative w-full max-w-[320px] md:max-w-[400px] lg:max-w-[420px] z-10 flex justify-center items-end">
                <img
                  src="/hero-phone.png"
                  alt="Haylo App"
                  className="w-full object-contain mix-blend-multiply"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== BUILT FOR ALLIED HEALTH ===== */}
      <section id="about" className="py-20 bg-[#fbfbfb]">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
          <h2 className="text-[28px] md:text-[36px] font-bold text-center mb-16 text-[#1e1e1e]">
            Built for Allied Health Clinics Across Australia
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-x-16 gap-y-10">
            <div className="flex items-center gap-3">
               <svg className="w-8 h-8 text-[#b975ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
               <span className="text-[#1e1e1e] font-medium text-[20px]">Physiotherapy clinics</span>
            </div>
            <div className="flex items-center gap-3">
               <svg className="w-8 h-8 text-[#b975ff]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h-2zm0 6h2v2h-2z"/></svg>
               <span className="text-[#1e1e1e] font-medium text-[20px]">Dental practices</span>
            </div>
            <div className="flex items-center gap-3">
               <svg className="w-8 h-8 text-[#b975ff]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
               <span className="text-[#1e1e1e] font-medium text-[20px]">Chiropractors</span>
            </div>
            <div className="flex items-center gap-3">
               <svg className="w-8 h-8 text-[#b975ff]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z M13 14h-2v-2h2v2zm0-4h-2V8h2v2z"/></svg>
               <span className="text-[#1e1e1e] font-medium text-[20px]">NDIS providers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section className="py-24 bg-[#fbfbfb] relative">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="w-full lg:w-[55%] relative">
              <div className="rounded-3xl overflow-hidden relative shadow-2xl">
                <img 
                  src="/stressed-receptionist.png" 
                  alt="Stressed Receptionist" 
                  className="w-full h-auto object-cover rounded-3xl"
                />
                
                {/* 118 Badge */}
                <div className="absolute top-[20%] left-[-15px] z-10 w-[120px] shadow-2xl rotate-[-8deg] bg-white rounded-xl p-3 flex items-center justify-center border-t border-gray-100">
                  <svg className="w-full h-auto text-[#e2cbfb]" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <div className="absolute top-[-15px] right-[-15px] w-10 h-10 bg-[#9333ea] rounded-full text-white text-[16px] font-bold flex items-center justify-center shadow-lg">118</div>
                </div>

                {/* Stars Badge */}
                <div className="absolute top-[20%] right-[-15px] md:right-[-25px] bg-white rounded-2xl shadow-xl p-5 border border-gray-50 flex flex-col gap-2.5 z-10 hidden sm:flex">
                   <div className="flex gap-1 text-[24px]">
                     <span className="text-[#a824fa]">★</span><span className="text-[#a824fa] opacity-20">★</span><span className="text-[#a824fa] opacity-20">★</span><span className="text-[#a824fa] opacity-20">★</span><span className="text-[#a824fa] opacity-20">★</span>
                   </div>
                   <div className="w-24 h-2 bg-[#d8b4fe] rounded-full"></div>
                   <div className="w-16 h-2 bg-[#d8b4fe] rounded-full"></div>
                </div>

                {/* Angry Emoji Badges */}
                <div className="absolute bottom-[20%] right-[-10px] md:right-[20%] flex gap-3 z-10 hidden sm:flex">
                  <div className="bg-white rounded-2xl p-3.5 shadow-xl border border-gray-50">
                    <svg className="w-10 h-10 text-[#a824fa]" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8 15h8 M9 9h.01 M15 9h.01"/></svg>
                  </div>
                  <div className="bg-[#cd9cff] rounded-2xl p-3.5 shadow-xl border border-purple-300">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8 15h8 M9 9h.01 M15 9h.01"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[45%]">
              <h2 className="text-[44px] md:text-[56px] font-bold text-[#1e1e1e] leading-[1.1] mb-10 tracking-tight">
                Your Front Desk<br/>Is Losing You Money
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-7 h-7 text-[#a824fa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5"/></svg>
                  </div>
                  <span className="text-[20px] text-[#1e1e1e] font-medium leading-snug">Missed calls during peak hours</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-7 h-7 text-[#a824fa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5"/></svg>
                  </div>
                  <span className="text-[20px] text-[#1e1e1e] font-medium leading-snug">Slow response times killing conversions</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-7 h-7 text-[#a824fa]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5"/></svg>
                  </div>
                  <span className="text-[20px] text-[#1e1e1e] font-medium leading-snug">Admin overload from bookings + follow-ups</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== MEET HAYLO ===== */}
      <section id="solution" className="py-24 bg-[#f8eced]">
        {/* We use a soft reddish/pink hex #f8eced matching Figma background below problem section? Wait it's `#fdfafc` or just #f4effc */}
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 justify-between">
            
            <div className="w-full lg:w-[48%]">
              <h2 className="text-[44px] md:text-[56px] font-bold text-[#1e1e1e] leading-[1.1] mb-6 tracking-tight">
                Meet <span className="text-[#a824fa]">Haylo</span>,<br/>
                Your 24/7 AI Receptionist
              </h2>
              <p className="text-[18px] md:text-[20px] text-gray-600 mb-12 max-w-[500px] leading-relaxed">
                Haylo handles every patient call for your clinic — answering instantly,
                booking appointments, and managing admin tasks so your team can
                focus on care, not phones.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-10">
                <div>
                  <div className="flex gap-1 text-[24px] mb-2 text-[#cd9cff]">
                    ★ ★ ★ ★ ★
                  </div>
                  <div className="text-[18px] font-bold mb-3 mt-1 text-[#1e1e1e]">5.0 <span className="text-[15px] font-normal text-gray-500">/ 5 rating</span></div>
                  <div className="font-medium text-[#1e1e1e] mb-1">24/7 Availability</div>
                  <div className="text-gray-500">Never miss a patient call</div>
                </div>
                <div>
                  <div className="flex gap-1 text-[24px] mb-2 text-[#cd9cff]">
                    ★ ★ ★ ★ ★
                  </div>
                  <div className="text-[18px] font-bold mb-3 mt-1 text-[#1e1e1e]">5.0 <span className="text-[15px] font-normal text-gray-500">/ 5 rating</span></div>
                  <div className="font-medium text-[#1e1e1e] mb-1">Instant Response</div>
                  <div className="text-gray-500">Every call answered in seconds</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[45%] flex flex-col gap-10">
              <div className="flex gap-6">
                <div className="w-[60px] h-[60px] rounded-sm bg-[#ebd5ff] flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-[#1e1e1e]" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </div>
                <div>
                  <h4 className="text-[20px] font-bold text-[#1e1e1e] mb-2">Call Handling</h4>
                  <p className="text-[#6b7280] leading-snug">Answers every inbound call instantly<br/>No more missed opportunities</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-[60px] h-[60px] rounded-sm bg-[#ebd5ff] flex items-center justify-center shrink-0">
                   <svg className="w-7 h-7 text-[#1e1e1e]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z M7 12h5v5H7v-5z"/></svg>
                </div>
                <div>
                  <h4 className="text-[20px] font-bold text-[#1e1e1e] mb-2">Smart Booking</h4>
                  <p className="text-[#6b7280] leading-snug">Books appointments directly into your calendar<br/>Syncs seamlessly with your existing systems</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-[60px] h-[60px] rounded-sm bg-[#ebd5ff] flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-[#1e1e1e]" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                </div>
                <div>
                  <h4 className="text-[20px] font-bold text-[#1e1e1e] mb-2">Patient Communication</h4>
                  <p className="text-[#6b7280] leading-snug">Sends SMS confirmations and reminders<br/>Helps reduce no-shows automatically</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-[60px] h-[60px] rounded-sm bg-[#ebd5ff] flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-[#1e1e1e]" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                </div>
                <div>
                  <h4 className="text-[20px] font-bold text-[#1e1e1e] mb-2">Admin Automation</h4>
                  <p className="text-[#6b7280] leading-snug">Handles FAQs, rescheduling, and cancellations<br/>Frees up your front desk from repetitive tasks</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== 5 PURPLE CARDS BELT (NEW) ===== */}
      <section className="py-24 bg-[#f4f5f5]">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#cd9cff] rounded-[24px] p-8 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto lg:aspect-square">
              <div className="bg-white rounded-full w-[72px] h-[72px] flex items-center justify-center mb-6 shadow-sm shrink-0">
                <svg className="w-8 h-8 text-[#1e1e1e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /><path d="M15 12a3 3 0 11-6 0" /></svg>
              </div>
              <h4 className="font-medium text-[#1e1e1e] text-[20px] leading-snug mb-2">Increase bookings<br/>without hiring more staff</h4>
            </div>

            {/* Card 2 */}
            <div className="bg-[#cd9cff] rounded-[24px] p-8 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto lg:aspect-square">
              <div className="bg-white rounded-full w-[72px] h-[72px] flex items-center justify-center mb-6 shadow-sm shrink-0">
                 <svg className="w-8 h-8 text-[#1e1e1e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M15 9l-6 6M21 15v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2h4l2 5-2.5 1.5a11 11 0 005 5L16 12l5 2z"/></svg>
              </div>
              <h4 className="font-medium text-[#1e1e1e] text-[20px] leading-snug mb-2">Capture missed revenue<br/>from unanswered calls</h4>
            </div>

            {/* Card 3 */}
            <div className="bg-[#cd9cff] rounded-[24px] p-8 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto lg:aspect-square">
               <div className="bg-white rounded-full w-[72px] h-[72px] flex items-center justify-center mb-6 shadow-sm shrink-0">
                 <svg className="w-8 h-8 text-[#1e1e1e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19h16M4 15h16M8 15v4M16 15v4M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
              </div>
              <h4 className="font-medium text-[#1e1e1e] text-[20px] leading-snug mb-2">Reduce front desk<br/>burnout</h4>
            </div>

            {/* Card 4 */}
            <div className="bg-[#cd9cff] rounded-[24px] p-8 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto lg:aspect-square">
               <div className="bg-white rounded-full w-[72px] h-[72px] flex items-center justify-center mb-6 shadow-sm shrink-0">
                 <svg className="w-8 h-8 text-[#1e1e1e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/><path d="M12 5v4M10 7h4"/></svg>
              </div>
              <h4 className="font-medium text-[#1e1e1e] text-[20px] leading-snug mb-2">Improve patient<br/>experience instantly</h4>
            </div>

            {/* Card 5 */}
            <div className="bg-[#cd9cff] rounded-[24px] p-8 flex flex-col items-center justify-center text-center aspect-square md:aspect-auto lg:aspect-square">
               <div className="bg-white rounded-full w-[72px] h-[72px] flex items-center justify-center mb-6 shadow-sm shrink-0">
                 <svg className="w-8 h-8 text-[#1e1e1e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h4 className="font-medium text-[#1e1e1e] text-[20px] leading-snug mb-2">Operate 24/7<br/>without extra costs</h4>
            </div>

          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (ILLUSTRATIONS) ===== */}
      <section id="how-it-works" className="py-24 md:py-32 px-6 lg:px-8 bg-[#fdfdfd]">
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-12">
            <div className="flex flex-col items-center">
              <div className="mb-10 w-full max-w-[360px]">
                <img src="/ai-call-handling.png" alt="AI Call Handling" className="w-full h-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-[28px] md:text-[32px] font-bold text-[#1e1e1e] mb-3 text-center">AI Call Handling</h3>
              <p className="text-[18px] text-[#8e8e8e] text-center font-medium">Answers every call, every time</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-10 w-full max-w-[360px]">
                <img src="/appointment-booking.png" alt="Appointment Booking" className="w-full h-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-[28px] md:text-[32px] font-bold text-[#1e1e1e] mb-3 text-center">Appointment Booking</h3>
              <p className="text-[18px] text-[#8e8e8e] text-center font-medium">Books patients instantly</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-10 w-full max-w-[360px]">
                <img src="/patient-followup.png" alt="Patient Follow-Up" className="w-full h-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-[28px] md:text-[32px] font-bold text-[#1e1e1e] mb-3 text-center">Patient Follow-Up</h3>
              <p className="text-[18px] text-[#8e8e8e] text-center font-medium">Automated reminders & confirmations</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS AND TESTIMONIALS (4-COL MASONRY GRID) ===== */}
      <section className="pb-32 pt-10 px-6 lg:px-8 bg-[#fdfdfd]">
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            
            {/* ROW 1 */}
            
            {/* 37% (col 1) */}
            <div className="bg-[#f0edf5] p-8 md:p-10 flex flex-col justify-center border border-gray-100 col-span-1 shadow-sm rounded-none">
              <div className="text-[72px] lg:text-[88px] font-bold text-[#1e1e1e] leading-none mb-4 tracking-[-0.03em] font-sans">37%</div>
              <div className="text-[20px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug">Increase in<br/>recovered calls</div>
            </div>
            
            {/* 60% (col 2) */}
            <div className="bg-[#cd9cff] p-8 md:p-10 flex flex-col justify-center col-span-1 rounded-none">
              <div className="text-[72px] lg:text-[88px] font-bold text-[#1e1e1e] leading-none mb-4 tracking-[-0.03em] font-sans">60%</div>
              <div className="text-[20px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug">Reduction in<br/>admin workload</div>
            </div>

            {/* Testimonial 1 (col 3+4) */}
            <div className="bg-[#f9fafb] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 col-span-1 md:col-span-2 lg:col-span-2 rounded-none">
              <img src="/testimonial-doctor.png" alt="Clinic Owner" className="w-[140px] h-[140px] md:w-[180px] md:h-full object-cover shrink-0 grayscale aspect-square" />
              <div className="flex flex-col justify-center py-2 h-full">
                <p className="text-[20px] lg:text-[22px] text-[#2c323f] leading-relaxed mb-8 font-light">
                  "Reception used to get overwhelmed during busy periods. Haylo has taken a huge amount of pressure off the team."
                </p>
                <div>
                  <div className="font-bold text-[#1e1e1e] text-[20px]">Clinic Owner</div>
                  <div className="text-[#1e1e1e] text-[18px]">Allied Health Practice</div>
                </div>
              </div>
            </div>

            {/* ROW 2 */}

            {/* Testimonial 2 (col 1+2) */}
            <div className="bg-[#f9fafb] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 col-span-1 md:col-span-2 lg:col-span-2 rounded-none">
              <img src="/testimonial-doctor.png" alt="Practice Manager" className="w-[140px] h-[140px] md:w-[180px] md:h-full object-cover shrink-0 grayscale aspect-square" />
              <div className="flex flex-col justify-center py-2 h-full">
                <p className="text-[20px] lg:text-[22px] text-[#2c323f] leading-relaxed mb-8 font-light">
                  "Before Haylo we were constantly missing calls during treatment hours. Now every enquiry gets handled and our bookings are much more consistent."
                </p>
                <div>
                  <div className="font-bold text-[#1e1e1e] text-[20px]">Practice Manager</div>
                  <div className="text-[#1e1e1e] text-[18px]">Physiotherapy Clinic</div>
                </div>
              </div>
            </div>

            {/* 14 Days (col 3) */}
            <div className="bg-[#b975ff] p-8 md:p-10 flex flex-col justify-between text-white col-span-1 rounded-none">
              <div className="text-[72px] lg:text-[88px] font-bold leading-none tracking-[-0.03em] flex items-baseline font-sans mt-3">
                14<span className="text-[32px] lg:text-[36px] font-medium ml-1">Days</span>
              </div>
              <div className="text-[20px] lg:text-[22px] font-medium leading-snug mt-auto mb-2 lg:mt-12">Boost<br/>in bookings</div>
            </div>

            {/* 24/7 (col 4) */}
            <div className="bg-white border border-gray-100 p-8 md:p-10 flex flex-col justify-between col-span-1 shadow-sm rounded-none">
              <div className="text-[72px] lg:text-[88px] font-bold text-[#1e1e1e] leading-none tracking-[-0.03em] font-sans mt-3">24/7</div>
              <div className="text-[20px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug mt-auto mb-2 lg:mt-12">Continuous<br/>patient support</div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== CTA AND FORM SECTION ===== */}
      <section id="contact" className="py-24 md:py-32 bg-[#eaddff]">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            <div className="flex-1">
              <h2 className="text-[48px] md:text-[64px] font-bold text-[#1e1e1e] leading-tight tracking-tight mb-8">
                Stop losing<br />patients.
              </h2>
              <p className="text-[20px] text-[#4b5563] mb-6 leading-[1.6] max-w-xl">
                Every missed call is a lost booking. Haylo answers
                instantly, books appointments, and keeps your clinic
                running smoothly — even after hours.
              </p>
              <p className="text-[20px] text-[#4b5563] mb-12 leading-[1.6] max-w-xl">
                Never let another patient go elsewhere because no
                one picked up.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="bg-[#a824fa] text-white px-9 py-4 rounded-full hover:bg-[#911fdb] transition font-bold text-[16px]"
                >
                  Book a Demo
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="bg-transparent border border-[#a824fa] text-[#a824fa] px-9 py-4 rounded-full hover:bg-white/30 transition font-bold text-[16px]"
                >
                  Hear Haylo in Action
                </button>
              </div>
            </div>

            <div className="flex-1 lg:max-w-[500px]">
              <div className="bg-[#f3ebfa] rounded-[32px] p-10">
                <h3 className="text-[32px] font-bold text-[#1e1e1e] mb-8">Get Started</h3>
                
                {contactStatus === 'success' ? (
                  <div className="py-8 text-center bg-white rounded-2xl p-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="font-bold text-gray-900 mb-2">Message Sent!</p>
                    <p className="text-gray-600">We will be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={submitContactForm} className="space-y-6">
                    <div>
                      <label className="block text-[15px] font-medium text-[#4b5563] mb-2">Email</label>
                      <input
                        required
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-[#e7d9f6] border-0 rounded-2xl focus:ring-2 focus:ring-[#a824fa] outline-none text-[#1e1e1e] placeholder-gray-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-medium text-[#4b5563] mb-2">Message</label>
                      <textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-5 py-4 bg-[#e7d9f6] border-0 rounded-2xl focus:ring-2 focus:ring-[#a824fa] outline-none text-[#1e1e1e] placeholder-gray-500 min-h-[140px] resize-none"
                        placeholder="What are you say ?"
                      />
                    </div>

                    <button
                      disabled={contactStatus === 'submitting'}
                      type="submit"
                      className="w-full bg-[#bd7eff] hover:bg-[#a824fa] text-white py-4 rounded-2xl font-bold transition flex items-center justify-center text-[16px]"
                    >
                      {contactStatus === 'submitting' ? 'Sending...' : 'Request Demo'}
                    </button>
                    {contactStatus === 'error' && (
                      <p className="text-red-500 text-sm mt-3 text-center">There was an error sending your message.</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#cfbdff] pt-24 pb-12 px-6 lg:px-8">
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            
            <div className="md:col-span-5 lg:col-span-4">
              <div className="flex items-center gap-1 mb-8">
                <span className="font-bold text-[36px] tracking-tight">HAYLO</span>
                <span className="text-[#1e1e1e] flex items-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path fill="#cfbdff" d="M12 6l1.5 4.5L18 12l-4.5 1.5L12 18l-1.5-4.5L6 12l4.5-1.5z"/></svg>
                </span>
              </div>
              <p className="text-[#374151] font-medium text-[16px] mb-6">Get started now try our product</p>
              
              <div className="flex bg-[#e8deff] rounded-full overflow-hidden p-[6px] max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email here"
                  className="flex-1 px-5 py-3 bg-transparent border-0 outline-none text-[#1e1e1e] placeholder-[#6b7280] text-[15px]"
                />
                <button className="bg-[#b975ff] w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-[#a824fa] transition">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 flex flex-wrap gap-12 sm:gap-16 lg:gap-24 lg:justify-end">
              <div>
                <h4 className="font-bold text-[#1e1e1e] mb-6 text-[18px]">Support</h4>
                <ul className="space-y-4 text-[16px] text-[#374151]">
                  <li><a href="#" className="hover:text-purple-700 transition">Help centre</a></li>
                  <li><a href="#" className="hover:text-purple-700 transition">Account information</a></li>
                  <li><a href="#" className="hover:text-purple-700 transition">About</a></li>
                  <li><a href="#" className="hover:text-purple-700 transition">Contact us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#1e1e1e] mb-6 text-[18px]">Help and Solution</h4>
                <ul className="space-y-4 text-[16px] text-[#374151]">
                  <li><a href="#" className="hover:text-purple-700 transition">Talk to support</a></li>
                  <li><a href="#" className="hover:text-purple-700 transition">Support docs</a></li>
                  <li><a href="#" className="hover:text-purple-700 transition">System status</a></li>
                  <li><a href="#" className="hover:text-purple-700 transition">Covid responde</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#1e1e1e] mb-6 text-[18px]">Product</h4>
                <ul className="space-y-4 text-[16px] text-[#374151]">
                  <li><a href="#" className="hover:text-purple-700 transition">Update</a></li>
                  <li><a href="#" className="hover:text-purple-700 transition">Security</a></li>
                  <li><a href="#" className="hover:text-purple-700 transition">Beta test</a></li>
                  <li><a href="#" className="hover:text-purple-700 transition">Pricing product</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[15px] text-[#555a64] pt-8">
            <p>© 2025 Haylo. Copyright and rights reserved</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#1e1e1e] transition">Terms and Conditions</a>
              <Link href="/privacy-policy" className="hover:text-[#1e1e1e] transition">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== BOOK A DEMO MODAL ===== */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 md:p-10 relative shadow-2xl">
            <button
              onClick={() => { setDemoModalOpen(false); setDemoStatus('idle'); }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-[28px] font-bold text-[#1e1e1e] mb-3">Book a Demo</h3>
            <p className="text-[16px] text-gray-500 mb-8">Enter your details and our team will get in touch to show you how Haylo can automate your clinic.</p>

            {demoStatus === 'success' ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-[24px] font-bold text-gray-900 mb-2">Request Submitted!</h4>
                <p className="text-[16px] text-gray-600 mb-8">We've received your details and will be in touch shortly.</p>
                <button
                  onClick={() => { setDemoModalOpen(false); setDemoStatus('idle'); }}
                  className="bg-[#a824fa] text-white w-full py-4 rounded-xl font-bold hover:bg-[#911fdb] transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitDemoForm} className="space-y-5">
                <div>
                  <label className="block text-[15px] font-medium text-gray-700 mb-2">Full Name *</label>
                  <input required type="text" value={demoForm.fullName} onChange={e => setDemoForm({ ...demoForm, fullName: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="Jane Doe" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[15px] font-medium text-gray-700 mb-2">Mobile *</label>
                    <input required type="tel" value={demoForm.mobile} onChange={e => setDemoForm({ ...demoForm, mobile: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="+61 400 000 000" />
                  </div>
                  <div>
                    <label className="block text-[15px] font-medium text-gray-700 mb-2">Email *</label>
                    <input required type="email" value={demoForm.email} onChange={e => setDemoForm({ ...demoForm, email: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="jane@clinic.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-[15px] font-medium text-gray-700 mb-2">Company / Clinic Name</label>
                  <input type="text" value={demoForm.company} onChange={e => setDemoForm({ ...demoForm, company: e.target.value })} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="Radiance MedSpa" />
                </div>

                <div className="pt-4">
                  <button
                    disabled={demoStatus === 'submitting'}
                    type="submit"
                    className="w-full bg-[#a824fa] hover:bg-[#911fdb] text-white py-4 rounded-xl font-bold transition flex items-center justify-center text-[16px] disabled:opacity-70"
                  >
                    {demoStatus === 'submitting' ? 'Submitting...' : 'Request Demo'}
                  </button>
                </div>
                {demoStatus === 'error' && (
                  <p className="text-red-500 text-sm text-center">There was an error submitting. Please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}