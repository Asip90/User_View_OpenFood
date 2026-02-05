// "use client";

// import { Order } from "@/lib/types";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// /* ================= TYPES ================= */

// type CachedOrder = {
//   order_id: number;
//   order_token: string;
//   expires_at: number;
// };

// type OrderStatus = {
//   order_id: number;
//   status: string;
//   total: string;
//   created_at: string;
// };



// // type LoyaltyInfo = {
// //   points: number;
// //   next_reward_at: number;
// // };

// /* ================= CONFIG ================= */

// const API_BASE = 'http://le-luxury-house.localhost:8000/api/customer'
// const REFRESH_INTERVAL = 30_000; // 30 secondes

// /* ================= PAGE ================= */

// export default function OrdersPage() {
//   const [currentOrder, setCurrentOrder] = useState<CachedOrder | null>(null);
//   const [orderStatus, setOrderStatus] = useState<Order | null>(null);
// const [history, setHistory] = useState<Order[]>([])
// const param = useParams()
// console.log(param)
// //   const [loyalty, setLoyalty] = useState<LoyaltyInfo | null>(null);

//   const [phone, setPhone] = useState("");
//   const [tab, setTab] = useState<"current" | "history">("current");
//   const [loading, setLoading] = useState(false);

//   /* ================= CACHE ================= */

//   useEffect(() => {
//     const raw = localStorage.getItem("current_order");
//     console.log(raw)
//     if (!raw) {
//       setTab("history");
//       return;
//     }

//     const cached: CachedOrder = JSON.parse(raw);

//     if (Date.now() > cached.expires_at) {
//       localStorage.removeItem("current_order");
//       setTab("history");
//       return;
//     }

//     setCurrentOrder(cached);
//   }, []);

//   /* ================= STATUT COMMANDE ================= */

//   useEffect(() => {
//     if (!currentOrder) return;

//     const fetchStatus = async () => {
//       try {
//         const res = await fetch(
//           `${API_BASE}/orders/${currentOrder.order_id}/status/?token=${currentOrder.order_token}`
//         );
//         if (!res.ok) return;
//         const data: Order = await res.json();
//         setOrderStatus(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchStatus();
//     const interval = setInterval(fetchStatus, REFRESH_INTERVAL);

//     return () => clearInterval(interval);
//   }, [currentOrder]);

//   /* ================= HISTORIQUE + FIDÉLITÉ ================= */

//   const fetchHistory = async () => {
//     if (!phone) return;
//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/orders/history/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone }),
//       });

//       if (!res.ok) return;
//       const data = await res.json();

//     //   const data = await res.json();
//         setHistory(data);

//     //   setLoyalty(data.loyalty);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="max-w-xl mx-auto p-4 space-y-4">
//       <h1 className="text-xl font-semibold">Mes commandes</h1>

//       {/* Onglets */}
//       <div className="flex gap-2">
//         {currentOrder && (
//           <button
//             onClick={() => setTab("current")}
//             className={`px-3 py-1 rounded ${
//               tab === "current" ? "bg-black text-white" : "bg-gray-200"
//             }`}
//           >
//             Commande en cours
//           </button>
//         )}
//         <button
//           onClick={() => setTab("history")}
//           className={`px-3 py-1 rounded ${
//             tab === "history" ? "bg-black text-white" : "bg-gray-200"
//           }`}
//         >
//           Historique & fidélité
//         </button>
//       </div>

//       {/* ================= COMMANDE EN COURS ================= */}
//       {tab === "current" && orderStatus && (
//         <div className="border rounded p-4 space-y-2">
//           <p><strong>ID :</strong> {orderStatus.id}</p>
//           <p><strong>Statut :</strong> {orderStatus.status}</p>
//           <p><strong>Total :</strong> {orderStatus.total} FCFA</p>
//           <p className="text-sm text-gray-500">
//             Mise à jour automatique toutes les 30s
//           </p>
//         </div>
//       )}

//       {/* ================= HISTORIQUE ================= */}
//       {tab === "history" && (
//         <div className="space-y-3">
//           <input
//             type="tel"
//             placeholder="Numéro de téléphone"
//             className="w-full border rounded p-2"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//           />

//           <button
//             onClick={fetchHistory}
//             className="w-full bg-black text-white py-2 rounded"
//           >
//             Voir mes commandes
//           </button>

//           {loading && <p>Chargement…</p>}

//           {/* Fidélité */}
//           {/* {loyalty && (
//             <div className="border rounded p-3 bg-gray-50">
//               <p><strong>Carte de fidélité</strong></p>
//               <p>
//                 Points : {loyalty.points} / {loyalty.next_reward_at}
//               </p>
//               <div className="w-full bg-gray-200 h-2 rounded">
//                 <div
//                   className="bg-black h-2 rounded"
//                   style={{
//                     width: `${(loyalty.points / loyalty.next_reward_at) * 100}%`,
//                   }}
//                 />
//               </div>
//               <p className="text-sm text-gray-600">
//                 Encore {loyalty.next_reward_at - loyalty.points} commandes
//                 pour une récompense
//               </p>
//             </div>
//           )} */}

//           {/* Liste commandes */}
//           {history.map((order) => (
//             <div key={order.id} className="border rounded p-3">
//               <p><strong>ID :</strong> {order.id}</p>
//               <p><strong>Statut :</strong> {order.status}</p>
//               <p><strong>Total :</strong> {order.total} FCFA</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
    
//   );
// }
import { Suspense } from "react";
import OrdersContent from "./OrderContent";
import { MenuProvider } from "@/lib/contexts/MenuContext";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ tableToken: string }>;
}) {
  // Await the params to get the tableToken
  const { tableToken } = await params;

  return (
    <MenuProvider tableToken={tableToken}>
      <Suspense fallback={<LoadingScreen />}>
        <OrdersContent />
      </Suspense>
    </MenuProvider>
  );
}