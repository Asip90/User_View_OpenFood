'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingBag, MapPin } from 'lucide-react'
import { Restaurant } from '@/lib/types'

interface NavbarProps {
  restaurant: Restaurant
}

export default function Navbar({ restaurant }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo / Nom */}
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-black uppercase tracking-tighter italic leading-none">
            {restaurant.name}
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold mt-1">
            Maison d&apos;exception
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {['La Carte', 'Réservation', 'Privatisation'].map((item) => (
            <Link 
              key={item} 
              href="#" 
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 hover:text-stone-900 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all active:scale-95 shadow-lg shadow-stone-200">
            Nous trouver
          </button>
          
          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 md:hidden text-stone-900"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-20 z-[-1] bg-white animate-in slide-in-from-top duration-300 md:hidden p-8">
          <div className="flex flex-col gap-8 items-center pt-10">
            {['La Carte', 'Nos Vins', 'Localisation', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href="#" 
                onClick={() => setIsOpen(false)}
                className="text-2xl font-light uppercase tracking-[0.2em] text-stone-800"
              >
                {item}
              </Link>
            ))}
            <div className="mt-10 w-full h-[1px] bg-stone-100" />
            <div className="flex items-center gap-2 text-stone-400">
              <MapPin size={16} />
              <span className="text-[10px] uppercase tracking-widest font-bold">{restaurant.address}</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}