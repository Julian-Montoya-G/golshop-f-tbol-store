import { Link } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { formatCOP, type Product } from "@/lib/golshop-data";
import { useStore } from "@/lib/golshop-store";
import { ProductArt } from "./ProductArt";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useStore();
  const defaultSize = product.sizes.includes("M") ? "M" : (product.sizes[0] ?? "Única");

  return (
    <article
      className="animate-rise group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link to="/producto/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-square bg-art p-4">
          <ProductArt art={product.art} className="transition-transform duration-300 group-hover:scale-105" />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-gold-shine px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
              {product.badge}
            </span>
          )}
          <span className="absolute right-3 top-3 flex items-center gap-0.5 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
            <Star className="h-3 w-3 fill-gold text-gold" />
            {product.rating}
          </span>
        </div>
        <div className="px-3 pb-3 pt-2.5">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-primary">
            {product.team}
          </p>
          <h3 className="truncate text-sm font-semibold leading-tight">{product.name}</h3>
          <p className="mt-1.5 font-display text-xl font-bold text-gold">{formatCOP(product.price)}</p>
        </div>
      </Link>
      <button
        type="button"
        aria-label={`Agregar ${product.team} al carrito`}
        onClick={() => {
          addToCart(product.id, defaultSize);
          toast.success(`${product.team} agregado al carrito`, { description: `Talla ${defaultSize}` });
        }}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-pitch text-primary-foreground shadow-glow transition-transform active:scale-90"
      >
        <Plus className="h-5 w-5" strokeWidth={3} />
      </button>
    </article>
  );
}
