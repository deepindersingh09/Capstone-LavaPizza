// services/MenuService.js
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export const getAvailableMenuItems = async () => {
  const q = query(
    collection(db, "menuItems"),
    where("available", "==", true),
    orderBy("category"),
    orderBy("name")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getMenuByCategory = async (category) => {
  const q = query(
    collection(db, "menuItems"),
    where("category", "==", category),
    where("available", "==", true),
    orderBy("name")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getPopularItems = async () => {
  const q = query(
    collection(db, "menuItems"),
    where("popular", "==", true),
    where("available", "==", true)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
