
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

// Define the shape of a category
interface Category {
  name: string;
  limit: number;
}

export function NewCategorie({ ...props }: React.ComponentPropsWithoutRef<typeof Button>) {
  let [isOpen, setIsOpen] = useState(false)

  const expenses = useExpense()

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault()

    setIsOpen(false)

    const formData = new FormData(e.target as HTMLFormElement)

    const id = crypto.randomUUID()
    expenses.addCategory({
      id: id,
      name: formData.get('name') as string,
      limit: Number(formData.get('limit')),
    })

   
  }
   

  

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} {...props} />
      <Dialog open={isOpen} onClose={setIsOpen}>
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
              <Input name="limit" defaultValue={0} placeholder="0.00" autoFocus />
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

    </>
  )
}
