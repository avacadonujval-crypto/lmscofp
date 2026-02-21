import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import './models/index.js'; // Import models to init associations
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/superadmin', superAdminRoutes);

app.get('/', (req, res) => {
    res.send('LMS API is running');
});

// Database Connection & Sync
sequelize.authenticate()
    .then(() => {
        console.log('MySQL Connected...');
        // Sync models
        // Sync models
        return sequelize.sync({ alter: true }).then(() => {
            console.log('Database Synced (Groups & UserGroups created) - RESTARTED V2');
        }); // Update tables with new columns
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log('Error: ' + err);
        if (err.parent && err.parent.code === 'ER_BAD_DB_ERROR') {
            console.log('\n\x1b[31mCRITICAL ERROR: Database "lms_db" does not exist.\x1b[0m');
            console.log('Please go to \x1b[36mhttp://localhost/phpmyadmin\x1b[0m, click "New", and create a database named \x1b[33mlms_db\x1b[0m.\n');
        }
    });

export default app;
