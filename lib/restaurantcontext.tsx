'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Type du restaurant (à adapter selon ton modèle)
interface Restaurant {
  id: number
  name: string
  address: string
  // ajoute les autres champs nécessaires
}

interface RestaurantContextType {
  restaurant: Restaurant | null
  loading: boolean
  error: string | null
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({ token, children }: { token: string; children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        setLoading(true)
        const res = await fetch(`/api/restaurant?token=${token}`)
        if (!res.ok) throw new Error('Erreur lors du fetch du restaurant')
        const data: Restaurant = await res.json()   // typage explicite
        setRestaurant(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)   // plus besoin de `any`
        } else {
          setError('Erreur inconnue')
        }
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchRestaurant()
    }
  }, [token])

  return (
    <RestaurantContext.Provider value={{ restaurant, loading, error }}>
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (context === undefined) {
    throw new Error('useRestaurant doit être utilisé dans un RestaurantProvider')
  }
  return context
}
