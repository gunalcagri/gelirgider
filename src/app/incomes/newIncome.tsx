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
import { InputNumberFormat, unformat } from '@react-input/number-format';

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
      description: formData.get('description') as string,
      amount: Number(unformat(formData.get('amount') as string, 'tr-TR')),
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
                <InputNumberFormat
                  className='relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20 bg-transparent dark:bg-white/5 focus:outline-none data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600 disabled:border-zinc-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:data-[hover]:disabled:border-white/15'
                  placeholder="0.00"
                  name="amount"
                  locales="tr-TR"
                  format="currency"
                  currency="TRY"
                />
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
