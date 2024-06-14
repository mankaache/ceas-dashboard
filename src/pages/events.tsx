import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";
import { IEvent } from "@/models";
import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

const EventList = dynamic(() =>
  import("@/components/pages/events").then((mod) => mod.EventList)
);

const EventForm = dynamic(() =>
  import("@/components/pages/events").then((mod) => mod.EventForm)
);

export default function Events() {
  //   const [events, setEvents] = React.useState(EVENTS);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentEvent, setCurrentEvent] =
    React.useState<DocumentSnapshot<IEvent> | null>(null);

  const handleEditClick = (event?: QueryDocumentSnapshot<IEvent>) => {
    if (event) setCurrentEvent(event);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setCurrentEvent(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setCurrentEvent(null);
    setIsEditing(false);
  };

  const handleDeleteClick = (event: QueryDocumentSnapshot<IEvent>) => {};
  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center h-full mx-auto">
        {isEditing ? (
          <EventForm
            // @ts-ignore
            event={currentEvent}
            onCancel={handleCancelClick}
            onSave={handleSave}
          />
        ) : (
          <EventList
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
