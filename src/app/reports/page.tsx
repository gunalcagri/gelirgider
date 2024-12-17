'use client';

import { useEffect, useState } from 'react';
import { useExpense } from '../context/store';
import { Category, IncomeCategory, ExpenseItem, IncomeItem } from '../types';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { startOfMonth, format } from 'date-fns';
import { StatsGrid } from './stats';

const Reports: React.FC = () => {
    const { categories, incomeCategories, items: expenses, incomeItems: incomes } = useExpense();
    const [monthToCalculate, setMonthToCalculate] = useState<Date>(startOfMonth(new Date()));

    useEffect(() => {
        const calculateTotals = (items: (ExpenseItem | IncomeItem)[], categories: (Category | IncomeCategory)[], date: Date) => {
            const totals: Record<string, number> = {};
            const monthTotals: Record<string, number> = {};
            const yearTotals: Record<number, Record<string, number>> = {};

            items.forEach(item => {
                const category = categories.find(cat => cat.name === item.category.name);
                if (!category) return;

                const amount = Math.abs(item.amount);
                const itemDate = new Date(item.date);
                const itemMonth = itemDate.getMonth() + 1;
                const itemYear = itemDate.getFullYear();

                totals[category.name] = (totals[category.name] || 0) + amount;

                if (itemMonth === date.getMonth() + 1 && itemYear === date.getFullYear()) {
                    monthTotals[category.name] = (monthTotals[category.name] || 0) + amount;
                }

                if (itemYear === date.getFullYear()) {
                    if (!yearTotals[itemMonth]) yearTotals[itemMonth] = {};
                    yearTotals[itemMonth][category.name] = (yearTotals[itemMonth][category.name] || 0) + amount;
                }
            });

            return { totals, monthTotals, yearTotals };
        };

        const { totals: expenseTotals, monthTotals: expenseMonthTotals, yearTotals: expenseYearTotals } = calculateTotals(expenses, categories, monthToCalculate);
        const { totals: incomeTotals, monthTotals: incomeMonthTotals, yearTotals: incomeYearTotals } = calculateTotals(incomes, incomeCategories, monthToCalculate);

        const createChartData = (data: Record<string, number>, type: string) => ({
            labels: Object.keys(data),
            datasets: [{
                label: type,
                data: Object.values(data),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#9966FF', '#FF4B4B', '#FFC0C0', '#FFC0CB', '#FFD700'],
            }],
        });

        const createStackedChartData = (yearTotals: Record<number, Record<string, number>>) => {
            const allCategories = [...new Set(Object.values(yearTotals).flatMap(Object.keys))];
            return allCategories.map(category => ({
                label: category,
                data: Object.keys(yearTotals).map(month => yearTotals[Number(month)][category] || 0),
                backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            }));
        };

        const createChart = (elementId: string, type: 'pie' | 'bar', data: any, options: any = {}) => {
            const ctx = (document.getElementById(elementId) as HTMLCanvasElement)?.getContext('2d');
            if (!ctx) return;

            Chart.getChart(elementId)?.destroy();
            new Chart(ctx, { type, data, options: { responsive: true, ...options } });
        };

        createChart('expenses-chart', 'pie', createChartData(expenseTotals, 'Expense'));
        createChart('incomes-chart', 'pie', createChartData(incomeTotals, 'Income'));
        createChart('expenses-chart-by-month', 'pie', createChartData(expenseMonthTotals, 'Expense'));
        createChart('incomes-chart-by-month', 'pie', createChartData(incomeMonthTotals, 'Income'));
        createChart('expenses-chart-by-year', 'bar', {
            labels: Object.keys(expenseYearTotals),
            datasets: createStackedChartData(expenseYearTotals),
        }, { scales: { x: { stacked: true }, y: { stacked: true } } });
        createChart('incomes-chart-by-year', 'bar', {
            labels: Object.keys(incomeYearTotals),
            datasets: createStackedChartData(incomeYearTotals),
        }, { scales: { x: { stacked: true }, y: { stacked: true } } });

    }, [expenses, incomes, categories, incomeCategories, monthToCalculate]);

    const downloadPDF = async () => {
        const elements = ['report-header', 'charts-part-1', 'charts-part-2', 'charts-part-3'];
        const canvases = [];
        const isDarkMode = localStorage.getItem('theme') === 'dark';

        for (const id of elements) {
            const element = document.getElementById(id);
            if (!element) return;
            const canvas = await html2canvas(element, { 
                scale: 2, // Higher scale for better quality on mobile
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
            });
            canvases.push(canvas);
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 5; // Smaller margin for mobile
        const contentWidth = pageWidth - 2 * margin;
        let yPosition = margin;

        if (isDarkMode) {
            pdf.setFillColor(31, 41, 55);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        }

        for (const canvas of canvases) {
            const aspectRatio = canvas.width / canvas.height;
            let imgWidth = contentWidth;
            let imgHeight = imgWidth / aspectRatio;

            if (imgHeight > pageHeight - 2 * margin) {
                imgHeight = pageHeight - 2 * margin;
                imgWidth = imgHeight * aspectRatio;
            }

            if (yPosition + imgHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
                if (isDarkMode) {
                    pdf.setFillColor(31, 41, 55);
                    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                }
            }

            const xPosition = (pageWidth - imgWidth) / 2;
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + margin;
        }

        const fileName = `report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
        } else {
            pdf.save(fileName);
        }
    };

    return (
        <>
  <Button onClick={downloadPDF}>Download Report</Button>
  <div id="report-content" className="p-4">
    <div id="report-header">
      <StatsGrid monthToCalculate={monthToCalculate} expenseStore={useExpense()} />
      <div className="flex items-center mt-4 text-gray-900 dark:text-white">
        <button
          type="button"
          className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          onClick={() => setMonthToCalculate(new Date(monthToCalculate.setMonth(monthToCalculate.getMonth() - 1)))}
        >
          <ChevronLeftIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold text-center">{format(monthToCalculate, 'MMMM yyyy')}</div>
        <button
          type="button"
          className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-500"
          onClick={() => setMonthToCalculate(new Date(monthToCalculate.setMonth(monthToCalculate.getMonth() + 1)))}
        >
          <ChevronRightIcon className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div id="charts-part-1" className="mt-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold dark:text-white">Expenses by Category {format(monthToCalculate, 'MMMM yyyy')}</h2>
        <canvas id="expenses-chart-by-month"></canvas>
      </div>
      <div>
        <h2 className="text-lg font-semibold dark:text-white">Incomes by Category {format(monthToCalculate, 'MMMM yyyy')}</h2>
        <canvas id="incomes-chart-by-month"></canvas>
      </div>
    </div>

    <div id="charts-part-2" className="mt-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold dark:text-white">Expenses by Category {format(monthToCalculate, 'yyyy')}</h2>
        <canvas id="expenses-chart-by-year"></canvas>
      </div>
      <div>
        <h2 className="text-lg font-semibold dark:text-white">Incomes by Category {format(monthToCalculate, 'yyyy')}</h2>
        <canvas id="incomes-chart-by-year"></canvas>
      </div>
    </div>

    <div id="charts-part-3" className="mt-4">
      <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">All Incomes and Expenses</h1>
      <div className="mt-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold dark:text-white">Expenses by Category</h2>
          <canvas id="expenses-chart"></canvas>
        </div>
        <div>
          <h2 className="text-lg font-semibold dark:text-white">Incomes by Category</h2>
          <canvas id="incomes-chart"></canvas>
        </div>
      </div>
    </div>
  </div>

        </>
    );
};

export default Reports;