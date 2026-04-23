"use client";

import { FEATURES, PAIN_POINTS } from "@/constants/data";
import { CheckCircle } from "lucide-react";

import { BookDemoButton } from "./BookDemoButton";
import ServiceIcons from "./ServicesIcon";

export function HeroSection({
  onOpenDemoModal,
}: {
  onOpenDemoModal: () => void;
}) {
  return (
    <section
      id="hero"
      className="pt-24 md:pt-40 pb-12 md:pb-24 md:px-15 lg:px-25 px-5 relative overflow-hidden bg-[linear-gradient(180deg,#EFDFFB_0%,#EFDFFB_42%,#FFFFFF_60%)] lg:bg-none"
    >
      <div className="max-w-360 mx-auto md: relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 items-center gap-8 lg:min-h-150 lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-3 z-20">
            <h1 className="text-[64px] md:text-[72px] lg:text-[76px] font-semibold leading-[76px] md:leading-[1.02] lg:leading-[1.05] tracking-normal md:tracking-tight mb-5 lg:mb-6 text-[#1e1e1e] text-center lg:text-left">
              Never Miss
              <br />
              Another{" "}
              <br className="md:hidden" />
              Patient
              <br />
              Call Again
            </h1>

            <p className="text-[16px] md:text-[20px] font-inter mb-7 lg:mb-10 max-w-[500px] mx-auto lg:mx-0 leading-[1.55] md:leading-[1.6] text-center lg:text-left max-lg:text-black">
              Haylo is your AI receptionist for Allied Health clinics
              <br className="hidden md:block" />
              It answers calls, books appointments, and handles admin so your
              front desk doesn&apos;t burn out
            </p>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-[11px] lg:gap-4 w-full max-w-[331px] mx-auto lg:mx-0 lg:max-w-none">
              <button
                type="button"
                onClick={onOpenDemoModal}
                className="lg:hidden h-16 w-full bg-[#9810FA] text-white text-[17.55px] font-semibold font-inter rounded-full transition hover:bg-[#8a0ae0]"
              >
                Book a Demo
              </button>
              <button
                type="button"
                className="lg:hidden h-16 w-full bg-transparent text-[#191A15] text-[17.55px] font-semibold font-inter rounded-full border-2 border-[#9810FA] transition hover:bg-[#9810FA]/10"
              >
                Listen to a Live Call
              </button>
              <BookDemoButton
                onClick={onOpenDemoModal}
                className="hidden lg:inline-flex"
              />
              <button
                type="button"
                className="hidden lg:inline-flex items-center justify-center h-[64px] px-12 bg-transparent text-[#191A15] text-[18px] font-semibold rounded-full border-2 border-[#9810FA] transition hover:bg-[#9810FA]/10"
              >
                Listen to a Live Call
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-3 relative flex justify-center items-center">
            <img
              src="/images/hero.png"
              alt="Haylo App"
              className="w-full max-w-[340px] lg:max-w-none object-contain mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AlliedHealthSection() {
  return (
    <section
      id="about"
      className="s md:pb-24 pb-8 lg:max-w-325 w-full mx-auto relative z-10"
    >
      <div className="mx-auto px-6 lg:px-8">
        <h2 className="text-[25px] md:text-[32px] font-bold text-center text-[#1e1e1e] md:leading-normal md:tracking-normal leading-[1.2] tracking-tight">
          <span className="md:hidden">
            Built for Allied Health
            <br />
            Clinics Across Australia
          </span>
          <span className="hidden md:inline">Built for Allied Health Clinics</span>
        </h2>
        <ServiceIcons />
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="py-14 md:py-24 relative">
      <div className="mx-auto md:px-15 lg:px-25 px-5">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
          <div className="w-full max-w-[32rem] lg:max-w-none lg:w-[55%] relative">
            <div className="overflow-hidden relative">
              <img
                src="/images/stressed.png"
                alt="Stressed Receptionist"
                className="w-full h-auto object-cover rounded-3xl"
              />
            </div>
          </div>

          <div className="w-full max-w-[20rem] sm:max-w-[26rem] mx-auto lg:max-w-none lg:mx-0 lg:w-[45%]">
            <h2 className="text-[32px] md:text-[48px] font-semibold text-[#1e1e1e] leading-[1.08] md:leading-[58px] mb-7 md:mb-10 tracking-tight text-center lg:text-left">
              Your Front Desk
              <br />
              Is Losing You Money
            </h2>
            <div className="space-y-5 md:space-y-6">
              {PAIN_POINTS.map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <CheckCircle className="text-[#a824fa] mt-1 shrink-0" size={20} />

                  <span className="text-[17px] md:text-[20px] font-regular font-inter leading-[1.45] md:leading-[27px]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="flex flex-col justify-center bg-[#FEF2F2] py-14 md:py-20 lg:min-h-166.5"
    >
      <div className="md:px-15 lg:px-25 px-5">
        <div className="flex flex-col gap-12 md:gap-10 lg:grid lg:grid-cols-[48%_45%] lg:grid-rows-[auto_1fr] lg:gap-x-[7%] lg:gap-y-10 lg:items-start lg:justify-between">
          <div className="order-1 w-full max-w-[24rem] mx-auto lg:max-w-none lg:mx-0 lg:col-start-1 lg:row-start-1">
            <h2 className="text-[32px] md:text-[50px] font-semibold text-[#1e1e1e] leading-[1.12] md:leading-14.5 mb-5 md:mb-6 tracking-tight text-center lg:text-left">
              <span className="lg:hidden">
                Meet <span className="text-[#a824fa]">Haylo</span>, Your 24/7
                <br />
                AI Receptionist
              </span>
              <span className="hidden lg:inline">
                Meet <span className="text-[#a824fa]">Haylo</span>,
                <br />
                Your 24/7 AI Receptionist
              </span>
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#4F504D] md:mb-12 max-w-[500px] mx-auto lg:mx-0 leading-[1.7] md:leading-[30px] text-center lg:text-left">
              Haylo handles every patient call for your clinic &mdash;
              answering instantly, booking appointments, and managing admin
              tasks so your team can focus on care, not phones.
            </p>
          </div>

          <div className="order-2 w-full flex flex-col max-md:items-center gap-12 md:gap-10 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-4 max-w-[22rem] md:max-w-none md:flex-row md:items-start md:text-left md:gap-6"
              >
                <div className="w-14 h-14 md:w-15 md:h-15 rounded-lg md:rounded-sm bg-[#C782F9]/30 flex items-center justify-center shrink-0">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-7 h-7 md:w-7 md:h-7"
                  />
                </div>

                <div>
                  <h4 className="text-[22px] md:text-[26px] font-semibold text-[#191A15] mb-2 md:mb-1 md:-mt-1">
                    {feature.title}
                  </h4>

                  <p className="text-[#A6A6A6] leading-[1.65] md:leading-7.5 text-[16px] md:text-[18px]">
                    <span className="md:hidden">
                      {feature.desc1} {feature.desc2}
                    </span>
                    <span className="hidden md:inline">
                      {feature.desc1}
                      <br />
                      {feature.desc2}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-3 flex flex-col max-sm:items-center sm:flex-row gap-6 md:gap-10 lg:col-start-1 lg:row-start-2 lg:self-end md:pt-10">
            {[
              {
                title: "24/7 Availability",
                description: "Never miss a patient call",
              },
              {
                title: "Instant Response",
                description: "Every call answered in seconds",
              },
            ].map((item) => (
              <div key={item.title} className="max-sm:text-center">
                <div className="flex gap-1 text-[20px] md:text-[24px] mb-2 text-[#C782F9] max-sm:justify-center">
                  &#9733; &#9733; &#9733; &#9733; &#9733;
                </div>
                <div className="text-[18px] font-bold mb-2 md:mb-3 mt-1 text-[#1e1e1e]">
                  5.0 <span className="text-[18px] font-normal">/ 5 rating</span>
                </div>
                <div className="font-inter text-[16px] md:text-[18px] -mb-1 text-[#58595B]">
                  {item.title}
                </div>
                <div className="font-inter text-[16px] md:text-[18px] text-[#58595B]">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
