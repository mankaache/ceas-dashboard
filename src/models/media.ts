import { StaticImageData } from "next/image";

export interface IPhoto {
  src: string;
  caption: string;
  status: "active" | "draft";
  createdAt: string;
  modifiedAt?: string;
}
