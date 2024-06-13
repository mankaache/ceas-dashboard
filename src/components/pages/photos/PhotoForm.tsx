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
import { ICategory, IPhoto } from "@/models";
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
  doc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getError, getFilePath } from "@/utils";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useCollection } from "react-firebase-hooks/firestore";
import { addSubcategory, getSubcategories } from "@/firebase/helpers";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

// const photoSchema = z.object({
//   src: z
//     .string({ message: "Please select a file" })
//     .url({ message: "Invalid url" }),
//   caption: z
//     .string({ message: "Caption is required" })
//     .min(1, "Caption should be atleast 1 character"),
//   category: z.string({ message: "Category is required" }),
//   custom_category: z.string().optional(),
// });

const photoSchema = z
  .object({
    src: z
      .string({ message: "Please select a file" })
      .url({ message: "Invalid url" }),
    caption: z
      .string({ message: "Caption is required" })
      .min(1, { message: "Caption should be at least 1 character" }),
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

// Photo Form Component
export const PhotoForm: React.FC<{
  photo: QueryDocumentSnapshot | null;
  onCancel: () => void;
  onSave: () => void;
}> = ({ photo, onCancel, onSave }) => {
  let storageRef;

  // const pond = FilePond.create({
  //   files: [
  //     {
  //       source: photo?.data().src,

  //       options: {
  //         type: "local",
  //       },
  //     },
  //   ],
  // });

  // const initialRemoteFile = {
  //   // source: "https://example.com/path/to/your/image.jpg", // Replace with your remote image URL
  //   source: photo?.data().src,
  //   options: {
  //     type: "remote",
  //     // file: {
  //     //   name: "Remote Image",
  //     //   type: "image/jpeg",
  //     // },
  //   },
  // };

  const [files, setFiles] = React.useState<File[]>([]);

  const [uploadFile, uploading, upLoadSnapshot, error] = useUploadFile();
  const [value, loading, dError] = useDownloadURL(storageRef);
  // const [categories, catLoading, catError] = useCollection(catQuery);
  const [categories, catLoading, catError] = getSubcategories("photos");

  const form = useForm<z.infer<typeof photoSchema>>({
    defaultValues: photo
      ? {
          src: photo.data().src,
          caption: photo.data().caption,
          category: photo.data().category,
        }
      : {},
    resolver: zodResolver(photoSchema),
  });

  // const uploadFileAndGetURL = (file: File) => {
  //   return new Promise((resolve, reject) => {
  //     const storageRef = ref(storage, `uploads/${file.name}`);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         // Handle progress, e.g., display progress bar if needed
  //       },
  //       (error) => {
  //         reject(error);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref)
  //           .then((downloadURL) => {
  //             resolve(downloadURL);
  //           })
  //           .catch(reject);
  //       }
  //     );
  //   });
  // };

  // const savePhotoToFirestore = async (url, caption) => {
  //   const photoData = {
  //     src: url,
  //     caption: caption,
  //     createdAt: serverTimestamp(),
  //     modifiedAt: serverTimestamp(),
  //     status: 'active'
  //   };

  //   try {
  //     await addDoc(collection(firestore, 'photos'), photoData);
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //   }
  // };

  // const handleFilePondUpdate = useCallback(
  //   async (fileItems) => {
  //     if (fileItems.length > 0) {
  //       const file = fileItems[0].file;
  //       setUploading(true);
  //       setError(null);

  //       try {
  //         const url = await uploadFileAndGetURL(file);
  //         await savePhotoToFirestore(url, caption);
  //         console.log("File uploaded and data saved to Firestore");
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setUploading(false);
  //       }
  //     }
  //   },
  //   [caption]
  // );

  const handleFileChange = (fileItems: any) => {
    if (fileItems.length > 0) {
      // console.log(
      //   fileItems,
      //   typeof fileItems[0] == "string"
      //     ? fileItems[0]
      //     : URL.createObjectURL(fileItems[0].file)
      // );
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

  const onSubmitAdd = async (data: z.infer<typeof photoSchema>) => {
    // console.log(data);
    // console.log(files);

    if (Boolean(files.length)) {
      try {
        Swal.fire("S'il vous plaît, attendez...");
        Swal.showLoading(Swal.getConfirmButton());

        if (data.custom_category) {
          await addSubcategory("photos", {
            label: data.custom_category,
            value: data.custom_category,
          });
        }

        // @ts-ignore
        const url = await handleFileUpload(files[0].file);
        const docRef = await addDoc(collection(firestore, "photos"), {
          src: url,
          caption: data.caption,
          createdAt: dayjs().format("YYYY-MM-DD hh:mm A"),
          modifiedAt: dayjs().format("YYYY-MM-DD hh:mm A"),
          status: "active",
          category: data.category ?? data.custom_category,
        });

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
    } else {
      toast.error("No file present!");
    }
  };

  const onSubmitEdit = async (data: z.infer<typeof photoSchema>) => {
    if (!(photo || Boolean(files.length))) {
      toast.error("No file present!");
    } else {
      try {
        Swal.fire("S'il vous plaît, attendez...");
        Swal.showLoading(Swal.getConfirmButton());

        if (data.custom_category) {
          await addSubcategory("photos", {
            label: data.custom_category,
            value: data.custom_category,
          });
        }

        const url = !Boolean(files.length)
          ? photo?.data().src
          : // @ts-ignore
            await handleFileUpload(files[0].file);

        const photoRef = doc(firestore, "photos", photo!.id);
        const photoData = {
          src: url,
          caption: data.caption,
          createdAt: photo?.data().createdAt,
          modifiedAt: dayjs().format("YYYY-MM-DD hh:mm A"),
          status: "active",
          category: data.category ?? data.custom_category,
        };
        await setDoc(photoRef, photoData, { merge: true });

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
    }
  };

  // React.useEffect(() => {
  //   // console.log(files);
  // }, [files]);

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
          <CardTitle>{photo ? "Modifier" : "Ajouter une"} photo</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <div className="max-w-md mx-auto border border-red-500">
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={3}
            // server="/upload"
            instantUpload={false}
            allowProcess={false}
            dropOnPage
            dropValidation
            name="files"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div> */}
          {/* <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="src" className="block text-sm font-medium">
              Photo URL
            </label>
            <input
              id="src"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formPhoto.src}
              onChange={(e) =>
                setFormPhoto({ ...formPhoto, src: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="caption" className="block text-sm font-medium">
              Caption
            </label>
            <input
              id="caption"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formPhoto.caption}
              onChange={(e) =>
                setFormPhoto({ ...formPhoto, caption: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={formPhoto.status}
              onChange={(e) =>
                setFormPhoto({ ...formPhoto, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onCancel} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save
            </Button>
          </div>
        </form> */}

          <Form {...form}>
            <form
              noValidate
              // @ts-ignore
              onSubmit={form.handleSubmit(photo ? onSubmitEdit : onSubmitAdd)}
              className="space-y-8"
            >
              <FormField
                name="src"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
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
                name="caption"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
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
              {/* <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        // value={field.value}
                        onValueChange={(v) => form.setValue("category", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.docs.map((category, idx) => (
                            <SelectItem key={idx} value={category.data().value}>
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

              <FormField
                name="custom_category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Category</FormLabel>
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
