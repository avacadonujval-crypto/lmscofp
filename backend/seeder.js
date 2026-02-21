import sequelize from './config/db.js';
import { User, Course, Meeting, VideoContent, KnowledgeMaterial } from './models/index.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connected.');

        // Sync database (force: true to clear data)
        await sequelize.sync({ force: true });
        console.log('Database Synced & Cleared.');

        // 1. Create Users
        // Hooks in User model will handle hashing automatically for User.create
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            phone: '+91 9876543210',
            address: 'Headquarters',
            city: 'Mysore',
            state: 'Karnataka',
            country: 'India'
        });

        const student = await User.create({
            name: 'Ujval',
            email: 'user@example.com',
            password: 'user123',
            role: 'student',
            phone: '+91 1234567890',
            gender: 'Male',
            dob: '2000-01-01',
            address: '',
            city: '',
            state: '',
            country: '',
            zip: '',
            plan: 'Premium',
            startDate: '2026-08-08',
            endDate: '2026-10-10'
        });

        console.log('Users Created.');

        // 2. Create Courses
        const course1 = await Course.create({
            title: 'Python for Beginners',
            description: 'Start your programming journey with Python. Perfect for absolute beginners.',
            category: 'Programming',
            instructorId: admin.id
        });

        await VideoContent.bulkCreate([
            { title: 'Setup & Install', url: '/uploads/videos/dummy.mp4', duration: 10, courseId: course1.id },
            { title: 'Variables in Python', url: '/uploads/videos/dummy.mp4', duration: 15, courseId: course1.id }
        ]);

        await KnowledgeMaterial.bulkCreate([
            { title: 'Python Cheat Sheet', url: 'https://docs.python.org/3/', type: 'pdf', courseId: course1.id },
            { title: 'Variable Operations', url: '#', type: 'doc', courseId: course1.id }
        ]);

        const course2 = await Course.create({
            title: 'AI Fundamentals',
            description: 'Understand the basics of Artificial Intelligence and Machine Learning.',
            category: 'Data Science',
            instructorId: admin.id
        });

        await VideoContent.bulkCreate([
            { title: 'What is AI?', url: '/uploads/videos/dummy.mp4', duration: 20, courseId: course2.id },
            { title: 'Neural Networks 101', url: '/uploads/videos/dummy.mp4', duration: 25, courseId: course2.id }
        ]);

        await KnowledgeMaterial.bulkCreate([
            { title: 'AI Whitepaper 2024', url: '#', type: 'pdf', courseId: course2.id },
            { title: 'ML Algorithms Overview', url: '#', type: 'pdf', courseId: course2.id }
        ]);

        const course3 = await Course.create({
            title: 'React Masters',
            description: 'Advanced React patterns and performance optimization.',
            category: 'Web Development',
            instructorId: admin.id
        });

        await VideoContent.create({
            title: 'Main Masterclass Video', url: '/uploads/videos/dummy.mp4', duration: 120, courseId: course3.id
        });

        await KnowledgeMaterial.create({
            title: 'Hooks Reference', url: 'https://react.dev', type: 'link', courseId: course3.id
        });

        console.log('Courses & Content Created.');

        // 3. Create Meetings
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        await Meeting.bulkCreate([
            {
                title: 'Live Q&A Session',
                date: tomorrow,
                link: 'https://meet.google.com/abc-defg-hij',
                hostId: admin.id
            },
            {
                title: 'Project Kickoff',
                date: nextWeek,
                link: 'https://zoom.us/j/123456789',
                hostId: admin.id
            }
        ]);

        console.log('Meetings Created.');

        // Enroll student in first course
        const studentInstance = await User.findByPk(student.id);
        const courseInstance = await Course.findByPk(course1.id);
        if (studentInstance && courseInstance) {
            await studentInstance.addEnrolledCourse(courseInstance);
            console.log('Student enrolled in Python for Beginners.');
        }

        console.log('Data Seeding Completed successfully.');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
