import { commonImages } from "@/assets";
import { getError } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const InnerPageError = ({ error }: { error: Error }) => {
  return (
    <div className="w-full h-[calc(100vh-75px)]">
      <div className="flex items-center justify-center h-[80%] lg:h-full w-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative text-red-500">{getError("text", error)}</div>
        </div>
      </div>
    </div>
  );
};

export default InnerPageError;
