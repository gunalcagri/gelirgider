// src/app/reports/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useExpense } from '../context/store';
import { Category, ExpenseItem, IncomeCategory } from '../types';
import Chart from 'chart.js/auto'; // Import Chart from Chart.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import {startOfMonth,format} from 'date-fns';
import exp from 'constants';

interface ExpenseByYearTotals {
    [key: string]: {
        [category: string]: number;
    };
}
interface IncomeByYearTotals {
    [key: string]: {
        [category: string]: number;
    };
}
const Reports = () => {
    const expenseStore = useExpense();
    const categories: Category[] = expenseStore.categories;
    const incomeCategories: IncomeCategory[] = expenseStore.incomeCategories;
    let expenses = expenseStore.items;
    let incomes = expenseStore.incomeItems;
    let [monthToCalculate, setMonthToCalculate] = useState(startOfMonth(new Date()))


    useEffect(() => {
        
        let expenseData: { labels: string[]; data: number[] } = {
            labels: [],
            data: []
        }
        let expenseDataByMonth: { labels: string[]; data: number[] } = {
            labels: [],
            data: []
        }
        let expenseDataByYear: { labels: string[]; data: { [label: string]: number; }[] } = {
            labels: [],
            data: []
        }
        let expensebyMonthDataForStacked:  { label: string; data: number[]; backgroundColor: string; }[]  = [];
        let incomebyMonthDataForStacked:  { label: string; data: number[]; backgroundColor: string; }[]  = [];
        let incomeDataByYear: { labels: string[]; data: { [label: string]: number; }[] } = {
            labels: [],
            data: []
        }
        let incomeData: { labels: string[]; data: number[] } = {
            labels: [],
            data: []
        }
        let incomeDataByMonth: { labels: string[]; data: number[] } = {
            labels: [],
            data: []
        }   
        const expenseTotals: { [key: string]: number } = {};
        const incomeTotals: { [key: string]: number } = {};
        const expensebyMonthTotals: { [key: string]: number } = {};
        const incomebyMonthTotals: { [key: string]: number } = {};
        
        const expensebyYearTotals: ExpenseByYearTotals = {};
        const incomebyYearTotals: IncomeByYearTotals = {};
      
        // Calculate totals for expenses and check for limits
        expenses.forEach(expense => {
            const category = categories.find(cat => cat.name === expense.category.name);
            if (category) {
                expenseTotals[category.name] = (expenseTotals[category.name] || 0) + Math.abs(expense.amount);
            }
            let expenseDate = new Date(expense.date);
            let expenseMonth = expenseDate.getMonth() + 1;
            let expenseYear = expenseDate.getFullYear();
            if(expenseMonth === monthToCalculate.getMonth() + 1 && expenseYear === monthToCalculate.getFullYear()){
                if(category)
                expensebyMonthTotals[category.name] = (expensebyMonthTotals[category.name] || 0) + Math.abs(expense.amount);
            }
            if(expenseYear === monthToCalculate.getFullYear()){
                if(category){
                  
                    if(expensebyYearTotals[expenseMonth] === undefined){
                        expensebyYearTotals[expenseMonth] = {};
                    }
                    if(expensebyYearTotals[expenseMonth][category.name] === undefined){
                        expensebyYearTotals[expenseMonth][category.name] = 0;
                    }
                    expensebyYearTotals[expenseMonth][category.name] = expensebyYearTotals[expenseMonth][category.name] + Math.abs(expense.amount);

                  
                   
                }
            }
            expensebyMonthDataForStacked = [];
            Object.keys(expensebyYearTotals ).map(expenseMonth => {

                const categories = expensebyYearTotals[expenseMonth] ? Object.keys(expensebyYearTotals[expenseMonth]) : [];
                categories.concat(Object.keys(expensebyYearTotals[Object.keys(expensebyYearTotals)[0]])).filter((v, i, a) => a.indexOf(v) === i).map(category => {
                    const existingCategory = expensebyMonthDataForStacked.find(data => data.label === category);
                    
                    if(existingCategory){
                        existingCategory.data.push(expensebyYearTotals[expenseMonth][category] || 0);
                    } else {
                        expensebyMonthDataForStacked.push( {
                            label: category,
                            data: Object.keys(expensebyYearTotals).map(month => expensebyYearTotals[month][category] || 0),
                            backgroundColor: '#' + ((Math.random() * 0xffffff) << 0).toString(16)
                        })
                    }
                })
                
            })
            expenseDataByYear = {
                labels: Object.keys(expensebyYearTotals),
                data: [],
            };

        });

        

        


        // Calculate totals for incomes
        incomes.forEach(income => {
            const category = incomeCategories.find(cat => cat.name === income.category.name);
            if (category) {
                incomeTotals[category.name] = (incomeTotals[category.name] || 0) + income.amount;
            }
            let incomeDate = new Date(income.date);
            let incomeMonth = incomeDate.getMonth() + 1;
            let incomeYear = incomeDate.getFullYear();
            if(incomeMonth === monthToCalculate.getMonth() + 1 && incomeYear === monthToCalculate.getFullYear()){
                if(category)
                incomebyMonthTotals[category.name] = (incomebyMonthTotals[category.name] || 0) + income.amount;
            }

            if(incomeYear === monthToCalculate.getFullYear()){
                if(category){
                    if(incomebyYearTotals[incomeMonth] === undefined){
                        incomebyYearTotals[incomeMonth] = {};
                    }
                    if(incomebyYearTotals[incomeMonth][category.name] === undefined){
                        incomebyYearTotals[incomeMonth][category.name] = 0;
                    }
                    incomebyYearTotals[incomeMonth][category.name] = incomebyYearTotals[incomeMonth][category.name]  + income.amount;

                }
            } 
            incomebyMonthDataForStacked = [];
            Object.keys(incomebyYearTotals ).map(incomeMonth => {

                const categories = incomebyYearTotals[incomeMonth] ? Object.keys(incomebyYearTotals[incomeMonth]) : [];
                categories.concat(Object.keys(incomebyYearTotals[Object.keys(incomebyYearTotals)[0]])).filter((v, i, a) => a.indexOf(v) === i).map(category => {
                    const existingCategory = incomebyMonthDataForStacked.find(data => data.label === category);
                    
                    if(existingCategory){
                        existingCategory.data.push(incomebyYearTotals[incomeMonth][category] || 0);
                    } else {
                        incomebyMonthDataForStacked.push( {
                            label: category,
                            data: Object.keys(incomebyYearTotals).map(month => incomebyYearTotals[month][category] || 0),
                            backgroundColor: '#' + ((Math.random() * 0xffffff) << 0).toString(16)
                        })
                    }
                })
                
            })
            incomeDataByYear = {
                labels: Object.keys(incomebyYearTotals),
                data: [],               
            };  
        });

        // Prepare data for charts
        if (expenses.length !== 0) {
            expenseData = {
                labels: Object.keys(expenseTotals),
                data: Object.values(expenseTotals),
            };
            expenseDataByMonth = {
                labels: Object.keys(expensebyMonthTotals),
                data: Object.values(expensebyMonthTotals),
            };
           
        }
        if (incomes.length !== 0) {
           
            incomeData = {
                labels: Object.keys(incomeTotals),
                data: Object.values(incomeTotals),
            };
            incomeDataByMonth = {
                labels: Object.keys(incomebyMonthTotals),
                data: Object.values(incomebyMonthTotals),
            };
            incomeDataByYear = {
                labels: Object.keys(incomebyYearTotals),
                data: Object.values(incomebyYearTotals),
            };
        }
        
    
        const expensesChartElement = document.getElementById('expenses-chart') as HTMLCanvasElement | null;
        const incomesChartElement = document.getElementById('incomes-chart') as HTMLCanvasElement | null;
        const incomesChartbyMonthElement = document.getElementById('incomes-chart-by-month') as HTMLCanvasElement | null;
        const incomesChartbyYearElement = document.getElementById('incomes-chart-by-year') as HTMLCanvasElement | null;
        const expensesChartbyYearElement = document.getElementById('expenses-chart-by-year') as HTMLCanvasElement | null;
        const expensesChartbyMonthElement = document.getElementById('expenses-chart-by-month') as HTMLCanvasElement | null; // Add this line to get the expenses chart by month Context
        const expensesChartContext = expensesChartElement?.getContext('2d');
        const incomesChartContext = incomesChartElement?.getContext('2d');
        const expensesChartbyMonthContext = expensesChartbyMonthElement?.getContext('2d');
        const expensesChartbyYearContext = expensesChartbyYearElement?.getContext('2d');
        const incomesChartbyMonthContext = incomesChartbyMonthElement?.getContext('2d');
        const incomesChartbyYearContext = incomesChartbyYearElement?.getContext('2d');
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
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#9966FF', '#FF4B4B','#FFC0C0','#FFC0CB', '#FFD700'],
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
                        backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF', '#FF4B4B','#FFC0C0','#FFC0CB', '#FFD700'],
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

        if(expensesChartbyMonthContext) {
            const existingExpensesChart = Chart.getChart('expenses-chart-by-month');
            if (existingExpensesChart) {
                existingExpensesChart.destroy();
            }
            new Chart(expensesChartbyMonthContext, {
                type: 'pie',
                data: {
                    labels: expenseDataByMonth.labels,
                    datasets: [{
                        label: 'Expense',
                        data: expenseDataByMonth.data,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#9966FF', '#FF4B4B','#FFC0C0','#FFC0CB', '#FFD700'],
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

        if(incomesChartbyMonthContext) {
            const existingIncomesChart = Chart.getChart('incomes-chart-by-month');
            if (existingIncomesChart) {
                existingIncomesChart.destroy();
            }
            new Chart(incomesChartbyMonthContext, {
                type: 'pie',
                data: {
                    labels: incomeDataByMonth.labels,
                    datasets: [{
                        label: 'Income',
                        data: incomeDataByMonth.data,
                        backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF', '#FF4B4B','#FFC0C0','#FFC0CB', '#FFD700'],
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

        if(expensesChartbyYearContext) {
            const existingExpensesChart = Chart.getChart('expenses-chart-by-year');
            if (existingExpensesChart) {
                existingExpensesChart.destroy();
            }
            new Chart(expensesChartbyYearContext, {
                type: 'bar',
                data: {
                    labels: expenseDataByYear.labels,
                    datasets: expensebyMonthDataForStacked,
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: true
                        }
                      },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                },
            });
        }

        if(incomesChartbyYearContext) {
            const existingIncomesChart = Chart.getChart('incomes-chart-by-year');
            if (existingIncomesChart) {
                existingIncomesChart.destroy();
            }
            new Chart(incomesChartbyYearContext, {
                type: 'bar',
                data: {
                    labels: incomeDataByYear.labels,
                    datasets: incomebyMonthDataForStacked,
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: true
                        }
                      },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                    },
                },
            });
        }


        


    }, [expenseStore, monthToCalculate]);


    const downloadPDF = async () => {
        const pdf = new jsPDF('p','mm',[700, 2000]);
        const element = document.getElementById('report-content'); // Ensure to wrap your report content in a div with this ID

        if (element) {
            const canvas = await html2canvas(element,{
                scale: 3
            });
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, 600, 900);
            pdf.save('report.pdf');
        }
    };

    return (
        <>
        <Button onClick={downloadPDF}>Download Report</Button>
        <div id="report-content">
        <div  className="mt-4 mb-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-2">
            
            <div>
                <h2 className='dark:text-white'>Expenses by Category</h2>
                <canvas id="expenses-chart" width="400" height="200"></canvas>
            </div>
            <div>
                <h2 className='dark:text-white'>Incomes by Category</h2>
                <canvas id="incomes-chart" width="400" height="200"></canvas>
            </div>
            
        </div>

        <div className="flex items-center mt-4 text-gray-900 dark:text-white">
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => {
                setMonthToCalculate(new Date(monthToCalculate.setMonth(monthToCalculate.getMonth() - 1)))
              }}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="size-5" aria-hidden="true" />
            </button>
            <div className="flex-auto text-sm font-semibold ml-12 mr-12 min-w-40 text-center">{format(monthToCalculate, 'MMMM yyyy')}</div>
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              onClick={() => {
                setMonthToCalculate(new Date(monthToCalculate.setMonth(monthToCalculate.getMonth() + 1)))
              }}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div  className="mt-4 mb-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-2">
            <div>
            <h2 className='dark:text-white'>Expenses by Category {format(monthToCalculate, 'MMMM yyyy')}</h2>
            <canvas id="expenses-chart-by-month" width="400" height="200"></canvas>
            </div>
            <div>
            <h2 className='dark:text-white'>Incomes by Category {format(monthToCalculate, 'MMMM yyyy')}</h2>
            <canvas id="incomes-chart-by-month" width="400" height="200"></canvas>
            </div>
            <div>
                <h2 className='dark:text-white'>Expenses by Category {format(monthToCalculate, 'yyyy')}</h2>
                <canvas id="expenses-chart-by-year" width="400" height="200"></canvas>
            </div>
            <div>
                <h2 className='dark:text-white'>Incomes by Category {format(monthToCalculate, 'yyyy')}</h2>
                <canvas id="incomes-chart-by-year" width="400" height="200"></canvas>
            </div>
            
                
            </div>
            </div>
        </>
    );
};

export default Reports;