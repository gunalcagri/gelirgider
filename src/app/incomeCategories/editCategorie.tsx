"use client"

import { Input } from '@/components/input'
import { useState } from 'react'
import { useExpense } from '@/app/context/store'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog'
import { Button } from '@/components/button'
import { FieldGroup, Field, Label } from '@/components/fieldset'


// Define the shape of an expense item
interface IncomeCategory {
  id: string;
  name: string;
}

export function EditIncomeCategory({ categoryToEdit }: { categoryToEdit: IncomeCategory }) {
  const { editIncomeCategory } = useExpense()
  const [isOpen, setIsOpen] = useState(false)

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault()

    editIncomeCategory({
      ...categoryToEdit,
      name: (e.target as any).name.value,
    })
    setIsOpen(false)
  }

  return (
    <>
      <Button type="button" color="yellow" onClick={() => setIsOpen(true)}>Edit </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={saveCategory}>
          <DialogTitle>Edit </DialogTitle>
          <DialogBody>
            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Input name="name" defaultValue={categoryToEdit.name} placeholder="Category name" autoFocus />
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