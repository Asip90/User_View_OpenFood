'use client'

import { Restaurant, MenuData } from '@/lib/types';
import Image from 'next/image';
import { MapPin, Phone, Utensils, Info } from 'lucide-react';

// Extraction du type customization pour plus de clarté
type Customization = MenuData['customization'];

interface HeroProps {
  restaurant: Restaurant;
  customization: Customization;
  table: { id: string  , number: number};
}

export default function Hero({ restaurant, table, customization }: HeroProps) {
  console.log("Customization dans Header:", customization);
  return (
    <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-stone-900">
      
      {/* 1. Image de Couverture avec Overlay Gradient */}
      {customization.cover_image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={customization.cover_image}
            alt={restaurant.name}
            fill
            priority
            className="object-cover opacity-60 scale-105 transition-transform duration-[10s] hover:scale-100"
            unoptimized
          />
          {/* Overlay subtil pour assurer la lisibilité du texte */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-stone-900" />
        </div>
      )}

      {/* 2. Contenu Central */}
      <div className="relative z-10 max-w-4xl px-6 flex flex-col items-center text-center">
        
        {/* Logo circulaire avec bordure dorée/subtile */}
        {customization.logo && (
          <div className="mb-8 relative w-24 h-24 md:w-32 md:h-32 p-1 rounded-full border border-white/20 backdrop-blur-sm animate-in fade-in zoom-in duration-1000">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-white/10">
              <Image 
                src={customization.logo} 
                alt={`${restaurant.name} logo`} 
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Badge de Table - Discret et Luxueux */}
        <div className="mb-4 px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-md">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/90">
            Table d&apos;exception n°{table.number}
          </span>
        </div>

        {/* Nom du Restaurant - Typographie Majeure */}
        <h1 className="text-4xl md:text-6xl font-light text-white uppercase tracking-[0.3em] mb-4 drop-shadow-sm">
          {restaurant.name}
        </h1>

        {/* Filet séparateur minimaliste */}
        <div className="w-16 h-[1px] bg-[var(--color-primary)] mb-6 opacity-80" />

        {/* Description - Italique et Aéré */}
        {restaurant.description && (
          <p className="max-w-xl text-white/70 text-sm md:text-base font-light italic leading-relaxed mb-8 line-clamp-2 md:line-clamp-none">
            &ldquo;{restaurant.description}&rdquo;
          </p>
        )}

        {/* Coordonnées - Iconographie fine */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-white/60">
          <div className="flex items-center gap-2 group cursor-default">
            <MapPin size={14} className="text-[var(--color-primary)] transition-transform group-hover:scale-110" />
            <span className="text-[10px] uppercase tracking-widest font-medium border-b border-transparent group-hover:border-white/20 transition-all">
              {restaurant.address}
            </span>
          </div>
          
          <div className="flex items-center gap-2 group cursor-default">
            <Phone size={14} className="text-[var(--color-primary)] transition-transform group-hover:scale-110" />
            <span className="text-[10px] uppercase tracking-widest font-medium border-b border-transparent group-hover:border-white/20 transition-all">
              {restaurant.phone}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Décoration - Indicateur de scroll (subtil) */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-40">
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div> */}

    </section>
  );
}