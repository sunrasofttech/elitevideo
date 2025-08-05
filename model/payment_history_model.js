const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/db');
const UserModel = require('../model/user_model');

const PaymentHistoryModel = sequelize.define('PaymentHistoryModel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: UserModel,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    amount: {
        type: DataTypes.STRING,
        allowNull:true
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type:{
         type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
},
    {
        tableName: 'Payment_history',
        timestamps: true,
    });

PaymentHistoryModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

module.exports = PaymentHistoryModel;