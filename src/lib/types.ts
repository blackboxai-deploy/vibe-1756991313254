export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: 'Sedan' | 'SUV' | 'Truck' | 'Van' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon';
  status: 'available' | 'rented' | 'maintenance' | 'disabled';
  dailyRate: number;
  hourlyRate: number;
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  seatingCapacity: number;
  transmission: 'Manual' | 'Automatic';
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  address: string;
  drivingRecord: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled' | 'overdue';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingWithDetails extends Booking {
  customer: Customer;
  car: Car;
}

export interface CarFilters {
  make?: string;
  model?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}