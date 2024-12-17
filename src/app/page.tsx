'use client'
import { Badge } from '@/components/badge'
import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { format, startOfMonth } from 'date-fns'
import { useExpense } from './context/store'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { NewIncome } from './incomes/newIncome'
import { NewExpense } from './expenses/newExpense'
import Suggestions from './suggestions/page'
import { Button } from '@/components/button'
import { Stats } from 'fs'
import { StatsGrid } from './reports/stats'

interface CombinedItem {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}



export default  function Home() {
  let [monthToCalculate, setMonthToCalculate] = useState(startOfMonth(new Date()))
  let [mergedIncomesandExpenses, setMergedIncomesandExpenses]  = useState<CombinedItem[]>([])
  let expenseStore = useExpense()
  let [page, setPage] = useState(0);
  let itemsPerPage = 10;

   

    useEffect(() => {
    
      setMergedIncomesandExpenses(
        expenseStore.items.map((expense) => ({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          category: expense.category.name,
          date: expense.date,
        }))
      )
      setMergedIncomesandExpenses((prevItems) => {
        return [...prevItems, ...expenseStore.incomeItems.map((income) => ({
          id: income.id,
          description: income.description,
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
        <Suggestions></Suggestions>
        <div className="flex items-center mt-4 text-gray-900 dark:text-white">
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => {
                setMonthToCalculate(new Date(monthToCalculate.setMonth(monthToCalculate.getMonth() - 1)))
              }}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="size-12" aria-hidden="true" />
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
              <ChevronRightIcon className="size-12" aria-hidden="true" />
            </button>
          </div>
      </div>
      
        <StatsGrid monthToCalculate={monthToCalculate} expenseStore={expenseStore}></StatsGrid>



      <div className="flex items-end justify-between gap-4 mt-12">
        <Heading>Incomes and Expenses</Heading>
        <NewIncome color="green">New Income</NewIncome>
        <NewExpense color="orange">New Expense</NewExpense>
      </div>
     
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {mergedIncomesandExpenses.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((income: CombinedItem) => (
            <TableRow key={income.id} title={`Income #${income.id}`}>
              <TableCell className="text-zinc-500">{income.date}</TableCell>
              <TableCell>{income.description}</TableCell>
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
      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span className='text-gray-900 dark:text-white'>Page {page + 1} of {Math.ceil(mergedIncomesandExpenses.length / itemsPerPage)}</span>
        <Button
          onClick={() => setPage(Math.min(Math.ceil(mergedIncomesandExpenses.length / itemsPerPage) - 1, page + 1))}
          disabled={page >= Math.ceil(mergedIncomesandExpenses.length / itemsPerPage) - 1}
        >
          Next
        </Button>
      </div>
      
    </>
  )
}
