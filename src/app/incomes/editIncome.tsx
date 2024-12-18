"use client"

import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { useState } from 'react'
import { useExpense } from '@/app/context/store'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog'
import { Button } from '@/components/button'
import { FieldGroup, Field, Label } from '@/components/fieldset'
import { IncomeItem } from '../types'
import { unformat, InputNumberFormat } from '@react-input/number-format'

export function EditIncome({ incomeToEdit }: { incomeToEdit: IncomeItem }) {
  const { incomeCategories, updateIncomeItem } = useExpense()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(incomeToEdit.category.id)

  const saveIncome = (e: React.FormEvent) => {
    e.preventDefault()

    updateIncomeItem({
      ...incomeToEdit,
      description: (e.target as any).description.value,
      amount: Number(unformat((e.target as any).amount.value, 'tr-TR')),
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
                <Label>Description</Label>
                <Input name="description" defaultValue={incomeToEdit.description} placeholder="Income name" autoFocus />
              </Field>
              <Field>
                <Label>Amount</Label>
                <InputNumberFormat 
                name="amount" 
                className='relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20 bg-transparent dark:bg-white/5 focus:outline-none data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600 disabled:border-zinc-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:data-[hover]:disabled:border-white/15'
                locales="tr-TR"
                format="currency"
                currency="TRY"
                defaultValue={incomeToEdit.amount} 
                placeholder="0.00" />
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