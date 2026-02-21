import express from 'express';
import { getMeetings, createMeeting } from '../controllers/meetingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMeetings).post(protect, admin, createMeeting);

export default router;
