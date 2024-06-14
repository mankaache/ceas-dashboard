export * from "./auth";
export * from "./media";

export interface ICategory {
  label: string;
  value: string;
  createdAt: string;
  modifiedAt: string;
}

export type ICategoryType =
  | "photos"
  | "videos"
  | "documents"
  | "articles"
  | "events"
  | "training-programs";
