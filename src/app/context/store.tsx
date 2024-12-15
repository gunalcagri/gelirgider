'use client'

import { set } from 'date-fns';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of a category
interface Category {
    id: string;
    name: string;
    limit: number;
}
// Define the shape of a  income category
interface IncomeCategory {
    id: string;
    name: string;
}
// Define the shape of an expense item
interface ExpenseItem {
    id: string;
    name: string;
    amount: number;
    category: Category;
    date: string;
}

// Define the shape of an income item
interface IncomeItem {
    id: string;
    name: string;
    amount: number;
    category: IncomeCategory;
    date: string;
}

// Define the state shape
interface ExpenseContextType {
    items: ExpenseItem[];
    incomeItems: IncomeItem[];
    categories: Category[];
    incomeCategories: IncomeCategory[];
    total: number;
    addItem: (item: ExpenseItem) => void;
    removeItem: (expenseToDelete: ExpenseItem) => void;
    updateItem: (item: ExpenseItem) => void;
    addCategory: (category: Category) => void;
    updateCategory: (category: Category) => void;
    removeCategory: (categoryToDelete: Category) => void;
    calculateIncomebyMonth: (day: Date) => number;
    calculateExpensebyMonth: (day: Date) => number;
    calculateIncomeDifference: (day: Date) => string;
    calculateExpenseDifference: (day: Date) => string;
    calculateRevenueDifference: (day: Date) => string;
    addIncomeCategory: (category: IncomeCategory) => void;
    removeIncomeCategory: (categoryToDelete: IncomeCategory) => void;
    editIncomeCategory: (category: IncomeCategory) => void;
    addIncomeItem: (item: IncomeItem) => void;
    removeIncomeItem: (incomeToDelete: IncomeItem) => void;
    updateIncomeItem: (item: IncomeItem) => void;
}

// Create the context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider component
export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [items, setItems] = useState<ExpenseItem[]>([])
    const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([])
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const storedItems = localStorage.getItem('expenseItems');
        const storedIncomeItems = localStorage.getItem('incomeItems');
        const storedCategories = localStorage.getItem('categories');
        const storedIncomeCategories = localStorage.getItem('incomeCategories');

        if (storedItems) {
            setItems(JSON.parse(storedItems));
        }
        if (storedIncomeItems) {
            setIncomeItems(JSON.parse(storedIncomeItems));
        }
        if (storedCategories) {
            setCategories(JSON.parse(storedCategories));
        }
        if (storedIncomeCategories) {
            setIncomeCategories(JSON.parse(storedIncomeCategories));
        }
    }, []); // Empty dependency array means this runs once on mount

    const calculateExpensebyMonth = (day: Date) => {
        const date = new Date(day);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const filteredItems = items.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year;
        });

        const totalAmount = filteredItems.reduce((sum, item) => sum + item.amount, 0);
        return totalAmount;
    };

    const calculateIncomebyMonth = (day: Date) => {
        const date = new Date(day);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const filteredItems = incomeItems.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year && item.amount > 0;
        });

        const totalAmount = filteredItems.reduce((sum, item) => sum + item.amount, 0);
        return totalAmount;
    }

    const calculateIncomeDifference = (day: Date) => {
        const date = new Date(day);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const filteredItems = incomeItems.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year && item.amount > 0;
        });

        const filteredItemsLastMonth = incomeItems.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month - 1 && itemDate.getFullYear() === year && item.amount > 0;
        })

        const totalAmount = filteredItems.reduce((sum, item) => sum + item.amount, 0);
        const totalAmountLastMonth = filteredItemsLastMonth.reduce((sum, item) => sum + item.amount, 0);
        
        if(totalAmount-totalAmountLastMonth>0){
            return '+'+(totalAmount-totalAmountLastMonth).toString();
        }
        return (totalAmount-totalAmountLastMonth).toString();
    }

    const calculateExpenseDifference = (day: Date) => {
        const date = new Date(day);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const filteredItems = items.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year && item.amount < 0;
        });

        const filteredItemsLastMonth = items.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month - 1 && itemDate.getFullYear() === year && item.amount < 0;
        })

        const totalAmount = filteredItems.reduce((sum, item) => sum + item.amount, 0);
        const totalAmountLastMonth = filteredItemsLastMonth.reduce((sum, item) => sum + item.amount, 0);
        
        if(totalAmount-totalAmountLastMonth>0){
            return '+'+(totalAmount-totalAmountLastMonth).toString();
        }
        return (totalAmount-totalAmountLastMonth).toString();
    }

    const calculateRevenueDifference = (day: Date) => {
        const date = new Date(day);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const filteredItems = items.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year ;
        });
        const filteredIncomeItems = incomeItems.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year ;
        })

        const filteredItemsLastMonth = items.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month - 1 && itemDate.getFullYear() === year ;
        })    

        const filteredIncomeItemsLastMonth = incomeItems.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === month - 1 && itemDate.getFullYear() === year ;
        })

        const totalAmount = filteredItems.reduce((sum, item) => sum + item.amount, 0) + filteredIncomeItems.reduce((sum, item) => sum + item.amount, 0);
        const totalAmountLastMonth = filteredItemsLastMonth.reduce((sum, item) => sum + item.amount, 0) + filteredIncomeItemsLastMonth.reduce((sum, item) => sum + item.amount, 0);
        
        if(totalAmount-totalAmountLastMonth>0){
            return '+'+(totalAmount-totalAmountLastMonth).toString();
        }
        return (totalAmount-totalAmountLastMonth).toString();
    }

    const addItem = (item: ExpenseItem) => {
        setItems((prevItems) => [...prevItems, item]);
        localStorage.setItem('expenseItems', JSON.stringify([...items, item]));
        setTotal((prevTotal) => prevTotal + item.amount);
    };
    const addIncomeItem = (item: IncomeItem) => {
        setIncomeItems((prevIncomeItems) => [...prevIncomeItems, item]);
        localStorage.setItem('incomeItems', JSON.stringify([...incomeItems, item]));
    };

    const removeItem = (expenseToDelete:ExpenseItem) => {
        setItems((prevItems) => {
            const itemToRemove = prevItems.find(item => item.id === expenseToDelete.id);
            if (itemToRemove) {
                setTotal((prevTotal) => prevTotal - itemToRemove.amount);
            }
            localStorage.setItem('expenseItems', JSON.stringify(prevItems.filter(item => item.id !== expenseToDelete.id)));
            return prevItems.filter(item => item.id !== expenseToDelete.id);
        });
    };

    const removeIncomeItem = (incomeToDelete:IncomeItem) => {
        setIncomeItems((prevItems) => prevItems.filter(item => item.id !== incomeToDelete.id));
        localStorage.setItem('incomeItems', JSON.stringify(incomeItems.filter(item => item.id !== incomeToDelete.id)));
    };

    const updateItem = (item: ExpenseItem) => {
        setItems((prevItems) => {
            const updatedItems = prevItems.map(prevItem =>
                prevItem.id === item.id ? item : prevItem
            );
            setTotal(updatedItems.reduce((sum, currentItem) => sum + currentItem.amount, 0));
            localStorage.setItem('expenseItems', JSON.stringify(updatedItems));
            return updatedItems;
        });
   
    };

    const updateIncomeItem = (item: IncomeItem) => {
        setIncomeItems((prevItems) => {
            const updatedItems = prevItems.map(prevItem =>
                prevItem.id === item.id ? item : prevItem
            );
            localStorage.setItem('incomeItems', JSON.stringify(updatedItems));
            return updatedItems;
        });
    }
    const addCategory = (category: Category) => {
        setCategories((prevCategories) => [...prevCategories, category]);
        localStorage.setItem('categories', JSON.stringify([...categories, category]));
    };

    const updateCategory = (category: Category) => {
        setCategories((prevCategories) => {
            const updatedCategories = prevCategories.map(prevCategory =>
                prevCategory.id === category.id ? category : prevCategory
            );
            localStorage.setItem('categories', JSON.stringify(updatedCategories));
            return updatedCategories;
        });
    };

    const removeCategory = (categoryToDelete:Category) => {
        
        setCategories((prevCategories) => prevCategories.filter(category => category.id !== categoryToDelete.id));
        localStorage.setItem('categories', JSON.stringify(categories.filter(category => category.id !== categoryToDelete.id)));
    };
    const addIncomeCategory = (category: IncomeCategory) => {
        setIncomeCategories((prevCategories) => [...prevCategories, category]);
        localStorage.setItem('incomeCategories', JSON.stringify([...incomeCategories, category]));
    };
    const removeIncomeCategory = (categoryToDelete:IncomeCategory) => {
        setIncomeCategories((prevCategories) => prevCategories.filter(category => category.id !== categoryToDelete.id));
        localStorage.setItem('incomeCategories', JSON.stringify(incomeCategories.filter(category => category.id !== categoryToDelete.id)));
    };
    const editIncomeCategory = (category: IncomeCategory) => {
        setIncomeCategories((prevCategories) => {
            const updatedCategories = prevCategories.map(prevCategory =>
                prevCategory.id === category.id ? category : prevCategory
            );
            localStorage.setItem('incomeCategories', JSON.stringify(updatedCategories));
            return updatedCategories;
        });
    };

    return (
        <ExpenseContext.Provider value={{ items, categories, incomeCategories, total, addItem, removeItem, updateItem, addCategory, updateCategory, removeCategory,calculateIncomebyMonth,calculateExpensebyMonth,calculateIncomeDifference,calculateExpenseDifference,addIncomeCategory,removeIncomeCategory,editIncomeCategory,calculateRevenueDifference,incomeItems,addIncomeItem,removeIncomeItem,updateIncomeItem }}>
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