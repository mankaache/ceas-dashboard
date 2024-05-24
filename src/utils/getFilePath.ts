export const getFilePath = (file: File) => {
  const fileType = file.type.startsWith("image/")
    ? "photos"
    : file.type.startsWith("video/")
    ? "videos"
    : // : file.type === "application/pdf"
      // ? "pdfs"
      "documents";
  return `uploads/${fileType}/${file.name}`;
};
