import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { MobileShell, PageHeader } from "@/components/golshop/MobileShell";
import { ProductArt } from "@/components/golshop/ProductArt";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_FROM, formatCOP } from "@/lib/golshop-data";
import { useStore } from "@/lib/golshop-store";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Carrito · GolShop" },
      { name: "description", content: "Revisa tus camisetas, ajusta cantidades y finaliza tu compra." },
      { property: "og:title", content: "Carrito · GolShop" },
      { property: "og:description", content: "Revisa tus camisetas, ajusta cantidades y finaliza tu compra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartScreen,
});

function CartScreen() {
  const { cart, getProduct, setQty, removeFromCart, clearCart, subtotal, shipping, total, cartCount } =
    useStore();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  if (orderNumber) {
    return (
      <MobileShell>
        <div className="flex min-h-[80dvh] flex-col items-center justify-center px-8 text-center animate-rise">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-pitch shadow-glow">
            <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold uppercase">¡Golazo!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu pedido <span className="font-semibold text-gold">{orderNumber}</span> fue confirmado. Te avisaremos
            cuando salga para tu casa.
          </p>
          <Button asChild variant="pitch" size="xl" className="mt-8 w-full">
            <Link to="/pedidos">Ver mis pedidos</Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2">
            <Link to="/inicio">Seguir comprando</Link>
          </Button>
        </div>
      </MobileShell>
    );
  }

  const missingForFree = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  return (
    <MobileShell>
      <PageHeader title="Mi carrito" subtitle={`${cartCount} ${cartCount === 1 ? "producto" : "productos"}`} back={false} />

      {cart.length === 0 ? (
        <div className="flex flex-col items-center px-8 pt-16 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-surface">
            <ShoppingBag className="h-9 w-9 text-muted-foreground" />
          </span>
          <p className="mt-5 font-display text-2xl font-bold uppercase">Tu carrito está vacío</p>
          <p className="mt-1 text-sm text-muted-foreground">Ponte la camiseta: agrega algo de tu equipo.</p>
          <Button asChild variant="pitch" size="xl" className="mt-6 w-full">
            <Link to="/inicio">Explorar camisetas</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3 px-5">
          {cart.map((item) => {
            const p = getProduct(item.productId);
            if (!p) return null;
            return (
              <article
                key={`${item.productId}-${item.size}`}
                className="animate-rise flex gap-3 rounded-3xl border border-border bg-card p-3 shadow-card"
              >
                <Link
                  to="/producto/$id"
                  params={{ id: p.id }}
                  className="h-24 w-24 shrink-0 rounded-2xl bg-art p-2"
                >
                  <ProductArt art={p.art} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-primary">{p.team}</p>
                      <h3 className="truncate text-sm font-semibold">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">Talla {item.size}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Eliminar ${p.team}`}
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="font-display text-lg font-bold text-gold">{formatCOP(p.price * item.qty)}</p>
                    <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
                      <button
                        type="button"
                        aria-label="Restar uno"
                        onClick={() => setQty(item.productId, item.size, item.qty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-accent"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold" aria-label="Cantidad">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Sumar uno"
                        onClick={() => setQty(item.productId, item.size, item.qty + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-pitch text-primary-foreground"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-3 text-sm">
            <Truck className="h-5 w-5 shrink-0 text-primary" />
            {missingForFree > 0 ? (
              <p>
                Te faltan <span className="font-bold text-primary">{formatCOP(missingForFree)}</span> para envío gratis
              </p>
            ) : (
              <p className="font-semibold text-primary">¡Tienes envío gratis!</p>
            )}
          </div>

          <section className="rounded-3xl border border-border bg-card p-5">
            <Row label="Subtotal" value={formatCOP(subtotal)} />
            <Row label="Envío" value={shipping === 0 ? "Gratis" : formatCOP(shipping)} />
            <div className="my-3 border-t border-dashed border-border" />
            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg font-bold uppercase">Total</span>
              <span className="font-display text-3xl font-extrabold text-gold">{formatCOP(total)}</span>
            </div>
            <Button
              variant="pitch"
              size="xl"
              className="mt-5 w-full"
              onClick={() => {
                setOrderNumber(`GS-${10483 + Math.floor(Math.random() * 400)}`);
                clearCart();
              }}
            >
              Comprar · {formatCOP(total)}
            </Button>
          </section>
        </div>
      )}
    </MobileShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
