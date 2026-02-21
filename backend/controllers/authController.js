import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
        if (user.status === 'Inactive') {
            res.status(403).json({ message: 'Your account is currently inactive. Please contact the administrator for assistance.' });
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

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const userRole = role === 'admin' ? 'admin' : 'student';

    const user = await User.create({
        name,
        email,
        password, // Hook will hash this
        role: userRole,
    });

    if (user) {
        const userData = user.toJSON();
        delete userData.password;
        res.status(201).json({
            ...userData,
            _id: userData.id,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

export { authUser, registerUser };
