import { useState, useEffect } from "react";
import {
  subscribeToMenuItems,
  subscribeToMenuItemsByCategory,
  subscribeToMenuItem,
} from "../services/firestoreService";

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMenuItems(
      (items) => {
        setMenuItems(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { menuItems, loading, error };
};

export const useMenuByCategory = (categoryId: string) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToMenuItemsByCategory(
      categoryId,
      (fetchedItems) => {
        // Filter to only show active items (isActive instead of available)
        const activeItems = fetchedItems.filter((item) => item.isActive !== false);
        setItems(activeItems);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [categoryId]);

  return { items, loading, error };
};

export const useMenuItem = (itemId: string) => {
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToMenuItem(itemId, (fetchedItem) => {
      setItem(fetchedItem);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [itemId]);

  return { item, loading, error };
};
