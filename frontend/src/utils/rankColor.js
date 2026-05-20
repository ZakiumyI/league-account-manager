// utils/rankColor.js

export function getRankStyle(rank = "") {
  const tier = rank.toUpperCase().split(" ")[0];

  const styles = {
    IRON: {
      text: "text-zinc-400",
      border: "border-zinc-500/40",
      glow: "shadow-[0_0_20px_rgba(113,113,122,0.3)]",
      bg: "bg-zinc-950/80",
      accent: "#71717a"
    },
    BRONZE: {
      text: "text-amber-700",
      border: "border-amber-800/40",
      glow: "shadow-[0_0_20px_rgba(180,83,9,0.3)]",
      bg: "bg-amber-950/40",
      accent: "#b45309"
    },
    SILVER: {
      text: "text-slate-300",
      border: "border-slate-400/40",
      glow: "shadow-[0_0_20px_rgba(148,163,184,0.3)]",
      bg: "bg-slate-900/40",
      accent: "#94a3b8"
    },
    GOLD: {
      text: "text-yellow-400 font-semibold tracking-wider",
      border: "border-yellow-500/50",
      glow: "shadow-[0_0_25px_rgba(234,179,8,0.4)]",
      bg: "bg-yellow-950/20",
      accent: "#eab308"
    },
    PLATINUM: {
      text: "text-teal-400 font-semibold tracking-wider",
      border: "border-teal-500/50",
      glow: "shadow-[0_0_25px_rgba(20,184,166,0.4)]",
      bg: "bg-teal-950/20",
      accent: "#14b8a6"
    },
    EMERALD: {
      text: "text-emerald-400 font-bold tracking-wider",
      border: "border-emerald-500/60",
      glow: "shadow-[0_0_25px_rgba(16,185,129,0.4)]",
      bg: "bg-emerald-950/20",
      accent: "#10b981"
    },
    DIAMOND: {
      text: "text-cyan-400 font-bold tracking-widest uppercase",
      border: "border-cyan-400/70",
      glow: "shadow-[0_0_30px_rgba(34,211,238,0.5)]",
      bg: "bg-cyan-950/20",
      accent: "#22d3ee"
    },
    MASTER: {
      text: "text-purple-400 font-bold tracking-widest uppercase",
      border: "border-purple-500/70",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.5)]",
      bg: "bg-purple-950/20",
      accent: "#a855f7"
    },
    GRANDMASTER: {
      text: "text-red-500 font-extrabold tracking-widest uppercase animate-pulse",
      border: "border-red-500/80",
      glow: "shadow-[0_0_35px_rgba(239,68,68,0.6)]",
      bg: "bg-red-950/20",
      accent: "#ef4444"
    },
    CHALLENGER: {
      text: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 font-extrabold tracking-widest uppercase animate-pulse",
      border: "border-pink-500",
      glow: "shadow-[0_0_40px_rgba(236,72,153,0.7)]",
      bg: "bg-gradient-to-b from-pink-950/20 to-black/80",
      accent: "#ec4899"
    }
  };

  return styles[tier] || {
    text: "text-gray-400",
    border: "border-gray-700",
    glow: "shadow-none",
    bg: "bg-zinc-900",
    accent: "#6b7280"
  };
}