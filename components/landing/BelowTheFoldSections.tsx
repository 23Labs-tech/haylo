"use client";

import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { BENEFITS, CORE_FEATURES } from "@/constants/data";

import { BookDemoButton } from "./BookDemoButton";
import type { FormStatus } from "./types";

const FAQS: { question: string; answer: string }[] = [
  {
    question: "What is Haylo?",
    answer:
      "Haylo is an AI-powered virtual receptionist designed for Allied Health and service-based businesses. It answers calls, handles enquiries, books appointments, and captures leads so you never miss an opportunity",
  },
  {
    question: "How does Haylo actually work?",
    answer:
      "Haylo connects to your phone line and answers every incoming call in a natural voice. It follows the rules you set, pulls details from your knowledge base, and either completes the task directly or hands a clean summary to your team.",
  },
  {
    question: "Will callers know they are speaking to AI?",
    answer:
      "We make it clear that callers are speaking with an AI assistant. Haylo is designed to sound friendly and professional, so callers feel heard while always knowing they can be connected to a real person if needed.",
  },
  {
    question: "How far in advance should we book?",
    answer:
      "You can set booking windows that match your clinic's workflow — from same-day to months ahead. Haylo respects your availability rules and only books slots you've approved.",
  },
  {
    question: "Can Haylo book appointments directly?",
    answer:
      "Yes. Haylo integrates directly with your calendar, so appointments are booked in real time with no double-handling. You see the booking as soon as the call ends.",
  },
  {
    question: "What happens if Haylo can't answer a question?",
    answer:
      "If a caller asks something outside Haylo's knowledge, it politely captures the enquiry, records a summary, and routes it to your team so nothing is lost.",
  },
  {
    question: "Does Haylo work after hours?",
    answer:
      "Absolutely. Haylo works 24/7, so after-hours calls, weekends, and public holidays are all handled — your clinic never misses a booking opportunity.",
  },
  {
    question: "How long does it take to set up?",
    answer:
      "Most clinics are up and running within 48 hours. We handle the setup, train Haylo on your services, and run a quick test call before going live.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-14 md:py-24 px-5 md:px-15 lg:px-25 bg-white"
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-[83px]">
          <div className="lg:w-[397px] lg:shrink-0 mb-10 lg:mb-0 text-center lg:text-left">
            <h2 className="text-[36px] md:text-[50px] font-semibold leading-[1.1] md:leading-[50px] text-[#191A15] mb-6 md:mb-8 tracking-tight">
              Frequently Asked
              <br />
              Questions
            </h2>
            <button
              type="button"
              className="inline-flex items-center justify-center h-[50px] px-11 rounded-full bg-[#9810FA] text-white text-[17.55px] font-semibold transition hover:bg-[#8a0ae0]"
            >
              View All FAQS
            </button>
          </div>

          <div className="w-full lg:flex-1 lg:max-w-[820px]">
            {FAQS.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.question}
                  className="border-b border-[#191A15]/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-4 py-5 md:py-6 text-left cursor-pointer"
                  >
                    <span className="text-[17px] md:text-[20px] leading-[24px] md:leading-[24px] text-[#191A15] font-normal">
                      {i + 1}. {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 mt-0.5 text-[#191A15] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={2.2}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 md:pb-6 pr-8 md:pr-12 text-[16px] md:text-[18px] leading-[26px] text-[#383A45] font-normal">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section className="py-14 md:py-24">
      <div className="mx-auto md:pb-24 md:px-15 lg:px-25 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {BENEFITS.map((item, index) => (
            <div
              key={index}
              className="bg-[#C782F9] rounded-[10px] px-4 py-5 md:p-4 flex min-h-[184px] flex-col items-center justify-center text-center sm:aspect-square md:min-h-0 md:aspect-auto lg:aspect-square"
            >
              <div className="bg-[#FEF2F2] rounded-full w-12 h-12 md:w-15 md:h-15 flex items-center justify-center mb-4 md:mb-6 shadow-sm shrink-0">
                <img src={item.icon} alt="icon" className="h-7 w-7 md:h-auto md:w-auto" />
              </div>

              <h4 className="font-medium text-[#191A15] text-[18px] md:text-[20px] leading-snug mb-1 md:mb-2">
                {item.title.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-10 md:py-5 px-5 md:px-6">
      <div className="mx-auto md:pb-24 md:px-15 lg:px-25 px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14 lg:gap-15">
          {CORE_FEATURES.map((item) => (
            <div key={item.title} className="flex flex-col w-full items-center">
              <div className="mb-5 md:mb-10 w-full overflow-hidden rounded-[22px] bg-[#C782F9]/10">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-60 sm:h-72 md:h-118.25 object-contain mix-blend-multiply"
                />
              </div>

              <h3 className="text-[22px] md:text-[29px] font-semibold text-[#191A15] mb-2 md:mb-3 text-center">
                {item.title}
              </h3>

              <p className="text-[16px] md:text-[19px] text-[#A6A6A6] text-center font-medium max-md:px-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsTestimonialsSection() {
  return (
    <section className="pb-18 md:pb-32 pt-8 md:pt-10 md:px-15 lg:px-25 px-5">
      <div className="mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 md:auto-rows-fr">
          <div className="bg-[#F9F3FE] p-4 md:p-5 flex flex-col justify-between min-h-40 md:min-h-44 col-span-1 rounded-none">
            <div className="text-[32px] lg:text-[58px] font-semibold text-[#1e1e1e] leading-none tracking-[-0.03em]">
              37%
            </div>
            <div className="text-[15px] md:text-[18px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug">
              Increase in
              <br />
              recovered calls
            </div>
          </div>
          <div className="bg-[#cd9cff] p-4 md:p-5 flex flex-col justify-between min-h-40 md:min-h-44 col-span-1 rounded-none">
            <div className="text-[32px] lg:text-[58px] font-semibold text-[#1e1e1e] leading-none mb-3 md:mb-4 tracking-[-0.03em] font-sans">
              60%
            </div>
            <div className="text-[15px] md:text-[18px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug">
              Reduction in
              <br />
              admin workload
            </div>
          </div>
          <div className="bg-[#FAFAFA] flex flex-col md:flex-row items-center gap-4 col-span-2 md:col-span-2 lg:col-span-2 rounded-none overflow-hidden">
            <img
              src="/images/testimonial_doctor.png"
              alt="Clinic Owner"
              className="w-full h-64 object-cover object-top md:h-full md:w-52.75 md:object-center"
            />
            <div className="flex h-full flex-col justify-between px-4 pb-5 pt-1 md:px-0 md:py-4 md:pr-4">
              <p className="text-[16px] md:text-[17px] lg:text-[22px] text-[#2c323f] leading-relaxed mb-5 md:mb-8 font-light">
                &quot;Reception used to get overwhelmed during busy periods.
                Haylo has taken a huge amount of pressure off the team.&quot;
              </p>
              <div>
                <div className="font-bold text-[#1e1e1e] text-[18px] md:text-[20px]">
                  Clinic Owner
                </div>
                <div className="text-[#1e1e1e] text-[16px] md:text-[18px]">
                  Allied Health Practice
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FAFAFA] flex flex-col md:flex-row items-center gap-4 col-span-2 md:col-span-2 lg:col-span-2 rounded-none overflow-hidden max-lg:order-last lg:order-none">
            <img
              src="/images/testimonial_doctor_1.png"
              alt="Practice Manager"
              className="w-full h-64 object-cover object-top shrink-0 md:h-full md:w-52.75 md:aspect-square md:object-center"
            />
            <div className="flex h-full flex-col px-4 pb-5 pt-1 md:px-0 md:pr-4">
              <p className="text-[16px] md:text-[17px] lg:text-[22px] text-[#2c323f] mb-5 md:mb-8 font-light">
                &quot;Before Haylo we were constantly missing calls during
                treatment hours. Now every enquiry gets handled and our bookings
                are much more consistent.&quot;
              </p>
              <div>
                <div className="font-bold text-[#1e1e1e] text-[18px] md:text-[20px]">
                  Practice Manager
                </div>
                <div className="text-[#1e1e1e] text-[16px] md:text-[18px]">
                  Physiotherapy Clinic
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#b975ff] p-4 md:p-5 flex flex-col justify-between min-h-40 md:min-h-44 col-span-1 rounded-none">
            <div className="text-[32px] lg:text-[58px] font-semibold leading-none tracking-[-0.03em] flex items-baseline font-sans mt-1 md:mt-3">
              14
              <span className="text-[22px] md:text-[32px] lg:text-[36px] font-medium ml-1">
                Days
              </span>
            </div>
            <div className="text-[15px] md:text-[18px] lg:text-[22px] font-medium leading-snug mt-auto mb-0 md:mb-2 lg:mt-12">
              Boost
              <br />
              in bookings
            </div>
          </div>
          <div className="bg-[#F9F3FE] p-4 md:p-5 flex flex-col justify-between min-h-40 md:min-h-44 col-span-1 rounded-none">
            <div className="text-[30px] lg:text-[58px] font-bold text-[#1e1e1e] leading-none tracking-[-0.03em] font-sans mt-1 md:mt-3">
              24/7
            </div>
            <div className="text-[15px] md:text-[18px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug mt-auto mb-0 md:mb-2 lg:mt-12">
              Continuous
              <br />
              patient support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ContactSectionProps = {
  onOpenDemoModal: () => void;
  contactEmail: string;
  contactMessage: string;
  contactStatus: FormStatus;
  onContactEmailChange: (value: string) => void;
  onContactMessageChange: (value: string) => void;
  onSubmitContactForm: (e: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function ContactSection({
  onOpenDemoModal,
  contactEmail,
  contactMessage,
  contactStatus,
  onContactEmailChange,
  onContactMessageChange,
  onSubmitContactForm,
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-14 md:py-32 bg-[#F9F3FE] px-5 md:px-15 lg:px-25">
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col items-stretch lg:flex-row lg:items-center gap-10 lg:gap-24">
          <div className="w-full flex-1">
            <h2 className="text-[32px] md:text-[50px] font-semibold leading-[1.1] md:leading-tight tracking-tight mb-5 md:mb-8 text-left">
              <span className="lg:hidden">
                Stop Losing
                <br />
                Patients to Missed
                <br />
                Calls
              </span>
              <span className="hidden lg:inline">
                Stop losing
                <br />
                Patients to Missed Calls
              </span>
            </h2>
            <p className="text-[16px] md:text-[20px] text-[#2B2B2B] mb-4 md:mb-6 leading-[1.6] md:leading-6.75 max-w-xl">
              Every missed call is a lost booking. Haylo answers
              <br className="hidden md:inline" /> instantly, books appointments,
              and keeps your clinic
              <br className="hidden md:inline" /> running smoothly &mdash; even
              after hours.
            </p>
            <p className="text-[16px] md:text-[20px] text-[#2B2B2B] leading-[1.6] md:leading-6.75 max-w-xl md:my-12 my-4">
              Never let another patient go elsewhere because no one picked up.
            </p>
            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-[11px] lg:gap-4 w-full max-w-[331px] mx-auto lg:mx-0 lg:max-w-none">
              <button
                type="button"
                onClick={onOpenDemoModal}
                className="lg:hidden h-16 w-full bg-[#9810FA] text-white text-[17.55px] font-semibold rounded-full transition hover:bg-[#8a0ae0]"
              >
                Book a Demo
              </button>
              <button
                type="button"
                className="lg:hidden h-16 w-full bg-transparent text-[#191A15] text-[17.55px] font-semibold rounded-full border-2 border-[#9810FA] transition hover:bg-[#9810FA]/10"
              >
                Hear Haylo in Action
              </button>
              <BookDemoButton
                onClick={onOpenDemoModal}
                className="hidden lg:inline-flex"
              />
              <button
                type="button"
                className="hidden lg:inline-flex items-center justify-center h-[64px] px-12 bg-transparent text-[#191A15] text-[18px] font-semibold rounded-full border-2 border-[#9810FA] transition hover:bg-[#9810FA]/10"
              >
                Hear Haylo in Action
              </button>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-[#C782F9]/30 rounded-[28px] md:rounded-4xl p-5 md:p-10 md:px-20 md:pb-15">
              <div className="flex flex-col items-center justify-center">
                <img
                  src="/icons/stack.svg"
                  alt="Stack icon"
                  className="h-12 w-12 md:h-auto md:w-auto"
                />
                <h3 className="text-[24px] md:text-[30px] font-semibold text-[#1e1e1e] mb-6 md:mb-8">
                  Get Started
                </h3>
              </div>
              {contactStatus === "success" ? (
                <div className="py-8 text-center bg-white rounded-4xl p-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="font-bold text-gray-900 mb-2">Message Sent!</p>
                  <p className="text-gray-600">We will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={onSubmitContactForm} className="space-y-5 md:space-y-6">
                  <div>
                    <label className="block text-[15px] font-medium text-[#4b5563] mb-2">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => onContactEmailChange(e.target.value)}
                      className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-[#FFFFFF] border-0 rounded-[10px] focus:ring-2 focus:ring-[#C782F9] outline-none text-[#1e1e1e] placeholder-gray-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-medium text-[#4b5563] mb-2">
                      Message
                    </label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => onContactMessageChange(e.target.value)}
                      className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-[#FFFFFF] border-0 rounded-[10px] rounded-2xl focus:ring-2 focus:ring-[#C782F9] outline-none text-[#1e1e1e] placeholder-gray-500 min-h-[112px] md:min-h-[140px] resize-none"
                      placeholder="What are you say ?"
                    />
                  </div>
                  <button
                    disabled={contactStatus === "submitting"}
                    type="submit"
                    className="w-full bg-[#C782F9] hover:bg-[#C782F9] text-white py-4 rounded-[10px] font-semibold transition flex items-center justify-center text-[16px]"
                  >
                    {contactStatus === "submitting" ? "Sending..." : "Request Demo"}
                  </button>
                  {contactStatus === "error" && (
                    <p className="text-red-500 text-sm mt-3 text-center">
                      There was an error sending your message.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FOOTER_LINK_GROUPS = [
  {
    title: "Support",
    links: ["Help centre", "Account information", "About", "Contact us"],
  },
  {
    title: "Help & Solution",
    links: ["Talk to support", "Support docs", "System status", "Covid respond"],
  },
  {
    title: "Product",
    links: ["Update", "Security", "Beta test", "Pricing product"],
  },
];

export function LandingFooter() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <footer className="pt-14 md:pt-24 pb-6 md:pb-10 px-5 md:px-15 lg:px-25 bg-[#F9F3FE]">
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-16">
          <div className="flex flex-col items-center lg:items-start w-full lg:w-auto lg:max-w-[380px]">
            <img
              src="/logo.svg"
              alt="Haylo"
              className="h-9 w-auto md:h-auto mb-4 md:mb-6"
            />
            <p className="text-[#A6A6A6] font-medium text-[16px] md:text-[18px] mb-4 text-center lg:text-left">
              Get started now try our product
            </p>
            <div className="flex w-full max-w-[26rem] md:w-100 border-2 border-[#A6A6A6] rounded-full overflow-hidden p-1">
              <input
                type="email"
                placeholder="Enter your email here"
                className="min-w-0 flex-1 px-4 md:px-5 py-3 bg-transparent border-0 outline-none text-[#1e1e1e] placeholder-[#6b7280] text-[14px] md:text-[15px]"
              />
              <button
                type="button"
                className="bg-[#b975ff] w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-[#C782F9] transition shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="w-full lg:w-auto lg:flex-1">
            <div className="lg:hidden">
              {FOOTER_LINK_GROUPS.map((group) => {
                const isOpen = openGroup === group.title;
                return (
                  <div
                    key={group.title}
                    className="border-b border-[#A6A6A6]/40"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenGroup(isOpen ? null : group.title)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
                    >
                      <span className="text-[16px] font-semibold text-[#191A15]">
                        {group.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#191A15] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        strokeWidth={2.2}
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="pb-4 space-y-2.5">
                          {group.links.map((link) => (
                            <li key={link}>
                              <a
                                href="#"
                                className="text-[15px] text-[#6b7280] hover:text-[#9810FA] transition"
                              >
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-x-16">
              {FOOTER_LINK_GROUPS.map((group) => (
                <div key={group.title}>
                  <h4 className="text-[16px] font-semibold text-[#191A15] mb-5">
                    {group.title}
                  </h4>
                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-[15px] text-[#6b7280] hover:text-[#9810FA] transition"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-16 pt-6 flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left lg:gap-4">
          <p className="text-[14px] md:text-[15px] text-[#191A15] font-medium lg:text-[#A6A6A6] lg:font-normal">
            &copy; 2025 Haylo. Copyright and rights reserved
          </p>
          <div className="flex items-center justify-center gap-3 text-[14px] text-[#6b7280]">
            <a href="#" className="hover:text-[#9810FA] transition">
              Terms and Conditions
            </a>
            <span className="inline-block w-1 h-1 rounded-full bg-[#A6A6A6]" />
            <a href="#" className="hover:text-[#9810FA] transition">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
