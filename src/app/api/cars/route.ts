import { NextResponse } from 'next/server'

import { initialCars } from '../../../lib/data'

import { Car } from '../../../lib/types'

// Global store for demo

const globalStore = global as any;

globalStore.cars = globalStore.cars || initialCars

globalStore.customers = globalStore.customers || []

globalStore.bookings = globalStore.bookings || []

export async function GET() {

  return NextResponse.json(globalStore.cars)

}

export async function POST(request: Request) {

  const data: Omit<Car, 'id' | 'createdAt' | 'updatedAt'> = await request.json()

  const newCar: Car = {

    ...data,

    id: `car-${Date.now()}`,

    createdAt: new Date(),

    updatedAt: new Date()

  }

  globalStore.cars.push(newCar)

  return NextResponse.json(newCar)

}

export async function PUT(request: Request) {

  const { id, ...updates } = await request.json()

  globalStore.cars = globalStore.cars.map(car =>

    car.id === id ? { ...car, ...updates, updatedAt: new Date() } : car

  )

  return NextResponse.json({ success: true })

}

export async function DELETE(request: Request) {

  const { id } = await request.json()

  globalStore.cars = globalStore.cars.filter(car => car.id !== id)

  return NextResponse.json({ success: true })

}

