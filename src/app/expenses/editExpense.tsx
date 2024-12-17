"use client"

import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { useState } from 'react'
import { useExpense } from '@/app/context/store'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog'
import { Button } from '@/components/button'
import { FieldGroup, Field, Label } from '@/components/fieldset'
import { IncomeCategory } from '../types'
import { ExpenseItem } from '../types'

export function EditExpense({ expenseToEdit }: { expenseToEdit: ExpenseItem }) {
  const { categories, updateItem } = useExpense()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(expenseToEdit.category.id)

  const saveExpense = (e: React.FormEvent) => {
    e.preventDefault()

    updateItem({
      ...expenseToEdit,
      description: (e.target as any).description.value,
      amount: Number((e.target as any).amount.value),
      category: expenseToEdit.category,
      date: (e.target as any).date.value,
    })
    setIsOpen(false)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  return (
    <>
      <Button type="button" color="yellow" onClick={() => setIsOpen(true)}>Edit </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={saveExpense}>
          <DialogTitle>Edit </DialogTitle>
          <DialogBody>
            <FieldGroup>
              <Field>
                <Label>Description</Label>
                <Input name="description" defaultValue={expenseToEdit.description} placeholder="Expense description" autoFocus />
              </Field>
              <Field>
                <Label>Amount</Label>
                <Input name="amount" defaultValue={expenseToEdit.amount} placeholder="$0.00" />
              </Field>
              <Field>
                <Label>Category</Label>
                <Select name="category" value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="" disabled>Select a category&hellip;</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                  <option value="new">New Category</option>
                </Select>
              </Field>
              <Field>
                <Label>Date</Label>
                <Input type="date" name="date" defaultValue={expenseToEdit.date} />
              </Field>
            </FieldGroup>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
     
    </>
  )
}