"use client"
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { NewExpense } from './newExpense'
import { EditExpense } from './editExpense'
import { useExpense } from '../context/store'
import { Dialog } from '@/components/dialog'
import { DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { useState } from 'react'
import { Category, ExpenseItem } from '../types'


export default  function Expenses() {
  let [isOpen, setIsOpen] = useState(false)
  let [expenseToDelete, setExpenseToDelete] = useState<ExpenseItem | null>(null)
  let expenseStore =  useExpense()
  let [page, setPage] = useState(0);
  let itemsPerPage = 10;
  const expenses = expenseStore.items.sort((a: ExpenseItem, b: ExpenseItem) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Expenses</Heading>
       <NewExpense color="orange">New Expense</NewExpense>
      </div>
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((expense: ExpenseItem) => (
            <TableRow key={expense.id} title={`Expense #${expense.id}`}>
              <TableCell className="text-zinc-500 dark:text-zinc-400">{expense.date}</TableCell>
              <TableCell className="dark:text-white">{expense.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="dark:text-white">{expense.category.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right dark:text-white">{expense.amount} ₺</TableCell>
              <TableCell className="text-right">
                <EditExpense expenseToEdit={expense} />
                <Button color="red" type="button" onClick={() => {setExpenseToDelete(expense); setIsOpen(true)}} className="dark:bg-red-700 dark:hover:bg-red-600">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
        >
          Previous
        </Button>
        <span className="dark:text-white">Page {page + 1} of {Math.ceil(expenses.length / itemsPerPage)}</span>
        <Button
          onClick={() => setPage(Math.min(Math.ceil(expenses.length / itemsPerPage) - 1, page + 1))}
          disabled={page >= Math.ceil(expenses.length / itemsPerPage) - 1}
          className="dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
        >
          Next
        </Button>
      </div>
      <Dialog open={isOpen} onClose={setIsOpen}>
              <DialogTitle>Delete Expense</DialogTitle>
              
              <DialogBody>
                <p>Are you sure you want to delete {expenseToDelete?.category.name}?</p>
              </DialogBody>
              <DialogActions>
                <Button plain onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button color="red" onClick={() => { expenseStore.removeItem(expenseToDelete!); setIsOpen(false)}}>Delete</Button>
              </DialogActions>
            </Dialog>
    </>
  )
}
