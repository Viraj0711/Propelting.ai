"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getAudioDuration = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '../../uploads/meetings');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-userId-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        const basename = path_1.default.basename(file.originalname, ext);
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
});
// File filter for audio/video files
const fileFilter = (req, file, cb) => {
    const allowedAudioTypes = [
        'audio/mpeg', // mp3
        'audio/wav',
        'audio/wave',
        'audio/x-wav',
        'audio/mp4', // m4a
        'audio/aac',
        'audio/ogg',
        'audio/webm'
    ];
    const allowedVideoTypes = [
        'video/mp4',
        'video/mpeg',
        'video/quicktime', // mov
        'video/x-msvideo', // avi
        'video/webm'
    ];
    const allowedTypes = [...allowedAudioTypes, ...allowedVideoTypes];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type. Only audio (mp3, wav, m4a, aac) and video (mp4, mov, avi) files are allowed.`));
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB max file size
    }
});
// Helper to get file duration (placeholder - would need actual implementation)
const getAudioDuration = async (filePath) => {
    // This is a placeholder. In production, you'd use a library like 'get-audio-duration' or 'ffprobe'
    // For now, return 0
    return 0;
};
exports.getAudioDuration = getAudioDuration;
// Helper to delete file
const deleteFile = (filePath) => {
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=upload.js.map