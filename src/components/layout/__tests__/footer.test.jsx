import { render, screen } from '@testing-library/react';

import Footer from '../footer';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, ...props }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} width={width} height={height} />;
  },
}));

describe('Footer', () => {
  it('renders footer element', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders logo', () => {
    render(<Footer />);
    const logo = screen.getByLabelText('Logo');
    expect(logo).toBeInTheDocument();
  });

  describe('Services section', () => {
    it('renders Services heading', () => {
      render(<Footer />);
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('renders all service links', () => {
      render(<Footer />);
      expect(screen.getByText('Search Events')).toBeInTheDocument();
      expect(screen.getByText('Planner')).toBeInTheDocument();
      expect(screen.getByText('Become a Partner')).toBeInTheDocument();
      expect(screen.getByText('Add Event')).toBeInTheDocument();
    });

    it('has correct hrefs for service links', () => {
      render(<Footer />);
      const serviceLinks = screen.getAllByText('Search Events');
      const searchLink = serviceLinks[0].closest('a');
      expect(searchLink).toHaveAttribute('href', '/search');

      expect(screen.getByText('Become a Partner').closest('a')).toHaveAttribute(
        'href',
        '/partner-sign-up',
      );
    });
  });

  describe('Find events section', () => {
    it('renders Find events heading', () => {
      render(<Footer />);
      expect(screen.getByText('Find events')).toBeInTheDocument();
    });

    it('renders all event category links', () => {
      render(<Footer />);
      expect(screen.getByText('Theatres')).toBeInTheDocument();
      expect(screen.getByText('Concerts')).toBeInTheDocument();
      expect(screen.getByText('Kids')).toBeInTheDocument();
      expect(screen.getByText('Stand Up')).toBeInTheDocument();
      expect(screen.getByText('Festivals')).toBeInTheDocument();
    });

    it('has correct hrefs for event category links', () => {
      render(<Footer />);
      expect(screen.getByText('Theatres').closest('a')).toHaveAttribute('href', '/theatres');
      expect(screen.getByText('Concerts').closest('a')).toHaveAttribute('href', '/concerts');
      expect(screen.getByText('Kids').closest('a')).toHaveAttribute('href', '/kids');
      expect(screen.getByText('Stand Up').closest('a')).toHaveAttribute('href', '/stand-up');
      expect(screen.getByText('Festivals').closest('a')).toHaveAttribute('href', '/festivals');
    });
  });

  describe('Contacts section', () => {
    it('renders Contacts heading', () => {
      render(<Footer />);
      expect(screen.getByText('Contacts')).toBeInTheDocument();
    });

    it('renders all contact links', () => {
      render(<Footer />);
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('has correct hrefs for contact links', () => {
      render(<Footer />);
      expect(screen.getByText('About Us').closest('a')).toHaveAttribute('href', '/about');
      expect(screen.getByText('Support').closest('a')).toHaveAttribute('href', '/support');
      expect(screen.getByText('Privacy Policy').closest('a')).toHaveAttribute(
        'href',
        '/privacy-policy',
      );
    });
  });

  describe('Social links', () => {
    it('renders all social media icons', () => {
      render(<Footer />);
      const facebookIcon = screen.getByAltText('Facebook icon');
      const pinterestIcon = screen.getByAltText('Pinterest icon');
      const instagramIcon = screen.getByAltText('Instagram icon');

      expect(facebookIcon).toBeInTheDocument();
      expect(pinterestIcon).toBeInTheDocument();
      expect(instagramIcon).toBeInTheDocument();
    });

    it('social links open in new tab', () => {
      render(<Footer />);
      const socialLinks = screen.getAllByRole('link', { name: /icon/i });

      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('has correct hrefs for social links', () => {
      render(<Footer />);
      const facebookLink = screen.getByAltText('Facebook icon').closest('a');
      const pinterestLink = screen.getByAltText('Pinterest icon').closest('a');
      const instagramLink = screen.getByAltText('Instagram icon').closest('a');

      expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/');
      expect(pinterestLink).toHaveAttribute('href', 'https://www.pinterest.com/');
      expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/');
    });
  });

  describe('Copyright', () => {
    it('renders copyright text', () => {
      render(<Footer />);
      expect(screen.getByText('© 2025 WeekendPlanner')).toBeInTheDocument();
    });
  });

  describe('Structure and styling', () => {
    it('has correct background color class', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('bg-black');
    });

    it('renders all three navigation sections', () => {
      render(<Footer />);
      const servicesHeading = screen.getByText('Services');
      const eventsHeading = screen.getByText('Find events');
      const contactsHeading = screen.getByText('Contacts');

      expect(servicesHeading).toBeInTheDocument();
      expect(eventsHeading).toBeInTheDocument();
      expect(contactsHeading).toBeInTheDocument();
    });
  });
});
