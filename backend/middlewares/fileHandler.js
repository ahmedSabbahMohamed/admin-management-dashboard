const multer = require("multer");
const { createError, httpStatusText } = require("../utils");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[0];
  if (fileType === "image") {
    cb(null, true);
  } else {
    cb(createError("Only images allowed", 400, httpStatusText.ERROR), false);
  }
};

module.exports = multer({
  storage: diskStorage,
  fileFilter,
  limits: { fileSize: 1000000 },
});
