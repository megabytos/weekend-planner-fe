'use client';

import { CircleUser, LogIn, Menu, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';

import Container from './container';

export default function Header() {
  return (
    <header className="bg-blue">
      <Container>
        <div className="flex justify-between items-center h-[68px]">
          <div>Logo</div>
          <nav className="hidden md:flex gap-4 ml-auto mr-4">
            <ul className="flex gap-4">
              <li>
                <Link
                  href="#"
                  className="text-sm lg:text-lg text-blue-light font-bold"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm lg:text-lg text-blue-light font-bold"
                >
                  Add event
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm lg:text-lg text-blue-light font-bold"
                >
                  Favorites
                </Link>
              </li>
            </ul>
          </nav>
          <ul className="flex gap-4">
            <li>
              <button>
                <LogIn size={24} className="stroke-blue-light" />
              </button>
            </li>
            <li>
              <button>
                <UserRoundPlus size={24} className="stroke-blue-light" />
              </button>
            </li>
            <li className="md:hidden">
              <button>
                <Menu size={24} className="stroke-blue-light" />
              </button>
            </li>
            <li>
              <button>
                <CircleUser size={24} className="stroke-blue-light" />
              </button>
            </li>
          </ul>
        </div>
      </Container>
    </header>
  );
}
