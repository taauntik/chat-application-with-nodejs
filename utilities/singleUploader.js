const createError = require("http-errors");
const multer = require("multer");
const path = require("path");

function uploader(subfolderPath, allowedFileTypes, maxFileSize, errorMsg) {
  // File Upload Folder
  const UPLOADS_FOLDER = `${__dirname}/../public/uploads/${subfolderPath}/`;

  // define storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, filename + fileExt);
    },
  });

  // prepare the final upload object
  const upload = multer({
    storage,
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(errorMsg));
      }
    },
  });

  return upload;
}

module.exports = uploader;
