import multer from "multer";
import path from "path";
import os from "os";

/*
  Store file temporarily in system temp folder
  Then we manually upload to Cloudinary
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });
