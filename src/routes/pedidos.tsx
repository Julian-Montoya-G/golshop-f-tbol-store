import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, PackageCheck, Truck, XCircle } from "lucide-react";
import { useState } from "react";
import { MobileShell, PageHeader } from "@/components/golshop/MobileShell";
import { ProductArt } from "@/components/golshop/ProductArt";
import { ORDERS, PRODUCTS, formatCOP, type OrderStatus } from "@/lib/golshop-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Mis pedidos · GolShop" },
      { name: "description", content: "Consulta el historial y el estado de tus pedidos en GolShop." },
      { property: "og:title", content: "Mis pedidos · GolShop" },
      { property: "og:description", content: "Consulta el historial y el estado de tus pedidos en GolShop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrdersScreen,
});

const STATUS_STYLE: Record<OrderStatus, { className: string; icon: typeof Truck }> = {
  Entregado: { className: "bg-primary/15 text-primary", icon: CheckCircle2 },
  "En camino": { className: "bg-info/15 text-info", icon: Truck },
  Preparando: { className: "bg-gold/15 text-gold", icon: Clock },
  Cancelado: { className: "bg-destructive/15 text-destructive", icon: XCircle },
};

const TABS = ["Todos", "Activos", "Entregados"] as const;

function OrdersScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Todos");
  const orders = ORDERS.filter((o) =>
    tab === "Todos"
      ? true
      : tab === "Activos"
        ? o.status === "En camino" || o.status === "Preparando"
        : o.status === "Entregado",
  );

  return (
    <MobileShell>
      <PageHeader title="Mis pedidos" subtitle={`${ORDERS.length} pedidos realizados`} />

      <div className="px-5">
        <div className="grid grid-cols-3 rounded-2xl border border-border bg-card p-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "h-10 rounded-xl text-sm font-semibold transition-all",
                tab === t ? "bg-surface text-foreground" : "text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {orders.map((order, i) => {
            const style = STATUS_STYLE[order.status];
            const Icon = style.icon;
            const qty = order.items.reduce((n, it) => n + it.qty, 0);
            return (
              <article
                key={order.id}
                className="animate-rise rounded-3xl border border-border bg-card p-4 shadow-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg font-bold tracking-wide">#{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", style.className)}>
                    <Icon className="h-3.5 w-3.5" />
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {order.items.map((it) => {
                    const p = PRODUCTS.find((x) => x.id === it.productId);
                    return p ? (
                      <div key={it.productId} className="h-14 w-14 rounded-xl bg-art p-1.5">
                        <ProductArt art={p.art} />
                      </div>
                    ) : null;
                  })}
                  <p className="ml-1 flex-1 text-xs text-muted-foreground">
                    {order.items
                      .map((it) => PRODUCTS.find((x) => x.id === it.productId)?.team)
                      .filter(Boolean)
                      .join(" · ")}
                    <span className="block">{qty} {qty === 1 ? "artículo" : "artículos"}</span>
                  </p>
                  <p className="font-display text-lg font-bold text-gold">{formatCOP(order.total)}</p>
                </div>

                {(order.status === "En camino" || order.status === "Preparando") && (
                  <div className="mt-4">
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-pitch" style={{ width: `${order.progress}%` }} />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="text-primary">Confirmado</span>
                      <span className={cn(order.progress >= 33 && "text-primary")}>Preparando</span>
                      <span className={cn(order.progress >= 66 && "text-primary")}>En camino</span>
                      <span>Entregado</span>
                    </div>
                  </div>
                )}
                {order.status === "Entregado" && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <PackageCheck className="h-4 w-4 text-primary" /> Entregado en Cra. 43A #1-50, Medellín
                  </p>
                )}
              </article>
            );
          })}
          {orders.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No hay pedidos en esta sección.</p>
          )}
        </div>
      </div>
    </MobileShell>
  );
}
