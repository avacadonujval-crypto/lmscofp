import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { uploadVideo, getVideos, saveMeetingRecording } from '../controllers/videoController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.post('/upload-video', protect, admin, upload.single('video'), uploadVideo);
router.post('/save-recording', protect, admin, saveMeetingRecording);
router.get('/videos', protect, getVideos);

export default router;
