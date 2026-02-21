import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth super admin & get token
// @route   POST /api/superadmin/login
// @access  Public
const authSuperAdmin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
        if (user.role !== 'superadmin') {
            res.status(403).json({ message: 'Not authorized as super admin' });
            return;
        }

        if (user.status === 'Inactive') {
            res.status(403).json({ message: 'Your account is currently inactive.' });
            return;
        }

        const userData = user.toJSON();
        delete userData.password;
        res.json({
            ...userData,
            _id: userData.id,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get all admins
// @route   GET /api/superadmin/admins
// @access  Private/SuperAdmin
const getAdmins = async (req, res) => {
    try {
        const admins = await User.findAll({
            where: { role: 'admin' },
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new admin
// @route   POST /api/superadmin/admins
// @access  Private/SuperAdmin
const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }

        const admin = await User.create({
            name,
            email,
            password, // Hook will hash this
            role: 'admin',
            status: 'Active'
        });

        if (admin) {
            const adminData = admin.toJSON();
            delete adminData.password;
            res.status(201).json({
                ...adminData,
                message: 'Admin created successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update admin
// @route   PUT /api/superadmin/admins/:id
// @access  Private/SuperAdmin
const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, email, status } = req.body;

    try {
        const admin = await User.findByPk(id);

        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }

        if (admin.role !== 'admin') {
            res.status(400).json({ message: 'User is not an admin' });
            return;
        }

        // Update fields
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (status) admin.status = status;

        await admin.save();

        const adminData = admin.toJSON();
        delete adminData.password;
        res.json({
            ...adminData,
            message: 'Admin updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete admin
// @route   DELETE /api/superadmin/admins/:id
// @access  Private/SuperAdmin
const deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await User.findByPk(id);

        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }

        if (admin.role !== 'admin') {
            res.status(400).json({ message: 'User is not an admin' });
            return;
        }

        await admin.destroy();
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reset admin password
// @route   PUT /api/superadmin/admins/:id/reset-password
// @access  Private/SuperAdmin
const resetAdminPassword = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await User.findByPk(id);

        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }

        if (admin.role !== 'admin') {
            res.status(400).json({ message: 'User is not an admin' });
            return;
        }

        // Generate a random password
        const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        admin.password = newPassword;
        await admin.save();

        res.json({
            message: `Password reset successfully. New password: ${newPassword}`,
            newPassword
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { authSuperAdmin, getAdmins, createAdmin, updateAdmin, deleteAdmin, resetAdminPassword };
