import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/validation";
import { z } from "zod";
import { auth } from "@/firebase/config";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { ILoginSchema } from "@/models";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import React from "react";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const { redirect } = router.query;
  const [showPassword, setShowPassword] = React.useState(false);

  const [signInUserWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    // defaultValues: {},
  });

  const onSubmit = async ({ email, password }: ILoginSchema) => {
    try {
      const res = await signInUserWithEmailAndPassword(email, password);
      // console.log("response is: ", res);
      toast.success("Connexion Réussie");
      router.push((redirect as string) || "/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Se Connecter</CardTitle>
            <CardDescription>
              Entrez votre email ci-dessous pour vous connecter à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative w-full max-w-sm items-center">
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
                                onClick={() => setShowPassword((prev) => !prev)}
                              />
                            ) : (
                              <Eye
                                className="size-6 text-slate-500"
                                onClick={() => setShowPassword((prev) => !prev)}
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
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  <div className="animate-spin border border-white border-t-0 border-r-1 rounded-full w-5 h-5 relative flex items-center justify-center" />
                ) : (
                  "Se Connecter"
                )}
              </Button>
              {/* <Button variant="outline" className="w-full">
                Login with Google
              </Button> */}
            </div>
            {/* <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </div> */}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default function Login() {
  return (
    <div className="flex bg-gray-50 items-center justify-center h-screen">
      <LoginForm />
    </div>
  );
}
