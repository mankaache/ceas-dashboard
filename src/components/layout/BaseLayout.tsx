import NextLink from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { NextSeo } from "next-seo";
import React from "react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import SidebarNav from "./SideNav";
import { withAuthGuard } from "@/hoc";
import { useDeviceDimensions } from "@/hooks";

interface BaseLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
  description?: string;
  pageLink?: string;
  sub?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  pageTitle = "Home",
  sub = "CEAS",
  pageLink,
  description = "Farming",
}) => {
  const router = useRouter();
  const { locale = "fr" } = router;

  const title: string = pageTitle
    ? `${pageTitle} | ${process.env.NEXT_PUBLIC_SITE_NAME}`
    : `${process.env.NEXT_PUBLIC_SITE_NAME}`;

  const canonical: string = pageLink
    ? `${process.env.NEXT_PUBLIC_SITE_URL}${pageLink}/`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/`;

  const themeColor = "#475A23";

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
          title: title,
          description: description,
          site_name: `${process.env.NEXT_PUBLIC_SITE_NAME}`,
          type: "website",
          images: [
            {
              url: `https://${process.env.NEXT_PUBLIC_SITE}/og-image.jpg`,
              alt: `${process.env.NEXT_PUBLIC_SITE_NAME}`,
              type: "image/jpg",
            },
          ],
        }}
        twitter={{
          site: `${process.env.NEXT_PUBLIC_SITE}`,
          cardType: "summary_large_image",
          handle: `@${process.env.NEXT_PUBLIC_SITE?.split(".")[0]}`,
        }}
        additionalMetaTags={[
          { name: "keywords", content: "farming" },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
          { name: "revisit-after", content: "5 days" },
          {
            name: "author",
            content: `${process.env.NEXT_PUBLIC_SITE?.split(".")[0]}`,
          },
          {
            name: "language",
            content: (
              { en: "English", fr: "French" } as { [key: string]: string }
            )[locale],
          },
          { name: "http-equiv", content: "text/html; charset=utf-8" },
          {
            name: "application-name",
            content: process.env.NEXT_PUBLIC_SITE_NAME ?? "Tiny Mountain Paws",
          },
          { name: "apple-mobile-web-app-capable", content: "yes" },
          {
            name: "apple-mobile-web-app-title",
            content: process.env.NEXT_PUBLIC_SITE_NAME ?? "",
          },
          { name: "format-detection", content: "telephone=no" },
          { name: "mobile-web-app-capable", content: "yes" },
          { name: "msapplication-TileColor", content: themeColor },
          { name: "msapplication-tap-highlight", content: "no" },
          { name: "theme-color", content: themeColor },
          { name: "msapplication-navbutton-color", content: themeColor },
          {
            name: "apple-mobile-web-app-status-bar-style",
            content: themeColor,
          },
        ]}
        additionalLinkTags={[
          {
            rel: "icon",
            href: `${process.env.NEXT_PUBLIC_SITE_URL}/favicon.ico`,
          },
          {
            rel: "apple-touch-icon",
            sizes: "60x60",
            href: `${process.env.NEXT_PUBLIC_SITE_URL}/touch-icons/apple-touch-icon-iphone-60x60.png`,
          },
          {
            rel: "apple-touch-icon",
            sizes: "76x76",
            href: `${process.env.NEXT_PUBLIC_SITE_URL}/touch-icons/apple-touch-icon-ipad-76x76.png`,
          },
          {
            rel: "apple-touch-icon",
            sizes: "114x114",
            href: `${process.env.NEXT_PUBLIC_SITE_URL}/touch-icons/apple-touch-icon-iphone-retina-120x120.png`,
          },
          {
            rel: "apple-touch-icon",
            sizes: "144x144",
            href: `${process.env.NEXT_PUBLIC_SITE_URL}/touch-icons/apple-touch-icon-ipad-retina-152x152.png`,
          },
          { rel: "shortcut icon", href: "/favicon.ico" },
          { rel: "apple-touch-startup-image", href: "/og-image.jpg" },
        ]}
      />
      <div className="flex w-screen h-screen items-center justify-center bg-white">
        <div className="flex h-full w-full m-0 p-0">
          <div className="sidebar">
            <SidebarNav />
          </div>
          <div className="dash bg-gray-100 w-full max-w-[calc(100vw-250px)]">
            <div className="">
              <header>
                <Navbar />
              </header>
              <main id="main" className="relative w-full h-full">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuthGuard(BaseLayout);
