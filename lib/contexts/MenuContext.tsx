"use client";
// import React , {} from "react";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchMenu } from "@/lib/services/api";
import { MenuData, MenuItem, Category } from "@/lib/types";

interface MenuContextType {
  menuData: MenuData | null;
  loading: boolean;
  restaurant: MenuData["restaurant"] | null;
  customization: MenuData["customization"] | null;
  table: MenuData["table"] | null;
  categories: Category[];
  allMenuItems: MenuItem[];
  fetchMenuData: (token: string) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ 
  children, 
  tableToken 
}: { 
  children: ReactNode; 
  tableToken: string;
}) {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMenuData = async (token: string) => {
    try {
      const data = await fetchMenu(token);
      setMenuData(data);
      
      if (data.customization) {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', data.customization.primary_color);
        root.style.setProperty('--color-secondary', data.customization.secondary_color);
        root.style.setProperty('--font-family', data.customization.font_family || 'Inter');
      }
    } catch (err) {
      console.error("Erreur de récupération du menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tableToken) {
      fetchMenuData(tableToken);
    }
  }, [tableToken]);

  const value: MenuContextType = {
    menuData,
    loading,
    restaurant: menuData?.restaurant || null,
    customization: menuData?.customization || null,
    table: menuData?.table || null,
    categories: menuData?.categories || [],
    allMenuItems: menuData?.categories?.reduce((acc: MenuItem[], category) => 
      [...acc, ...category.items], []) || [],
    fetchMenuData
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}