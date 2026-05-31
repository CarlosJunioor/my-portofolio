import { Github, Twitter, Linkedin, Rss, Mail, BookOpen } from "lucide-react";
import { profile } from "@/content/profile";

interface SocialDef {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export function Footer() {
  const year = new Date().getFullYear();
  const s = profile.socials;

  const socials: SocialDef[] = [
    { label: "GitHub", href: s.github, icon: Github },
    { label: "dev.to", href: s.devto, icon: Rss },
    { label: "Medium", href: s.medium, icon: BookOpen },
    { label: "X", href: s.x, icon: Twitter },
    { label: "LinkedIn", href: s.linkedin, icon: Linkedin },
  ];

  return (
    <footer className="relative z-10 mt-24 border-t border-white/5">
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)",
        }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 py-12 sm:flex-row sm:justify-between sm:px-8">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="telemetry">// COMMS CHANNEL OPEN</p>
          <p className="text-sm text-muted">
            © {year} {profile.name} — transmitting from {profile.location}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-muted transition-all hover:-translate-y-0.5 hover:border-[var(--color-nebula-cyan)]/40 hover:text-star"
            >
              <Mail size={18} />
            </a>
          )}
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-muted transition-all hover:-translate-y-0.5 hover:border-[var(--color-nebula-cyan)]/40 hover:text-star"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
