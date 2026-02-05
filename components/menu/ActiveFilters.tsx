"use client";

import { X } from "lucide-react";
import { useFilters } from "@/lib/contexts/FilterContext";

export function ActiveFilters() {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceFilter,
    setPriceFilter,
    availabilityFilter,
    setAvailabilityFilter,
    stats
  } = useFilters();

  if (!stats.hasActiveFilters) return null;

  return (
    <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-stone-600 font-medium">Filtres actifs :</span>
        
        {selectedCategory !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            Catégorie: {selectedCategory}
            <button 
              onClick={() => setSelectedCategory('all')}
              className="ml-1 hover:bg-primary/20 p-0.5 rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        
        {searchQuery && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-200 text-stone-700 rounded-full text-sm">
            Recherche: {`"`}{searchQuery}{`"`}
            <button 
              onClick={() => setSearchQuery('')}
              className="ml-1 hover:bg-stone-300 p-0.5 rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        
        {priceFilter !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            Prix: {{
              'under500': '< 500 FCFA',
              '500-1000': '500-1000 FCFA',
              '1000-2000': '1000-2000 FCFA',
              'over2000': '> 2000 FCFA'
            }[priceFilter]}
            <button 
              onClick={() => setPriceFilter('all')}
              className="ml-1 hover:bg-blue-100 p-0.5 rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        
        {availabilityFilter !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
            {availabilityFilter === 'available' ? 'Disponible' : 'Indisponible'}
            <button 
              onClick={() => setAvailabilityFilter('all')}
              className="ml-1 hover:bg-green-100 p-0.5 rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}