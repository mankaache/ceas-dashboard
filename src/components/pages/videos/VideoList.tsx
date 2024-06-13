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
import { IVideo } from "@/models";
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

const DeleteVideo = dynamic(
  () => import("@/components/pages/videos").then((mod) => mod.DeleteVideo),
  { ssr: false }
);

export const VideoList: React.FC<{
  onEditClick: (video?: DocumentSnapshot<IVideo>) => void;
  onDeleteClick: (video: DocumentSnapshot<IVideo>) => void;
}> = ({ onDeleteClick, onEditClick }) => {
  const videosQuery = query(
    collection(firestore, "videos"),
    orderBy("modifiedAt", "desc")
  );
  const [value, loading, error] = useCollection(videosQuery, {
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
            <CardTitle>Videos</CardTitle>
            <CardDescription>Gérer et afficher vos videos</CardDescription>
          </div>

          <div className="add mr-4">
            <Button
              type="button"
              variant="default"
              onClick={() => onEditClick()}
              className="flex gap-2 items-center justify-center"
            >
              <PlusCircle />
              Ajouter une video
            </Button>
          </div>
        </CardHeader>

        {!Boolean(value?.docs.length) ? (
          <div className="mx-auto my-4 w-full flex items-center justify-center">
            <p className="text-3xl p-4">Pas des videos</p>
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
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="text-center">Catégorie</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  {/* <TableHead className="text-center">Créé à</TableHead> */}
                  <TableHead className="text-center">Modifié à</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {value?.docs.map((video, idx) => (
                  <TableRow
                    key={video.id}
                    className={cn(
                      idx % 2 == 0 ? "bg-gray-50" : "white",
                      "[&]:text-center"
                    )}
                  >
                    <TableCell className="hidden sm:table-cell">
                      {/* <Image
                        // @ts-ignore
                        src={video.data().src}
                        className="aspect-square rounded-md object-contain"
                        height="64"
                        alt={video.data().caption}
                        width="64"
                      /> */}
                      {/* <VideoThumbnail
                        videoUrl={video?.data().src}
                        thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                        width={64}
                        height={64}
                      /> */}
                      {/* <iframe
                        src={video?.data().src}
                        allowFullScreen
                        width={64}
                        height={64}
                      /> */}
                      <video width="64" height="64">
                        <source src={video.data().src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </TableCell>
                    <TableCell className="font-medium min-w-[200px] max-w-sm">
                      {video.data().title}
                    </TableCell>
                    <TableCell className="font-medium min-w-[250px] max-w-sm">
                      {video.data().description}
                    </TableCell>
                    <TableCell className="font-medium min-w-[150px] max-w-sm">
                      {video.data().category}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          video.data().status == "active"
                            ? "border-green-500 text-green-500"
                            : ""
                        )}
                      >
                        {video.data().status}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden md:table-cell min-w-[180px] max-w-sm">
                      {video.data().modifiedAt}
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
                          onClick={() => onEditClick(video)}
                          className="cursor-pointer"
                        >
                          <MdEdit className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <DeleteVideo
                          // @ts-ignore
                          video={video}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
