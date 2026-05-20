import { motion, AnimatePresence } from "framer-motion";
import AccountCard from "./AccountCard";
import { getSoloScore } from "../utils/sort";

export default function AccountGrid({ accounts, onDelete, onRefresh }) {
  // Ordenamos usando la función que ya calcula el puntaje basado en la jerarquía de Elos
  const sorted = [...accounts].sort((a, b) => getSoloScore(b) - getSoloScore(a));

  const topAccount = sorted[0];
  const restAccounts = sorted.slice(1);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* SECCIÓN TARJETA CENTRAL SUPREMA (TOP 1 ELO) */}
      {topAccount && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              ⚡ Líder del Servidor
            </span>
          </div>
          
          <div className="w-full max-w-md transform scale-[1.03] transition-transform duration-300">
            <AccountCard 
              account={topAccount} 
              isTop={true} 
              onDelete={onDelete} 
              onRefresh={onRefresh}
            />
          </div>
        </div>
      )}

      {/* SECCIÓN DEL RESTO DE CUENTAS EN FILAS DE 3 */}
      {restAccounts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
            <h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
              Aspirantes Disponibles
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          </div>

          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {restAccounts.map((acc) => (
                <motion.div
                  key={acc.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <AccountCard
                    account={acc}
                    isTop={false}
                    onDelete={onDelete}
                    onRefresh={onRefresh}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}