import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

import Container from '../layout/container';
import Burger from './burger';
import ButtonIcon from './button-icon';

export const ModalBurger = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return createPortal(
    <Container className="fixed top-0 right-0 w-full h-full bg-white-dark/50 z-2">
      <div className="fixed top-0 right-0 h-full bg-white-dark/50 z-5">
        <div className="relative flex justify-center pt-[68px] w-[197px] h-full bg-blue-light ">
          <ButtonIcon
            className="absolute top-5 right-5"
            clickFunction={onClose}
          >
            <X className="w-6 h-6 stroke-blue" />
          </ButtonIcon>
          <Burger />
        </div>
      </div>
    </Container>,
    document.getElementById('modal'),
  );
};
