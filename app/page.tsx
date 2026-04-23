'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import {
  AlliedHealthSection,
  HeroSection,
  ProblemSection,
  SolutionSection,
} from '@/components/landing/AboveTheFoldSections';
import {
  BenefitsSection,
  ContactSection,
  FAQSection,
  HowItWorksSection,
  LandingFooter,
  StatsTestimonialsSection,
} from '@/components/landing/BelowTheFoldSections';
import { DemoModal } from '@/components/landing/DemoModal';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import type { DemoFormData, FormStatus } from '@/components/landing/types';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState<DemoFormData>({
    fullName: '',
    email: '',
    mobile: '',
    company: '',
  });
  const [demoStatus, setDemoStatus] = useState<FormStatus>('idle');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<FormStatus>('idle');

  const submitDemoForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDemoStatus('submitting');

    try {
      const res = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoForm),
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

  const submitContactForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactStatus('submitting');

    try {
      const res = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Contact Form',
          email: contactEmail,
          message: contactMessage,
        }),
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const openDemoModal = () => {
    setDemoModalOpen(true);
  };

  const closeDemoModal = () => {
    setDemoModalOpen(false);
    setDemoStatus('idle');
  };

  const handleDemoFormChange = (field: keyof DemoFormData, value: string) => {
    setDemoForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden selection:bg-[#e7d9f6] text-[#1e1e1e]">
      <LandingNavbar
        headerScrolled={headerScrolled}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
        onOpenDemoModal={openDemoModal}
        onScrollToSection={scrollToSection}
      />

      <HeroSection onOpenDemoModal={openDemoModal} />
      <AlliedHealthSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <HowItWorksSection />
      <StatsTestimonialsSection />
      <FAQSection />
      <ContactSection
        onOpenDemoModal={openDemoModal}
        contactEmail={contactEmail}
        contactMessage={contactMessage}
        contactStatus={contactStatus}
        onContactEmailChange={setContactEmail}
        onContactMessageChange={setContactMessage}
        onSubmitContactForm={submitContactForm}
      />
      <LandingFooter />

      <DemoModal
        isOpen={isDemoModalOpen}
        demoForm={demoForm}
        demoStatus={demoStatus}
        onClose={closeDemoModal}
        onDemoFormChange={handleDemoFormChange}
        onSubmitDemoForm={submitDemoForm}
      />
    </div>
  );
}
