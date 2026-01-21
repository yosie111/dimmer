import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LandingPage from './LandingPage';

// Mock fetch API
global.fetch = jest.fn();

// Helper to render and wait for initial async operations
const renderLandingPage = async () => {
  let result;
  await act(async () => {
    result = render(<LandingPage />);
  });
  // Wait for products fetch to complete
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('/api/products?limit=4');
  });
  return result;
};

// Helper to open the popup via FloatingCta
const openPopup = () => {
  const ctaButton = screen.getByRole('button', { name: /צור קשר/i });
  fireEvent.click(ctaButton);
};

// Helper to fill required fields
const fillRequiredFields = (data = {}) => {
  const {
    name = 'Test User',
    phone = '052-1234567',
    email = 'test@test.com'
  } = data;
  
  const nameInput = document.querySelector('input[name="name"]');
  const phoneInput = document.querySelector('input[type="tel"]');
  const emailInput = document.querySelector('input[type="email"]');
  
  fireEvent.change(nameInput, { target: { value: name } });
  fireEvent.change(phoneInput, { target: { value: phone } });
  fireEvent.change(emailInput, { target: { value: email } });
  
  return { nameInput, phoneInput, emailInput };
};

describe('LandingPage', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Default mock for products API
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });
  });

  describe('Hero Section', () => {
    test('renders main headline', async () => {
      await renderLandingPage();
      expect(screen.getByText('שליטה מושלמת')).toBeInTheDocument();
    });

    test('renders headline accent', async () => {
      await renderLandingPage();
      expect(screen.getByText(/בתאורת הבית/)).toBeInTheDocument();
    });

    test('renders subheadline', async () => {
      await renderLandingPage();
      expect(screen.getByText(/מתגי דימר חכמים/)).toBeInTheDocument();
    });

    test('renders badge with Mark 2 announcement', async () => {
      await renderLandingPage();
      expect(screen.getByText(/חדש! דגמי Mark 2 זמינים/)).toBeInTheDocument();
    });
  });

  describe('Floating CTA', () => {
    test('renders floating CTA button', async () => {
      await renderLandingPage();
      expect(screen.getByRole('button', { name: /צור קשר/i })).toBeInTheDocument();
    });

    test('clicking CTA opens popup', async () => {
      await renderLandingPage();
      openPopup();
      expect(screen.getByText('קבלו הצעת מחיר')).toBeInTheDocument();
    });

    test('CTA hides when popup is open', async () => {
      await renderLandingPage();
      openPopup();
      expect(screen.queryByRole('button', { name: /💬 צור קשר/i })).not.toBeInTheDocument();
    });
  });

  describe('Lead Popup', () => {
    test('popup is hidden initially', async () => {
      await renderLandingPage();
      expect(screen.queryByText('קבלו הצעת מחיר')).not.toBeInTheDocument();
    });

    test('popup displays title and subtitle', async () => {
      await renderLandingPage();
      openPopup();
      expect(screen.getByText('קבלו הצעת מחיר')).toBeInTheDocument();
      expect(screen.getByText('השאירו פרטים ונחזור אליכם בהקדם')).toBeInTheDocument();
    });

    test('popup has close button', async () => {
      await renderLandingPage();
      openPopup();
      expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
    });

    test('close button closes popup', async () => {
      await renderLandingPage();
      openPopup();
      
      fireEvent.click(screen.getByRole('button', { name: '✕' }));
      
      expect(screen.queryByText('קבלו הצעת מחיר')).not.toBeInTheDocument();
    });

    test('renders all form inputs', async () => {
      await renderLandingPage();
      openPopup();
      
      expect(document.querySelector('input[name="name"]')).toBeInTheDocument();
      expect(document.querySelector('input[type="tel"]')).toBeInTheDocument();
      expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
      expect(document.querySelector('textarea[name="message"]')).toBeInTheDocument();
    });

    test('renders submit button', async () => {
      await renderLandingPage();
      openPopup();
      expect(screen.getByRole('button', { name: /שלח פרטים/i })).toBeInTheDocument();
    });

    test('renders privacy note', async () => {
      await renderLandingPage();
      openPopup();
      expect(screen.getByText(/הפרטים שלכם מאובטחים/)).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    beforeEach(async () => {
      await renderLandingPage();
      openPopup();
    });

    test('name input accepts text', () => {
      const nameInput = document.querySelector('input[name="name"]');
      fireEvent.change(nameInput, { target: { value: 'ישראל ישראלי' } });
      expect(nameInput.value).toBe('ישראל ישראלי');
    });

    test('phone input accepts text', () => {
      const phoneInput = document.querySelector('input[type="tel"]');
      fireEvent.change(phoneInput, { target: { value: '052-1234567' } });
      expect(phoneInput.value).toBe('052-1234567');
    });

    test('email input accepts text', () => {
      const emailInput = document.querySelector('input[type="email"]');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(emailInput.value).toBe('test@example.com');
    });

    test('message textarea accepts text', () => {
      const messageInput = document.querySelector('textarea[name="message"]');
      fireEvent.change(messageInput, { target: { value: 'הודעת בדיקה' } });
      expect(messageInput.value).toBe('הודעת בדיקה');
    });

    test('required fields have required attribute', () => {
      expect(document.querySelector('input[name="name"]')).toBeRequired();
      expect(document.querySelector('input[type="tel"]')).toBeRequired();
      expect(document.querySelector('input[type="email"]')).toBeRequired();
    });

    test('message field is optional', () => {
      expect(document.querySelector('textarea[name="message"]')).not.toBeRequired();
    });
  });

  describe('Form Submission', () => {
    test('submits to /api/leads endpoint', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { id: '123' } })
      });

      await renderLandingPage();
      openPopup();
      fillRequiredFields();
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /שלח פרטים/i }));
      });
      
      const leadsCall = fetch.mock.calls.find(call => call[0] === '/api/leads');
      expect(leadsCall).toBeDefined();
    });

    test('sends correct data structure', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await renderLandingPage();
      openPopup();
      
      fireEvent.change(document.querySelector('input[name="name"]'), { target: { value: 'Test User' } });
      fireEvent.change(document.querySelector('input[type="tel"]'), { target: { value: '052-1234567' } });
      fireEvent.change(document.querySelector('input[type="email"]'), { target: { value: 'test@test.com' } });
      fireEvent.change(document.querySelector('textarea[name="message"]'), { target: { value: 'Test message' } });
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /שלח פרטים/i }));
      });
      
      const leadsCall = fetch.mock.calls.find(call => call[0] === '/api/leads');
      const callBody = JSON.parse(leadsCall[1].body);
      
      expect(callBody.name).toBe('Test User');
      expect(callBody.phone).toBe('052-1234567');
      expect(callBody.email).toBe('test@test.com');
      expect(callBody.message).toBe('Test message');
      expect(callBody.source).toBe('website');
    });

    test('sends POST with JSON headers', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await renderLandingPage();
      openPopup();
      fillRequiredFields();
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /שלח פרטים/i }));
      });
      
      const leadsCall = fetch.mock.calls.find(call => call[0] === '/api/leads');
      expect(leadsCall[1]).toEqual(expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }));
    });

    test('shows success message after submission', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await renderLandingPage();
      openPopup();
      fillRequiredFields();
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /שלח פרטים/i }));
      });
      
      await waitFor(() => {
        expect(screen.getByText('תודה רבה!')).toBeInTheDocument();
      });
    });

    test('shows loading state during submission', async () => {
      let resolveSubmit;
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }).mockImplementationOnce(() => new Promise(resolve => {
        resolveSubmit = resolve;
      }));

      await renderLandingPage();
      openPopup();
      fillRequiredFields();
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /שלח פרטים/i }));
      });
      
      expect(screen.getByRole('button', { name: /שולח/i })).toBeDisabled();
      
      await act(async () => {
        resolveSubmit({ ok: true, json: async () => ({ success: true }) });
      });
    });

    test('handles submission error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }).mockRejectedValueOnce(new Error('Network error'));

      await renderLandingPage();
      openPopup();
      fillRequiredFields();
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /שלח פרטים/i }));
      });
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });
      
      expect(screen.queryByText('תודה רבה!')).not.toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('does not show success on failed response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      }).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false })
      });

      await renderLandingPage();
      openPopup();
      fillRequiredFields();
      
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /שלח פרטים/i }));
      });
      
      await waitFor(() => {
        expect(screen.queryByText('תודה רבה!')).not.toBeInTheDocument();
      });
    });
  });

  describe('Products API', () => {
    test('fetches products on mount', async () => {
      await renderLandingPage();
      expect(fetch).toHaveBeenCalledWith('/api/products?limit=4');
    });

    test('handles products API error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await act(async () => {
        render(<LandingPage />);
      });
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });
      
      expect(screen.getByText('שליטה מושלמת')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('displays products when fetched', async () => {
      const mockProducts = [
        { _id: '1', name: 'Dimmer Mark 1', price: 199, sku: 'DIM-M1-P1-WHT', model: 'mark1', positions: 1 },
        { _id: '2', name: 'Dimmer Mark 2', price: 299, sku: 'DIM-M2-P2-BLK', model: 'mark2', positions: 2 }
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockProducts })
      });

      await renderLandingPage();
      
      await waitFor(() => {
        const productNames = screen.getAllByText('Dimmer Mark 1');
        expect(productNames.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Product Selection', () => {
    test('popup shows selected product info', async () => {
      const mockProducts = [
        { _id: '1', name: 'Dimmer Pro', price: 399, sku: 'DIM-M2-P3-WHT', model: 'mark2', positions: 3 }
      ];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockProducts })
      });

      await renderLandingPage();
      
      await waitFor(() => {
        const productNames = screen.getAllByText('Dimmer Pro');
        expect(productNames.length).toBeGreaterThan(0);
      });
      
      const quoteButtons = screen.getAllByRole('button', { name: /קבל הצעת מחיר/i });
      fireEvent.click(quoteButtons[0]);
      
      expect(screen.getByText(/מעוניינים במוצר/)).toBeInTheDocument();
      expect(screen.getByText(/Dimmer Pro - ₪399/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('form inputs have correct types', async () => {
      await renderLandingPage();
      openPopup();
      
      expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
      expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
      expect(document.querySelector('input[type="tel"]')).toBeInTheDocument();
      expect(document.querySelector('textarea')).toBeInTheDocument();
    });

    test('submit button is enabled initially', async () => {
      await renderLandingPage();
      openPopup();
      expect(screen.getByRole('button', { name: /שלח פרטים/i })).not.toBeDisabled();
    });
  });

  describe('Footer', () => {
    test('renders footer with copyright', async () => {
      await renderLandingPage();
      expect(screen.getByText(/Dimmer. כל הזכויות שמורות/)).toBeInTheDocument();
    });

    test('displays current year', async () => {
      await renderLandingPage();
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
    });
  });
});