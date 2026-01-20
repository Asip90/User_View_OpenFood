// types/menu.ts

export interface RestaurantInfo {
  name: string
  subdomain: string
  phone?: string
}

export interface TableInfo {
  id: number
  token: string
}

export interface Customization {
  primary_color: string
  secondary_color: string
  logo?: string
}

export interface MenuItem {
  id: number
  name: string
  price: string
  image?: string
}

export interface Category {
  id: number
  name: string
  items: MenuItem[]
}

export interface ClientMenuContextData {
  restaurant: RestaurantInfo
  table: TableInfo
  customization: Customization
  categories: Category[]
}
