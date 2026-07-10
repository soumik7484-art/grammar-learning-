/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Space Grotesk'","system-ui","sans-serif"],
        mono: ["'Share Tech Mono'","monospace"],
      },
      colors: {
        neon:{ emerald:"#00ff87", cyan:"#00d4ff", violet:"#7c3aed", pink:"#f72585", amber:"#f59e0b", red:"#ef4444", indigo:"#6366f1", teal:"#14b8a6", blue:"#3b82f6" },
      },
      animation: {
        "float":"float 6s ease-in-out infinite",
        "float-r":"float 7s ease-in-out infinite reverse",
        "spin-slow":"spin 18s linear infinite",
        "spin-med":"spin 8s linear infinite",
        "pulse-slow":"pulse 3s ease-in-out infinite",
        "drift":"drift 12s ease-in-out infinite",
      },
      keyframes: {
        float:{ "0%,100%":{transform:"translateY(0px)"},"50%":{transform:"translateY(-18px)"} },
        drift:{ "0%,100%":{transform:"translate(0,0)"},"33%":{transform:"translate(8px,-12px)"},"66%":{transform:"translate(-8px,8px)"} },
      },
    },
  },
  plugins:[],
}
