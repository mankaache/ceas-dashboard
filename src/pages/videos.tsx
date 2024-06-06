import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";
import { IVideo } from "@/models";
import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

const VideoList = dynamic(() =>
  import("@/components/pages/videos").then((mod) => mod.VideoList)
);

const VideoForm = dynamic(() =>
  import("@/components/pages/videos").then((mod) => mod.VideoForm)
);

export default function Videos() {
  //   const [videos, setVideos] = React.useState(VIDEOS);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentVideo, setCurrentVideo] =
    React.useState<DocumentSnapshot<IVideo> | null>(null);

  const handleEditClick = (video?: QueryDocumentSnapshot<IVideo>) => {
    if (video) setCurrentVideo(video);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setCurrentVideo(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setCurrentVideo(null);
    setIsEditing(false);
  };

  const handleDeleteClick = (video: QueryDocumentSnapshot<IVideo>) => {};
  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center w-full h-full max-w-screen-xl mx-auto">
        {isEditing ? (
          <VideoForm
            // @ts-ignore
            video={currentVideo}
            onCancel={handleCancelClick}
            onSave={handleSave}
          />
        ) : (
          <VideoList
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
