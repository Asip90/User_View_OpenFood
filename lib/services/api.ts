
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_sURL || 'http://localhost:8000/api/customer';

// export const api = axios.create({
//   baseURL: API_BASE,
// });

export async function fetchMenu(tableToken: string) {
  const response = await axios.get(`http://localhost:8000/api/customer/menu/${tableToken}/`);
  console.log(response.data)
  return response.data;

}

// export async function updateCart(
//   tableToken: string, 
//   action: 'add' | 'update' | 'remove', 
//   itemId: string, 
//   quantity?: number
// ) {
//   const response = await api.post(`/api/cart/${tableToken}/`, {
//     action,
//     item_id: itemId,
//     quantity
//   });
//   return response.data;
// }

// export async function checkout(tableToken: string) {
//   const response = await api.post(`/api/checkout/${tableToken}/`);
//   return response.data;
// }

// import axios from 'axios';
// import { MenuData} from '@/lib/types';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
// console.log("API_BASE_URL dans api.ts:", API_BASE_URL);
// // Fonction pour récupérer le menu
// export const fetchMenu = async (tableToken: string): Promise<MenuData> => {
//   // const subd = subdomain
// const response = await axios.get(`http://127.0.0.1:8000/api/customer/menu/${tableToken}/`);
//   console.log(response.data)
//   return response.data;
// };
