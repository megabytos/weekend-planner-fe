'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import cn from '@/utils/class-names';

/**
 * @param {{ isOpen: boolean; onClose: () => void; className: string; children: React.ReactNode }} props
 * @returns {React.ReactPortal | null}
 */
export default function Modal({ isOpen, onClose, children, className = '' }) {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.getElementById('modal-root');

  if (!isOpen || !modalRoot) return null;

  return /** @type {any} */ (
    createPortal(
      <div
        className={cn('fixed inset-0 bg-black/50 z-50', className)}
        onClick={handleBackdropClick}
      >
        {children}
      </div>,
      modalRoot,
    )
  );
}
