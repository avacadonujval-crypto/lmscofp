import express from 'express';
import { getCourses, getCourseById, createCourse, deleteCourse, uploadVideo } from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, admin, (req, res, next) => {
    upload.single('video')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer Error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err });
        }
        next();
    });
}, uploadVideo);

router.route('/').get(getCourses).post(protect, admin, createCourse);
router.route('/:id').get(getCourseById).delete(protect, admin, deleteCourse);

export default router;
