import dayjs from "dayjs";
import { addDoc, collection, orderBy, query } from "firebase/firestore";
import { firestore } from "../config";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";

export const addSubcategory = async (
  categoryType: "photos" | "videos" | "documents",
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
    createdAt: dayjs().format("YYYY-MM-DD hh:mm A"),
    modifiedAt: dayjs().format("YYYY-MM-DD hh:mm A"),
  });
};

export const getSubcategories = (
  categoryType: "photos" | "videos" | "documents"
) => {
  const subcategoryRef = collection(
    firestore,
    "categories",
    categoryType,
    "subcategories"
  );
  const queryCategories = query(subcategoryRef, orderBy("label", "asc"));
  //   const [categories, loading, error] = useCollection(queryCategories);
  return useCollection(queryCategories);

  //   return [categories, loading, error ];
};
