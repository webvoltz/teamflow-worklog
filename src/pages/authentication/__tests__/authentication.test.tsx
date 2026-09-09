import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../../test/render';
import Authentication from '../index';

const fillLoginForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText('name@teamflow.dev'), 'employee@teamflow.dev');
  await user.type(screen.getByPlaceholderText('••••••••'), 'demo-password');
  await user.click(screen.getByRole('button', { name: /sign in/i }));
};

const typeOtp = async (user: ReturnType<typeof userEvent.setup>, code: string) => {
  const inputs = screen.getAllByPlaceholderText('-');
  for (let index = 0; index < code.length; index += 1) {
    const input = inputs[index];
    const digit = code[index];
    if (!input || !digit) continue;
    await user.type(input, digit);
  }
};

describe('Authentication', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('logs the employee in after a valid OTP', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authentication />);

    await fillLoginForm(user);
    expect(await screen.findByText('OTP Verification')).toBeInTheDocument();

    await typeOtp(user, '123456');

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-token-1');
    });
  });

  it('shows an error and stays on the OTP screen for an invalid code', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Authentication />);

    await fillLoginForm(user);
    expect(await screen.findByText('OTP Verification')).toBeInTheDocument();

    await typeOtp(user, '000000');

    expect(await screen.findByText(/invalid otp/i)).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByText('OTP Verification')).toBeInTheDocument();
  });
});
