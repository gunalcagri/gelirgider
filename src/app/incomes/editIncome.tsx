"use client"

import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { useState } from 'react'
import { useExpense } from '@/app/context/store'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog'
import { Button } from '@/components/button'
import { FieldGroup, Field, Label } from '@/components/fieldset'
import { IncomeCategory } from '../types'



// Define the shape of an income item
interface IncomeItem {
  id: string;
  name: string;
  amount: number;
  category: IncomeCategory;
  date: string;
}

export function EditIncome({ incomeToEdit }: { incomeToEdit: IncomeItem }) {
  const { incomeCategories, updateIncomeItem } = useExpense()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(incomeToEdit.category.id)

  const saveIncome = (e: React.FormEvent) => {
    e.preventDefault()

    updateIncomeItem({
      ...incomeToEdit,
      name: (e.target as any).name.value,
      amount: Number((e.target as any).amount.value),
      category: incomeCategories.find(c => c.id === selectedCategory) || incomeToEdit.category,
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
        <form onSubmit={saveIncome}>
          <DialogTitle>Edit </DialogTitle>
          <DialogBody>
            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Input name="name" defaultValue={incomeToEdit.name} placeholder="Income name" autoFocus />
              </Field>
              <Field>
                <Label>Amount</Label>
                <Input name="amount" defaultValue={incomeToEdit.amount} placeholder="$0.00" />
              </Field>
              <Field>
                <Label>Category</Label>
                <Select name="category" value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="" disabled>Select a category&hellip;</option>
                  {incomeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                  <option value="new">New Category</option>
                </Select>
              </Field>
              <Field>
                <Label>Date</Label>
                <Input type="date" name="date" defaultValue={incomeToEdit.date} />
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