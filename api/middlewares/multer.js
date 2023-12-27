import multer from "multer";
import path from "path";
import fs from "fs";

const physicalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("assets//images")) {
      fs.mkdirSync("assets//images");
    }
    cb(null, "assets//images");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

// Create a multer instance with the defined storage
const upload = multer({ storage: physicalStorage });

export { upload };
