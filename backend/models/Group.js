import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Many-to-Many Relationship defined in index.js

export default Group;
