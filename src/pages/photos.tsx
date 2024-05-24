import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";
import { IPhoto } from "@/models";
import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

const PhotoList = dynamic(() =>
  import("@/components/pages/photos").then((mod) => mod.PhotoList)
);

const PhotoForm = dynamic(() =>
  import("@/components/pages/photos").then((mod) => mod.PhotoForm)
);

export default function Photos() {
  //   const [photos, setPhotos] = React.useState(PHOTOS);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentPhoto, setCurrentPhoto] =
    React.useState<DocumentSnapshot<IPhoto> | null>(null);

  const handleEditClick = (photo?: QueryDocumentSnapshot<IPhoto>) => {
    if (photo) setCurrentPhoto(photo);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setCurrentPhoto(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setCurrentPhoto(null);
    setIsEditing(false);
  };

  const handleDeleteClick = (photo: QueryDocumentSnapshot<IPhoto>) => {
    // const updatedPhotos = photos.filter((p) => p !== photo);
    // setPhotos(updatedPhotos);
  };
  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center w-full h-full max-w-screen-xl mx-auto">
        {isEditing ? (
          <PhotoForm
            // @ts-ignore
            photo={currentPhoto}
            onCancel={handleCancelClick}
            onSave={handleSave}
          />
        ) : (
          <PhotoList
            // @ts-ignore
            onEditClick={handleEditClick}
            // @ts-ignore
            onDeleteClick={handleDeleteClick}
          />
        )}

        {/* <PhotoForm
          photo={currentPhoto}
          onCancel={handleCancelClick}
          onSave={handleSave}
          setShowPhotoForm={setShowPhotoForm}
        /> */}
      </div>
    </BaseLayout>
  );
}
