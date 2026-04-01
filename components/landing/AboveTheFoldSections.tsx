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
      className="pt-24 md:pt-40 pb-12 md:pb-24 md:px-15 lg:px-25 px-5 relative overflow-hidden s"
    >
      <div className="max-w-360 mx-auto md: relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 items-center gap-8 lg:min-h-150 lg:gap-10">
          <div className="lg:col-span-3 z-20">
            <h1 className="text-[42px] md:text-[72px] lg:text-[76px] font-semibold leading-[1.02] lg:leading-[1.05] tracking-tight mb-5 lg:mb-6 text-[#1e1e1e]">
              Never Miss
              <br />
              Another Patient
              <br />
              Call Again
            </h1>

            <p className="text-[16px] md:text-[20px] font-inter mb-7 lg:mb-10 max-w-[500px] leading-[1.55] md:leading-[1.6]">
              Haylo is your AI receptionist for Allied Health clinics
              <br className="hidden md:block" />
              It answers calls, books appointments, and handles admin so your
              front desk doesn&apos;t burn out
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <BookDemoButton
                onClick={onOpenDemoModal}
                className="w-full max-w-[220px] lg:w-[230px]"
              />
            </div>
          </div>

          <div className="lg:col-span-3 relative flex justify-center items-center">
            <img
              src="/images/hero.png"
              alt="Haylo App"
              width="100%"
              className="w-full max-w-[28rem] object-contain mix-blend-multiply lg:max-w-none"
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
      className="s md:pb-24 pb-8 max-w-[1300px] mx-auto relative z-10"
    >
      <div className="mx-auto px-6 lg:px-8">
        <h2 className="text-[25px] md:text-[32px] font-bold text-center text-[#1e1e1e]">
          Built for Allied Health Clinics
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

          <div className="w-full lg:w-[45%]">
            <h2 className="text-[32px] md:text-[48px] font-semibold text-[#1e1e1e] leading-[1.08] md:leading-[58px] mb-7 md:mb-10 tracking-tight">
              Your Front Desk
              <br />
              Is Losing You Money
            </h2>
            <div className="space-y-4 md:space-y-6">
              {PAIN_POINTS.map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <CheckCircle className="text-[#a824fa] mt-1" size={20} />

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
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 justify-between">
          <div className="w-full lg:w-[48%] flex flex-col justify-between">
            <div className="w-full">
              <h2 className="text-[34px] md:text-[50px] font-semibold text-[#1e1e1e] leading-[1.08] md:leading-14.5 mb-5 md:mb-6 tracking-tight">
                Meet <span className="text-[#a824fa]">Haylo</span>,
                <br />
                Your 24/7 AI Receptionist
              </h2>
              <p className="text-[15px] md:text-[18px] text-[#4F504D] mb-8 md:mb-12 max-w-[500px] leading-[1.65] md:leading-[30px]">
                Haylo handles every patient call for your clinic &mdash;
                answering instantly, booking appointments, and managing admin
                tasks so your team can focus on care, not phones.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 md:gap-10 md:pt-10">
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
                <div key={item.title}>
                  <div className="flex gap-1 text-[20px] md:text-[24px] mb-2 text-[#C782F9]">
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

          <div className="w-full lg:w-[45%] flex flex-col gap-6 md:gap-10">
            {FEATURES.map((feature, index) => (
              <div key={index} className="flex gap-4 md:gap-6 justify-start items-start">
                <div className="w-12 h-12 md:w-15 md:h-15 rounded-sm bg-[#C782F9]/30 flex items-center justify-center shrink-0">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-6 h-6 md:w-7 md:h-7"
                  />
                </div>

                <div>
                  <h4 className="text-[22px] md:text-[26px] -mt-1 font-semibold text-[#191A15] mb-1">
                    {feature.title}
                  </h4>

                  <p className="text-[#A6A6A6] leading-[1.55] md:leading-7.5 text-[16px] md:text-[18px]">
                    {feature.desc1}
                    <br />
                    {feature.desc2}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
