import multer from "multer";
import path from "path";

// penyimpanan sementara di memori ram
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLocaleLowerCase()
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
        return cb(new Error("Upload hanya file gambar dengan format .jpg, .jpeg, atau .png"));
    }
    cb(null, true);
}

const uploadPhotoProfile = multer({ storage, fileFilter });

export default uploadPhotoProfile;