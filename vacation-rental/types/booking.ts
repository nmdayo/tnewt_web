export interface Amenity {
  name: string
  description: string
  icon: React.ComponentType
}

export interface BookingDetails {
  checkIn: Date
  checkOut: Date
  guests: number
  options: string[]
  couponCode?: string
}

export interface GuestInformation {
  name: string
  nameKana: string
  address: string
  phone: string
}

