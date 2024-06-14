import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";
import { useScreenSize } from "@/hooks";
import { useRouter } from "next/router";

export default function UnsupportedDevice() {
  const { isXl, isXxl } = useScreenSize();
  const router = useRouter();

  const {
    query: { next },
  } = router;

  React.useEffect(() => {
    if (isXl || isXxl) router.push((next as string) ?? "/");
  }, [isXl, isXxl, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Cet appareil n&apos;est pas pris en charge, veuillez utiliser un
          ordinateur de bureau ou un PC
        </AlertDescription>
      </Alert>
    </div>
  );
}
