/**
 * Basic input validators for auth forms.
 * - `validateEmail(value)`: required, simple pattern.
 * - `validatePassword(value)`: required, min 8 chars, must include letters and numbers.
 */
export const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    return { isValid: false, error: 'Email is required.' };
  }

  const isValidEmail = (email) => emailRegex.test(email);
  if (!isValidEmail(value)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  return { isValid: true, error: '' };
};

export const validatePassword = (value) => {
  if (!value) {
    return { isValid: false, error: 'Password is required.' };
  }

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  if (!isValidPassword(value)) {
    return {
      isValid: false,
      error:
        'Password must contain at least 8 characters, including letters and numbers.',
    };
  }

  return { isValid: true, error: '' };
};
