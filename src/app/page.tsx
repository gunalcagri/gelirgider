'use client'
import { Badge } from '@/components/badge'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import Expenses from './expenses/page'
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { format, startOfMonth } from 'date-fns'
import { useExpense } from './context/store'
import Incomes from './incomes/page'
export function Stat({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
        <span className="text-zinc-500">from last month</span>
      </div>
    </div>
  )
}

export function StatExpense({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'pink' : 'lime'}>{change}</Badge>{' '}
        <span className="text-zinc-500">from last month</span>
      </div>
    </div>
  )
}

export default  function Home() {
  let [monthToCalculate, setMonthToCalculate] = useState(startOfMonth(new Date()))
  let expenseStore = useExpense()
  let categories = expenseStore.categories || []
  let expenses = expenseStore.items || []
  let [warnings, setWarnings] = useState<string[]>([])


   

    useEffect(() => {
    let expenseTotals: { [key: string]: number } = {};
    // Calculate totals for expenses and check for limits
    setWarnings([]);
    expenses.forEach(expense => {
      const category = categories.find(cat => cat.name === expense.category.name);
      if (category) {
          expenseTotals[category.name] = (expenseTotals[category.name] || 0) + Math.abs(expense.amount);
      }
      });

      // Check for limits
      categories.forEach(category => {
          if (expenseTotals[category.name] > category.limit) {
              setWarnings(prevWarnings => [...prevWarnings, `Warning: ${category.name} limit exceeded for ${format(monthToCalculate, 'MMMM yyyy')}`]);
          }
      });

    },[expenseStore])


  return (
    <>
      <Heading>Hello, </Heading>
      <div className="mt-8 flex items-end justify-between">
      {warnings.length > 0 && (
                <div style={{ color: 'red' }}>
                    {warnings.map((warning, index) => (
                        <p key={index}>{warning}</p>
                    ))}
                </div>
            )}
        <div className="flex items-center text-gray-900">
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
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
      </div>
      <div className="mt-4 mb-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total revenue" value={(expenseStore.calculateIncomebyMonth(monthToCalculate)+expenseStore.calculateExpensebyMonth(monthToCalculate)).toString()} change={expenseStore.calculateRevenueDifference(monthToCalculate)} />
        <Stat title="Income" value={expenseStore.calculateIncomebyMonth(monthToCalculate).toString()} change={expenseStore.calculateIncomeDifference(monthToCalculate)} />
        <Stat title="Expense" value={expenseStore.calculateExpensebyMonth(monthToCalculate).toString()} change={expenseStore.calculateExpenseDifference(monthToCalculate)} />
      </div>
      
      <Expenses></Expenses>
      <Incomes></Incomes>
    </>
  )
}
