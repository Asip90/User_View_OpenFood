// 'use client'

// import { useState, useEffect, useContext, useMemo, useCallback } from "react"
// import { useParams } from "next/navigation"
// import { fetchMenu } from "@/lib/services/api"
// import { CartProvider, CartContext } from "@/lib/cart-context"
// import CartPanel from "@/components/CartPanel"
// import { MenuData, MenuItem, Category } from "@/lib/types"
// import { Plus, Minus, UtensilsCrossed, Search, Filter, X, Clock, Tag, Star } from "lucide-react"
// import Hero from "@/components/Header"
// import Navbar from "@/components/NavBar"
// import Footer from "@/components/Footer"

// export default function MenuPage() {
//   const { tableToken } = useParams<{ tableToken: string }>()
//   const [loading, setLoading] = useState<boolean>(() => !!tableToken);
//   const [menuData, setMenuData] = useState<MenuData | null>(null)
//   const [selectedCategory, setSelectedCategory] = useState<string>('all')
//   const [orderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in')
//   const [searchQuery, setSearchQuery] = useState<string>("")
//   const [showCategories, setShowCategories] = useState<boolean>(false)
//   const [priceFilter, setPriceFilter] = useState<string>('all')
//   const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')

//   const categories = useMemo(() => menuData?.categories || [], [menuData])
//   const restaurant = menuData?.restaurant

//   // Récupérer tous les items de toutes les catégories
//   const allMenuItems = useMemo(() => {
//     if (!categories.length) return []
//     return categories.reduce((acc: MenuItem[], category) => {
//       return [...acc, ...category.items]
//     }, [])
//   }, [categories])

//   // Fonction pour normaliser les chaînes de recherche (ignore accents et case)
//   const normalizeString = (str: string): string => {
//     return str
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "")
//       .toLowerCase()
//       .trim()
//   }

//   // Fonction pour effacer tous les filtres
//   const clearAllFilters = useCallback(() => {
//     setSelectedCategory('all')
//     setSearchQuery('')
//     setPriceFilter('all')
//     setAvailabilityFilter('all')
//     setShowCategories(false)
//   }, [])

//   // Fonction pour obtenir les items d'une catégorie spécifique
//   const getCategoryItems = useCallback((categoryName: string) => {
//     if (categoryName === 'all') return allMenuItems
//     const category = categories.find(cat => cat.name === categoryName)
//     return category?.items || []
//   }, [categories, allMenuItems])

//   // Fonction pour obtenir le nombre d'éléments par catégorie
//   const getCategoryCount = useCallback((categoryName: string) => {
//     if (categoryName === 'all') return allMenuItems.length
//     const category = categories.find(cat => cat.name === categoryName)
//     return category?.items.length || 0
//   }, [categories, allMenuItems])

//   // Filtrer les éléments par catégorie, recherche, prix et disponibilité
//   const filteredItems = useMemo(() => {
//     // D'abord, obtenir les items de la catégorie sélectionnée
//     let baseItems = getCategoryItems(selectedCategory)
    
//     // Appliquer le filtre de recherche
//     if (searchQuery.trim() !== "") {
//       const normalizedQuery = normalizeString(searchQuery)
//       baseItems = baseItems.filter(item => {
//         const normalizedName = normalizeString(item.name)
//         const normalizedDescription = item.description ? normalizeString(item.description) : ""
        
//         return normalizedName.includes(normalizedQuery) ||
//                normalizedDescription.includes(normalizedQuery)
//       })
//     }
    
//     // Appliquer le filtre par prix
//     if (priceFilter !== 'all') {
//       baseItems = baseItems.filter(item => {
//         const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
//         switch(priceFilter) {
//           case 'under500': return price < 500
//           case '500-1000': return price >= 500 && price <= 1000
//           case '1000-2000': return price > 1000 && price <= 2000
//           case 'over2000': return price > 2000
//           default: return true
//         }
//       })
//     }
    
//     // Appliquer le filtre par disponibilité
//     if (availabilityFilter !== 'all') {
//       baseItems = baseItems.filter(item => {
//         // Vérifier si la propriété is_available existe
//         const hasAvailability = 'is_available' in item
//         if (!hasAvailability) return true // Si pas de info, on garde l'item
        
//         const isAvailable = (item as MenuItem & { is_available?: boolean }).is_available !== false
//         return availabilityFilter === 'available' ? isAvailable : !isAvailable
//       })
//     }
    
//     return baseItems
//   }, [selectedCategory, searchQuery, priceFilter, availabilityFilter, getCategoryItems])

//   // Statistiques pour affichage
//   const stats = useMemo(() => {
//     const activeFilters = [
//       selectedCategory !== 'all',
//       searchQuery.trim() !== "",
//       priceFilter !== 'all',
//       availabilityFilter !== 'all'
//     ].filter(Boolean).length

//     return {
//       activeFilters,
//       totalItems: allMenuItems.length,
//       filteredCount: filteredItems.length,
//       hasActiveFilters: activeFilters > 0
//     }
//   }, [selectedCategory, searchQuery, priceFilter, availabilityFilter, allMenuItems.length, filteredItems.length])

//   useEffect(() => {
//     if (!tableToken) return;

//     fetchMenu(tableToken)
//       .then((data: MenuData) => {
//         setMenuData(data)
//         if (data.customization) {
//           const root = document.documentElement
//           root.style.setProperty('--color-primary', data.customization.primary_color)
//           root.style.setProperty('--color-secondary', data.customization.secondary_color)
//           root.style.setProperty('--font-family', data.customization.font_family || 'Inter')
//         }
//       })
//       .catch((err) => {
//         console.error("Erreur de récupération du menu:", err);
//         setLoading(false);
//       })
//       .finally(() => setLoading(false))
//   }, [tableToken])

//   if (loading) return <LoadingScreen />
//   if (!menuData || !restaurant) return <NotFoundScreen />

//   return (
    
//     <CartProvider>
//       <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 text-stone-900" 
//            style={{ fontFamily: 'var(--font-family), sans-serif' }}>
//         <Navbar restaurant={restaurant}/>
        
//         <main className="max-w-7xl mx-auto px-4 pb-40">
//           {/* Hero réduit */}
//           <Hero restaurant={restaurant} table={menuData.table} customization={menuData.customization} />
          
//           {/* En-tête avec statistiques */}
//           <div className="py-6 mb-6">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
//                   Notre Carte Gastronomique
//                 </h1>
//                 <p className="text-stone-600">
//                   {stats.filteredCount} plat{stats.filteredCount > 1 ? 's' : ''} disponible{stats.filteredCount > 1 ? 's' : ''}
//                   {stats.activeFilters > 0 && ` (${stats.filteredCount} résultat${stats.filteredCount > 1 ? 's' : ''})`}
//                 </p>
//               </div>
              
//               {stats.hasActiveFilters && (
//                 <button
//                   onClick={clearAllFilters}
//                   className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                   Effacer tous les filtres
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Barre de recherche et filtres améliorée */}
//           <div className="sticky top-[70px] z-40 bg-white/95 backdrop-blur-lg py-4 -mx-4 px-4 mb-6 border-b border-stone-200 shadow-sm">
//             <div className="max-w-7xl mx-auto space-y-4">
//               {/* Barre de recherche avec bouton effacer */}
//               <div className="relative">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
//                   <Search className="w-5 h-5" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Rechercher un plat, un ingrédient, une catégorie..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-12 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
//                 />
//                 {searchQuery && (
//                   <button
//                     onClick={() => setSearchQuery('')}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>

//               {/* Filtres principaux en ligne */}
//               <div className="flex flex-wrap items-center gap-3">
//                 {/* Bouton catégories */}
//                 <div className="relative">
//                   <button 
//                     onClick={() => setShowCategories(!showCategories)}
//                     className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
//                       selectedCategory !== 'all'
//                         ? 'bg-primary/10 text-primary border-primary/30'
//                         : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
//                     }`}
//                   >
//                     <Filter className="w-4 h-4" />
//                     {selectedCategory === 'all' ? 'Catégories' : selectedCategory}
//                     {selectedCategory !== 'all' && (
//                       <span className="ml-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
//                         {getCategoryCount(selectedCategory)}
//                       </span>
//                     )}
//                   </button>
//                 </div>
                
//                 {/* Filtre par prix */}
//                 <div className="relative">
//                   <select
//                     value={priceFilter}
//                     onChange={(e) => setPriceFilter(e.target.value)}
//                     className="appearance-none px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-10"
//                   >
//                     <option value="all">Tous les prix</option>
//                     <option value="under500">Moins de 500 FCFA</option>
//                     <option value="500-1000">500 - 1000 FCFA</option>
//                     <option value="1000-2000">1000 - 2000 FCFA</option>
//                     <option value="over2000">Plus de 2000 FCFA</option>
//                   </select>
//                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                     <Clock className="w-4 h-4 text-stone-400" />
//                   </div>
//                 </div>
                
//                 {/* Filtre par disponibilité (si applicable) */}
//                 {allMenuItems.some(item => 'is_available' in item) && (
//                   <div className="relative">
//                     <select
//                       value={availabilityFilter}
//                       onChange={(e) => setAvailabilityFilter(e.target.value)}
//                       className="appearance-none px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-10"
//                     >
//                       <option value="all">Tous les statuts</option>
//                       <option value="available">Disponible</option>
//                       <option value="unavailable">Indisponible</option>
//                     </select>
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <Tag className="w-4 h-4 text-stone-400" />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Panneau des catégories déroulant */}
//               {showCategories && (
//                 <div className="mt-4 p-4 bg-white border border-stone-200 rounded-xl shadow-lg">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-medium text-stone-900">Sélectionnez une catégorie</h3>
//                     <button 
//                       onClick={() => setShowCategories(false)}
//                       className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
//                     >
//                       <X className="w-4 h-4 text-stone-500" />
//                     </button>
//                   </div>
                  
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//                     <button
//                       onClick={() => {
//                         setSelectedCategory('all')
//                         setShowCategories(false)
//                       }}
//                       className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
//                         selectedCategory === 'all'
//                           ? 'bg-primary text-white'
//                           : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span>Tous les plats</span>
//                         <span className="text-xs opacity-80">{allMenuItems.length}</span>
//                       </div>
//                     </button>
                    
//                     {categories.map(cat => {
//                       const count = cat.items.length
//                       if (count === 0) return null
                      
//                       return (
//                         <button
//                           key={cat.id}
//                           onClick={() => {
//                             setSelectedCategory(cat.name)
//                             setShowCategories(false)
//                           }}
//                           className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
//                             selectedCategory === cat.name
//                               ? 'bg-primary text-white'
//                               : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
//                           }`}
//                         >
//                           <div className="flex items-center justify-between">
//                             <span className="truncate">{cat.name}</span>
//                             <span className="text-xs opacity-80">{count}</span>
//                           </div>
//                         </button>
//                       )
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Indicateurs de filtres actifs */}
//           {stats.hasActiveFilters && (
//             <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="text-sm text-stone-600 font-medium">Filtres actifs :</span>
                
//                 {selectedCategory !== 'all' && (
//                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
//                     Catégorie: {selectedCategory}
//                     <button 
//                       onClick={() => setSelectedCategory('all')}
//                       className="ml-1 hover:bg-primary/20 p-0.5 rounded-full"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 )}
                
//                 {searchQuery && (
//                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-200 text-stone-700 rounded-full text-sm">
//                     Recherche: {`"`}{searchQuery}{`"`}
//                     <button 
//                       onClick={() => setSearchQuery('')}
//                       className="ml-1 hover:bg-stone-300 p-0.5 rounded-full"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 )}
                
//                 {priceFilter !== 'all' && (
//                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
//                     Prix: {{
//                       'under500': '< 500 FCFA',
//                       '500-1000': '500-1000 FCFA',
//                       '1000-2000': '1000-2000 FCFA',
//                       'over2000': '> 2000 FCFA'
//                     }[priceFilter]}
//                     <button 
//                       onClick={() => setPriceFilter('all')}
//                       className="ml-1 hover:bg-blue-100 p-0.5 rounded-full"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 )}
                
//                 {availabilityFilter !== 'all' && (
//                   <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
//                     {availabilityFilter === 'available' ? 'Disponible' : 'Indisponible'}
//                     <button 
//                       onClick={() => setAvailabilityFilter('all')}
//                       className="ml-1 hover:bg-green-100 p-0.5 rounded-full"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Résultats de recherche */}
//           {searchQuery && (
//             <div className="mb-6">
//               <p className="text-stone-600">
//                 {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''} pour {`"`}{searchQuery}{`"`}
//               </p>
//             </div>
//           )}

//           {/* Afficher les catégories ou les items filtrés */}
//           {selectedCategory === 'all' ? (
//             // Afficher par catégories
//             <div className="space-y-8">
//               {categories.map(category => {
//                 // Filtrer les items de cette catégorie selon les critères
//                 const categoryItems = category.items.filter(item => {
//                   let include = true
                  
//                   // Filtre par recherche
//                   if (searchQuery.trim() !== "") {
//                     const normalizedQuery = normalizeString(searchQuery)
//                     const normalizedName = normalizeString(item.name)
//                     const normalizedDescription = item.description ? normalizeString(item.description) : ""
                    
//                     include = include && (normalizedName.includes(normalizedQuery) ||
//                              normalizedDescription.includes(normalizedQuery))
//                   }
                  
//                   // Filtre par prix
//                   if (priceFilter !== 'all') {
//                     const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
//                     switch(priceFilter) {
//                       case 'under500': include = include && price < 500; break
//                       case '500-1000': include = include && price >= 500 && price <= 1000; break
//                       case '1000-2000': include = include && price > 1000 && price <= 2000; break
//                       case 'over2000': include = include && price > 2000; break
//                     }
//                   }
                  
//                   // Filtre par disponibilité
//                   if (availabilityFilter !== 'all' && 'is_available' in item) {
//                     const isAvailable = (item as MenuItem & { is_available?: boolean }).is_available !== false
//                     include = include && (availabilityFilter === 'available' ? isAvailable : !isAvailable)
//                   }
                  
//                   return include
//                 })
                
//                 if (categoryItems.length === 0) return null
                
//                 return (
//                   <div key={category.id} className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-3 h-6 bg-primary rounded-full" />
//                       <h2 className="text-xl font-bold text-stone-900">{category.name}</h2>
//                       <span className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
//                         {categoryItems.length} plat{categoryItems.length > 1 ? 's' : ''}
//                       </span>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//                       {categoryItems.map((item) => (
//                         <CompactMenuItemCard key={item.id} item={item} />
//                       ))}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           ) : (
//             // Afficher les items filtrés de la catégorie sélectionnée
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//               {filteredItems.length > 0 ? (
//                 filteredItems.map((item) => (
//                   <CompactMenuItemCard key={item.id} item={item} />
//                 ))
//               ) : (
//                 <div className="col-span-full text-center py-16">
//                   <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
//                     <UtensilsCrossed className="w-8 h-8 text-stone-400" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-stone-700 mb-2">Aucun plat trouvé</h3>
//                   <p className="text-stone-500 mb-6">
//                     {stats.hasActiveFilters
//                       ? `Aucun plat ne correspond à vos critères de recherche dans la catégorie ${selectedCategory}.`
//                       : `Aucun plat disponible dans la catégorie ${selectedCategory}.`}
//                   </p>
//                   {stats.hasActiveFilters && (
//                     <button
//                       onClick={clearAllFilters}
//                       className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
//                     >
//                       Effacer tous les filtres
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </main>

//         <CartPanel orderType={orderType} tableToken={tableToken} />
//         <Footer restaurant={restaurant} />
//       </div>
//     </CartProvider>
//   )
// }

// function CompactMenuItemCard({ item }: { item: MenuItem }) {
//   const [showModal, setShowModal] = useState(false)
//   // console.log("Rendering item:", item);
//   const cartContext = useContext(CartContext);
//   if (!cartContext) return null;
//   const { cart, addItem, removeItem } = cartContext;
//   const quantity = cart[item.id]?.quantity || 0;

//   // Formatage du prix
//   const priceValue = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
//   const displayPrice = isNaN(priceValue) ? "0,00" : priceValue.toLocaleString('fr-FR', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   });

//   // Vérifier la disponibilité
//   const hasAvailability = 'is_available' in item
//   const isAvailable = hasAvailability ? (item as MenuItem & { is_available?: boolean }).is_available !== false : true

//   return (
//     <div className={`group bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative ${
//       !isAvailable ? 'opacity-70 border-stone-300' : 'border-stone-200'
//     }`}>
//       {!isAvailable && (
//         <div className="absolute top-3 right-3 z-10">
//           <span className="px-3 py-1 bg-stone-200 text-stone-700 text-xs font-medium rounded-full">
//             Indisponible
//           </span>
//         </div>
//       )}
      
//       <div className="flex p-3 gap-4 h-full">
//         {/* COLONNE GAUCHE : Image */}
//         <div className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden relative">
//           <div className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden relative cursor-pointer" onClick={() => setShowModal(true)}
//           >
//             <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//           </div>
//         </div>

//         {/* COLONNE DROITE : Contenu */}
//         <div className="flex-1 flex flex-col justify-between min-w-0">
//           {/* HAUT : Titre et Prix */}
//           <div className="flex justify-between items-start mb-1">
//             <h4 className="font-bold text-stone-900 text-lg leading-tight line-clamp-2 pr-2">
//               {item.name}
//             </h4>
//             <div className="text-lg font-bold text-primary whitespace-nowrap">
//               {displayPrice} F
//             </div>
//           </div>

//           {/* MILIEU : Description */}
//           <div className="mb-3">
//             <p className="text-sm text-stone-500 line-clamp-2 leading-snug mb-1">
//               {item.description || "Ingrédients frais et préparation maison."}
//             </p>
//             {'is_popular' in item && (item as MenuItem & { is_popular?: boolean }).is_popular && (
//               <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full">
//                 <Star className="w-3 h-3 fill-yellow-500" />
//                 Populaire
//               </span>
//             )}
//           </div>

//           {/* BAS : Actions */}
//           <div className="flex items-center justify-between mt-auto">
//             {/* Temps de préparation */}
//             <div className="flex items-center text-stone-400 text-xs sm:text-sm">
//               <Clock className="w-4 h-4 mr-1" />
//               <span>{item.preparation_time || 10}-{item.preparation_time ? item.preparation_time + 5 : 15} min</span>
//             </div>

//             {/* Bouton d'action */}
//             <div className="flex-shrink-0">
//               {!isAvailable ? (
//                 <button
//                   disabled
//                   className="px-4 py-2 bg-stone-100 text-stone-400 text-sm font-medium rounded-lg cursor-not-allowed"
//                 >
//                   Indisponible
//                 </button>
//               ) : quantity === 0 ? (
//                 <button
//                   onClick={() => addItem(item)}
//                   className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
//                 >
//                   Ajouter
//                 </button>
//               ) : (
//                 <div className="flex items-center bg-stone-100 rounded-lg p-1 shadow-inner">
//                   <button 
//                     onClick={() => removeItem(item.id)}
//                     className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-stone-600 shadow-sm hover:text-red-600 transition-colors"
//                   >
//                     <Minus className="w-3 h-3" />
//                   </button>
                  
//                   <span className="w-8 text-center font-bold text-stone-800 text-sm">
//                     {quantity}
//                   </span>
                  
//                   <button 
//                     onClick={() => addItem(item)}
//                     className="w-7 h-7 flex items-center justify-center bg-secondary rounded-md text-white shadow-sm hover:bg-secondary/90 transition-colors"
//                   >
//                     <Plus className="w-3 h-3" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//        {/* Modale */}
//       {showModal && <MenuItemModal item={item} onClose={() => setShowModal(false)}  />}
//     </div>
//   );
// }

// function MenuItemModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
//   // const [showModal, setShowModal] = useState(false)
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
//         {/* Bouton fermer */}
//         <button 
//           onClick={onClose} 
//           className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
//         >
//           <div className="bg-black rounded-full"><X size={20} color="white"/></div>
//         </button>

//         {/* Image */}
//         <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
//           <img 
//             src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"} 
//             alt={item.name} 
//             className="w-full h-full object-cover" 
//           />
//         </div>

//         {/* Infos */}
//         <h2 className="text-xl font-bold text-stone-900 mb-2">{item.name}</h2>
//         <p className="text-stone-600 mb-4">{item.description || "Ingrédients frais et préparation maison."}</p>

//         <div className="flex justify-between items-center mb-4">
//           <span className="text-lg font-bold text-primary">{item.price} F</span>
//           <span className="flex items-center text-stone-400 text-sm">
//             <Clock className="w-4 h-4 mr-1" />
//             {item.preparation_time || "10-15 min"}
//           </span>
//         </div>

//         {/* Badge populaire */}
//         {'is_popular' in item && (item as MenuItem & { is_popular?: boolean }).is_popular && (
//           <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full mb-4">
//             <Star className="w-3 h-3 fill-yellow-500" />
//             Populaire
//           </span>
//         )}
//       </div>
//     </div>
//   )
// }



// function LoadingScreen() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white">
//       {/* Loader minimaliste */}
//       <div className="relative w-20 h-20 flex items-center justify-center">
//         <div className="absolute w-full h-full rounded-full border-2 border-stone-200 animate-spin" />
//         <UtensilsCrossed className="w-8 h-8 text-primary animate-pulse" />
//       </div>

//       {/* Texte */}
//       <p className="mt-6 text-sm font-medium text-stone-600">
//         Chargement du menu...
//       </p>
//     </div>
//   )
// }

// function NotFoundScreen() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
//       <div className="max-w-sm text-center space-y-6">
        
//         {/* Icône dans un container glassmorphism */}
//         <div className="w-20 h-20 mx-auto rounded-xl bg-white/70 backdrop-blur-md border border-stone-200 flex items-center justify-center">
//           <UtensilsCrossed className="w-10 h-10 text-stone-400" />
//         </div>

//         {/* Texte */}
//         <div className="space-y-2">
//           <h2 className="text-xl font-semibold text-stone-900">
//             Menu inaccessible
//           </h2>
//           <p className="text-sm text-stone-500 leading-relaxed">
//             Impossible de charger le menu. Vérifiez votre connexion ou contactez le serveur.
//           </p>
//         </div>

//         {/* Bouton moderne */}
//         <button 
//           onClick={() => window.location.reload()}
//           className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
//         >
//           Réessayer
//         </button>
//       </div>
//     </div>
//   )
// }
"use client";

import { useParams } from "next/navigation";
import { CartProvider } from "@/lib/cart-context";
import { MenuProvider } from "@/lib/contexts/MenuContext";
import { FilterProvider } from "@/lib/contexts/FilterContext";
import { MenuContent } from "@/components/menu/MenuContent";
import { SearchAndFilters } from "@/components/menu/SearchAndFilters";
import { ActiveFilters } from "@/components/menu/ActiveFilters";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Hero from "@/components/Header";
import CartPanel from "@/components/CartPanel";
import LoadingScreen from "@/components/ui/LoadingScreen";
import NotFoundScreen from "@/components/ui/NotFound";
import { useMenu } from "@/lib/contexts/MenuContext";

export default function MenuPage() {
  const { tableToken } = useParams<{ tableToken: string }>();
  
  if (!tableToken) return null;

  return (
    <MenuProvider tableToken={tableToken}>
      <MenuContentWrapper tableToken={tableToken} />
    </MenuProvider>
  );
}

function MenuContentWrapper({ tableToken }: { tableToken: string }) {
  const { loading, menuData, restaurant, allMenuItems, categories } = useMenu();

  if (loading) return <LoadingScreen />;
  if (!menuData || !restaurant) return <NotFoundScreen />;

  return (
    <CartProvider>
      <FilterProvider allMenuItems={allMenuItems} categories={categories}>
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 text-stone-900" 
             style={{ fontFamily: 'var(--font-family), sans-serif' }}>
          <Navbar restaurant={restaurant} />
          
          <main className="max-w-7xl mx-auto px-4 pb-40">
            {/* Hero réduit */}
            <Hero restaurant={restaurant} table={menuData.table} customization={menuData.customization} />
            
            <SearchAndFilters />
            <ActiveFilters />
            <MenuContent />
          </main>

          <CartPanel orderType="dine_in" tableToken={tableToken} />
          <Footer restaurant={restaurant} />
        </div>
      </FilterProvider>
    </CartProvider>
  );
}