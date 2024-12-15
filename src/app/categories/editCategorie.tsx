"use client"

import { Input } from '@/components/input'
import { useState } from 'react'
import { useExpense } from '@/app/context/store'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/dialog'
import { Button } from '@/components/button'
import { FieldGroup, Field, Label } from '@/components/fieldset'


// Define the shape of an expense item
interface Category {
  id: string;
  name: string;
  limit: number;
}

export function EditCategory({ categoryToEdit }: { categoryToEdit: Category }) {
  const { updateCategory } = useExpense()
  const [isOpen, setIsOpen] = useState(false)

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault()

    updateCategory({
      ...categoryToEdit,
      name: (e.target as any).name.value,
      limit: Number((e.target as any).limit.value),
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
              <Field>
                <Label>Limit</Label>
                <Input name="limit" defaultValue={categoryToEdit.limit} placeholder="0.00" />
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