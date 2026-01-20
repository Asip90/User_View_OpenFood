export type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
  }
  
  export type Cart = {
    items: CartItem[]
  }
  
  export function addItem(cart: Cart, product: Omit<CartItem, "quantity">): Cart {
    const existing = cart.items.find(i => i.id === product.id)
  
    if (existing) {
      return {
        items: cart.items.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      }
    }
  
    return {
      items: [...cart.items, { ...product, quantity: 1 }],
    }
  }
  
  export function removeItem(cart: Cart, id: string): Cart {
    return {
      items: cart.items.filter(i => i.id !== id),
    }
  }
  
  export function getTotal(cart: Cart): number {
    return cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    )
  }
  