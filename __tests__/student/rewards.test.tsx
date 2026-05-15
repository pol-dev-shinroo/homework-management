import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RewardShopPage from '@/app/student/rewards/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

describe('RewardShopPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn((url) => {
      if (url === '/api/student/progress') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ coins: 0, coupons: 0 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }) as jest.Mock;
    
    window.alert = jest.fn();
  });

  test('renders rewards and fetches progress', async () => {
    render(<RewardShopPage />);
    
    expect(screen.getByText('Reward Shop')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/student/progress');
    });
  });

  test('shows modal when coins are enough', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ coins: 100, coupons: 0 }),
      })
    );

    render(<RewardShopPage />);

    await waitFor(() => {
      expect(screen.getByText('Week Complete!')).toBeInTheDocument();
      expect(screen.getByText('Get My Coupon!')).toBeInTheDocument();
    });
  });

  test('handles trading coins for coupons', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ coins: 100, coupons: 0 }),
      })
    );

    render(<RewardShopPage />);

    await waitFor(() => expect(screen.getByText('Get My Coupon!')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Get My Coupon!'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/student/progress', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ coins: 0, coupons: 1 })
      }));
    });
  });

  test('handles claiming a reward', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ coins: 0, coupons: 3 }),
      })
    );

    render(<RewardShopPage />);

    await waitFor(() => expect(screen.getAllByText('Claim Reward!').length).toBeGreaterThan(0));

    fireEvent.click(screen.getAllByText('Claim Reward!')[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/student/progress', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ coupons: 0 })
      }));
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
