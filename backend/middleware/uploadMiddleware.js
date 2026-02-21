import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/files';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const isVideo = file.mimetype.startsWith('video');
        const dir = isVideo ? 'uploads/videos' : 'uploads/files';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /\.(mp4|mov|avi|mkv|webm|pdf|doc|docx|ppt|pptx|xls|xlsx|txt)$/i;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Accept all video mime types
    const isVideo = file.mimetype.startsWith('video/');

    // Some systems don't provide perfect mimetypes for docs, so we trust extname mostly
    if (extname || isVideo) {
        return cb(null, true);
    } else {
        cb('Error: File type not supported!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

export default upload;
