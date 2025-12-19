import { generateRandomCardNumber, generateExpiryDate, generateRandomCVV } from "@/utils";
import { Card, Transaction } from "../interfaces/common";


const STORAGE_KEY_CARDS = 'aspire_cards';

const INITIAL_CARDS: Card[] = [
  {
    id: '1',
    name: 'Mark Henry',
    cardNumber: '1234567890122020',
    expiryDate: '12/20',
    cvv: '123',
    isFrozen: false,
  },
   {
    id: '2',
    name: 'Gourav Mukherjee',
    cardNumber: '9876543210982021',
    expiryDate: '05/25',
    cvv: '456',
    isFrozen: false,
  }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    merchant: 'Hamleys',
    date: '20 May 2020',
    amount: 150,
    type: 'credit', // Refund
    category: 'shopping',
    iconBg: 'bg-blue-100 text-blue-500'
  },
  {
    id: 't2',
    merchant: 'Hamleys',
    date: '20 May 2020',
    amount: 150,
    type: 'debit',
    category: 'travel',
    iconBg: 'bg-green-100 text-green-500'
  },
  {
    id: 't3',
    merchant: 'Hamleys',
    date: '20 May 2020',
    amount: 150,
    type: 'debit',
    category: 'entertainment',
    iconBg: 'bg-red-100 text-red-500'
  },
  {
    id: 't4',
    merchant: 'Supermarket',
    date: '19 May 2020',
    amount: 85.50,
    type: 'debit',
    category: 'shopping',
    iconBg: 'bg-blue-100 text-blue-500'
  }
];

export const cardService = {
  getCards: (): Card[] => {
    const stored = localStorage.getItem(STORAGE_KEY_CARDS);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize if empty
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(INITIAL_CARDS));
    return INITIAL_CARDS;
  },

  addCard: (name: string): Card => {
    const newCard: Card = {
      id: Date.now().toString(),
      name,
      cardNumber: generateRandomCardNumber(),
      expiryDate: generateExpiryDate(),
      cvv: generateRandomCVV(),
      isFrozen: false,
    };
    
    const currentCards = cardService.getCards();
    const updatedCards = [...currentCards, newCard];
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(updatedCards));
    return newCard;
  },
  
  getTransactions: (): Transaction[] => {
    // In a real app, this would fetch based on Card ID
    return MOCK_TRANSACTIONS;
  }
};
