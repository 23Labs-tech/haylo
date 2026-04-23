"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BookDemoButton } from "./BookDemoButton";

type LandingNavbarProps = {
  headerScrolled: boolean;
  mobileMenuOpen: boolean;
  onMobileMenuChange: (open: boolean) => void;
  onOpenDemoModal: () => void;
  onScrollToSection: (id: string) => void;
};

const navLinks = [
  { label: "Home", id: "hero" },
  { label: "About Us", id: "about" },
  { label: "Solution", id: "solution" },
  { label: "FAQs", id: "faq" },
  { label: "Contact", id: "contact" },
];

export function LandingNavbar({
  headerScrolled,
  mobileMenuOpen,
  onMobileMenuChange,
  onOpenDemoModal,
  onScrollToSection,
}: LandingNavbarProps) {
  const handleMobileNavigate = (id: string) => {
    onScrollToSection(id);
    onMobileMenuChange(false);
  };

  const handleOpenDemoFromMenu = () => {
    onMobileMenuChange(false);
    onOpenDemoModal();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 max-w-full mx-auto md:px-15 lg:px-25 px-5 z-50 transition-all duration-300 ${
        headerScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 lg:py-4"
          : "bg-transparent py-4 md:py-8"
      }`}
    >
      <div className="mx-auto">
        <div className="flex h-11 items-center justify-between lg:h-12">
          <div
            className="flex shrink-0 cursor-pointer items-center"
            onClick={() => onScrollToSection("hero")}
          >
            <div className="flex items-center gap-1">
              <img src="/logo.svg" alt="Haylo" className="h-8 w-auto lg:h-auto" />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollToSection(link.id);
                }}
                className="text-[#1e1e1e] hover:text-[#a824fa] transition font-medium text-[16px]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <BookDemoButton
              onClick={onOpenDemoModal}
              className="hidden lg:inline-flex lg:items-center lg:justify-center"
            />
            <Link
              href="/login"
              className="hidden md:flex w-[48px] h-[48px] bg-[#c791fe] hover:bg-[#a824fa] text-white rounded-full items-center justify-center transition"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </Link>
            <DropdownMenu open={mobileMenuOpen} onOpenChange={onMobileMenuChange}>
              <DropdownMenuTrigger asChild>
                <button
                  className="lg:hidden text-[#000000] p-0 bg-transparent border-0 shadow-none"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="w-7 h-7" strokeWidth={2.8} />
                  ) : (
                    <Menu className="w-7 h-7" strokeWidth={2.8} />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-[calc(100vw-2.5rem)] max-w-[24rem] rounded-[28px] border-[#efe4fb] bg-white/98 p-3 shadow-2xl lg:hidden"
              >
                <DropdownMenuLabel className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#8d71ab]">
                  Navigate
                </DropdownMenuLabel>
                {navLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.label}
                    onSelect={() => handleMobileNavigate(link.id)}
                    className="cursor-pointer rounded-2xl px-3 py-3 text-[16px] font-medium text-[#1e1e1e]"
                  >
                    {link.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="mx-0 my-2 bg-[#f1e8fb]" />
                <div className="space-y-3 px-1 pb-1 pt-2">
                  <BookDemoButton onClick={handleOpenDemoFromMenu} fullWidthOnMobile />
                  <Link
                    href="/login"
                    className="flex h-11 items-center justify-center rounded-full border border-[#e7d7fb] text-[15px] font-semibold text-[#6f31a8] transition hover:bg-[#faf5ff]"
                    onClick={() => onMobileMenuChange(false)}
                  >
                    Login
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
