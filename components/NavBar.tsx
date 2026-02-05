

// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { Menu, X, MapPin } from 'lucide-react'
// import { Restaurant } from '@/lib/types'

// interface NavbarProps {
//   restaurant: Restaurant
// }

// export default function Navbar({ restaurant }: NavbarProps) {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <nav className="sticky top-0 z-[100] w-full bg-white border-b border-stone-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
//         {/* Logo / Nom */}
//         <Link href="/" className="flex flex-col group">
//           <span className="text-lg italic font-extrabold uppercase tracking-tight leading-none text-stone-900 group-hover:text-[var(--color-primary)] transition-colors">
//             {restaurant.name}
//           </span>
//           <span className="text-[8px] uppercase tracking-[0.25em] text-stone-400 font-semibold mt-1">
//             Savourez l&apos;excellence
//           </span>
//         </Link>

//         {/* Desktop Links */}
//         <div className="hidden md:flex items-center gap-12">
//           {['La Carte', 'Réservation', 'Privatisation'].map((item) => (
//             <Link 
//               key={item} 
//               href="#" 
//               className="relative text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-600 hover:text-stone-900 transition-colors after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[var(--color-primary)] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all"
//             >
//               {item}
//             </Link>
//           ))}
//         </div>

//         {/* Action Button */}
//         <div className="flex items-center gap-4">
//           <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-stone-900 transition-all active:scale-95 shadow-md">
//             Nous trouver
//           </button>
          
//           {/* Mobile Toggle */}
//           <button 
//             onClick={() => setIsOpen(!isOpen)}
//             className="p-2 md:hidden text-stone-900"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Dropdown */}
// {isOpen && (
//   <div className="absolute top-20 left-0 w-full md:hidden bg-white border-t border-stone-200 shadow-lg rounded-b-xl transition-all duration-300 ease-in-out">
//     <div className="flex flex-col gap-6 px-6 py-8 max-h-[60vh] overflow-y-auto">
//       {['La Carte', 'Nos Vins', 'Localisation', 'Contact'].map((item) => (
//         <Link
//           key={item}
//           href="#"
//           onClick={() => setIsOpen(false)}
//           className="text-base font-medium uppercase tracking-[0.15em] text-stone-800 hover:text-[var(--color-primary)] transition-colors"
//         >
//           {item}
//         </Link>
//       ))}

//       <div className="border-t border-stone-200 pt-6 flex items-center gap-2 text-stone-500">
//         <MapPin size={16} />
//         <span className="text-xs uppercase tracking-widest font-semibold">
//           {restaurant.address}
//         </span>
//       </div>
//     </div>
//   </div>
// )}

//     </nav>
//   )
// }
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { Menu, X, MapPin } from 'lucide-react'
// import { Restaurant } from '@/lib/types'

// interface NavbarProps {
//   restaurant: Restaurant
// }

// export default function Navbar({ restaurant }: NavbarProps) {
//   const [isOpen, setIsOpen] = useState(false)

//   const desktopLinks = ['La Carte', 'Réservation', 'Privatisation', 'Mes Commandes']
//   const mobileLinks = ['La Carte', 'Nos Vins', 'Localisation', 'Contact', 'Mes Commandes']

//   return (
//     <nav className="sticky top-0 z-[100] w-full bg-white border-b border-stone-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
//         {/* Logo / Nom */}
//         <Link href="/" className="flex flex-col group">
//           <span className="text-lg italic font-extrabold uppercase tracking-tight leading-none text-stone-900 group-hover:text-[var(--color-primary)] transition-colors">
//             {restaurant.name}
//           </span>
//           <span className="text-[8px] uppercase tracking-[0.25em] text-stone-400 font-semibold mt-1">
//             Savourez l&apos;excellence
//           </span>
//         </Link>

//         {/* Desktop Links */}
//         <div className="hidden md:flex items-center gap-12">
//           {desktopLinks.map((item) => (
//             <Link 
//               key={item} 
//               href={item === 'Mes Commandes' ? '/orders' : '#'} 
//               className="relative text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-600 hover:text-stone-900 transition-colors after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[var(--color-primary)] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all"
//             >
//               {item}
//             </Link>
//           ))}
//         </div>

//         {/* Action Button */}
//         <div className="flex items-center gap-4">
//           <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-stone-900 transition-all active:scale-95 shadow-md">
//             Nous trouver
//           </button>
          
//           {/* Mobile Toggle */}
//           <button 
//             onClick={() => setIsOpen(!isOpen)}
//             className="p-2 md:hidden text-stone-900"
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="absolute top-20 left-0 w-full md:hidden bg-white border-t border-stone-200 shadow-lg rounded-b-xl transition-all duration-300 ease-in-out">
//           <div className="flex flex-col gap-6 px-6 py-8 max-h-[60vh] overflow-y-auto">
//             {mobileLinks.map((item) => (
//               <Link
//                 key={item}
//                 href={item === 'Mes Commandes' ? `/t/${tableToken}/orders` : '#'}
//                 onClick={() => setIsOpen(false)}
//                 className="text-base font-medium uppercase tracking-[0.15em] text-stone-800 hover:text-[var(--color-primary)] transition-colors"
//               >
//                 {item}
//               </Link>
//             ))}

//             <div className="border-t border-stone-200 pt-6 flex items-center gap-2 text-stone-500">
//               <MapPin size={16} />
//               <span className="text-xs uppercase tracking-widest font-semibold">
//                 {restaurant.address}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, ShoppingBag } from 'lucide-react'
import { Restaurant } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  restaurant: Restaurant
}

export default function Navbar({ restaurant }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();
  
  // Nous n'utilisons pas useParams ici, nous passons le tableToken en prop
  // Ou nous utilisons une approche différente

  const desktopLinks = [
    { name: 'La Carte', href: '#' }, // Nous utiliserons JavaScript pour gérer le lien
    { name: 'Réservation', href: '#' },
    { name: 'Privatisation', href: '#' },
    { name: 'Mes Commandes', href: '#' }
  ]
  
  const mobileLinks = [
    { name: 'La Carte', href: '#' },
    { name: 'Nos Vins', href: '#' },
    { name: 'Localisation', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Mes Commandes', href: '#' }
  ]

  const handleLinkClick = (linkName: string) => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    const match = path.match(/\/t\/([^\/]+)/);
    const tableToken = match ? match[1] : null;
    
    if (tableToken) {
      if (linkName === 'La Carte') {
        router.push(`/t/${tableToken}`);
      } else if (linkName === 'Mes Commandes') {
        router.push(`/t/${tableToken}/orders`);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo / Nom */}
        <div 
          className="flex flex-col group cursor-pointer"
          onClick={() => {
            if (typeof window !== 'undefined') {
              const path = window.location.pathname;
              const match = path.match(/\/t\/([^\/]+)/);
              const tableToken = match ? match[1] : null;
              
              if (tableToken) {
                router.push(`/t/${tableToken}`);
              }
            }
          }}
        >
          <span className="text-lg italic font-extrabold uppercase tracking-tight leading-none text-stone-900 group-hover:text-[var(--color-primary)] transition-colors">
            {restaurant.name}
          </span>
          <span className="text-[8px] uppercase tracking-[0.25em] text-stone-400 font-semibold mt-1">
            Savourez l&apos;excellence
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-12">
          {desktopLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleLinkClick(item.name)}
              className="relative text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-600 hover:text-stone-900 transition-colors after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[var(--color-primary)] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              {item.name === 'Mes Commandes' && (
                <ShoppingBag size={12} />
              )}
              {item.name}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-stone-900 transition-all active:scale-95 shadow-md">
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

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full md:hidden bg-white border-t border-stone-200 shadow-lg rounded-b-xl transition-all duration-300 ease-in-out">
          <div className="flex flex-col gap-6 px-6 py-8 max-h-[60vh] overflow-y-auto">
            {mobileLinks.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  handleLinkClick(item.name);
                  setIsOpen(false);
                }}
                className="text-base font-medium uppercase tracking-[0.15em] text-stone-800 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 bg-transparent border-none text-left cursor-pointer"
              >
                {item.name === 'Mes Commandes' && (
                  <ShoppingBag size={16} />
                )}
                {item.name}
              </button>
            ))}

            <div className="border-t border-stone-200 pt-6 flex items-center gap-2 text-stone-500">
              <MapPin size={16} />
              <span className="text-xs uppercase tracking-widest font-semibold">
                {restaurant.address}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}