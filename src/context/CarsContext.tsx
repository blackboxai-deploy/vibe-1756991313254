use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

import { Car, CarFilters } from '../lib/types'

import { initialCars } from '../lib/data'

interface CarsContextType {

  cars: Car[]

  addCar: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => void

  updateCar: (id: string, updates: Partial<Car>) => void

  deleteCar: (id: string) => void

  getCar: (id: string) => Car | undefined

  searchCars: (filters: CarFilters) => Car[]

}

const CarsContext = createContext<CarsContextType | undefined>(undefined)

export function CarsProvider({ children }: { children: React.ReactNode }) {

  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {

    const saved = localStorage.getItem('cars')

    if (saved) {

      set Cars(JSON.parse(saved).map((car: any) => ({

        ...car,

        createdAt: new Date(car.createdAt),

        updatedAt: new Date(car.updatedAt)

      })))

    } else {

      setCars(initialCars)

    }

  }, [])

  useEffect(() => {

    if (cars.length > 0) {

      localStorage.setItem('cars', JSON.stringify(cars))

    }

  }, [cars])

  const addCar = (carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt' >) => {

    const newCar: Car = {

      ...carData,

      id: `car-${Date.now()}`,

      createdAt: new Date(),

      updatedAt: new Date()

    }

    setCars(prev => [...prev, newCar])

  }

  const updateCar = (id: string, updates: Partial<Car >) => {

    setCars(prev => prev.map(car =>

      car.id === id

        ? { ...car, ...updates, updatedAt: new Date() }

        : car

    ))

  }

  const deleteCar = (id: string) => {

    setCars(prev => prev.filter(car => car.id !== id))

  }

  const getCar = (id: string) => {

    return cars.find(car => car.id === id)

  }

  const searchCars = (filters: CarFilters) => {

    return cars.filter(car => {

      if (filters.make && !car.make.toLowerCase().includes(filters.make.toLowerCase())) return false

      if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) return false

      if (filters.category && car.category !== filters.category) return false

      if (filters.status && car.status !== filters.status) return false

      if (filters.minPrice && car.dailyRate < filters.minPrice) return false

      if (filters.maxPrice && car.dailyRate > filters.maxPrice) return false

      return true

    })

  }

  return (

    <CarsContext.Provider value={{

      cars,

      addCar,

      updateCar,

      deleteCar,

      getCar,

      searchCars

    }} >

      {children}

    </CarsContext.Provider>

  )

}

export function useCars() {

  const context = useContext(CarsContext)

  if (!context) {

    throw new Error('useCars must be used within a CarsProvider')

  }

  return context

}

