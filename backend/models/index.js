import User from './User.js';
import Course from './Course.js';
import Meeting from './Meeting.js';
import Group from './Group.js';
import VideoContent from './VideoContent.js';
import KnowledgeMaterial from './KnowledgeMaterial.js';

// User Relationships
User.hasMany(Course, { foreignKey: 'instructorId' });
User.hasMany(Meeting, { foreignKey: 'hostId' });

// Course Content Relationships
Course.hasMany(VideoContent, { as: 'videos', foreignKey: 'courseId' });
VideoContent.belongsTo(Course, { foreignKey: 'courseId' });

Course.hasMany(KnowledgeMaterial, { as: 'materials', foreignKey: 'courseId' });
KnowledgeMaterial.belongsTo(Course, { foreignKey: 'courseId' });

// Associations
Course.belongsToMany(User, { through: 'Enrollments', as: 'students', foreignKey: 'courseId' });
User.belongsToMany(Course, { through: 'Enrollments', as: 'enrolledCourses', foreignKey: 'userId' });

// Group Associations
Group.belongsToMany(User, { through: 'UserGroups', as: 'members' });
User.belongsToMany(Group, { through: 'UserGroups', as: 'groups' });

// Meeting Associations
Meeting.belongsToMany(User, { through: 'MeetingMembers', as: 'members' });
User.belongsToMany(Meeting, { through: 'MeetingMembers', as: 'invitedMeetings' });

export { User, Course, Meeting, Group, VideoContent, KnowledgeMaterial };
