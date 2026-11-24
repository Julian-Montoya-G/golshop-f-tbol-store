export type ArtPattern = "solid" | "stripes" | "hoops" | "band" | "sash" | "ball" | "scarf";

export interface Product {
  id: string;
  name: string;
  team: string;
  category: "Camiseta" | "Accesorio";
  price: number;
  oldPrice?: number;
  sizes: string[];
  stock: number;
  rating: number;
  badge?: string;
  description: string;
  art: { base: string; secondary: string; trim: string; pattern: ArtPattern };
}

export const SIZES = ["S", "M", "L", "XL"] as const;

export const PRODUCTS: Product[] = [
  {
    id: "colombia-local-2026",
    name: "Camiseta Local 2026",
    team: "Colombia",
    category: "Camiseta",
    price: 329900,
    oldPrice: 389900,
    sizes: ["S", "M", "L", "XL"],
    stock: 24,
    rating: 4.9,
    badge: "Mundial",
    description:
      "La amarilla de la Selección para el Mundial 2026. Tela transpirable de secado rápido y escudo bordado.",
    art: { base: "#F7C600", secondary: "#F7C600", trim: "#1D3C8F", pattern: "solid" },
  },
  {
    id: "real-madrid-local",
    name: "Camiseta Local 25/26",
    team: "Real Madrid",
    category: "Camiseta",
    price: 359900,
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    rating: 4.8,
    badge: "Top ventas",
    description: "Blanco clásico con detalles dorados. Corte ajustado tipo jugador.",
    art: { base: "#F5F5F0", secondary: "#F5F5F0", trim: "#C9A227", pattern: "solid" },
  },
  {
    id: "barcelona-local",
    name: "Camiseta Local 25/26",
    team: "FC Barcelona",
    category: "Camiseta",
    price: 349900,
    sizes: ["M", "L", "XL"],
    stock: 9,
    rating: 4.7,
    description: "Las franjas blaugrana de siempre con tecnología de ventilación.",
    art: { base: "#A50044", secondary: "#004D98", trim: "#EDBB00", pattern: "stripes" },
  },
  {
    id: "nacional-local",
    name: "Camiseta Local 2026",
    team: "Atlético Nacional",
    category: "Camiseta",
    price: 249900,
    sizes: ["S", "M", "L", "XL"],
    stock: 30,
    rating: 4.9,
    badge: "Nuevo",
    description: "El verde y blanco del Verdolaga. Edición oficial Liga BetPlay.",
    art: { base: "#FFFFFF", secondary: "#0B8A3E", trim: "#0B8A3E", pattern: "stripes" },
  },
  {
    id: "millonarios-local",
    name: "Camiseta Local 2026",
    team: "Millonarios",
    category: "Camiseta",
    price: 239900,
    sizes: ["S", "M", "L"],
    stock: 4,
    rating: 4.6,
    description: "Azul embajador con cuello en V blanco. Edición oficial.",
    art: { base: "#1846A3", secondary: "#1846A3", trim: "#FFFFFF", pattern: "solid" },
  },
  {
    id: "argentina-local",
    name: "Camiseta Local 2026",
    team: "Argentina",
    category: "Camiseta",
    price: 339900,
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    rating: 4.8,
    description: "Las franjas celestes y blancas de la campeona del mundo.",
    art: { base: "#FFFFFF", secondary: "#6CACE4", trim: "#1B2A4A", pattern: "stripes" },
  },
  {
    id: "boca-local",
    name: "Camiseta Local 25/26",
    team: "Boca Juniors",
    category: "Camiseta",
    price: 299900,
    sizes: ["M", "L", "XL"],
    stock: 7,
    rating: 4.7,
    description: "Azul y oro con la franja horizontal que la hace única.",
    art: { base: "#0B2A6F", secondary: "#F2B705", trim: "#F2B705", pattern: "band" },
  },
  {
    id: "america-local",
    name: "Camiseta Local 2026",
    team: "América de Cali",
    category: "Camiseta",
    price: 239900,
    sizes: ["S", "M", "L", "XL"],
    stock: 18,
    rating: 4.6,
    description: "El rojo de la Mechita, con banda diagonal en el pecho.",
    art: { base: "#C8102E", secondary: "#8A0A1F", trim: "#FFFFFF", pattern: "sash" },
  },
  {
    id: "balon-mundial",
    name: "Balón Oficial Mundial 2026",
    team: "Accesorios",
    category: "Accesorio",
    price: 189900,
    sizes: ["Única"],
    stock: 40,
    rating: 4.9,
    description: "Balón talla 5 con costura térmica, ideal para cancha sintética y natural.",
    art: { base: "#FFFFFF", secondary: "#0F1F18", trim: "#1FB35A", pattern: "ball" },
  },
  {
    id: "bufanda-nacional",
    name: "Bufanda Verdolaga",
    team: "Accesorios",
    category: "Accesorio",
    price: 69900,
    sizes: ["Única"],
    stock: 52,
    rating: 4.5,
    description: "Bufanda tejida para alentar en el Atanasio Girardot.",
    art: { base: "#0B8A3E", secondary: "#FFFFFF", trim: "#0B8A3E", pattern: "scarf" },
  },
];

export const TEAM_FILTERS = [
  "Todos",
  "Colombia",
  "Atlético Nacional",
  "Millonarios",
  "América de Cali",
  "Real Madrid",
  "FC Barcelona",
  "Argentina",
  "Boca Juniors",
  "Accesorios",
];

export type OrderStatus = "Entregado" | "En camino" | "Preparando" | "Cancelado";

export interface Order {
  id: string;
  date: string;
  items: { productId: string; size: string; qty: number }[];
  total: number;
  status: OrderStatus;
  progress: number;
}

export const ORDERS: Order[] = [
  {
    id: "GS-10482",
    date: "22 nov 2026",
    items: [
      { productId: "colombia-local-2026", size: "M", qty: 1 },
      { productId: "balon-mundial", size: "Única", qty: 1 },
    ],
    total: 519800,
    status: "En camino",
    progress: 66,
  },
  {
    id: "GS-10431",
    date: "18 nov 2026",
    items: [{ productId: "nacional-local", size: "L", qty: 2 }],
    total: 499800,
    status: "Preparando",
    progress: 33,
  },
  {
    id: "GS-10377",
    date: "02 nov 2026",
    items: [{ productId: "real-madrid-local", size: "M", qty: 1 }],
    total: 359900,
    status: "Entregado",
    progress: 100,
  },
  {
    id: "GS-10290",
    date: "15 oct 2026",
    items: [{ productId: "bufanda-nacional", size: "Única", qty: 1 }],
    total: 69900,
    status: "Cancelado",
    progress: 0,
  },
];

export interface ChatMessage {
  id: string;
  from: "me" | "seller";
  text: string;
  time: string;
}

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    from: "seller",
    text: "¡Hola Julián! Bienvenido a Tienda Golazo ⚽ ¿En qué te puedo ayudar?",
    time: "9:12",
  },
  {
    id: "m2",
    from: "me",
    text: "Hola, ¿la camiseta de Colombia 2026 talla M todavía está disponible?",
    time: "9:13",
  },
  {
    id: "m3",
    from: "seller",
    text: "Sí señor, nos quedan 24 unidades. Además tiene 15% de descuento esta semana.",
    time: "9:14",
  },
  { id: "m4", from: "me", text: "¿Cuánto se demora el envío a Medellín?", time: "9:15" },
  {
    id: "m5",
    from: "seller",
    text: "Entre 1 y 2 días hábiles. Te llega con número de guía para que la rastrees.",
    time: "9:15",
  },
];

export const SHIPPING_COST = 12000;
export const FREE_SHIPPING_FROM = 400000;

/** Formato de pesos colombianos sin decimales: 329900 -> "$329.900" */
export function formatCOP(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}$${digits}`;
}

export function shippingFor(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
}
