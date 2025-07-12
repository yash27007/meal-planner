import { create } from 'zustand';

interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

interface GroceryStore {
  items: GroceryItem[];
  addItem: (item: Omit<GroceryItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<GroceryItem>) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
}

export const useGroceryStore = create<GroceryStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, { ...item, id: Math.random().toString() }]
  })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((item) => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  toggleItem: (id) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    )
  })),
  deleteItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
}));