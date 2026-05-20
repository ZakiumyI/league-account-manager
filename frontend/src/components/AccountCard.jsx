import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getRankStyle } from "../utils/rankColor";

export default function AccountCard({ account, onDelete, onRefresh, isTop = false }) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const rankInfo = getRankStyle(account.soloRank);

  const handleClose = () => {
    setOpen(false);
    setShowPassword(false);
  };

  return (
    <>
      {/* CUERPO DE LA TARJETA */}
      <motion.div
        whileHover={{ y: -5, scale: isTop ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className={`
          relative cursor-pointer rounded-xl p-5 bg-zinc-950/70 border backdrop-blur-md
          transition-all duration-300 group flex flex-col justify-between overflow-hidden z-10
          ${isTop ? "border-cyan-500/50 min-h-[200px]" : "border-zinc-800/80 min-h-[170px]"}
          ${rankInfo.glow} ${rankInfo.border}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

        <div>
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-bold tracking-wide text-zinc-100 group-hover:text-cyan-400 transition-colors">
              {account.gameName}
              <span className="text-zinc-500 font-medium text-sm">#{account.tagLine}</span>
            </h2>
            
            {/* Muestra el nivel arriba a la derecha con un badge estilizado */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-semibold bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                Nvl {account.summonerLevel || 0}
              </span>
              {isTop && (
                <span className="animate-pulse bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-0.5 rounded border border-cyan-500/30 tracking-widest font-mono uppercase">
                  ALPHA
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5 font-mono">
            <p className="text-xs text-zinc-400 flex justify-between">
              <span>SoloQ:</span> 
              <span className={`${rankInfo.text}`}>{account.soloRank || "UNRANKED"}</span>
            </p>
            <p className="text-xs text-zinc-400 flex justify-between">
              <span>Puntos LP:</span> 
              <span className="text-zinc-200 font-semibold">{account.soloLP || 0} LP</span>
            </p>
            <p className="text-xs text-zinc-500 flex justify-between border-t border-zinc-900 pt-1.5 mt-1.5">
              <span>Flex:</span> 
              <span className="text-zinc-300">{account.flexRank || "UNRANKED"}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-2 border-t border-zinc-900/50">
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
            WR: {account.soloWinrate || 0}%
          </span>
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            DETALLES //
          </span>
        </div>
      </motion.div>

      {/* PORTAL GLOBAL DEL MODAL */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Fondo oscuro traslúcido global */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
              />

              {/* Contenedor del Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-zinc-950 border border-cyan-500/40 p-6 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden z-10"
              >
                {/* BOTÓN CRUZ DE CIERRE (X) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer z-20 p-1 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                  aria-label="Cerrar modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L12 12m0 0l6 6M12 12l6-6M12 12l-6-6" />
                  </svg>
                </button>

                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none border-b border-l border-cyan-500/20" />

                <div className="mb-6 pr-6">
                  <h2 className="text-2xl font-black text-zinc-100 tracking-wide">
                    {account.gameName}
                    <span className="text-cyan-500 font-normal text-lg">#{account.tagLine}</span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Nivel de Conexión: <span className="text-cyan-400 font-bold">{account.summonerLevel || "N/A"}</span>
                  </p>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-4 space-y-3 font-mono text-sm mb-6">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 text-xs">Clasificatoria Solo</span>
                    <span className={`${rankInfo.text} font-bold`}>{account.soloRank} ({account.soloLP} LP)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 text-xs">Clasificatoria Flex</span>
                    <span className="text-zinc-200">{account.flexRank} ({account.flexLP} LP)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-cyan-500/80 text-xs">ID de Acceso</span>
                    <span className="text-cyan-400 select-all">{account.username}</span>
                  </div>
                  
                  {/* SECCIÓN CLAVE CON EL OJO INTERACTIVO */}
                  <div className="flex justify-between items-center">
                    <span className="text-pink-500/80 text-xs">Clave Acceso</span>
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <span className={`text-pink-400 font-sans tracking-wide break-all select-all ${!showPassword ? "text-xs font-mono" : ""}`}>
                        {showPassword ? account.password : "••••••••"}
                      </span>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-zinc-500 hover:text-pink-400 rounded hover:bg-pink-950/20 transition-colors cursor-pointer"
                        title={showPassword ? "Ocultar clave" : "Mostrar clave"}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* CONTROLES DEL OPERADOR */}
                <div className="flex items-center gap-3">
                  {onRefresh && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRefresh(account.id);
                        handleClose();
                      }}
                      className="flex-1 font-mono text-xs font-bold tracking-widest text-zinc-950 bg-cyan-400 hover:bg-cyan-300 py-2.5 rounded transition-all active:scale-95 cursor-pointer text-center"
                    >
                      SINCRONIZAR
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(account.id);
                      handleClose();
                    }}
                    className="px-4 font-mono text-xs font-bold tracking-widest text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 py-2.5 rounded transition-all active:scale-95 cursor-pointer text-center"
                  >
                    ELIMINAR
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}