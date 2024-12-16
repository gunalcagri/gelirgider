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
import { format, set, startOfMonth } from 'date-fns'
import { useExpense } from './context/store'
import Incomes from './incomes/page'
import { merge } from 'chart.js/helpers'
import { IncomeItem, ExpenseItem } from './types'
import { pre } from 'framer-motion/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { NewIncome } from './incomes/newIncome'
import { NewExpense } from './expenses/newExpense'


interface CombinedItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

export function Stat({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6 dark:text-white">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8 dark:text-white">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
        <span className="text-zinc-500 dark:text-zinc-400">from last month</span>
      </div>
    </div>
  )
}

export function StatExpense({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6 dark:text-white">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8 dark:text-white">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'pink' : 'lime'}>{change}</Badge>{' '}
        <span className="text-zinc-500 dark:text-zinc-400">from last month</span>
      </div>
    </div>
  )
}

export default  function Home() {
  let [monthToCalculate, setMonthToCalculate] = useState(startOfMonth(new Date()))
  let [mergedIncomesandExpenses, setMergedIncomesandExpenses]  = useState<CombinedItem[]>([])
  let expenseStore = useExpense()
  let categories = expenseStore.categories || []
  let [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  let [incomeItems, setIncomeItems] = useState<IncomeItem[]>([]);
  let [warnings, setWarnings] = useState<string[]>([])


   

    useEffect(() => {
    let expenseTotals: { [key: string]: number } = {};

      setIncomeItems(expenseStore.incomeItems)
      setExpenseItems(expenseStore.items)

    // Calculate totals for expenses and check for limits
    setWarnings([]);
    expenseStore.items.forEach(expense => {
      const category = categories.find(cat => cat.name === expense.category.name);
      if (category) {
          expenseTotals[category.name] = (expenseTotals[category.name] || 0) + Math.abs(expense.amount);
      }
      });

      // Check for limits
      categories.forEach(category => {
          if (expenseTotals[category.name] > category.limit*0.8) {
              setWarnings(prevWarnings => [...prevWarnings, `Warning: ${category.name} limit exceeded for ${format(monthToCalculate, 'MMMM yyyy')}`]);
          }
      });
      setMergedIncomesandExpenses(
        expenseStore.items.map((expense) => ({
          id: expense.id,
          name: expense.name,
          amount: expense.amount,
          category: expense.category.name,
          date: expense.date,
        }))
      )
      setMergedIncomesandExpenses((prevItems) => {
        return [...prevItems, ...expenseStore.incomeItems.map((income) => ({
          id: income.id,
          name: income.name,
          amount: income.amount,
          category: income.category.name,
          date: income.date,
        }))]
      })

      setMergedIncomesandExpenses((prevItems) => {
        return prevItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })
       

    },[expenseStore])


  return (
    <>
      <Heading>Hello, </Heading>
      <div className="mt-8 w-full inline-block items-end justify-between">
      {warnings.length > 0 && (
                <div style={{ color: 'red' }}>
                    {warnings.map((warning, index) => (
                        <p key={index}>{warning}</p>
                    ))}
                </div>
            )}
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
      </div>
      <div className="mt-4 mb-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total revenue" value={(expenseStore.calculateIncomebyMonth(monthToCalculate)+expenseStore.calculateExpensebyMonth(monthToCalculate)).toString()} change={expenseStore.calculateRevenueDifference(monthToCalculate)} />
        <Stat title="Income" value={expenseStore.calculateIncomebyMonth(monthToCalculate).toString()} change={expenseStore.calculateIncomeDifference(monthToCalculate)} />
        <Stat title="Expense" value={expenseStore.calculateExpensebyMonth(monthToCalculate).toString()} change={expenseStore.calculateExpenseDifference(monthToCalculate)} />
      </div>
      <div className="flex items-end justify-between gap-4 mt-12">
        <Heading>Incomes and Expenses</Heading>
        <NewIncome color="green">New Income</NewIncome>
        <NewExpense color="orange">New Expense</NewExpense>
      </div>
     
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {mergedIncomesandExpenses.map((income: CombinedItem) => (
            <TableRow key={income.id}  title={`Income #${income.id}`}>
              
              <TableCell className="text-zinc-500">{income.date}</TableCell>
              <TableCell>{income.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{income.category}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{income.amount} ₺</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </>
  )
}
