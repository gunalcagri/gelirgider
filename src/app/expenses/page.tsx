import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { getExpenses } from '@/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expenses',
}

export default async function Expenses() {
  let expenses = await getExpenses()

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Expenses</Heading>
        <Button className="-my-0.5">Create expense</Button>
      </div>
      <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Expense number</TableHeader>
            <TableHeader>Purchase date</TableHeader>
            <TableHeader>Customer</TableHeader>
            <TableHeader>Event</TableHeader>
            <TableHeader className="text-right">Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} href={expense.url} title={`Expense #${expense.id}`}>
              <TableCell>{expense.id}</TableCell>
              <TableCell className="text-zinc-500">{expense.date}</TableCell>
              <TableCell>{expense.customer.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar src={expense.event.thumbUrl} className="size-6" />
                  <span>{expense.event.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">US{expense.amount.usd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
