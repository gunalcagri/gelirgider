"use client"
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { useExpense } from '../context/store'
import { Dialog } from '@/components/dialog'
import { DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { useState } from 'react'
import { NewIncome } from '../incomes/newIncome'
import { EditIncome } from '../incomes/editIncome'
import { IncomeCategory,IncomeItem } from '../types'
import { form } from 'framer-motion/client'



export default  function Incomes() {
  let [isOpen, setIsOpen] = useState(false)
  let [incomeToDelete, setIncomeToDelete] = useState<IncomeItem | null>(null)
  let incomeStore =  useExpense()
  let [page, setPage] = useState(0);
  let itemsPerPage = 10;
  const incomes = incomeStore.incomeItems.sort((a: IncomeItem, b: IncomeItem) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatter = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <div className="flex items-end justify-between gap-4 mt-12">
        <Heading>Incomes</Heading>
        <NewIncome color="green">New Income</NewIncome>
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
          {incomes.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((income: IncomeItem) => (
            <TableRow key={income.id} title={`Income #${income.id}`}>
              <TableCell className="text-zinc-500">{income.date}</TableCell>
              <TableCell>{income.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{income.category.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{formatter.format(income.amount)} ₺</TableCell>
              <TableCell className="text-right">
                <EditIncome incomeToEdit={income} />
                <Button color="red" type="button" onClick={() => {setIncomeToDelete(income); setIsOpen(true)}}>Delete</Button>
              </TableCell>
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
        <span className='text-zinc-500 dark:text-zinc-400'>Page {page + 1} of {Math.ceil(incomes.length / itemsPerPage)}</span>
        <Button
          onClick={() => setPage(Math.min(Math.ceil(incomes.length / itemsPerPage) - 1, page + 1))}
          disabled={page >= Math.ceil(incomes.length / itemsPerPage) - 1}
        >
          Next
        </Button>
      </div>
      <Dialog open={isOpen} onClose={setIsOpen}>
              <DialogTitle>Delete Income</DialogTitle>
              
              <DialogBody>
                <p>Are you sure you want to delete {incomeToDelete?.category.name}?</p>
              </DialogBody>
              <DialogActions>
                <Button plain onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button color="red" onClick={() => { incomeStore.removeIncomeItem(incomeToDelete!); setIsOpen(false)}}>Delete</Button>
              </DialogActions>
            </Dialog>
    </>
  )
}
