use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

import { Customer } from '../lib/types'

import { initialCustomers } from '../lib/data'

interface CustomersContextType {

  customers: Customer[]

  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void

  updateCustomer: (id: string, updates: Partial<Customer>) => void

  deleteCustomer: (id: string) => void

  getCustomer: (id: string) => Customer | undefined

  searchCustomers: (query: string) => Customer[]

}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined)

export function CustomersProvider({ children }: { children: React.ReactNode }) {

  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {

    const saved = localStorage.getItem('customers')

    if (saved) {

      setCustomers(JSON.parse(saved).map((customer: any) => ({

        ...customer,

        createdAt: new Date(customer.createdAt),

        updatedAt: new Date(customer.updatedAt)

      })))

    } else {

      setCustomers(initialCustomers)

    }

  }, [])

  useEffect(() => {

    if (customers.length > 0) {

      localStorage.setItem('customers', JSON.stringify(customers))

    }

  }, [customers])

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {

    const newCustomer: Customer = {

      ...customerData,

      id: `cust-${Date.now()}`,

      createdAt: new Date(),

      updatedAt: new Date()

    }

    setCustomers(prev => [...prev, newCustomer])

  }

  const updateCustomer = (id: string, updates: Partial<Customer>) => {

    setCustomers(prev => prev.map(customer =>

      customer.id === id

        ? { ...customer, ...updates, updatedAt: new Date() }

        : customer

    ))

  }

  const deleteCustomer = (id: string) => {

    setCustomers(prev => prev.filter(customer => customer.id !== id))

  }

  const getCustomer = (id: string) => {

    return customers.find(customer => customer.id === id)

  }

  const searchCustomers = (query: string) => {

    return customers.filter(customer => {

      if (customer.name.toLowerCase().includes(query.toLowerCase())) return true

      if (customer.email.toLowerCase().includes(query.toLowerCase())) return true

      if (customer.phone.includes(query)) return true

      return false

    })

  }

  return (

    <CustomersContext.Provider value={{

      customers,

      addCustomer,

      updateCustomer,

      deleteCustomer,

      getCustomer,

      searchCustomers

    }} >

      {children}

    </CustomersContext.Provider>

  )

}

export function useCustomers() {

  const context = useContext(CustomersContext)

  if (!context) {

    throw new Error('useCustomers must be used within a CustomersProvider')

  }

  return context

}

"