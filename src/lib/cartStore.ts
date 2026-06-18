import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  toggleDrawer: (open?: boolean) => void;
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      
      toggleDrawer: (open) => 
        set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen })),
      
      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.cart.findIndex((item) => item.id === newItem.id);
          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex].qty += 1;
            return { cart: updatedCart, isOpen: true };
          }
          return { cart: [...state.cart, { ...newItem, qty: 1 }], isOpen: true };
        }),
      
      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      
      updateQty: (id, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { cart: state.cart.filter((item) => item.id !== id) };
          }
          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, qty } : item
            ),
          };
        }),
      
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'kedaiubiungu_cart_storage', // Name of the local storage key
    }
  )
);
