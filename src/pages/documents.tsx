import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";
import { IDocument } from "@/models";
import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

const DocumentList = dynamic(() =>
  import("@/components/pages/documents").then((mod) => mod.DocumentList)
);

const DocumentForm = dynamic(() =>
  import("@/components/pages/documents").then((mod) => mod.DocumentForm)
);

export default function Documents() {
  //   const [documents, setDocuments] = React.useState(DOCUMENTS);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentDocument, setCurrentDocument] =
    React.useState<DocumentSnapshot<IDocument> | null>(null);

  const handleEditClick = (document?: QueryDocumentSnapshot<IDocument>) => {
    if (document) setCurrentDocument(document);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setCurrentDocument(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setCurrentDocument(null);
    setIsEditing(false);
  };

  const handleDeleteClick = (document: QueryDocumentSnapshot<IDocument>) => {};
  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center w-full h-full max-w-screen-xl mx-auto">
        {isEditing ? (
          <DocumentForm
            // @ts-ignore
            document={currentDocument}
            onCancel={handleCancelClick}
            onSave={handleSave}
          />
        ) : (
          <DocumentList
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
