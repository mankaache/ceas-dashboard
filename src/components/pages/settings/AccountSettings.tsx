import React from "react";
import Swal from "sweetalert2";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { getError } from "@/utils";
import { motion } from "framer-motion";

import { User, updateEmail, updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";

export const AccountSettings = ({ user }: { user: User }) => {
  const userSchema = z.object({
    displayName: z
      .string({ message: "Name is required" })
      .min(1, "Name should be atleast 1 character"),
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Email should be a valid email" }),
  });

  const form = useForm<z.infer<typeof userSchema>>({
    // @ts-ignore
    defaultValues: user
      ? {
          displayName: user.displayName,
          email: user.email,
        }
      : {},
    resolver: zodResolver(userSchema),
  });

  const onSubmitEdit = async (data: z.infer<typeof userSchema>) => {
    try {
      Swal.fire("S'il vous plaît, attendez...");
      Swal.showLoading(Swal.getConfirmButton());

      await updateProfile(auth.currentUser as User, {
        displayName: data.displayName,
      });

      await updateEmail(auth.currentUser as User, data.email);

      const swalRes = await Swal.fire({
        title: "Succès!",
        // text: result.message ?? "You're logged in!",
        icon: "success",
        confirmButtonText: "Continuer",
      });

      //   if (swalRes.value) {
      //     onSave();
      //   }
    } catch (err) {
      Swal.fire({
        title: "Erreur",
        html: getError("html", err),
        icon: "error",
        confirmButtonText: "Fermer",
      });
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
      <Card>
        <CardHeader>
          <CardTitle>Compte</CardTitle>
          <CardDescription>
            Apportez des modifications à votre compte ici. Cliquez sur
            Enregistrer lorsque vous avez terminé.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmitEdit)}
              className="space-y-8"
            >
              <div className="w-full flex flex-wrap items-stretch justify-center gap-4">
                <div className="title flex-1">
                  <FormField
                    name="displayName"
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
                </div>

                <div className="slug flex-1">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" variant="default">
                Enregistrer
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </motion.div>
  );
};
