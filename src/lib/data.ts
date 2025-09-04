import { Car, Customer, Booking } from './types';

// Initial car inventory
export const initialCars: Car[] = [
  {
    id: 'car-1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    category: 'Sedan',
    status: 'available',
    dailyRate: 45,
    hourlyRate: 8,
    fuelType: 'Gasoline',
    seatingCapacity: 5,
    transmission: 'Automatic',
    description: 'Comfortable and fuel-efficient sedan perfect for long drives.',
    imageUrl: 'https://placehold.co/400x250?text=Toyota+Camry+2022',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'car-2',
    make: 'Ford',
    model: 'Explorer',
    year: 2021,
    category: 'SUV',
    status: 'available',
    dailyRate: 65,
    hourlyRate: 12,
    fuelType: 'Gasoline',
    seatingCapacity: 7,
    transmission: 'Automatic',
    description: 'Spacious family SUV with excellent safety features.',
    imageUrl: 'https://placehold.co/400x250?text=Ford+Explorer+2021',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'car-3',
    make: 'BMW',
    model: 'M3',
    year: 2023,
    category: 'Coupe',
    status: 'rented',
    dailyRate: 120,
    hourlyRate: 25,
    fuelType: 'Gasoline',
    seatingCapacity: 4,
    transmission: 'Manual',
    description: 'High-performance sports coupe for the enthusiast driver.',
    imageUrl: 'https://placehold.co/400x250?text=BMW+M3+2023',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: 'car-4',
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    category: 'Sedan',
    status: 'available',
    dailyRate: 35,
    hourlyRate: 6,
    fuelType: 'Gasoline',
    seatingCapacity: 5,
    transmission: 'Manual',
    description: 'Reliable and economical sedan for budget-conscious renters.',
    imageUrl: 'https://placehold.co/400x250?text=Honda+Civic+2020',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'car-5',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    category: 'Sedan',
    status: 'available',
    dailyRate: 85,
    hourlyRate: 15,
    fuelType: 'Electric',
    seatingCapacity: 5,
    transmission: 'Automatic',
    description: 'Electric sedan with autopilot features for premium experience.',
    imageUrl: 'https://placehold.co/400x250?text=Tesla+Model+3+2023',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  }
];

// Initial customers
export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1-555-0101',
    licenseNumber: 'DL123456789',
    address: '123 Main St, Anytown, USA',
    drivingRecord: 'Clean record, no accidents',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'cust-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-0102',
    licenseNumber: 'DL987654321',
    address: '456 Oak Ave, Somewhere, USA',
    drivingRecord: 'Excellent driving history',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'cust-3',
    name: 'Mike Davis',
    email: 'mike@example.com',
    phone: '+1-555-0103',
    licenseNumber: 'DL456789123',
    address: '789 Pine St, Elsewhere, USA',
    drivingRecord: 'Minor infraction 2 years ago',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  }
];

// Initial bookings
export const initialBookings: Booking[] = [
  {
    id: 'book-1',
    customerId: 'cust-1',
    carId: 'car-3',
    startDate: new Date('2024-02-10T09:00:00Z'),
    endDate: new Date('2024-02-15T17:00:00Z'),
    totalCost: 600,
    status: 'active',
    notes: 'Customer requested child seat',
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'book-2',
    customerId: 'cust-2',
    carId: 'car-2',
    startDate: new Date('2024-01-20T10:00:00Z'),
    endDate: new Date('2024-01-23T14:00:00Z'),
    totalCost: 195,
    status: 'completed',
    notes: 'Extended by one day',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20')
  }
];

// Helper function to calculate rental cost
export function calculateRentalCost(
  car: Car,
  startDate: Date,
  endDate: Date,
  hourlyRental: boolean = false
): number {
  const hours = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)));
  const days = Math.max(1, Math.ceil(hours / 24));

  if (hourlyRental) {
    return hours * car.hourlyRate;
  }

  return days * car.dailyRate;
}

// Helper function to check car availability
export function isCarAvailable(
  carId: string,
  startDate: Date,
  endDate: Date,
  existingBookings: Booking[]
): boolean {
  const carBookings = existingBookings.filter(
    booking => booking.carId === carId &&
    (booking.status === 'confirmed' || booking.status === 'active')
  );

  return !carBookings.some(booking => {
    return (
      (startDate >= booking.startDate && startDate < booking.endDate) ||
      (endDate > booking.startDate && endDate <= booking.endDate) ||
      (startDate <= booking.startDate && endDate >= booking.endDate)
    );
  });
}