import { BaseLayout } from "@/components/layout";
import dynamic from "next/dynamic";
import React from "react";

export default function Videos() {
  return (
    <BaseLayout>
      <div className="p-4 flex flex-col items-center justify-center w-full h-full max-w-screen-xl mx-auto">
        Paramètres
      </div>
    </BaseLayout>
  );
}
