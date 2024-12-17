'use client'

import { Badge } from '@/components/badge'
import { Divider } from '@/components/divider'

export function Stat({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6 dark:text-white">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8 dark:text-white">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
        <span className="text-zinc-500 dark:text-zinc-400">from last month</span>
      </div>
    </div>
  )
}

export function StatExpense({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6 dark:text-white">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8 dark:text-white">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith('+') ? 'pink' : 'lime'}>{change}</Badge>{' '}
        <span className="text-zinc-500 dark:text-zinc-400">from last month</span>
      </div>
    </div>
  )
}

export function StatsGrid({ monthToCalculate, expenseStore }: { monthToCalculate: Date; expenseStore: any }) {
  return (
    <div className="mt-4 mb-8 grid gap-8 sm:grid-cols-3 xl:grid-cols-3">
      <Stat
        title="Total revenue"
        value={(expenseStore.calculateIncomebyMonth(monthToCalculate) + expenseStore.calculateExpensebyMonth(monthToCalculate)).toString()}
        change={expenseStore.calculateRevenueDifference(monthToCalculate)}
      />
      <Stat
        title="Income"
        value={expenseStore.calculateIncomebyMonth(monthToCalculate).toString()}
        change={expenseStore.calculateIncomeDifference(monthToCalculate)}
      />
      <Stat
        title="Expense"
        value={expenseStore.calculateExpensebyMonth(monthToCalculate).toString()}
        change={expenseStore.calculateExpenseDifference(monthToCalculate)}
      />
    </div>
  )
}