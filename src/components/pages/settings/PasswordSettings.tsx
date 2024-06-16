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

import {
  EmailAuthProvider,
  User,
  reauthenticateWithCredential,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";
import { Eye, EyeOff, Search } from "lucide-react";
import { useRouter } from "next/router";

export const PasswordSettings = ({ user }: { user: User }) => {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  const userSchema = z
    .object({
      password: z.string({ message: "Mot de passe est nécessaire" }).min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      }),

      newPassword: z.string({ message: "Mot de passe est nécessaire" }).min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      }),
    })
    .refine((data) => data.password !== data.newPassword, {
      message: "mot de passe actuel identique au nouveau mot de passe",
      path: ["newPassword"],
    });

  const form = useForm<z.infer<typeof userSchema>>({
    defaultValues: {},
    resolver: zodResolver(userSchema),
  });

  const onSubmitEdit = async (data: z.infer<typeof userSchema>) => {
    const credentials = EmailAuthProvider.credential(
      user.email as string,
      data.password
    );

    try {
      Swal.fire("S'il vous plaît, attendez...");
      Swal.showLoading(Swal.getConfirmButton());

      await reauthenticateWithCredential(user, credentials);
      await updatePassword(auth.currentUser as User, data.newPassword);

      const swalRes = await Swal.fire({
        title: "Succès!",
        // text: result.message ?? "You're logged in!",
        icon: "success",
        confirmButtonText: "Continuer",
        allowOutsideClick: false,
      });

      if (swalRes.value) {
        form.reset();
        form.setValue("password", "");
        form.setValue("newPassword", "");
        await signOut(auth);
        await router.push("/auth/login");
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
          <CardTitle>Mot de passe</CardTitle>
          <CardDescription>
            Changez votre mot de passe ici. Après avoir enregistré, vous serez
            déconnecté.
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
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative w-full items-center">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              className="mt-1 pr-10 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                            <span className="absolute end-0 inset-y-0 flex items-center justify-center px-2">
                              {/* <Search className="size-6 text-muted-foreground" /> */}
                              {showPassword ? (
                                <EyeOff
                                  className="size-6 text-slate-500"
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                />
                              ) : (
                                <Eye
                                  className="size-6 text-slate-500"
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                />
                              )}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="slug flex-1">
                  <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative w-full items-center">
                            <Input
                              {...field}
                              type={showNewPassword ? "text" : "password"}
                              className="mt-1 pr-10 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                            <span className="absolute end-0 inset-y-0 flex items-center justify-center px-2">
                              {/* <Search className="size-6 text-muted-foreground" /> */}
                              {showPassword ? (
                                <EyeOff
                                  className="size-6 text-slate-500"
                                  onClick={() =>
                                    setShowNewPassword((prev) => !prev)
                                  }
                                />
                              ) : (
                                <Eye
                                  className="size-6 text-slate-500"
                                  onClick={() =>
                                    setShowNewPassword((prev) => !prev)
                                  }
                                />
                              )}
                            </span>
                          </div>
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
      </Card>
    </motion.div>
  );
};
