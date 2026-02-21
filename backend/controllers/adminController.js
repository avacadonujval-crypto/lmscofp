import { User, Course, Meeting } from '../models/index.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalCourses = await Course.count();
        const totalMeetings = await Meeting.count();

        // Get new members from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newMembers = await User.count({
            where: {
                createdAt: {
                    [require('sequelize').Op.gte]: thirtyDaysAgo
                }
            }
        });

        // Get upcoming meetings (future meetings only)
        const now = new Date();
        const upcomingMeetings = await Meeting.findAll({
            where: {
                date: {
                    [require('sequelize').Op.gte]: now
                }
            },
            include: [
                { model: User, as: 'host', attributes: ['name', 'email'] },
                { model: User, as: 'members', attributes: ['id', 'name', 'email'] }
            ],
            order: [['date', 'ASC']],
            limit: 5 // Get next 5 upcoming meetings
        });

        res.json({
            totalUsers,
            totalCourses,
            totalMeetings,
            newMembers,
            upcomingMeetings: upcomingMeetings.map(m => ({
                id: m.id,
                title: m.title,
                date: m.date,
                link: m.link,
                host: m.host,
                memberCount: m.members ? m.members.length : 0
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getDashboardStats };
