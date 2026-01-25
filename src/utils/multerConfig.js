import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const uploadFiles = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
