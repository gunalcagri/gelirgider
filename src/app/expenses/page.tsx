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
            <TableHeader>Name</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense: ExpenseItem) => (
            <TableRow key={expense.id}  title={`Expense #${expense.id}`}>
              
              <TableCell className="text-zinc-500">{expense.date}</TableCell>
              <TableCell>{expense.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{expense.category.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{expense.amount} ₺</TableCell>
              <TableCell className="text-right">
                <EditExpense expenseToEdit={expense}></EditExpense>
                <Button color="red" type="button" onClick={() =>{setExpenseToDelete(expense); setIsOpen(true)}}>Delete</Button>
              
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isOpen} onClose={setIsOpen}>
              <DialogTitle>Delete Expense</DialogTitle>
              
              <DialogBody>
                <p>Are you sure you want to delete {expenseToDelete?.name}?</p>
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
