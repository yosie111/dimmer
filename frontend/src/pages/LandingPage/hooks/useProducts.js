import { useCallback, useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL || '';

export function useProducts({ limit = 4 } = {}) {
  const [products, setProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/products?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data?.success) {
        const list = (data.data || []).slice(0, limit);
        setProducts(list);
        setActiveImage(0);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const activeProduct = products[activeImage] ?? null;

  return {
    products,
    activeImage,
    setActiveImage,
    activeProduct,
    refetchProducts: fetchProducts,
  };
}