import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";
import { ITrainingProgram } from "@/models";
import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

const TrainingProgramList = dynamic(() =>
  import("@/components/pages/training-programs").then(
    (mod) => mod.TrainingProgramList
  )
);

const TrainingProgramForm = dynamic(() =>
  import("@/components/pages/training-programs").then(
    (mod) => mod.TrainingProgramForm
  )
);

export default function TrainingPrograms() {
  //   const [trainingPrograms, setTrainingPrograms] = React.useState(TRAININGPROGRAMS);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentTrainingProgram, setCurrentTrainingProgram] =
    React.useState<DocumentSnapshot<ITrainingProgram> | null>(null);

  const handleEditClick = (
    trainingProgram?: QueryDocumentSnapshot<ITrainingProgram>
  ) => {
    if (trainingProgram) setCurrentTrainingProgram(trainingProgram);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setCurrentTrainingProgram(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setCurrentTrainingProgram(null);
    setIsEditing(false);
  };

  const handleDeleteClick = (
    trainingProgram: QueryDocumentSnapshot<ITrainingProgram>
  ) => {};
  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center h-full mx-auto">
        {isEditing ? (
          <TrainingProgramForm
            // @ts-ignore
            trainingProgram={currentTrainingProgram}
            onCancel={handleCancelClick}
            onSave={handleSave}
          />
        ) : (
          <TrainingProgramList
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
