import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    thumbnail: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

// Association defined in a central init file or here
Course.belongsTo(User, { as: 'instructor', foreignKey: 'instructorId' });

export default Course;
