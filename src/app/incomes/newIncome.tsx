'use client'

import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Description, Field, FieldGroup, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { use, useState } from 'react'
import { ExpenseProvider, useExpense } from '@/app/context/store'
import { SpeakerWaveIcon } from '@heroicons/react/16/solid'
import { IncomeCategory } from '../types'

export function NewIncome({ ...props }: React.ComponentPropsWithoutRef<typeof Button>) {
  let [isOpen, setIsOpen] = useState(false)
  let [isOpenNewCategory, setIsOpenNewCategory] = useState(false)
  let [selectedCategory, setSelectedCategory] = useState<string>('')

  const incomeStore = useExpense()
  const categories = incomeStore.incomeCategories || []

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault()

    setIsOpenNewCategory(false)

    const formData = new FormData(e.target as HTMLFormElement)

    const id = crypto.randomUUID()
    incomeStore.addIncomeCategory({
      id: id,
      name: formData.get('name') as string,
    })

    setSelectedCategory(id);

    document.getElementById('category')?.setAttribute('value', selectedCategory);
    

   


  }
   

  const saveExpense = (e: React.FormEvent) => {
    e.preventDefault()

    setIsOpen(false)

    const formData = new FormData(e.target as HTMLFormElement)

    incomeStore.addIncomeItem({
      id: crypto.randomUUID(),
      description: formData.get('name') as string,
      amount: Number(formData.get('amount')),
      category: incomeStore.incomeCategories.find(category => category.id === selectedCategory) || { id: '', name: '' },
      date: formData.get('date') as string,
    })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (value === 'new') {
      setIsOpenNewCategory(true);
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} {...props} >New Income</Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <form onSubmit={saveExpense}>
          <DialogTitle>New Income</DialogTitle>

          <DialogBody>
            <FieldGroup>
              <Field>
                <Label>Description</Label>
                <Input name="description" defaultValue="" placeholder="Income description" autoFocus />
              </Field>
              <Field>
                <Label>Amount</Label>
                <Input name="amount" type="number" step={0.01} defaultValue={0} min={0} placeholder="0.00" autoFocus />
              </Field>
              <Field>
                <Label>Category</Label>
                <Select id="category" name="category"  value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="" disabled>
                    Select a category&hellip;
                  </option>
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
                <Input type="date" name="date" defaultValue="" />
              </Field>

            </FieldGroup>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={isOpenNewCategory} onClose={setIsOpenNewCategory}>
        <form onSubmit={saveCategory}>
        <DialogTitle>New Category</DialogTitle>

        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input name="name" defaultValue="" placeholder="Category name" autoFocus />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpenNewCategory(false)}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
