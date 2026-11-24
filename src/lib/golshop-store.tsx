import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, shippingFor, type Product } from "./golshop-data";

export interface CartItem {
  productId: string;
  size: string;
  qty: number;
}

interface StoreValue {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (productId: string, size: string, qty?: number) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const StoreContext = createContext<StoreValue | null>(null);

const INITIAL_CART: CartItem[] = [
  { productId: "colombia-local-2026", size: "M", qty: 1 },
  { productId: "nacional-local", size: "L", qty: 2 },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);

  const value = useMemo<StoreValue>(() => {
    const getProduct = (id: string) => products.find((p) => p.id === id);
    const subtotal = cart.reduce((sum, item) => {
      const p = getProduct(item.productId);
      return p ? sum + p.price * item.qty : sum;
    }, 0);
    const shipping = shippingFor(subtotal);
    return {
      products,
      getProduct,
      saveProduct: (product) =>
        setProducts((prev) =>
          prev.some((p) => p.id === product.id)
            ? prev.map((p) => (p.id === product.id ? product : p))
            : [product, ...prev],
        ),
      deleteProduct: (id) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setCart((prev) => prev.filter((c) => c.productId !== id));
      },
      cart,
      addToCart: (productId, size, qty = 1) =>
        setCart((prev) => {
          const existing = prev.find((c) => c.productId === productId && c.size === size);
          if (existing) {
            return prev.map((c) => (c === existing ? { ...c, qty: c.qty + qty } : c));
          }
          return [...prev, { productId, size, qty }];
        }),
      setQty: (productId, size, qty) =>
        setCart((prev) =>
          qty <= 0
            ? prev.filter((c) => !(c.productId === productId && c.size === size))
            : prev.map((c) => (c.productId === productId && c.size === size ? { ...c, qty } : c)),
        ),
      removeFromCart: (productId, size) =>
        setCart((prev) => prev.filter((c) => !(c.productId === productId && c.size === size))),
      clearCart: () => setCart([]),
      cartCount: cart.reduce((n, c) => n + c.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [products, cart]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
