import express from 'express';
import { getGroups, createGroup, deleteGroup, updateGroup } from '../controllers/groupController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getGroups)
    .post(protect, admin, createGroup);

router.route('/:id')
    .put(protect, admin, updateGroup)
    .delete(protect, admin, deleteGroup);

export default router;
