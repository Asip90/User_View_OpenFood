"use client";

import { useMenu } from "@/lib/contexts/MenuContext";
import { useFilters } from "@/lib/contexts/FilterContext";
import { CompactMenuItemCard } from "./CompactMenuItemCard";
import { UtensilsCrossed, X } from "lucide-react";
import { MenuItem } from "@/lib/types";
export function MenuContent() {
  const { categories } = useMenu();
  const { 
    selectedCategory, 
    filteredItems, 
    stats, 
    clearAllFilters,
    searchQuery
  } = useFilters();

  return (
    <>
      {/* En-tête avec statistiques */}
      <div className="py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
              Notre Carte Gastronomique
            </h1>
            <p className="text-stone-600">
              {stats.filteredCount} plat{stats.filteredCount > 1 ? 's' : ''} disponible{stats.filteredCount > 1 ? 's' : ''}
              {stats.activeFilters > 0 && ` (${stats.filteredCount} résultat${stats.filteredCount > 1 ? 's' : ''})`}
            </p>
          </div>
          
          {stats.hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Effacer tous les filtres
            </button>
          )}
        </div>
      </div>

      {/* Résultats de recherche */}
      {searchQuery && (
        <div className="mb-6">
          <p className="text-stone-600">
            {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''} pour {`"`}{searchQuery}{`"`}
          </p>
        </div>
      )}

      {/* Afficher les catégories ou les items filtrés */}
      {selectedCategory === 'all' ? (
        // Afficher par catégories
        <CategoryView />
      ) : (
        // Afficher les items filtrés de la catégorie sélectionnée
        <FilteredItemsView filteredItems={filteredItems} />
      )}
    </>
  );
}

function CategoryView() {
  const { categories } = useMenu();
  const { 
    searchQuery, 
    priceFilter, 
    availabilityFilter,
    normalizeString
  } = useFilters();

  return (
    <div className="space-y-8">
      {categories.map(category => {
        // Filtrer les items de cette catégorie selon les critères
        const categoryItems = category.items
        .filter(item => (item as MenuItem & { is_available?: boolean }).is_available !== false)
        .filter(item => {
          let include = true;
          
          // Filtre par recherche
          if (searchQuery.trim() !== "") {
            const normalizedQuery = normalizeString(searchQuery);
            const normalizedName = normalizeString(item.name);
            const normalizedDescription = item.description ? normalizeString(item.description) : "";
            
            include = include && (normalizedName.includes(normalizedQuery) ||
                     normalizedDescription.includes(normalizedQuery));
          }
          
          // Filtre par prix
          if (priceFilter !== 'all') {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            switch(priceFilter) {
              case 'under500': include = include && price < 500; break;
              case '500-1000': include = include && price >= 500 && price <= 1000; break;
              case '1000-2000': include = include && price > 1000 && price <= 2000; break;
              case 'over2000': include = include && price > 2000; break;
            }
          }
          
          // Filtre par disponibilité
          if (availabilityFilter !== 'all' && 'is_available' in item) {
            const isAvailable = (item as MenuItem & { is_available?: boolean }).is_available !== false;
            include = include && (availabilityFilter === 'available' ? isAvailable : !isAvailable);
          }
          
          return include;
        });
        
        if (categoryItems.length === 0) return null;
        
        return (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-bold text-stone-900">{category.name}</h2>
              <span className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                {categoryItems.length} plat{categoryItems.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categoryItems.map((item) => (
                <CompactMenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FilteredItemsView({ filteredItems }: { filteredItems: MenuItem[] }) {
  const { stats, clearAllFilters, selectedCategory } = useFilters();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredItems.length > 0 ? (
        
        filteredItems
          .filter(item => (item as MenuItem & { is_available?: boolean }).is_available !== false)
          .map((item) => (
          <CompactMenuItemCard key={item.id} item={item} />
        ))
      ) : (
        <div className="col-span-full text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-semibold text-stone-700 mb-2">Aucun plat trouvé</h3>
          <p className="text-stone-500 mb-6">
            {stats.hasActiveFilters
              ? `Aucun plat ne correspond à vos critères de recherche dans la catégorie ${selectedCategory}.`
              : `Aucun plat disponible dans la catégorie ${selectedCategory}.`}
          </p>
          {stats.hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Effacer tous les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}