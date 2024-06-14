import React from "react";
import Image from "next/image";
import { PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { MdEdit } from "react-icons/md";
import { ITrainingProgram } from "@/models";
import { motion } from "framer-motion";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  DocumentSnapshot,
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { InnerPageLoader } from "@/components/loaders";
import dynamic from "next/dynamic";
import { InnerPageError } from "@/components/errors";
import { IoDocumentTextOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { CONSTANTS } from "@/data";
import { format } from "date-fns";

const DeleteTrainingProgram = dynamic(
  () =>
    import("@/components/pages/training-programs").then(
      (mod) => mod.DeleteTrainingProgram
    ),
  { ssr: false }
);

export const TrainingProgramList: React.FC<{
  onEditClick: (trainingProgram?: DocumentSnapshot<ITrainingProgram>) => void;
  onDeleteClick: (trainingProgram: DocumentSnapshot<ITrainingProgram>) => void;
}> = ({ onDeleteClick, onEditClick }) => {
  const trainingProgramsQuery = query(
    collection(firestore, "training-programs"),
    orderBy("modifiedAt", "desc")
  );
  const [value, loading, error] = useCollection(trainingProgramsQuery, {
    snapshotListenOptions: { includeMetadataChanges: false },
  });

  if (loading) {
    return <InnerPageLoader loading={loading} />;
  }

  if (error) {
    return <InnerPageError error={error} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="w-full fade-enter fade-enter-active">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="title">
            <CardTitle>Programmes de formation</CardTitle>
            <CardDescription>
              Gérer et afficher vos programmes de formation
            </CardDescription>
          </div>

          <div className="add mr-4">
            <Button
              type="button"
              variant="default"
              onClick={() => onEditClick()}
              className="flex gap-2 items-center justify-center"
            >
              <PlusCircle />
              Ajouter un programme de formation
            </Button>
          </div>
        </CardHeader>

        {!Boolean(value?.docs.length) ? (
          <div className="mx-auto my-4 w-full flex items-center justify-center">
            <p className="text-3xl p-4">Pas de programmes de formation</p>
          </div>
        ) : (
          <CardContent className="max-w-full overflow-x-auto">
            <Table className="table-auto min-w-full text-center">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center hidden w-[100px] sm:table-cell">
                    Aperçu
                  </TableHead>
                  <TableHead className="text-center">Titre</TableHead>
                  <TableHead className="text-center">Extrait</TableHead>
                  <TableHead className="text-center">Lieu</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Catégorie</TableHead>
                  <TableHead className="text-center">Étiqueter</TableHead>
                  {/* <TableHead className="text-center">Auteur</TableHead> */}
                  <TableHead className="text-center">Statut</TableHead>
                  {/* <TableHead className="text-center">Créé à</TableHead> */}
                  <TableHead className="text-center">Modifié à</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {value?.docs.map((trainingProgram, idx) => (
                  <TableRow
                    key={trainingProgram.id}
                    className={cn(
                      idx % 2 == 0 ? "bg-gray-50" : "white",
                      "[&]:text-center"
                    )}
                  >
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        // @ts-ignore
                        src={trainingProgram.data().image.src}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        alt={trainingProgram.data().image.caption}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium min-w-[250px] max-w-sm">
                      {trainingProgram.data().title}
                    </TableCell>
                    <TableCell className="font-medium min-w-[250px] max-w-sm">
                      {trainingProgram.data().excerpt}
                    </TableCell>
                    <TableCell className="font-medium min-w-[160px] max-w-sm">
                      {trainingProgram.data().location}
                    </TableCell>
                    <TableCell className="font-medium min-w-[150px] max-w-sm">
                      {format(trainingProgram.data().date, "PPP")}
                    </TableCell>
                    <TableCell className="font-medium min-w-[150px] max-w-sm">
                      {trainingProgram.data().category}
                    </TableCell>
                    <TableCell className="font-medium min-w-[150px] max-w-sm">
                      {trainingProgram
                        .data()
                        .tags.map(
                          (tag: { id: string; text: string }) => tag.text
                        )
                        .join(", ")}
                    </TableCell>
                    {/* <TableCell className="font-medium min-w-[150px] max-w-sm">
                      {trainingProgram.data().author.name}
                    </TableCell> */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          trainingProgram.data().status == "active"
                            ? "border-green-500 text-green-500"
                            : ""
                        )}
                      >
                        {trainingProgram.data().status}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell min-w-[180px] max-w-sm">
                      {dayjs(trainingProgram.data().modifiedAt).format(
                        CONSTANTS.DAYJS_FORMAT
                      )}
                    </TableCell>
                    <TableCell>
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}

                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="default"
                          // @ts-ignore
                          onClick={() => onEditClick(trainingProgram)}
                          className="cursor-pointer"
                        >
                          <MdEdit className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <DeleteTrainingProgram
                          // @ts-ignore
                          trainingProgram={trainingProgram}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* </div> */}
          </CardContent>
        )}
        {/* <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter> */}
      </Card>
    </motion.div>
  );
};
