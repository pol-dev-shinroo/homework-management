import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentDashboardPage from '@/app/student/dashboard/page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: mockPush,
  }),
}));

const mockTasks = [
  { _id: '1', title: "Complete today's Vocabmon quest", isDaily: true, status: 'incomplete', date: 'May 16' },
  { _id: '2', title: "New practice readers (E) - D4, D5, D6, D7", isDaily: false, status: 'incomplete', dueDate: 'May 18' },
];

describe('StudentDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn((url) => {
      if (url === '/api/tasks') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTasks),
        });
      }
      if (url.startsWith('/api/tasks/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.reject(new Error('Unknown API'));
    }) as jest.Mock;
  });

  test('renders student dashboard and fetches tasks', async () => {
    render(<StudentDashboardPage />);
    
    expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("Complete today's Vocabmon quest")).toBeInTheDocument();
      expect(screen.getByText("New practice readers (E) - D4, D5, D6, D7")).toBeInTheDocument();
    });
  });

  test('toggles collapsible sections', async () => {
    render(<StudentDashboardPage />);
    
    await waitFor(() => expect(screen.getByText("Complete today's Vocabmon quest")).toBeInTheDocument());

    const dailyHeader = screen.getByText('Daily Quests');
    const weeklyHeader = screen.getByText('Weekly Assignments');

    // Collapse Daily
    fireEvent.click(dailyHeader);
    expect(screen.queryByText("Complete today's Vocabmon quest")).not.toBeInTheDocument();
    expect(screen.getByText("New practice readers (E) - D4, D5, D6, D7")).toBeInTheDocument();

    // Collapse Weekly
    fireEvent.click(weeklyHeader);
    expect(screen.queryByText("New practice readers (E) - D4, D5, D6, D7")).not.toBeInTheDocument();
  });

  test('updates task status', async () => {
    render(<StudentDashboardPage />);
    
    await waitFor(() => expect(screen.getAllByText('Finish')).toHaveLength(2));
    
    const finishButtons = screen.getAllByText('Finish');
    fireEvent.click(finishButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks/1', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'waiting' })
      }));
    });
  });

  test('navigates to rewards page', () => {
    render(<StudentDashboardPage />);
    const coinsWidget = screen.getByTestId('coins-widget');
    fireEvent.click(coinsWidget);
    expect(mockPush).toHaveBeenCalledWith('/student/rewards');
  });
});
