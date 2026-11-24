import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MobileShell, PageHeader } from "@/components/golshop/MobileShell";
import { ProductArt } from "@/components/golshop/ProductArt";
import { Button } from "@/components/ui/button";
import { INITIAL_MESSAGES, PRODUCTS, formatCOP, type ChatMessage } from "@/lib/golshop-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat con el vendedor · GolShop" },
      { name: "description", content: "Habla directamente con el vendedor sobre tallas, envíos y disponibilidad." },
      { property: "og:title", content: "Chat con el vendedor · GolShop" },
      { property: "og:description", content: "Habla directamente con el vendedor sobre tallas, envíos y disponibilidad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatScreen,
});

const REPLIES = [
  "¡Claro que sí! Te lo confirmo en un momento 👌",
  "Tenemos todas las tallas originales con garantía.",
  "Si compras hoy, te llega antes del partido del domingo ⚽",
  "Con gusto, cualquier otra duda me cuentas.",
];

const QUICK = ["¿Tienen talla XL?", "¿Hacen envíos a Bogotá?", "¿Es original?"];

function nowTime() {
  const d = new Date();
  return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const replyIndex = useRef(0);
  const product = PRODUCTS[0]!;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: "me", text: clean, time: nowTime() }]);
    setText("");
    setTyping(true);
    window.setTimeout(() => {
      const reply = REPLIES[replyIndex.current % REPLIES.length]!;
      replyIndex.current += 1;
      setTyping(false);
      setMessages((m) => [...m, { id: crypto.randomUUID(), from: "seller", text: reply, time: nowTime() }]);
    }, 1400);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(text);
  };

  return (
    <MobileShell className="pb-48">
      <PageHeader
        title="Tienda Golazo"
        subtitle="● En línea · responde en minutos"
        action={
          <Button variant="surface" size="icon-lg" aria-label="Llamar al vendedor">
            <Phone />
          </Button>
        }
      />

      <div className="px-5">
        <Link
          to="/producto/$id"
          params={{ id: product.id }}
          className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-2.5"
        >
          <div className="h-12 w-12 shrink-0 rounded-xl bg-art p-1">
            <ProductArt art={product.art} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {product.team} · {product.name}
            </p>
            <p className="font-display text-base font-bold text-gold">{formatCOP(product.price)}</p>
          </div>
          <span className="pr-2 text-xs font-semibold text-gold">Ver</span>
        </Link>

        <p className="my-5 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Hoy
        </p>

        <div className="space-y-2.5">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex animate-rise", m.from === "me" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[78%] px-4 py-2.5 text-sm leading-snug shadow-card",
                  m.from === "me"
                    ? "rounded-3xl rounded-br-md bg-pitch text-primary-foreground"
                    : "rounded-3xl rounded-bl-md border border-border bg-card text-card-foreground",
                )}
              >
                <p>{m.text}</p>
                <p
                  className={cn(
                    "mt-1 text-right text-[10px]",
                    m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {m.time}
                </p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-3xl rounded-bl-md border border-border bg-card px-4 py-3.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[92px] z-30 mx-auto w-full max-w-[390px] px-4">
        <div className="mb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="shrink-0 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 rounded-full border border-border bg-surface p-1.5 pl-5 shadow-card"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un mensaje…"
            aria-label="Mensaje"
            className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Enviar"
            disabled={!text.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pitch text-primary-foreground shadow-glow transition-opacity disabled:opacity-40"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </form>
      </div>
    </MobileShell>
  );
}
