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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
// import 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.min.css';

import { ActualFileObject, FilePondFile } from "filepond";
import { Input } from "@/components/ui/input";

import { useDownloadURL, useUploadFile } from "react-firebase-hooks/storage";
import { firestore, storage } from "@/firebase/config";

import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  QueryDocumentSnapshot,
  setDoc,
  doc,
} from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getError, getFilePath } from "@/utils";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { addSubcategory, useSubcategories } from "@/firebase/helpers";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

const AluminiSchema = z
  .object({
    src: z
      .string({ message: "Veuillez sélectionner un fichier" })
      .url({ message: "Lien invalide" }),
    role: z
    .string({message: 'Le role est requis'}),
    title: z
      .string({ message: "Le titre est requis" })
      .min(1, "Le titre doit contenir au moins 1 caractère"),
    description: z
      .string({ message: "Une description est requise" })
      .min(1, ""),
    category: z.string().optional(),
    custom_category: z.string().optional(),
  })
  .refine((data) => data.category || data.custom_category, {
    message: "Either Category or Custom Category is required",
    path: ["category"], // This indicates where the error message will be displayed
  })
  .refine((data) => !(data.category && data.custom_category), {
    message: "Only one of Category or Custom Category should be provided",
    path: ["category"], // This indicates where the error message will be displayed
  });

// Document Form Component
export const AluminiForm: React.FC<{
    alumini: QueryDocumentSnapshot | null;
  onCancel: () => void;
  onSave: () => void;
}> = ({ alumini, onCancel, onSave }) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadFile, uploading, upLoadSnapshot, error] = useUploadFile();
  const [categories, catLoading, catError] = useSubcategories("alumini");

  const form = useForm<z.infer<typeof AluminiSchema>>({
    defaultValues: alumini
      ? {
          src: alumini.data().src,
          role: alumini.data().role,
          title: alumini.data().title,
          description: alumini.data().description,
          category: alumini.data().category,
        }
      : {},
    resolver: zodResolver(AluminiSchema),
  });

  const handleFileChange = (fileItems: any) => {
    if (fileItems.length > 0) {
      setFiles(fileItems);
      form.setValue(
        "src",
        typeof fileItems[0] == "string"
          ? fileItems[0]
          : URL.createObjectURL(fileItems[0].file)
      );
    }

    // else {
    //   setValue("src", "");
    // }
  };

  const handleFileUpload = (file: File) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const storageRef = ref(storage, getFilePath(file));
        await uploadFile(storageRef, file);
        const url = await getDownloadURL(storageRef);
        resolve(url);
      } catch (err) {
        reject(err);
      }
    });
  };

  const onSubmitAdd = async (data: z.infer<typeof AluminiSchema>) => {
    // console.log(data);
    // console.log(files);

    if (Boolean(files.length)) {
      try {
        Swal.fire("S'il vous plaît, attendez...");
        Swal.showLoading(Swal.getConfirmButton());

        if (data.custom_category) {
          await addSubcategory("alumini", {
            label: data.custom_category,
            value: data.custom_category,
          });
        }

        // @ts-ignore
        const url = await handleFileUpload(files[0].file);
        const documentRef = collection(firestore, "alumini");
        const documentData = {
          src: url,
          role: data.role,
          title: data.title,
          description: data.description,
          createdAt: dayjs().toISOString(),
          modifiedAt: dayjs().toISOString(),
          status: "active",
          category: data.category ?? data.custom_category,
        };
        // await setDoc(documentRef, documentData)
        await addDoc(documentRef, documentData);

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

        console.log('senderror', err)
      }
    } else {
      toast.error("Aucun fichier trouvez");
    }
  };

  const onSubmitEdit = async (data: z.infer<typeof AluminiSchema>) => {
    if (!(alumini || Boolean(files.length))) {
      toast.error("Aucun fichier present!");
    } else {
      try {
        Swal.fire("S'il vous plaît, attendez...");
        Swal.showLoading(Swal.getConfirmButton());

        if (data.custom_category) {
          await addSubcategory("alumini", {
            label: data.custom_category,
            value: data.custom_category,
          });
        }

        const url = !Boolean(files.length)
          ? alumini?.data().src
          : // @ts-ignore
            await handleFileUpload(files[0].file);

        const documentRef = doc(firestore, "alumini", alumini!.id);
        const documentData = {
          src: url,
          role: data.role,
          title: data.title,
          description: data.description,
          createdAt: alumini?.data().createdAt,
          modifiedAt: dayjs().toISOString(),
          status: "active",
          category: data.category ?? data.custom_category,
        };
        await setDoc(documentRef, documentData, { merge: true });

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

        console.log('editerror', err)
      }
    }
  };

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
          <CardTitle>{alumini ? "Modifier" : "Ajouter un"} alumni</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(
                // @ts-ignore
                alumini ? onSubmitEdit : onSubmitAdd
              )}
              className="space-y-8"
            >
              <FormField
                name="src"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alumini</FormLabel>
                    <FormControl>
                    <FilePond
                        files={files}
                        onupdatefiles={handleFileChange}
                        allowMultiple={false}
                        maxFiles={1}
                        acceptedFileTypes={["image/*"]}
                        instantUpload={false}
                        allowProcess={false}
                        // name="file"
                        dropOnPage
                        dropValidation
                        // @ts-ignore
                        credits={null}
                        labelIdle='Glissez-déposez vos fichiers image ou <span class="filepond--label-action">Navigateur</span>'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
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
              <FormField
                name="role"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>rôle</FormLabel>
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

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
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

              <div className="w-full flex flex-wrap items-stretch justify-center gap-4">
                <div className="category flex-1">
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
                              {categories?.docs.map((category, idx) => (
                                <SelectItem
                                  key={idx}
                                  value={category.data().value}
                                >
                                  {category.data().label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="custom-category flex-1">
                  <FormField
                    name="custom_category"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie Personnalisée</FormLabel>
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
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" onClick={onCancel} variant="secondary">
                Annuler
                </Button>
                <Button type="submit" variant="default">
                    Sauvegarder
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
