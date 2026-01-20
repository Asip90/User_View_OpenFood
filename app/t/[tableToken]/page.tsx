'use client'

import { useState, useEffect, useContext, useMemo } from "react"
import { useParams } from "next/navigation"
import { fetchMenu } from "@/lib/services/api"
import { CartProvider, CartContext } from "@/lib/cart-context"
import CartPanel from "@/components/CartPanel"
import { MenuData, MenuItem } from "@/lib/types"
import { Plus, Minus, UtensilsCrossed, Search, Filter, ChevronRight, Check } from "lucide-react"
import Hero from "@/components/Header"
import Navbar from "@/components/NavBar"
import Footer from "@/components/Footer"

export default function MenuPage() {
  const { tableToken } = useParams<{ tableToken: string }>()
  const [loading, setLoading] = useState<boolean>(() => !!tableToken);
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [orderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in')
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showCategories, setShowCategories] = useState<boolean>(false)

  const menuItems = useMemo(() => menuData?.menuItems || [], [menuData])
  const categories = useMemo(() => menuData?.categories || [], [menuData])
  const restaurant = menuData?.restaurant

  // Filtrer les éléments par catégorie ET recherche
  const filteredItems = useMemo(() => {
    let filtered = menuItems
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category_name === selectedCategory)
    }
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category_name?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [selectedCategory, menuItems, searchQuery])

  useEffect(() => {
    if (!tableToken) return;

    fetchMenu(tableToken)
      .then((data: MenuData) => {
        setMenuData(data)
        if (data.customization) {
          const root = document.documentElement
          root.style.setProperty('--color-primary', data.customization.primary_color)
          root.style.setProperty('--color-secondary', data.customization.secondary_color)
          root.style.setProperty('--font-family', data.customization.font_family || 'Inter')
        }
      })
      .catch((err) => {
        console.error("Erreur de récupération du menu:", err);
        setLoading(false);
      })
      .finally(() => setLoading(false))
  }, [tableToken])

  if (loading) return <LoadingScreen />
  if (!menuData || !restaurant) return <NotFoundScreen />

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 text-stone-900" 
           style={{ fontFamily: 'var(--font-family), sans-serif' }}>
        <Navbar restaurant={restaurant}/>
        
        <main className="max-w-7xl mx-auto px-4 pb-40">
          {/* Hero réduit */}
          <Hero restaurant={restaurant} table={menuData.table} customization={menuData.customization} />
          <div className="py-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
              Notre Carte Gastronomique
            </h1>
            <p className="text-stone-600">
              Découvrez toutes nos créations culinaires
            </p>
          </div>

          {/* Barre de recherche et filtres - Inspirée des captures */}
          <div className="sticky top-[70px] z-40 bg-white/90 backdrop-blur-lg py-4 -mx-4 px-4 mb-6 border-b border-stone-200">
            <div className="max-w-7xl mx-auto">
              {/* Barre de recherche */}
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un plat, un ingrédient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              {/* Catégories avec design compact */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  <Filter className="w-4 h-4" />
                  Catégories
                </button>
                
                {/* Catégories principales toujours visibles */}
                <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all ${
                      selectedCategory === 'all' 
                        ? 'bg-primary text-white font-semibold' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Tous les plats
                  </button>
                  
                  {categories.slice(0, 4).map(cat => {
                    const count = menuItems.filter(item => item.category_name === cat.name).length
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                          selectedCategory === cat.name 
                            ? 'bg-primary text-white font-semibold' 
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {cat.name}
                        <span className="text-xs opacity-80">({count})</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Catégories déroulantes si beaucoup */}
              {showCategories && categories.length > 4 && (
                <div className="mt-4 pt-4 border-t border-stone-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {categories.slice(4).map(cat => {
                      const count = menuItems.filter(item => item.category_name === cat.name).length
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.name)
                            setShowCategories(false)
                          }}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            selectedCategory === cat.name 
                              ? 'bg-primary/10 text-primary border border-primary/20' 
                              : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-xs opacity-70 ml-1">({count})</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
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

          {/* Grid compacte des plats */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredItems.map((item) => (
                <CompactMenuItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">Aucun plat trouvé</h3>
              <p className="text-stone-500">
                {searchQuery 
                  ? `Aucun résultat pour "${searchQuery}". Essayez avec d'autres termes.`
                  : "Aucun plat disponible dans cette catégorie."}
              </p>
            </div>
          )}
        </main>

        <CartPanel orderType={orderType} tableToken={tableToken} />
        <Footer restaurant={restaurant} />
      </div>
    </CartProvider>
  )
}

// Importez votre contexte et types ici...

function CompactMenuItemCard({ item }: { item: MenuItem }) {
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

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div className="flex p-3 gap-4 h-full">
        
        {/* COLONNE GAUCHE : Image (Carrée et fixe) */}
        <div className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden relative">
          <img
            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* COLONNE DROITE : Contenu structuré en Flex Column pour pousser le bouton en bas */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          
          {/* HAUT : Titre et Prix */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-stone-900 text-lg leading-tight line-clamp-2 pr-2">
              {item.name}
            </h3>
            <div className="text-lg font-bold text-primary whitespace-nowrap">
              {displayPrice} €
            </div>
          </div>

          {/* MILIEU : Description et Catégorie */}
          <div className="mb-3">
             {/* Petite description coupée à 2 lignes */}
            <p className="text-sm text-stone-500 line-clamp-2 leading-snug mb-1">
              {item.description || "Ingrédients frais et préparation maison."}
            </p>
            <span className="hidden sm:inline-block text-[10px] text-stone-400 uppercase tracking-wider font-medium">
              {item.category_name}
            </span>
          </div>

          {/* BAS : Temps et Bouton d'action */}
          <div className="flex items-center justify-between mt-auto">
            {/* Temps de préparation (comme sur l'image) */}
            <div className="flex items-center text-stone-400 text-xs sm:text-sm">
              <span className='mr-1'>10-12 min</span> {/* Vous pouvez rendre ce chiffre dynamique si dispo */}
            </div>

            {/* Zone du bouton (À droite) */}
            <div className="flex-shrink-0">
              {quantity === 0 ? (
                // Bouton "Ajouter" simple (Style similaire à "Voir détails" mais orange)
                <button
                  onClick={() => addItem(item)}
                  className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-1"
                >
                  <span>Ajouter</span>
                  {/* Optionnel : icône plus */}
                  {/* <Plus className="w-4 h-4" /> */}
                </button>
              ) : (
                // Contrôleur de quantité (Remplace le bouton quand item ajouté)
                <div className="flex items-center bg-stone-100 rounded-lg p-1 shadow-inner">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-stone-600 shadow-sm hover:text-orange-600 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  
                  <span className="w-8 text-center font-bold text-stone-800 text-sm">
                    {quantity}
                  </span>
                  
                  <button 
                    onClick={() => addItem(item)}
                    className="w-7 h-7 flex items-center justify-center bg-secondary rounded-md text-white shadow-sm hover:bg-primary transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 via-white to-primary/5">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
          <div className="absolute inset-8 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 animate-spin-slow"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
      </div>
      <p className="mt-8 text-lg font-semibold text-stone-700">
        Chargement du menu...
      </p>
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}

function NotFoundScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 via-white to-primary/5 p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 animate-pulse"></div>
          <div className="absolute inset-6 rounded-full bg-white shadow-lg flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-stone-300" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-stone-800">
            Menu inaccessible
          </h2>
          <p className="text-stone-500">
            Nous {`n'`}avons pas pu charger le menu. Veuillez vérifier votre connexion ou contacter le serveur.
          </p>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-semibold hover:shadow-lg transition-all duration-300"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}