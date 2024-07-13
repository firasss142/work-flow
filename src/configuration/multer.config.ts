import * as multer from "multer";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

export const imageAndPdfFilter = (req, file, cb) => {
  const allowedImageExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
  const fileExtension = file.originalname.split(".").pop().toLowerCase();

  if (
    (file.mimetype.startsWith("image") &&
      allowedImageExtensions.includes(fileExtension)) ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only images or PDF files."), false);
  }
};

export const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (req, file, cb) => {
    const filename: string = uuidv4();
    const extension: string = file.originalname.split(".").pop().toLowerCase();
    cb(null, `${filename}.${extension}`);
  },
});
