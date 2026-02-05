"use client";

import { Search, Filter, X, Clock, Tag } from "lucide-react";
import { useFilters } from "@/lib/contexts/FilterContext";
import { useMenu } from "@/lib/contexts/MenuContext";
import { Category, MenuItem } from "@/lib/types";

export function SearchAndFilters() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceFilter,
    setPriceFilter,
    availabilityFilter,
    setAvailabilityFilter,
    showCategories,
    setShowCategories,
    getCategoryCount
  } = useFilters();

  const { allMenuItems, categories } = useMenu();

  return (
    <div className="sticky top-[70px] z-40 bg-white/95 backdrop-blur-lg py-4 -mx-4 px-4 mb-6 border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Barre de recherche avec bouton effacer */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un plat, un ingrédient, une catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtres principaux en ligne */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Bouton catégories */}
          <div className="relative">
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
                selectedCategory !== 'all'
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              {selectedCategory === 'all' ? 'Catégories' : selectedCategory}
              {selectedCategory !== 'all' && (
                <span className="ml-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {getCategoryCount(selectedCategory)}
                </span>
              )}
            </button>
          </div>
          
          {/* Filtre par prix */}
          <div className="relative">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="appearance-none px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-10"
            >
              <option value="all">Tous les prix</option>
              <option value="under500">Moins de 500 FCFA</option>
              <option value="500-1000">500 - 1000 FCFA</option>
              <option value="1000-2000">1000 - 2000 FCFA</option>
              <option value="over2000">Plus de 2000 FCFA</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Clock className="w-4 h-4 text-stone-400" />
            </div>
          </div>
          
          {/* Filtre par disponibilité (si applicable) */}
          {allMenuItems.some(item => 'is_available' in item) && (
            <div className="relative">
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-10"
              >
                <option value="all">Tous les statuts</option>
                <option value="available">Disponible</option>
                <option value="unavailable">Indisponible</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Tag className="w-4 h-4 text-stone-400" />
              </div>
            </div>
          )}
        </div>

        {/* Panneau des catégories déroulant */}
        {showCategories && (
          <CategoriesPanel 
            categories={categories}
            allMenuItems={allMenuItems}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setShowCategories(false);
            }}
            onClose={() => setShowCategories(false)}
          />
        )}
      </div>
    </div>
  );
}

function CategoriesPanel({ 
  categories, 
  allMenuItems, 
  onSelectCategory, 
  onClose 
}: { 
  categories: Category[];
  allMenuItems: MenuItem[];
  onSelectCategory: (category: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="mt-4 p-4 bg-white border border-stone-200 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-stone-900">Sélectionnez une catégorie</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-stone-500" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <button
          onClick={() => onSelectCategory('all')}
          className="px-4 py-3 rounded-lg text-sm font-medium bg-stone-50 text-stone-700 hover:bg-stone-100 transition-all text-left"
        >
          <div className="flex items-center justify-between">
            <span>Tous les plats</span>
            <span className="text-xs opacity-80">{allMenuItems.length}</span>
          </div>
        </button>
        
        {categories.map(cat => {
          const count = cat.items.length;
          if (count === 0) return null;
          
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="px-4 py-3 rounded-lg text-sm font-medium bg-stone-50 text-stone-700 hover:bg-stone-100 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{cat.name}</span>
                <span className="text-xs opacity-80">{count}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}