import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Package, Pencil, Plus, Trash2, TrendingUp } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/golshop/MobileShell";
import { ProductArt } from "@/components/golshop/ProductArt";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCOP, type Product } from "@/lib/golshop-data";
import { useStore } from "@/lib/golshop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin · GolShop" },
      { name: "description", content: "Crea, edita y elimina los productos de tu tienda en GolShop." },
      { property: "og:title", content: "Panel Admin · GolShop" },
      { property: "og:description", content: "Crea, edita y elimina los productos de tu tienda en GolShop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminScreen,
});

const PALETTES: Product["art"][] = [
  { base: "#0B8A3E", secondary: "#FFFFFF", trim: "#FFFFFF", pattern: "stripes" },
  { base: "#F7C600", secondary: "#F7C600", trim: "#1D3C8F", pattern: "solid" },
  { base: "#C8102E", secondary: "#8A0A1F", trim: "#FFFFFF", pattern: "sash" },
  { base: "#1846A3", secondary: "#1846A3", trim: "#FFFFFF", pattern: "solid" },
  { base: "#111111", secondary: "#D4AF37", trim: "#D4AF37", pattern: "band" },
  { base: "#FFFFFF", secondary: "#6CACE4", trim: "#1B2A4A", pattern: "stripes" },
];

interface FormState {
  name: string;
  team: string;
  price: string;
  stock: string;
  art: Product["art"];
}

const EMPTY: FormState = { name: "", team: "", price: "", stock: "", art: PALETTES[0]! };

function AdminScreen() {
  const { products, saveProduct, deleteProduct } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lowStock = products.filter((p) => p.stock <= 5).length;
  const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, team: p.team, price: String(p.price), stock: String(p.stock), art: p.art });
    setError(null);
    setOpen(true);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const price = Number(form.price.replace(/\D/g, ""));
    const stock = Number(form.stock.replace(/\D/g, ""));
    if (!form.name.trim() || !form.team.trim()) return setError("Escribe el nombre y el equipo.");
    if (!price) return setError("Escribe un precio válido.");
    const product: Product = editing
      ? { ...editing, name: form.name.trim(), team: form.team.trim(), price, stock, art: form.art }
      : {
          id: `prod-${Date.now()}`,
          name: form.name.trim(),
          team: form.team.trim(),
          category: "Camiseta",
          price,
          stock,
          sizes: ["S", "M", "L", "XL"],
          rating: 5,
          badge: "Nuevo",
          description: "Producto nuevo agregado desde el panel de administración.",
          art: form.art,
        };
    saveProduct(product);
    setOpen(false);
    toast.success(editing ? "Producto actualizado" : "Producto creado");
  };

  return (
    <MobileShell>
      <PageHeader
        title="Panel Admin"
        subtitle="Tienda Golazo · Vendedor"
        action={
          <Button variant="pitch" size="icon-lg" aria-label="Crear producto" onClick={openCreate}>
            <Plus />
          </Button>
        }
      />

      <div className="px-5">
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={<Package />} value={String(products.length)} label="Productos" />
          <StatCard icon={<AlertTriangle />} value={String(lowStock)} label="Stock bajo" tone="gold" />
          <StatCard icon={<TrendingUp />} value={`${Math.round(inventoryValue / 1_000_000)}M`} label="Inventario" />
        </div>

        <Button variant="pitch" size="xl" className="mt-4 w-full" onClick={openCreate}>
          <Plus className="!h-5 !w-5" /> Crear producto
        </Button>

        <h2 className="mb-3 mt-6 font-display text-xl font-bold uppercase tracking-wide">Mis productos</h2>
        <div className="space-y-2.5">
          {products.map((p) => (
            <article key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5">
              <div className="h-16 w-16 shrink-0 rounded-xl bg-art p-1.5">
                <ProductArt art={p.art} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-primary">{p.team}</p>
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs">
                  <span className="font-bold text-gold">{formatCOP(p.price)}</span>
                  <span className={cn("ml-2", p.stock <= 5 ? "text-destructive" : "text-muted-foreground")}>
                    Stock {p.stock}
                  </span>
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  aria-label={`Editar ${p.team}`}
                  onClick={() => openEdit(p)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-foreground hover:bg-accent"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar ${p.team}`}
                  onClick={() => setToDelete(p)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/15 text-destructive hover:bg-destructive/25"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto max-h-[90dvh] max-w-[390px] overflow-y-auto rounded-t-[2rem] border-border bg-card"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="font-display text-2xl font-bold uppercase tracking-wide">
              {editing ? "Editar producto" : "Nuevo producto"}
            </SheetTitle>
            <SheetDescription>Los cambios se verán al instante en la tienda.</SheetDescription>
          </SheetHeader>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div className="mx-auto h-32 w-32 rounded-3xl bg-art p-3">
              <ProductArt art={form.art} />
            </div>
            <div className="flex justify-center gap-2">
              {PALETTES.map((pal, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Colores ${i + 1}`}
                  onClick={() => setForm({ ...form, art: pal })}
                  className={cn(
                    "h-9 w-9 overflow-hidden rounded-full border-2 transition-transform",
                    form.art === pal ? "scale-110 border-gold" : "border-border",
                  )}
                  style={{ background: `linear-gradient(135deg, ${pal.base} 50%, ${pal.secondary} 50%)` }}
                />
              ))}
            </div>
            <FormField label="Nombre">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Camiseta Local 2026"
                className="h-12 rounded-2xl border-border bg-surface"
              />
            </FormField>
            <FormField label="Equipo">
              <Input
                value={form.team}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
                placeholder="Deportivo Cali"
                className="h-12 rounded-2xl border-border bg-surface"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Precio (COP)">
                <Input
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="249900"
                  className="h-12 rounded-2xl border-border bg-surface"
                />
              </FormField>
              <FormField label="Stock">
                <Input
                  inputMode="numeric"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="10"
                  className="h-12 rounded-2xl border-border bg-surface"
                />
              </FormField>
            </div>
            {error && <p className="rounded-xl bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="pitch" size="xl" className="w-full">
              {editing ? "Guardar cambios" : "Crear producto"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="max-w-[340px] rounded-3xl border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl uppercase">¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete ? `${toDelete.team} · ${toDelete.name}` : ""} dejará de aparecer en la tienda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-2xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (toDelete) {
                  deleteProduct(toDelete.id);
                  toast.success("Producto eliminado");
                }
                setToDelete(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone = "pitch",
}: {
  icon: ReactNode;
  value: string;
  label: string;
  tone?: "pitch" | "gold";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <span className={cn("[&_svg]:h-4 [&_svg]:w-4", tone === "gold" ? "text-gold" : "text-primary")}>{icon}</span>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
