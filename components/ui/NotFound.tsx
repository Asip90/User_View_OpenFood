"use client";

import { UtensilsCrossed } from "lucide-react";

export default function NotFoundScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-sm text-center space-y-6">
        
        {/* Icône dans un container glassmorphism */}
        <div className="w-20 h-20 mx-auto rounded-xl bg-white/70 backdrop-blur-md border border-stone-200 flex items-center justify-center">
          <UtensilsCrossed className="w-10 h-10 text-stone-400" />
        </div>

        {/* Texte */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-stone-900">
            Menu inaccessible
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            Impossible de charger le menu. Vérifiez votre connexion ou contactez le serveur.
          </p>
        </div>

        {/* Bouton moderne */}
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}