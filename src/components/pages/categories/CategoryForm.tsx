import React, { useState } from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ICategory, ICategoryType } from "@/models";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";

import { QueryDocumentSnapshot } from "firebase/firestore";

import { getError } from "@/utils";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  addSubcategory,
  useSubcategories,
  updateSubcategory,
} from "@/firebase/helpers";
import { CONSTANTS } from "@/data";

const categorySchema = z.object({
  category: z
    .string({ message: "La catégorie est obligatoire" })
    .min(1, "La catégorie doit contenir au moins 1 caractère"),
  label: z
    .string({ message: "Le titre est requis" })
    .min(1, "Le titre doit contenir au moins 1 caractère"),
  value: z
    .string({ message: "Une description est requise" })
    .min(1, "La description doit comporter au moins 1 caractère"),
});

// Category Form Component
export const CategoryForm: React.FC<{
  category: QueryDocumentSnapshot | null;
  categoryType?: ICategoryType;
  onCancel: () => void;
  onSave: () => void;
}> = ({ category, categoryType, onCancel, onSave }) => {
  console.log(category);
  console.log(categoryType);
  const form = useForm<z.infer<typeof categorySchema>>({
    defaultValues: category
      ? {
          category: categoryType,
          label: category.data().label,
          value: category.data().value,
        }
      : { category: categoryType },
    resolver: zodResolver(categorySchema),
  });

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;

    form.setValue("label", label);
    form.setValue("value", label);
  };

  const onSubmitAdd = async (data: z.infer<typeof categorySchema>) => {
    // console.log(data);
    // console.log(files);

    try {
      Swal.fire("S'il vous plaît, attendez...");
      Swal.showLoading(Swal.getConfirmButton());

      await addSubcategory(
        data.category as ICategoryType,
        (({ label, value }) => ({ label, value }))(data)
      );

      const swalRes = await Swal.fire({
        title: "Succès!",
        // text: result.message ?? "You're logged in!",
        icon: "success",
        confirmButtonText: "Continuer",
      });

      if (swalRes.value) {
        onSave();
      }
    } catch (err) {
      Swal.fire({
        title: "Erreur",
        html: getError("html", err),
        icon: "error",
        confirmButtonText: "Fermer",
      });
    }
  };

  const onSubmitEdit = async (data: z.infer<typeof categorySchema>) => {
    try {
      Swal.fire("S'il vous plaît, attendez...");
      Swal.showLoading(Swal.getConfirmButton());

      await updateSubcategory(
        data.category as ICategoryType,
        category?.id as string,
        (({ label, value }) => ({ label, value }))(data)
      );

      const swalRes = await Swal.fire({
        title: "Succès!",
        // text: result.message ?? "You're logged in!",
        icon: "success",
        confirmButtonText: "Continuer",
      });

      if (swalRes.value) {
        onSave();
      }
    } catch (err) {
      Swal.fire({
        title: "Erreur",
        html: getError("html", err),
        icon: "error",
        confirmButtonText: "Fermer",
      });
    }
  };

  const OPTIONS = React.useMemo(
    () =>
      Object.keys(CONSTANTS.DATA_MAP).map((key) => ({
        value: key,
        // @ts-ignore
        label: CONSTANTS.DATA_MAP[key],
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="w-full fade-enter fade-enter-active">
        <CardHeader>
          <CardTitle>
            {category ? "Modifier" : "Ajouter une"} catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(
                // @ts-ignore
                category ? onSubmitEdit : onSubmitAdd
              )}
              className="space-y-8"
            >
              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={(v) => form.setValue("category", v)}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="label"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Étiquette</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={handleLabelChange}
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valeur</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" onClick={onCancel} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
