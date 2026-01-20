'use client'

import { Restaurant } from '@/lib/types'
import { Instagram, Facebook, Twitter, Phone, Mail, ArrowUp } from 'lucide-react'

interface FooterProps {
  restaurant: Restaurant
}

export default function Footer({ restaurant }: FooterProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-gray-300 border-t border-stone-100 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 mb-20">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              {restaurant.name}
            </h2>
            <p className="text-stone-400 text-xs leading-loose font-light tracking-wide max-w-xs text-center md:text-left italic">
              &quot;L&apos;art de recevoir et la passion du goût réunis dans une expérience culinaire hors du temps.&quot;
            </p>
            <div className="flex gap-5 text-stone-300">
              <Instagram size={18} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors" />
              <Facebook size={18} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors" />
              <Twitter size={18} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col items-center space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 border-b border-[var(--color-primary)] pb-2">
              Horaires de service
            </span>
            <div className="space-y-3 text-center">
              <p className="text-xs text-stone-500 font-medium">Lundi — Vendredi</p>
              <p className="text-sm font-light text-stone-800 tracking-widest">12:00 - 14:30 | 19:00 - 22:30</p>
              <p className="text-xs text-stone-500 font-medium pt-2">Samedi — Dimanche</p>
              <p className="text-sm font-light text-stone-800 tracking-widest">12:00 - 23:00</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-end space-y-6 text-center md:text-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 border-b border-[var(--color-primary)] pb-2">
              Conciergerie
            </span>
            <div className="space-y-4">
              <a href={`tel:${restaurant.phone}`} className="flex items-center md:justify-end gap-3 text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-widest">
                {restaurant.phone} <Phone size={14} className="text-stone-300" />
              </a>
              <div className="flex items-start md:justify-end gap-3 text-sm text-stone-600 tracking-widest max-w-[200px]">
                {restaurant.address} <Mail size={14} className="text-stone-300 mt-1" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-stone-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
            © {new Date().getFullYear()} {restaurant.name}. Tous droits réservés.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[9px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-900 transition-colors"
          >
            Retour en haut <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>

          <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
            Expérience par <span className="text-stone-900">Le Luxury House</span>
          </p>
        </div>
      </div>
    </footer>
  )
}