use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

import { Booking, BookingWithDetails } from '../lib/types'

import { initialBookings, calculateRentalCost, isCarAvailable } from '../lib/data'

interface BookingsContextType {

  bookings: Booking[]

  addBooking: (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'customerId' | 'carId' | 'startDate' | 'endDate' | 'totalCost'>, customerId: string, carId: string, startDate: Date, endDate: Date) => boolean

  updateBooking: (id: string, updates: Partial<Booking>) => void

  deleteBooking: (id: string) => void

  getBooking: (id: string) => BookingWithDetails | undefined

  getBookingsByCustomer: (customerId: string) => BookingWithDetails[]

  getBookingsByCar: (carId: string) => BookingWithDetails[]

  calculateCost: (carId: string, startDate: Date, endDate: Date) => number

  isCarAvailable: (carId: string, startDate: Date, endDate: Date) => boolean

}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined)

export function BookingsProvider({ children }: { children: React.ReactNode }) {

  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {

    const saved = localStorage.getItem('bookings')

    if (saved) {

      setBookings(JSON.parse(saved).map((booking: any) => ({

        ...booking,

        startDate: new Date(booking.startDate),

        endDate: new Date(booking.endDate),

        createdAt: new Date(booking.createdAt),

        updatedAt: new Date(booking.updatedAt)

      })))

    } else {

      setBookings(initialBookings)

    }

  }, [])

  useEffect(() => {

    if (bookings.length > 0) {

      localStorage.setItem('bookings', JSON.stringify(bookings))

    }

  }, [bookings])

  const addBooking = (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'customerId' | 'carId' | 'startDate' | 'endDate' | 'totalCost'>, customerId: string, carId: string, startDate: Date, endDate: Date): boolean => {

    // Load current data from localStorage

    const savedCars = localStorage.getItem('cars')

    const savedCustomers = localStorage.getItem('customers')

    const savedBookings = localStorage.getItem('bookings')

    if (!savedCars || !savedCustomers) return false

    const cars = JSON.parse(savedCars).map((car: any) => ({

      ...car,

      createdAt: new Date(car.createdAt),

      updatedAt: new Date(car.updatedAt)

    }))

    const customers = JSON.parse(savedCustomers).map((customer: any) => ({

      ...customer,

      createdAt: new Date(customer.createdAt),

      updatedAt: new Date(customer.updatedAt)

    }))

    const allBookings = JSON.parse(savedBookings || '[]').map((booking: any) => ({

      ...booking,

      startDate: new Date(booking.startDate),

      endDate: new Date(booking.endDate),

      createdAt: new Date(booking.createdAt),

      updatedAt: new Date(booking.updatedAt)

    }))

    const car = cars.find(c => c.id === carId)

    if (!car || car.status !== 'available') return false

    const customer = customers.find(c => c.id === customerId)

    if (!customer) return false

    if (!isCarAvailable(carId, startDate, endDate, allBookings)) return false

    const totalCost = calculateRentalCost(car, startDate, endDate)

    const newBooking: Booking = {

      ...data,

      id: `book-${Date.now()}`,

      carId,

      customerId,

      startDate,

      endDate,

      totalCost,

      status: 'confirmed',

      createdAt: new Date(),

      updatedAt: new Date()

    }

    setBookings(prev => [...prev, newBooking])

    return true

  }

  const updateBooking = (id: string, updates: Partial<Booking>) => {

    setBookings(prev => prev.map(booking =>

      booking.id === id

        ? { ...booking, ...updates, updatedAt: new Date() }

        : booking

    ))

  }

  const deleteBooking = (id: string) => {

    setBookings(prev => prev.filter(booking => booking.id !== id))

  }

  const getBooking = (id: string): BookingWithDetails | undefined => {

    // Load from localStorage

    const savedCars = localStorage.getItem('cars')

    const savedCustomers = localStorage.getItem('customers')

    if (!savedCars || !savedCustomers) return undefined

    const cars = JSON.parse(savedCars).map((car: any) => ({

      ...car,

      createdAt: new Date(car.createdAt),

      updatedAt: new Date(car.updatedAt)

    }))

    const customers = JSON.parse(savedCustomers).map((customer: any) => ({

      ...customer,

      createdAt: new Date(customer.createdAt),

      updatedAt: new Date(customer.updatedAt)

    }))

    const booking = bookings.find(b => b.id === id)

    if (!booking) return undefined

    const car = cars.find(c => c.id === booking.carId)

    const customer = customers.find(c => c.id === booking.customerId)

    if (!car || !customer) return undefined

    return {

      ...booking,

      car,

      customer

    }

  }

  const getBookingsByCustomer = (customerId: string): BookingWithDetails[] => {

    const customerBookings = bookings.filter(b => b.customerId === customerId)

    return customerBookings.map(booking => getBooking(booking.id)).filter(Boolean) as BookingWithDetails[]

  }

  const getBookingsByCar = (carId: string): BookingWithDetails[] => {

    const carBookings = bookings.filter(b => b.carId === carId)

    return carBookings.map(booking => getBooking(booking.id)).filter(Boolean) as BookingWithDetails[]

  }

  const calculateCostFunc = (carId: string, startDate: Date, endDate: Date): number => {

    const savedCars = localStorage.getItem('cars')

    if (!savedCars) return 0

    const cars = JSON.parse(savedCars).map((car: any) => ({

      ...car,

      createdAt: new Date(car.createdAt),

      updatedAt: new Date(car.updatedAt)

    }))

    const car = cars.find(c => c.id === carId)

    if (!car) return 0

    return calculateRentalCost(car, startDate, endDate)

  }

  const isCarAvailableFunc = (carId: string, startDate: Date, endDate: Date): boolean => {

    const savedCars = localStorage.getItem('cars')

    const savedBookings = localStorage.getItem('bookings')

    if (!savedCars || !savedBookings) return false

    const cars = JSON.parse(savedCars).map((car: any) => ({

...car,

      createdAt: new Date(car.createdAt),

      updatedAt: new Date(car.updatedAt)

    }))

    const allBookings = JSON.parse(savedBookings).map((booking: any) => ({

      ...booking,

      startDate: new Date(booking.startDate),

      endDate: new Date(booking.endDate),

      createdAt: new Date(booking.createdAt),

      updatedAt: new Date(booking.updatedAt)

    }))

    return isCarAvailable(carId, startDate, endDate, allBookings)

  }

  return (

    <BookingsContext.Provider value={{

      bookings,

      addBooking,

      updateBooking,

      deleteBooking,

      getBooking,

      getBookingsByCustomer,

      getBookingsByCar,

      calculateCost: calculateCostFunc,

      isCarAvailable: isCarAvailableFunc

    }} >

      {children}

    </BookingsContext.Provider>

  )

}

export function useBookings() {

  const context = useContext(BookingsContext)

  if (!context) {

    throw new Error('useBookings must be used within a BookingsProvider')

  }

  return context

}

"