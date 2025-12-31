import { SiGithub, SiLinkedin } from "react-icons/si";
import { HiOutlineMail } from "react-icons/hi";
import { profile } from "@/data/profile";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 border-t border-border/30">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <p className="font-display font-bold text-lg text-gradient mb-1">
              {profile.name}
            </p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass rounded-xl hover-lift transition-all"
              aria-label="GitHub"
            >
              <SiGithub size={20} />
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass rounded-xl hover-lift transition-all"
              aria-label="LinkedIn"
            >
              <SiLinkedin size={20} />
            </a>
            <a
              href={`mailto:${profile.contact.email}`}
              className="p-3 glass rounded-xl hover-lift transition-all"
              aria-label="Email"
            >
              <HiOutlineMail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
