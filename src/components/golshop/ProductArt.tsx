import { useId } from "react";
import type { Product } from "@/lib/golshop-data";
import { cn } from "@/lib/utils";

const BODY =
  "M72 28 L44 40 L16 70 L36 96 L56 84 L56 176 Q100 182 144 176 L144 84 L164 96 L184 70 L156 40 L128 28 Q114 44 100 44 Q86 44 72 28 Z";

function pentagon(cx: number, cy: number, r: number, rot = -90) {
  return Array.from({ length: 5 }, (_, i) => {
    const a = ((rot + i * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

/** Ilustración vectorial del producto con los colores del equipo. */
export function ProductArt({
  art,
  className,
  float = false,
}: {
  art: Product["art"];
  className?: string;
  float?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const clip = `clip-${uid}`;
  const shade = `shade-${uid}`;

  return (
    <svg
      viewBox="0 0 200 210"
      className={cn("h-full w-full drop-shadow-xl", float && "animate-float", className)}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clip}>
          {art.pattern === "ball" ? <circle cx="100" cy="100" r="70" /> : <path d={BODY} />}
        </clipPath>
        <linearGradient id={shade} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="196" rx="62" ry="7" fill="#000" opacity="0.35" />

      {art.pattern === "ball" && (
        <g>
          <g clipPath={`url(#${clip})`}>
            <circle cx="100" cy="100" r="70" fill={art.base} />
            <polygon points={pentagon(100, 100, 22)} fill={art.secondary} />
            {[0, 1, 2, 3, 4].map((i) => {
              const a = ((-90 + i * 72) * Math.PI) / 180;
              const cx = 100 + 62 * Math.cos(a);
              const cy = 100 + 62 * Math.sin(a);
              return (
                <g key={i}>
                  <line
                    x1={100 + 22 * Math.cos(a)}
                    y1={100 + 22 * Math.sin(a)}
                    x2={cx}
                    y2={cy}
                    stroke={art.secondary}
                    strokeWidth="3"
                  />
                  <polygon points={pentagon(cx, cy, 20, -90 + i * 72 + 36)} fill={art.secondary} />
                </g>
              );
            })}
            <path
              d="M40 130 Q100 160 160 130"
              stroke={art.trim}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="70" fill={`url(#${shade})`} />
          </g>
          <circle cx="100" cy="100" r="70" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="2" />
        </g>
      )}

      {art.pattern === "scarf" && (
        <g transform="rotate(-22 100 100)">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect
              key={i}
              x={24 + i * 22}
              y="78"
              width="22"
              height="44"
              fill={i % 2 === 0 ? art.base : art.secondary}
            />
          ))}
          <rect x="24" y="78" width="154" height="44" rx="4" fill={`url(#${shade})`} />
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i}>
              <line x1="22" y1={82 + i * 6} x2="10" y2={82 + i * 6} stroke={art.base} strokeWidth="3" strokeLinecap="round" />
              <line x1="180" y1={82 + i * 6} x2="192" y2={82 + i * 6} stroke={art.base} strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
          <text
            x="101"
            y="106"
            textAnchor="middle"
            fontFamily="Barlow Condensed, sans-serif"
            fontWeight="800"
            fontSize="14"
            fill={art.secondary}
            stroke={art.base}
            strokeWidth="0.5"
            letterSpacing="2"
          >
            VERDOLAGA
          </text>
        </g>
      )}

      {art.pattern !== "ball" && art.pattern !== "scarf" && (
        <g>
          <g clipPath={`url(#${clip})`}>
            <rect width="200" height="200" fill={art.base} />
            {art.pattern === "stripes" &&
              Array.from({ length: 7 }, (_, i) => (
                <rect key={i} x={23 + i * 26} y="0" width="13" height="200" fill={art.secondary} />
              ))}
            {art.pattern === "hoops" &&
              Array.from({ length: 6 }, (_, i) => (
                <rect key={i} x="0" y={30 + i * 28} width="200" height="14" fill={art.secondary} />
              ))}
            {art.pattern === "band" && <rect x="0" y="94" width="200" height="28" fill={art.secondary} />}
            {art.pattern === "sash" && <polygon points="44,36 78,36 172,186 138,186" fill={art.secondary} />}
            {/* puños */}
            <line x1="16" y1="70" x2="36" y2="96" stroke={art.trim} strokeWidth="8" />
            <line x1="184" y1="70" x2="164" y2="96" stroke={art.trim} strokeWidth="8" />
            {/* pliegues */}
            <path d="M74 60 Q78 120 70 176" stroke="#000" strokeOpacity="0.08" strokeWidth="3" fill="none" />
            <path d="M128 60 Q122 120 132 176" stroke="#000" strokeOpacity="0.08" strokeWidth="3" fill="none" />
            <rect width="200" height="200" fill={`url(#${shade})`} />
          </g>
          {/* cuello */}
          <path d="M72 28 Q86 44 100 44 Q114 44 128 28" stroke={art.trim} strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* escudo */}
          <path d="M116 64 h14 v8 q0 8 -7 11 q-7 -3 -7 -11 Z" fill={art.trim} stroke="#000" strokeOpacity="0.2" />
          <circle cx="123" cy="71" r="2.5" fill={art.base} />
          {/* marca */}
          <path d="M70 70 l5 4 l9 -8" stroke={art.trim} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={BODY} fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="2" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}
