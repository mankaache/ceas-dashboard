import { useScreenSize } from "@/hooks";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  const { isXl, isXxl } = useScreenSize();
  const router = useRouter();

  React.useEffect(() => {
    if (!(isXl || isXxl))
      router.push({
        pathname: "/error/unsupported-device",
        query: { next: router.pathname },
      });
  }, [isXl, isXxl]);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer theme="colored" />
    </>
  );
}
