
// export interface Restaurant {
//   name: string;
//   subdomain: string;
//   logo?: string | null; // Ajout du logo si nécessaire
// }

// export interface Table {
//   id: string;
//   token: string;
// }

// export interface Customization {
//   primary_color: string;
//   secondary_color: string;
//   font_family: string;
//   logo: string | null;
// }

// export interface MenuItem {
//   id: string;
//   name: string;
//   description: string;
//   price: string;
//   discount_price: string | null;
//   image: string | null;
//   is_available: boolean;
// }

// export interface Category {
//   id: string; // Garde-le en string pour la compatibilité avec setSelectedCategory
//   name: string;
//   items: MenuItem[];
// }

// export interface MenuData {
//   restaurant: Restaurant;
//   table: Table;
//   customization: Customization;
//   categories: Category[];
//   menuItems : MenuItem[];
// }

// // Types pour le panier
// export interface CartItem {
//   name: string;
//   price: string;
//   quantity: number;
//   image?: string; // Optionnel car l'image peut ne pas être toujours envoyée par le backend pour chaque article du panier
// }

// export interface Cart {
//   items: MenuItem[]
// }

// export interface CartResponse {
//   cart: { [itemId: string]: CartItem };
//   total: number;
//   count: number;
// }

// export interface CheckoutResponse {
//   order_id: number;
//   order_number: string;
//   total: number;
// }


// lib/types.ts

export interface Category {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  name: string;
  image: string | null;
  description?: string;
  price: string;
  discount_price?: string | null;
  category_id: number;
  category_name: string | ""
}

export interface Restaurant {
  name: string;
  location: string;
  address: string;
  logo?: string | null;
  phone?: string;
  description: string | ""

}

export interface MenuData {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  table: Table;
  customization:{
     primary_color :  string,
    secondary_color: string,
    font_family: string,
    logo: string,
    cover_image: string,
  },
}

export interface Table {
    id: string;
    token: string;
    number: number;
  }
