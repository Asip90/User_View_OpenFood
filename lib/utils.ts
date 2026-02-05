import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Order } from "@/lib/types"
export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs))
}
// Dans un fichier utils.ts
export const localStorageUtils = {
  getOrders: () => {
    try {
      const data = localStorage.getItem("orders")
      if (!data) return []
      
      // Essayer de parser comme tableau
      const parsed = JSON.parse(data)
      // Si parsed est un tableau, le retourner
      if (Array.isArray(parsed)) return parsed
      
      // Si parsed est une chaîne (double encodage), parser à nouveau
      if (typeof parsed === 'string') {
        const reParsed = JSON.parse(parsed)
        return Array.isArray(reParsed) ? reParsed : []
      }
      
      return []
    } catch (error) {
      console.error("Erreur de parsing localStorage:", error)
      return []
    }
  },
  
  saveOrder: (payload: Order) => {
    try {
      const orders = localStorageUtils.getOrders()
      orders.push(payload)
      
      // Sauvegarder une seule fois (pas de double JSON.stringify)
      localStorage.setItem("orders", JSON.stringify(orders))
    } catch (error) {
      console.error("Erreur de sauvegarde localStorage:", error)
    }
  },
  
  clearCorruptedOrders: () => {
    localStorage.removeItem("orders")
  }
}