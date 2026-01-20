// 'use client';

// import { FiMapPin, FiClock, FiPhone } from 'react-icons/fi';
// import { motion } from 'framer-motion';

// interface TableInfoProps {
//   restaurantName: string;
//   tableNumber: number | string;
// }

// export default function TableInfo({ restaurantName, tableNumber }: TableInfoProps) {
//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className=" bg-black to-secondary rounded-2xl p-6 text-white mb-8 shadow-lg"
//     >
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Restaurant Info */}
//         <div className="flex items-center space-x-4">
//           <div className="p-3 bg-white/20 rounded-xl">
//             <FiMapPin className="w-6 h-6" />
//           </div>
//           <div>
//             <p className="text-sm opacity-90">Restaurant</p>
//             <p className="text-xl font-bold">{restaurantName}</p>
//           </div>
//         </div>

//         {/* Table Info */}
//         <div className="flex items-center space-x-4">
//           <div className="p-3 bg-white/20 rounded-xl">
//             <div className="w-6 h-6 flex items-center justify-center font-bold">T</div>
//           </div>
//           <div>
//             <p className="text-sm opacity-90">Numéro de table</p>
//             <p className="text-xl font-bold">#{tableNumber}</p>
//           </div>
//         </div>

//         {/* Contact Info */}
//         <div className="flex items-center space-x-4">
//           <div className="p-3 bg-white/20 rounded-xl">
//             <FiPhone className="w-6 h-6" />
//           </div>
//           <div>
//             <p className="text-sm opacity-90">Contact</p>
//             <p className="text-xl font-bold">+02 978 000 000 00</p>
//             <p className="text-xs opacity-80 mt-1">Pour suivre votre commande</p>
//           </div>
//         </div>
//       </div>

//       {/* Special Instructions */}
//       <div className="mt-6 pt-6 border-t border-white/20">
//         <div className="flex items-start space-x-3">
//           <div className="p-2 bg-white/20 rounded-lg">
//             <FiClock className="w-5 h-5" />
//           </div>
//           <div className="flex-1">
//             <p className="font-medium mb-1">Instructions spéciales</p>
//             <textarea
//               placeholder="Ajoutez vos instructions ici (allergies, préférences, etc.)"
//               className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white placeholder-white/60 text-sm resize-none"
//               rows={2}
//             />
//             <p className="text-xs opacity-80 mt-2">
//              {` Exemple : "Sans gluten", "Bien cuit", "Sauce à part"`}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Service Status */}
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3 }}
//         className="mt-4 flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4"
//       >
//         <div className="flex items-center space-x-3">
//           <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//           <span className="font-medium">Service en cours</span>
//         </div>
//         <div className="text-sm">
//           <span className="opacity-80">Temps estimé : </span>
//           <span className="font-bold">15-25 min</span>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

import { motion } from 'framer-motion';

interface TableInfoProps {
  restaurantName: string;
  tableNumber: string;
}

export default function TableInfo({ restaurantName, tableNumber }: TableInfoProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-primary-100 text-primary-800 p-4 rounded-xl mb-6 text-center shadow-sm"
    >
      <p className="text-lg font-medium">
        Vous êtes à la table <span className="font-bold text-primary-900">n°{tableNumber}</span>
      </p>
      <p className="text-sm">Profitez de votre repas chez <span className="font-semibold">{restaurantName}</span> !</p>
    </motion.div>
  );
}