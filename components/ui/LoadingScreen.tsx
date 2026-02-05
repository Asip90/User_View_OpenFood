"use client";

import { UtensilsCrossed } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Loader minimaliste */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border-2 border-stone-200 animate-spin" />
        <UtensilsCrossed className="w-8 h-8 text-primary animate-pulse" />
      </div>

      {/* Texte */}
      <p className="mt-6 text-sm font-medium text-stone-600">
        Chargement du menu...
      </p>
    </div>
  );
}