import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import TeamApprovals from '../../../component/team-approvals';
import { fetchUserData } from '../../../redux/slice/user-slices';
import { createTestStore, renderWithProviders } from '../../../test/render';

describe('Team approvals', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('lets a team lead approve a pending work update', async () => {
    localStorage.setItem('token', 'mock-token-2');
    const store = createTestStore();
    await store.dispatch(fetchUserData());

    const user = userEvent.setup();
    renderWithProviders(<TeamApprovals />, { store });

    const nameHeading = await screen.findByText('Jordan Rivera');
    const card = nameHeading.closest('div.border-2');
    if (!(card instanceof HTMLElement)) {
      throw new Error('Expected to find the Jordan Rivera card');
    }
    expect(within(card).getByText(/pending/i)).toBeInTheDocument();

    await user.click(within(card).getByRole('button', { name: /approve/i }));

    expect(await within(card).findByText(/approved/i)).toBeInTheDocument();
    expect(within(card).queryByRole('button', { name: /approve/i })).not.toBeInTheDocument();
  });
});
