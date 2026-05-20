import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API = "http://localhost:3000";

export default function AccountForm({ onClose, onCreated }) {
  const [form, setForm] = useState({
    gameName: "",
    tagLine: "",
    region: "LA2",
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.gameName || !form.tagLine) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${API}/accounts`, form);
      onCreated(res.data);
    } catch (err) {
      console.error("Error al inyectar cuenta en la terminal:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* CAPA TRASERA OSCURA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
      />

      {/* CONTENEDOR CENTRAL DEL FORMULARIO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="relative w-full max-w-md bg-zinc-950 border border-cyan-500 p-6 rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.2)]"
      >
        <div className="mb-5 border-b border-zinc-900 pb-3">
          <h2 className="text-xl font-bold tracking-widest text-cyan-400 uppercase font-mono">
            // REGISTRO_CUENTA
          </h2>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Inicializando protocolo de enlace de Riot Games</p>
        </div>

        <form onSubmit={submit} className="space-y-4 font-mono">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-[10px] uppercase text-zinc-500 tracking-wider block mb-1">In-Game Name</label>
              <input
                required
                placeholder="Ex: Hide on bush"
                className="w-full p-2.5 bg-black border border-zinc-800 focus:border-cyan-500 text-zinc-100 text-sm rounded outline-none transition-colors"
                onChange={(e) => setForm({ ...form, gameName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-zinc-500 tracking-wider block mb-1">Tag</label>
              <input
                required
                placeholder="KR1"
                className="w-full p-2.5 bg-black border border-zinc-800 focus:border-cyan-500 text-zinc-100 text-sm rounded outline-none transition-colors text-center"
                onChange={(e) => setForm({ ...form, tagLine: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-zinc-500 tracking-wider block mb-1">Identificador de Acceso (User)</label>
            <input
              required
              placeholder="Username de login"
              className="w-full p-2.5 bg-black border border-zinc-800 focus:border-cyan-500 text-zinc-100 text-sm rounded outline-none transition-colors"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-zinc-500 tracking-wider block mb-1">Clave de Encriptación (Pass)</label>
            <input
              required
              type="password"
              placeholder="••••••••••••"
              className="w-full p-2.5 bg-black border border-zinc-800 focus:border-cyan-500 text-pink-400 text-sm rounded outline-none transition-colors font-sans"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-900 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 text-zinc-400 text-xs font-bold tracking-widest py-3 rounded transition-all cursor-pointer text-center"
            >
              CANCELAR
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold tracking-widest py-3 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50 cursor-pointer text-center"
            >
              {loading ? "PROCESANDO..." : "VINCULAR"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}