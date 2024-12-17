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
import { InputNumberFormat, unformat } from '@react-input/number-format';

interface Category {
  name: string;
  limit: number;
}

export function NewExpense({ ...props }: React.ComponentPropsWithoutRef<typeof Button>) {
  let [isOpen, setIsOpen] = useState(false)
  let [isOpenNewCategory, setIsOpenNewCategory] = useState(false)
  let [selectedCategory, setSelectedCategory] = useState<string>('')
  let [isInstallment, setIsInstallment] = useState(false)
  let [installmentCount, setInstallmentCount] = useState(2)
  let [amount, setAmount] = useState(0)

  const expenses = useExpense()
  const categories = expenses.categories || []

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpenNewCategory(false)
    const formData = new FormData(e.target as HTMLFormElement)
    const id = crypto.randomUUID()
    expenses.addCategory({
      id: id,
      name: formData.get('name') as string,
      limit: Number(formData.get('limit')),
    })
    setSelectedCategory(id)
    document.getElementById('category')?.setAttribute('value', id)
  }

  const saveExpense = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
    setIsInstallment(false)
    const formData = new FormData(e.target as HTMLFormElement)
    const date = new Date(formData.get('date') as string)

    if (isInstallment) {
      for (let i = 0; i < installmentCount; i++) {
        const installmentDate = new Date(date)
        installmentDate.setMonth(date.getMonth() + i)
        expenses.addItem({
          id: crypto.randomUUID(),
          description: `${formData.get('description')} (${i + 1}/${installmentCount})`,
          amount: -amount / installmentCount,
          category: expenses.categories.find(category => category.id === selectedCategory) || { id: '', name: '', limit: 0 },
          date: installmentDate.toISOString().split('T')[0],
        })
      }
    } else {
      expenses.addItem({
        id: crypto.randomUUID(),
        description: formData.get('description') as string,
        amount: -amount,
        category: expenses.categories.find(category => category.id === selectedCategory) || { id: '', name: '', limit: 0 },
        date: formData.get('date') as string,
      })
    }
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
      <Button type="button" onClick={() => setIsOpen(true)} {...props} />
      <Dialog open={isOpen} onClose={setIsOpen}>
        <form onSubmit={saveExpense}>
          <DialogTitle>New Expense</DialogTitle>
          <DialogBody>
            <FieldGroup>
              <Field>
                <Label>Description</Label>
                <Input name="description" defaultValue="" placeholder="Expense description" autoFocus />
              </Field>
              <Field>
                <Label>Amount</Label>
                <InputNumberFormat 
                  name="amount" 
                  className='relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20 bg-transparent dark:bg-white/5 focus:outline-none data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600 disabled:border-zinc-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:data-[hover]:disabled:border-white/15'
                  placeholder="0.00"
                  locales="tr-TR"
                  format="currency"
                  currency="TRY"
                  onChange={(e) => setAmount(Number(unformat(e.target.value,'tr-TR')))}
                />
              </Field>
              <Field>
                <CheckboxField>
                  <Checkbox checked={isInstallment} onChange={() => setIsInstallment(!isInstallment)} />
                  <Label>Installment</Label>
                </CheckboxField>
              </Field>
              {isInstallment && (
                <Field>
                  <Label>Number of Installments</Label>
                  <Input 
                    type="number" 
                    defaultValue={installmentCount} 
                    onChange={(e) => setInstallmentCount(Number(e.target.value))}
                  />
                  <h2> Installment Amount: {amount ? Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount / installmentCount) : '0.00'} </h2>
                </Field>
              )}
              <Field>
                <Label>Category</Label>
                <Select id="category" name="category" value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="" disabled>Select a category&hellip;</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
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
            <Button plain onClick={() => setIsOpen(false)}>Cancel</Button>
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
              <Field>
                <Label>Limit</Label>
                <Input name="limit" defaultValue={0} placeholder="0.00" />
              </Field>
            </FieldGroup>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpenNewCategory(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
