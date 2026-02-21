import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Meeting = sequelize.define('Meeting', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE, // Stored as datetime
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

Meeting.belongsTo(User, { as: 'host', foreignKey: 'hostId' });

export default Meeting;
