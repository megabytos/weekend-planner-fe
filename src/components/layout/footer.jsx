'use client';

import Link from 'next/link';

import Container from './container';

export default function Footer() {
  return (
    <footer className="bg-black text-blue-light">
      <Container>
        <div className="flex flex-col gap-8 items-center pt-5 pb-10">
          <nav className="w-full flex flex-col md:flex-row gap-6 items-center md:items-start md:justify-between">
            <div>
              <h3 className="text-center font-bold md:text-left">Services</h3>
              <ul className="flex flex-col gap-2 items-center mt-3 md:items-start">
                <li>
                  <Link href="/ideas">Ideas generation</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-center font-bold md:text-left">
                Find events
              </h3>
              <ul className="flex flex-col gap-2 items-center mt-3 md:items-start">
                <li>
                  <Link href="#">Concert</Link>
                </li>
                <li>
                  <Link href="#">Theater</Link>
                </li>
                <li>
                  <Link href="#">Kids</Link>
                </li>
                <li>
                  <Link href="#">Stand-up</Link>
                </li>
                <li>
                  <Link href="#">Festivals</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-center font-bold md:text-left">Contacts</h3>
              <ul className="flex flex-col gap-2 items-center mt-3 md:items-start">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/support">Support</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </nav>
          <div className="flex justify-between items-center self-stretch">
            <div>Logo</div>
            <div>Social Media</div>
          </div>
          <div className="text-xs">© 2025 WeekendPlanner</div>
        </div>
      </Container>
    </footer>
  );
}
