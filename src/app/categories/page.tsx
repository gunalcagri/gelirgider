"use client"
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { useExpense } from '../context/store'
import { Dialog } from '@/components/dialog'
import { DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { useState } from 'react'
import { InputGroup } from '@/components/input'
import { Input } from '@/components/input'
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { Select } from '@/components/select'
import { Divider } from '@/components/divider'
import { NewCategorie } from './newCategorie'
import { EditCategory } from './editCategorie'



// Define the shape of a category
interface Category {
  id: string;
  name: string;
  limit: number;
}

export default  function Categories() {
  let [isOpen, setIsOpen] = useState(false)
  let [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  let expenseStore = useExpense()
  let categories = expenseStore.categories

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Expense Categories</Heading>
          
        </div>
        <NewCategorie>New Category</NewCategorie>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Limit</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="text-sm">{category.name}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{category.limit}</div>
              </TableCell>
              
              <TableCell>
              <EditCategory categoryToEdit={category} />

                <Button  color="red" type='button' onClick={() =>{setCategoryToDelete(category);  setIsOpen(true)}}>Delete</Button>
               
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isOpen} onClose={setIsOpen}>
              <DialogTitle>Delete Category</DialogTitle>
              
              <DialogBody>
                <p>Are you sure you want to delete {categoryToDelete?.name}? </p>
              </DialogBody>
              <DialogActions>
                <Button plain onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button color="red" onClick={() => { expenseStore.removeCategory(categoryToDelete!); setIsOpen(false)}}>Delete</Button>
              </DialogActions>
            </Dialog>
    </>
  )
}
