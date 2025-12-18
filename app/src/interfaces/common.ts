export interface Card {
  id: string;
  name: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  isFrozen: boolean;
}

export interface Transaction {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
  category: 'shopping' | 'travel' | 'entertainment' | 'finance';
  iconBg: string;
}

export interface ActionItem {
  id: string;
  label: string;
  icon: any; // Lucide icon component
  action?: () => void;
}
