import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { GolShopLogo, MobileShell } from "@/components/golshop/MobileShell";
import { ProductArt } from "@/components/golshop/ProductArt";
import { ProductCard } from "@/components/golshop/ProductCard";
import { Input } from "@/components/ui/input";
import { SIZES, TEAM_FILTERS } from "@/lib/golshop-data";
import { useStore } from "@/lib/golshop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inicio")({
  head: () => ({
    meta: [
      { title: "Inicio · GolShop" },
      { name: "description", content: "Explora camisetas de Colombia, Nacional, Millonarios, Real Madrid y más." },
      { property: "og:title", content: "Inicio · GolShop" },
      { property: "og:description", content: "Explora camisetas de Colombia, Nacional, Millonarios, Real Madrid y más." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("Todos");
  const [size, setSize] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (team !== "Todos" && p.team !== team) return false;
      if (size && !p.sizes.includes(size)) return false;
      if (q && !`${p.name} ${p.team}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, query, team, size]);

  const promo = products.find((p) => p.id === "colombia-local-2026");

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-5 pt-6">
        <GolShopLogo />
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold" />
        </button>
      </header>

      <div className="px-5 pt-5">
        <p className="text-sm text-muted-foreground">Hola, Julián</p>
        <h1 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-wide">
          ¿Qué camiseta <span className="text-primary">sudamos</span> hoy?
        </h1>
      </div>

      <div className="sticky top-0 z-20 bg-background/85 px-5 pb-3 pt-4 backdrop-blur-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar equipo o camiseta…"
            aria-label="Buscar"
            className="h-12 rounded-2xl border-border bg-surface pl-12 pr-12 text-base"
          />
          {query ? (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <SlidersHorizontal className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
          )}
        </div>

        <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 no-scrollbar">
          {TEAM_FILTERS.map((t) => (
            <Chip key={t} active={team === t} onClick={() => setTeam(t)}>
              {t}
            </Chip>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Talla</span>
          {SIZES.map((s) => (
            <Chip key={s} variant="gold" active={size === s} onClick={() => setSize(size === s ? null : s)}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      {promo && team === "Todos" && !query && !size && (
        <Link
          to="/producto/$id"
          params={{ id: promo.id }}
          className="mx-5 mt-2 flex items-center overflow-hidden rounded-3xl bg-pitch shadow-glow"
        >
          <div className="flex-1 p-5 text-primary-foreground">
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">Mundial 2026</p>
            <p className="font-display text-3xl font-extrabold uppercase leading-none">15% OFF</p>
            <p className="mt-1 text-sm font-medium opacity-90">en la nueva de la Selección</p>
          </div>
          <div className="relative h-32 w-32 shrink-0 -rotate-6">
            <ProductArt art={promo.art} />
          </div>
        </Link>
      )}

      <section className="px-5 pt-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide">
            {team === "Todos" ? "Destacados" : team}
          </h2>
          <span className="text-xs text-muted-foreground">{filtered.length} productos</span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border px-6 py-12 text-center">
            <p className="font-display text-xl font-bold uppercase">Fuera de lugar</p>
            <p className="mt-1 text-sm text-muted-foreground">No encontramos productos con esos filtros.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTeam("Todos");
                setSize(null);
              }}
              className="mt-4 text-sm font-semibold text-primary"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </MobileShell>
  );
}

function Chip({
  active,
  onClick,
  children,
  variant = "pitch",
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  variant?: "pitch" | "gold";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-all",
        active
          ? variant === "pitch"
            ? "border-transparent bg-pitch text-primary-foreground shadow-glow"
            : "border-transparent bg-gold-shine text-gold-foreground"
          : "border-border bg-surface text-muted-foreground hover:text-foreground",
        variant === "gold" && "h-8 min-w-10 px-3",
      )}
    >
      {children}
    </button>
  );
}
