import { VideoContent, Course } from '../models/index.js';

// @desc    Upload a video
// @route   POST /api/admin/upload-video
// @access  Private/Admin
export const uploadVideo = async (req, res) => {
    console.log("Upload request received:");
    console.log("- Body:", req.body);
    console.log("- File:", req.file ? { filename: req.file.filename, size: req.file.size, mimetype: req.file.mimetype } : "NO FILE");
    try {
        const { title, courseId, duration, meetingId } = req.body;

        if (!req.file) {
            console.error("No file in request!");
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        let videoPath = req.file.path.replace(/\\/g, '/');

        // If the user wants it saved as .mp4 in the DB, we can force the record to say .mp4 
        // if the file was renamed or simply rely on the actual path.
        // For maximum compatibility in browser fetching, we should use the actual path but 
        // ensure the extension is one that browsers associate with video easily.
        const videoUrl = `/${videoPath}`;

        // Check if a recording for this meeting already exists (smart merge)
        if (meetingId) {
            const existingRecording = await VideoContent.findOne({ where: { meetingId } });
            if (existingRecording) {
                existingRecording.url = videoUrl;
                existingRecording.title = title || existingRecording.title;
                existingRecording.duration = duration || 0;
                existingRecording.courseId = courseId || existingRecording.courseId;
                existingRecording.status = 'Available';
                await existingRecording.save();
                return res.status(200).json(existingRecording);
            }
        }

        const video = await VideoContent.create({
            title: title || 'Meeting Recording',
            url: videoUrl,
            duration: duration || 0,
            courseId: courseId || null,
            meetingId: meetingId || null,
            status: 'Available'
        });

        res.status(201).json(video);
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: 'Server Error during video upload' });
    }
};

// @desc    Get all native recorded videos
// @route   GET /api/admin/videos
// @access  Private
export const getVideos = async (req, res) => {
    try {
        const videos = await VideoContent.findAll({
            include: [{ model: Course, attributes: ['title'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching videos' });
    }
};

// @desc    Save a manual recording link from a meeting
// @route   POST /api/admin/save-recording
// @access  Private/Admin
export const saveMeetingRecording = async (req, res) => {
    console.log("Save recording metadata request:", req.body);
    try {
        const { title, url, meetingId } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        // Check if a recording for this meeting already exists (robust upsert)
        if (meetingId) {
            const existingRecording = await VideoContent.findOne({ where: { meetingId } });
            if (existingRecording) {
                console.log("Existing recording found for meetingId:", meetingId);

                // If we are just saving metadata (url is null), don't change anything if it's already there
                if (!url) {
                    return res.status(200).json(existingRecording);
                }

                // If it exists and already has a real URL, don't overwrite with a pending or different one 
                // unless explicitly intended (e.g. updating an existing record)
                if (existingRecording.url && (existingRecording.url.startsWith('/') || existingRecording.url.startsWith('http'))) {
                    // Only update if the new URL is also a real one (not null during auto-save)
                    if (url && url !== existingRecording.url) {
                        existingRecording.url = url;
                        existingRecording.status = 'Available';
                        await existingRecording.save();
                    }
                    return res.status(200).json(existingRecording);
                }

                // If it was pending and now we have a URL, update it
                if (url && url !== existingRecording.url) {
                    existingRecording.url = url;
                    existingRecording.status = 'Available';
                    await existingRecording.save();
                    return res.status(200).json(existingRecording);
                }

                return res.status(200).json(existingRecording);
            }
        }

        const video = await VideoContent.create({
            title,
            url: url || null,
            meetingId: meetingId || null,
            duration: 0,
            status: url ? 'Available' : 'Pending'
        });

        res.status(201).json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error saving recording' });
    }
};
