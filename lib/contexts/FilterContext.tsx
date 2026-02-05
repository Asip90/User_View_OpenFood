"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { Category, MenuItem } from "@/lib/types";

interface FilterContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceFilter: string;
  setPriceFilter: (filter: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (filter: string) => void;
  showCategories: boolean;
  setShowCategories: (show: boolean) => void;
  clearAllFilters: () => void;
  normalizeString: (str: string) => string;
  getCategoryItems: (categoryName: string) => MenuItem[];
  getCategoryCount: (categoryName: string) => number;
  filteredItems: MenuItem[];
  stats: {
    activeFilters: number;
    totalItems: number;
    filteredCount: number;
    hasActiveFilters: boolean;
  };
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ 
  children,
  allMenuItems,
  categories
}: { 
  children: ReactNode;
  allMenuItems: MenuItem[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [showCategories, setShowCategories] = useState<boolean>(false);

  // Fonction pour normaliser les chaînes de recherche
  const normalizeString = useCallback((str: string): string => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }, []);

  // Fonction pour effacer tous les filtres
  const clearAllFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceFilter('all');
    setAvailabilityFilter('all');
    setShowCategories(false);
  }, []);

  // Fonction pour obtenir les items d'une catégorie spécifique
  const getCategoryItems = useCallback((categoryName: string): MenuItem[] => {
    if (categoryName === 'all') return allMenuItems;
    const category = categories.find(cat => cat.name === categoryName);
    return category?.items || [];
  }, [categories, allMenuItems]);

  // Fonction pour obtenir le nombre d'éléments par catégorie
  const getCategoryCount = useCallback((categoryName: string): number => {
    if (categoryName === 'all') return allMenuItems.length;
    const category = categories.find(cat => cat.name === categoryName);
    return category?.items.length || 0;
  }, [categories, allMenuItems]);

  // Filtrer les éléments par catégorie, recherche, prix et disponibilité
  const filteredItems = useMemo(() => {
    let baseItems = getCategoryItems(selectedCategory);
    
    // Appliquer le filtre de recherche
    if (searchQuery.trim() !== "") {
      const normalizedQuery = normalizeString(searchQuery);
      baseItems = baseItems.filter(item => {
        const normalizedName = normalizeString(item.name);
        const normalizedDescription = item.description ? normalizeString(item.description) : "";
        
        return normalizedName.includes(normalizedQuery) ||
               normalizedDescription.includes(normalizedQuery);
      });
    }
    
    // Appliquer le filtre par prix
    if (priceFilter !== 'all') {
      baseItems = baseItems.filter(item => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        switch(priceFilter) {
          case 'under500': return price < 500;
          case '500-1000': return price >= 500 && price <= 1000;
          case '1000-2000': return price > 1000 && price <= 2000;
          case 'over2000': return price > 2000;
          default: return true;
        }
      });
    }
    
    // Appliquer le filtre par disponibilité
    if (availabilityFilter !== 'all') {
      baseItems = baseItems.filter(item => {
        const hasAvailability = 'is_available' in item;
        if (!hasAvailability) return true;
        
        const isAvailable = (item as MenuItem & { is_available?: boolean }).is_available !== false;
        return availabilityFilter === 'available' ? isAvailable : !isAvailable;
      });
    }
    
    return baseItems;
  }, [selectedCategory, searchQuery, priceFilter, availabilityFilter, getCategoryItems, normalizeString]);

  // Statistiques pour affichage
  const stats = useMemo(() => {
    const activeFilters = [
      selectedCategory !== 'all',
      searchQuery.trim() !== "",
      priceFilter !== 'all',
      availabilityFilter !== 'all'
    ].filter(Boolean).length;

    return {
      activeFilters,
      totalItems: allMenuItems.length,
      filteredCount: filteredItems.length,
      hasActiveFilters: activeFilters > 0
    };
  }, [selectedCategory, searchQuery, priceFilter, availabilityFilter, allMenuItems.length, filteredItems.length]);

  const value: FilterContextType = {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceFilter,
    setPriceFilter,
    availabilityFilter,
    setAvailabilityFilter,
    showCategories,
    setShowCategories,
    clearAllFilters,
    normalizeString,
    getCategoryItems,
    getCategoryCount,
    filteredItems,
    stats
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}