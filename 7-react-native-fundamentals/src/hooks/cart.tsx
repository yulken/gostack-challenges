import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const updateContext = async (cart: Product[]): Promise<void> => {
    setProducts(cart);
    await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(cart));
  };

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const cart = await AsyncStorage.getItem('@GoMarketplace:cart');
      if (cart) {
        setProducts(JSON.parse(cart));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      if (!products.find(element => element.id === product.id)) {
        const item = product;
        item.quantity = 1;
        const newProducts = [...products, item];
        updateContext(newProducts);
      } else {
        const newProducts = products.map((element: Product) => {
          const elem = element;
          if (element.id === product.id) {
            elem.quantity += 1;
          }
          return elem;
        });
        updateContext(newProducts);
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const newProducts = products.map((element: Product) =>
        element.id === id
          ? { ...element, quantity: element.quantity + 1 }
          : element,
      );
      updateContext(newProducts);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const newProducts = products.map((element: Product) =>
        element.id === id
          ? { ...element, quantity: element.quantity - 1 }
          : element,
      );

      updateContext(newProducts);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
