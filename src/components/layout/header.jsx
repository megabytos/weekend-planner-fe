'use client';

import { CircleUser, LogIn, Menu, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';

import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { openModal } from '@/libs/redux/modal-burgerSlice';

import Icon from '../ui/icon';
import ModalBurger from '../ui/modal-burger';
import Container from './container';

export default function Header() {
  const modal = useAppSelector((state) => state.modal.modal);
  const dispatch = useAppDispatch();

  const handleOpenModal = () => {
    dispatch(openModal());
  };
  return (
    <header className="bg-blue">
      <Container>
        <div className="flex justify-between items-center h-[68px]">
          <Icon
            className="fill-yellow"
            name="logo-icon"
            width="200"
            height="40"
            ariaLabel="Logo"
          />
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
                <Menu
                  size={24}
                  className="stroke-blue-light"
                  onClick={handleOpenModal}
                />
                <ModalBurger isOpen={modal} onClose={handleOpenModal} />
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
      <div id="modal"></div>
    </header>
  );
}
