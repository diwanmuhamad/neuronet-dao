"use client";

export interface CartItem {
  id: number;
  name: string;
  imageUrl: string;
  price: number; // price in ICP
  quantity: number;
}

const CART_STORAGE_KEY = "neuronet_cart_items";
const CART_EVENT = "neuronet_cart_change";
const MAX_ITEMS = 20;

function safeParse(json: string | null): CartItem[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data)) {
      return data.filter((x) =>
        x && typeof x.id === "number" && typeof x.name === "string"
      );
    }
    return [];
  } catch {
    return [];
  }
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse(window.localStorage.getItem(CART_STORAGE_KEY));
  // Coerce types defensively in case of BigInt/string contamination
  return parsed.map((i: any) => ({
    id: Number(i.id),
    name: String(i.name ?? ""),
    imageUrl: String(i.imageUrl ?? ""),
    price: Number(i.price),
    quantity: Math.max(1, Number(i.quantity ?? 1)),
  }));
}

function setCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return;
  // Sanitize and serialize, converting any accidental BigInt to string
  const sanitized = items.map((i) => ({
    id: Number((i as any).id),
    name: String((i as any).name ?? ""),
    imageUrl: String((i as any).imageUrl ?? ""),
    price: Number((i as any).price),
    quantity: Math.max(1, Number((i as any).quantity ?? 1)),
  }));
  const replacer = (_key: string, value: any) =>
    typeof value === "bigint" ? value.toString() : value;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(sanitized, replacer));
  const event = new CustomEvent(CART_EVENT, { detail: { items } });
  window.dispatchEvent(event);
}

export function addItemToCart(item: Omit<CartItem, "quantity"> & { quantity?: number }): { ok: boolean; reason?: string } {
  const items = getCartItems();
  const exists = items.find((i) => i.id === item.id);
  if (!exists && items.length >= MAX_ITEMS) {
    return { ok: false, reason: "Cart is full (max 20 items)." };
  }
  if (exists) {
    // Quantity is locked to 1; do nothing if already exists
    setCartItems(items);
    return { ok: true };
  }
  const newItem: CartItem = {
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    price: item.price,
    quantity: 1,
  };
  setCartItems([newItem, ...items]);
  return { ok: true };
}

export function removeItemFromCart(itemId: number) {
  const items = getCartItems().filter((i) => i.id !== itemId);
  setCartItems(items);
}

export function updateItemQuantity(itemId: number, quantity: number) {
  // Quantity is locked to 1; allow 0 to remove item
  const clamped = quantity <= 0 ? 0 : 1;
  let items = getCartItems().map((i) => (i.id === itemId ? { ...i, quantity: clamped } : i));
  items = items.filter((i) => i.quantity > 0);
  setCartItems(items);
}

export function clearCart() {
  setCartItems([]);
}

export function getCartTotals() {
  const items = getCartItems();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { subtotal, itemCount };
}

export function onCartChange(handler: (items: CartItem[]) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => {
    const ce = e as CustomEvent;
    handler(ce.detail?.items ?? getCartItems());
  };
  window.addEventListener(CART_EVENT, listener as EventListener);
  // also sync on storage events (e.g., other tabs)
  const storageListener = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
      handler(getCartItems());
    }
  };
  window.addEventListener("storage", storageListener);
  return () => {
    window.removeEventListener(CART_EVENT, listener as EventListener);
    window.removeEventListener("storage", storageListener);
  };
}


