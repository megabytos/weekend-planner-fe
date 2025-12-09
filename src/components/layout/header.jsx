'use client';

import { CircleUser, LogIn, Menu, UserPen } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/context/auth-context';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { closeModal, openModal } from '@/libs/redux/slices/modal-menu-slice';

import Button from '../ui/buttons/button';
import Logo from '../ui/logo';
import Modal from '../ui/modal';
import Container from './container';
import { headerNavLinks } from './data';
import HeaderNavLink from './header-nav-link';
import ModalMenu from './modal-menu';

export default function Header() {
  const isModalMenuOpen = useAppSelector((state) => state.modalMenu.isOpen);
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <header className="bg-blue">
      <Container>
        <div className="flex justify-between items-center h-[68px]">
          <Logo />
          <nav className="hidden md:flex gap-4 ml-auto mr-4">
            <ul className="flex gap-4">
              {headerNavLinks.map((link) => (
                <li key={link.href}>
                  <HeaderNavLink href={link.href} text={link.text} />
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex gap-4 items-center">
            {!user && (
              <>
                <li>
                  <Link
                    href="/sign-in"
                    className="[:hover&>svg]:stroke-orange-light"
                  >
                    <LogIn size={24} className="stroke-blue-light" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="[:hover&>svg]:stroke-orange-light"
                  >
                    <UserPen size={24} className="stroke-blue-light" />
                  </Link>
                </li>
              </>
            )}

            {user && (
              <li>
                <Link
                  href="/user"
                  className="[:hover&>svg]:stroke-orange-light"
                >
                  <CircleUser size={24} className="stroke-blue-light" />
                </Link>
              </li>
            )}
            <li className="md:hidden">
              <Button
                onClick={handleOpenModal}
                className="[:hover&>svg]:stroke-orange-light"
              >
                <Menu size={24} className="stroke-blue-light" />
              </Button>
            </li>
          </ul>
        </div>
      </Container>
      <Modal
        isOpen={isModalMenuOpen}
        onClose={handleCloseModal}
        className="flex justify-end"
      >
        <ModalMenu onClose={handleCloseModal} />
      </Modal>
    </header>
  );
}
