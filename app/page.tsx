'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  
  // Book a demo modal state
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ fullName: '', email: '', mobile: '', company: '', address: '' });
  const [demoStatus, setDemoStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Contact form state
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
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden selection:bg-purple-200">
      {/* ===== NAVIGATION ===== */}
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${headerScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[36px] tracking-tight">HAYLO</span>
                <span className="text-[#a824fa]"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="text-gray-600 hover:text-[#9b51e0] transition font-medium text-[15px]">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="text-gray-600 hover:text-[#9b51e0] transition font-medium text-[15px]">About Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('solution'); }} className="text-gray-600 hover:text-[#9b51e0] transition font-medium text-[15px]">Solution</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="text-gray-600 hover:text-[#9b51e0] transition font-medium text-[15px]">FAQs</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="text-gray-600 hover:text-[#9b51e0] transition font-medium text-[15px]">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="hidden md:flex items-center justify-center bg-[#a824fa] hover:bg-[#911fdb] text-white px-7 py-3 rounded-full transition font-semibold text-[15px]"
              >
                Book A Demo
              </button>
              <Link href="/login" className="hidden md:flex w-11 h-11 bg-[#a824fa] hover:bg-[#911fdb] rounded-full items-center justify-center transition">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-700">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 py-4 flex flex-col gap-2">
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50">About Us</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('solution'); }} className="text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50">Solution</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }} className="text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50">FAQs</a>
              <button onClick={() => { setDemoModalOpen(true); setMobileMenuOpen(false); }} className="bg-[#a824fa] text-white w-full py-4 rounded-xl font-bold mt-4">Book A Demo</button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 lg:px-12 bg-[#f4effc] relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
            <div className="flex-1 text-left">
              <h1 className="text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] font-bold text-[#1e1e1e] mb-6 leading-[1.05] tracking-tight">
                Never Miss<br />Another Patient<br />Call Again
              </h1>
              <p className="text-[17px] md:text-[20px] text-gray-600 max-w-[540px] mb-10 leading-[1.6]">
                Haylo is your AI receptionist for Allied Health clinics across Australia.
                It answers calls, books appointments, and handles admin so
                your front desk doesn&apos;t burn out.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="bg-[#a824fa] text-white px-8 py-4 rounded-full hover:bg-[#911fdb] transition font-bold text-[16px]"
                >
                  Book a Demo
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="bg-transparent border border-[#a824fa] text-[#a824fa] px-8 py-4 rounded-full hover:bg-purple-50 transition font-bold text-[16px]"
                >
                  Listen to a Live Call
                </button>
              </div>
            </div>

            <div className="flex-1 relative flex justify-center items-center w-full min-h-[500px]">
              {/* Dental Tag */}
              <div className="absolute top-[20%] left-[-10px] md:top-[25%] md:left-0 lg:left-[-60px] z-20">
                <div className="flex items-center gap-3 bg-[#a824fa] text-white px-5 py-3.5 rounded-full shadow-2xl">
                  <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#a824fa]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7a5 5 0 00-10 0v2H7a5 5 0 000 10h10a5 5 0 000-10h-2V7z M9 9V7a3 3 0 016 0v2H9z"/></svg>
                  </div>
                  <span className="font-semibold text-[16px] pr-2">Dental practices</span>
                </div>
              </div>

              {/* Physio Tag */}
              <div className="absolute bottom-[20%] right-[-10px] md:bottom-[15%] md:right-0 lg:right-[-40px] z-20">
                <div className="flex items-center gap-3 bg-[#c788fd] text-white px-5 py-3.5 rounded-full shadow-2xl">
                  <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#c788fd]" viewBox="0 0 24 24" fill="currentColor"><path d="M3 14h18v2H3zm16-4V8h-2v2h-4V8h-2v2H7V8H5v2H3v2h18v-2h-2z M10 4c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/></svg>
                  </div>
                  <span className="font-semibold text-[16px] pr-2">Physiotherapy Clinics</span>
                </div>
              </div>

              {/* Central Image inside white box container */}
              <div className="relative z-10 w-full max-w-[340px] md:max-w-[420px] lg:max-w-[480px] flex items-center justify-center">
                 <img
                  src="/hero-phone.png"
                  alt="Phone Mockup"
                  className="w-full h-auto object-contain mix-blend-multiply drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES / HOW IT WORKS (ILLUSTRATIONS) ===== */}
      <section id="how-it-works" className="py-20 md:py-32 px-6 lg:px-12 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            <div className="flex flex-col items-center">
              <div className="mb-8 w-[95%]">
                <img src="/ai-call-handling.png" alt="AI Call Handling" className="w-full h-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-[26px] md:text-[32px] font-bold text-[#1e1e1e] mb-2 text-center">AI Call Handling</h3>
              <p className="text-[18px] text-[#8e8e8e] text-center font-medium">Answers every call, every time</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-8 w-[95%]">
                <img src="/appointment-booking.png" alt="Appointment Booking" className="w-full h-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-[26px] md:text-[32px] font-bold text-[#1e1e1e] mb-2 text-center">Appointment Booking</h3>
              <p className="text-[18px] text-[#8e8e8e] text-center font-medium">Books patients instantly</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-8 w-[95%]">
                <img src="/patient-followup.png" alt="Patient Follow-Up" className="w-full h-auto object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-[26px] md:text-[32px] font-bold text-[#1e1e1e] mb-2 text-center">Patient Follow-Up</h3>
              <p className="text-[18px] text-[#8e8e8e] text-center font-medium">Automated reminders & confirmations</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS AND TESTIMONIALS GRID ===== */}
      <section className="py-16 md:py-24 px-6 lg:px-12 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            
            {/* ROW 1 */}
            
            {/* 37% (col 1) */}
            <div className="bg-white p-8 md:p-10 flex flex-col justify-center border border-gray-100 col-span-1 shadow-[0_4px_30px_rgba(0,0,0,0.03)] rounded-[32px]">
              <div className="text-[72px] lg:text-[88px] font-bold text-[#1e1e1e] leading-none mb-4 tracking-[-0.03em] font-sans">37%</div>
              <div className="text-[20px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug">Increase in<br/>recovered calls</div>
            </div>
            
            {/* 60% (col 2) */}
            <div className="bg-[#ebd5ff] p-8 md:p-10 flex flex-col justify-center col-span-1 rounded-[32px]">
              <div className="text-[72px] lg:text-[88px] font-bold text-[#1e1e1e] leading-none mb-4 tracking-[-0.03em] font-sans">60%</div>
              <div className="text-[20px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug">Reduction in<br/>admin workload</div>
            </div>

            {/* Testimonial 1 (col 3+4) */}
            <div className="bg-[#f9fafb] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 col-span-1 md:col-span-2 lg:col-span-2 rounded-[32px]">
              <img src="/testimonial-doctor.png" alt="Clinic Owner" className="w-[140px] h-[140px] md:w-[220px] md:h-full object-cover shrink-0 grayscale aspect-square" />
              <div className="flex flex-col justify-center py-2 h-full">
                <p className="text-[20px] lg:text-[24px] text-[#4b5563] leading-relaxed mb-8 md:mb-12 font-light">
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
            <div className="bg-[#f9fafb] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 col-span-1 md:col-span-2 lg:col-span-2 rounded-[32px]">
              <img src="/testimonial-doctor.png" alt="Practice Manager" className="w-[140px] h-[140px] md:w-[220px] md:h-full object-cover shrink-0 grayscale aspect-square" />
              <div className="flex flex-col justify-center py-2 h-full">
                <p className="text-[20px] lg:text-[24px] text-[#4b5563] leading-relaxed mb-8 md:mb-12 font-light">
                  "Before Haylo we were constantly missing calls during treatment hours. Now every enquiry gets handled and our bookings are much more consistent."
                </p>
                <div>
                  <div className="font-bold text-[#1e1e1e] text-[20px]">Practice Manager</div>
                  <div className="text-[#1e1e1e] text-[18px]">Physiotherapy Clinic</div>
                </div>
              </div>
            </div>

            {/* 14 Days (col 3) */}
            <div className="bg-[#b975ff] p-8 md:p-10 flex flex-col justify-between text-white col-span-1 rounded-[32px]">
              <div className="text-[72px] lg:text-[88px] font-bold leading-none tracking-[-0.03em] flex items-baseline font-sans">
                14<span className="text-[32px] lg:text-[36px] font-medium ml-1">Days</span>
              </div>
              <div className="text-[20px] lg:text-[22px] font-medium leading-snug mt-auto mb-2 lg:mt-16">Boost<br/>in bookings</div>
            </div>

            {/* 24/7 (col 4) */}
            <div className="bg-white border border-gray-100 p-8 md:p-10 flex flex-col justify-between col-span-1 shadow-[0_4px_30px_rgba(0,0,0,0.03)] rounded-[32px]">
              <div className="text-[72px] lg:text-[88px] font-bold text-[#1e1e1e] leading-none tracking-[-0.03em] font-sans">24/7</div>
              <div className="text-[20px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug mt-auto mb-2 lg:mt-16">Continuous<br/>patient support</div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== CTA AND FORM SECTION ===== */}
      <section id="contact" className="py-24 md:py-32 bg-[#eaddff]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
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
                  className="bg-[#a824fa] text-white px-8 py-4 rounded-full hover:bg-[#911fdb] transition font-bold text-[16px]"
                >
                  Book a Demo
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="bg-transparent border border-[#a824fa] text-[#a824fa] px-8 py-4 rounded-full hover:bg-white/30 transition font-bold text-[16px]"
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
                        className="w-full px-5 py-4 bg-[#e7d9f6] border-0 rounded-2xl focus:ring-2 focus:ring-[#9b51e0] outline-none text-[#1e1e1e] placeholder-gray-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-medium text-[#4b5563] mb-2">Message</label>
                      <textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full px-5 py-4 bg-[#e7d9f6] border-0 rounded-2xl focus:ring-2 focus:ring-[#9b51e0] outline-none text-[#1e1e1e] placeholder-gray-500 min-h-[140px] resize-none"
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
      <footer className="bg-[#cfbdff] pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            
            <div className="md:col-span-5 lg:col-span-4">
              <img src="/haylo-logo.jpg" alt="Haylo" className="h-10 w-auto mb-8 mix-blend-multiply" />
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