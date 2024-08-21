import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";
import { IAlumini } from "@/models";
import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

const AluminiList = dynamic(() =>
  import("@/components/pages/alumini").then((mod) => mod.AluminiList)
);

const AluminiForm = dynamic(() =>
  import("@/components/pages/alumini").then((mod) => mod.AluminiForm)
);

export default function Alumini() {
  //   const [documents, setDocuments] = React.useState(DOCUMENTS);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentDocument, setCurrentDocument] =
    React.useState<DocumentSnapshot<IAlumini> | null>(null);

  const handleEditClick = (alumini?: QueryDocumentSnapshot<IAlumini>) => {
    if (alumini) setCurrentDocument(alumini);
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

  const handleDeleteClick = (alumini: QueryDocumentSnapshot<IAlumini>) => {};

  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center w-full h-full max-w-screen-xl mx-auto">
        {isEditing ? (
          <AluminiForm
            // @ts-ignore
            document={currentDocument}
            onCancel={handleCancelClick}
            onSave={handleSave}
          />
        ) : (
          <AluminiList
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

