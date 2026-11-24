import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Check, ChevronLeft, Heart, MessageCircle, ShieldCheck, Star, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MobileShell } from "@/components/golshop/MobileShell";
import { ProductArt } from "@/components/golshop/ProductArt";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/golshop-data";
import { useStore } from "@/lib/golshop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/producto/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de producto · GolShop" },
      { name: "description", content: "Elige tu talla y agrega la camiseta de tu equipo al carrito." },
      { property: "og:title", content: "Detalle de producto · GolShop" },
      { property: "og:description", content: "Elige tu talla y agrega la camiseta de tu equipo al carrito." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const { getProduct, addToCart } = useStore();
  const product = getProduct(id);
  const [size, setSize] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <MobileShell>
        <div className="flex min-h-[70dvh] flex-col items-center justify-center px-8 text-center">
          <p className="font-display text-3xl font-bold uppercase">Producto no encontrado</p>
          <p className="mt-2 text-sm text-muted-foreground">Puede que ya no esté disponible.</p>
          <Button asChild variant="pitch" size="xl" className="mt-6">
            <Link to="/inicio">Volver al inicio</Link>
          </Button>
        </div>
      </MobileShell>
    );
  }

  const singleSize = product.sizes.length === 1;
  const chosen = singleSize ? product.sizes[0]! : size;

  const handleAdd = () => {
    if (!chosen) {
      toast.error("Elige una talla primero");
      return;
    }
    addToCart(product.id, chosen);
    setAdded(true);
    toast.success("Agregado al carrito", {
      description: `${product.team} · Talla ${chosen}`,
      action: { label: "Ver carrito", onClick: () => navigate({ to: "/carrito" }) },
    });
  };

  return (
    <MobileShell nav={false} className="pb-32">
      <section className="relative h-[400px] overflow-hidden rounded-b-[2.5rem] bg-art pitch-lines">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-6">
          <Button variant="glass" size="icon-lg" aria-label="Volver" onClick={() => router.history.back()}>
            <ChevronLeft />
          </Button>
          <Button
            variant="glass"
            size="icon-lg"
            aria-label={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
            aria-pressed={liked}
            onClick={() => setLiked((v) => !v)}
          >
            <Heart className={cn(liked && "fill-gold text-gold")} />
          </Button>
        </div>
        <div className="absolute inset-x-10 bottom-8 top-20">
          <ProductArt art={product.art} float />
        </div>
        {product.badge && (
          <span className="absolute bottom-6 left-6 rounded-full bg-gold-shine px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-foreground">
            {product.badge}
          </span>
        )}
      </section>

      <section className="animate-rise px-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{product.team}</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold uppercase leading-none tracking-wide">
              {product.name}
            </h1>
          </div>
          <span className="mt-1 flex shrink-0 items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-gold text-gold" />
            {product.rating}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Selecciona tu talla</h2>
            <span className="text-xs text-muted-foreground">
              {product.stock <= 5 ? `¡Solo quedan ${product.stock}!` : `${product.stock} disponibles`}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {(singleSize ? product.sizes : ["S", "M", "L", "XL"]).map((s) => {
              const available = product.sizes.includes(s);
              const active = chosen === s;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!available}
                  onClick={() => {
                    setSize(s);
                    setAdded(false);
                  }}
                  aria-pressed={active}
                  className={cn(
                    "flex h-14 min-w-14 items-center justify-center rounded-2xl border px-4 font-display text-xl font-bold transition-all",
                    active
                      ? "border-transparent bg-pitch text-primary-foreground shadow-glow"
                      : "border-border bg-surface text-foreground hover:border-primary/50",
                    !available && "cursor-not-allowed text-muted-foreground line-through opacity-40",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-3">
            <Truck className="h-5 w-5 shrink-0 text-primary" />
            <p className="text-xs leading-tight text-muted-foreground">
              <span className="block font-semibold text-foreground">Envío 1-2 días</span>a todo Colombia
            </p>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
            <p className="text-xs leading-tight text-muted-foreground">
              <span className="block font-semibold text-foreground">100% original</span>garantía oficial
            </p>
          </div>
        </div>

        <Link
          to="/chat"
          className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-shine font-display text-lg font-bold text-gold-foreground">
            TG
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold">Tienda Golazo</span>
            <span className="block text-xs text-muted-foreground">Vendedor verificado · Medellín</span>
          </span>
          <MessageCircle className="h-5 w-5 text-primary" />
        </Link>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[390px] px-4 pb-4">
        <div className="flex items-center gap-4 rounded-3xl border border-border bg-card/95 p-3 pl-5 shadow-card backdrop-blur-xl">
          <div>
            {product.oldPrice && (
              <p className="text-xs text-muted-foreground line-through">{formatCOP(product.oldPrice)}</p>
            )}
            <p className="font-display text-2xl font-extrabold leading-none text-gold">{formatCOP(product.price)}</p>
          </div>
          <Button variant="pitch" size="xl" className="flex-1" onClick={handleAdd}>
            {added ? (
              <>
                <Check className="!h-5 !w-5" /> Agregado
              </>
            ) : (
              "Agregar al carrito"
            )}
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
