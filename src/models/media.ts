import { StaticImageData } from "next/image";

export interface IPhoto {
  src: string;
  caption: string;
  status: "active" | "draft";
  createdAt: string;
  modifiedAt?: string;
  category: string;
}

export interface IVideo {
  src: string;
  title: string;
  description: string;
  status: "active" | "draft";
  createdAt: string;
  modifiedAt?: string;
  category: string;
}

export interface IDocument {
  src: string;
  title: string;
  description: string;
  status: "active" | "draft";
  createdAt: string;
  modifiedAt?: string;
  category: string;
}

export interface IArticle {
  slug: string;
  image: { src: string; alt: string };
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  author: { name: string };
  date: string;
  status: "active" | "draft";
}

export interface IEvent {
  title: string;
  slug: string;
  id?: string;
  image: {
    src: string;
    alt: string;
  };
  date: string;
  category: string;
  excerpt: string;
  content: string;
  location: string;
  status: "active" | "draft";
}
