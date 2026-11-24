import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Camera,
  ChevronRight,
  Heart,
  Loader2,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { MobileShell } from "@/components/golshop/MobileShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil · GolShop" },
      { name: "description", content: "Administra tu foto, tu dirección de envío y tu cuenta de GolShop." },
      { property: "og:title", content: "Mi perfil · GolShop" },
      { property: "og:description", content: "Administra tu foto, tu dirección de envío y tu cuenta de GolShop." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [address, setAddress] = useState("Cra. 43A #1-50, El Poblado, Medellín");
  const [locating, setLocating] = useState(false);

  const detectLocation = () => {
    setLocating(true);
    // Prototipo: simula la detección de ubicación sin servicios externos.
    window.setTimeout(() => {
      setAddress("Calle 10 #43E-25, El Poblado, Medellín, Antioquia");
      setLocating(false);
      toast.success("Ubicación actualizada");
    }, 1200);
  };

  return (
    <MobileShell>
      <section className="relative overflow-hidden px-5 pb-6 pt-10 text-center pitch-lines">
        <div className="relative mx-auto h-28 w-28">
          <div className="h-full w-full rounded-full bg-gold-shine p-1 shadow-gold">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-card">
              {photo ? (
                <img src={photo} alt="Foto de perfil" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-4xl font-extrabold text-gold">JM</span>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="Cambiar foto"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-pitch text-primary-foreground shadow-glow"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPhoto(URL.createObjectURL(file));
            }}
          />
        </div>
        <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-wide">Julián Montoya</h1>
        <p className="text-sm text-muted-foreground">julian.montoya@gmail.com</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
          <ShieldCheck className="h-3.5 w-3.5" /> Hincha Gold
        </span>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Stat value="4" label="Pedidos" />
          <Stat value="7" label="Favoritos" />
          <Stat value="2" label="Reseñas" />
        </div>
      </section>

      <div className="space-y-4 px-5">
        <section className="rounded-3xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dirección de envío</h2>
          </div>
          <div className="flex items-start gap-2">
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              aria-label="Dirección"
              className="min-h-0 flex-1 resize-none rounded-2xl border-border bg-surface text-sm"
            />
            <Button
              variant="gold"
              size="icon-lg"
              aria-label="Usar mi ubicación"
              onClick={detectLocation}
              disabled={locating}
              className="rounded-2xl"
            >
              {locating ? <Loader2 className="animate-spin" /> : <MapPin />}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {locating ? "Obteniendo tu ubicación…" : "Toca el pin para usar tu ubicación actual."}
          </p>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card">
          <MenuLink to="/pedidos" icon={Package} label="Mis pedidos" hint="1 en camino" />
          <MenuLink to="/chat" icon={MessageCircle} label="Mensajes" hint="Tienda Golazo" />
          <MenuLink to="/inicio" icon={Heart} label="Favoritos" />
          <MenuLink to="/admin" icon={ShieldCheck} label="Panel Admin" hint="Vendedor" gold />
        </section>

        <Button
          variant="surface"
          size="xl"
          className="w-full text-destructive hover:bg-destructive/15 hover:text-destructive"
          onClick={() => navigate({ to: "/" })}
        >
          <LogOut className="!h-5 !w-5" /> Cerrar sesión
        </Button>
      </div>
    </MobileShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 py-3 backdrop-blur">
      <p className="font-display text-2xl font-bold text-primary">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function MenuLink({
  to,
  icon: Icon,
  label,
  hint,
  gold,
}: {
  to: "/pedidos" | "/chat" | "/inicio" | "/admin";
  icon: LucideIcon;
  label: string;
  hint?: string;
  gold?: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-b-0 hover:bg-surface"
    >
      <span
        className={
          gold
            ? "flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold"
            : "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"
        }
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
