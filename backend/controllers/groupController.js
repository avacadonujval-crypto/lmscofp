import { Group, User } from '../models/index.js';

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private/Admin
const getGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [{
                model: User,
                as: 'members',
                attributes: ['id', 'name', 'email'] // Fetch needed fields
            }]
        });
        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a group
// @route   POST /api/groups
// @access  Private/Admin
const createGroup = async (req, res) => {
    const { name, description, members } = req.body; // members is array of User IDs

    try {
        const group = await Group.create({
            name,
            description
        });

        if (members && members.length > 0) {
            const users = await User.findAll({ where: { id: members } });
            await group.setMembers(users);
        }

        // Return group with members for immediate UI update
        const fullGroup = await Group.findByPk(group.id, {
            include: [{ model: User, as: 'members', attributes: ['id', 'name'] }]
        });

        res.status(201).json(fullGroup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create group' });
    }
};

const updateGroup = async (req, res) => {
    const { name, description, members } = req.body;
    try {
        const group = await Group.findByPk(req.params.id);
        if (group) {
            group.name = name !== undefined ? name : group.name;
            group.description = description !== undefined ? description : group.description;
            await group.save();

            if (members !== undefined) {
                const users = await User.findAll({ where: { id: members } });
                await group.setMembers(users);
            }

            const updatedGroup = await Group.findByPk(group.id, {
                include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email'] }]
            });
            res.json(updatedGroup);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a group
// @route   DELETE /api/groups/:id
// @access  Private/Admin
const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id);
        if (group) {
            await group.destroy();
            res.json({ message: 'Group removed' });
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getGroups, createGroup, deleteGroup, updateGroup };
