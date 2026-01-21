import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LandingPage from './LandingPage';

// Mock fetch API
global.fetch = jest.fn();

describe('LandingPage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Rendering', () => {
    test('renders landing page with logo', () => {
      render(<LandingPage />);
      expect(screen.getByText('ProductX')).toBeInTheDocument();
    });

    test('renders form with text inputs', () => {
      render(<LandingPage />);
      
      const textInputs = screen.getAllByRole('textbox');
      expect(textInputs.length).toBeGreaterThanOrEqual(2);
    });

    test('renders submit button', () => {
      render(<LandingPage />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('renders product interest dropdown', () => {
      render(<LandingPage />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    test('renders email input', () => {
      render(<LandingPage />);
      const emailInput = document.querySelector('input[type="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    test('renders phone input', () => {
      render(<LandingPage />);
      const phoneInput = document.querySelector('input[type="tel"]');
      expect(phoneInput).toBeInTheDocument();
    });

    test('renders stats numbers', () => {
      render(<LandingPage />);
      expect(screen.getByText('10K+')).toBeInTheDocument();
      expect(screen.getByText('98%')).toBeInTheDocument();
      expect(screen.getByText('24/7')).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    test('name input accepts text', () => {
      render(<LandingPage />);
      const nameInput = document.querySelector('input[name="name"]');
      
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      expect(nameInput.value).toBe('Test User');
    });

    test('phone input accepts text', () => {
      render(<LandingPage />);
      const phoneInput = document.querySelector('input[type="tel"]');
      
      fireEvent.change(phoneInput, { target: { value: '052-1234567' } });
      expect(phoneInput.value).toBe('052-1234567');
    });

    test('email input accepts text', () => {
      render(<LandingPage />);
      const emailInput = document.querySelector('input[type="email"]');
      
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      expect(emailInput.value).toBe('test@test.com');
    });

    test('message textarea accepts text', () => {
      render(<LandingPage />);
      const messageInput = document.querySelector('textarea[name="message"]');
      
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      expect(messageInput.value).toBe('Test message');
    });

    test('product interest select works', () => {
      render(<LandingPage />);
      const select = screen.getByRole('combobox');
      
      fireEvent.change(select, { target: { value: 'premium' } });
      expect(select.value).toBe('premium');
    });

    test('required fields have required attribute', () => {
      render(<LandingPage />);
      
      const nameInput = document.querySelector('input[name="name"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const emailInput = document.querySelector('input[type="email"]');
      
      expect(nameInput).toBeRequired();
      expect(phoneInput).toBeRequired();
      expect(emailInput).toBeRequired();
    });
  });

  describe('Form Submission', () => {
    test('calls fetch with correct endpoint on submit', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: '123' } })
      });

      render(<LandingPage />);
      
      // Fill form
      const nameInput = document.querySelector('input[name="name"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const emailInput = document.querySelector('input[type="email"]');
      
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(phoneInput, { target: { value: '052-1234567' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      
      // Submit
      const button = screen.getByRole('button');
      await act(async () => {
        fireEvent.click(button);
      });
      
      // Verify fetch was called with correct endpoint
      expect(fetch).toHaveBeenCalledWith('/api/leads', expect.anything());
    });

    test('sends correct data structure', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(<LandingPage />);
      
      // Fill form
      const nameInput = document.querySelector('input[name="name"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const emailInput = document.querySelector('input[type="email"]');
      const select = screen.getByRole('combobox');
      const messageInput = document.querySelector('textarea[name="message"]');
      
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(phoneInput, { target: { value: '052-1234567' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(select, { target: { value: 'business' } });
      fireEvent.change(messageInput, { target: { value: 'Test message' } });
      
      // Submit
      const button = screen.getByRole('button');
      await act(async () => {
        fireEvent.click(button);
      });
      
      // Verify body content
      const callBody = JSON.parse(fetch.mock.calls[0][1].body);
      expect(callBody.name).toBe('Test User');
      expect(callBody.phone).toBe('052-1234567');
      expect(callBody.email).toBe('test@test.com');
      expect(callBody.productInterest).toBe('business');
      expect(callBody.message).toBe('Test message');
      expect(callBody.source).toBe('website');
    });

    test('sends POST request with JSON headers', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(<LandingPage />);
      
      // Fill required fields
      const nameInput = document.querySelector('input[name="name"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const emailInput = document.querySelector('input[type="email"]');
      
      fireEvent.change(nameInput, { target: { value: 'Test' } });
      fireEvent.change(phoneInput, { target: { value: '050-0000000' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      
      // Submit
      const button = screen.getByRole('button');
      await act(async () => {
        fireEvent.click(button);
      });
      
      expect(fetch).toHaveBeenCalledWith('/api/leads', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }));
    });

    test('handles submission error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<LandingPage />);
      
      // Fill required fields
      const nameInput = document.querySelector('input[name="name"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const emailInput = document.querySelector('input[type="email"]');
      
      fireEvent.change(nameInput, { target: { value: 'Test' } });
      fireEvent.change(phoneInput, { target: { value: '050-0000000' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      
      // Submit
      const button = screen.getByRole('button');
      await act(async () => {
        fireEvent.click(button);
      });
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });
      
      // Form should still be visible
      expect(nameInput).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('does not show success on failed response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false })
      });

      render(<LandingPage />);
      
      // Fill required fields
      const nameInput = document.querySelector('input[name="name"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const emailInput = document.querySelector('input[type="email"]');
      
      fireEvent.change(nameInput, { target: { value: 'Test' } });
      fireEvent.change(phoneInput, { target: { value: '050-0000000' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      
      // Submit
      const button = screen.getByRole('button');
      await act(async () => {
        fireEvent.click(button);
      });
      
      // Form should still be visible
      await waitFor(() => {
        expect(nameInput).toBeInTheDocument();
      });
    });
  });

  describe('Form Data Structure', () => {
    test('includes source field as "website" by default', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(<LandingPage />);
      
      // Fill required fields
      const nameInput = document.querySelector('input[name="name"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const emailInput = document.querySelector('input[type="email"]');
      
      fireEvent.change(nameInput, { target: { value: 'Test' } });
      fireEvent.change(phoneInput, { target: { value: '050-0000000' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      
      // Submit
      const button = screen.getByRole('button');
      await act(async () => {
        fireEvent.click(button);
      });
      
      const callBody = JSON.parse(fetch.mock.calls[0][1].body);
      expect(callBody.source).toBe('website');
    });

    test('sends empty string for optional fields when not filled', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(<LandingPage />);
      
      // Fill required fields only
      const nameInput = document.querySelector('input[name="name"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const emailInput = document.querySelector('input[type="email"]');
      
      fireEvent.change(nameInput, { target: { value: 'Test' } });
      fireEvent.change(phoneInput, { target: { value: '050-0000000' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      
      // Submit
      const button = screen.getByRole('button');
      await act(async () => {
        fireEvent.click(button);
      });
      
      const callBody = JSON.parse(fetch.mock.calls[0][1].body);
      expect(callBody.message).toBe('');
      expect(callBody.productInterest).toBe('');
    });
  });

  describe('Accessibility', () => {
    test('submit button is not disabled initially', () => {
      render(<LandingPage />);
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    test('form has all input types', () => {
      render(<LandingPage />);
      
      expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
      expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
      expect(document.querySelector('input[type="tel"]')).toBeInTheDocument();
      expect(document.querySelector('textarea')).toBeInTheDocument();
      expect(document.querySelector('select')).toBeInTheDocument();
    });
  });
});
