'use client'

import { Restaurant } from '@/lib/types'
import { Instagram, Facebook, Twitter, Phone, Mail, ArrowUp } from 'lucide-react'
import Link from "next/link"
interface FooterProps {
  restaurant: Restaurant
}

export default function Footer({ restaurant }: FooterProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-gray-900 text-stone-200 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
              {restaurant.name}
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed font-light max-w-xs text-center md:text-left italic">
              &quot;L&apos;art de recevoir et la passion du goût réunis dans une expérience culinaire hors du temps.&quot;
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-800 hover:bg-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  <Icon size={16} className="text-white" />
                </div>
              ))}
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col items-center space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-2">
              Horaires de service
            </span>
            <div className="space-y-3 text-center">
              <p className="text-sm text-stone-400 font-medium">Lundi — Vendredi</p>
              <p className="text-base font-light text-white tracking-wide">12:00 - 14:30 | 19:00 - 22:30</p>
              <p className="text-sm text-stone-400 font-medium pt-2">Samedi — Dimanche</p>
              <p className="text-base font-light text-white tracking-wide">12:00 - 23:00</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-end space-y-6 text-center md:text-right">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-2">
              Conciergerie
            </span>
            <div className="space-y-4">
              <a href={`tel:${restaurant.phone}`} className="flex items-center md:justify-end gap-3 text-sm text-stone-300 hover:text-white transition-colors tracking-wide">
                {restaurant.phone} <Phone size={14} />
              </a>
              <div className="flex items-start md:justify-end gap-3 text-sm text-stone-300 tracking-wide max-w-[220px]">
                {restaurant.address} <Mail size={14} className="mt-1" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-700 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
            © {new Date().getFullYear()} {restaurant.name}. Tous droits réservés.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-stone-400 hover:text-white transition-colors"
          >
            Retour en haut <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>

          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold"> Rejoindre{" "} <Link href="https://openfood.site/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 transition-colors" > Open Food </Link> </p>
        </div>
      </div>
    </footer>
  )
}
