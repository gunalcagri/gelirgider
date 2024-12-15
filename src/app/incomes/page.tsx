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



export default  function Incomes() {
  let [isOpen, setIsOpen] = useState(false)
  let [incomeToDelete, setIncomeToDelete] = useState<IncomeItem | null>(null)
  let incomeStore =  useExpense()
  const incomes = incomeStore.incomeItems.sort((a: IncomeItem, b: IncomeItem) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
            <TableHeader>Name</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {incomes.map((income: IncomeItem) => (
            <TableRow key={income.id}  title={`Income #${income.id}`}>
              
              <TableCell className="text-zinc-500">{income.date}</TableCell>
              <TableCell>{income.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{income.category.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{income.amount} ₺</TableCell>
              <TableCell className="text-right">
                <EditIncome incomeToEdit={income}></EditIncome>
                <Button color="red" type="button" onClick={() =>{setIncomeToDelete(income); setIsOpen(true)}}>Delete</Button>
              
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isOpen} onClose={setIsOpen}>
              <DialogTitle>Delete Income</DialogTitle>
              
              <DialogBody>
                <p>Are you sure you want to delete {incomeToDelete?.name}?</p>
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
