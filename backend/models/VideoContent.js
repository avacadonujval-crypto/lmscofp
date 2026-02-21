import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const VideoContent = sequelize.define('VideoContent', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duration: {
        type: DataTypes.INTEGER, // in minutes
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    meetingId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Available' // or 'Processing'
    }
}, {
    timestamps: true,
});

export default VideoContent;
