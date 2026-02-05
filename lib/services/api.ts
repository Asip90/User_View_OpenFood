
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL 



export async function fetchMenu(tableToken: string) {
  const response = await axios.get(`${API_BASE}/menu/${tableToken}/`);
  // console.log(response.data)
  return response.data;


}
