import { Course, User, VideoContent, KnowledgeMaterial } from '../models/index.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    const courses = await Course.findAll({
        include: [
            { model: User, as: 'instructor', attributes: ['name', 'email'] },
            { model: VideoContent, as: 'videos' },
            { model: KnowledgeMaterial, as: 'materials' }
        ]
    });
    const refinedCourses = courses.map(c => {
        const json = c.toJSON();
        return { ...json, _id: json.id };
    });
    res.json(refinedCourses);
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public/Protected
const getCourseById = async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [
            { model: User, as: 'instructor', attributes: ['name', 'email'] },
            { model: VideoContent, as: 'videos' },
            { model: KnowledgeMaterial, as: 'materials' }
        ]
    });

    if (course) {
        const json = course.toJSON();
        res.json({ ...json, _id: json.id });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    const { title, description, category, materials, videos, thumbnail } = req.body;

    const course = await Course.create({
        title,
        description,
        category,
        instructorId: req.user.id,
        thumbnail,
    });

    // Handle nested Video creation if provided
    if (videos && Array.isArray(videos) && videos.length > 0) {
        const videoRecords = videos.map(v => ({
            ...v,
            courseId: course.id
        }));
        await VideoContent.bulkCreate(videoRecords);
    }

    // Handle nested Material creation if provided
    if (materials && Array.isArray(materials) && materials.length > 0) {
        const materialRecords = materials.map(m => ({
            ...m,
            courseId: course.id,
            type: m.type || 'pdf'
        }));
        await KnowledgeMaterial.bulkCreate(materialRecords);
    }

    // Re-fetch to return full object with children
    const fullCourse = await Course.findByPk(course.id, {
        include: [{ model: VideoContent, as: 'videos' }, { model: KnowledgeMaterial, as: 'materials' }]
    });

    const json = fullCourse.toJSON();
    res.status(201).json({ ...json, _id: json.id });
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    if (course) {
        await course.destroy();
        res.json({ message: 'Course removed' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};

// @desc    Upload video file
// @route   POST /api/courses/upload
// @access  Private/Admin
const uploadVideo = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded or file type rejected' });
    }
    res.send(`/${req.file.path.replace(/\\/g, '/')}`);
};

export { getCourses, getCourseById, createCourse, deleteCourse, uploadVideo };
