"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Utensils, Eye, Loader2, AlertCircle } from "lucide-react";
import { OrderStatus, OrderProgress } from "../../app/t/[tableToken]/orders/OrderContent";

const API_BASE =process.env.NEXT_PUBLIC_API_BASE_URL

interface CurrentOrderCardProps {
  lastOrderToken: string;
  onViewDetails?: (order: OrderStatus) => void;
}

export default function CurrentOrderCard({
  lastOrderToken,
  onViewDetails,
}: CurrentOrderCardProps) {

  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ORDER ================= */

  useEffect(() => {
    print(lastOrderToken)
    if (!lastOrderToken) return;

    let active = true;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_BASE}/orders/status/${lastOrderToken}`
        );

        if (!res.ok) {
          throw new Error("Commande introuvable ou expirée");
        }

        const data: OrderStatus = await res.json();
        if (active) setOrder(data);

      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Erreur lors du chargement de la commande"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      active = false;
    };
  }, [lastOrderToken]);

  /* ================= HELPERS ================= */

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const totalItems = useMemo(
    () => order?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    [order]
  );

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 flex items-center gap-3">
        <Loader2 className="animate-spin text-primary" size={20} />
        <span className="text-sm text-gray-600">
          Chargement de la commande en cours…
        </span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-3">
        <AlertCircle className="text-red-500 mt-0.5" size={18} />
        <div>
          <p className="text-sm font-medium text-red-700">
            Impossible de charger la commande
          </p>
          <p className="text-xs text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="rounded-2xl border border-primary/30 bg-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">

      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingBag size={14} className="text-primary" />
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  Commande en cours
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(order.created_at)}
                </div>
              </div>
            </div>

            {/* <div className="text-xs text-gray-400">
              Token :{" "}
              <span className="font-mono">
                {lastOrderToken.slice(0, 8)}…
              </span>
            </div> */}
          </div>

          <div className="text-right">
            {totalItems > 0 && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-2">
                <Utensils size={10} />
                {totalItems} article{totalItems > 1 ? "s" : ""}
              </div>
            )}

            {onViewDetails && (
              <button
                onClick={() => onViewDetails(order)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Eye size={14} />
                Détails
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="p-5">
        <OrderProgress status={order.status} />
      </div>
    </div>
  );
}
