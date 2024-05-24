import React from "react";
import Image from "next/image";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BaseLayout } from "@/components/layout";
import { PHOTOS } from "@/data";
import { cn } from "@/lib/utils";
import { MdDelete, MdEdit } from "react-icons/md";
import { IPhoto } from "@/models";
import { motion } from "framer-motion";
import { useCollection } from "react-firebase-hooks/firestore";
import { DocumentSnapshot, collection } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { InnerPageLoader } from "@/components/loaders";
import dynamic from "next/dynamic";

const DeletePhoto = dynamic(
  () => import("@/components/pages/photos").then((mod) => mod.DeletePhoto),
  { ssr: false }
);

export const PhotoList: React.FC<{
  onEditClick: (photo?: DocumentSnapshot<IPhoto>) => void;
  onDeleteClick: (photo: DocumentSnapshot<IPhoto>) => void;
}> = ({ onDeleteClick, onEditClick }) => {
  const [value, loading, error] = useCollection(
    collection(firestore, "photos"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (loading) {
    return <InnerPageLoader loading={loading} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {!Boolean(value?.docs.length) ? (
        <p className="text-3xl">Pas des photos</p>
      ) : (
        <Card className="w-full fade-enter fade-enter-active">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="title">
              <CardTitle>Photos</CardTitle>
              <CardDescription>Gérer et afficher vos photos</CardDescription>
            </div>

            <div className="add mr-4">
              <Button
                type="button"
                variant="default"
                onClick={() => onEditClick()}
                className="flex gap-2 items-center justify-center"
              >
                <PlusCircle />
                Ajouter une photo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center hidden w-[100px] sm:table-cell">
                    Aperçu
                  </TableHead>
                  <TableHead className="text-center">Légende</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-center">Créé à</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {value?.docs.map((photo, idx) => (
                  <TableRow
                    key={photo.id}
                    className={cn(
                      idx % 2 == 0 ? "bg-gray-50" : "white",
                      "[&]:text-center"
                    )}
                  >
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        // @ts-ignore
                        src={photo.data().src}
                        className="aspect-square rounded-md object-contain"
                        height="64"
                        alt={photo.data().caption}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-sm">
                      {photo.data().caption}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          photo.data().status == "active"
                            ? "border-green-500 text-green-500"
                            : ""
                        )}
                      >
                        {photo.data().status}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      {photo.data().createdAt}
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
                          onClick={() => onEditClick(photo)}
                          className="cursor-pointer"
                        >
                          <MdEdit className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <DeletePhoto
                          // @ts-ignore
                          photo={photo}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          {/* <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter> */}
        </Card>
      )}
    </motion.div>
  );
};
