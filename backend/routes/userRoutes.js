import express from 'express';
import { getUsers, createUser, deleteUser, updateUserPassword, resetUserPassword, updateUserProfile, updateUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateUserProfile);
router.put('/profile/password', protect, updateUserPassword);
router.put('/:id/reset-password', protect, admin, resetUserPassword);

router.route('/')
    .get(protect, admin, getUsers)
    .post(protect, admin, createUser);

router.route('/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
