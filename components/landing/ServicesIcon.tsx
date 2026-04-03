import { SERVICES } from "@/constants/data";
import Image from "next/image";

const ServiceIcons = () => {
  return (
    <div >
      <div className="flex  flex-wrap justify-center gap-5 md:gap-x-20 items-center mt-6">
        {SERVICES.slice(0, 4).map((service) => (
          <div key={service.label} className="flex gap-4 items-center">
            <div className="w-10 h-10 lg:w-12 lg:h-12  flex items-center justify-center">
              <Image
                src={service.icon}
                alt={service.label}
                width={48}
                height={48}
                className="w-full h-full object-contain text-purple-600"
              />
            </div>
            <p className="text-center text-[16px] md:text-[20px] font-inter font-medium text-[#1e1e1e]">
              {service.label}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-5  md:gap-x-16 items-center mt-6">
        {SERVICES.slice(4, 9).map((service) => (
          <div key={service.label} className="flex gap-4 items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <Image
                src={service.icon}
                alt={service.label}
                width={48}
                height={48}
                className="w-full h-full object-contain text-purple-600"
              />
            </div>
            <p className="text-center text-[16px] md:text-[20px] font-inter font-medium text-[#1e1e1e]">
              {service.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceIcons;
