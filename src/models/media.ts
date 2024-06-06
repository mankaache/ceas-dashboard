import { StaticImageData } from "next/image";

export interface IPhoto {
  src: string;
  caption: string;
  status: "active" | "draft";
  createdAt: string;
  modifiedAt?: string;
}

export interface IVideo {
  src: string;
  title: string;
  description: string;
  status: "active" | "draft";
  createdAt: string;
  modifiedAt?: string;
}

export interface IDocument {
  src: string;
  title: string;
  description: string;
  status: "active" | "draft";
  createdAt: string;
  modifiedAt?: string;
}
