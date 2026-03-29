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
            <div className="flex items-center gap-2">
              <img src="/haylo-logo.jpg" alt="Haylo Logo" className="h-9 md:h-11 w-auto mix-blend-multiply" />
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
              <div className="absolute top-[10%] -left-4 md:-left-12 z-20">
                <div className="flex items-center gap-3 bg-[#a824fa] text-white px-5 py-3.5 rounded-2xl shadow-xl">
                   <div className="flex items-center justify-center border border-white/20 rounded-full w-6 h-6 shrink-0 text-xs font-bold font-serif">!</div>
                  <span className="font-semibold text-[15px]">Dental practices</span>
                </div>
              </div>

              {/* Physio Tag */}
              <div className="absolute bottom-[10%] -right-4 md:-right-8 z-20">
                <div className="flex items-center gap-3 bg-[#a824fa] text-white px-5 py-3.5 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>
                  </div>
                  <span className="font-semibold text-[15px]">Physiotherapy Clinics</span>
                </div>
              </div>

              {/* Central Image inside white box container */}
              <div className="relative z-10 bg-white aspect-square shadow-sm w-full max-w-[500px] flex items-center justify-center">
                 <img
                  src="/hero-phone.png"
                  alt="Phone Mockup"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES / HOW IT WORKS (ILLUSTRATIONS) ===== */}
      <section id="how-it-works" className="py-20 md:py-32 px-6 lg:px-12 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="mb-10 w-full rounded-3xl overflow-hidden aspect-square bg-[#f9fafb] flex items-center justify-center">
                <img src="/ai-call-handling.png" alt="AI Call Handling" className="w-[85%] h-[85%] object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-[28px] font-bold text-[#1e1e1e] mb-3 text-center">AI Call Handling</h3>
              <p className="text-[18px] text-gray-500 text-center">Answers every call, every time</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-10 w-full rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
                <img src="/appointment-booking.png" alt="Appointment Booking" className="w-[85%] h-[85%] object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-[28px] font-bold text-[#1e1e1e] mb-3 text-center">Appointment Booking</h3>
              <p className="text-[18px] text-gray-500 text-center">Books patients instantly</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-10 w-full rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
                <img src="/patient-followup.png" alt="Patient Follow-Up" className="w-[85%] h-[85%] object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-[28px] font-bold text-[#1e1e1e] mb-3 text-center">Patient Follow-Up</h3>
              <p className="text-[18px] text-gray-500 text-center">Automated reminders & confirmations</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS AND TESTIMONIALS GRID ===== */}
      <section className="py-16 md:py-24 px-6 lg:px-12 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Row 1, Col 1 */}
            <div className="bg-[#f9fafb] rounded-[32px] p-10 flex flex-col justify-center">
              <div className="text-[64px] md:text-[80px] font-bold text-[#1e1e1e] leading-none mb-4 tracking-[-0.03em]">37%</div>
              <div className="text-[20px] text-[#4b5563] font-medium leading-snug">Increase in<br/>recovered calls</div>
            </div>
            
            {/* Row 1, Col 2 */}
            <div className="bg-[#b975ff] rounded-[32px] p-10 flex flex-col justify-center text-white">
              <div className="text-[64px] md:text-[80px] font-bold leading-none mb-4 tracking-[-0.03em]">60%</div>
              <div className="text-[20px] font-medium leading-snug text-white/90">Reduction in<br/>admin workload</div>
            </div>

            {/* Row 1, Col 3 - Testimonial 1 */}
            <div className="bg-[#f9fafb] rounded-[32px] p-10 flex flex-col justify-between">
              <p className="text-[18px] text-[#4b5563] italic leading-relaxed mb-10">
                &ldquo;Reception used to get overwhelmed during busy periods. Haylo has taken a huge amount of pressure off the team.&rdquo;
              </p>
              <div className="flex items-center gap-5">
                <img src="/testimonial-doctor.png" alt="Clinic Owner" className="w-16 h-16 rounded-xl object-cover grayscale" />
                <div>
                  <div className="font-bold text-[#1e1e1e] text-[18px]">Clinic Owner</div>
                  <div className="text-[#6b7280] text-[15px]">Allied Health Practice</div>
                </div>
              </div>
            </div>

            {/* Row 2, Col 1 - Testimonial 2 */}
            <div className="bg-[#f9fafb] rounded-[32px] p-10 flex flex-col justify-between lg:col-start-1">
              <p className="text-[18px] text-[#4b5563] italic leading-relaxed mb-10">
                &ldquo;Before Haylo we were constantly missing calls during treatment hours. Now every enquiry gets handled and our bookings are much more consistent.&rdquo;
              </p>
              <div className="flex items-center gap-5">
                <img src="/testimonial-doctor.png" alt="Practice Manager" className="w-16 h-16 rounded-xl object-cover grayscale" />
                <div>
                  <div className="font-bold text-[#1e1e1e] text-[18px]">Practice Manager</div>
                  <div className="text-[#6b7280] text-[15px]">Physiotherapy Clinic</div>
                </div>
              </div>
            </div>

            {/* Row 2, Col 2 */}
            <div className="bg-[#b975ff] rounded-[32px] p-10 flex flex-col justify-between text-white lg:col-start-2">
              <div className="text-[64px] md:text-[80px] font-bold leading-none tracking-[-0.03em] flex items-baseline">
                14<span className="text-[32px] md:text-[40px] font-normal ml-2">Days</span>
              </div>
              <div className="text-[20px] font-medium leading-snug text-white/90 mt-8">Boost<br/>in bookings</div>
            </div>

            {/* Row 2, Col 3 */}
            <div className="bg-[#ffffff] border border-gray-100 rounded-[32px] p-10 flex flex-col justify-between lg:col-start-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
              <div className="text-[64px] md:text-[80px] font-bold text-[#1e1e1e] leading-none tracking-[-0.03em]">24/7</div>
              <div className="text-[20px] text-[#4b5563] font-medium leading-snug mt-8">Continuous<br/>patient support</div>
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