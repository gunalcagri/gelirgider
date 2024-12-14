'use client'

import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Description, Field, FieldGroup, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { use, useState } from 'react'
import { ExpenseProvider, useExpense } from '@/app/context/store' 

export function NewExpense({ ...props }:  React.ComponentPropsWithoutRef<typeof Button>) {
  let [isOpen, setIsOpen] = useState(false)

  function saveExpense(amount: number, category: string, date: string) {
    useExpense().addItem({
      id: crypto.randomUUID(),
      name: 'New expense',
      amount: 0,
      category: '',
      date: '',
    })
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} {...props} />
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>New Expense</DialogTitle>
        
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input name="name" defaultValue="" placeholder="Expense name" autoFocus />
            </Field>
            <Field>
              <Label>Amount</Label>
              <Input name="amount" defaultValue={0} placeholder="$0.00" autoFocus />
            </Field>
            <Field>
              <Label>Category</Label>
              <Select name="category" defaultValue="">
                <option value="" disabled>
                  Select a category&hellip;
                </option>
                <option value="gas">Gas</option>
                <option value="food">Food</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
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
          <Button onClick={() => saveExpense(false)}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
