'use client';

import Image from 'next/image';
import Link from 'next/link';

import Logo from '../ui/logo';
import Container from './container';
import { footerNavLinks, socialLinksData } from './data';
import FooterNavLink from './footer-nav-link';

export default function Footer() {
  return (
    <footer className="bg-black text-blue-light">
      <Container>
        <div className="flex flex-col gap-8 items-center pt-5 pb-10">
          <nav className="w-full flex flex-col md:flex-row gap-6 items-center md:items-start md:justify-between">
            <div>
              <h3 className="text-lg text-center font-bold md:text-left">
                Services
              </h3>
              <ul className="flex flex-col items-center mt-3 md:items-start">
                {footerNavLinks.services.map((link) => (
                  <li key={link.href}>
                    <FooterNavLink href={link.href} text={link.text} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg text-center font-bold md:text-left">
                Find events
              </h3>
              <ul className="flex flex-col items-center mt-3 md:items-start">
                {footerNavLinks.events.map((link) => (
                  <li key={link.href}>
                    <FooterNavLink href={link.href} text={link.text} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg text-center font-bold md:text-left">
                Contacts
              </h3>
              <ul className="flex flex-col items-center mt-3 md:items-start">
                {footerNavLinks.contacts.map((link) => (
                  <li key={link.href}>
                    <FooterNavLink href={link.href} text={link.text} />
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="flex gap-8 flex-col sm:flex-row sm:justify-between items-center self-stretch">
            <Logo />
            <ul className="flex gap-4">
              {socialLinksData.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative hover:-translate-y-0.5 transition-transform"
                  >
                    <Image
                      src={link.icon}
                      alt={link.alt}
                      width={24}
                      height={24}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 text-xs">© 2025 WeekendPlanner</div>
        </div>
      </Container>
    </footer>
  );
}
