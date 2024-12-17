'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { useExpense } from '../context/store';
import { startOfMonth,endOfMonth, subMonths, format } from 'date-fns';

const SuggestionsPage = () => {
    const expenseStore = useExpense();
    const { categories, items, incomeItems } = expenseStore;
    const [monthToCalculate] = useState(startOfMonth(new Date()));
    const [warnings, setWarnings] = useState<string[]>([]);

    const currentDate = new Date();
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    const previousMonthStart = startOfMonth(subMonths(currentDate, 1));

    const suggestions = useMemo(() => categories.map(category => {
        const currentSpending = items
            .filter(item => item.category.id === category.id && new Date(item.date) >= currentMonthStart && new Date(item.date) <= currentMonthEnd)
            .reduce((sum, item) => sum + Math.abs(item.amount), 0);

        const previousSpending = items
            .filter(item => item.category.id === category.id && new Date(item.date) >= previousMonthStart && new Date(item.date) < currentMonthStart)
            .reduce((sum, item) => sum + Math.abs(item.amount), 0);

        let suggestion = '';

        if (previousSpending === 0 && currentSpending > 0) {
            suggestion += `You've started spending in ${category.name}. Keep an eye on your budget.`;
        } else if (currentSpending > previousSpending * 1.2) { 
            suggestion += `Warning: Spending in ${category.name} has increased by more than 20%. Consider reviewing this category.`;
        }

        if (currentSpending >= category.limit * 0.7 && currentSpending <= category.limit * 0.8) {
            suggestion += ` Consider reducing expenses in ${category.name} to stay within your budget.`;
        }

        return suggestion.trim() || null;
    }).filter(Boolean), [categories, items, currentMonthStart, previousMonthStart]);

    useEffect(() => {
        const expenseTotals: { [key: string]: number } = {};
        items.forEach(expense => {
            const category = categories.find(cat => cat.name === expense.category.name);
            if (category) {
                expenseTotals[category.name] = (expenseTotals[category.name] || 0) + Math.abs(expense.amount);
            }
        });

        const newWarnings = categories.reduce((acc, category) => {
            if (expenseTotals[category.name] > category.limit * 0.8) {
                acc.push(`Warning: ${category.name} exceeded 80% of its limit for ${format(monthToCalculate, 'MMMM yyyy')}`);
            }
            return acc;
        }, [] as string[]);

        setWarnings(newWarnings);
    }, [categories, items, monthToCalculate]);

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            {warnings.length > 0 && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 rounded-md">
                    {warnings.map((warning, index) => (
                        <p key={index} className="text-red-700 dark:text-red-200">{warning}</p>
                    ))}
                </div>
            )}
            {suggestions.length > 0 ? (
                <ul className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900 rounded-md text-yellow-700 dark:text-yellow-200">{suggestion}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 dark:text-gray-300 italic">No suggestions at the moment. Keep tracking your expenses!</p>
            )}
        </div>
    );
};

export default SuggestionsPage;