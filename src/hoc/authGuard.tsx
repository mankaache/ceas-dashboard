import React, { ComponentType, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { FullPageLoader } from "@/components/loaders";
import { toast } from "react-toastify";
import { getError } from "@/utils";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WithAuthGuardProps {
  // Add any additional props that your wrapped components might receive here
}

export const withAuthGuard = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & WithAuthGuardProps> => {
  const WithAuthGuard: React.FC<P & WithAuthGuardProps> = (props) => {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();
    const { pathname } = router;

    useEffect(() => {
      if (!loading && !user) {
        router.push({ pathname: "/auth/login", query: router.asPath });
        toast.error("Connectez-vous pour continuer");
      }
    }, [user, loading, router.asPath]);

    if (loading || (!user && !error)) {
      return <FullPageLoader />;
    }

    if (error) {
      return (
        <div className="h-screen p-4 w-full flex items-center justify-center">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{getError("html", error)}</AlertDescription>
          </Alert>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthGuard;
};
