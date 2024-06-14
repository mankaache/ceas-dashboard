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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ICategory, ICategoryType } from "@/models";
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
import dayjs from "dayjs";
import { CONSTANTS } from "@/data";
import { useSubcategories } from "@/firebase/helpers";

const DeleteCategory = dynamic(
  () =>
    import("@/components/pages/categories").then((mod) => mod.DeleteCategory),
  { ssr: false }
);

export const CategoryList: React.FC<{
  onEditClick: (
    categoryType: ICategoryType,
    category?: DocumentSnapshot<ICategory>
  ) => void;
  onDeleteClick: (
    category: DocumentSnapshot<ICategory>,
    categoryType: ICategoryType
  ) => void;
}> = ({ onDeleteClick, onEditClick }) => {
  const [categoryType, setCategoryType] =
    React.useState<ICategoryType>("photos");

  const [value, loading, error] = useSubcategories(categoryType);

  const OPTIONS = React.useMemo(
    () =>
      Object.keys(CONSTANTS.DATA_MAP).map((key) => ({
        value: key,
        // @ts-ignore
        label: CONSTANTS.DATA_MAP[key],
      })),
    []
  );

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
            <CardTitle>Catégories</CardTitle>
            <CardDescription>Gérer et afficher vos catégories</CardDescription>
          </div>

          <div className="select w-1/4">
            <Select
              value={categoryType}
              onValueChange={(v) => setCategoryType(v as ICategoryType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {OPTIONS.map((category, idx) => (
                  <SelectItem key={idx} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="add mr-4">
            <Button
              type="button"
              variant="default"
              onClick={() => onEditClick(categoryType)}
              className="flex gap-2 items-center justify-center"
            >
              <PlusCircle />
              Ajouter une catégorie
            </Button>
          </div>
        </CardHeader>

        {!Boolean(value?.docs.length) ? (
          <div className="mx-auto my-4 w-full flex items-center justify-center">
            <p className="text-3xl p-4">Pas des catégories</p>
          </div>
        ) : (
          <CardContent className="max-w-full overflow-x-auto">
            <Table className="table-auto min-w-full text-center">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center hidden w-[100px] sm:table-cell">
                    #
                  </TableHead>
                  <TableHead className="text-center">Étiquette</TableHead>
                  <TableHead className="text-center">Valeur</TableHead>
                  <TableHead className="text-center">Modifié à</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {value?.docs.map((category, idx) => (
                  <TableRow
                    key={category.id}
                    className={cn(
                      idx % 2 == 0 ? "bg-gray-50" : "white",
                      "[&]:text-center"
                    )}
                  >
                    <TableCell className="hidden sm:table-cell">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium min-w-[250px] max-w-sm">
                      {category.data().label}
                    </TableCell>
                    <TableCell className="font-medium min-w-[250px] max-w-sm">
                      {category.data().value}
                    </TableCell>

                    <TableCell className="hidden md:table-cell min-w-[180px] max-w-sm">
                      {dayjs(category.data().modifiedAt).format(
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
                          onClick={() => onEditClick(categoryType, category)}
                          className="cursor-pointer"
                        >
                          <MdEdit className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <DeleteCategory
                          // @ts-ignore
                          category={category}
                          categoryType={categoryType}
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
