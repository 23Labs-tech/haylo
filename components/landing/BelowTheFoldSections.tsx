"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { FormEvent } from "react";

import { BENEFITS, CORE_FEATURES } from "@/constants/data";

import { BookDemoButton } from "./BookDemoButton";
import type { FormStatus } from "./types";

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
    <section id="how-it-works" className="py-2 md:py-5 px-5 md:px-6">
      <div className="mx-auto md:pb-24 md:px-15 lg:px-25 px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14 lg:gap-15">
          {CORE_FEATURES.map((item) => (
            <div key={item.title} className="flex flex-col w-full items-center">
              <div className="mb-6 md:mb-10 w-full overflow-hidden rounded-[22px] bg-[#C782F9]/10">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-72 md:h-118.25 object-contain mix-blend-multiply"
                />
              </div>

              <h3 className="text-[22px] md:text-[29px] font-semibold text-[#191A15] mb-2 md:mb-3 text-center">
                {item.title}
              </h3>

              <p className="text-[17px] md:text-[19px] text-[#A6A6A6] text-center font-medium">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 md:auto-rows-fr">
          <div className="bg-[#F9F3FE] p-4 md:p-5 flex flex-col justify-between h-40 md:h-68 md:max-h-68 col-span-1 rounded-none">
            <div className="text-[32px] lg:text-[58px] font-semibold text-[#1e1e1e] leading-none tracking-[-0.03em]">
              37%
            </div>
            <div className="text-[18px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug">
              Increase in
              <br />
              recovered calls
            </div>
          </div>
          <div className="bg-[#cd9cff] p-4 md:p-5 flex flex-col justify-between min-h-44 md:h-68 md:max-h-68 col-span-1 rounded-none">
            <div className="text-[32px] lg:text-[58px] font-semibold text-[#1e1e1e] leading-none mb-3 md:mb-4 tracking-[-0.03em] font-sans">
              60%
            </div>
            <div className="text-[18px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug">
              Reduction in
              <br />
              admin workload
            </div>
          </div>
          <div className="bg-[#FAFAFA] flex flex-col md:flex-row items-center gap-4 col-span-1 md:col-span-2 lg:col-span-2 rounded-none overflow-hidden">
            <img
              src="/images/testimonial_doctor.png"
              alt="Clinic Owner"
              className="h-56 w-full object-cover md:h-67.5 md:w-52.75"
            />
            <div className="flex h-full flex-col justify-between px-4 pb-5 pt-1 md:px-0 md:py-4 md:pr-4">
              <p className="text-[17px] lg:text-[22px] text-[#2c323f] leading-relaxed mb-5 md:mb-8 font-light">
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
          <div className="bg-[#FAFAFA] flex flex-col md:flex-row items-center gap-4 col-span-1 md:col-span-2 lg:col-span-2 rounded-none overflow-hidden">
            <img
              src="/images/testimonial_doctor_1.png"
              alt="Practice Manager"
              className="h-56 w-full object-cover shrink-0 md:h-67.5 md:w-52.75 md:aspect-square"
            />
            <div className="flex h-full flex-col justify-between px-4 pb-5 pt-1 md:px-0 md:py-4 md:pr-4">
              <p className="text-[17px] lg:text-[22px] text-[#2c323f] leading-relaxed mb-5 md:mb-8 font-light">
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
          <div className="bg-[#b975ff] p-4 md:p-5 flex flex-col justify-between min-h-44 col-span-1 rounded-none">
            <div className="text-[32px] lg:text-[58px] font-semibold leading-none tracking-[-0.03em] flex items-baseline font-sans mt-1 md:mt-3">
              14
              <span className="text-[32px] lg:text-[36px] font-medium ml-1">
                Days
              </span>
            </div>
            <div className="text-[18px] lg:text-[22px] font-medium leading-snug mt-auto mb-0 md:mb-2 lg:mt-12">
              Boost
              <br />
              in bookings
            </div>
          </div>
          <div className="bg-[#F9F3FE] p-4 md:p-5 flex flex-col justify-between min-h-44 col-span-1 rounded-none">
            <div className="text-[30px] lg:text-[58px] font-bold text-[#1e1e1e] leading-none tracking-[-0.03em] font-sans mt-1 md:mt-3">
              24/7
            </div>
            <div className="text-[18px] lg:text-[22px] text-[#1e1e1e] font-medium leading-snug mt-auto mb-0 md:mb-2 lg:mt-12">
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
    <section id="contact" className="py-14 md:py-32 bg-[#F9F3FE]">
      <div className="mx-auto md:px-15 lg:px-25 px-5">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
          <div className="flex-1">
            <h2 className="text-[32px] md:text-[50px] font-semibold leading-tight tracking-tight mb-5 md:mb-8">
              Stop losing
              <br />
              Patients to Missed Calls
            </h2>
            <p className="text-[17px] md:text-[20px] text-[#2B2B2B] mb-4 md:mb-6 leading-[1.6] md:leading-6.75 max-w-xl">
              Every missed call is a lost booking. Haylo answers <br /> instantly,
              books appointments, and keeps your clinic <br /> running smoothly
              &mdash; even after hours.
            </p>
            <p className="text-[17px] md:text-[20px] text-[#2B2B2B] leading-[1.6] md:leading-6.75 max-w-xl md:my-12 my-2">
              Never let another patient go elsewhere because no one picked up.
            </p>
            <div className="flex flex-wrap gap-4">
              <BookDemoButton onClick={onOpenDemoModal} className="w-full sm:w-fit" />
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

export function LandingFooter() {
  return (
    <footer className="pt-14 md:pt-24 pb-10 md:pb-12 px-5 md:px-6 flex flex-col justify-between items-center lg:px-8 bg-[#F9F3FE]">
      <div className="text-center w-full flex flex-col items-center">
        <div className="flex items-center justify-center gap-1 md:mb-12 mb-4">
          <img src="/logo.svg" alt="Haylo" className="h-9 w-auto md:h-auto" />
        </div>
        <p className="text-[#A6A6A6] font-medium text-[16px] md:text-[18px] mb-4">
          Get started now try our product
        </p>
        <div className="flex w-full max-w-[26rem] md:w-100 border-2 border-[#A6A6A6] rounded-full overflow-hidden p-1">
          <input
            type="email"
            placeholder="Enter your email here"
            className="min-w-0 flex-1 px-4 md:px-5 py-3 bg-transparent border-0 outline-none text-[#1e1e1e] placeholder-[#6b7280] text-[14px] md:text-[15px]"
          />
          <button className="bg-[#b975ff] w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-[#C782F9] transition">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="md:pt-25 pt-8 text-center">
        <p className="text-sm md:text-base">&copy; 2025 Haylo. Copyright and rights reserved</p>
      </div>
    </footer>
  );
}
