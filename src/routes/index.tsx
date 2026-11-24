import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { GolShopLogo, MobileShell } from "@/components/golshop/MobileShell";
import { ProductArt } from "@/components/golshop/ProductArt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRODUCTS } from "@/lib/golshop-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ingresar · GolShop" },
      { name: "description", content: "Ingresa o crea tu cuenta en GolShop, el marketplace de camisetas de fútbol." },
      { property: "og:title", content: "Ingresar · GolShop" },
      { property: "og:description", content: "Ingresa o crea tu cuenta en GolShop, el marketplace de camisetas de fútbol." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthScreen,
});

const heroArt = PRODUCTS[0]!.art;
const sideArt = PRODUCTS[3]!.art;

function AuthScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "registro">("login");
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === "registro" && name.trim().length < 2) return setError("Escribe tu nombre.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Escribe un correo válido.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    setError(null);
    navigate({ to: "/inicio" });
  };

  return (
    <MobileShell nav={false}>
      <section className="relative h-[300px] overflow-hidden pitch-lines">
        <div className="absolute inset-x-0 top-0 flex justify-center pt-8">
          <GolShopLogo />
        </div>
        <div className="absolute left-1/2 top-20 h-48 w-48 -translate-x-1/2">
          <ProductArt art={heroArt} float />
        </div>
        <div className="absolute -right-6 top-36 h-28 w-28 rotate-12 opacity-60">
          <ProductArt art={sideArt} />
        </div>
        <div className="absolute -left-8 top-28 h-24 w-24 -rotate-12 opacity-40">
          <ProductArt art={PRODUCTS[8]!.art} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="animate-rise px-6 pb-10">
        <h1 className="font-display text-4xl font-extrabold uppercase leading-none tracking-wide">
          {mode === "login" ? "¡Bienvenido de vuelta!" : "Únete a la hinchada"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Las camisetas de tu equipo, a un toque de distancia.
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-2xl border border-border bg-card p-1">
          {(["login", "registro"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={cn(
                "h-11 rounded-xl text-sm font-semibold transition-all",
                mode === m ? "bg-pitch text-primary-foreground shadow-glow" : "text-muted-foreground",
              )}
            >
              {m === "login" ? "Ingresar" : "Registrarse"}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          {mode === "registro" && (
            <Field icon={<UserRound />} label="Nombre completo">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Julián Montoya"
                autoComplete="name"
                className="h-14 rounded-2xl border-border bg-surface pl-11 text-base"
              />
            </Field>
          )}
          <Field icon={<Mail />} label="Correo electrónico">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@gmail.com"
              autoComplete="email"
              className="h-14 rounded-2xl border-border bg-surface pl-11 text-base"
            />
          </Field>
          <Field icon={<Lock />} label="Contraseña">
            <Input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="h-14 rounded-2xl border-border bg-surface pl-11 pr-12 text-base"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
            >
              {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </Field>

          {error && (
            <p role="alert" className="rounded-xl bg-destructive/15 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" variant="pitch" size="xl" className="w-full">
            {mode === "login" ? "Ingresar" : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "registro" : "login")}
            className="font-semibold text-gold"
          >
            {mode === "login" ? "Regístrate gratis" : "Ingresa aquí"}
          </button>
        </p>
      </section>
    </MobileShell>
  );
}

function Field({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
        {children}
      </span>
    </label>
  );
}
