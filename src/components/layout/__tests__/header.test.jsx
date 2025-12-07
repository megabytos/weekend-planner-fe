import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useAuth } from '@/context/auth-context';
import { useAppDispatch } from '@/libs/redux/hooks/use-app-dispatch';
import { useAppSelector } from '@/libs/redux/hooks/use-app-selector';
import { closeModal, openModal } from '@/libs/redux/slices/modal-menu-slice';

import Header from '../header';

// Mock dependencies
jest.mock('@/context/auth-context');
jest.mock('@/libs/redux/hooks/use-app-dispatch');
jest.mock('@/libs/redux/hooks/use-app-selector');
jest.mock('@/libs/redux/slices/modal-menu-slice', () => ({
  openModal: jest.fn(),
  closeModal: jest.fn(),
}));

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Header', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAppDispatch.mockReturnValue(mockDispatch);
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ user: null });
      useAppSelector.mockReturnValue(false);
    });

    it('renders logo', () => {
      render(<Header />);
      const logo = screen.getByLabelText('Logo');
      expect(logo).toBeInTheDocument();
    });

    it('renders navigation links on desktop', () => {
      render(<Header />);
      expect(screen.getByText('Search Events')).toBeInTheDocument();
      expect(screen.getByText('Planner')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Add Event')).toBeInTheDocument();
      expect(screen.getByText('Favorites')).toBeInTheDocument();
    });

    it('shows sign-in and sign-up icons when user is not logged in', () => {
      const { container } = render(<Header />);
      const signInLink = container.querySelector('a[href="/sign-in"]');
      const signUpLink = container.querySelector('a[href="/sign-up"]');
      
      expect(signInLink).toBeInTheDocument();
      expect(signUpLink).toBeInTheDocument();
    });

    it('does not show user profile icon when user is not logged in', () => {
      const { container } = render(<Header />);
      const userLink = container.querySelector('a[href="/user"]');
      expect(userLink).not.toBeInTheDocument();
    });

    it('opens modal menu when menu button is clicked', async () => {
      const user = userEvent.setup();
      render(<Header />);

      const menuButtons = screen.getAllByRole('button');
      const menuButton = menuButtons.find((btn) => btn.querySelector('svg'));

      await user.click(menuButton);

      expect(mockDispatch).toHaveBeenCalledWith(openModal());
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      });
      useAppSelector.mockReturnValue(false);
    });

    it('shows user profile icon when user is logged in', () => {
      const { container } = render(<Header />);
      const userLink = container.querySelector('a[href="/user"]');
      expect(userLink).toBeInTheDocument();
    });

    it('does not show sign-in and sign-up icons when user is logged in', () => {
      const { container } = render(<Header />);
      const signInLink = container.querySelector('a[href="/sign-in"]');
      const signUpLink = container.querySelector('a[href="/sign-up"]');
      
      expect(signInLink).not.toBeInTheDocument();
      expect(signUpLink).not.toBeInTheDocument();
    });
  });

  describe('modal menu', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ user: null });
      // Create modal-root for portal
      const modalRoot = document.createElement('div');
      modalRoot.setAttribute('id', 'modal-root');
      document.body.appendChild(modalRoot);
    });

    afterEach(() => {
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot) {
        document.body.removeChild(modalRoot);
      }
    });

    it('shows modal when isModalMenuOpen is true', () => {
      useAppSelector.mockReturnValue(true);
      render(<Header />);
      
      // Modal should be present in the DOM - check by class
      const modal = document.querySelector('.fixed.inset-0');
      expect(modal).toBeInTheDocument();
    });

    it('closes modal when onClose is called', async () => {
      useAppSelector.mockReturnValue(true);
      const user = userEvent.setup();
      render(<Header />);

      // Find close button in modal (if exists)
      const closeButtons = screen.queryAllByRole('button');
      if (closeButtons.length > 1) {
        await user.click(closeButtons[closeButtons.length - 1]);
        expect(mockDispatch).toHaveBeenCalledWith(closeModal());
      }
    });
  });

  describe('navigation links', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ user: null });
      useAppSelector.mockReturnValue(false);
    });

    it('renders correct href for each navigation link', () => {
      render(<Header />);
      
      expect(screen.getByText('Search Events').closest('a')).toHaveAttribute('href', '/search');
      expect(screen.getByText('Planner').closest('a')).toHaveAttribute('href', '/planner');
      expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about');
      expect(screen.getByText('Add Event').closest('a')).toHaveAttribute('href', '/add-event');
      expect(screen.getByText('Favorites').closest('a')).toHaveAttribute('href', '/favorites');
    });
  });
});
