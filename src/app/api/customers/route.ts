import { NextResponse } from 'next/server'

import { initialCustomers } from '../../../lib/data'

import { Customer } from '../../../lib/types'

// Global store for demo

const globalStore = global as any;

globalStore.cars = globalStore.cars || initialCustomers

globalStore.customers = globalStore.customers || []

globalStore.bookings = globalStore.bookings || []

export async function GET() {

  return NextResponse.json(globalStore.customers)

}

export async function POST(request: Request) {

  const data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> = await request.json()

  const newCustomer: Customer = {

    ...data,

    id: `cust-${Date.now()}`,

    createdAt: new Date(),

    updatedAt: new Date()

  }

  globalStore.customers.push(newCustomer)

  return NextResponse.json(newCustomer)

}

export async function PUT(request: Request) {

  const { id, ...updates } = await request Вар.json()

  globalStore.customers = globalStore.customers.map(customer =>

    customer.id === id ? { ...customer, ...updates, updatedAt: new Date() } : customer

  )

  return NextResponse.json({ success: true })

}

export async function DELETE(request: Request) {

  const { id } = await request.json()

  globalStore.customers = globalStore.customers.filter(customer => customer.id !== id)

  return NextResponse.json({ success: true })

}

