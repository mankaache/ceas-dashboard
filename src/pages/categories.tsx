import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";
import { ICategory, ICategoryType } from "@/models";
import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

const CategoryList = dynamic(() =>
  import("@/components/pages/categories").then((mod) => mod.CategoryList)
);

const CategoryForm = dynamic(() =>
  import("@/components/pages/categories").then((mod) => mod.CategoryForm)
);

export default function Categories() {
  //   const [categories, setCategories] = React.useState(CATEGORieS);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentCategory, setCurrentCategory] =
    React.useState<DocumentSnapshot<ICategory> | null>(null);
  const [currentCategoryType, setCurrentCategoryType] =
    React.useState<ICategoryType>();

  const handleEditClick = (
    categoryType: ICategoryType,
    category?: QueryDocumentSnapshot<ICategory>
  ) => {
    if (category) setCurrentCategory(category);
    if (categoryType) setCurrentCategoryType(categoryType);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setCurrentCategory(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setCurrentCategory(null);
    setIsEditing(false);
  };

  const handleDeleteClick = (category: QueryDocumentSnapshot<ICategory>) => {};
  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center w-full h-full max-w-screen-xl mx-auto">
        {isEditing ? (
          <CategoryForm
            // @ts-ignore
            category={currentCategory}
            categoryType={currentCategoryType}
            onCancel={handleCancelClick}
            onSave={handleSave}
          />
        ) : (
          <CategoryList
            // @ts-ignore
            onEditClick={handleEditClick}
            // @ts-ignore
            onDeleteClick={handleDeleteClick}
          />
        )}
      </div>
    </BaseLayout>
  );
}
