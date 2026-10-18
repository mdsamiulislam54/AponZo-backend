import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits:{
    fileSize: 1024 * 1024 * 50,
    files:5,
  },
  fileFilter:(_req,file,callback)=>{
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif","image/webp","image/jpg"];

    if(!allowedMimeTypes.includes(file.mimetype)){
        return callback(
            new Error("Invalid file type. Only JPEG, PNG, GIF, WEBP and JPG are allowed."),
        )
    }

    return callback(null,true);
  }
})

export default upload;