import express from 'express';
import {
    authSuperAdmin,
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    resetAdminPassword
} from '../controllers/superAdminController.js';
import { protect, superadmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/login', authSuperAdmin);

// Protected super admin routes
router.get('/admins', protect, superadmin, getAdmins);
router.post('/admins', protect, superadmin, createAdmin);
router.put('/admins/:id', protect, superadmin, updateAdmin);
router.delete('/admins/:id', protect, superadmin, deleteAdmin);
router.put('/admins/:id/reset-password', protect, superadmin, resetAdminPassword);

export default router;
