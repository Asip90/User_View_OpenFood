"use client";

import { MenuItem } from "@/lib/types";
import { X, Clock, Star } from "lucide-react";

export function MenuItemModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        {/* Bouton fermer */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
        >
          <div className="bg-black rounded-full"><X size={20} color="white"/></div>
        </button>

        {/* Image */}
        <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
          <img 
            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Infos */}
        <h2 className="text-xl font-bold text-stone-900 mb-2">{item.name}</h2>
        <p className="text-stone-600 mb-4">{item.description || "Ingrédients frais et préparation maison."}</p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-primary">{item.price} F</span>
          <span className="flex items-center text-stone-400 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {item.preparation_time || "10-15 min"}
          </span>
        </div>

        {/* Badge populaire */}
        {'is_popular' in item && (item as MenuItem & { is_popular?: boolean }).is_popular && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full mb-4">
            <Star className="w-3 h-3 fill-yellow-500" />
            Populaire
          </span>
        )}
      </div>
    </div>
  );
}