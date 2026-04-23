import Image from "next/image";

import { SERVICES } from "@/constants/data";

type Service = (typeof SERVICES)[number];

const edgeFadeMask =
  "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]";

function ServiceItem({ service }: { service: Service }) {
  return (
    <div className="flex shrink-0 items-center gap-3 md:gap-4 px-5 md:px-8">
      <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0">
        <Image
          src={service.icon}
          alt={service.label}
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="whitespace-nowrap text-[16px] md:text-[20px] font-inter font-medium text-[#1e1e1e]">
        {service.label}
      </p>
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
  durationSeconds,
}: {
  items: Service[];
  direction: "left" | "right";
  durationSeconds: number;
}) {
  const animationName =
    direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div
      className={`group relative overflow-hidden w-full ${edgeFadeMask}`}
      aria-hidden="true"
    >
      <div
        className="flex w-max group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{
          animation: `${animationName} ${durationSeconds}s linear infinite`,
        }}
      >
        {[...items, ...items].map((service, index) => (
          <ServiceItem key={`${service.label}-${index}`} service={service} />
        ))}
      </div>
    </div>
  );
}

const ServiceIcons = () => {
  return (
    <div>
      <div className="md:hidden mt-6 -mx-6">
        <MarqueeRow items={SERVICES} direction="left" durationSeconds={45} />
      </div>

      <div className="hidden md:block">
        <div className="flex flex-wrap justify-center gap-5 lg:gap-x-20 items-center mt-6">
          {SERVICES.slice(0, 4).map((service) => (
            <div key={service.label} className="flex gap-4 items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                <Image
                  src={service.icon}
                  alt={service.label}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain text-purple-600"
                />
              </div>
              <p className="text-center text-[16px] lg:text-[20px] font-inter font-medium text-[#1e1e1e]">
                {service.label}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-5 lg:gap-x-16 items-center mt-6">
          {SERVICES.slice(4, 9).map((service) => (
            <div key={service.label} className="flex gap-4 items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                <Image
                  src={service.icon}
                  alt={service.label}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain text-purple-600"
                />
              </div>
              <p className="text-center text-[16px] lg:text-[20px] font-inter font-medium text-[#1e1e1e]">
                {service.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceIcons;
