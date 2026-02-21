import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        // Add _id alias for frontend compatibility if needed
        const refinedUsers = users.map(u => {
            const json = u.toJSON();
            return { ...json, _id: json.id };
        });
        res.json(refinedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, role, phone, plan, status, startDate, endDate, gender, dob, address, city, state, zip, country } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const validRoles = ['admin', 'student'];
        const userRole = validRoles.includes(role) ? role : 'student';

        const user = await User.create({
            name, email, password, role: userRole, phone, plan, status, startDate, endDate,
            gender, dob, address, city, state, zip, country
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);

        let message = 'Server Error';
        if (error.name === 'SequelizeValidationError') {
            message = error.errors.map(e => e.message).join(', ');
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            message = 'Email already exists';
        }

        res.status(400).json({ message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            await user.destroy();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user password
// @route   PUT /api/users/profile/password
// @access  Private
const updateUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.user.id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword; // Hook will hash this
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Admin Reset User Password
// @route   PUT /api/users/:id/reset-password
// @access  Private/Admin
const resetUserPassword = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            // Generate random password
            const newPassword = Math.random().toString(36).slice(-8); // Simple 8 char random string

            // Set new password (hooks will hash it)
            user.password = newPassword;
            await user.save();

            // Send real email
            const message = `Hello ${user.name},\n\nYour password for the Council Portal has been reset by the administrator.\n\nYour new password is: ${newPassword}\n\nPlease log in and change it immediately.\n\nBest regards,\nCouncil Team`;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Your Password Has Been Reset',
                    message,
                });
                res.json({ message: `Password reset. New password sent to ${user.email}` });
            } catch (emailError) {
                console.error('Email Error:', emailError);
                res.status(500).json({ message: `Password reset in DB, but email failed to send. New password is: ${newPassword}` });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            user.name = req.body.name !== undefined ? req.body.name : user.name;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
            user.dob = req.body.dob !== undefined ? req.body.dob : user.dob;
            user.address = req.body.address !== undefined ? req.body.address : user.address;
            user.city = req.body.city !== undefined ? req.body.city : user.city;
            user.state = req.body.state !== undefined ? req.body.state : user.state;
            user.zip = req.body.zip !== undefined ? req.body.zip : user.zip;
            user.country = req.body.country !== undefined ? req.body.country : user.country;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser.id,
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                gender: updatedUser.gender,
                dob: updatedUser.dob,
                address: updatedUser.address,
                city: updatedUser.city,
                state: updatedUser.state,
                zip: updatedUser.zip,
                country: updatedUser.country,
                plan: updatedUser.plan,
                status: updatedUser.status,
                startDate: updatedUser.startDate,
                endDate: updatedUser.endDate,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            user.name = req.body.name !== undefined ? req.body.name : user.name;
            user.email = req.body.email !== undefined ? req.body.email : user.email;
            user.role = req.body.role !== undefined ? req.body.role : user.role;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.plan = req.body.plan !== undefined ? req.body.plan : user.plan;
            user.status = req.body.status !== undefined ? req.body.status : user.status;
            user.startDate = req.body.startDate !== undefined ? req.body.startDate : user.startDate;
            user.endDate = req.body.endDate !== undefined ? req.body.endDate : user.endDate;
            user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
            user.dob = req.body.dob !== undefined ? req.body.dob : user.dob;
            user.address = req.body.address !== undefined ? req.body.address : user.address;
            user.city = req.body.city !== undefined ? req.body.city : user.city;
            user.state = req.body.state !== undefined ? req.body.state : user.state;
            user.zip = req.body.zip !== undefined ? req.body.zip : user.zip;
            user.country = req.body.country !== undefined ? req.body.country : user.country;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser.id,
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status,
                phone: updatedUser.phone,
                plan: updatedUser.plan,
                startDate: updatedUser.startDate,
                endDate: updatedUser.endDate,
                // Include other fields for admin view completeness
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getUsers, createUser, deleteUser, updateUserPassword, resetUserPassword, updateUserProfile, updateUser };
