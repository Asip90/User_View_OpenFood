"use client";

import { useState, useContext } from "react";
import { CartContext } from "@/lib/cart-context";
import { MenuItem } from "@/lib/types";
import { Plus, Minus, Clock, Star } from "lucide-react";
import { MenuItemModal } from "./MenuItemModal";

export function CompactMenuItemCard({ item }: { item: MenuItem }) {
  const [showModal, setShowModal] = useState(false);
  const cartContext = useContext(CartContext);
  
  if (!cartContext) return null;
  
  const { cart, addItem, removeItem } = cartContext;
  const quantity = cart[item.id]?.quantity || 0;

  // Formatage du prix
  const priceValue = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
  const displayPrice = isNaN(priceValue) ? "0,00" : priceValue.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Vérifier la disponibilité
  const hasAvailability = 'is_available' in item;
  const isAvailable = hasAvailability ? (item as MenuItem & { is_available?: boolean }).is_available !== false : true;

  return (
    <div className={`group bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative ${
      !isAvailable ? 'opacity-70 border-stone-300' : 'border-stone-200'
    }`}>
      {!isAvailable && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-3 py-1 bg-stone-200 text-stone-700 text-xs font-medium rounded-full">
            Indisponible
          </span>
        </div>
      )}
      
      <div className="flex p-3 gap-4 h-full">
        {/* COLONNE GAUCHE : Image */}
        <div className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden relative">
          <div 
            className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden relative cursor-pointer" 
            onClick={() => setShowModal(true)}
          >
            <img 
              src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        </div>

        {/* COLONNE DROITE : Contenu */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* HAUT : Titre et Prix */}
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-stone-900 text-lg leading-tight line-clamp-2 pr-2">
              {item.name}
            </h4>
            <div className="text-lg font-bold text-primary whitespace-nowrap">
              {displayPrice} F
            </div>
          </div>

          {/* MILIEU : Description */}
          <div className="mb-3">
            <p className="text-sm text-stone-500 line-clamp-2 leading-snug mb-1">
              {item.description || "Ingrédients frais et préparation maison."}
            </p>
            {'is_popular' in item && (item as MenuItem & { is_popular?: boolean }).is_popular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full">
                <Star className="w-3 h-3 fill-yellow-500" />
                Populaire
              </span>
            )}
          </div>

          {/* BAS : Actions */}
          <div className="flex items-center justify-between mt-auto">
            {/* Temps de préparation */}
            <div className="flex items-center text-stone-400 text-xs sm:text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{item.preparation_time || 10}-{item.preparation_time ? item.preparation_time + 5 : 15} min</span>
            </div>

            {/* Bouton d'action */}
            <div className="flex-shrink-0">
              {!isAvailable ? (
                <button
                  disabled
                  className="px-4 py-2 bg-stone-100 text-stone-400 text-sm font-medium rounded-lg cursor-not-allowed"
                >
                  Indisponible
                </button>
              ) : quantity === 0 ? (
                <button
                  onClick={() => addItem(item)}
                  className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Ajouter
                </button>
              ) : (
                <div className="flex items-center bg-stone-100 rounded-lg p-1 shadow-inner">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-stone-600 shadow-sm hover:text-red-600 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  
                  <span className="w-8 text-center font-bold text-stone-800 text-sm">
                    {quantity}
                  </span>
                  
                  <button 
                    onClick={() => addItem(item)}
                    className="w-7 h-7 flex items-center justify-center bg-secondary rounded-md text-white shadow-sm hover:bg-secondary/90 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modale */}
      {showModal && <MenuItemModal item={item} onClose={() => setShowModal(false)} />}
    </div>
  );
}