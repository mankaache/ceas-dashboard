import React, { useState } from "react";
import Image from "next/image";
import { CalendarIcon, MoreHorizontal } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Tag, TagInput } from "emblor";
import { TagInput } from "@/components/ui/tag";

import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { IEvent } from "@/models";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";

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
import { addSubcategory, getSubcategories } from "@/firebase/helpers";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import dynamic from "next/dynamic";
import { format } from "date-fns";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

interface ITag {
  id: string;
  text: string;
}

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

const imageSchema = z.object({
  src: z.string().url({ message: "Invalid URL" }),
  caption: z
    .string()
    .min(1, { message: "Caption should be at least 1 character" }),
});

const tagSchema = z.object({
  id: z.string().min(1, { message: "Tag should be at least 1 character" }),
  text: z.string().min(1, { message: "Tag should be at least 1 character" }),
});

// const authorSchema = z.object({
//   name: z
//     .string({ message: "Author name required" })
//     .min(1, { message: "Name be at least 1 character" }),
// });

const eventSchema = z
  .object({
    image: imageSchema,
    title: z
      .string({ message: "Title is required" })
      .min(1, "Title should be atleast 1 character"),
    excerpt: z
      .string({ message: "Excerpt is required" })
      .min(1, "Excerpt should be atleast 1 character"),
    slug: z
      .string({ message: "Slug is required" })
      .min(1, "Slug should be atleast 1 character"),

    content: z
      .string({ message: "Content is required" })
      .min(1, "Content should be atleast 1 character"),
    tags: z.array(tagSchema), // Define tags as an array of strings
    // author: authorSchema,
    date: z.string({ message: "Date is required" }),
    location: z
      .string({ message: "Location is required" })
      .min(1, "Location should be atleast 1 character"),
    category: z.string().optional(),
    custom_category: z.string().optional(),
  })
  .refine((data) => data.slug.toLowerCase() === data.slug, {
    message: "Slug should be lowercase",
    path: ["slug"], // This indicates where the error message will be displayed
  })
  .refine((data) => data.category || data.custom_category, {
    message: "Either Category or Custom Category is required",
    path: ["category"], // This indicates where the error message will be displayed
  })
  .refine((data) => !(data.category && data.custom_category), {
    message: "Only one of Category or Custom Category should be provided",
    path: ["category"], // This indicates where the error message will be displayed
  });

// Event Form Component
export const EventForm: React.FC<{
  event: QueryDocumentSnapshot | null;
  onCancel: () => void;
  onSave: () => void;
}> = ({ event, onCancel, onSave }) => {
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null
  );
  const [tags, setTags] = React.useState<ITag[]>(event?.data().tags ?? []);
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadFile, uploading, upLoadSnapshot, error] = useUploadFile();
  const [categories, catLoading, catError] = getSubcategories("events");

  const form = useForm<z.infer<typeof eventSchema>>({
    defaultValues: event
      ? {
          image: {
            src: event.data().image.src,
            caption: event.data().image.caption,
          },
          title: event.data().title,
          excerpt: event.data().excerpt,
          slug: event.data().slug,
          content: event.data().content,
          date: event.data().date,
          location: event.data().location,
          tags: event.data().tags || [],
          // author: event.data().author,
          category: event.data().category,
        }
      : { tags: [] },
    resolver: zodResolver(eventSchema),
  });

  const handleFileChange = (fileItems: any) => {
    if (fileItems.length > 0) {
      setFiles(fileItems);
      form.setValue(
        "image.src",
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

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    const currentDate = dayjs().format("YYYY-MM-DD");
    const slug = slugify(`${title} ${currentDate}`, { lower: true });

    // Assuming 'title' and 'slug' are fields in your form
    form.setValue("title", title);
    form.setValue("slug", slug);
  };

  function handleEditorChange({ html, text }: { html: string; text: string }) {
    // console.log("handleEditorChange", html, text);
    form.setValue("content", text);
  }

  const onSubmitAdd = async (data: z.infer<typeof eventSchema>) => {
    // console.log(data);
    // console.log(files);

    if (Boolean(files.length)) {
      try {
        Swal.fire("S'il vous plaît, attendez...");
        Swal.showLoading(Swal.getConfirmButton());

        if (data.custom_category) {
          await addSubcategory("events", {
            label: data.custom_category,
            value: data.custom_category,
          });
        }

        // @ts-ignore
        const url = await handleFileUpload(files[0].file);
        // const eventRef = doc(collection(firestore, "events"))
        const eventRef = collection(firestore, "events");
        const eventData = {
          // id: eventRef.id,
          image: {
            src: url,
            caption: data.image.caption,
          },
          title: data.title,
          excerpt: data.excerpt,
          slug: data.slug,
          content: data.content,
          tags: data.tags,
          // author: data.author,
          date: data.date,
          location: data.location,
          category: data.category ?? data.custom_category,
          createdAt: dayjs().toISOString(),
          modifiedAt: dayjs().toISOString(),
          status: "active",
        };
        // await setDoc(eventRef, eventData)
        await addDoc(eventRef, eventData);

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

  const onSubmitEdit = async (data: z.infer<typeof eventSchema>) => {
    if (!(event || Boolean(files.length))) {
      toast.error("No file present!");
    } else {
      try {
        Swal.fire("S'il vous plaît, attendez...");
        Swal.showLoading(Swal.getConfirmButton());

        if (data.custom_category) {
          await addSubcategory("events", {
            label: data.custom_category,
            value: data.custom_category,
          });
        }

        const url = !Boolean(files.length)
          ? event?.data().image.src
          : // @ts-ignore
            await handleFileUpload(files[0].file);

        const eventRef = doc(firestore, "events", event!.id);
        const eventData = {
          image: {
            src: url,
            caption: data.image.caption,
          },
          title: data.title,
          excerpt: data.excerpt,
          slug: data.slug,
          content: data.content,
          tags: data.tags,
          // author: data.author,
          date: data.date,
          location: data.location,
          category: data.category ?? data.custom_category,
          createdAt: event?.data().createdAt,
          modifiedAt: dayjs().toISOString(),
          status: "active",
        };

        await setDoc(eventRef, eventData, { merge: true });

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
          <CardTitle>{event ? "Modifier" : "Ajouter un"} event</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(
                // @ts-ignore
                event ? onSubmitEdit : onSubmitAdd
              )}
              className="space-y-8"
            >
              <FormField
                name="image.src"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
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
                name="image.caption"
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

              <div className="w-full flex flex-wrap items-stretch justify-center gap-4">
                <div className="title flex-1">
                  <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={handleTitleChange}
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="slug flex-1">
                  <FormField
                    name="slug"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
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

              {/* <FormField
                name="author.name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auteur</FormLabel>
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
              /> */}

              <div className="w-full flex flex-wrap items-stretch justify-center gap-4">
                <div className="date flex-1 mt-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  "rounded-md border-gray-300 shadow-sm"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Choisis une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              // @ts-ignore
                              selected={field.value}
                              onSelect={(date) => {
                                form.setValue(
                                  "date",
                                  dayjs(date).toISOString()
                                );
                                field.onChange(dayjs(date).toISOString());
                              }}
                              disabled={(date) =>
                                dayjs(date).isBefore(dayjs().subtract(1, "day"))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="location flex-1">
                  <FormField
                    name="location"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lieu</FormLabel>
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

              <FormField
                name="excerpt"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extrait</FormLabel>
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
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-left">Contenu</FormLabel>
                    <FormControl>
                      <MdEditor
                        {...field}
                        style={{ height: "500px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={handleEditorChange}
                        value={field.value}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-left">Étiqueter</FormLabel>
                    <FormControl>
                      <TagInput
                        {...field}
                        placeholder="Enter a tag"
                        tags={tags}
                        className="w-full"
                        // @ts-ignore
                        setTags={(newTags: ITag[]) => {
                          // console.log(newTags);
                          setTags(newTags);
                          form.setValue("tags", newTags as [ITag, ...ITag[]]);
                        }}
                        activeTagIndex={activeTagIndex}
                        setActiveTagIndex={setActiveTagIndex}
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
                        <FormLabel>Category</FormLabel>
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
                </div>
              </div>

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
