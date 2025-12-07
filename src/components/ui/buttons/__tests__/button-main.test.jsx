import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ButtonMain from '../button-main';

describe('ButtonMain', () => {
  it('renders button with children text', () => {
    render(<ButtonMain>Click me</ButtonMain>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<ButtonMain onClick={handleClick}>Click me</ButtonMain>);

    await user.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<ButtonMain isLoading>Submit</ButtonMain>);
    const loader = document.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
  });

  it('is disabled when isDisabled is true', () => {
    render(<ButtonMain isDisabled>Submit</ButtonMain>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <ButtonMain isDisabled onClick={handleClick}>
        Click me
      </ButtonMain>,
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<ButtonMain className="custom-class">Button</ButtonMain>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('sets aria-label when label prop is provided', () => {
    render(<ButtonMain label="Submit form">Submit</ButtonMain>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });
});
