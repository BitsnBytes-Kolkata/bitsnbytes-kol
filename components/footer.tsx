import Image from "next/image";
import Link from "next/link";
import { Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import logo from "@public/logo.svg";

const socialLinks = [
  {
    href: "https://www.linkedin.com/company/gobitsbytes",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://github.com/gobitsnbytes",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://www.instagram.com/gobitsnbytes",
    label: "Instagram",
    icon: Instagram,
  },
];

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/impact", label: "Impact" },
  { href: "/join", label: "Join" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/coc", label: "Code of Conduct" },
];

export function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 border-t border-white/20 bg-white/70 text-sm text-muted-foreground backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12 md:py-16 sm:px-6 lg:px-8">
        {/* Mobile: Stack vertically, Desktop: 4 columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-4">
          {/* Brand section */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <div className="inline-flex items-center gap-3 text-foreground">
              <div className="relative grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl sm:rounded-2xl bg-black text-white shadow-[0_8px_30px_rgba(228,90,146,0.4)]">
                <Image
                  src={logo}
                  alt="Bits&Bytes logo"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                  priority
                />
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-[var(--brand-pink)]" />
              </div>
              <div>
                <p className="font-display text-base sm:text-lg font-semibold">
                  Bits&Bytes
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-muted-foreground">
                  Teen-led
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs">
              Building India&apos;s boldest teen-led hackathons & creative code
              movements - born in Lucknow, scaling nationwide.
            </p>
          </div>

          {/* Explore section */}
          <div>
            <p className="mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-foreground">
              Explore
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1 sm:gap-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-xs sm:text-sm transition-colors hover:text-foreground"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect section */}
          <div>
            <p className="mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-foreground">
              Connect
            </p>
            <div className="space-y-2 sm:space-y-3">
              <a
                className="flex items-center gap-2 text-xs sm:text-sm transition-colors hover:text-foreground"
                href="mailto:hello@gobitsnbytes.org"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="break-all">hello@gobitsnbytes.org</span>
              </a>
              <p className="flex items-center gap-2 text-xs sm:text-sm">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                Based in Lucknow, India
              </p>
            </div>
          </div>

          {/* Social section */}
          <div>
            <p className="mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-foreground">
              Social
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/30 bg-white/50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm backdrop-blur-md transition-colors hover:border-white/50 hover:text-foreground dark:bg-white/10"
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline sm:inline">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10 text-center text-[10px] sm:text-xs py-3 sm:py-4 px-4">
        © {new Date().getFullYear()} Bits&Bytes. Built with club love.
      </div>
    </footer>
  );
}

export default Footer;
