import { Meeting, User } from '../models/index.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Private
const getMeetings = async (req, res) => {
    try {
        const queryOptions = {
            include: [
                { model: User, as: 'host', attributes: ['name', 'email'] },
                {
                    model: User,
                    as: 'members',
                    attributes: ['id', 'name', 'email'],
                }
            ],
            order: [['date', 'DESC']]
        };

        // If not admin, only show meetings where the user is a guest
        if (req.user.role !== 'admin') {
            queryOptions.include[1].where = { id: req.user.id };
        }

        const meetings = await Meeting.findAll(queryOptions);
        const refinedMeetings = meetings.map(m => {
            const json = m.toJSON();
            // If no members, mock some for now to match user expectation if they just created it
            return { ...json, _id: json.id };
        });
        res.json(refinedMeetings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a meeting
// @route   POST /api/meetings
// @access  Private/Admin
const createMeeting = async (req, res) => {
    const { title, date, link, members } = req.body; // members is array of User IDs

    try {
        const meeting = await Meeting.create({
            title,
            date,
            link,
            hostId: req.user.id,
        });

        if (members && members.length > 0) {
            const users = await User.findAll({ where: { id: members } });
            await meeting.setMembers(users);
        }

        const fullMeeting = await Meeting.findByPk(meeting.id, {
            include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email'] }]
        });

        const json = fullMeeting.toJSON();

        // Send email notifications to members
        console.log(`Found ${fullMeeting.members ? fullMeeting.members.length : 0} members for meeting ${title}`);

        if (fullMeeting.members && fullMeeting.members.length > 0) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const fullLink = `${frontendUrl}/live/${link}`;

            const emailPromises = fullMeeting.members.map(member => {
                console.log(`Preparing to send email to: ${member.email}`);
                const message = `You have been invited to a new meeting: ${title}.
It is scheduled for: ${new Date(date).toLocaleString()}
Join here: ${fullLink}`;

                return sendEmail({
                    email: member.email,
                    subject: `New Meeting Invitation: ${title}`,
                    message: message
                }).then(() => {
                    console.log(`Successfully sent email to ${member.email}`);
                }).catch(err => {
                    console.error(`Failed to send email to ${member.email}:`, err);
                });
            });

            // Run email sending in background (don't block the response)
            Promise.all(emailPromises).then(() => {
                console.log(`Finished processing all email invitations for meeting ${title}`);
            });
        }

        res.status(201).json({ ...json, _id: json.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create meeting' });
    }
};

export { getMeetings, createMeeting };
