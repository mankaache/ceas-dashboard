import dayjs from "dayjs";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../config";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { ICategoryType } from "@/models";

export const findSubcategoryByLabel = async (
  categoryType: ICategoryType,
  label: string
) => {
  const q = query(
    collection(firestore, "categories", categoryType, "subcategories"),
    where("label", "==", label)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // return querySnapshot.docs.map((doc) => doc.id); // Return an array of document IDs
    return querySnapshot.docs[0];
  } else {
    throw new Error("Category not found");
  }
};

export const addSubcategory = async (
  categoryType: ICategoryType,
  categoryData: { label: string; value: string }
) => {
  const subCollectionRef = collection(
    firestore,
    "categories",
    categoryType,
    "subcategories"
  );
  await addDoc(subCollectionRef, {
    ...categoryData,
    createdAt: dayjs().toISOString(),
    modifiedAt: dayjs().toISOString(),
  });
};

export const useSubcategories = (categoryType: ICategoryType) => {
  const subcategoryRef = collection(
    firestore,
    "categories",
    categoryType,
    "subcategories"
  );
  const queryCategories = query(subcategoryRef, orderBy("label", "asc"));
  return useCollection(queryCategories);
};

export const deleteSubcategory = async (
  categoryType: ICategoryType,
  categoryId: string
) => {
  const subcategoryRef = doc(
    firestore,
    "categories",
    categoryType,
    "subcategories",
    categoryId
  );

  await deleteDoc(subcategoryRef);
};

export const updateSubcategory = async (
  categoryType: ICategoryType,
  categoryId: string,
  categoryData: { label: string; value: string }
) => {
  const subcategoryRef = doc(
    firestore,
    "categories",
    categoryType,
    "subcategories",
    categoryId
  );
  await updateDoc(subcategoryRef, {
    ...categoryData,
    modifiedAt: dayjs().toISOString(),
  });
};
