import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeacherDashboardPage from '@/app/teacher/dashboard/page';

// Mock next/navigation
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

const mockPendingTasks = [
  { _id: 'task1', title: 'Math worksheet', status: 'waiting', date: '2026-05-16' }
];

const mockStudent = { _id: 'student1', coins: 100 };

describe('TeacherDashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn((url) => {
      if (url === '/api/tasks') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPendingTasks),
        });
      }
      if (url === '/api/student/progress') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStudent),
        });
      }
      if (url.startsWith('/api/tasks/') || url === '/api/student/progress') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.reject(new Error('Unknown API'));
    }) as jest.Mock;
  });

  test('renders default state with fetched data', async () => {
    render(<TeacherDashboardPage />);
    
    expect(screen.getByText('Teacher / Parent Dashboard')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Math worksheet')).toBeInTheDocument();
      expect(screen.getAllByText('Student').length).toBeGreaterThan(0);
    });
  });

  test('handles navigation routing', () => {
    render(<TeacherDashboardPage />);
    
    fireEvent.click(screen.getByText('Back'));
    expect(mockBack).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Upload Homework'));
    expect(mockPush).toHaveBeenCalledWith('/teacher/upload');

    fireEvent.click(screen.getByText('See Homework'));
    expect(mockPush).toHaveBeenCalledWith('/student/dashboard');
  });

  test('interacts with the pending approvals table', async () => {
    render(<TeacherDashboardPage />);

    await waitFor(() => expect(screen.getByText('Math worksheet')).toBeInTheDocument());

    const approveBtn = screen.getByTitle('Approve');
    fireEvent.click(approveBtn);

    await waitFor(() => {
      // Mark task as complete
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks/task1', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'complete' })
      }));
      // Award coins
      expect(global.fetch).toHaveBeenCalledWith('/api/student/progress', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ coins: 120 })
      }));
    });
  });
});
