import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";
import { IArticle } from "@/models";
import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

const ArticleList = dynamic(() =>
  import("@/components/pages/articles").then((mod) => mod.ArticleList)
);

const ArticleForm = dynamic(() =>
  import("@/components/pages/articles").then((mod) => mod.ArticleForm)
);

export default function Articles() {
  //   const [articles, setArticles] = React.useState(ARTICLES);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentArticle, setCurrentArticle] =
    React.useState<DocumentSnapshot<IArticle> | null>(null);

  const handleEditClick = (article?: QueryDocumentSnapshot<IArticle>) => {
    if (article) setCurrentArticle(article);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setCurrentArticle(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setCurrentArticle(null);
    setIsEditing(false);
  };

  const handleDeleteClick = (article: QueryDocumentSnapshot<IArticle>) => {};
  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center h-full mx-auto">
        {isEditing ? (
          <ArticleForm
            // @ts-ignore
            article={currentArticle}
            onCancel={handleCancelClick}
            onSave={handleSave}
          />
        ) : (
          <ArticleList
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
