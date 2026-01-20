'use client'

import { useContext, useState, useCallback, useMemo, useEffect } from "react"
import { CartContext, CartItem } from "@/lib/cart-context"
import { ShoppingBag, X, Plus, Minus, CreditCard, ChevronRight, UtensilsCrossed, Truck, PackageCheck, MessageSquare, Shield, Clock, CheckCircle } from "lucide-react"

interface CartPanelProps {
  orderType: 'dine_in' | 'takeaway' | 'delivery'
  tableToken: string 
}

interface CustomerInfo {
  name: string
  phone: string
  email: string
  note: string
}

type OrderType = 'dine_in' | 'takeaway' | 'delivery'

export default function CartPanel({ orderType: initialOrderType, tableToken }: CartPanelProps) {
  const cartContext = useContext(CartContext)
  
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false)
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>(initialOrderType)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<boolean>(false)
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    note: ''
  })
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({})
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://le-luxury-house.localhost:8000/api/customer';

  const items = useMemo(() => {
    if (!cartContext) return []
    return Object.values(cartContext.cart)
  }, [cartContext])

  const totalItems = useMemo(() => 
    items.reduce((acc, item) => acc + item.quantity, 0)
  , [items])

  const subtotal = useMemo(() => 
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  , [items])

  const deliveryFee = useMemo(() => 
    selectedOrderType === 'delivery' ? 1500 : 0
  , [selectedOrderType])

  const total = useMemo(() => 
    subtotal + deliveryFee
  , [subtotal, deliveryFee])

  useEffect(() => {
    if (showSuccessAnimation) {
      const timer = setTimeout(() => setShowSuccessAnimation(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessAnimation])

  const handleInputChange = useCallback((field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => ({ ...prev, [field]: undefined }))
  }, [])

  if (!cartContext) return null

  const { addItem, removeItem, clearCart } = cartContext

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CustomerInfo, string>> = {}
    if (!customerInfo.name.trim()) errors.name = "Le nom est requis"
    if (!customerInfo.phone.trim()) {
      errors.phone = "Le numéro est requis"
    } else if (!/^[0-9+]{8,15}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      errors.phone = "Numéro invalide"
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitOrder = async () => {
    if (!validateForm()) return
    setLoading(true)
    setMessage(null)

    try {
      const payload = {
        order_type: selectedOrderType,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email || '',
        note: customerInfo.note || '',
        table_token: tableToken,
        items: items.map((i: CartItem) => ({
          menu_item_id: i.id,
          quantity: i.quantity
        }))
      }

      const res = await fetch(`${API_BASE_URL}/create-order/${tableToken}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: `Commande #${data.order_number} confirmée !` })
        setShowSuccessAnimation(true)
        
        setTimeout(() => {
          clearCart()
          setShowCheckoutModal(false)
          setIsCartOpen(false)
          setCustomerInfo({ name: '', phone: '', email: '', note: '' })
          setMessage(null)
        }, 2500)
      } else {
        setMessage({ type: 'error', text: data.detail || "Erreur lors de l'envoi." })
      }
    } catch (err) {
      setMessage({ type: 'error', text: "Erreur réseau." })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !isCartOpen) return null

  return (
    <>
      {/* Animation de succès simplifiée */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-secondary-light)] flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[var(--color-secondary)]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Commande Validée !</h3>
            <p className="text-gray-600 mb-4">Votre commande a été envoyée avec succès.</p>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              Le serveur sera bientôt à votre table
            </div>
          </div>
        </div>
      )}

      {/* Barre de panier flottante */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
        <button
          onClick={() => setIsCartOpen(true)}
          className="pointer-events-auto group relative flex items-center gap-4 bg-white text-gray-900 px-6 py-3 rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-[var(--color-primary)] hover:-translate-y-1"
        >
          <div className="relative">
            <ShoppingBag size={20} className="text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          </div>
          
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs text-gray-500 font-medium">Votre Panier</span>
            <span className="text-lg font-bold">
              {total.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
          
          <ChevronRight size={18} className="text-gray-400 group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Drawer du panier */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay pour fermer au clic */}
          <div 
            className="absolute inset-0 bg-black/40" 
            onClick={() => setIsCartOpen(false)} 
          />
          
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header avec bouton fermer */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Votre Panier</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {totalItems} article{totalItems > 1 ? 's' : ''}
                </p>
              </div>
              {/* Bouton fermer (croix) */}
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Fermer le panier"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Liste des articles */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <ShoppingBag className="w-16 h-16 text-gray-300" />
                  <p className="text-gray-500 text-lg">Votre panier est vide</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Parcourir le menu
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[var(--color-primary)] transition-colors"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Infos produit */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                          <p className="text-[var(--color-primary)] font-bold text-sm">
                            {item.price.toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                        
                        {/* Contrôles quantité */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button 
                              onClick={() => removeItem(item.id)} 
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                              aria-label="Réduire la quantité"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => addItem(item)} 
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                            </p>
                            <p className="text-xs text-gray-400">Total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec total et actions */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {/* Récapitulatif */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="font-medium">{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[var(--color-primary)]">{total.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Bouton checkout */}
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span>Finaliser la commande</span>
                  <CreditCard className="w-4 h-4" />
                </button>

                {/* Bouton fermer en bas */}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                  Continuer mes achats
                </button>

                {/* Badge de sécurité */}
                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de checkout */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => !loading && setShowCheckoutModal(false)} 
          />
          
          {/* Modal */}
          <div className="relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 pb-4 bg-[var(--color-primary)] text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">Finaliser la commande</h3>
                  <p className="opacity-90">Remplissez vos informations de contact</p>
                </div>
                {/* Bouton fermer modal */}
                <button 
                  onClick={() => !loading && setShowCheckoutModal(false)}
                  className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitOrder(); }} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Type de commande */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-800">
                  Type de service
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['dine_in', 'takeaway', 'delivery'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedOrderType(type)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        selectedOrderType === type 
                        ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[var(--color-primary)]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedOrderType === type ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {type === 'dine_in' && <UtensilsCrossed size={16} />}
                        {type === 'takeaway' && <PackageCheck size={16} />}
                        {type === 'delivery' && <Truck size={16} />}
                      </div>
                      <span className="text-sm font-medium">
                        {type === 'dine_in' ? 'Sur place' : type === 'takeaway' ? 'À emporter' : 'Livraison'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Informations client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none transition-all ${
                      validationErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]'
                    }`}
                    placeholder="Votre nom"
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none transition-all ${
                      validationErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]'
                    }`}
                    placeholder="00 00 00 00 00"
                  />
                  {validationErrors.phone && (
                    <p className="text-sm text-red-500">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email optionnel */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email (optionnel)</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Instructions spéciales
                </label>
                <textarea
                  value={customerInfo.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] resize-none"
                  placeholder="Allergies, préférences de préparation, remarques..."
                />
              </div>

              {/* Récapitulatif */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Articles</span>
                  <span className="font-medium">{totalItems} article{totalItems > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Frais de livraison</span>
                    <span className="font-medium">{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total à payer</span>
                    <span className="text-[var(--color-primary)]">{total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Message d'état */}
              {message && (
                <div className={`p-3 rounded-lg text-sm font-medium text-center ${
                  message.type === 'success' 
                    ? 'bg-[var(--color-secondary-light)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/30' 
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                >
                  Retour au panier
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[var(--color-primary)] text-white py-2.5 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        Confirmer la commande
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Badges de sécurité */}
              <div className="grid grid-cols-3 gap-3 pt-6">
                <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-xs text-center">Paiement sécurisé</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-xs text-center">Préparation rapide</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-xs text-center">Confirmation immédiate</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}