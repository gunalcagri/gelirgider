// src/app/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useExpense } from '../context/store';
import { Category, ExpenseItem, IncomeCategory } from '../types';
import Chart from 'chart.js/auto'; // Import Chart from Chart.js

const Reports = () => {
    const expenseStore = useExpense();
    const categories: Category[] = expenseStore.categories;
    const incomeCategories: IncomeCategory[] = expenseStore.incomeCategories;
    const expenses = expenseStore.items;
    const incomes = expenseStore.incomeItems;


    useEffect(() => {
        
        let expenseData: { labels: string[]; data: number[] } = {
            labels: [],
            data: []
        }
        let incomeData: { labels: string[]; data: number[] } = {
            labels: [],
            data: []
        }
        const expenseTotals: { [key: string]: number } = {};
        const incomeTotals: { [key: string]: number } = {};
      
        // Calculate totals for expenses and check for limits
        expenses.forEach(expense => {
            const category = categories.find(cat => cat.name === expense.category.name);
            if (category) {
                expenseTotals[category.name] = (expenseTotals[category.name] || 0) + Math.abs(expense.amount);
            }
        });

        


        // Calculate totals for incomes
        incomes.forEach(income => {
            const category = incomeCategories.find(cat => cat.name === income.category.name);
            if (category) {
                incomeTotals[category.name] = (incomeTotals[category.name] || 0) + income.amount;
            }
        });

        // Prepare data for charts
        if (expenses.length !== 0) {
            expenseData = {
                labels: Object.keys(expenseTotals),
                data: Object.values(expenseTotals),
            };
        }
        if (incomes.length !== 0) {
           
            incomeData = {
                labels: Object.keys(incomeTotals),
                data: Object.values(incomeTotals),
            };
        }
    
        const expensesChartElement = document.getElementById('expenses-chart') as HTMLCanvasElement | null;
        const incomesChartElement = document.getElementById('incomes-chart') as HTMLCanvasElement | null;

        const expensesChartContext = expensesChartElement?.getContext('2d');
        const incomesChartContext = incomesChartElement?.getContext('2d');

        // Destroy existing charts if they exist
        if (expensesChartContext) {
            const existingExpensesChart = Chart.getChart('expenses-chart');
            if (existingExpensesChart) {
                existingExpensesChart.destroy();
            }
            new Chart(expensesChartContext, {
                type: 'pie',
                data: {
                    labels: expenseData.labels,
                    datasets: [{
                        label: 'Expense',
                        data: expenseData.data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                },
            });
        }

        // Destroy existing charts if they exist
        if (incomesChartContext) {
            const existingIncomesChart = Chart.getChart('incomes-chart');
            if (existingIncomesChart) {
                existingIncomesChart.destroy();
            }
            new Chart(incomesChartContext, {
                type: 'pie',
                data: {
                    labels: incomeData.labels,
                    datasets: [{
                        label: 'Income',
                        data: incomeData.data,
                        backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF'],
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                },
            });
        }
    }, [expenseStore]);


    return (
        <div className="mt-4 mb-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            <div>
                <h2>Expenses by Category</h2>
                <canvas id="expenses-chart" width="400" height="200"></canvas>
            </div>
            <div>
                <h2>Incomes by Category</h2>
                <canvas id="incomes-chart" width="400" height="200"></canvas>
            </div>
        </div>
    );
};

export default Reports;