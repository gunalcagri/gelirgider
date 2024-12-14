'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of your expense item
interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

// Define the state shape
interface ExpenseContextType {
  items: ExpenseItem[];
  total: number;
  addItem: (item: ExpenseItem) => void;
  removeItem: (id: string) => void;
  updateItem: (item: ExpenseItem) => void;
}

// Create the context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider component
export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<ExpenseItem[]>(() => {
        const savedItems = localStorage.getItem('expenseItems');
        return savedItems ? JSON.parse(savedItems) : [];
      });
      const [total, setTotal] = useState<number>(() => {
        const savedItems = localStorage.getItem('expenseItems');
        const initialItems = savedItems ? JSON.parse(savedItems) : [];
        return initialItems.reduce((sum: number, item: ExpenseItem) => sum + item.amount, 0);
      });
      

  // Update localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('expenseItems', JSON.stringify(items));
    setTotal(items.reduce((sum, item) => sum + item.amount, 0)); // Update total whenever items change
  }, [items]);

  const addItem = (item: ExpenseItem) => {
    setItems((prevItems) => [...prevItems, item]);
    setTotal((prevTotal) => prevTotal + item.amount);
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.id === id);
      if (itemToRemove) {
        setTotal((prevTotal) => prevTotal - itemToRemove.amount);
      }
      return prevItems.filter(item => item.id !== id);
    });
  };

  const updateItem = (item: ExpenseItem) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map(prevItem =>
        prevItem.id === item.id ? item : prevItem
      );
      setTotal(updatedItems.reduce((sum, currentItem) => sum + currentItem.amount, 0));
      return updatedItems;
    });
  };

  return (
    <ExpenseContext.Provider value={{ items, total, addItem, removeItem, updateItem }}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook for using the expense context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within a ExpenseProvider');
  }
  return context;
};