import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Declare test and expect to fix TypeScript errors
declare const test: any;
declare const expect: any;

// Simple mock for scrollIntoView which isn't implemented in JSDOM
window.HTMLElement.prototype.scrollIntoView = function() {};

test('renders Aspire dashboard', () => {
  render(<App />);
  const linkElement = screen.getByText(/account balance/i);
  expect(linkElement).toBeInTheDocument();
});

test('opens new card modal when button clicked', () => {
  render(<App />);
  const newCardBtn = screen.getByText(/new card/i);
  fireEvent.click(newCardBtn);
  const modalTitle = screen.getByText(/add new card/i);
  expect(modalTitle).toBeInTheDocument();
});