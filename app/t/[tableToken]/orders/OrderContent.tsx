"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Order } from "@/lib/types";
import { useMenu } from "@/lib/contexts/MenuContext";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { 
  Clock, 
  CheckCircle, 
  Package, 
  ChefHat, 
  Truck, 
  Smartphone,
  History,
  Search,
  ShoppingBag,
  Loader2,
  RefreshCw,
  Calendar,
  User,
  ArrowLeft,
  AlertCircle,
  Check,
  Coffee,
  Utensils,
  Zap,
   Eye,
  X,
  Info,
  CreditCard,
  MessageSquare,
  Tag,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import CurrentOrderCard from "@/components/order/CuurentOrderCard";

/* ================= TYPES ================= */

interface CachedOrder {
  order_id: number;
  order_token: string;
  order_number: string;
  total: string;
  table_token: string;
  created_at: number;
  expires_at: number;
}

interface OrderItemDetail {
  id: number;
  menu_item__name?: string;
  product_name: string;
  quantity: number;
  price: string;
}

export interface OrderStatus extends Order {
  id: number;
  order_id: number;
  status: string;
  total: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
  items?: OrderItemDetail[];
}

type OrderStatusType = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';

/* ================= CONFIG ================= */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL 


const REFRESH_INTERVAL = 30_000;
const RECENT_ORDERS_THRESHOLD = 12 * 60 * 60 * 1000; // 12 heures en millisecondes

/* ================= ORDER STATUS COMPONENTS ================= */

const STATUS_CONFIG: Record<OrderStatusType, { 
  label: string; 
  icon: React.ElementType; 
  color: string; 
  bg: string; 
}> = {
  pending: { label: 'En attente', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  confirmed: { label: 'Confirmée', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  preparing: { label: 'En préparation', icon: ChefHat, color: 'text-orange-600', bg: 'bg-orange-50' },
  ready: { label: 'Prête', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  delivered: { label: 'Servie', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
};

function StatusBadge({ status }: { status: string }) {
  const statusKey = status.toLowerCase() as OrderStatusType;
  const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
}

export  function OrderProgress({ status }: { status: string }) {
  const steps = useMemo(() => Object.keys(STATUS_CONFIG) as OrderStatusType[], []);
  const currentIndex = useMemo(() => steps.indexOf(status.toLowerCase() as OrderStatusType), [status, steps]);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-3">
        {steps.map((step, index) => {
          const config = STATUS_CONFIG[step];
          const Icon = config.icon;
          const isActive = index <= currentIndex;
          
          return (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                isActive 
                  ? `${config.bg} ${config.color} ring-4 ${config.bg.replace('bg-', 'ring-')}/20` 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <Icon size={18} />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'} text-center max-w-16`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

function OrderCard({ 
  order, 
  isCurrent = false,
  onViewDetails 
}: { 
  order: OrderStatus; 
  isCurrent?: boolean;
  onViewDetails?: () => void;
}) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const totalItems = useMemo(() => 
    order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0, 
    [order.items]
  );

  const totalAmount = useMemo(() => 
    parseFloat(order.total).toLocaleString('fr-FR'), 
    [order.total]
  );

  return (
    <div className={`rounded-2xl border ${isCurrent ? 'border-primary/30 bg-white shadow-lg' : 'border-gray-200 bg-white shadow-sm'} overflow-hidden transition-all duration-300 hover:shadow-md`}>
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingBag size={14} className="text-primary" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Commande du
                  {/* #{order.id} */}
                </div>
                <div className="text-xs text-gray-400">{formatDate(order.created_at)}</div>
              </div>
            </div>
            {/* <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">{totalAmount} FCFA</h3>
              <StatusBadge status={order.status} />
            </div> */}
          </div>
          <div className="text-right">
            {/* <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
              <Calendar size={14} />
            </div> */}
            {totalItems > 0 && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-2">
                <Utensils size={10} />
                {totalItems} article{totalItems > 1 ? 's' : ''}
              </div>
            )}
            {/* Bouton Voir les détails */}
            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Eye size={14} />
                Détails
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div >
        {isCurrent && (<div className="p-5"><OrderProgress status={order.status} /></div> )}
        {/* Items */}
        {/* {order.items && order.items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Coffee size={16} />
              Articles commandés
            </h4>
            <div className="space-y-3">
              {order.items.map((item) => {
                const itemTotal = parseFloat(item.price) * item.quantity;
                return (
                  <div key={item.id} className="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.product_name}</div>
                      <div className="text-sm text-gray-500">Quantité: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {itemTotal.toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
function OrderDetailsModal({ 
  order, 
  onClose 
}: { 
  order: OrderStatus; 
  onClose: () => void;
}) {
  // Format date française simplifiée
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Calcul du sous-total
  const subtotal = order.items?.reduce((sum, item) => 
    sum + (parseFloat(item.price) * item.quantity), 0) || 0;

  const total = subtotal; // Taxes incluses

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[70vh] overflow-y-auto bg-white rounded-xl shadow-xl">
        
        {/* En-tête compact avec date intégrée */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-5 border-b bg-white">
          <div className="flex flex-col min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
              Commande #{order.id}
            </h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <p className="text-sm text-gray-600 whitespace-nowrap">
                {formatDate(order.created_at)}
              </p>
              <div className="flex items-center gap-2">
                <ShoppingBag size={14} className="text-gray-400" />
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Contenu principal */}
        <div className="p-4 md:p-5 space-y-5">
          
          {/* Liste des articles */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-base md:text-lg">
              Articles ({order.items?.length || 0})
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* En-têtes tableau */}
              <div className="bg-gray-50 grid grid-cols-10 gap-2 p-3 border-b border-gray-200">
                <div className="col-span-6 font-medium text-gray-600 text-sm">Article</div>
                <div className="col-span-2 font-medium text-gray-600 text-sm text-center">Qté</div>
                <div className="col-span-2 font-medium text-gray-600 text-sm text-center">Prix</div>
              </div>
              
              {/* Articles */}
              <div className="divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="grid grid-cols-10 gap-2 p-3 hover:bg-gray-50">
                    <div className="col-span-6">
                      <p className="font-medium text-gray-900 text-sm md:text-base">
                        {item.menu_item__name}
                      </p>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center justify-center min-w-8 h-8 bg-primary/10 text-primary font-medium rounded-lg text-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="col-span-2 text-center font-medium text-gray-900 text-sm md:text-base">
                      {parseFloat(item.price).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Total</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Montant total</span>
                  <span className="text-xl font-bold text-primary">
                    {total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 text-sm mb-1">
                  Informations importantes
                </p>
                <p className="text-sm text-amber-700">
                  Présentez le numéro de commande #{order.id} pour toute question.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton fermer */}
        <div className="sticky bottom-0 p-4 md:p-5 border-t border-gray-200 bg-white">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base w-full md:w-auto"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= UTILITY FUNCTIONS ================= */

const validateCachedOrder = (order: unknown): order is CachedOrder => {
  if (!order || typeof order !== 'object') return false;
  
  const obj = order as Record<string, unknown>;
  
  return (
    // typeof obj.order_id === 'number' &&
    typeof obj.order_token === 'string' &&
    typeof obj.table_token === 'string' &&
    typeof obj.expires_at === 'number' &&
    typeof obj.total === 'string' &&
    typeof obj.created_at === 'number'
  );
};

const getRecentOrdersFromCache = (tableToken: string): CachedOrder[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem("orders");
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const now = Date.now();
    return parsed
      .filter((o: unknown) => validateCachedOrder(o))
      .filter((o: CachedOrder) => o.table_token === tableToken)
      .filter((o: CachedOrder) => o.expires_at > now);
  } catch {
    return [];
  }
};


const cleanupExpiredOrders = (): void => {
  try {
    const raw = localStorage.getItem("orders");
    if (!raw) return;

    const orders: unknown[] = JSON.parse(raw);
    if (!Array.isArray(orders)) return;

    const now = Date.now();
    const activeOrders = orders.filter(order => 
      validateCachedOrder(order) && order.expires_at > now
    );
    
    if (activeOrders.length !== orders.length) {
      localStorage.setItem("orders", JSON.stringify(activeOrders));
    }
  } catch (error) {
    console.error('Error cleaning cache:', error);
  }
};

/* ================= MAIN COMPONENT ================= */

export default function OrdersContent() {
  const { restaurant, loading: menuLoading, table } = useMenu();
  const [recentOrders, setRecentOrders] = useState<CachedOrder[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<Map<number, OrderStatus>>(new Map());
  const [history, setHistory] = useState<OrderStatus[]>([]);
  const [phone, setPhone] = useState("");
  const [tab, setTab] = useState<"recent" | "history">("recent");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);


 const [selectedOrder, setSelectedOrder] = useState<OrderStatus | null>(null);

  // ... le reste du code existant ...

  // Fonction pour fermer la modale
  const closeModal = () => setSelectedOrder(null);

  // Fonction pour ouvrir la modale avec une commande
  const openOrderDetails = (order: OrderStatus) => {
    setSelectedOrder(order);
  };
  /* ================= LOAD RECENT ORDERS FROM LOCALSTORAGE ================= */

  useEffect(() => {
    if (!table) return;

    cleanupExpiredOrders();
    const cachedOrders = getRecentOrdersFromCache(table.token);
    setRecentOrders(cachedOrders);
  }, [table]);

  /* ================= FETCH STATUS FOR RECENT ORDERS ================= */

  const fetchRecentOrderStatus = useCallback(async (orderId: number, orderToken: string) => {
    console.log('debut du fecth')
    setRefreshing(prev => [...prev, orderId]);
    try {
      const res = await fetch(
        `${API_BASE}/orders/status/${orderToken}`
      );
      
      if (!res.ok) {
        if (res.status === 404 || res.status === 400) {
          setRecentOrders(prev => prev.filter(order => order.order_id !== orderId));
        }
        return;
      }
      
      const data: OrderStatus = await res.json();
      setOrderStatuses(prev => new Map(prev).set(orderId, data));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur");
    } finally {
      setRefreshing(prev => prev.filter(id => id !== orderId));
    }
  }, []);

  // Fetch status for all recent orders
  useEffect(() => {
    if (!table || recentOrders.length === 0) return;

    recentOrders.forEach(order => {
      if (!orderStatuses.has(order.order_id)) {
        fetchRecentOrderStatus(order.order_id, order.order_token);
      }
    });
  }, [recentOrders, table, fetchRecentOrderStatus, orderStatuses]);

  /* ================= FETCH ORDER HISTORY ================= */

  const fetchHistory = async () => {
    if (!phone || !table) {
      setError("Veuillez entrer votre numéro de téléphone");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/orders/history/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: phone.replace(/\D/g, ''),
          tabletoken: table.token
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${res.status}`);
      }
      
      const responseData: OrderStatus[] = await res.json();
      console.log(responseData)
      // Validate and transform response data
      // console.log(order)
      const validatedHistory = responseData.filter((order): order is OrderStatus => 
        
        
        order && 
        typeof order.id === 'number' &&
        typeof order.status === 'string' &&
        typeof order.total === 'string' &&
        typeof order.created_at === 'string'
      ).map(order => ({
        ...order,
        order_id: order.id,
        items: order.items?.map(item => ({
          ...item,
          product_name: item.product_name || item.menu_item__name || "Article"
        })) || []
      }));
      // console.log(order.item)
      setHistory(validatedHistory);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération de l'historique");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PHONE HANDLING ================= */

  // const handlePhoneChange = (value: string) => {
  //   const numericValue = value.replace(/\D/g, '');
  //   setPhone(numericValue.slice(0, 15));
  // };

  // const formatPhoneDisplay = (value: string) => {
  //   const numeric = value.replace(/\D/g, '');
  //   if (numeric.length <= 2) return numeric;
  //   if (numeric.length <= 4) return `${numeric.slice(0, 2)} ${numeric.slice(2)}`;
  //   if (numeric.length <= 7) return `${numeric.slice(0, 2)} ${numeric.slice(2, 4)} ${numeric.slice(4)}`;
  //   return `${numeric.slice(0, 2)} ${numeric.slice(2, 5)} ${numeric.slice(5, 8)}`;
  // };
const handlePhoneChange = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  // Accepter jusqu'à 20 chiffres (ou plus si tu veux)
  setPhone(numericValue.slice(0, 20));
};

const formatPhoneDisplay = (value: string) => {
  const numeric = value.replace(/\D/g, '');
  // Découper en blocs de 2 ou 3 chiffres pour lisibilité
  return numeric.match(/.{1,2}/g)?.join(' ') || '';
};

  /* ================= RENDER ================= */

  if (menuLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Chargement des informations...</p>
      </div>
    );
  }

  if (!restaurant || !table) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
          Table introuvable
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Impossible de charger les informations de la table.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar restaurant={restaurant} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/t/${table.token}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Retour au menu</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <ShoppingBag size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Suivi des commandes</h1>
              <p className="text-gray-600">
                Table {table.number} • {restaurant.name}
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Toujours présents */}
          <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
            <button
              onClick={() => setTab("recent")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                tab === "recent" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Zap size={18} />
              <span>Achat récent</span>
              {recentOrders.length > 0 && (
                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                  tab === "recent" ? "bg-primary/10 text-primary" : "bg-gray-200 text-gray-600"
                }`}>
                  {recentOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("history")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                tab === "history" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <History size={18} />
              <span>Historique</span>
              {history.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in slide-in-from-top duration-300">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Recent Orders Tab */}
        {tab === "recent" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Achats récents</h2>
                <p className="text-sm text-gray-600">Commandes des dernières 12 heures</p>
              </div>
              <button
                onClick={() => {
                  cleanupExpiredOrders();
                  const cachedOrders = getRecentOrdersFromCache(table.token);
                  setRecentOrders(cachedOrders);
                }}
                disabled={refreshing.length > 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={refreshing.length > 0 ? 'animate-spin' : ''} />
                Actualiser
              </button>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 
                {recentOrders.map((cachedOrder) => {
                  const orderStatus = orderStatuses.get(cachedOrder.order_id);
                  const isRefreshing = refreshing.includes(cachedOrder.order_id);
                  
                  return (
                    <div key={cachedOrder.order_id} className="relative">
                      {orderStatus ? (
                       <CurrentOrderCard
                        lastOrderToken={cachedOrder.order_token}
                        onViewDetails={(order) => openOrderDetails(order)}
                      />

                      )  : (
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <ShoppingBag size={14} className="text-primary" />
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Commande </div>
                                  <div className="text-xs text-gray-400">
                                    {new Date(cachedOrder.created_at).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {parseFloat(cachedOrder.total).toLocaleString('fr-FR')} FCFA
                              </h3>
                            </div>
                            <div className="text-right">
                              <button
                                onClick={() => fetchRecentOrderStatus(cachedOrder.order_id, cachedOrder.order_token)}
                                disabled={isRefreshing}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                              >
                                {isRefreshing ? (
                                  <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Chargement...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw size={14} />
                                    Voir le statut
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun achat récent</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Vous{` n'`}avez pas de commandes dans les dernières 12 heures.
                  Consultez votre historique pour voir toutes vos commandes.
                </p>
                <Link 
                  href={`/t/${table.token}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Utensils size={18} />
                  Voir le menu
                </Link>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {tab === "history" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="text-primary" size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Votre historique de commandes</h3>
                  <p className="text-sm text-gray-600">Entrez votre numéro pour consulter vos commandes passées</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    placeholder="Ex: 77 123 45 67"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    value={formatPhoneDisplay(phone)}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchHistory()}
                  />
                  {phone && (
                    <button
                      onClick={() => setPhone("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
                
                <button
                  onClick={fetchHistory}
                  disabled={loading || phone.replace(/\D/g, '').length < 8}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Recherche en cours...</span>
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      <span>Consulter{` l'`}historique</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* History List */}
            {history.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {history.length} commande{history.length > 1 ? 's' : ''} trouvée{history.length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm text-gray-600">Triées par date récente</p>
                  </div>
                  <button
                    onClick={() => {
                      setPhone("");
                      setHistory([]);
                    }}
                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Effacer la recherche
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onViewDetails={() => openOrderDetails(order)}
                    />
                  ))}
                </div>
              </div>
            )}

            {history.length === 0 && phone && !loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <History className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Aucune commande {`n'`}est associée au numéro {formatPhoneDisplay(phone)} 
                  dans ce restaurant. Vérifiez votre numéro ou contactez le service client.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Pour toute question concernant votre commande, veuillez contacter directement le serveur.
          </p>
        </div>
      </main>

      <Footer restaurant={restaurant} />
         {/* Modal pour les détails de la commande */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={closeModal}
        />
      )}
    </div>
  );
}