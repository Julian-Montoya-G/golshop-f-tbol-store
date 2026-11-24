import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { ChevronLeft, House, MessageCircle, ShoppingBag, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/golshop-store";
import { cn } from "@/lib/utils";

/** Marco móvil de 390px que centra la app en pantallas grandes. */
export function MobileShell({
  children,
  nav = true,
  className,
}: {
  children: ReactNode;
  nav?: boolean;
  className?: string;
}) {
  return (
    <div className="min-h-dvh bg-backdrop">
      <div
        className={cn(
          "relative mx-auto min-h-dvh w-full max-w-[390px] overflow-x-hidden bg-stage shadow-card",
          nav && "pb-28",
          className,
        )}
      >
        {children}
        {nav && <BottomNav />}
      </div>
    </div>
  );
}

const TABS = [
  { to: "/inicio", label: "Inicio", icon: House, match: ["/inicio", "/producto"] },
  { to: "/carrito", label: "Carrito", icon: ShoppingBag, match: ["/carrito"] },
  { to: "/chat", label: "Chat", icon: MessageCircle, match: ["/chat"] },
  { to: "/perfil", label: "Perfil", icon: UserRound, match: ["/perfil", "/pedidos", "/admin"] },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const { cartCount } = useStore();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[390px] px-3 pb-3">
      <div className="flex items-center justify-around rounded-3xl border border-border bg-card/90 px-2 py-2 shadow-card backdrop-blur-xl">
        {TABS.map((tab) => {
          const active = tab.match.some((m) => pathname.startsWith(m));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-semibold transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "relative flex h-8 w-12 items-center justify-center rounded-full transition-all",
                  active && "bg-primary/15",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {tab.to === "/carrito" && cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-shine px-1 text-[10px] font-bold text-gold-foreground">
                    {cartCount}
                  </span>
                )}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  back = true,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/80 px-5 pb-3 pt-6 backdrop-blur-xl">
      {back && (
        <Button
          variant="surface"
          size="icon-lg"
          aria-label="Volver"
          onClick={() => router.history.back()}
        >
          <ChevronLeft />
        </Button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-2xl font-bold uppercase tracking-wide">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function GolShopLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pitch shadow-glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-foreground" />
          <polygon points="12,7.5 16,10.4 14.5,15 9.5,15 8,10.4" className="fill-primary-foreground" />
        </svg>
      </span>
      <span className="font-display text-2xl font-extrabold uppercase italic tracking-wide">
        Gol<span className="text-gold-shine">Shop</span>
      </span>
    </span>
  );
}
