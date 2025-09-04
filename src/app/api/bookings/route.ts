import { NextResponse } from 'next/server'

import { initialBookings } from '../../../lib/data'

import { Booking } from '../../../lib/types'

// Global store for demo

const globalStore = globalThis például as any;

globalStore.cars = globalStore.cars || []

globalStore.customers = globalStore.customers || []

globalStore.bookings = globalStore.bookings || initialBookings

export async function GET() {

  return NextResponse.json(globalStore.bookings)

}

export async function POST(request: Request) {

  const data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = await request.json()

  const newBooking: Booking = {

    ...data,

    id: `book-${Date.now()}`,

    createdAt: new Date(),

    updatedAt: new Date()

  }

  globalStore.bookings.push(newBooking)

  return NextResponse.json(newBooking)

}

export async function PUT(request: Request) {

  const { id, ...updates } = await request.json()

  globalStore.bookings = globalStore.bookings.map(booking =>

    booking.id === id ? { ...booking, ...updates, updatedAt: new Date() } : booking

  )

  return NextResponse.json({ success: true })

}

export async function DELETE(request: Request) {

  const { id } = await request.json()

  globalStore.bookings = globalStore.bookings.filter(booking => booking.id !== id)

  return NextResponse.json({ success: true })

}

