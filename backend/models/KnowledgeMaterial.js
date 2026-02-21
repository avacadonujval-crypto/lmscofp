import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const KnowledgeMaterial = sequelize.define('KnowledgeMaterial', {
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
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING, // pdf, doc, link, etc.
        defaultValue: 'pdf'
    }
}, {
    timestamps: true,
});

export default KnowledgeMaterial;
