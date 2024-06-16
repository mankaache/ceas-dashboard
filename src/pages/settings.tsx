import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { auth } from "@/firebase/config";
import { User } from "firebase/auth";

const AccountSettings = dynamic(() =>
  import("@/components/pages/settings").then((mod) => mod.AccountSettings)
);
const PasswordSettings = dynamic(() =>
  import("@/components/pages/settings").then((mod) => mod.PasswordSettings)
);

export default function Videos() {
  const user = auth.currentUser as User;

  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center w-full h-full max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Card className="w-full fade-enter fade-enter-active">
            <CardHeader className="flex flex-row gap-2 items-center justify-between">
              <div className="title">
                <CardTitle>Paramètres</CardTitle>
                <CardDescription className="mt-1">
                  Afficher et gérer vos paramètres
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="account" className="w-full bg-none">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Compte</TabsTrigger>
                  <TabsTrigger value="password">Mot de passe</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <AccountSettings user={user} />
                </TabsContent>
                <TabsContent value="password">
                  <PasswordSettings user={user} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </BaseLayout>
  );
}
